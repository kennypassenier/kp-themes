// The combobox and the tag input, driven in both channels [TH39, TH41].
//
// One suite, run twice against markup written two different ways, because
// a structural comparison would score both as identical while one of them
// silently fails to move `aria-activedescendant` (AR7).
//
// Every assertion here is about behaviour a keyboard or a screen reader
// depends on. The visual half — does the highlight look right — is what
// the showcase is for; this is the half a test can actually judge.

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

        test('Backspace in an empty field removes the last tag [TH41]', async ({ page }) => {
            await page.goto(URL);
            const input = page.locator(channel.tagsInput);
            await input.click();
            await input.press('ArrowDown');
            await input.press('Enter');
            await expect(page.locator(`${channel.tags} .kp-tag`)).toHaveCount(1);
            await input.press('Backspace');
            await expect(page.locator(`${channel.tags} .kp-tag`)).toHaveCount(0);
        });
    });
}
