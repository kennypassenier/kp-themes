// A block's hash is its inputs, not its paint [scope-114].
//
// Kenny, 2026-09-16: "Een component is de som van html+css+js+browserkeuze,
// daarop moet de hash gebaseerd zijn. Hoe het rendered kan mij geen fucking
// kloten schelen … Als ik iets goedkeur op 125% dan is het voor alle zoom
// levels goedgekeurd."
//
// Red first, by construction: under version 4 the same block read three
// hashes on one page (at rest, with a value typed, with a control focused),
// and two more at another zoom — which is why the same blocks came back in
// every theme, round after round.
import { expect, test } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

test.describe.configure({ timeout: 180_000 });

const hashOf = (page, id) =>
    page.evaluate(async (blockId) => {
        const { readBlocks } = await import('/catalogue/block-hash.js');
        const root = /** @type {HTMLElement} */ (document.getElementById(blockId));
        const [read] = await readBlocks([{ root, source: root.outerHTML }]);
        return read.hash;
    }, id);

test.describe('the hash follows the inputs [scope-114]', { tag: ['@component:catalogue'] }, () => {
    test.beforeEach(async ({ context }) => {
        await useEmptyRegister(context);
    });

    test('the same block reads the same at two window sizes, typed into and focused', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto('/catalogue/field.html');
        await waitForJudging(page, { timeout: 60_000 });
        const clean = await hashOf(page, 'text');

        const first = page.locator('#text input').first();
        await first.fill('Kenny');
        expect(await hashOf(page, 'text'), 'a typed value').toBe(clean);
        await first.focus();
        expect(await hashOf(page, 'text'), 'a focused control').toBe(clean);

        await page.setViewportSize({ width: 900, height: 1200 });
        await page.waitForTimeout(500);
        expect(await hashOf(page, 'text'), 'another window').toBe(clean);
    });

    test('a block reads the same on its own page and on the review page', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto('/catalogue/field.html');
        await waitForJudging(page, { timeout: 60_000 });
        const own = await page.evaluate(async () => {
            const { readBlocks } = await import('/catalogue/block-hash.js');
            const raw = await (await fetch('/catalogue/field.html')).text();
            const doc = new DOMParser().parseFromString(raw, 'text/html');
            const root = /** @type {HTMLElement} */ (document.getElementById('text'));
            const source = doc.getElementById('text').outerHTML;
            const [read] = await readBlocks([{ root, source }]);
            return read.hash;
        });

        await page.goto('/catalogue/index.html');
        await waitForJudging(page, { timeout: 120_000 });
        const review = await page.evaluate(async () => {
            const { COMPONENT_PAGES } = await import('/catalogue/pages.js');
            const { readPage } = await import('/catalogue/review.js');
            const { readBlocks } = await import('/catalogue/block-hash.js');
            const pages = await Promise.all(COMPONENT_PAGES.map(readPage));
            const sources = new Map(pages.flatMap((one) => one.blocks.map((block) => [block.id, block.source])));
            const root = /** @type {HTMLElement} */ (document.getElementById('field--text'));
            const [read] = await readBlocks([{ root, source: sources.get('field--text') }]);
            return read.hash;
        });
        expect(review).toBe(own);
    });

    test('a theme keeps its own digest: another theme reads differently', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto('/catalogue/field.html');
        await waitForJudging(page, { timeout: 60_000 });
        const formal = await hashOf(page, 'text');
        await page.evaluate(() => import('/js/theme-core.js').then((m) => m.applyTheme('dark')));
        await waitForJudging(page, { timeout: 60_000 });
        expect(await hashOf(page, 'text')).not.toBe(formal);
    });
});
