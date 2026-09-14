// A link to a catalogue block lands on that block [2026-09-14].
//
// Kenny: "je kan toch altijd links geven als je naar iets refereert. Vaak kan
// een anchorlink zelfs zodat het extra duidelijk is. Zie dat de catalogus dit
// ondersteunt." A judged block leaves the page, so an anchor to one used to
// point at nothing. It now stays and is scrolled to.
//
// Independent of the committed register: a first browser approves
// button--variants and button--sizes in formal and reads the hashes it
// stored; a fresh browser is served a register holding those two verdicts.
// A theme change since (scope-80 changed formal's buttons) cannot turn the
// linked block back into an open one and make the test pass or fail for a
// reason that has nothing to do with the anchor.

import { test, expect } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister, useRegister } from './helpers/empty-register.mjs';

const JUDGEMENTS = 'kp-catalogue-judgements:v3';

/** The hash this browser stored for a block in a theme. */
function storedHash(page, id, theme, engine) {
    return page.evaluate(
        ([key, block, name, eng]) => JSON.parse(localStorage.getItem(key) ?? '{}')[block]?.[name]?.[eng]?.hash,
        [JUDGEMENTS, id, theme, engine],
    );
}

for (const [page, id] of [
    ['/catalogue/button.html', 'variants'],
    ['/catalogue/index.html', 'button--variants'],
]) {
    test(
        `an anchor to a judged block shows it and scrolls to it — ${page}#${id}`,
        { tag: ['@component:catalogue'] },
        async ({ browser, browserName }) => {
            test.skip(browserName !== 'firefox', 'firefox only while building');
            test.setTimeout(180_000);
            const engine = browserName;

            // The hashes this engine reads for two blocks, in a browser of its own.
            const first = await browser.newContext();
            await useEmptyRegister(first);
            const measuring = await first.newPage();
            await measuring.goto('/catalogue/button.html');
            await measuring.evaluate(() => localStorage.setItem('theme', 'formal'));
            await measuring.reload();
            await waitForJudging(measuring);
            const hashes = {};
            for (const block of ['variants', 'sizes']) {
                const approve = measuring.locator(`#${block} [data-cat-verdict="approved"]`);
                await expect(approve).toBeEnabled();
                await approve.click();
                hashes[block] = await storedHash(measuring, `button--${block}`, 'formal', engine);
                expect(hashes[block]).toMatch(/^[0-9a-f]{64}$/);
            }
            await first.close();

            // A fresh browser, nothing judged in storage; the register holds both verdicts.
            const entry = (hash) => ({ verdict: 'approved', hash, commit: '2a32791', given: '2026-09-14' });
            const fresh = await browser.newContext();
            await useRegister(fresh, {
                'button--variants': { formal: { [engine]: entry(hashes.variants) } },
                'button--sizes': { formal: { [engine]: entry(hashes.sizes) } },
            });
            const tab = await fresh.newPage();
            await tab.goto('/catalogue/index.html');
            await tab.evaluate(() => localStorage.setItem('theme', 'formal'));
            await tab.goto(`${page}#${id}`);
            const block = tab.locator(`[id="${id}"]`);
            // While a reading runs every block is shown; only once it is done has
            // the page decided what leaves it.
            await waitForJudging(tab, { timeout: 120_000 });
            await expect(block).toHaveAttribute('data-cat-state', 'approved');
            // Other judged blocks have left the page, so the one linked to stays by choice.
            expect(await tab.locator('.cat-block[hidden]').count()).toBeGreaterThan(0);
            await expect(block).not.toHaveAttribute('hidden', '');
            await expect(block).toBeVisible();
            await expect.poll(() => block.evaluate((el) => Math.round(el.getBoundingClientRect().top)), { timeout: 10000 }).toBeLessThan(200);
            await fresh.close();
        },
    );
}
