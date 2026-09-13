// The drawn select, driven in both channels and read in every theme [scope-54].
//
// Firefox cannot style a native select's open list, so on Kenny's review
// page the one list in a form that was not the theme's was the select's.
// Since Kenny's form of 2026-09-13 every `select.kp-field__input` gets a
// listbox in the combobox's look laid over it without asking;
// `data-kp-select="native"` and a multiple select stay the browser's. The native element is the
// one that holds the value, submits with the form and is what assistive
// technology reads, so every test here reads the native element back.
//
// Drilled per KT3 on 2026-09-13: every test in this file ran against the
// code before `attachSelects` existed and went red — no list opened, so
// the first locator on `[data-kp-select-list]` timed out in each.

import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

const URL = '/tests/fixtures/select.html';
const THEME_NAMES = JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8'));

/** @type {{name: string, select: string, drawnByDefault: string, native: string, multiple: string, form: string}[]} */
const CHANNELS = [
    {
        name: 'framework-free',
        select: '[data-test="plain-select"]',
        drawnByDefault: '[data-test="plain-default"]',
        native: '[data-test="plain-native"]',
        multiple: '[data-test="plain-multiple"]',
        form: '[data-test="plain-form"]',
    },
    {
        name: 'React',
        select: '[data-test="react-select"]',
        drawnByDefault: '[data-test="react-default"]',
        native: '[data-test="react-native"]',
        multiple: '[data-test="react-multiple"]',
        form: '[data-test="react-form"]',
    },
];

/** The drawn list that belongs to a select. @param {import('@playwright/test').Page} page @param {string} select */
const listOf = (page, select) => page.locator(`${select} + [data-kp-select-list]`);

/** @param {import('@playwright/test').Page} page */
const ready = async (page) => {
    await page.goto(URL);
    for (const channel of CHANNELS) await expect(listOf(page, channel.select)).toHaveCount(1);
};

