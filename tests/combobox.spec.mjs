// The combobox and the tag input, driven in both channels [TH39, TH41].
//
// One suite, run twice against markup written two different ways, because
// a structural comparison would score both as identical while one of them
// silently fails to move `aria-activedescendant` (AR7).
//
// Every assertion here is about behaviour a keyboard or a screen reader
// depends on. The visual half — does the highlight look right — is what
// the showcase is for; this is the half a test can actually judge.

import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { DEFAULT_STRINGS as S } from '../js/strings.js';

const URL = '/tests/fixtures/components.html';

/** @type {{name: string, box: string, input: string, tags: string, tagsInput: string}[]} */
const CHANNELS = [
    {
        name: 'framework-free',
        box: '[data-test="plain-combobox"]',
        input: '[data-test="plain-combobox-input"]',
        tags: '[data-test="plain-tags"]',
        tagsInput: '[data-test="plain-tags-input"]',
    },
    {
        name: 'React',
        box: '[data-test="react-combobox"] .kp-combobox',
        input: '[data-test="react-combobox"] .kp-combobox__input',
        tags: '[data-test="react-tags"] .kp-combobox',
        tagsInput: '[data-test="react-tags"] .kp-combobox__input',
    },
];

for (const channel of CHANNELS) {
    test.describe(`combobox — ${channel.name}`, () => {
        test('the arrow keys move the highlight, and say so [TH39]', async ({ page }) => {
            await page.goto(URL);
            const input = page.locator(channel.input);
            await input.click();
            await input.press('ArrowDown');

            // The whole point of the pattern: DOM focus stays in the
            // input, and the current option is named by attribute.
            //
            // Drilled per KT3: the `aria-activedescendant` line was removed
            // from js/listbox.js and the framework-free case went red. The
            // React case stayed green, correctly — it sets the attribute
            // itself, and the two channels are two implementations.
            await expect(input).toBeFocused();
            const described = await input.getAttribute('aria-activedescendant');
            expect(described).toBeTruthy();
            const active = page.locator(`#${described}`);
            await expect(active).toHaveAttribute('aria-selected', 'true');
            await expect(active).toHaveClass(/is-active/);
        });

        test('Enter takes the highlighted option [TH39]', async ({ page }) => {
            await page.goto(URL);
            const input = page.locator(channel.input);
            await input.click();
            await input.press('ArrowDown');
            await input.press('ArrowDown');
            await input.press('Enter');
            await expect(input).toHaveValue('Banaan');
            await expect(input).toHaveAttribute('aria-expanded', 'false');
        });

        test('typing filters, and the count is announced [TH39]', async ({ page }) => {
            await page.goto(URL);
            const input = page.locator(channel.input);
            await input.click();
            await input.fill('an');
            const box = page.locator(channel.box);
            // Only Banaan contains "an".
            await expect(box.locator('.kp-combobox__option:visible')).toHaveCount(1);
            // A sighted user watches the list shrink; this is how everyone
            // else finds out.
            await expect(box.locator('[data-kp-combobox-status]')).toHaveText(S.oneResult);
        });

        test('Escape closes the list without choosing [TH39]', async ({ page }) => {
            await page.goto(URL);
            const input = page.locator(channel.input);
            await input.click();
            await input.press('ArrowDown');
            await input.press('Escape');
            await expect(input).toHaveAttribute('aria-expanded', 'false');
            await expect(input).toHaveValue('');
        });

        test('a tag input appends and keeps the list open [TH41]', async ({ page }) => {
            await page.goto(URL);
            const input = page.locator(channel.tagsInput);
            await input.click();
            await input.press('ArrowDown');
            await input.press('Enter');
            const tags = page.locator(`${channel.tags} .kp-tag`);
            await expect(tags).toHaveCount(1);
            await expect(input).toHaveValue('');
            // A chosen tag leaves the list: offering it again is how you
            // end up with duplicates nobody asked for.
            await expect(page.locator(`${channel.tags} .kp-combobox__option:visible`)).toHaveCount(2);
        });

        test('every remove button says what it removes [TH41, DI4]', async ({ page }) => {
            await page.goto(URL);
            const input = page.locator(channel.tagsInput);
            await input.click();
            await input.press('ArrowDown');
            await input.press('Enter');
            const remove = page.locator(`${channel.tags} .kp-tag__remove`).first();
            // A row of identical × buttons is useless without a name.
            const label = await remove.getAttribute('aria-label');
            // The name is the option's, wrapped by whatever the dictionary says.
            expect(label).toBe(S.removeNamed('Urgent'));
        });

        test('Backspace in an empty field leaves the last tag by default [TH41, note 2 of 2026-09-13]', async ({ page }) => {
            // It removed it until Kenny's second nostromo pass; the opt-in is
            // held in tests/nostromo-second-pass.spec.mjs.
            await page.goto(URL);
            const input = page.locator(channel.tagsInput);
            await input.click();
            await input.press('ArrowDown');
            await input.press('Enter');
            await expect(page.locator(`${channel.tags} .kp-tag`)).toHaveCount(1);
            await input.press('Backspace');
            await expect(page.locator(`${channel.tags} .kp-tag`)).toHaveCount(1);
        });
    });
}

