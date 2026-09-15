// Kenny's retro notes of 2026-09-15, read where he read them.
//
// He judged retro on the review page in FireDragon and rejected four blocks'
// worth of it: a pressed button that shifted its row (button.html#variants),
// a legend struck through by its fieldset's groove (field.html#narrow), a
// scrollbar that was only a down arrow, twice on a menu (overlays.html
// #confirm, #menu, #menu-extremes, #tooltip), and a side navigation darker
// than the bar above it (navigation.html#app-shell, #sidenav-over). Each is
// a behaviour measured here, never a picture.
//
// Drilled per KT3 on 2026-09-15: every test ran against the register and
// modules of be9c034 and went red (ten of eleven, in firefox), with the
// measured values beside each; the eleventh is a guard and says why.

import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';
import { contrast as contrast01 } from '../gates/colour.mjs';

const THEME_NAMES = JSON.parse(readFileSync(new globalThis.URL('../themes/order.json', import.meta.url), 'utf8'));

/** @param {number[]} ink 0..255 @param {number[]} ground 0..255 */
const contrast = (ink, ground) =>
    contrast01(
        ink.map((v) => v / 255),
        ground.map((v) => v / 255),
    );

/** @param {import('@playwright/test').Page} page @param {string} theme */
const wear = async (page, theme) => {
    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
    await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(theme);
};

/** @param {import('@playwright/test').Page} page @param {string} url @param {string} [theme] */
const openCatalogue = async (page, url, theme = 'retro') => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await useEmptyRegister(page.context());
    await page.goto(url);
    await waitForJudging(page);
    await wear(page, theme);
};

/**
 * The pixels of a region of the page as [r, g, b] rows, decoded in the page.
 *
 * @param {import('@playwright/test').Page} page
 * @param {{ x: number, y: number, width: number, height: number }} clip
 * @returns {Promise<number[][][]>}
 */
const pixels = async (page, clip) => {
    const png = await page.screenshot({ clip });
    return page.evaluate(
        async (src) => {
            const image = await new Promise((resolve) => {
                const im = new Image();
                im.onload = () => resolve(im);
                im.src = src;
            });
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));
            ctx.drawImage(image, 0, 0);
            const data = ctx.getImageData(0, 0, image.width, image.height).data;
            const rows = [];
            for (let y = 0; y < image.height; y++) {
                const row = [];
                for (let x = 0; x < image.width; x++)
                    row.push([data[(y * image.width + x) * 4], data[(y * image.width + x) * 4 + 1], data[(y * image.width + x) * 4 + 2]]);
                rows.push(row);
            }
            return rows;
        },
        `data:image/png;base64,${png.toString('base64')}`,
    );
};

/* ───────────────────────────── 1 · the pressed button keeps its place */

test.describe('retro: pressing a button moves its label, not the interface', { tag: ['@theme:retro', '@component:button'] }, () => {
    test('every button box and every neighbour stays where it was while a button is held down', async ({ page }) => {
        // Before: the pressed button grew by 1px and pushed every later button
        // in its row 1px along (catalogue/button.html#variants, both engines);
        // `Small` grew by 7px and `Large` shrank by 9px, and in the sizes row
        // the moved baseline moved the other two buttons 1px down.
        await openCatalogue(page, '/catalogue/button.html');
        const buttons = page.locator('.cat-stage :is(.kp-button, .kp-icon-button):not(:disabled)');
        const count = await buttons.count();
        expect(count).toBeGreaterThan(10);
        const moved = [];
        for (let i = 0; i < count; i++) {
            const button = buttons.nth(i);
            if (!(await button.isVisible())) continue;
            await button.scrollIntoViewIfNeeded();
            // The layout box of the button itself (offsets ignore the paint-only
            // translate) and the rects of everything beside it in its row.
            const read = () =>
                button.evaluate((el) => {
                    const self = /** @type {HTMLElement} */ (el);
                    const row = [...(self.parentElement?.children ?? [])].filter((c) => c !== self);
                    return [
                        `self ${self.offsetLeft},${self.offsetTop},${self.offsetWidth},${self.offsetHeight}`,
                        ...row.map((c, j) => {
                            const r = c.getBoundingClientRect();
                            return `#${j} ${r.x.toFixed(2)},${r.y.toFixed(2)},${r.width.toFixed(2)},${r.height.toFixed(2)}`;
                        }),
                    ];
                });
            const rest = await read();
            const box = await button.boundingBox();
            if (!box) continue;
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await page.mouse.down();
            const pressed = await read();
            const step = await button.evaluate((el) => getComputedStyle(el).translate);
            await page.mouse.up();
            await page.mouse.move(0, 0);
            const label = (await button.textContent())?.trim().slice(0, 24);
            const changed = rest.flatMap((line, j) => (line === pressed[j] ? [] : [`${line} → ${pressed[j]}`]));
            if (changed.length) moved.push(`${label}: ${changed.join('; ')}`);
            // The label still steps: the pressed control is painted a pixel over.
            if (step !== '1px 1px') moved.push(`${label}: pressed translate is ${step}, not 1px 1px`);
        }
        expect(moved).toEqual([]);
    });
});

