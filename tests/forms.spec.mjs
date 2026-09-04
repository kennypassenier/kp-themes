// Forms [TH38].
//
// The browser already validates. What this suite checks is the part it
// does not do: putting the message where it will be read, gathering the
// errors, and moving focus to them.

import { test, expect } from '@playwright/test';

const URL = '/tests/fixtures/components.html';
const FORM = '[data-test="plain-form"]';

test('a failed submit summarises the errors and takes focus [TH38]', async ({ page }) => {
    await page.goto(URL);
    const form = page.locator(FORM);
    await form.locator('[data-test="plain-form-submit"]').click();

    const summary = form.locator('[data-kp-form-summary]');
    await expect(summary).toBeVisible();
    await expect(summary).toContainText('2 velden');
    // Rendered is not enough: a message above the fold is invisible to
    // someone whose focus is at the bottom of a long form, which is
    // exactly where the submit button is.
    await expect(summary).toBeFocused();
});

test('each summary line names its field and jumps to it [TH38]', async ({ page }) => {
    await page.goto(URL);
    const form = page.locator(FORM);
    await form.locator('[data-test="plain-form-submit"]').click();
    const link = form.locator('[data-kp-form-summary] a').first();
    await expect(link).toContainText('Naam');
    await link.click();
    await expect(form.locator('[data-test="plain-form-naam"]')).toBeFocused();
});

test('an invalid field is announced, not only coloured [TH38, DI4]', async ({ page }) => {
    await page.goto(URL);
    const form = page.locator(FORM);
    await form.locator('[data-test="plain-form-submit"]').click();
    const field = form.locator('[data-test="plain-form-naam"]');
    await expect(field).toHaveAttribute('aria-invalid', 'true');

    // The message is pointed at, and the help text it already had survives:
    // overwriting aria-describedby is how help disappears the first time
    // someone gets something wrong.
    const described = (await field.getAttribute('aria-describedby')) ?? '';
    expect(described).toContain('naam-help');
    const errorId = described.split(/\s+/).find((id) => id !== 'naam-help');
    expect(errorId).toBeTruthy();
    await expect(page.locator(`#${errorId}`)).toBeVisible();
});

test('validation reports on blur, not on every keystroke [TH38]', async ({ page }) => {
    await page.goto(URL);
    const form = page.locator(FORM);
    const mail = form.locator('[data-test="plain-form-mail"]');
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
    const form = page.locator(FORM);
    const naam = form.locator('[data-test="plain-form-naam"]');
    await form.locator('[data-test="plain-form-submit"]').click();
    await expect(naam).toHaveAttribute('aria-invalid', 'true');
    await naam.fill('Kenny');
    await naam.blur();
    await expect(naam).not.toHaveAttribute('aria-invalid', 'true');
    // The help text is still pointed at — only the error left.
    await expect(naam).toHaveAttribute('aria-describedby', 'naam-help');
});

test('the submit button says it is working [TH38]', async ({ page }) => {
    await page.goto(URL);
    const form = page.locator(FORM);
    await form.locator('[data-test="plain-form-naam"]').fill('Kenny');
    await form.locator('[data-test="plain-form-mail"]').fill('kenny@example.test');
    const submit = form.locator('[data-test="plain-form-submit"]');
    await submit.click();
    // Without this a slow save looks like a click that missed, and the
    // second click sends the form twice.
    await expect(submit).toHaveAttribute('aria-busy', 'true');
    await expect(submit).toBeDisabled();
});
