// Every page of the documentation site carries a theme switcher, fixed in
// the top right corner, and the choice follows the reader to the next page.
//
// Kenny, 2026-09-29: "er is geen theme switcher die rechtsboven statisch zou
// moeten staan, ik wil altijd kunnen switchen van thema." Before this the
// site had no switcher on its pages and no script restoring a stored
// choice, so every page opened in formal.

import { expect, test } from '@playwright/test';

test(
    'the switcher sits top right on every page, stays there on scroll, and the choice carries over',
    { tag: ['@component:site'] },
    async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.goto('/site/components/table.html');
        const trigger = page.locator('.sc-theme-switch .kp-icon-button');
        await expect(trigger).toBeVisible();
        const at = await trigger.boundingBox();
        expect(at && at.x + at.width, 'near the right edge').toBeGreaterThan(1280 - 80);
        expect(at?.y, 'near the top').toBeLessThan(60);
        await page.mouse.wheel(0, 2000);
        await expect.poll(async () => (await trigger.boundingBox())?.y).toBe(at?.y);
        await trigger.click();
        // The menu hangs under its button, inside the window: Firefox had it
        // at the far left over the sidebar (Kenny, 2026-09-29).
        const button = await trigger.boundingBox();
        const menu = await page.locator('#sc-theme-menu').boundingBox();
        expect(menu && button && menu.y, 'under the button').toBeGreaterThanOrEqual((button?.y ?? 0) + (button?.height ?? 0));
        expect(menu && button && Math.abs(menu.x + menu.width - (button.x + button.width)), 'right edge on the button').toBeLessThan(2);
        await page.locator('#sc-theme-menu [data-kp-theme="cyberpunk"]').click();
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'cyberpunk');
        await page.goto('/site/components/button.html');
        await expect(page.locator('html')).toHaveAttribute('data-theme', 'cyberpunk');
        await expect(page.locator('.sc-theme-switch .kp-icon-button')).toBeVisible();
    },
);
