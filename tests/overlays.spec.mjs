// Keyboard operation of the overlays, in both channels [L8, TH35, AR7].
//
// L8's exit criterion names three things and this file asserts exactly
// those: it opens, Escape closes it, and focus returns where it came
// from. The third is the one that quietly breaks — and AR7's worked
// example is precisely this: on Escape the framework-free script returned
// focus to the trigger and the React component did not. A structural
// comparison scores those two as identical.
//
// Both channels get the behaviour from <dialog> rather than from our
// code, which is the point: the test is here to catch the day someone
// replaces it with a div.

import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

const PAGE = '/tests/fixtures/components.html';
const CHANNELS = [
    { name: 'framework-free', root: '#plain' },
    { name: 'react', root: '#react-components' },
];

for (const channel of CHANNELS) {
    test.describe(`overlays · ${channel.name}`, () => {
        test.beforeEach(async ({ page }) => {
            await page.goto(PAGE);
            await page.waitForSelector(`${channel.root} [data-test="dialog-open"]`);
        });

        test('a dialog opens, Escape closes it, and focus goes back to the opener', async ({ page }) => {
            const opener = page.locator(`${channel.root} [data-test="dialog-open"]`);
            // .kp-dialog, not any dialog: round two put a command palette
            // and a shortcut sheet on this fixture, and both are dialogs.
            const dialog = page.locator(`${channel.root} dialog.kp-dialog`);

            await opener.focus();
            await opener.click();
            await expect(dialog).toBeVisible();

            await page.keyboard.press('Escape');
            await expect(dialog).toBeHidden();

            // Not "something has focus" — the opener has it. Landing back
            // at the top of the document is the failure this catches.
            const returned = await page.evaluate(
                (root) => document.activeElement === document.querySelector(`${root} [data-test="dialog-open"]`),
                channel.root,
            );
            expect(returned, 'focus did not return to the button that opened the dialog').toBe(true);
        });

        test('the close button closes it too', async ({ page }) => {
            // .kp-dialog, not any dialog: round two put a command palette
            // and a shortcut sheet on this fixture, and both are dialogs.
            const dialog = page.locator(`${channel.root} dialog.kp-dialog`);
            await page.locator(`${channel.root} [data-test="dialog-open"]`).click();
            await expect(dialog).toBeVisible();
            await page.locator(`${channel.root} [data-test="dialog-close"]`).click();
            await expect(dialog).toBeHidden();
        });

        test('tabs are one tab stop, and arrows move between them', async ({ page }) => {
            const tabs = page.locator(`${channel.root} [role="tab"]`);
            await expect(tabs).toHaveCount(2);

            await tabs.nth(0).focus();
            await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'true');
            // The second tab is out of the tab order while the first is
            // selected: a row of tabs is one stop, not one per tab.
            await expect(tabs.nth(1)).toHaveAttribute('tabindex', '-1');

            await page.keyboard.press('ArrowRight');
            await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
            await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator(`${channel.root} [data-test="panel-1"]`)).toBeVisible();
            await expect(page.locator(`${channel.root} [data-test="panel-0"]`)).toBeHidden();
        });
    });
}

// ── gap-11, the overlay faults of catalogue batch 2 [2026-09-13] ──────────

const THEME_NAMES = JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8'));

test('an alert closes from its own close button, without a framework [gap-11]', async ({ page }) => {
    // gap-11: .kp-alert__close did nothing outside React; the framework-free channel left an alert's dismissal unwired.
    await page.goto('/catalogue/feedback.html');
    const alert = page.locator('#alerts .kp-alert--success');
    await expect(alert).toBeVisible();
    await alert.locator('.kp-alert__close').click();
    await expect(alert).toBeHidden();
});

test('a dismissal can be refused, and detach unwires the close buttons [gap-11, KT6]', async ({ page }) => {
    // gap-11: the new close behaviour needs its ways out — a cancelable event, and a detach that takes the listener back.
    await page.goto('/tests/fixtures/components.html');
    const result = await page.evaluate(async () => {
        const { attachDismissals, ALERT_DISMISS_EVENT } = await import('/js/overlays.js');
        const host = document.createElement('div');
        host.innerHTML =
            '<div class="kp-alert" data-test="a"><span class="kp-alert__body">One</span><button type="button" class="kp-alert__close">x</button></div>' +
            '<div class="kp-alert" data-test="b"><span class="kp-alert__body">Two</span><button type="button" class="kp-alert__close" data-kp-dismiss-owner>x</button></div>';
        document.body.prepend(host);
        const a = /** @type {HTMLElement} */ (host.querySelector('[data-test="a"]'));
        const b = /** @type {HTMLElement} */ (host.querySelector('[data-test="b"]'));
        const detach = attachDismissals(host);
        // The fixture runs js/auto.js, which attached the document too; the click stops at the host so only this attach is measured.
        host.addEventListener('click', (event) => event.stopPropagation());
        const refuse = (/** @type {Event} */ event) => event.preventDefault();
        host.addEventListener(ALERT_DISMISS_EVENT, refuse);
        a.querySelector('button')?.click();
        const refused = a.hidden;
        host.removeEventListener(ALERT_DISMISS_EVENT, refuse);
        b.querySelector('button')?.click();
        const owned = b.hidden;
        detach();
        a.querySelector('button')?.click();
        const afterDetach = a.hidden;
        host.remove();
        return { refused, owned, afterDetach };
    });
    expect(result).toEqual({ refused: false, owned: false, afterDetach: false });
});

