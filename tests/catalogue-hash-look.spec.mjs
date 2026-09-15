// The block hash does not read a block's Look-at text (scope-95, hash
// version 3). A corrected sentence about pastel in `page-effects#dividers`
// brought the block back in all 22 themes, because version 2 took the markup
// line over the whole section as written. Version 3 reads the markup without
// the reading aids and headings; the stage and everything in it still count.
// A verdict this browser stored under version 2 carries over where the block
// did not change.
//
// Red run first, on e6e1237a in firefox, before the change: the hash with a
// changed Look-at text differed from the hash as written, and the stored
// version-2 verdict stayed at `v: 2`.

import { expect, test } from '@playwright/test';
import { useEmptyRegister } from './helpers/empty-register.mjs';
import { waitForJudging } from './helpers/catalogue.mjs';

test.describe.configure({ timeout: 120_000 });

const JUDGEMENTS = 'kp-catalogue-judgements:v3';

test.beforeEach(async ({ context }) => {
    await useEmptyRegister(context);
    await context.addInitScript(() => localStorage.setItem('theme', 'formal'));
});

/** Read `#states` of the switch page with the source as written and with variants of it. */
async function readVariants(page) {
    return page.evaluate(async () => {
        const { readBlocks } = await import('/catalogue/block-hash.js');
        const raw = new DOMParser().parseFromString(await (await fetch(location.href)).text(), 'text/html');
        const written = raw.getElementById('states');
        const variant = (/** @type {(block: Element) => void} */ change) => {
            const copy = /** @type {Element} */ (written.cloneNode(true));
            change(copy);
            return copy.outerHTML;
        };
        const sources = {
            written: written.outerHTML,
            look: variant((block) => {
                block.querySelector('.cat-look').innerHTML = '<b>Look at:</b> a sentence corrected for one theme only.';
            }),
            heading: variant((block) => {
                block.querySelector(':scope > h2').textContent = 'States, renamed';
            }),
            stage: variant((block) => {
                block.querySelector('.cat-stage .kp-switch__input').setAttribute('disabled', '');
            }),
            stageStyle: variant((block) => {
                block.querySelector('.cat-stage').setAttribute('style', 'flex-direction: row');
            }),
        };
        const root = document.getElementById('states');
        const names = Object.keys(sources);
        const read = await readBlocks(names.map((name) => ({ root, source: sources[name] })));
        return Object.fromEntries(names.map((name, i) => [name, read[i]]));
    });
}

test(
    "changing only a block's Look-at text or heading keeps its hash; changing its stage markup changes it [scope-95]",
    { tag: ['@component:catalogue'] },
    async ({ page, browserName }) => {
        await page.goto('/catalogue/switch.html');
        await waitForJudging(page);
        const read = await readVariants(page);
        expect(read.look.hash).toBe(read.written.hash);
        expect(read.heading.hash).toBe(read.written.hash);
        expect(read.stage.hash).not.toBe(read.written.hash);
        expect(read.stageStyle.hash).not.toBe(read.written.hash);
        // Version 2, still returned as `previous`, read the Look-at text.
        expect(read.look.previous).not.toBe(read.written.previous);
        // The page itself stores what readBlocks reads.
        await page.locator('#states [data-cat-verdict="approved"]').click();
        const stored = await page.evaluate(
            ([key, engine]) => JSON.parse(localStorage.getItem(key) ?? '{}')['switch--states']?.formal?.[engine],
            [JUDGEMENTS, browserName],
        );
        expect(stored).toMatchObject({ hash: read.written.hash, v: 3 });
    },
);

test(
    'a verdict stored under hash version 2 carries over to version 3 where the block did not change, and not where it did [scope-95]',
    { tag: ['@component:catalogue'] },
    async ({ page, browserName }) => {
        await page.goto('/catalogue/switch.html');
        await waitForJudging(page);
        const read = await readVariants(page);
        const at = Date.parse('2026-09-15T12:00:00Z');
        await page.evaluate(
            ([key, engine, previous, other, time]) => {
                localStorage.setItem(
                    key,
                    JSON.stringify({
                        // Judged as it stands: carried over.
                        'switch--states': { formal: { [engine]: { verdict: 'rejected', hash: previous, v: 2, at: time } } },
                        // Judged on another look: left at version 2.
                        'switch--invalid': { formal: { [engine]: { verdict: 'approved', hash: other, v: 2, at: time } } },
                    }),
                );
            },
            [JUDGEMENTS, browserName, read.written.previous, read.stage.previous, at],
        );
        await page.reload();
        await waitForJudging(page);
        const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), JUDGEMENTS);
        expect(stored['switch--states'].formal[browserName]).toEqual({ verdict: 'rejected', hash: read.written.hash, v: 3, at });
        expect(stored['switch--invalid'].formal[browserName]).toEqual({ verdict: 'approved', hash: read.stage.previous, v: 2, at });
        await expect(page.locator('#states')).toHaveAttribute('data-cat-state', 'rejected');
    },
);
