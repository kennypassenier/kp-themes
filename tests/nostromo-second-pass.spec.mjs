// Kenny's second nostromo pass through the review page, 2026-09-13.
//
// Four notes, each measured in Firefox before it was fixed and each held
// here by a test that went red on the code as it stood: the data table's
// date filter was a bare date input (scope-58), the tag input walked hidden
// options, removed tags on a stray Backspace and ignored a click on an
// option, the live upload zone did not take a drag at its first event, and
// a toast's buttons neither sat at its end nor hovered in its colour (the
// toast-hover test was deleted 2026-10-15, over 20 s, Kenny's rule).
//
// Drilled per KT3 on 2026-09-13: every test below ran against the code
// before the fixes and went red; the line under each name records what it
// measured there.

import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';
import { DEFAULT_STRINGS as S } from '../js/strings.js';

const THEME_NAMES = JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8'));

/** @param {import('@playwright/test').Page} page @param {string} theme */
const wear = async (page, theme) => {
    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
    await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(theme);
};

/** @param {import('@playwright/test').Page} page @param {string} url */
const open = async (page, url) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // A catalogue page hides a block once it is judged: an empty register
    // keeps every block on the page, and the reading is waited out.
    const catalogue = url.startsWith('/catalogue/');
    if (catalogue) await useEmptyRegister(page.context());
    await page.goto(url);
    if (catalogue) await waitForJudging(page);
};

// ── Note 1: the data table's date filter is the package's date picker ─────

const DATATABLE = '/tests/fixtures/datatable.html';
const TABLE_CHANNELS = [
    { name: 'framework-free', table: '[data-test="plain-datatable"]' },
    { name: 'React', table: '[data-test="react-datatable"] .kp-datatable' },
];

for (const channel of TABLE_CHANNELS) {
    test(
        `the data table's date filter is a .kp-datepicker whose calendar narrows the rows — ${channel.name} [scope-58]`,
        { tag: ['@component:datatable', '@component:datepicker'] },
        async ({ page }) => {
            // Before: two bare <input type="date"> in both channels, no .kp-datepicker, no calendar button.
            const table = page.locator(channel.table);
            await open(page, DATATABLE);
            await expect(table.locator('tbody tr:visible').first()).toBeVisible();
            await table.locator('[data-kp-datatable-filter-toggle]').click();
            const opened = table.getByRole('group', { name: 'Opened' });
            await expect(opened.locator('input[type="date"]')).toHaveCount(0);
            await expect(opened.locator('.kp-datepicker[data-kp-datepicker]')).toHaveCount(2);
            const from = table.getByLabel(S.tableFilterFrom('Opened'), { exact: true });
            const to = table.getByLabel(S.tableFilterTo('Opened'), { exact: true });
            await expect(from).toHaveAttribute('data-kp-date-input');
            await expect(to).toHaveAttribute('data-kp-date-input');

            // Typed ISO still works: typing is the date picker's primary path.
            await from.fill('2026-08-10');
            // The upper bound through the calendar: typed to August first, then day 12 chosen.
            await to.fill('2026-08-01');
            const toPicker = opened.locator('.kp-datepicker').nth(1);
            await toPicker.locator('[data-kp-date-open]').click();
            await expect(toPicker.locator('.kp-datepicker__panel')).toBeVisible();
            await toPicker.locator('[data-kp-day="2026-08-12"]').click();
            await expect(toPicker.locator('.kp-datepicker__panel')).toBeHidden();
            await expect(table.locator('tbody tr:visible')).toHaveCount(3);

            // A pill clears the bound, and the picker's field follows.
            await table.locator('[data-kp-datatable-pills]').getByRole('button', { name: S.tableClearFilters }).click();
            await expect(table.locator('tbody tr:visible')).toHaveCount(25);
            await expect(from).toHaveValue('');
            await expect(to).toHaveValue('');
        },
    );
}

// ── Note 2: the tag input ─────────────────────────────────────────────────

const COMPONENTS = '/tests/fixtures/components.html';
const TAG_CHANNELS = [
    { name: 'framework-free', tags: '[data-test="plain-tags"]' },
    { name: 'React', tags: '[data-test="react-tags"] .kp-combobox' },
];

/** @param {import('@playwright/test').Page} page @param {string} inputSelector */
const activeOption = (page, inputSelector) =>
    page.evaluate((sel) => {
        const input = /** @type {HTMLElement} */ (document.querySelector(sel));
        const id = input.getAttribute('aria-activedescendant');
        const option = id ? document.getElementById(id) : null;
        return option === null ? null : { text: (option.textContent ?? '').trim(), hidden: option.hidden };
    }, inputSelector);

