// A block is hashed as it is written, not as the reviewer left it [fix-47].
//
// Kenny, 2026-09-16, after approving the same field blocks theme after theme:
// "Ik ga nog altijd in cirkels!". Red first, measured on this page before the
// change: `#text` read 8413c69c… at rest, ee6733ba… with "Kenny" typed into
// its first input and cf1b057a… with a control inside it focused. A verdict
// given in either of those states carried a hash nothing else reads, so the
// block came back as "Changed since judged" in every theme, for good.
//
// Firefox while building; the reading is the same in both engines.
import { expect, test } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

test.describe.configure({ timeout: 120_000 });

const hashOf = (page, id) =>
    page.evaluate(async (blockId) => {
        const { readBlocks } = await import('/catalogue/block-hash.js');
        const root = /** @type {HTMLElement} */ (document.getElementById(blockId));
        const [read] = await readBlocks([{ root, source: root.outerHTML }]);
        return read.hash;
    }, id);

test.describe('the hash reads the block as written [fix-47]', { tag: ['@component:catalogue', '@component:field'] }, () => {
    test.beforeEach(async ({ context }) => {
        await useEmptyRegister(context);
    });

    test('a typed value and a focused control read the same as the untouched block', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto('/catalogue/field.html');
        await waitForJudging(page, { timeout: 60_000 });

        const clean = await hashOf(page, 'text');
        const first = page.locator('#text input').first();
        await first.fill('Kenny');
        expect(await hashOf(page, 'text'), 'a typed value').toBe(clean);
        // Focus inside the block: the focus ring is not part of the block at rest.
        await first.focus();
        expect(await hashOf(page, 'text'), 'a focused control').toBe(clean);
        // And the reviewer keeps what he had.
        await expect(first).toHaveValue('Kenny');
        await expect(first).toBeFocused();
    });

    test('a checkbox and a select the reviewer changed read as the markup has them', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.goto('/catalogue/field.html');
        await waitForJudging(page, { timeout: 60_000 });

        const clean = await hashOf(page, 'choices');
        const box = page.locator('#choices input[type="checkbox"]').first();
        const was = await box.isChecked();
        await box.setChecked(!was);
        expect(await hashOf(page, 'choices'), 'a checkbox the reviewer clicked').toBe(clean);
        expect(await box.isChecked(), 'and it keeps what the reviewer set').toBe(!was);
    });
});
