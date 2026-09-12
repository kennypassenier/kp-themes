// gap-5 — an approved concept demo shows the confirmation the package
// actually ships, not the one it shipped a major ago.
//
// Kenny spotted it on the first cut of the hypertech candidates,
// 2026-09-11: the wipe-form button armed itself and waited, which is
// 3.x's confirmation, while `js/components.js` has defaulted
// `attachConfirmations` to a real `<dialog>` since 3.0.0 — a title, a
// description and two actions.
//
// The inventory in `showcase/concept-demo.json` names `data-kp-confirm`
// and nothing else, so a page could carry that attribute with the old
// behaviour behind it and pass. It did. A static check cannot see
// behaviour; this one presses the button.
//
// Kenny, 2026-09-12: "De inventaris vraagt het gedrag."
//
// Drilled 2026-09-12 in firefox: `attachConfirmations`' default changed
// from 'dialog' to 'inline' in js/components.js → red on every page,
// because the button arms instead of opening anything.
import { readdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const PAGES = readdirSync(new URL('../examples/', import.meta.url))
    .filter((n) => n.startsWith('concept-') && n.endsWith('.html'))
    .map((n) => n.slice('concept-'.length, -'.html'.length));

for (const theme of PAGES) {
    test(`the wipe button opens a real confirmation under ${theme} [gap-5]`, async ({ page }) => {
        await page.goto(`/examples/concept-${theme}.html`);
        // The arrival covers the page in four themes and answers a click
        // anywhere since CP1; getting it out of the way is not what this
        // test measures.
        const boot = page.locator('.kp-boot');
        if ((await boot.count()) > 0) {
            await boot.click();
            await expect(boot).toHaveCount(0, { timeout: 4000 });
        }

        const wipe = page.locator('[data-kp-confirm]').first();
        await expect(wipe, 'the page carries the destructive wipe').toHaveCount(1);
        await wipe.scrollIntoViewIfNeeded();
        await wipe.click();

        const dialog = page.locator('dialog.kp-confirm');
        await expect(dialog, 'a real dialog, not an armed button').toHaveCount(1);
        await expect(dialog).toBeVisible();
        // What makes it a confirmation rather than a box: it says what it
        // is, it says what happens, and it offers both ways out.
        expect(await dialog.evaluate((el) => el.hasAttribute('open')), 'it is open').toBe(true);
        expect(await dialog.locator('button').count(), 'two actions: go on, and do not').toBeGreaterThanOrEqual(2);
        expect((await dialog.innerText()).trim().length, 'and it explains itself').toBeGreaterThan(10);
    });
}
