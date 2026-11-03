// Shortcuts are options with a default, a different key and `none` [keys-1103, keys2-1103]: the Markdown editor's bold key, a
// three-way chip group's include key, the palette hotkey and the toolbar search key, read through js/key-spec.js. The add row's key is in add-row-kit1-1103.spec.mjs.

import { expect, test } from '@playwright/test';

const FIXTURE = '/tests/fixtures/keys.html';

/** Open the fixture with `attrs` on `#editor` and `#tri`. @param {import('@playwright/test').Page} page @param {Record<string, string>} editor @param {Record<string, string>} tri */
async function open(page, editor = {}, tri = {}) {
    await page.goto(FIXTURE);
    await page.waitForSelector('.kp-md-editor__toolbar');
    await page.evaluate(
        ([e, t]) => {
            for (const [k, v] of Object.entries(e)) document.querySelector('#editor').setAttribute(k, v);
            for (const [k, v] of Object.entries(t)) document.querySelector('#tri').setAttribute(k, v);
        },
        [editor, tri],
    );
}

/** The text after `press` with "word" selected. @param {import('@playwright/test').Page} page @param {string} press */
async function afterBold(page, press) {
    const text = page.locator('#text');
    await text.focus();
    await text.evaluate((el) => el.select());
    await page.keyboard.press(press);
    return text.inputValue();
}

/** The chip's state after pressing `key` on it. @param {import('@playwright/test').Page} page @param {string} key */
async function triAfter(page, key) {
    const chip = page.locator('[data-value="rice"]');
    await chip.focus();
    await page.keyboard.press(key);
    return chip.getAttribute('data-kp-segmented-tri');
}

test.describe('shortcuts are options [keys-1103]', () => {
    test('the editor bold key defaults to Mod+B, takes another key and switches off with none', { tag: ['@component:field'] }, async ({ page }) => {
        await open(page);
        expect(await afterBold(page, 'Control+b')).toBe('**word**');
        await open(page, { 'data-kp-md-bold-key': 'Alt+J' });
        expect(await afterBold(page, 'Control+b')).toBe('word');
        expect(await afterBold(page, 'Alt+j')).toBe('**word**');
        await open(page, { 'data-kp-md-bold-key': 'none' });
        expect(await afterBold(page, 'Control+b')).toBe('word');
    });

    test('a three-way chip includes on + by default, on the key the group names, and on none never', { tag: ['@component:field'] }, async ({ page }) => {
        await open(page);
        expect(await triAfter(page, '+')).toBe('include');
        await open(page, {}, { 'data-kp-segmented-include-key': 'i' });
        expect(await triAfter(page, '+')).toBeNull();
        expect(await triAfter(page, 'i')).toBe('include');
        await open(page, {}, { 'data-kp-segmented-include-key': 'none' });
        expect(await triAfter(page, '+')).toBeNull();
    });

    /** Open the fixture with `query` and report whether the palette is open after `press`. @param {import('@playwright/test').Page} page @param {string} query @param {string} press */
    async function paletteOpensOn(page, query, press) {
        await page.goto(`${FIXTURE}${query}`);
        await page.waitForFunction(() => window.ready === true);
        await page.locator('#elsewhere').focus();
        await page.keyboard.press(press);
        const open = await page.locator('#pal').evaluate((d) => d.open);
        if (open) await page.keyboard.press('Escape');
        return open;
    }

    test('the palette hotkey defaults to Mod+K, takes a key spec or the older letter and switches off with none', { tag: ['@component:page'] }, async ({ page }) => {
        expect(await paletteOpensOn(page, '', 'Control+k')).toBe(true);
        expect(await paletteOpensOn(page, '', 'Control+j')).toBe(false);
        expect(await paletteOpensOn(page, '?hotkey=Mod%2BJ', 'Control+j')).toBe(true);
        expect(await paletteOpensOn(page, '?hotkey=Mod%2BJ', 'Control+k')).toBe(false);
        // The older spelling, one letter, still means Mod and that letter.
        expect(await paletteOpensOn(page, '?hotkey=j', 'Control+j')).toBe(true);
        expect(await paletteOpensOn(page, '?hotkey=none', 'Control+k')).toBe(false);
    });

    /** Open the fixture with `query` and report whether the toolbar search has the focus after `press`. @param {import('@playwright/test').Page} page @param {string} query @param {string} press */
    async function searchFocusedOn(page, query, press) {
        await page.goto(`${FIXTURE}${query}`);
        await page.waitForFunction(() => window.ready === true);
        await page.locator('#elsewhere').focus();
        await page.keyboard.press(press);
        return page.locator('#find').evaluate((el) => el === document.activeElement);
    }

    test('the toolbar search key is off by default, takes a plain key or a key spec and switches off with none', { tag: ['@component:data'] }, async ({ page }) => {
        expect(await searchFocusedOn(page, '', '/')).toBe(false);
        expect(await searchFocusedOn(page, '?bar=/', '/')).toBe(true);
        expect(await searchFocusedOn(page, '?bar=Alt%2BS', 'Alt+s')).toBe(true);
        expect(await searchFocusedOn(page, '?bar=Alt%2BS', '/')).toBe(false);
        expect(await searchFocusedOn(page, '?bar=none', '/')).toBe(false);
    });
});