// ── gap-11, the combobox faults of catalogue batch 2 [2026-09-13] ─────────

const THEME_NAMES = JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8'));

/** @param {import('@playwright/test').Page} page @param {string} theme */
const wear = async (page, theme) => {
    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
    await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(theme);
};

/** The gap between an input's bottom edge and its list's top edge. @param {import('@playwright/test').Locator} box */
const gapUnderInput = (box) =>
    box.evaluate((el) => {
        const input = /** @type {HTMLElement} */ (el.querySelector('.kp-combobox__input'));
        const list = /** @type {HTMLElement} */ (el.querySelector('.kp-combobox__list'));
        return Math.round(list.getBoundingClientRect().top - input.getBoundingClientRect().bottom);
    });

for (const channel of CHANNELS) {
    test(`the list opens directly under its input, not under the status line — ${channel.name} [gap-11]`, async ({ page }) => {
        // gap-11: the list hung from top: 100% of the whole .kp-combobox, so with a status line inside the box it opened a line below the input.
        await page.goto(URL);
        const input = page.locator(channel.input);
        await input.click();
        await input.pressSequentially('a');
        await expect(page.locator(`${channel.box} .kp-combobox__status`)).not.toBeEmpty();
        await expect(page.locator(`${channel.box} .kp-combobox__list`)).toBeVisible();
        const gap = await gapUnderInput(page.locator(channel.box));
        expect(gap).toBeGreaterThanOrEqual(0);
        expect(gap).toBeLessThanOrEqual(8);
    });

    test(`a query that matches nothing keeps a visible "no results" row in the list — ${channel.name} [gap-11]`, async ({ page }) => {
        // gap-11: filtering to nothing closed the list, so the only answer was a small status line a line away from the input.
        await page.goto(URL);
        const input = page.locator(channel.input);
        await input.click();
        await input.pressSequentially('zzz');
        const list = page.locator(`${channel.box} .kp-combobox__list`);
        await expect(list).toBeVisible();
        await expect(list.locator('.kp-combobox__empty')).toBeVisible();
        await expect(list.locator('.kp-combobox__empty')).toHaveText(S.noResults);
        // It is not an option: nothing for Enter to take, nothing for the arrows to land on.
        await expect(list.locator('[role="option"]:visible')).toHaveCount(0);
        // And it leaves when something matches again.
        await input.fill('a');
        await expect(list.locator('.kp-combobox__empty')).toBeHidden();
    });

    test(`inside a card that clips its corners the open list is whole, takes its clicks and stays under the input, in every theme — ${channel.name} [2026-09-13]`, async ({
        page,
    }) => {
        // Before: in dark, cyberpunk, phantom and titanium the card's clip-path cut the list away — 5 of 5 options out of reach (4 of 5 in phantom).
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto(URL);
        const box = page.locator(channel.box);
        await box.evaluate(async (el, names) => {
            await Promise.all(
                names.map(
                    (name) =>
                        new Promise((resolve) => {
                            const link = document.createElement('link');
                            link.rel = 'stylesheet';
                            link.href = `/css/${name}-register.css`;
                            link.onload = resolve;
                            link.onerror = resolve;
                            document.head.append(link);
                        }),
                ),
            );
            // The card ends where the combobox ends, so the open list hangs outside it.
            /** @type {HTMLElement} */ (el.parentElement).classList.add('kp-card');
        }, THEME_NAMES);
        const input = page.locator(channel.input);
        const list = box.locator('.kp-combobox__list');
        const lost = [];
        for (const theme of THEME_NAMES) {
            await wear(page, theme);
            await input.click();
            await input.press('ArrowDown');
            await expect(list).toBeVisible();
            const m = await box.evaluate((el) => {
                const field = /** @type {HTMLElement} */ (el.querySelector('.kp-combobox__input')).getBoundingClientRect();
                const drawn = /** @type {HTMLElement} */ (el.querySelector('.kp-combobox__list'));
                const options = [...drawn.querySelectorAll('[role="option"]:not([hidden])')];
                const missed = options.filter((option) => {
                    const r = option.getBoundingClientRect();
                    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
                    return hit !== option && !option.contains(hit);
                }).length;
                return { missed, of: options.length, gap: Math.round(drawn.getBoundingClientRect().top - field.bottom) };
            });
            if (m.missed > 0 || m.gap < 0 || m.gap > 8) lost.push(`${theme}: ${m.missed} of ${m.of} out of reach, ${m.gap}px under the input`);
            await input.press('Escape');
            await expect(list).toBeHidden();
            await page.evaluate(() => /** @type {HTMLElement | null} */ (document.activeElement)?.blur());
        }
        expect(lost).toEqual([]);
    });
}

