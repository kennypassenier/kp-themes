// Upload and wizard [TH44, TH48].

import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { DEFAULT_STRINGS as S } from '../js/strings.js';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

const URL = '/tests/fixtures/components.html';

// Both channels [AR7].
const CHANNELS = [
    {
        name: 'framework-free',
        uploadInput: '[data-test="plain-upload-input"]',
        upload: '[data-test="plain-upload"]',
        status: '[data-test="wizard-status"]',
        label0: '[data-test="step-label-0"]',
        label1: '[data-test="step-label-1"]',
        next: '[data-test="wizard-next"]',
        naam: '[data-test="wizard-naam"]',
        step1: '[data-test="wizard-step-1"]',
        validates: true,
    },
    {
        name: 'React',
        uploadInput: '[data-test="react-upload"] input[type="file"]',
        upload: '[data-test="react-upload"] .kp-upload',
        status: '[data-test="react-wizard"] [data-kp-wizard-status]',
        label0: '[data-test="react-wizard"] [data-kp-step-label]:nth-child(1)',
        label1: '[data-test="react-wizard"] [data-kp-step-label]:nth-child(2)',
        next: '[data-test="react-wizard"] [data-kp-wizard-next]',
        naam: null,
        step1: '[data-test="react-wizard"] [data-kp-step]',
        validates: false,
    },
];

for (const channel of CHANNELS) {
    test.describe(`flow — ${channel.name}`, { tag: ['@component:upload'] }, () => {
        test('a dropped file gets a row with its name and size [TH44]', async ({ page }) => {
            await page.goto(URL);
            await page.setInputFiles(channel.uploadInput, {
                name: 'notitie.txt',
                mimeType: 'text/plain',
                buffer: Buffer.from('hallo'),
            });
            const row = page.locator(`${channel.upload} .kp-upload__file`);
            await expect(row).toHaveCount(1);
            await expect(row).toContainText('notitie.txt');
            await expect(row).toContainText('5 B');
        });

        test('a file that is too big is refused on its own row [TH44]', async ({ page }) => {
            await page.goto(URL);
            await page.setInputFiles(channel.uploadInput, {
                name: 'groot.bin',
                mimeType: 'application/octet-stream',
                buffer: Buffer.alloc(2048),
            });
            const row = page.locator(`${channel.upload} .kp-upload__file`);
            // A list that says WHICH file is wrong is the whole point of a list;
            // one message about "some files" sends people hunting.
            await expect(row).toHaveAttribute('data-state', 'error');
            await expect(row.locator('.kp-upload__message')).toContainText(S.uploadTooLarge('1 kB'));
        });

        test('every file row names what its remove button removes [TH44]', async ({ page }) => {
            await page.goto(URL);
            await page.setInputFiles(channel.uploadInput, {
                name: 'notitie.txt',
                mimeType: 'text/plain',
                buffer: Buffer.from('hallo'),
            });
            await expect(page.getByRole('button', { name: S.removeNamed('notitie.txt') })).toBeVisible();
        });

        test('the same file can be chosen twice [TH44]', async ({ page }) => {
            await page.goto(URL);
            const file = { name: 'notitie.txt', mimeType: 'text/plain', buffer: Buffer.from('hallo') };
            await page.setInputFiles(channel.uploadInput, file);
            await page.locator(`${channel.upload} .kp-upload__file button`).click();
            await page.setInputFiles(channel.uploadInput, file);
            // Without clearing the input, picking a file, removing it and picking
            // it again does nothing at all.
            await expect(page.locator(`${channel.upload} .kp-upload__file`)).toHaveCount(1);
        });

        test('the wizard says which step you are on [TH48]', { tag: ['@component:structure'] }, async ({ page }) => {
            await page.goto(URL);
            await expect(page.locator(channel.status)).toHaveText(S.wizardStep(1, 2));
            // The attribute that exists for exactly this and is almost never used.
            await expect(page.locator(channel.label0)).toHaveAttribute('aria-current', 'step');
            await expect(page.locator(channel.label1)).not.toHaveAttribute('aria-current', 'step');
        });

        test('an invalid step does not advance [TH48]', { tag: ['@component:structure'] }, async ({ page }) => {
            test.skip(!channel.validates, 'the React fixture mounts a wizard without a required field');
            await page.goto(URL);
            await page.locator(channel.next).click();
            await expect(page.locator(channel.status)).toHaveText(S.wizardStep(1, 2));
            await expect(page.locator(channel.naam)).toBeFocused();
        });

        test('a valid step advances, marks the last one done, and moves focus [TH48]', { tag: ['@component:structure'] }, async ({ page }) => {
            await page.goto(URL);
            if (channel.naam !== null) await page.locator(channel.naam).fill('Kenny');
            await page.locator(channel.next).click();
            await expect(page.locator(channel.status)).toHaveText(S.wizardStep(2, 2));
            await expect(page.locator(channel.label0)).toHaveAttribute('data-state', 'done');
            // Focus follows, or a keyboard user presses Next and stays where they
            // were with no idea anything moved.
            await expect(page.locator(channel.step1)).toBeFocused();
            await expect(page.locator(channel.next)).toHaveText(S.finish);
        });
    });
}

// ── gap-11, the upload faults of catalogue batch 2 [2026-09-13] ───────────

const THEME_NAMES = JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8'));

test(
    'the drop zone shows a focus ring when its hidden input has keyboard focus, in every theme [gap-11]',
    { tag: ['@component:upload', '@sweep', '@component:catalogue'] },
    async ({ page }) => {
        // gap-11: the file input is visually hidden and the zone is its label, so Tab landed on the input and nothing on screen changed.
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await useEmptyRegister(page.context());
        await page.goto('/catalogue/upload.html');
        await waitForJudging(page);
        const zone = page.locator('#empty .kp-upload__zone');
        const ring = () =>
            zone.evaluate((el) => {
                const s = getComputedStyle(el);
                return `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor} | ${s.boxShadow}`;
            });
        // Reach the input the way a keyboard does: Tab from the element just before it.
        await page.locator('#empty .cat-look').evaluate((el) => {
            el.setAttribute('tabindex', '-1');
            /** @type {HTMLElement} */ (el).focus();
        });
        const rest = await ring();
        await page.keyboard.press('Tab');
        expect(await page.evaluate(() => document.activeElement?.id)).toBe('up-empty');
        const unseen = [];
        for (const theme of THEME_NAMES) {
            await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
            const focused = await ring();
            if (focused.startsWith('none') && focused.endsWith('| none')) unseen.push(`${theme}: ${focused}`);
        }
        expect(rest.startsWith('none'), `the zone at rest already paints a ring: ${rest}`).toBe(true);
        expect(unseen).toEqual([]);
    },
);
