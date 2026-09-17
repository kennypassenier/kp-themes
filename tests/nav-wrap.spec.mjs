// A bar whose links wrap onto more rows [scope-80].
//
// Kenny's note on catalogue/navigation.html#bar-long, dark, 2026-09-14: the
// sixty-character label wraps onto a new line and makes the line above
// almost unreadable. The cause was the link's box, not its text: a register
// that gives `.kp-nav__link` a plate (padding and a ground) left the link
// inline, and an inline box's block padding takes no room in the line — so
// the plate of a link on the second row, and of a label's own second line,
// painted over the row above. Measured on the old code in firefox at
// 1280px: dark's current-page plate reached 13px into the first row, and
// pastel's and sepia's 2px.
//
// What holds now, in every theme: no link's box, and no line of a link's
// box, overlaps another's — in the block's wide bar, and in the same bar held
// at 44rem, just above the 40rem width where it collapses behind its toggle. Behaviour only; how the rows look is
// Kenny's to judge on the block.

import { expect, test } from '@playwright/test';
import { THEMES } from '../js/theme-registry.js';
import { useEmptyRegister } from './helpers/empty-register.mjs';
import { waitForJudging } from './helpers/catalogue.mjs';

/** @param {import('@playwright/test').Page} page */
async function loadEveryRegister(page) {
    await page.evaluate(
        (names) =>
            Promise.all(
                names.map(
                    (name) =>
                        new Promise((done) => {
                            const link = document.createElement('link');
                            link.rel = 'stylesheet';
                            link.href = `/css/${name}-register.css`;
                            link.onload = done;
                            link.onerror = done;
                            document.head.append(link);
                        }),
                ),
            ),
        THEMES.map((theme) => theme.name),
    );
}

test(
    'a wrapped bar keeps every link, and every line of a long link, clear of the row above, in every theme [scope-80]',
    { tag: ['@component:navigation', '@sweep'] },
    async ({ page }) => {
        test.setTimeout(120_000);
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await useEmptyRegister(page.context());
        /** @type {string[]} */
        const overlaps = [];
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto('/catalogue/navigation.html');
        await waitForJudging(page);
        await loadEveryRegister(page);
        const bar = page.locator('#bar-long .cat-stage > .kp-nav-wrap').first();
        for (const width of ['auto', '44rem']) {
            await bar.evaluate((wrap, size) => /** @type {HTMLElement} */ (wrap.style.inlineSize = size), width);
            for (const theme of THEMES) {
                await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme.name);
                const found = await bar.evaluate((wrap) => {
                    const links = [...wrap.querySelectorAll('.kp-nav__links > li > .kp-nav__link')];
                    /** @type {{ name: string, line: number, rect: DOMRect }[]} */
                    const boxes = links.flatMap((link) =>
                        [...link.getClientRects()]
                            .filter((rect) => rect.width > 0 && rect.height > 0)
                            .map((rect, line) => ({ name: (link.textContent ?? '').trim().slice(0, 16), line, rect })),
                    );
                    const rows = new Set(boxes.map((b) => Math.round(b.rect.top))).size;
                    /** @type {string[]} */
                    const out = [];
                    for (let i = 0; i < boxes.length; i++)
                        for (let j = i + 1; j < boxes.length; j++) {
                            const a = boxes[i].rect;
                            const b = boxes[j].rect;
                            const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
                            const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
                            if (x > 0.5 && y > 0.5)
                                out.push(
                                    `"${boxes[i].name}" line ${boxes[i].line + 1} and "${boxes[j].name}" line ${boxes[j].line + 1} share ${y.toFixed(1)}px`,
                                );
                        }
                    return { out, rows };
                });
                expect(found.rows, `${theme.name}, bar ${width}: the bar wraps, or this reads nothing`).toBeGreaterThan(1);
                for (const line of found.out) overlaps.push(`${theme.name}, bar ${width}: ${line}`);
            }
        }
        expect(overlaps).toEqual([]);
    },
);
