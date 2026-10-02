// An expandable data table opens a row from anywhere in it [Kenny, 2026-10-02].
//
// The homelab dashboard's notifications: "ik wil dat die in/uitklapt als we
// ergens in die rij klikken, niet enkel op dat icoon in het begin, uiteraard
// niet als het om laatste kolom waar een knop in staat". What holds: a click
// on a cell's text opens and closes the row, a click on a control in the row
// does not, and the toggle keeps working from the keyboard.

import { expect, test } from '@playwright/test';

test('a click anywhere in an expandable row toggles it, but not one on its button', { tag: ['@component:datatable'] }, async ({ page }) => {
    await page.goto('/tests/fixtures/datatable-row-expand.html');
    const table = page.locator('[data-test="table"]');
    const row = table.locator('tbody tr', { hasText: 'Backup finished' });
    const toggle = row.locator('[data-kp-row-toggle]');
    const detail = table.locator('tbody tr[data-kp-row-detail]', { hasText: 'Details of N-101' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await row.getByText('Backup finished').click();
    await expect(toggle, 'a click on the title opens the row').toHaveAttribute('aria-expanded', 'true');
    await expect(detail).toBeVisible();
    await row.getByText('2 min ago').click();
    await expect(toggle, 'a click on another cell closes it').toHaveAttribute('aria-expanded', 'false');
    await expect(detail).toBeHidden();

    await row.locator('[data-test="ack-N-101"]').click();
    await expect(toggle, 'the button in the last column does its own thing').toHaveAttribute('aria-expanded', 'false');

    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle, 'Enter on the toggle still opens it').toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Space');
    await expect(toggle, 'Space closes it').toHaveAttribute('aria-expanded', 'false');
    expect(await row.evaluate((tr) => getComputedStyle(tr).cursor), 'the row says it can be clicked').toBe('pointer');
});
