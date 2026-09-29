// A select's open list stays inside the window and starts its labels at
// the start edge [fix-78].
//
// The homelab dashboard's "Answer a manual check" select (2026-09-29): with
// `appearance: base-select` the list had no inline limit, so it was as wide
// as its longest option — 983px from x=298 to the window's edge at 1280 —
// and `option::checkmark { margin-inline-start: auto }`, the check mark being
// the option's first flex item, pushed every label to the end, where the
// window cut it. What holds now: the open list lies inside the window, no
// option is wider than 40rem, a long label wraps instead of running out, and
// a label starts near its option's start edge. Chromium only: base-select
// is Chromium's (135+); elsewhere the native list is the browser's.

import { expect, test } from '@playwright/test';

test('a long select option wraps inside a list that stays in the window [fix-78]', { tag: ['@component:field'] }, async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'appearance: base-select is Chromium-only');
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/tests/fixtures/select-long.html');
    await page.locator('[data-test="select"]').click();
    const options = page.locator('[data-test="select"] option');
    await expect(options.nth(2)).toBeVisible();
    const boxes = await options.evaluateAll((all) =>
        all.map((option) => {
            const box = option.getBoundingClientRect();
            const range = document.createRange();
            range.selectNodeContents(option);
            const text = [...range.getClientRects()];
            const textStart = Math.min(...text.map((r) => r.left));
            const textEnd = Math.max(...text.map((r) => r.right));
            return {
                left: box.left,
                right: box.right,
                width: box.width,
                lines: new Set(text.map((r) => Math.round(r.top))).size,
                textStart,
                textEnd,
            };
        }),
    );
    const rem = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
    for (const [i, b] of boxes.entries()) {
        expect(b.right, `option ${i} ends inside the window`).toBeLessThanOrEqual(1280);
        expect(b.width, `option ${i} is at most 40rem`).toBeLessThanOrEqual(40 * rem);
        expect(b.textEnd, `option ${i}'s words end inside the window`).toBeLessThanOrEqual(1280);
        expect(b.textStart - b.left, `option ${i}'s label starts at the start edge`).toBeLessThanOrEqual(2 * rem);
    }
    expect(boxes[2].lines, 'the longest label wraps').toBeGreaterThan(1);
});
