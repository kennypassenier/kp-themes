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

// The reach of one block's hash [fix-71, scope-137].
//
// Version 6 gave a block every family its component's modules NAME, so a
// breadcrumb — one family of its own, thirty-one in navigation's modules —
// was hashed over the side navigation's CSS. Version 7 cut that back to the
// families the markup names; version 9 goes one step finer and reads the
// rules themselves, keyed by the compound their selector ends on. Kenny,
// 2026-09-20: "Als er css veranderd mag enkel de hash veranderen van
// componenten die invloed kennen van die css."
test.describe('a block is hashed over the rules its own markup answers [scope-137]', { tag: ['@component:catalogue'] }, () => {
    test.beforeEach(async ({ context }) => {
        await useEmptyRegister(context);
    });

    const keysOf = (page, id) =>
        page.evaluate(async (blockId) => {
            const { inputLines, readCodeVersion } = await import('/catalogue/block-hash.js');
            const root = /** @type {HTMLElement} */ (document.getElementById(blockId));
            return inputLines(root, root.outerHTML, await readCodeVersion())
                .filter((line) => line.includes('||'))
                .map((line) => line.slice(0, line.lastIndexOf(': ')));
        }, id);

    test('a breadcrumb answers the breadcrumb’s rules and none of the side navigation’s', async ({ page }) => {
        await page.goto('/catalogue/navigation.html');
        await waitForJudging(page, { timeout: 60_000 });
        const keys = await keysOf(page, 'breadcrumb');
        expect(keys.some((key) => key.endsWith('||.kp-breadcrumb'))).toBe(true);
        expect(keys.some((key) => key.endsWith('||.kp-sidenav'))).toBe(false);
        // And it carries the elements it really holds, so a rule on them asks.
        for (const compound of ['||a', '||li', '||ol'])
            expect(
                keys.some((key) => key.endsWith(compound)),
                compound,
            ).toBe(true);
    });

    test('only the theme on screen is read: another theme’s register is not this block’s', async ({ page }) => {
        await page.goto('/catalogue/navigation.html');
        await waitForJudging(page, { timeout: 60_000 });
        const keys = await keysOf(page, 'breadcrumb');
        const themed = keys.filter((key) => !key.startsWith('||'));
        expect(themed.length, 'the register styles it').toBeGreaterThan(0);
        expect(
            themed.every((key) => key.startsWith('formal||')),
            `only formal: ${themed.join(', ')}`,
        ).toBe(true);
    });

    test('a block that holds a side navigation does answer its rules', async ({ page }) => {
        await page.goto('/catalogue/navigation.html');
        await waitForJudging(page, { timeout: 60_000 });
        const keys = await keysOf(page, 'sidenav-side');
        expect(keys.some((key) => key.endsWith('||.kp-sidenav'))).toBe(true);
    });
});

// A module the loader attaches by selector belongs to the blocks that ask
// for it [scope-136]. Under version 7 the digest of every navigation module sat
// in one line, so a change to js/sidenav.js still brought back all eighteen
// navigation blocks — the same over-asking as fix-71, one level down.
test.describe('a block carries the modules its own markup asks for [scope-136]', { tag: ['@component:catalogue'] }, () => {
    test.beforeEach(async ({ context }) => {
        await useEmptyRegister(context);
    });

    const linesOf = (page, id) =>
        page.evaluate(async (blockId) => {
            const { inputLines, readCodeVersion } = await import('/catalogue/block-hash.js');
            const root = /** @type {HTMLElement} */ (document.getElementById(blockId));
            return inputLines(root, root.outerHTML, await readCodeVersion());
        }, id);

    test('the side navigation block asks for js/sidenav.js and the breadcrumb does not', async ({ page }) => {
        await page.goto('/catalogue/navigation.html');
        await waitForJudging(page, { timeout: 60_000 });
        const sidenav = await linesOf(page, 'sidenav-side');
        const breadcrumb = await linesOf(page, 'breadcrumb');
        expect(sidenav.some((line) => line.startsWith('js/sidenav.js:'))).toBe(true);
        expect(breadcrumb.some((line) => line.startsWith('js/sidenav.js:'))).toBe(false);
    });

    test('the log block asks for js/log.js, and a table for js/datatable.js only where the table is one', async ({ page }) => {
        await page.goto('/catalogue/data.html');
        await waitForJudging(page, { timeout: 60_000 });
        const log = await linesOf(page, 'log');
        expect(log.some((line) => line.startsWith('js/log.js:'))).toBe(true);
        await page.goto('/catalogue/table.html');
        await waitForJudging(page, { timeout: 60_000 });
        const plain = await linesOf(page, 'plain');
        expect(plain.some((line) => line.startsWith('js/datatable.js:'))).toBe(false);
    });
});