/* ───────────────────────────── 2 · a legend is never struck through */

/**
 * Every legend on the page whose fieldset paints anything behind its words:
 * the words' box read with the legend hidden, once with the fieldset's own
 * paint and once without it. A difference that spans a row or three across
 * the words is a line through them.
 *
 * @param {import('@playwright/test').Page} page
 */
const struckLegends = async (page) => {
    const legends = page.locator('.cat-stage fieldset > legend');
    const found = [];
    for (let i = 0; i < (await legends.count()); i++) {
        const legend = legends.nth(i);
        if (!(await legend.isVisible())) continue;
        await legend.scrollIntoViewIfNeeded();
        const words = await legend.evaluate((el) => {
            const range = document.createRange();
            range.selectNodeContents(el);
            const r = range.getBoundingClientRect();
            return { x: r.x, y: r.y, width: Math.max(1, r.width), height: Math.max(1, r.height) };
        });
        await legend.evaluate((el) => /** @type {HTMLElement} */ (el).style.setProperty('visibility', 'hidden'));
        const withPaint = await pixels(page, words);
        await legend.evaluate((el) => {
            const fieldset = /** @type {HTMLElement} */ (el.parentElement);
            fieldset.dataset.kpTestStyle = fieldset.getAttribute('style') ?? '';
            for (const [p, v] of [
                ['box-shadow', 'none'],
                ['border-color', 'transparent'],
                ['background', 'none'],
                ['outline', 'none'],
            ])
                fieldset.style.setProperty(p, v, 'important');
        });
        const without = await pixels(page, words);
        await legend.evaluate((el) => {
            /** @type {HTMLElement} */ (el).style.removeProperty('visibility');
            const fieldset = /** @type {HTMLElement} */ (el.parentElement);
            if (fieldset.dataset.kpTestStyle) fieldset.setAttribute('style', fieldset.dataset.kpTestStyle);
            else fieldset.removeAttribute('style');
            delete fieldset.dataset.kpTestStyle;
        });
        const rows = withPaint.map((row, y) => {
            const differing = row.filter((px, x) => px.reduce((sum, v, c) => sum + Math.abs(v - without[y][x][c]), 0) > 24).length;
            return Math.round((100 * differing) / row.length);
        });
        const across = rows.filter((share) => share >= 80).length;
        if (across > 0 && across <= 3) found.push(`"${(await legend.textContent())?.trim()}": rows across the words ${rows.join(',')}`);
    }
    return found;
};

