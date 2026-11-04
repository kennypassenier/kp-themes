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

    const COOK = '/tests/fixtures/focus-keys.html';

    /** Open the cook fixture with `attrs` on the view and the focus on it. @param {import('@playwright/test').Page} page @param {Record<string, string>} attrs @param {string} [extra] */
    async function openCook(page, attrs = {}, extra = '') {
        const query = new URLSearchParams(attrs).toString();
        await page.goto(`${COOK}?${query}${extra}`);
        await page.waitForFunction(() => window.ready === true);
        await page.locator('#cook').focus();
    }

    /** The log of step changes after pressing `keys`. @param {import('@playwright/test').Page} page @param {string[]} keys */
    async function stepsAfter(page, keys) {
        await page.evaluate(() => (window.log = []));
        for (const key of keys) await page.keyboard.press(key);
        return page.evaluate(() => window.log.filter((e) => e[0] === 'step').map((e) => e[1]));
    }

    [
        ['ArrowRight', 'ArrowLeft'],
        ['PageDown', 'PageUp'],
        [' ', 'ArrowLeft'],
    ].forEach(([forward, back]) =>
        test(`the focus-steps flow goes on with ${JSON.stringify(forward)} and back with ${back} by default [keys3-1104]`, { tag: ['@component:feedback'] }, async ({ page }) => {
            await openCook(page);
            expect(await stepsAfter(page, [forward])).toEqual([1]);
            expect(await stepsAfter(page, [back])).toEqual([0]);
        }),
    );

    test('the focus-steps next and previous keys take a key spec and switch off with none [keys3-1104]', { tag: ['@component:feedback'] }, async ({ page }) => {
        await openCook(page, { 'data-kp-focus-steps-next-key': 'j', 'data-kp-focus-steps-previous-key': 'k' });
        expect(await stepsAfter(page, ['ArrowRight', 'PageDown', ' '])).toEqual([]);
        expect(await stepsAfter(page, ['j'])).toEqual([1]);
        expect(await stepsAfter(page, ['k'])).toEqual([0]);
        await openCook(page, { 'data-kp-focus-steps-next-key': 'none' });
        expect(await stepsAfter(page, ['ArrowRight', 'PageDown', ' '])).toEqual([]);
        expect(await stepsAfter(page, ['PageUp'])).toEqual([]);
    });

    /** Go to the question (step 2) and press `key`; the answer sources logged. @param {import('@playwright/test').Page} page @param {string} key */
    async function answerAfter(page, key) {
        await page.evaluate(async () => {
            const { goToStep } = await import('/js/focus-steps.js');
            goToStep(document.querySelector('#cook'), 2);
            window.log = [];
        });
        await page.locator('#cook').focus();
        await page.keyboard.press(key);
        return page.evaluate(() => window.log.filter((e) => e[0] === 'answer').map((e) => e[1]));
    }

    test('the question keys s, u and n default as before, take another key and switch off with none [keys3-1104]', { tag: ['@component:feedback'] }, async ({ page }) => {
        await openCook(page);
        expect(await answerAfter(page, 's')).toEqual(['same']);
        await openCook(page);
        expect(await answerAfter(page, 'n')).toEqual(['skip']);
        await openCook(page, { 'data-kp-focus-steps-same-yesterday-key': 'y', 'data-kp-focus-steps-skip-key': 'none' });
        expect(await answerAfter(page, 's')).toEqual([]);
        expect(await answerAfter(page, 'n')).toEqual([]);
        expect(await answerAfter(page, 'y')).toEqual(['same']);
    });

    /** The sheet's keys after the cook view registered them. @param {import('@playwright/test').Page} page */
    const listed = (page) => page.evaluate(async () => (await import('/js/shortcuts.js')).listShortcuts().map((e) => e.keys));

    test('the track keys are t and Shift T by default, take another key and switch off with none [keys3-1104]', { tag: ['@component:feedback'] }, async ({ page }) => {
        await openCook(page);
        expect(await listed(page)).toEqual(expect.arrayContaining(['t', 'Shift T', 's', 'u', 'n']));
        await openCook(page, { 'data-kp-focus-steps-track-next-key': 'Alt+J', 'data-kp-focus-steps-track-previous-key': 'none' });
        const keys = await listed(page);
        expect(keys).toContain('Alt j');
        expect(keys).not.toContain('t');
        expect(keys).not.toContain('Shift T');
    });

    test('a shortcut with where: field is listed in its own group of the sheet and the engine never fires it [keys3-1104]', { tag: ['@component:page'] }, async ({ page }) => {
        await openCook(page, {}, '&field=1');
        await page.evaluate(() => window.renderSheet());
        const groups = await page.locator('#sheet .kp-shortcuts__group-label').allTextContents();
        expect(groups).toContain('In a text field');
        const row = page.locator('#sheet section', { hasText: 'In a text field' }).locator('.kp-shortcuts__row');
        await expect(row).toContainText('Move the step up');
        await expect(row).not.toHaveClass(/--off/);
        // The default group of an ordinary key is unchanged.
        expect(await page.locator('#sheet .kp-shortcuts__group-label', { hasText: /^Shortcuts$/ }).count()).toBe(1);
        // Alt+Up on the field does nothing by itself: the field's own handler fires it.
        await page.locator('#field').focus();
        await page.evaluate(() => (window.log = []));
        await page.keyboard.press('Alt+ArrowUp');
        expect(await page.evaluate(() => window.log.length)).toBe(0);
    });

    const FIXED = '/tests/fixtures/keys-fixed.html';

    /** Open the keys-fixed fixture; `attrs` are `target=name:value` query pairs. @param {import('@playwright/test').Page} page @param {string} query */
    async function openFixed(page, query = '') {
        await page.goto(`${FIXED}${query}`);
        await page.waitForFunction(() => window.ready === true);
    }

    /** Whether the quote card was hidden by pressing `key` with the focus in it. @param {import('@playwright/test').Page} page @param {string} key */
    async function quoteHiddenBy(page, key) {
        await page.locator('#quote').evaluate((el) => {
            el.tabIndex = 0;
            el.focus();
        });
        await page.keyboard.press(key);
        return page.locator('#quote').evaluate((el) => el.hidden);
    }

    test('the quote hide key is h by default, takes another key and switches off with none [keys4-1104]', { tag: ['@component:feedback'] }, async ({ page }) => {
        await openFixed(page);
        expect(await quoteHiddenBy(page, 'h')).toBe(true);
        await openFixed(page, '?quote=data-kp-quote-hide-key:x');
        expect(await quoteHiddenBy(page, 'h')).toBe(false);
        expect(await quoteHiddenBy(page, 'x')).toBe(true);
        await openFixed(page, '?quote=data-kp-quote-hide-key:none');
        expect(await quoteHiddenBy(page, 'h')).toBe(false);
    });

    /** How many times the trace asked for a swap after `key` pressed with the focus in the trace. @param {import('@playwright/test').Page} page @param {string} key */
    async function swapsAfter(page, key) {
        await page.locator('#trace button').first().focus();
        await page.keyboard.press(key);
        return page.evaluate(() => window.log.length);
    }

    test('the trace swap key is s by default, takes another key and switches off with none [keys4-1104]', { tag: ['@component:data'] }, async ({ page }) => {
        await openFixed(page);
        expect(await swapsAfter(page, 's')).toBe(1);
        await openFixed(page, '?trace=data-kp-trace-swap-key:Alt%2BW');
        expect(await swapsAfter(page, 's')).toBe(0);
        expect(await swapsAfter(page, 'Alt+w')).toBe(1);
        await openFixed(page, '?trace=data-kp-trace-swap-key:none');
        expect(await swapsAfter(page, 's')).toBe(0);
    });

    /** Whether the sheet is open after `key` pressed away from any field, and the key caps of its first group. @param {import('@playwright/test').Page} page @param {string} key */
    async function sheetAfter(page, key) {
        await page.locator('#elsewhere').focus();
        await page.keyboard.press(key);
        const open = await page.locator('#sheet').evaluate((d) => d.open);
        if (open) await page.keyboard.press('Escape');
        await page.evaluate(() => window.renderSheet());
        const caps = await page.locator('#sheet section', { hasText: 'Anywhere' }).locator('.kp-palette__keys').allTextContents();
        return { open, caps };
    }

    test('the sheet opens on ? by default, on the key it names, on none never, and its first group lists that key [keys4-1104]', { tag: ['@component:page'] }, async ({ page }) => {
        await openFixed(page);
        expect(await sheetAfter(page, '?')).toEqual({ open: true, caps: ['?'] });
        await openFixed(page, '?sheet=data-kp-hotkey:F1');
        expect(await sheetAfter(page, '?')).toEqual({ open: false, caps: ['F1'] });
        expect((await sheetAfter(page, 'F1')).open).toBe(true);
        await openFixed(page, '?sheet=data-kp-hotkey:none');
        expect(await sheetAfter(page, '?')).toEqual({ open: false, caps: [] });
    });
});
