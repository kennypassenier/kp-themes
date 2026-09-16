// Four of Kenny's catalogue rejections of 2026-09-16 [scope-107], one per
// theme, measured on the catalogue pages he read them on.
//
// scope-107 is the rule that nothing is released while an element is not
// approved. Of the thirteen rejections his review recorded, these four are
// blueprint's, sepia's, shade-light's and phantom's:
//
//   1. blueprint, `media--laurels`: "we hadden voor blueprint toch zo een
//      cool meetkader? kan dat niet rond de items hier? Want nu is er enkel
//      de linkerbovenhoek?" The register printed `⌐` — one corner of the
//      measurement frame — before each claim. Now each claim stands in the
//      whole frame: four corner brackets, on its own box.
//   2. sepia, `table--datatable-states`: "De 'Try again' tekst in die knop
//      moet hier in het wit zijn." The retry button is transparent over the
//      destructive plate and took `--foreground`, dark brown on red.
//   3. shade-light, `button--variants`: "de primary knop heeft geen
//      klikanimatie, of toch niet zichtbaar." Its press was a colour step
//      of 22/9/2 of a channel away from the hover it always starts from.
//   4. phantom, `page--theme-menu-react` (and `page--theme-menu`, which he
//      says he approved too quickly): "niet veel te zien?" The register put
//      the paperclip `clip-path` on `.kp-theme-menu`, the positioning
//      wrapper, and a clip-path clips descendants positioned outside the
//      box — so the whole panel was cut away.
//
// Measured, never inferred [KT13]: the frame is read out of the paint, the
// two colours out of the resolved style with the contrast computed here,
// the press out of the difference between three real states, and the menu
// out of the ink inside each option's own box.
//
// Drills [KT3], performed 2026-09-16 in firefox and restored:
//   - `background-image` removed from `[data-theme='blueprint'] .kp-laurels
//     > li::before` → "the measure frame stands on all four sides" red, 0
//     of 4 corners on every claim;
//   - `color` removed from `[data-theme='sepia'] [data-kp-datatable-failed]
//     .kp-button[data-kp-datatable-retry]` → "Try again reads white" red at
//     rgb(59, 40, 22), 1.92:1;
//   - `translate` and `box-shadow` removed from `[data-theme='shade-light']
//     .kp-button--primary:active:not(:disabled)` → "the press is visible"
//     red, nothing but the ground moved;
//   - `.kp-theme-menu` put back into phantom's clipped surface list →
//     "the theme menu paints its options" red, 0 of 8 options carrying ink
//     in both blocks.

import { expect, test } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

// Kenny read these blocks zoomed, at devicePixelRatio 2.222. Nothing
// asserted below is a function of that ratio — a resolved colour, a
// contrast, a state's own difference from another state, and ink counted
// against the scale the shot came back at — so these run at the suite's
// own ratio and the paint readings scale themselves.

/**
 * A catalogue page in one theme, every block shown.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 * @param {string} theme
 */
async function open(page, url, theme) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await useEmptyRegister(page.context());
    await page.setViewportSize({ width: 1400, height: 1000 });
    await page.goto(url);
    await waitForJudging(page);
    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
    await expect.poll(() => page.evaluate((name) => document.documentElement.getAttribute('data-theme') === name, theme)).toBe(true);
    // A judged block is hidden until Kenny asks for it; the paint is the
    // same either way, and this is what his "Show blocks already judged"
    // does.
    await page.evaluate(() => {
        for (const block of document.querySelectorAll('.cat-block[hidden]')) block.removeAttribute('hidden');
    });
    await page.evaluate(() => document.fonts.ready);
}

/** The computed value of a token, as the browser would paint it. */
const paint = (/** @type {import('@playwright/test').Page} */ page, /** @type {string} */ token) =>
    page.evaluate((t) => {
        const probe = document.createElement('span');
        probe.style.color = `var(${t})`;
        document.body.append(probe);
        const value = getComputedStyle(probe).color;
        probe.remove();
        return value;
    }, token);

