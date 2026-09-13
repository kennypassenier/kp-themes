// The review tooling: one prompt across every page, verdicts and notes in
// the compare columns under the review page's keys, the same block hash in
// both places, and compare columns that keep their own themes (Kenny,
// 2026-09-13).
//
// Red run first, on c3d1cd4 in firefox, before the change:
//   - "same hash": the compare column had no Approve button to press;
//     by construction the old hash (every element of the block, headings
//     and stage container included) could not match a column that lays a
//     block out as separate rows;
//   - "top theme": both columns followed the top picker to nostromo;
//   - "one prompt": the third page's prompt held only its own page;
//   - "compare verdict": no verdict could be made in a column.
//   - the component page half of "same hash" was added with Kenny's second
//     request of the day; the old component pages had no verdicts at all.
//
// Firefox only while building; the review page gathers every component page
// and measures every block, so these tests carry a long timeout.

import { expect, test } from '@playwright/test';

test.describe.configure({ timeout: 180_000 });

const JUDGEMENTS = 'kp-catalogue-judgements:v2';
const FEEDBACK = 'kp-catalogue-feedback:v1';

/** @param {import('@playwright/test').Page} page */
async function setTheme(page, theme) {
    await page.evaluate((name) => import('/js/theme-core.js').then((m) => m.applyTheme(name)), theme);
}

/** The review page, composed and measured in the theme on screen. */
async function openReview(page) {
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.goto('/catalogue/index.html');
    await expect(page.locator('#button--variants [data-cat-approval-state]')).not.toContainText('Checking', { timeout: 120_000 });
}

/** Approve a block on the review page in the theme on screen; returns the stored hash. */
async function approveOnReview(page, id, theme) {
    await setTheme(page, theme);
    const section = page.locator(`[id="${id}"]`);
    // Unhide everything, so an already judged block is still pressable.
    await page.locator('[data-cat-show-judged]').check();
    await expect(section.locator('[data-cat-approval-state]')).toContainText(` · ${theme === 'formal' ? 'Formal' : 'Cyberpunk'}`);
    const approve = section.locator('[data-cat-verdict="approved"]');
    await expect(approve).toBeEnabled({ timeout: 60_000 });
    await approve.click();
    return page.evaluate(([key, block, name]) => JSON.parse(localStorage.getItem(key) ?? '{}')[block]?.[name]?.hash, [JUDGEMENTS, id, theme]);
}

/** @param {import('@playwright/test').Page} page */
async function openCompare(page, component, a = 'formal', b = 'cyberpunk') {
    // Wide enough that a column's data table stays a table: below a 40rem
    // container it becomes cards (`@container kp-table`), which is a different
    // look and rightly a different hash — measured 2026-09-13 at 1600 px, where
    // each column's stage was about 580 px wide.
    await page.setViewportSize({ width: 1920, height: 1000 });
    await page.goto(`/catalogue/compare.html?a=${a}&b=${b}&component=${component}`);
    const frames = page.locator('iframe.cat-compare__frame');
    await expect(frames).toHaveCount(2);
    return { a: page.frameLocator('iframe.cat-compare__frame >> nth=0'), b: page.frameLocator('iframe.cat-compare__frame >> nth=1') };
}

test('the same block in the same theme hashes the same on the review page, its component page and in a compare column', async ({ browser }) => {
    const blocks = [
        ['button', 'button--variants'],
        ['table', 'table--datatable'],
    ];
    const review = await browser.newContext();
    const reviewPage = await review.newPage();
    await openReview(reviewPage);
    const expected = {};
    for (const [, id] of blocks) {
        for (const theme of ['formal', 'cyberpunk']) expected[`${id}|${theme}`] = await approveOnReview(reviewPage, id, theme);
    }
    await review.close();
    for (const value of Object.values(expected)) expect(value).toMatch(/^[0-9a-f]{64}$/);

    // A fresh browser: nothing judged, so the column measures on its own.
    const compare = await browser.newContext();
    const page = await compare.newPage();
    for (const [component, id] of blocks) {
        const columns = await openCompare(page, component);
        for (const [side, theme] of [
            ['a', 'formal'],
            ['b', 'cyberpunk'],
        ]) {
            const approve = columns[side].locator(`[data-cat-block="${id}"] [data-cat-verdict="approved"]`);
            await expect(approve).toBeEnabled({ timeout: 60_000 });
            await approve.click();
        }
        const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), JUDGEMENTS);
        expect.soft(stored[id]?.formal?.hash, `${id} in formal`).toBe(expected[`${id}|formal`]);
        expect.soft(stored[id]?.cyberpunk?.hash, `${id} in cyberpunk`).toBe(expected[`${id}|cyberpunk`]);
    }
    await compare.close();

    // And on the component page itself, a third fresh browser.
    const own = await browser.newContext();
    const ownPage = await own.newPage();
    await ownPage.setViewportSize({ width: 1400, height: 900 });
    for (const [component, id] of blocks) {
        await ownPage.goto(`/catalogue/${component}.html`);
        const block = id.slice(component.length + 2);
        for (const theme of ['formal', 'cyberpunk']) {
            await setTheme(ownPage, theme);
            const panel = ownPage.locator(`#${block} .cat-judge`);
            await expect(panel.locator('[data-cat-approval-state]')).toContainText(
                `Not yet judged · ${theme === 'formal' ? 'Formal' : 'Cyberpunk'}`,
                {
                    timeout: 60_000,
                },
            );
            await panel.locator('[data-cat-verdict="approved"]').click();
            await ownPage.locator('[data-cat-show-judged]').check();
        }
        const stored = await ownPage.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), JUDGEMENTS);
        expect.soft(stored[id]?.formal?.hash, `${id} in formal on its own page`).toBe(expected[`${id}|formal`]);
        expect.soft(stored[id]?.cyberpunk?.hash, `${id} in cyberpunk on its own page`).toBe(expected[`${id}|cyberpunk`]);
    }
    await own.close();
});

