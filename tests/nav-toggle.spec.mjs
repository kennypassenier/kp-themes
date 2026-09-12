// The toggle a narrow bar collapses into [scope-10, stage 1.3].
//
// Measured before it existed: the package had no collapse of any kind, so
// a bar simply wrapped. On the round-seven demo at 462px that put the
// chrome at 229px tall before any of the page was visible, and the
// package's own claim is that it works at 320.
//
// One suite, both channels [AR7, rule 7g]. The framework-free half is
// wired by js/auto.js; the React half wires its own button and marks it
// `data-kp-nav-owner` so the module leaves it alone [AR29]. If the two
// ever disagree — a channel that opens but does not close, one that
// forgets aria-expanded — this fails rather than shrugs.
//
// Every assertion reads what the browser painted rather than the
// attribute the code just wrote [KT13]: a list is open when it has a
// height, not when it has a class.
//
// Drill [KT3]: the `@container kp-nav (max-width: 40rem)` block that
// collapses `.kp-nav__links` removed from css/components.css — the four
// "collapsed" and "opens" tests go red in firefox, both channels, because
// the links are painted whether the toggle was pressed or not.

import { expect, test } from '@playwright/test';
import { measured } from './paint.mjs';

const FIXTURE = '/tests/fixtures/nav-toggle.html';

/** The two channels, by the prefix their test names carry. */
const CHANNELS = ['free', 'react'];

/** @param {import('@playwright/test').Page} page @param {string} channel */
const parts = (page, channel) => ({
    toggle: channel === 'free' ? page.locator('[data-test="free-toggle"]') : page.locator('.react-toggle'),
    links: channel === 'free' ? page.locator('[data-test="free-links"]') : page.locator('.react-links'),
});

test.describe('the nav toggle', () => {
    for (const channel of CHANNELS) {
        test(`${channel}: the links are not painted until the toggle is pressed [stage 1.3]`, async ({ page }) => {
            await page.goto(FIXTURE);
            const { toggle, links } = parts(page, channel);

            await measured(toggle, (el) => el.getBoundingClientRect().height, undefined, `${channel}: the toggle itself is painted`).toBeGreaterThan(
                0,
            );
            await measured(links, (el) => el.getBoundingClientRect().height, undefined, `${channel}: the links start collapsed`).toBe(0);
        });

        test(`${channel}: pressing the toggle paints the links, and says so [stage 1.3]`, async ({ page }) => {
            await page.goto(FIXTURE);
            const { toggle, links } = parts(page, channel);

            await toggle.click();

            await measured(
                links,
                (el) => el.getBoundingClientRect().height,
                undefined,
                `${channel}: the links are painted once open`,
            ).toBeGreaterThan(0);
            await expect(toggle, `${channel}: the button says it is open`).toHaveAttribute('aria-expanded', 'true');
        });

        test(`${channel}: Escape closes it again [stage 1.3, KT6]`, async ({ page }) => {
            await page.goto(FIXTURE);
            const { toggle, links } = parts(page, channel);

            await toggle.click();
            await measured(links, (el) => el.getBoundingClientRect().height, undefined, `${channel}: open before the key`).toBeGreaterThan(0);

            await toggle.press('Escape');

            await measured(links, (el) => el.getBoundingClientRect().height, undefined, `${channel}: closed by Escape`).toBe(0);
            await expect(toggle, `${channel}: the button says it is closed`).toHaveAttribute('aria-expanded', 'false');
        });
    }
});