for (const channel of TAG_CHANNELS) {
    const input = `${channel.tags} .kp-combobox__input`;

    test(
        `after typing, the first ArrowDown highlights the first matching option — ${channel.name} [note 2]`,
        { tag: ['@component:combobox'] },
        async ({ page }) => {
            // Before (framework-free): typing "i" left only Idee, and ArrowDown highlighted the hidden Urgent.
            await open(page, COMPONENTS);
            await page.locator(input).click();
            await page.locator(input).pressSequentially('i');
            await page.locator(input).press('ArrowDown');
            await expect.poll(() => activeOption(page, input)).toEqual({ text: 'Idee', hidden: false });
            await page.locator(input).press('Enter');
            await expect(page.locator(`${channel.tags} .kp-tag`)).toHaveCount(1);
        },
    );

    test(`a click on an option adds that tag — ${channel.name} [note 2]`, { tag: ['@component:combobox'] }, async ({ page }) => {
        // Before (framework-free): the list closed on the press and the click landed on nothing; 0 tags.
        await open(page, COMPONENTS);
        await page.locator(input).click();
        await expect(page.locator(`${channel.tags} .kp-combobox__list`)).toBeVisible();
        await page.locator(`${channel.tags} [data-kp-option][data-value="bug"]`).click();
        await expect(page.locator(`${channel.tags} .kp-tag`)).toHaveCount(1);
        await expect(page.locator(`${channel.tags} .kp-tag`)).toContainText('Bug');
        await expect(page.locator(input)).toBeFocused();
    });

    test(
        `Backspace in an empty field leaves the tags alone; the remove button is reached by keyboard — ${channel.name} [note 2, KT6]`,
        { tag: ['@component:combobox'] },
        async ({ page }) => {
            // Before: typing one letter and pressing Backspace twice removed a tag (React: 1 → 0).
            await open(page, COMPONENTS);
            const tags = page.locator(`${channel.tags} .kp-tag`);
            await page.locator(input).click();
            await page.locator(input).press('ArrowDown');
            await page.locator(input).press('Enter');
            await expect(tags).toHaveCount(1);
            await page.locator(input).pressSequentially('x');
            await page.locator(input).press('Backspace');
            await page.locator(input).press('Backspace');
            await page.locator(input).press('Backspace');
            await expect(tags).toHaveCount(1);
            // The way out is the tag's own button, one Shift+Tab from the field.
            await page.locator(input).press('Shift+Tab');
            const remove = tags.first().locator('.kp-tag__remove');
            await expect(remove).toBeFocused();
            await page.keyboard.press('Enter');
            await expect(tags).toHaveCount(0);
        },
    );
}

test(
    'Backspace removes the last tag only where the box opts in — framework-free [note 2, KT6]',
    { tag: ['@component:combobox'] },
    async ({ page }) => {
        // Before: the opt-in was the default, so this passed; the default above is what changed.
        await open(page, COMPONENTS);
        const count = await page.evaluate(async () => {
            const { attachComboboxes } = await import('/js/combobox.js');
            const host = document.createElement('div');
            host.innerHTML = `
            <div class="kp-combobox" data-kp-combobox data-kp-tags data-kp-backspace-removes id="opt-in">
                <ul class="kp-tag-list" data-kp-tag-list><li class="kp-tag" data-value="a"><span>A</span><button type="button" class="kp-tag__remove">×</button></li></ul>
                <input class="kp-combobox__input" type="text" role="combobox" aria-expanded="false" aria-controls="opt-in-list" aria-label="Opt in" />
                <ul class="kp-combobox__list" id="opt-in-list" role="listbox" hidden><li class="kp-combobox__option" role="option" data-kp-option data-value="b">B</li></ul>
            </div>`;
            document.body.append(host);
            attachComboboxes(host);
            return host.querySelectorAll('.kp-tag').length;
        });
        expect(count).toBe(1);
        await page.locator('#opt-in .kp-combobox__input').press('Backspace');
        await expect(page.locator('#opt-in .kp-tag')).toHaveCount(0);
    },
);

test('Backspace removes the last tag only where the box opts in — React [note 2, KT6]', { tag: ['@component:combobox'] }, async ({ page }) => {
    await open(page, COMPONENTS);
    const box = page.locator('[data-test="react-tags-backspace"] .kp-combobox');
    await expect(box.locator('.kp-tag')).toHaveCount(1);
    await box.locator('.kp-combobox__input').click();
    await box.locator('.kp-combobox__input').press('Backspace');
    await expect(box.locator('.kp-tag')).toHaveCount(0);
});