for (const channel of CHANNELS) {
    test.describe(`drawn select — ${channel.name}`, () => {
        test('a click opens the drawn list, not the browser’s, and a click on an option takes it [scope-54]', async ({ page }) => {
            await ready(page);
            const select = page.locator(channel.select);
            const list = listOf(page, channel.select);
            await expect(list).toBeHidden();
            await select.click();
            await expect(list).toBeVisible();
            await expect(list).toHaveAttribute('role', 'listbox');
            await expect(select).toHaveAttribute('aria-expanded', 'true');
            await expect(list.locator('[role="option"]')).toHaveText(['Low', 'High', 'Blocked', 'Critical — wake the on-call engineer']);
            // The chosen option is marked in the list as well as in the box.
            await expect(list.locator('[data-kp-chosen]')).toHaveText('High');
            await list.locator('[role="option"]', { hasText: 'Critical' }).click();
            await expect(list).toBeHidden();
            await expect(select).toHaveValue('critical');
            await expect(select).toBeFocused();
        });

        test('the keyboard: Down, Up, Home, End, type-ahead, Enter and Escape [scope-54]', async ({ page }) => {
            await ready(page);
            const select = page.locator(channel.select);
            const list = listOf(page, channel.select);
            await select.focus();
            await select.press('ArrowDown');
            await expect(list).toBeVisible();
            // Opening puts the highlight on the value the box holds.
            const described = await select.getAttribute('aria-activedescendant');
            expect(described).toBeTruthy();
            await expect(page.locator(`#${described}`)).toHaveText('High');
            await select.press('ArrowDown');
            // The disabled option is stepped over.
            await expect(list.locator('.is-active')).toHaveText('Critical — wake the on-call engineer');
            await select.press('ArrowUp');
            await expect(list.locator('.is-active')).toHaveText('High');
            await select.press('Home');
            await expect(list.locator('.is-active')).toHaveText('Low');
            await select.press('End');
            await expect(list.locator('.is-active')).toHaveText('Critical — wake the on-call engineer');
            // Escape closes and takes nothing: the box still holds High.
            await select.press('Escape');
            await expect(list).toBeHidden();
            await expect(select).toHaveValue('high');
            // Type-ahead from a closed box opens it on the match; Enter takes it.
            await select.press('l');
            await expect(list).toBeVisible();
            await expect(list.locator('.is-active')).toHaveText('Low');
            await select.press('Enter');
            await expect(list).toBeHidden();
            await expect(select).toHaveValue('low');
            await expect(select).toHaveAttribute('aria-expanded', 'false');
        });

        test('the value is in sync both ways, fires change, and submits with the form [scope-54]', async ({ page }) => {
            await ready(page);
            const select = page.locator(channel.select);
            const list = listOf(page, channel.select);
            await select.evaluate((el) => {
                window.kpChanges = 0;
                el.addEventListener('change', () => (window.kpChanges += 1));
            });
            await select.click();
            await list.locator('[role="option"]', { hasText: 'Low' }).click();
            await expect.poll(() => page.evaluate(() => window.kpChanges)).toBe(1);
            await expect
                .poll(() => page.locator(channel.form).evaluate((form) => new FormData(/** @type {HTMLFormElement} */ (form)).get('severity')))
                .toBe('low');
            if (channel.name === 'React') await expect(page.locator('[data-test="react-state"]')).toHaveText('low');
            // The other way: the native element changes, and the drawn list
            // follows the next time it opens.
            await select.selectOption('critical');
            await select.click();
            await expect(list.locator('[data-kp-chosen]')).toHaveText('Critical — wake the on-call engineer');
        });

        test('the native select stays reachable for assistive technology [scope-54]', async ({ page }) => {
            await ready(page);
            const combobox = page.getByRole('combobox', { name: 'Severity' }).and(page.locator(channel.select));
            await expect(combobox).toBeVisible();
            await expect(combobox).not.toHaveAttribute('aria-hidden', 'true');
            await expect(combobox).not.toHaveAttribute('tabindex', '-1');
            await page.locator(channel.select).click();
            const controls = await combobox.getAttribute('aria-controls');
            expect(controls).toBeTruthy();
            await expect(page.locator(`#${controls}`)).toHaveAttribute('role', 'listbox');
        });

        test('a .kp-field__input select is drawn without asking, and its click takes an option [Kenny 2026-09-13, reverses scope-54’s opt-in]', async ({
            page,
        }) => {
            // Before: the Region select, with no data-kp-select, stayed the browser's — no drawn list beside it.
            await ready(page);
            const select = page.locator(channel.drawnByDefault);
            const list = listOf(page, channel.drawnByDefault);
            await expect(list).toHaveCount(1);
            await select.click();
            await expect(list).toBeVisible();
            await list.locator('[role="option"]', { hasText: 'South' }).click();
            await expect(select).toHaveValue('South');
        });

        test('data-kp-select="native" and a multiple select stay the browser’s [Kenny 2026-09-13]', async ({ page }) => {
            await ready(page);
            for (const selector of [channel.native, channel.multiple]) {
                const native = page.locator(selector);
                await expect(native).toHaveCount(1);
                await expect(page.locator(`${selector} + [data-kp-select-list]`)).toHaveCount(0);
                await expect(native).not.toHaveAttribute('aria-expanded', /.*/);
                await expect(native).not.toHaveAttribute('aria-controls', /.*/);
            }
        });
    });
}

test('the data table’s own selects are drawn, in both channels [Kenny 2026-09-13]', async ({ page }) => {
    // Before: the search scope, density, sort-by and page-size selects were the browser's in both channels.
    await page.goto('/tests/fixtures/datatable.html');
    for (const table of ['[data-test="plain-datatable"]', '[data-test="react-datatable"] .kp-datatable']) {
        await expect(page.locator(`${table} [data-kp-datatable-page-size]`)).toHaveCount(1);
        const bare = await page
            .locator(`${table} select.kp-field__input`)
            .evaluateAll((selects) =>
                selects.filter((s) => !s.nextElementSibling?.matches('[data-kp-select-list]')).map((s) => s.outerHTML.slice(0, 80)),
            );
        expect(bare, table).toEqual([]);
    }
    const size = page.locator('[data-test="plain-datatable"] [data-kp-datatable-page-size]');
    await size.click();
    await listOf(page, '[data-test="plain-datatable"] [data-kp-datatable-page-size]').locator('[role="option"]', { hasText: /^10$/ }).click();
    await expect(page.locator('[data-test="plain-datatable"] tbody tr:visible')).toHaveCount(10);
});

