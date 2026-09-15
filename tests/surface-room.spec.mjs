// Room inside a surface and inside formal's call to action [Kenny, 2026-09-15].
//
// Kenny's review notes on catalogue/page-effects.html (FireDragon):
//   - #surfaces, pastel: "Needs padding on the left, for every theme. Maybe
//     even an option to align items in the middle." Measured on be9c034a in
//     firefox at 1400×900: 0px of inline padding on both surfaces in all
//     22 themes, so the microlabel, the heading, the prose and the first
//     button stood on the ground's very edge. The package now keeps
//     --kp-surface-padding-inline (the lg step, 16px in every theme) and
//     offers data-kp-surface-align="center", off unless a page writes it.
//   - #nav-cta, formal: "barely any spacing between the letters and the
//     blue box surrounding it." Measured the same way: 0px between the words
//     and the plate's inline edges, where light has 16px, dark 12.8px and
//     titanium 12.8px. Formal's register now pads the plate one lg step.
//
// Read from what the browser laid out [KT13]: the boxes of a surface's
// children against the surface's own box, and the text range of the call
// to action against its link box.
//
// Drill [KT3], firefox, 2026-09-15: with the surface rules taken out and
// css/formal-register.css as it was on be9c034a, both tests are red — every
// theme's surfaces at 0px, formal's call to action at 0px and the centred
// stage not centred. A first version of the centring gave every child auto
// margins, which shrank the wrapping row and stacked its two buttons in
// firefox; the one-line check was added for that and is red on it.

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

const THEMES = /** @type {string[]} */ (JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8')));

/** The least room between a surface's inline edge and its content, in CSS pixels. */
const SURFACE_FLOOR = 12;

/** The least room between the call to action's words and its plate's inline edges, in CSS pixels. */
const CTA_FLOOR = 12;

/** How far off the surface's middle a centred child may sit, in CSS pixels. */
const CENTRE_SLACK = 2;

test.describe.configure({ timeout: 180_000 });

test.beforeEach(async ({ context, page }) => {
    await useEmptyRegister(context);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1400, height: 900 });
});

/** @param {import('@playwright/test').Page} page @param {string} theme */
async function setTheme(page, theme) {
    await page.evaluate((name) => import('/js/theme-core.js').then((m) => m.applyTheme(name)), theme);
    // Not waitForJudging after the switch: in chromium the page's reading
    // never finishes from dark on, and the register is empty, so no block
    // is hidden while it runs.
    await page.waitForFunction((name) => document.documentElement.getAttribute('data-theme') === name, theme);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

test(
    'no content touches a surface’s inline edges, and the centred surface centres, in every theme',
    { tag: ['@sweep', '@component:page-effects'] },
    async ({ page }) => {
        await page.goto('/catalogue/page-effects.html#surfaces');
        await waitForJudging(page);
        /** @type {string[]} */
        const faults = [];
        for (const theme of THEMES) {
            await setTheme(page, theme);
            const surfaces = await page.evaluate(() =>
                [...document.querySelectorAll('#surfaces [data-kp-surface]')].map((surface) => {
                    const box = surface.getBoundingClientRect();
                    const middle = box.left + box.width / 2;
                    const children = [...surface.children].map((child) => {
                        const b = child.getBoundingClientRect();
                        // A row's own box spans the surface; its controls, with the
                        // margins a register gives them (sepia's marginal bracket), are what is laid out.
                        const parts = child.classList.contains('kp-row')
                            ? [...child.children].map((c) => {
                                  const r = c.getBoundingClientRect();
                                  const m = getComputedStyle(c);
                                  return { left: r.left - Number.parseFloat(m.marginLeft), right: r.right + Number.parseFloat(m.marginRight) };
                              })
                            : [b];
                        const left = Math.min(...parts.map((p) => p.left));
                        const right = Math.max(...parts.map((p) => p.right));
                        // A row of two buttons fits the stage in every theme, so it stays one line.
                        const lines = child.classList.contains('kp-row')
                            ? new Set([...child.children].map((c) => Math.round(c.getBoundingClientRect().top))).size
                            : 1;
                        return { name: child.localName + (child.className ? `.${String(child.className).split(' ')[0]}` : ''), left, right, lines };
                    });
                    return {
                        label: `${surface.getAttribute('data-kp-surface')}${surface.hasAttribute('data-kp-surface-align') ? ', centred' : ''}`,
                        centred: surface.getAttribute('data-kp-surface-align') === 'center',
                        left: box.left,
                        right: box.right,
                        middle,
                        children,
                    };
                }),
            );
            expect(surfaces.length, 'the block shows the hero, the app and the centred hero').toBe(3);
            for (const s of surfaces) {
                for (const c of s.children) {
                    const start = c.left - s.left;
                    const end = s.right - c.right;
                    if (start < SURFACE_FLOOR - 0.5) faults.push(`${theme} ${s.label}: ${c.name} ${start.toFixed(1)}px from the start edge`);
                    if (end < SURFACE_FLOOR - 0.5) faults.push(`${theme} ${s.label}: ${c.name} ${end.toFixed(1)}px from the end edge`);
                    if (s.centred && Math.abs((c.left + c.right) / 2 - s.middle) > CENTRE_SLACK)
                        faults.push(`${theme} ${s.label}: ${c.name} is ${((c.left + c.right) / 2 - s.middle).toFixed(1)}px off the middle`);
                    if (c.lines > 1) faults.push(`${theme} ${s.label}: ${c.name} breaks its controls over ${c.lines} lines`);
                }
            }
        }
        expect(faults).toEqual([]);
    },
);

test(
    'formal’s call to action keeps its words off the plate’s edges [Kenny, 2026-09-15]',
    { tag: ['@theme:formal', '@component:navigation'] },
    async ({ page }) => {
        await page.goto('/catalogue/page-effects.html#nav-cta');
        await waitForJudging(page);
        await setTheme(page, 'formal');
        const room = await page.evaluate(() =>
            [...document.querySelectorAll('#nav-cta .kp-nav__link--cta')].map((cta) => {
                const box = cta.getBoundingClientRect();
                const range = document.createRange();
                range.selectNodeContents(cta);
                const text = range.getBoundingClientRect();
                return { start: text.left - box.left, end: box.right - text.right };
            }),
        );
        expect(room.length, 'both bars carry a call to action').toBe(2);
        for (const { start, end } of room) {
            expect(start, 'room before the first letter').toBeGreaterThanOrEqual(CTA_FLOOR);
            expect(end, 'room after the last letter').toBeGreaterThanOrEqual(CTA_FLOOR);
        }
    },
);
