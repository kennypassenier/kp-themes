// The component contracts, driven in both channels [L7, AR7, DI4, DI10].
//
// The test bar from FEATURES.md, verbatim: where an invariant applies
// there is a test that fails without it — a destructive button lacking
// undo or confirmation must error, and a badge carrying a semantic colour
// without text or icon must error.
//
// Both channels are driven through the same selectors, because both
// render the same markup. That is the property AR7 asks for, and the only
// way to notice when one channel quietly stops honouring a contract.

import { test, expect } from '@playwright/test';

const PAGE = '/tests/fixtures/components.html';
const CHANNELS = [
    { name: 'framework-free', root: '#plain' },
    { name: 'react', root: '#react-components' },
];

/** @param {import('@playwright/test').Page} page */
async function ready(page) {
    await page.waitForSelector('#plain [data-test="destructive-bare"]');
    await page.waitForSelector('#react-components [data-test="destructive-bare"]');
    // Both channels report violations on load; give the React effects a
    // turn so the two are compared in the same state.
    await page.waitForSelector('#react-components [data-kp-contract-error]');
}

for (const channel of CHANNELS) {
    test.describe(`contracts · ${channel.name}`, () => {
        test('a destructive button without undo or confirmation is refused [DI10]', async ({ page }) => {
            const errors = [];
            page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
            await page.goto(PAGE);
            await ready(page);

            const button = page.locator(`${channel.root} [data-test="destructive-bare"]`);
            await expect(button).toHaveAttribute('data-kp-contract-error', 'DI10');
            await expect(button).toBeDisabled();
            expect(errors.join('\n')).toContain('DI10');
        });

        test('a destructive button with an undo is left alone [DI10]', async ({ page }) => {
            await page.goto(PAGE);
            await ready(page);
            const button = page.locator(`${channel.root} [data-test="destructive-undo"]`);
            await expect(button).not.toHaveAttribute('data-kp-contract-error', /.*/);
            await expect(button).toBeEnabled();
        });

        test('a confirmation takes two clicks, and the first one does not act [DI10]', async ({ page }) => {
            await page.goto(PAGE);
            await page.evaluate(() => {
                window.__acts = [];
                window.__acted = (who) => window.__acts.push(who);
            });
            await ready(page);

            const button = page.locator(`${channel.root} [data-test="destructive-confirm"]`);
            await button.click();
            // The obstacle: armed, relabelled, and nothing happened yet.
            await expect(button).toHaveAttribute('data-kp-armed', 'true');
            await expect(button).toHaveText('Zeker?');
            expect(await page.evaluate(() => window.__acts.length)).toBe(0);

            await button.click();
            expect(await page.evaluate(() => window.__acts.length)).toBe(1);
            await expect(button).not.toHaveAttribute('data-kp-armed', /.*/);
        });

        test('a badge with a semantic colour and no words is refused [DI4]', async ({ page }) => {
            const errors = [];
            page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
            await page.goto(PAGE);
            await ready(page);

            await expect(page.locator(`${channel.root} [data-test="badge-bare"]`)).toHaveAttribute('data-kp-contract-error', 'DI4');
            await expect(page.locator(`${channel.root} [data-test="badge-labelled"]`)).not.toHaveAttribute('data-kp-contract-error', /.*/);
            expect(errors.join('\n')).toContain('DI4');
        });
    });
}

// KT6, the third instance of the half-a-property shape: the skip link
// appeared on focus and the suite never asked whether Enter moved focus.
// JobTracker measured it at seven Tab presses to reach their content
// with the link present; the link had done nothing for the person it
// exists for, because nothing put tabindex="-1" on the target.
const SKIP = [
    { name: 'framework-free', link: '[data-test="plain-skip"]' },
    { name: 'React', link: '[data-test="react-router-nav"] a.kp-skip-link' },
];
for (const channel of SKIP) {
    test(`the skip link moves focus to the content, not only the scroll — ${channel.name} [KT6]`, async ({ page }) => {
        await page.goto('/tests/fixtures/components.html');
        const link = page.locator(channel.link);
        await link.focus();
        await link.press('Enter');
        // Drill: with skipTo() no longer called (framework-free: the
        // attachSkipLinks listener removed; React: the onClick removed),
        // the target is scrolled to and focus stays on the link.
        await expect(page.locator('[data-test="main"]')).toBeFocused();
    });
}
