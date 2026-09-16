// "Am I through?" — the page that answers a round's only real question [fix-48].
//
// Kenny, 2026-09-16, having said it twice: "Er MOET een pagina komen die toont
// dat ik klaar ben als ik alles beoordeeld heb." Red first, by construction:
// before this change catalogue/round.html did not exist and both tests failed
// at the first assertion.
import { expect, test } from '@playwright/test';
import { useEmptyRegister } from './helpers/empty-register.mjs';

test.describe.configure({ timeout: 120_000 });

const status = (page) => page.locator('[data-cat-round-status]');
const banner = (page) => page.locator('[data-cat-round-banner]');

test.describe('the round page [fix-48]', { tag: ['@component:catalogue'] }, () => {
    test('with nothing judged it says what is left, per theme', async ({ page, context }) => {
        await useEmptyRegister(context);
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto('/catalogue/round.html');
        await expect(status(page)).toContainText(/0 of \d+ block\/theme pair\(s\) carry a verdict/, { timeout: 60_000 });
        await expect(banner(page)).toContainText('Not yet through');
        const rows = page.locator('[data-cat-round-rows] tr');
        await expect(rows).toHaveCount(22);
        await expect(rows.first()).toContainText('Formal');
        await expect(rows.first()).toContainText('open the first one');
    });

    test('with the register as the repository holds it, it says the round is over', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto('/catalogue/round.html');
        await expect(status(page)).toContainText(/of \d+ block\/theme pair\(s\) carry a verdict/, { timeout: 60_000 });
        await expect(banner(page)).toContainText('You are through');
        await expect(page.locator('[data-cat-round-rows] .kp-badge--success').first()).toHaveText('done');
    });
});