test('the list sits under its input in every theme [gap-11]', async ({ page }) => {
    // gap-11: the frozen open copy on the catalogue page showed the list under the status line in every theme.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/catalogue/combobox.html');
    const box = page.locator('#open .kp-combobox');
    const far = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        const gap = await gapUnderInput(box);
        if (gap < 0 || gap > 8) far.push(`${theme}: ${gap}px`);
    }
    expect(far).toEqual([]);
});

test('a disabled option looks disabled, in every theme [gap-11]', async ({ page }) => {
    // gap-11: an option with aria-disabled painted exactly like one that can be chosen.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/catalogue/combobox.html');
    const paint = (/** @type {string} */ selector) =>
        page.locator(selector).evaluate((el) => {
            const s = getComputedStyle(el);
            return ['color', 'opacity', 'text-decoration-line', 'background-color', 'background-image'].map((p) => s.getPropertyValue(p)).join(' | ');
        });
    const alike = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        const off = await paint('#open [role="option"][aria-disabled="true"]');
        const on = await paint('#open #cb-open-list-option-0');
        if (off === on) alike.push(theme);
    }
    expect(alike).toEqual([]);
});

test('the combobox input takes the same ground as a .kp-field__input, in every theme [gap-11]', async ({ page }) => {
    // gap-11: the combobox input read --card and --border where a field reads --background and --input, two different boxes side by side.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/catalogue/combobox.html');
    const ground = (/** @type {string} */ selector) =>
        page.locator(selector).evaluate((el) => {
            const s = getComputedStyle(el);
            return ['background-color', 'background-image', 'border-top-color', 'border-top-width', 'border-top-style', 'color']
                .map((p) => `${p}: ${s.getPropertyValue(p)}`)
                .join('; ');
        });
    const apart = [];
    for (const theme of THEME_NAMES) {
        await wear(page, theme);
        const combobox = await ground('#cb-closed');
        const field = await ground('#cb-beside');
        if (combobox !== field) apart.push(`${theme} — ${combobox} ≠ ${field}`);
    }
    expect(apart).toEqual([]);
});

// ── scope-60, the tag input that could not add ─────────────────────────────

test('the tag input adds a tag from typed text, with Enter or a comma [scope-60]', async ({ page }) => {
    // scope-60: Kenny filtered and removed tags on the catalogue page, but typing a label and pressing Enter added nothing —
    // with no option highlighted Enter had nothing to take. Before the fix no tag appeared for "safety" + Enter.
    await page.goto('/catalogue/combobox.html');
    const box = page.locator('#tags .kp-combobox');
    const input = page.locator('#cb-tags');
    const tags = box.locator('.kp-tag > span');
    await expect(tags).toHaveText(['Pressure', 'Night shift']);
    // Typed text that names an option takes that option, value and all.
    await input.fill('safety');
    await input.press('Enter');
    await expect(tags).toHaveText(['Pressure', 'Night shift', 'Safety']);
    await expect(box.locator('.kp-tag').last()).toHaveAttribute('data-value', 'safety');
    await expect(input).toHaveValue('');
    // Typed text no option names becomes a tag of its own, on a box that allows it.
    await input.fill('Leak at the manifold');
    await input.press('Enter');
    await expect(tags).toHaveText(['Pressure', 'Night shift', 'Safety', 'Leak at the manifold']);
    // A comma ends a tag too, and is not typed into the next one.
    await input.pressSequentially('Valve,');
    await expect(tags).toHaveText(['Pressure', 'Night shift', 'Safety', 'Leak at the manifold', 'Valve']);
    await expect(input).toHaveValue('');
    // And the new tag can be removed like the others.
    await box.getByRole('button', { name: 'Remove Valve' }).click();
    await expect(tags).toHaveText(['Pressure', 'Night shift', 'Safety', 'Leak at the manifold']);
});

test('a tag input that does not allow new values adds only what an option names [scope-60]', async ({ page }) => {
    await page.goto(URL);
    const input = page.locator('[data-test="plain-tags-input"]');
    const tags = page.locator('[data-test="plain-tags"] .kp-tag > span');
    await input.fill('bug');
    await input.press('Enter');
    await expect(tags).toHaveText(['Bug']);
    await input.fill('Nothing like it');
    await input.press('Enter');
    await expect(tags).toHaveText(['Bug']);
    await expect(input).toHaveValue('Nothing like it');
});
