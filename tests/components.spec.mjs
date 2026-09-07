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
    { name: 'framework-free', root: '#plain', menu: '#plain-row-menu', menuTrigger: '[data-test="plain-menu-trigger"]' },
    { name: 'react', root: '#react-components', menu: '#react-row-menu', menuTrigger: '#react-components [aria-haspopup="menu"]' },
];

/** The page's own record of what a consumer's handler actually ran. */
const arm = (page) =>
    page.evaluate(() => {
        window.__acts = [];
        window.__acted = (who) => window.__acts.push(who);
    });
const acts = (page) => page.evaluate(() => window.__acts);

/**
 * Attach the framework-free module a second time, over the React part.
 *
 * AR29: js/auto.js attaches over the WHOLE document and kyu, Almanac and
 * chassis all load it, so a React-rendered destructive button IS reached
 * by the module in the field. This fixture attaches before React mounts,
 * which pointed the old test away from the only case that could fail.
 */
const attachOverReact = (page) =>
    page.evaluate(async () => {
        const m = await import('/js/components.js');
        m.attachConfirmations(document);
    });

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

        // TH107, AR27, AR28, AR29. Every confirmation test below attaches
        // the framework-free module a second time, AFTER React has
        // mounted — which is what js/auto.js does in the field for kyu,
        // Almanac and chassis, and what this fixture happened not to do.
        // Drilled red on 4.0.0's predecessor: the react channel went
        // "Zeker?" → "Zeker?" → nothing, `expected 1, received 0` in both
        // browsers, because the two channels re-armed each other forever.
        test('the inline variant still arms then acts [TH107, DI10, AR29]', async ({ page }) => {
            await page.goto(PAGE);
            await arm(page);
            await ready(page);
            await attachOverReact(page);

            const button = page.locator(`${channel.root} [data-test="destructive-inline"]`);
            await button.click();
            // The obstacle: armed, relabelled, and nothing happened yet.
            await expect(button).toHaveAttribute('data-kp-armed', 'true');
            await expect(button).toHaveText('Zeker?');
            expect(await acts(page)).toEqual([]);

            await button.click();
            expect(await acts(page)).toHaveLength(1);
            await expect(button).not.toHaveAttribute('data-kp-armed', /.*/);
        });

        test('a destructive click opens a dialog carrying the phrase, and does not act [TH107]', async ({ page }) => {
            await page.goto(PAGE);
            await arm(page);
            await ready(page);
            await attachOverReact(page);

            // Drill: with `event.preventDefault(); event.stopImmediatePropagation()`
            // removed from the dialog handler (js/components.js) the click
            // reaches the consumer's own onclick and the action fires
            // behind the open question.
            await page.locator(`${channel.root} [data-test="destructive-confirm"]`).click();
            const dialog = page.locator('[data-kp-confirm-dialog]');
            await expect(dialog).toHaveCount(1);
            await expect(dialog.locator('.kp-dialog__title')).toHaveText('Zeker?');
            expect(await page.evaluate(() => document.querySelector('[data-kp-confirm-dialog]')?.matches(':modal'))).toBe(true);
            expect(await acts(page)).toEqual([]);
        });

        test('Escape does nothing [TH107]', async ({ page }) => {
            await page.goto(PAGE);
            await arm(page);
            await ready(page);
            await attachOverReact(page);

            const button = page.locator(`${channel.root} [data-test="destructive-confirm"]`);
            await button.click();
            await page.keyboard.press('Escape');
            await expect(page.locator('[data-kp-confirm-dialog]')).toHaveCount(0);
            expect(await acts(page)).toEqual([]);
            await expect(button).toBeFocused();
        });

        test('Cancel does nothing [TH107]', async ({ page }) => {
            await page.goto(PAGE);
            await arm(page);
            await ready(page);
            await attachOverReact(page);

            const button = page.locator(`${channel.root} [data-test="destructive-confirm"]`);
            await button.click();
            await page.locator('[data-kp-confirm-cancel]').click();
            await expect(page.locator('[data-kp-confirm-dialog]')).toHaveCount(0);
            expect(await acts(page)).toEqual([]);
            await expect(button).toBeFocused();
        });

        test('Confirm acts exactly once, and focus returns to the button [TH107]', async ({ page }) => {
            await page.goto(PAGE);
            await arm(page);
            await ready(page);
            await attachOverReact(page);

            const button = page.locator(`${channel.root} [data-test="destructive-confirm"]`);
            await button.click();
            await page.locator('[data-kp-confirm-accept]').click();
            await expect(page.locator('[data-kp-confirm-dialog]')).toHaveCount(0);
            expect(await acts(page)).toHaveLength(1);
            await expect(button).toBeFocused();
        });

        test('two consecutive confirm cycles produce two actions [AR27]', async ({ page }) => {
            await page.goto(PAGE);
            await arm(page);
            await ready(page);
            await attachOverReact(page);

            // The measurement the unlocked design produced zero for:
            // ["open", "confirm", "open"] — posts: 0, because the listener
            // that opened the dialog caught the re-fired click and opened
            // it again. Drill: remove the `unlocked === button` branch
            // from js/components.js and this reads 0 instead of 2.
            const button = page.locator(`${channel.root} [data-test="destructive-confirm"]`);
            for (const cycle of [1, 2]) {
                await button.click();
                await expect(page.locator('[data-kp-confirm-dialog]')).toHaveCount(1);
                await page.locator('[data-kp-confirm-accept]').click();
                await expect(page.locator('[data-kp-confirm-dialog]')).toHaveCount(0);
                expect(await acts(page)).toHaveLength(cycle);
            }
        });

        test('a destructive item in an open menu leaves that menu re-shown and focused [AR28]', async ({ page }) => {
            await page.goto(PAGE);
            await arm(page);
            await ready(page);
            await attachOverReact(page);

            const menu = page.locator(channel.menu);
            const item = page.locator(`${channel.root} [data-test="destructive-in-menu"]`);
            await page.locator(channel.menuTrigger).click();
            await expect(menu).toBeVisible();
            await item.click();
            // showModal() light-dismisses every open popover="auto":
            // measured open → closed, the button still connected but
            // checkVisibility() false, and focus on <body>.
            await expect(page.locator('[data-kp-confirm-dialog]')).toHaveCount(1);
            await expect(menu).toBeHidden();

            // Drill: remove the `displaced` restore loop from
            // openConfirmation() in js/components.js and the menu stays
            // closed with focus on <body>.
            await page.locator('[data-kp-confirm-cancel]').click();
            await expect(menu).toBeVisible();
            await expect(item).toBeFocused();
            expect(await acts(page)).toEqual([]);
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

// A status badge takes its plate from a class, not from a style attribute
// [R5-BADGE, TH109].
//
// css/components.css had no rule per status, so the only way to colour a
// badge was `style="background: var(--status-offer)"` — which the React
// component wrote for you and a server-rendered page had to write by
// hand, against TH109's zero-inline-style bar. Kenny chose on 2026-09-07
// to generate a rule per name in STATUS_NAMES instead.
//
// Drill: delete the `.kp-badge[data-status='offer']` rule from
// css/components.css and both channels read the muted plate.
test.describe('a status badge colours itself from its class [R5-BADGE]', () => {
    const plate = (page, selector) =>
        page.evaluate((s) => {
            const el = document.querySelector(s);
            const probe = document.createElement('span');
            probe.style.setProperty('background-color', 'var(--status-offer)');
            probe.style.setProperty('color', 'var(--muted-foreground)');
            document.body.append(probe);
            const wanted = getComputedStyle(probe).backgroundColor;
            const muted = getComputedStyle(probe).color;
            probe.remove();
            return {
                background: getComputedStyle(el).backgroundColor,
                wanted,
                mutedInk: muted,
                inlineStyle: el.getAttribute('style'),
            };
        }, selector);

    for (const channel of CHANNELS) {
        test(`${channel.name}: the plate is the status token`, async ({ page }) => {
            await page.goto(PAGE);
            const badge = await plate(page, `${channel.root} [data-test="badge-labelled"]`);
            expect(badge.background).toBe(badge.wanted);
        });
    }

    test('framework-free: and it carries no style attribute at all', async ({ page }) => {
        await page.goto(PAGE);
        const badge = await plate(page, '#plain [data-test="badge-labelled"]');
        expect(badge.inlineStyle).toBeNull();
    });
});
