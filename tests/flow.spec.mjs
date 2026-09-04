// Upload and wizard [TH44, TH48].

import { test, expect } from '@playwright/test';

const URL = '/tests/fixtures/components.html';

test('a dropped file gets a row with its name and size [TH44]', async ({ page }) => {
    await page.goto(URL);
    await page.setInputFiles('[data-test="plain-upload-input"]', {
        name: 'notitie.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('hallo'),
    });
    const row = page.locator('[data-test="plain-upload"] .kp-upload__file');
    await expect(row).toHaveCount(1);
    await expect(row).toContainText('notitie.txt');
    await expect(row).toContainText('5 B');
});

test('a file that is too big is refused on its own row [TH44]', async ({ page }) => {
    await page.goto(URL);
    await page.setInputFiles('[data-test="plain-upload-input"]', {
        name: 'groot.bin',
        mimeType: 'application/octet-stream',
        buffer: Buffer.alloc(2048),
    });
    const row = page.locator('[data-test="plain-upload"] .kp-upload__file');
    // A list that says WHICH file is wrong is the whole point of a list;
    // one message about "some files" sends people hunting.
    await expect(row).toHaveAttribute('data-state', 'error');
    await expect(row.locator('.kp-upload__message')).toContainText('Groter dan');
});

test('every file row names what its remove button removes [TH44]', async ({ page }) => {
    await page.goto(URL);
    await page.setInputFiles('[data-test="plain-upload-input"]', {
        name: 'notitie.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('hallo'),
    });
    await expect(page.getByRole('button', { name: 'notitie.txt verwijderen' })).toBeVisible();
});

test('the same file can be chosen twice [TH44]', async ({ page }) => {
    await page.goto(URL);
    const file = { name: 'notitie.txt', mimeType: 'text/plain', buffer: Buffer.from('hallo') };
    await page.setInputFiles('[data-test="plain-upload-input"]', file);
    await page.locator('[data-test="plain-upload"] .kp-upload__file button').click();
    await page.setInputFiles('[data-test="plain-upload-input"]', file);
    // Without clearing the input, picking a file, removing it and picking
    // it again does nothing at all.
    await expect(page.locator('[data-test="plain-upload"] .kp-upload__file')).toHaveCount(1);
});

test('the wizard says which step you are on [TH48]', async ({ page }) => {
    await page.goto(URL);
    await expect(page.locator('[data-test="wizard-status"]')).toHaveText('Stap 1 van 2');
    // The attribute that exists for exactly this and is almost never used.
    await expect(page.locator('[data-test="step-label-0"]')).toHaveAttribute('aria-current', 'step');
    await expect(page.locator('[data-test="step-label-1"]')).not.toHaveAttribute('aria-current', 'step');
});

test('an invalid step does not advance [TH48]', async ({ page }) => {
    await page.goto(URL);
    await page.locator('[data-test="wizard-next"]').click();
    await expect(page.locator('[data-test="wizard-status"]')).toHaveText('Stap 1 van 2');
    await expect(page.locator('[data-test="wizard-naam"]')).toBeFocused();
});

test('a valid step advances, marks the last one done, and moves focus [TH48]', async ({ page }) => {
    await page.goto(URL);
    await page.locator('[data-test="wizard-naam"]').fill('Kenny');
    await page.locator('[data-test="wizard-next"]').click();
    await expect(page.locator('[data-test="wizard-status"]')).toHaveText('Stap 2 van 2');
    await expect(page.locator('[data-test="step-label-0"]')).toHaveAttribute('data-state', 'done');
    // Focus follows, or a keyboard user presses Next and stays where they
    // were with no idea anything moved.
    await expect(page.locator('[data-test="wizard-step-1"]')).toBeFocused();
    await expect(page.locator('[data-test="wizard-next"]')).toHaveText('Afronden');
});
