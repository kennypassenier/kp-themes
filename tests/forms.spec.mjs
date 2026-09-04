// Forms [TH38].
//
// The browser already validates. What this suite checks is the part it
// does not do: putting the message where it will be read, gathering the
// errors, and moving focus to them.

import { test, expect } from '@playwright/test';
import { DEFAULT_STRINGS as S } from '../js/strings.js';

const URL = '/tests/fixtures/components.html';
// Driven in both channels [AR7]: the framework-free half attaches to a
// form a server wrote, the React half renders one. The assertions are the
// same because the contract is.
const CHANNELS = [
    {
        name: 'framework-free',
        form: '[data-test="plain-form"]',
        naam: '[data-test="plain-form-naam"]',
        mail: '[data-test="plain-form-mail"]',
        submit: '[data-test="plain-form-submit"]',
        help: 'naam-help',
    },
    {
        name: 'React',
        form: '[data-test="react-form"] form',
        naam: '[data-test="react-form"] input[name="naam"]',
        mail: '[data-test="react-form"] input[name="mail"]',
        submit: '[data-test="react-form"] button[type="submit"]',
        help: null,
    },
];

for (const channel of CHANNELS) {
    test.describe(`forms — ${channel.name}`, () => {
        test('a failed submit summarises the errors and takes focus [TH38]', async ({ page }) => {
            await page.goto(URL);
            const form = page.locator(channel.form);
            await page.locator(channel.submit).click();

            const summary = form.locator('[data-kp-form-summary]');
            await expect(summary).toBeVisible();
            await expect(summary).toContainText(S.formSummaryMany(2));
            // Rendered is not enough: a message above the fold is invisible to
            // someone whose focus is at the bottom of a long form, which is
            // exactly where the submit button is.
            await expect(summary).toBeFocused();
        });

        test('each summary line names its field and jumps to it [TH38]', async ({ page }) => {
            await page.goto(URL);
            const form = page.locator(channel.form);
            await page.locator(channel.submit).click();
            const link = form.locator('[data-kp-form-summary] a').first();
            await expect(link).toContainText('Naam');
            await link.click();
            await expect(page.locator(channel.naam)).toBeFocused();
        });

        test('an invalid field is announced, not only coloured [TH38, DI4]', async ({ page }) => {
            await page.goto(URL);
            const form = page.locator(channel.form);
            await page.locator(channel.submit).click();
            const field = page.locator(channel.naam);
            await expect(field).toHaveAttribute('aria-invalid', 'true');

            // The message is pointed at, and the help text it already had survives:
            // overwriting aria-describedby is how help disappears the first time
            // someone gets something wrong.
            const described = (await field.getAttribute('aria-describedby')) ?? '';
            // The React channel generates its own ids, so the help id is
            // read from the field rather than hard-coded — what is asserted
            // is that BOTH are pointed at, which is the contract.
            const helpId = channel.help ?? (await form.locator('.kp-field__help').first().getAttribute('id')) ?? '';
            expect(described).toContain(helpId);
            const errorId = described.split(/\s+/).find((id) => id !== helpId);
            expect(errorId).toBeTruthy();
            await expect(page.locator(`#${errorId}`)).toBeVisible();
        });

        test('validation reports on blur, not on every keystroke [TH38]', async ({ page }) => {
            await page.goto(URL);
            const form = page.locator(channel.form);
            const mail = page.locator(channel.mail);
            await mail.click();
            await mail.type('ke');
            // Telling someone their email is wrong while they are typing the third
            // character is technically true and practically hostile.
            await expect(mail).not.toHaveAttribute('aria-invalid', 'true');
            await mail.blur();
            await expect(mail).toHaveAttribute('aria-invalid', 'true');
        });

        test('a fixed field clears its error and its describedby [TH38]', async ({ page }) => {
            await page.goto(URL);
            const form = page.locator(channel.form);
            const naam = page.locator(channel.naam);
            await page.locator(channel.submit).click();
            await expect(naam).toHaveAttribute('aria-invalid', 'true');
            await naam.fill('Kenny');
            await naam.blur();
            await expect(naam).not.toHaveAttribute('aria-invalid', 'true');
            // The help text is still pointed at — only the error left.
            const helpId = channel.help ?? (await form.locator('.kp-field__help').first().getAttribute('id')) ?? '';
            await expect(naam).toHaveAttribute('aria-describedby', helpId);
        });

        test('the submit button says it is working [TH38]', async ({ page }) => {
            await page.goto(URL);
            const form = page.locator(channel.form);
            await page.locator(channel.naam).fill('Kenny');
            await page.locator(channel.mail).fill('kenny@example.test');
            const submit = page.locator(channel.submit);
            await submit.click();
            // Without this a slow save looks like a click that missed, and the
            // second click sends the form twice.
            await expect(submit).toHaveAttribute('aria-busy', 'true');
            await expect(submit).toBeDisabled();
        });
    });
}