test('changing the top theme on the compare page leaves both columns in their own themes', async ({ page }) => {
    await openCompare(page, 'button');
    const frames = page.locator('iframe.cat-compare__frame');
    const themeOf = (i) => frames.nth(i).evaluate((f) => f.contentDocument?.documentElement.dataset.theme);
    await expect.poll(() => themeOf(0)).toBe('formal');
    await expect.poll(() => themeOf(1)).toBe('cyberpunk');
    await page.locator('.cat-bar__theme button[popovertarget]').click();
    await page.locator('.cat-bar__theme [data-kp-theme="nostromo"]').click();
    await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe('nostromo');
    await page.waitForTimeout(500);
    expect(await themeOf(0)).toBe('formal');
    expect(await themeOf(1)).toBe('cyberpunk');
});

test('a note on one page and a verdict on the review page share one prompt on a third page, and Clear prompt empties it', async ({ page }) => {
    page.on('dialog', (dialog) => dialog.accept());
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.goto('/catalogue/button.html');
    const note = 'the ghost button needs a visible edge';
    await page.locator('#cat-feedback-variants').fill(note);

    await openReview(page);
    await approveOnReview(page, 'switch--states', 'formal');

    await page.goto('/research/grotesk-hover/demo.html');
    const top = page.locator('[data-cat-prompt-bar]');
    await expect(top).toBeVisible();
    // A component page's note lives under the review page's key, so both are one page.
    await expect(top.locator('[data-cat-prompt-count]')).toContainText('2 new item(s) for the prompt, from 1 page(s)');
    await top.locator('[data-cat-prompt-show]').click();
    const text = top.locator('[data-cat-prompt]');
    await expect(text).toContainText(note);
    await expect(text).toContainText('Buttons › Variants (#button--variants)');
    await expect(text).toContainText('(catalogue/index.html)');
    await expect(text).toContainText('Approved (1): Switch › States');
    // The same prompt at the foot of the page.
    await expect(page.locator('.cat-feedback [data-cat-prompt]')).toHaveText((await text.textContent()) ?? '');

    await top.locator('[data-cat-prompt-clear]').click();
    await expect(top.locator('[data-cat-prompt-count]')).toContainText('Nothing new');
    await expect(text).not.toContainText(note);
    expect(await page.evaluate((key) => localStorage.getItem(key), FEEDBACK)).toBe('{}');
    // The verdict stays; only its place in a prompt is used up.
    const judgements = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), JUDGEMENTS);
    expect(Object.keys(judgements).length).toBe(1);
    await page.locator('.cat-feedback [data-cat-include-copied]').check();
    await expect(page.locator('.cat-feedback [data-cat-prompt]')).toContainText('Approved (1)');
});

test('a verdict made in a compare column shows as that verdict on the review page', async ({ page }) => {
    const columns = await openCompare(page, 'button', 'formal', 'cyberpunk');
    const reject = columns.b.locator('[data-cat-block="button--variants"] [data-cat-verdict="rejected"]');
    await expect(reject).toBeEnabled({ timeout: 60_000 });
    await reject.click();
    await expect(columns.b.locator('[data-cat-block="button--variants"] [data-cat-approval-state]')).toHaveText('Not approved · Cyberpunk');
    const note = columns.a.locator('[data-cat-block="button--variants"] textarea');
    await note.fill('formal variants: fine');

    await page.evaluate(() => localStorage.setItem('theme', 'cyberpunk'));
    await openReview(page);
    await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe('cyberpunk');
    await expect(page.locator('#button--variants')).toHaveAttribute('data-cat-state', 'rejected', { timeout: 60_000 });
    await page.locator('[data-cat-show-judged]').check();
    await expect(page.locator('#button--variants [data-cat-approval-state]')).toHaveText('Not approved · Cyberpunk');
    // The note from the formal column is the review page's note for that block in formal.
    await setTheme(page, 'formal');
    await expect(page.locator('[id="cat-feedback-button--variants"]')).toHaveValue('formal variants: fine');
});

test('a note stored under a component page moves to the review page key, and a note already there is kept', async ({ page }) => {
    await page.goto('/catalogue/switch.html');
    await page.evaluate((key) => {
        localStorage.setItem(
            key,
            JSON.stringify({
                'catalogue/button.html': { variants: { formal: 'old page note' }, sizes: { formal: 'second' } },
                'catalogue/index.html': { 'button--variants': { formal: 'review page note' } },
            }),
        );
    }, FEEDBACK);
    await page.goto('/catalogue/button.html');
    await expect(page.locator('#cat-feedback-sizes')).toHaveValue('second');
    // Neither note carries a time, so neither is thrown away.
    await expect(page.locator('#cat-feedback-variants')).toHaveValue('review page note\nold page note');
    const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '{}'), FEEDBACK);
    expect(Object.keys(stored)).toEqual(['catalogue/index.html']);
    expect(stored['catalogue/index.html']['button--sizes'].formal).toBe('second');
});
