// The research demos' review dialog (research/_review/review.js): it stays
// where it opened over a run of approvals (Kenny, 2026-10-05, fix-102: "elke
// keer ik iets approve en de dialog opende in het volgende thema, zakte de
// dialog iets").
//
// Red run first, in firefox, with `await booted;` taken out of show() in
// review.js: the dialog opened non-modal (the catalogue shell had moved it
// into its column), focus fell to the body and the first Up approved nothing.

import { expect, test } from '@playwright/test';

test.describe.configure({ timeout: 120_000 });

const DIALOG = '.rv-dialog';

/** Ticks the first option of every choice still unanswered, so Up can approve. */
const answerChoices = (page) =>
    page.evaluate(() => {
        for (const set of document.querySelectorAll('.rv-dialog .rv-choice'))
            if (!set.querySelector('input:checked')) set.querySelector('input').click();
    });

const readDialog = (page) =>
    page.evaluate(async (selector) => {
        const dialog = document.querySelector(selector);
        // At rest: a register's own entrance (formal's sheet, synthwave's
        // rise) replays on a theme switch and moves the box while it plays.
        const finite = dialog.getAnimations({ subtree: true }).filter((a) => a.effect?.getComputedTiming().endTime !== Infinity);
        await Promise.all(finite.map((a) => a.finished.catch(() => {})));
        return {
            modal: dialog.matches(':modal'),
            top: dialog.getBoundingClientRect().top,
            position: dialog.querySelector('[data-rv-position]').textContent,
            theme: document.documentElement.dataset.theme,
        };
    }, DIALOG);

for (const demo of ['character-meter', 'character-graph']) {
    test(
        `the review dialog opened from the hub stays modal and in place over ten approvals in ${demo} [fix-102]`,
        { tag: ['@component:catalogue'] },
        async ({ page }) => {
            const errors = [];
            page.on('pageerror', (error) => errors.push(String(error)));
            page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
            await page.setViewportSize({ width: 1440, height: 900 });
            await page.goto(`/research/${demo}/demo.html?next=/catalogue/changed.html&review=open`);
            await expect(page.locator(`${DIALOG}[open]`)).toBeVisible();
            await expect(page.locator(`${DIALOG} [data-rv-approve]`)).toBeFocused();
            const first = await readDialog(page);
            expect(first.modal, 'the dialog opened from the hub is modal').toBe(true);
            const seen = [first];
            for (let step = 2; step <= 11; step += 1) {
                await answerChoices(page);
                await page.keyboard.press('ArrowUp');
                await expect(page.locator(`${DIALOG} [data-rv-position]`)).toHaveText(new RegExp(`^Step ${step}/`));
                seen.push(await readDialog(page));
            }
            expect(new Set(seen.map((s) => s.theme)).size, 'ten approvals walked eleven themes').toBe(11);
            for (const shot of seen) {
                expect(shot.modal, `modal in ${shot.theme}`).toBe(true);
                expect(Math.abs(shot.top - first.top), `top in ${shot.theme} (${shot.top} vs ${first.top})`).toBeLessThanOrEqual(1);
            }
            expect(errors).toEqual([]);
        },
    );
}