test.describe('retro: a label never runs into the next control', { tag: ['@theme:retro', '@component:field'] }, () => {
    test('no legend on the field page has its fieldset groove through its words', async ({ page }) => {
        // Before: all four legends on catalogue/field.html, among them "Is
        // anyone at risk?" in #narrow, carried the groove's two hairlines at
        // 100% of the words' width, 10.8px below the top of a 21.6px legend.
        await openCatalogue(page, '/catalogue/field.html');
        expect(await struckLegends(page)).toEqual([]);
    });

    test('no label or legend box overlaps another control on the field page', async ({ page }) => {
        // A guard, not the drill: this stayed green on be9c034, because the
        // fault Kenny saw was paint through the words, not one box over
        // another. Searched in all 22 themes at 1280px and 360px on
        // 2026-09-15, it found nothing in any component block.
        await openCatalogue(page, '/catalogue/field.html');
        const overlaps = await page.evaluate(() => {
            const out = [];
            const labels = [...document.querySelectorAll('.cat-stage :is(.kp-field__label, label, legend)')].filter((l) => l.getClientRects().length);
            const controls = [
                ...document.querySelectorAll(
                    '.cat-stage :is(.kp-field__input, fieldset, select, textarea, input:not([type=radio], [type=checkbox], [type=hidden]), .kp-combobox)',
                ),
            ].filter((c) => c.getClientRects().length);
            for (const l of labels) {
                const r = l.getBoundingClientRect();
                for (const c of controls) {
                    if (c.contains(l) || l.contains(c)) continue;
                    const q = c.getBoundingClientRect();
                    const x = Math.min(r.right, q.right) - Math.max(r.left, q.left);
                    const y = Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top);
                    if (x > 1 && y > 1) out.push(`${l.textContent?.trim()} ∩ ${c.className} ${x.toFixed(1)}×${y.toFixed(1)}`);
                }
            }
            return out;
        });
        expect(overlaps).toEqual([]);
    });
});

test(
    'no theme strikes a legend through with its fieldset’s paint [retro notes, 2026-09-15]',
    { tag: ['@component:field', '@sweep', '@component:catalogue'] },
    async ({ page }) => {
        // The search behind Kenny's retro note, kept: on 2026-09-15 retro was
        // the only one of the 22 themes with a line through a legend.
        await openCatalogue(page, '/catalogue/field.html', THEME_NAMES[0]);
        const found = [];
        for (const theme of THEME_NAMES) {
            await wear(page, theme);
            for (const line of await struckLegends(page)) found.push(`${theme} ${line}`);
        }
        expect(found).toEqual([]);
    },
);

/* ───────────────────────────── 3 · a window's scrollbar, whole and honest */

/**
 * The boxes under `scope` that draw retro's scrollbar, with their state.
 *
 * @param {import('@playwright/test').Locator} scope
 */