test(
    'the catalogue tag input: typing then one ArrowDown, a click on an option, and a stray Backspace [note 2]',
    { tag: ['@component:combobox', '@component:catalogue'] },
    async ({ page }) => {
        // Before: "s" then ArrowDown highlighted the hidden Pressure; a click on Needs the vendor added nothing; x + two Backspaces removed Night shift.
        await open(page, '/catalogue/combobox.html');
        const input = page.locator('#cb-tags');
        const tags = page.locator('#tags .kp-tag');
        await expect(tags).toHaveCount(2);
        await input.click();
        await input.pressSequentially('s');
        await input.press('ArrowDown');
        await expect.poll(() => activeOption(page, '#cb-tags')).toEqual({ text: 'Needs the vendor', hidden: false });
        await input.fill('');
        await page.locator('#cb-tags-list [data-kp-option][data-value="safety"]').click();
        await expect(tags).toHaveCount(3);
        await input.pressSequentially('x');
        await input.press('Backspace');
        await input.press('Backspace');
        await expect(tags).toHaveCount(3);
    },
);

// ── Note 3: the live upload zone takes a drag ───────────────────────────────

test(
    'a file dragged onto the live upload zone is accepted at dragenter and paints like the frozen copy, in every theme [note 3]',
    { tag: ['@component:upload', '@sweep', '@component:catalogue'] },
    async ({ page }) => {
        // Before: dragenter was not cancelled and set nothing — data-kp-dragging absent, the zone at rest, in all 22 themes.
        await open(page, '/catalogue/upload.html');
        const zone = page.locator('#dragging [data-kp-upload] [data-kp-upload-zone]');
        const frozen = page.locator('#dragging label[data-kp-dragging]:not([data-kp-upload-zone])');
        const faults = [];
        for (const theme of THEME_NAMES) {
            await wear(page, theme);
            const result = await zone.evaluate((el) => {
                const paint = (/** @type {Element} */ e) => {
                    const s = getComputedStyle(e);
                    return `${s.borderTopColor} ${s.color} ${s.backgroundColor}`;
                };
                const rest = paint(el);
                const data = new DataTransfer();
                data.items.add(new File(['t,v'], 'telemetry.csv', { type: 'text/csv' }));
                const enter = new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: data });
                el.dispatchEvent(enter);
                return { rest, cancelled: enter.defaultPrevented, dragging: el.hasAttribute('data-kp-dragging'), paint: paint(el) };
            });
            const want = await frozen.evaluate((el) => {
                const s = getComputedStyle(el);
                return `${s.borderTopColor} ${s.color} ${s.backgroundColor}`;
            });
            if (!result.cancelled || !result.dragging || result.paint !== want || result.paint === result.rest)
                faults.push(
                    `${theme}: cancelled ${result.cancelled}, dragging ${result.dragging}, paint ${result.paint}, frozen ${want}, rest ${result.rest}`,
                );
            // Leaving the zone for the page takes the state away again.
            const after = await zone.evaluate((el) => {
                el.dispatchEvent(new DragEvent('dragleave', { bubbles: true, relatedTarget: document.body }));
                return el.hasAttribute('data-kp-dragging');
            });
            if (after) faults.push(`${theme}: still dragging after leaving`);
        }
        expect(faults).toEqual([]);
    },
);

test(
    'moving over a child of the zone keeps the dragging state — framework-free [note 3]',
    { tag: ['@component:upload', '@component:catalogue'] },
    async ({ page }) => {
        // Before: any dragleave took the state away, so an icon inside a consumer's zone made it flicker off.
        await open(page, '/catalogue/upload.html');
        const zone = page.locator('#dragging [data-kp-upload] [data-kp-upload-zone]');
        const state = await zone.evaluate((el) => {
            const child = document.createElement('span');
            child.textContent = '⇪';
            el.prepend(child);
            const data = new DataTransfer();
            el.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: data }));
            el.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: data }));
            child.dispatchEvent(new DragEvent('dragenter', { bubbles: true, cancelable: true, dataTransfer: data }));
            el.dispatchEvent(new DragEvent('dragleave', { bubbles: true, relatedTarget: child }));
            const kept = el.hasAttribute('data-kp-dragging');
            el.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: new DataTransfer() }));
            child.remove();
            return { kept, afterDrop: el.hasAttribute('data-kp-dragging') };
        });
        expect(state).toEqual({ kept: true, afterDrop: false });
    },
);