test('a toast closes from its own close button, without a framework [gap-11]', async ({ page }) => {
    // gap-11: .kp-toast__close did nothing outside React.
    await page.goto('/catalogue/feedback.html');
    const toasts = page.locator('#toasts .kp-toast');
    await expect(toasts).toHaveCount(5);
    await page.locator('#toasts .kp-toast--warning .kp-toast__close').click();
    await expect(toasts).toHaveCount(4);
    await expect(page.locator('#toasts .kp-toast--warning')).toHaveCount(0);
});

test('a tooltip opens on hover and on focus, closes on Escape, and describes its trigger — framework-free [gap-11]', async ({ page }) => {
    // gap-11: .kp-tooltip-anchor had no framework-free behaviour; only the React component opened a tooltip.
    await page.goto('/catalogue/overlays.html');
    const trigger = page.locator('#ov-tt-live-trigger');
    const tip = page.locator('#ov-tt-live');
    await expect(tip).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-describedby', /(^|\s)ov-tt-live(\s|$)/);
    await trigger.hover();
    await expect(tip).toBeVisible();
    await page.mouse.move(0, 0);
    await expect(tip).toBeHidden();
    await trigger.focus();
    await expect(tip).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(tip).toBeHidden();
    // The frozen copies the catalogue owns stay open for the eye.
    await expect(page.locator('#ov-tt1')).toBeVisible();
});

test('a tall dialog stops at the window and scrolls its body [gap-11]', async ({ page }) => {
    // gap-11: .kp-dialog had no maximum height, so sixty rows scrolled the whole dialog and took the title and the actions with them.
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/catalogue/overlays.html');
    await page.locator('[data-kp-dialog="ov-long-live"]').click();
    const dialog = page.locator('#ov-long-live');
    await expect(dialog).toBeVisible();
    const measure = await dialog.evaluate((el) => {
        const body = /** @type {HTMLElement} */ (el.querySelector('.kp-dialog__body'));
        const actions = /** @type {HTMLElement} */ (el.querySelector('.kp-dialog__actions'));
        const box = el.getBoundingClientRect();
        return {
            fits: box.top >= 0 && box.bottom <= window.innerHeight,
            bodyScrolls: body.scrollHeight > body.clientHeight + 1,
            actionsShown: actions.getBoundingClientRect().bottom <= box.bottom + 1,
            dialogScrolls: el.scrollHeight > el.clientHeight + 1,
        };
    });
    expect(measure).toEqual({ fits: true, bodyScrolls: true, actionsShown: true, dialogScrolls: false });
});

test('a disabled menu item looks disabled and does not react to hover, in every theme [gap-11]', async ({ page }) => {
    // gap-11: a disabled .kp-menu__item painted like an enabled one and lit up under the pointer like one.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/catalogue/overlays.html');
    const off = page.locator('#menu-extremes .kp-menu__item[disabled]').first();
    const on = page.locator('#menu-extremes .kp-menu__item:not([disabled])').first();
    const paint = (/** @type {import('@playwright/test').Locator} */ locator) =>
        locator.evaluate((el) => {
            const s = getComputedStyle(el);
            return ['color', 'opacity', 'background-color', 'background-image', 'box-shadow', 'text-decoration-line']
                .map((p) => s.getPropertyValue(p))
                .join(' | ');
        });
    await off.scrollIntoViewIfNeeded();
    const faults = [];
    for (const theme of THEME_NAMES) {
        await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
        await page.mouse.move(0, 0);
        const rest = await paint(off);
        if (rest === (await paint(on))) faults.push(`${theme}: disabled paints like enabled`);
        const box = await off.boundingBox();
        if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        if ((await paint(off)) !== rest) faults.push(`${theme}: disabled reacts to hover`);
    }
    expect(faults).toEqual([]);
});
