// Colour picker [TH57].
//
// Three sliders is not what this is for. The measurement beside them is:
// the same WCAG ratio the contrast gate uses, against the theme's own
// background. A picker that shows a colour and not whether anyone can
// read it is how the unreadable colours got in.

import { test, expect } from '@playwright/test';
import { DEFAULT_STRINGS as S } from '../js/strings.js';

const URL = '/tests/fixtures/components.html';

const CHANNELS = [
    {
        name: 'framework-free',
        picker: '[data-test="plain-color"]',
        h: '[data-test="plain-color-h"]',
        l: '[data-test="plain-color-l"]',
        value: '[data-test="plain-color-value"]',
        report: '[data-test="plain-color-contrast"]',
        retarget: true,
    },
    {
        name: 'React',
        picker: '[data-test="react-color"] .kp-colorpicker',
        h: '[data-test="react-color"] [data-kp-channel="h"]',
        l: '[data-test="react-color"] [data-kp-channel="l"]',
        value: '[data-test="react-color"] [data-kp-colorpicker-value]',
        report: '[data-test="react-color"] [data-kp-colorpicker-contrast]',
        retarget: false,
    },
];

for (const channel of CHANNELS) {
    test.describe(`colour picker — ${channel.name}`, () => {
        test('it reports the ratio and the verdict, not just a number [TH57]', async ({ page }) => {
            await page.goto(URL);
            const report = page.locator(channel.report);
            // A bare 4.31 means nothing to anyone who does not know the thresholds
            // by heart, so the words are part of the contract.
            await expect(report).toContainText(`:1 ${S.contrastReport('', '--background', '').split(':1 ')[1].split(' —')[0]}`);
            expect([S.contrastPasses, S.contrastFails].some((v) => (report ? true : false))).toBe(true);
            await expect(report).toContainText(new RegExp(`${S.contrastPasses}|${S.contrastFails}`));
        });

        test('moving a slider changes the measurement [TH57]', async ({ page }) => {
            await page.goto(URL);
            const lightness = page.locator(channel.l);
            const report = page.locator(channel.report);
            await lightness.fill('10');
            const dark = await report.textContent();
            await lightness.fill('95');
            const light = await report.textContent();
            expect(dark).not.toBe(light);
            // On formal's near-white background, a very dark colour reads and a
            // very light one does not. That is the whole point of the number.
            expect(dark).toContain(S.contrastPasses);
            expect(light).toContain(S.contrastFails);
        });

        test('the value is emitted as an authored hsl() string [TH57]', async ({ page }) => {
            await page.goto(URL);
            await page.locator(channel.h).fill('40');
            // The same notation the tokens are authored in, so a consumer can paste
            // it into a theme without converting anything.
            await expect(page.locator(channel.value)).toHaveText(/^hsl\(40, \d+%, \d+%\)$/);
        });

        test('a token that does not exist is said, not silently skipped [TH57]', async ({ page }) => {
            test.skip(!channel.retarget, 'the React picker takes its target as a prop, so it is not repointed from the DOM');
            await page.goto(URL);
            await page.locator(channel.picker).evaluate((el) => {
                el.dataset.kpAgainst = '--niet-bestaand';
                el.querySelector('[data-kp-channel="h"]').dispatchEvent(new Event('input', { bubbles: true }));
            });
            // A picker that quietly stops measuring looks exactly like one saying
            // the colour is fine.
            await expect(page.locator(channel.report)).toContainText(S.contrastMissing('--niet-bestaand'));
        });
    });
}