/** WCAG contrast of two `rgb()` strings. */
function contrast(/** @type {string} */ a, /** @type {string} */ b) {
    const channels = (/** @type {string} */ s) => (s.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
    const luminance = (/** @type {number[]} */ c) => {
        const [r, g, bl] = c.map((v) => {
            const n = v / 255;
            return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
    };
    const [hi, lo] = [luminance(channels(a)), luminance(channels(b))].sort((m, n) => n - m);
    return (hi + 0.05) / (lo + 0.05);
}

/**
 * The paint of a page rectangle, as device pixels.
 *
 * The clip is in CSS pixels and the shot comes back at the ratio the page
 * is rendered at, so the scale is read off the bitmap rather than assumed.
 *
 * @param {import('@playwright/test').Page} page
 * @param {{ x: number, y: number, width: number, height: number }} clip
 * @returns {Promise<{ at: (x: number, y: number) => number[], width: number, height: number, scale: number }>}
 */
async function pixels(page, clip) {
    const shot = (await page.screenshot({ clip, fullPage: true, animations: 'disabled', caret: 'hide' })).toString('base64');
    const { data, width, height } = await page.evaluate(async (b64) => {
        const bitmap = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        const context = /** @type {OffscreenCanvasRenderingContext2D} */ (canvas.getContext('2d'));
        context.drawImage(bitmap, 0, 0);
        const image = context.getImageData(0, 0, bitmap.width, bitmap.height);
        return { data: [...image.data], width: image.width, height: image.height };
    }, shot);
    return {
        at: (x, y) => data.slice((y * width + x) * 4, (y * width + x) * 4 + 3),
        width,
        height,
        scale: width / clip.width,
    };
}

/** Whether a pixel differs from a ground by more than an antialiasing wobble. */
const differs = (/** @type {number[]} */ pixel, /** @type {number[]} */ ground, threshold = 24) =>
    Math.abs(pixel[0] - ground[0]) + Math.abs(pixel[1] - ground[1]) + Math.abs(pixel[2] - ground[2]) > threshold;

test.describe('blueprint: the laurels stand in the measure frame [scope-107]', { tag: ['@theme:blueprint', '@component:media'] }, () => {
    test('the measure frame stands on all four sides of every claim', async ({ page }) => {
        await open(page, '/catalogue/media.html', 'blueprint');
        const boxes = await page.evaluate(() =>
            [...document.querySelectorAll('#laurels .kp-laurels > li')].map((li) => {
                const r = li.getBoundingClientRect();
                // Rounded outward: a claim's box is fractional, and the
                // brackets at its far edges sit on the last fraction of a
                // pixel — a clip rounded down cuts exactly the two edges
                // this test exists to find.
                const x = Math.floor(r.x + scrollX);
                const y = Math.floor(r.y + scrollY);
                return {
                    x,
                    y,
                    width: Math.ceil(r.x + scrollX + r.width) - x,
                    height: Math.ceil(r.y + scrollY + r.height) - y,
                    label: (li.querySelector('b')?.textContent ?? '').trim(),
                };
            }),
        );
        expect(boxes.length, 'the block shows its claims').toBeGreaterThan(0);

        const ground = (await paint(page, '--background')).match(/\d+/g).slice(0, 3).map(Number);
        const found = [];
        for (const box of boxes) {
            const map = await pixels(page, { x: box.x, y: box.y, width: box.width, height: box.height });
            const band = Math.max(3, Math.round(map.scale * 2));
            // An edge is read as a band of device pixels along it; a column
            // (or row) counts as inked when any pixel in the band differs
            // from the page's own ground.
            const inkedColumns = (/** @type {'top' | 'bottom'} */ edge) => {
                const rows = edge === 'top' ? [0, band] : [map.height - band, map.height];
                const columns = [];
                for (let x = 0; x < map.width; x++) {
                    for (let y = rows[0]; y < rows[1]; y++)
                        if (differs(map.at(x, y), ground)) {
                            columns.push(x);
                            break;
                        }
                }
                return columns;
            };
            const inkedRows = (/** @type {'left' | 'right'} */ edge) => {
                const columns = edge === 'left' ? [0, band] : [map.width - band, map.width];
                const rows = [];
                for (let y = 0; y < map.height; y++) {
                    for (let x = columns[0]; x < columns[1]; x++)
                        if (differs(map.at(x, y), ground)) {
                            rows.push(y);
                            break;
                        }
                }
                return rows;
            };
            for (const [edge, inked, span] of /** @type {const} */ ([
                ['top', inkedColumns('top'), map.width],
                ['bottom', inkedColumns('bottom'), map.width],
                ['left', inkedRows('left'), map.height],
                ['right', inkedRows('right'), map.height],
            ])) {
                const near = inked.some((v) => v <= span * 0.2);
                const far = inked.some((v) => v >= span * 0.8);
                if (!near) found.push(`"${box.label}": the ${edge} edge has no bracket at its start`);
                if (!far) found.push(`"${box.label}": the ${edge} edge has no bracket at its end`);
                // Brackets, not a box: the arm is 0.6rem, so an edge that
                // is inked end to end is the rectangle this theme refuses.
                if (inked.length > span * 0.6)
                    found.push(
                        `"${box.label}": the ${edge} edge is inked over ${inked.length} of ${Math.round(span)} device px — that is a box, not four brackets`,
                    );
            }
        }
        expect(found, found.join('\n')).toEqual([]);
    });
});

test.describe('sepia: the failed data table’s Try again [scope-107]', { tag: ['@theme:sepia', '@component:datatable'] }, () => {
    test('Try again reads white on the destructive plate, and nothing else on an alert does', async ({ page }) => {
        await open(page, '/catalogue/table.html', 'sepia');
        const measured = await page.evaluate(() => {
            const button = /** @type {HTMLElement} */ (document.querySelector('#datatable-states [data-kp-datatable-retry]'));
            const alert = /** @type {HTMLElement} */ (button.closest('[data-kp-datatable-failed]'));
            const own = getComputedStyle(button);
            return {
                ink: own.color,
                ownGround: own.backgroundColor,
                plate: getComputedStyle(alert).backgroundColor,
                labelInk: getComputedStyle(/** @type {HTMLElement} */ (alert.querySelector('.kp-alert__label'))).color,
            };
        });
        const white = await paint(page, '--destructive-foreground');
        const pageInk = await paint(page, '--foreground');

        // The button draws no plate of its own in this register, at rest or
        // otherwise, so the ground under its label is the alert's.
        expect(measured.ownGround, 'the retry button is transparent over the plate').toBe('rgba(0, 0, 0, 0)');
        expect(measured.ink, 'the label is the plate’s own ink, not the page’s').toBe(white);
        expect(measured.ink, 'the label is not the page ink Kenny rejected').not.toBe(pageInk);

        const now = contrast(measured.ink, measured.plate);
        const before = contrast(pageInk, measured.plate);
        expect(before, `the rejected ink measured ${before.toFixed(2)}:1 on the plate`).toBeLessThan(3);
        expect(now, `Try again measures ${now.toFixed(2)}:1 on the plate`).toBeGreaterThanOrEqual(4.5);
        // It reads exactly as loud as the alert's own label beside it.
        expect(measured.ink).toBe(measured.labelInk);
    });
});

test.describe('shade-light: the primary button’s press [scope-107]', { tag: ['@theme:shade-light', '@component:button'] }, () => {
    test('the press is visible: it moves with the light and its shade turns inward, from rest and from hover', async ({ page }) => {
        await open(page, '/catalogue/button.html', 'shade-light');
        const button = page.locator('#variants .kp-button--primary').first();
        await expect(button).toBeVisible();
        const read = () =>
            button.evaluate((el) => {
                const s = getComputedStyle(el);
                return { translate: s.translate, boxShadow: s.boxShadow, background: s.backgroundColor };
            });

        const rest = await read();
        await button.hover();
        const hovered = await read();
        await page.mouse.down();
        // The press is instant by design (`transition-duration: 0s`), but a
        // state is still read until it is the value [KT16].
        await expect.poll(async () => (await read()).translate).not.toBe(hovered.translate);
        const pressed = await read();
        await page.mouse.up();

        const offset = (/** @type {string} */ value) => (value === 'none' ? [0, 0] : (value.match(/-?[\d.]+/g) ?? []).slice(0, 2).map(Number));
        const [dx, dy] = offset(pressed.translate);

        expect(pressed.translate, `the pressed button stands at ${pressed.translate}, resting at ${rest.translate}`).not.toBe(rest.translate);
        expect(Math.abs(dx) + Math.abs(dy), 'the press moves at least a whole CSS pixel').toBeGreaterThanOrEqual(1);
        expect(pressed.boxShadow, 'the pressed shade is drawn inside the button').toContain('inset');
        expect(pressed.boxShadow, 'the shade is not the one it rests under').not.toBe(rest.boxShadow);
        // The fault Kenny reported: a press always starts from hover, and
        // from there only the ground moved, by a step nobody sees.
        expect(pressed.translate, 'the press differs from the hover it starts from').not.toBe(hovered.translate);
        expect(pressed.boxShadow, 'the pressed shade differs from the hovered one').not.toBe(hovered.boxShadow);
    });
});

test.describe('phantom: the theme menu is painted, not clipped away [scope-107]', { tag: ['@theme:phantom', '@component:page'] }, () => {
    for (const [name, block] of /** @type {const} */ ([
        ['the React shape', '#theme-menu-react'],
        ['the markup shape', '#theme-menu'],
    ])) {
        test(`${name}: the theme menu paints its options, each with visible text`, async ({ page }) => {
            await open(page, '/catalogue/page.html', 'phantom');
            const panel = await page.evaluate((id) => {
                const root = /** @type {HTMLElement} */ (document.querySelector(id));
                const list = /** @type {HTMLElement} */ (root.querySelector('.kp-popover'));
                const r = list.getBoundingClientRect();
                return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height };
            }, block);
            expect(panel.width, `${name}: the panel has a box`).toBeGreaterThan(80);

            const ground = (await paint(page, '--background')).match(/\d+/g).slice(0, 3).map(Number);
            const boxes = await page.evaluate((id) => {
                const root = /** @type {HTMLElement} */ (document.querySelector(id));
                const options = [...root.querySelectorAll('[data-kp-theme]')].slice(0, 8);
                return options.map((option) => {
                    // The label is a child in the React shape and a text node
                    // in the markup one; a Range over the contents reads both.
                    const range = document.createRange();
                    range.selectNodeContents(option);
                    const rects = [...range.getClientRects()].filter((r) => r.width > 4 && r.height > 4);
                    const r = rects[rects.length - 1] ?? option.getBoundingClientRect();
                    return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height, label: (option.textContent ?? '').trim() };
                });
            }, block);
            expect(boxes.length, `${name}: the menu holds options`).toBe(8);

            const dark = [];
            for (const box of boxes) {
                const map = await pixels(page, box);
                let ink = 0;
                for (let y = 0; y < map.height; y++) for (let x = 0; x < map.width; x++) if (differs(map.at(x, y), ground, 40)) ink++;
                if (ink < 20) dark.push(`${name} "${box.label}": ${ink} inked device px in its own box — nothing is painted there`);
            }
            expect(dark, dark.join('\n')).toEqual([]);
        });
    }
});