const bars = (scope) =>
    scope.evaluate((root) =>
        [root, ...root.querySelectorAll('*')]
            .filter((el) => (getComputedStyle(el).backgroundImage.match(/linear-gradient\(/g) ?? []).length >= 30)
            .map((el) => {
                const box = /** @type {HTMLElement} */ (el);
                const style = getComputedStyle(box);
                return {
                    what: box.className,
                    overflowing: box.hasAttribute('data-kp-popover-overflowing'),
                    scrolls: box.scrollHeight > box.clientHeight + 1,
                    native: style.scrollbarWidth,
                };
            }),
    );

/**
 * The darkest channel in the up arrow's glyph of a box's drawn bar.
 *
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').Locator} box
 */
const arrowInk = async (page, box) => {
    await box.scrollIntoViewIfNeeded();
    const clip = await box.evaluate((el) => {
        const b = /** @type {HTMLElement} */ (el);
        const r = b.getBoundingClientRect();
        const inset = parseFloat(getComputedStyle(b).getPropertyValue('--kp-scrollbar-inset')) || 0;
        const height = Math.min(16, b.clientHeight / 2 - inset);
        const top = r.top + b.clientTop + inset + Math.floor((height - 4) / 2);
        const right = r.left + b.clientLeft + b.clientWidth - inset;
        return { x: right - 16 + 4, y: top, width: 7, height: 4 };
    });
    const rows = await pixels(page, clip);
    return Math.min(...rows.flat().map((px) => Math.min(...px)));
};

test.describe('retro: an overlay draws one whole scrollbar, disabled unless it scrolls', { tag: ['@theme:retro', '@component:overlays'] }, () => {
    test('on the catalogue: one bar per overlay, disabled on the short ones, enabled on the long menu', async ({ page }) => {
        // Before: no box drew a scrollbar (0 found); every overlay wore the
        // select's arrow button with 33.6px of end padding, twice on a menu
        // (the popover and its list both matched).
        await openCatalogue(page, '/catalogue/overlays.html');
        const report = [];
        for (const id of ['confirm', 'menu', 'menu-extremes', 'tooltip']) {
            const overlays = page.locator(`#${id} .cat-stage :is(.kp-popover, .kp-dialog):visible`);
            for (let i = 0; i < (await overlays.count()); i++) {
                const overlay = overlays.nth(i);
                const found = await bars(overlay);
                if (found.length !== 1) {
                    report.push(`${id} #${i}: ${found.length} bars`);
                    continue;
                }
                const [bar] = found;
                if (bar.overflowing !== bar.scrolls) report.push(`${id} #${i}: scrolls ${bar.scrolls} but overflowing ${bar.overflowing}`);
                if (bar.native !== 'none') report.push(`${id} #${i}: the platform's scrollbar is ${bar.native}`);
                const ink = await arrowInk(page, overlay);
                if (bar.scrolls && ink > 40) report.push(`${id} #${i}: enabled, but the arrow's darkest channel is ${ink}`);
                if (!bar.scrolls && ink < 60) report.push(`${id} #${i}: disabled, but the arrow's darkest channel is ${ink}`);
            }
            const arrowPadding = await page
                .locator(`#${id} .cat-stage *`)
                .evaluateAll(
                    (els) =>
                        els.filter(
                            (el) =>
                                getComputedStyle(el).appearance === 'none' &&
                                el.tagName !== 'SELECT' &&
                                getComputedStyle(el).paddingInlineEnd === '33.6px',
                        ).length,
                );
            if (arrowPadding) report.push(`${id}: ${arrowPadding} element(s) still carry the select's arrow padding`);
        }
        const long = page.locator('#menu-extremes .cat-stage .kp-popover').nth(1);
        expect(await long.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(true);
        expect(report).toEqual([]);
    });

    test('the long menu’s bar works: an arrow scrolls a line, the thumb drags, and the thumb follows', async ({ page }) => {
        await openCatalogue(page, '/catalogue/overlays.html');
        const menu = page.locator('#menu-extremes .cat-stage .kp-popover').nth(1);
        await menu.scrollIntoViewIfNeeded();
        const geometry = () =>
            menu.evaluate((el) => {
                const b = /** @type {HTMLElement} */ (el);
                const r = b.getBoundingClientRect();
                return {
                    right: r.left + b.clientLeft + b.clientWidth - 2,
                    top: r.top + b.clientTop + 2,
                    bottom: r.top + b.clientTop + b.clientHeight - 2,
                    scroll: b.scrollTop,
                };
            });
        const g = await geometry();
        // The page scrolls to keep the whole menu in view first: the bottom arrow is near the fold.
        await page.mouse.click(g.right - 8, g.bottom - 8);
        await expect.poll(async () => (await geometry()).scroll).toBeGreaterThan(0);
        const afterLine = (await geometry()).scroll;
        const progress = await menu.evaluate((el) => Number(/** @type {HTMLElement} */ (el).style.getPropertyValue('--kp-scroll-progress')));
        expect(progress).toBeGreaterThan(0);
        // Drag the thumb by its middle, 100px down.
        const now = await geometry();
        const grip = await menu.evaluate((el) => {
            const b = /** @type {HTMLElement} */ (el);
            const track = b.clientHeight - 4 - 32;
            const thumb = Math.max(8, track * (b.clientHeight / b.scrollHeight));
            return 16 + (track - thumb) * (b.scrollTop / (b.scrollHeight - b.clientHeight)) + thumb / 2;
        });
        await page.mouse.move(now.right - 8, now.top + grip);
        await page.mouse.down();
        await page.mouse.move(now.right - 8, now.top + grip + 100, { steps: 5 });
        await page.mouse.up();
        expect((await geometry()).scroll).toBeGreaterThan(afterLine + 50);
    });
});

/** The fixture both channels render: a menu and a dialog each. */
const CHANNELS = [
    { name: 'framework-free', root: '#plain', menu: '[data-test="plain-menu"]', trigger: '[data-test="plain-menu-trigger"]' },
    { name: 'React', root: '#react-components', menu: '.kp-popover', trigger: '[aria-haspopup="menu"]' },
];

for (const channel of CHANNELS) {
    test.describe(`retro: the drawn scrollbar, ${channel.name}`, { tag: ['@theme:retro', '@component:overlays'] }, () => {
        test.beforeEach(async ({ page }) => {
            await page.addInitScript(() => {
                try {
                    localStorage.setItem('theme', 'retro');
                } catch {
                    // no storage: the test wears the theme itself below
                }
            });
            await page.goto('/tests/fixtures/components.html');
            await page.waitForSelector(`${channel.root} [data-test="dialog-open"]`);
            // This fixture loads no register of its own.
            await page.addStyleTag({ url: '/css/retro-register.css' });
            await wear(page, 'retro');
        });

        test('a menu draws one bar: disabled while it fits, enabled once its content is taller', async ({ page }) => {
            const root = page.locator(channel.root);
            await root.locator(channel.trigger).first().click();
            const menu = root.locator(channel.menu).first();
            await expect(menu).toBeVisible();
            let found = await bars(menu);
            expect(found.map((b) => [b.overflowing, b.native])).toEqual([[false, 'none']]);
            expect(await arrowInk(page, menu)).toBeGreaterThanOrEqual(60);

            await menu.evaluate((el) => {
                /** @type {HTMLElement} */ (el).style.maxBlockSize = '80px';
                /** @type {HTMLElement} */ (el.firstElementChild).style.minBlockSize = '300px';
            });
            await expect.poll(() => menu.evaluate((el) => el.hasAttribute('data-kp-popover-overflowing'))).toBe(true);
            found = await bars(menu);
            expect(found.map((b) => [b.overflowing, b.scrolls])).toEqual([[true, true]]);
            expect(await arrowInk(page, menu)).toBeLessThanOrEqual(40);
        });

        test('a dialog draws exactly one bar, on the box that scrolls', async ({ page }) => {
            const root = page.locator(channel.root);
            await root.locator('[data-test="dialog-open"]').click();
            const dialog = root.locator('dialog.kp-dialog');
            await expect(dialog).toBeVisible();
            const found = await bars(dialog);
            expect(found.length).toBe(1);
            expect(found[0].overflowing).toBe(found[0].scrolls);
        });
    });
}

/* ───────────────────────────── 4 · the side navigation wears the bar's ground */

test.describe('retro: the side navigation has the menu strip’s ground', { tag: ['@theme:retro', '@component:navigation'] }, () => {
    test('in the shell and over the page, the rail’s ground is the bar’s and its links read at 4.5:1', async ({ page }) => {
        // Before: the rail's ground was rgb(97,97,97) against the bar's
        // rgb(191,191,191), and its links read at 2.81:1.
        await openCatalogue(page, '/catalogue/navigation.html');
        const read = await page.evaluate(() => {
            const ctx = /** @type {CanvasRenderingContext2D} */ (document.createElement('canvas').getContext('2d', { willReadFrequently: true }));
            /** @param {string} css */
            const rgba = (css) => {
                ctx.clearRect(0, 0, 1, 1);
                ctx.fillStyle = '#000';
                ctx.fillStyle = css;
                ctx.fillRect(0, 0, 1, 1);
                const d = ctx.getImageData(0, 0, 1, 1).data;
                return [d[0], d[1], d[2], d[3] / 255];
            };
            /** @param {Element} el */
            const ground = (el) => {
                const layers = [];
                for (let e = /** @type {Element | null} */ (el); e; e = e.parentElement) {
                    const c = rgba(getComputedStyle(e).backgroundColor);
                    if (c[3] > 0) layers.push(c);
                    if (c[3] >= 1) break;
                }
                let out = [255, 255, 255];
                for (const c of layers.reverse()) out = out.map((v, i) => Math.round(c[i] * c[3] + v * (1 - c[3])));
                return out;
            };
            const bar = ground(/** @type {Element} */ (document.querySelector('#app-shell .kp-nav')));
            return ['app-shell', 'sidenav-over'].map((id) => {
                const rail = /** @type {Element} */ (document.querySelector(`#${id} .kp-sidenav`));
                const link = /** @type {Element} */ (rail.querySelector('.kp-sidenav__link:not([aria-current])'));
                return { id, bar, rail: ground(rail), ink: rgba(getComputedStyle(link).color).slice(0, 3), linkGround: ground(link) };
            });
        });
        for (const r of read) {
            expect(r.rail, `${r.id}: the rail's ground`).toEqual(r.bar);
            expect(contrast(r.ink, r.linkGround), `${r.id}: a link on the rail`).toBeGreaterThanOrEqual(4.5);
        }
    });
});