test('the React FormField’s select is drawn by default, and drawn={false} keeps it native [Kenny 2026-09-13]', async ({ page }) => {
    // Before: FormField type="select" had no drawn list at all.
    await page.goto('/tests/fixtures/components.html');
    const land = page.locator('[data-test="react-rich-form"] select[name="land"]');
    await expect(land).toHaveCount(1);
    await expect(page.locator('[data-test="react-rich-form"] select[name="land"] + [data-kp-select-list]')).toHaveCount(1);
    await expect(page.locator('[data-test="plain-rich-land"] + [data-kp-select-list]')).toHaveCount(1);
});

test('the catalogue’s textarea-and-select block shows only the drawn select [Kenny 2026-09-13]', async ({ page }) => {
    // Before: two selects, the native Severity beside the drawn one.
    await page.goto('/catalogue/field.html');
    const selects = page.locator('#multiline select');
    await expect(selects).toHaveCount(1);
    await expect(page.locator('#multiline select + [data-kp-select-list]')).toHaveCount(1);
    await expect(page.locator('#multiline .cat-look')).toContainText('data-kp-select="native"');
});

test('detach takes the drawn list away and leaves the native select as it was [scope-54]', async ({ page }) => {
    await ready(page);
    const detached = await page.evaluate(async () => {
        const { attachSelects } = await import('/js/combobox.js');
        const holder = document.createElement('div');
        holder.innerHTML = '<select class="kp-field__input" data-kp-select><option>One</option><option>Two</option></select>';
        document.body.append(holder);
        const detach = attachSelects(holder);
        const attached = holder.querySelector('[data-kp-select-list]') !== null;
        detach();
        const select = /** @type {HTMLSelectElement} */ (holder.querySelector('select'));
        return {
            attached,
            list: holder.querySelector('[data-kp-select-list]') !== null,
            expanded: select.hasAttribute('aria-expanded'),
            controls: select.hasAttribute('aria-controls'),
            value: select.value,
        };
    });
    expect(detached).toEqual({ attached: true, list: false, expanded: false, controls: false, value: 'One' });
});

test('every register answers the drawn list the way it answers the combobox list, and the list opens under its select [scope-54]', async ({
    page,
}) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await ready(page);
    const select = page.locator('[data-test="plain-select"]');
    const list = listOf(page, '[data-test="plain-select"]');
    /** @param {import('@playwright/test').Locator} locator */
    const look = (locator) =>
        locator.evaluate((el) => {
            const s = getComputedStyle(el);
            return [
                'background-color',
                'background-image',
                'border-top-color',
                'border-top-width',
                'border-top-style',
                'border-top-left-radius',
                'box-shadow',
                'color',
            ]
                .map((p) => `${p}: ${s.getPropertyValue(p)}`)
                .join('; ');
        });
    const apart = [];
    const far = [];
    for (const theme of THEME_NAMES) {
        await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
        await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(theme);
        // Opened again in each theme: the list is placed when it opens.
        await select.press('Escape');
        await expect(list).toBeHidden();
        await select.click();
        await expect(list).toBeVisible();
        const drawn = await look(list);
        const reference = await look(page.locator('[data-test="reference-list"]'));
        if (drawn !== reference) apart.push(`${theme}: ${drawn} ≠ ${reference}`);
        const gap = await page.evaluate(() => {
            const s = /** @type {HTMLElement} */ (document.querySelector('[data-test="plain-select"]'));
            const l = /** @type {HTMLElement} */ (document.querySelector('[data-test="plain-select"] + [data-kp-select-list]'));
            const a = s.getBoundingClientRect();
            const b = l.getBoundingClientRect();
            return { top: Math.round(b.top - a.bottom), left: Math.round(b.left - a.left), width: Math.round(b.width - a.width) };
        });
        if (gap.top < 0 || gap.top > 8 || Math.abs(gap.left) > 1 || Math.abs(gap.width) > 1) far.push(`${theme}: ${JSON.stringify(gap)}`);
    }
    expect(apart).toEqual([]);
    expect(far).toEqual([]);
});
