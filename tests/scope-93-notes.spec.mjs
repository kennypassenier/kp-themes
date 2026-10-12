// Kenny's per-theme answers of 2026-09-15 [scope-93], read where he read them.
//
// hc-filled-hover (high-contrast, removed 2026-10-08, its test went with it): the filled
// Save changes and Delete account showed no hover, because their hover ground
// was their border colour, which is their fill. light-indigo "Ook daar weg",
// and on navigation#app-shell "blauw moet uit navbar": no indigo left in a
// navigation in light. retro-scrollbars, retro's pressed destructive button and retro's call
// to action (retro removed 2026-10-09, their tests went with it). cta-plates "Gelijktrekken":
// room between a call to action's words and its plate. Each is a measured
// property here, never a picture (scope-32, scope-73).
//
// Drilled per KT3 on 2026-09-15 in firefox against the registers of
// 74d9ac73, each red with the value beside it below.

import { expect, test } from '@playwright/test';
import { contrast, distance } from '../gates/colour.mjs';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} url
 * @param {string} theme
 */
const open = async (page, url, theme) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await useEmptyRegister(page.context());
    await page.goto(url);
    await waitForJudging(page);
    await page.evaluate((name) => document.documentElement.setAttribute('data-theme', name), theme);
    await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(theme);
    await page.evaluate(() => {
        const ctx = /** @type {CanvasRenderingContext2D} */ (document.createElement('canvas').getContext('2d', { willReadFrequently: true }));
        /** Any CSS colour as [r, g, b, a], channels 0..1. @param {string} css */
        const rgba = (css) => {
            ctx.clearRect(0, 0, 1, 1);
            ctx.fillStyle = '#000';
            ctx.fillStyle = css;
            ctx.fillRect(0, 0, 1, 1);
            const d = ctx.getImageData(0, 0, 1, 1).data;
            return [d[0] / 255, d[1] / 255, d[2] / 255, d[3] / 255];
        };
        /** The opaque colour an element's box shows, its translucent ancestors composited. @param {Element | null} el */
        const ground = (el) => {
            const layers = [];
            for (let e = el; e; e = e.parentElement) {
                const c = rgba(getComputedStyle(e).backgroundColor);
                if (c[3] === 0) continue;
                layers.push(c);
                if (c[3] >= 1) break;
            }
            let acc = [1, 1, 1];
            for (const c of layers.reverse()) acc = acc.map((v, i) => c[i] * c[3] + v * (1 - c[3]));
            return acc;
        };
        Object.assign(window, { kpRgba: rgba, kpGround: ground });
    });
};

/** @param {number[]} c */
const rgb = (c) => /** @type {[number, number, number]} */ (c.slice(0, 3));

/* ───────────────────────────── 2 · light: no indigo in a navigation */

test.describe(
    'light: no indigo anywhere in a navigation [navigation, page-effects#nav-cta]',
    { tag: ['@theme:light', '@component:navigation'] },
    () => {
        /**
         * Every paint of every element under `roots` that computes to the primary
         * or the link colour: ink, ground, a drawn border, an underline, a shadow.
         *
         * @param {import('@playwright/test').Page} page
         * @param {string} roots
         * @param {string} state
         */
        const indigo = (page, roots, state) =>
            page.evaluate(
                ([roots, state]) => {
                    /** The elements to read: every match of `roots`, or the pointed-at element's item and what is in it. */
                    const pointed = document.querySelector('[data-kp-test-pointed]');
                    const scope = pointed
                        ? [...[pointed.closest('li') ?? pointed].flatMap((p) => [p, ...p.querySelectorAll('*')])]
                        : document.querySelectorAll(roots);
                    const w = /** @type {any} */ (window);
                    const root = getComputedStyle(document.documentElement);
                    const blues = ['--primary', '--link'].map((t) =>
                        w
                            .kpRgba(root.getPropertyValue(t))
                            .slice(0, 3)
                            .map((/** @type {number} */ v) => Math.round(v * 255)),
                    );
                    /** @param {string} css */
                    const is = (css) => {
                        const c = w.kpRgba(css);
                        if (c[3] === 0) return false;
                        const px = c.slice(0, 3).map((/** @type {number} */ v) => Math.round(v * 255));
                        return blues.some((b) => b.every((v, i) => Math.abs(v - px[i]) <= 2));
                    };
                    const found = [];
                    for (const el of scope) {
                        if (!(/** @type {HTMLElement} */ (el).offsetParent) && getComputedStyle(el).position !== 'fixed') continue;
                        const s = getComputedStyle(el);
                        const label = `${el.closest('section')?.id} ${el.className} "${(el.textContent ?? '').trim().slice(0, 20)}"`;
                        /** @type {[string, string][]} */
                        const paints = [
                            ['color', s.color],
                            ['background', s.backgroundColor],
                            .../** @type {const} */ (['Top', 'Right', 'Bottom', 'Left']).flatMap((side) =>
                                parseFloat(s.getPropertyValue(`border-${side.toLowerCase()}-width`)) > 0
                                    ? [[`border-${side}`, s.getPropertyValue(`border-${side.toLowerCase()}-color`)]]
                                    : [],
                            ),
                        ];
                        if (s.textDecorationLine !== 'none') paints.push(['underline', s.textDecorationColor]);
                        if (s.outlineStyle !== 'none') paints.push(['outline', s.outlineColor]);
                        for (const m of s.boxShadow.match(/rgba?\([^)]*\)/g) ?? []) paints.push(['shadow', m]);
                        for (const [what, css] of paints) if (is(css)) found.push(`${state} ${label} ${what}`);
                    }
                    return found;
                },
                [roots, state],
            );

        const NAV = ':is(.kp-nav-wrap, .kp-nav-wrap *, .kp-sidenav, .kp-sidenav *)';

        test('the bars, the call to action and the side navigation: not the primary nor the link colour at rest, under the pointer or as the current page', async ({
            page,
        }) => {
            // Before: the current rail row "All invoices" in rgb(53, 46, 184) with a
            // leading rule in it (navigation#app-shell, #sidenav and its kin), and the
            // call to action on page-effects#nav-cta a plate of rgb(53, 46, 184).
            test.setTimeout(180_000);
            const faults = [];
            for (const [url, block] of [
                ['/catalogue/navigation.html', 'main'],
                ['/catalogue/page-effects.html', '#nav-cta'],
            ]) {
                await open(page, url, 'light');
                await page.mouse.move(0, 0);
                faults.push(...(await indigo(page, `${block} ${NAV}`, `${url} rest`)));
                const targets = page.locator(`${block} :is(.kp-nav-wrap, .kp-sidenav) :is(a, button)`);
                const count = await targets.count();
                for (let i = 0; i < count; i++) {
                    const target = targets.nth(i);
                    if (!(await target.isVisible())) continue;
                    await target.hover({ force: true, timeout: 2000 }).catch(() => {});
                    await target.evaluate((el) => el.setAttribute('data-kp-test-pointed', ''));
                    faults.push(...(await indigo(page, NAV, `${url} hover`)));
                    await target.evaluate((el) => el.removeAttribute('data-kp-test-pointed'));
                    await page.mouse.move(0, 0);
                }
            }
            expect([...new Set(faults)]).toEqual([]);
        });

        test('the breadcrumb: no crumb nor separator in the primary or the link colour at rest or under the pointer, every crumb at 4.5:1 [scope-94]', async ({
            page,
        }) => {
            // Kenny, 2026-09-15, navigation#app-shell: the breadcrumb was still
            // indigo after scope-93. Before (e5458c71): every crumb link in --link
            // at rest and under the pointer, on #breadcrumb, both trails, and on
            // #app-shell.
            test.setTimeout(120_000);
            const faults = [];
            await open(page, '/catalogue/navigation.html', 'light');
            await page.mouse.move(0, 0);
            const CRUMBS = ':is(#breadcrumb, #app-shell) :is(.kp-breadcrumb, .kp-breadcrumb *)';
            expect(await page.locator(`:is(#breadcrumb, #app-shell) .kp-breadcrumb`).count(), 'three trails').toBe(3);
            faults.push(...(await indigo(page, CRUMBS, 'rest')));
            const crumbs = page.locator(':is(#breadcrumb, #app-shell) .kp-breadcrumb li > :is(a, [aria-current])');
            const count = await crumbs.count();
            expect(count).toBeGreaterThanOrEqual(13);
            /** The crumb's ink on its ground, as the reader sees it. @param {import('@playwright/test').Locator} crumb */
            const reads = (crumb) =>
                crumb.evaluate((el) => {
                    const w = /** @type {any} */ (window);
                    return { ink: w.kpRgba(getComputedStyle(el).color), ground: w.kpGround(el), weight: getComputedStyle(el).fontWeight };
                });
            for (let i = 0; i < count; i++) {
                const crumb = crumbs.nth(i);
                if (!(await crumb.isVisible())) continue;
                const name = ((await crumb.textContent()) ?? '').trim().slice(0, 24);
                const rest = await reads(crumb);
                const restRatio = contrast(rgb(rest.ink), rgb(rest.ground));
                if (restRatio < 4.5) faults.push(`rest "${name}" ${restRatio.toFixed(2)}:1`);
                const link = await crumb.evaluate((el) => el.tagName === 'A');
                if (!link) continue;
                await crumb.hover({ force: true, timeout: 2000 }).catch(() => {});
                await crumb.evaluate((el) => el.setAttribute('data-kp-test-pointed', ''));
                faults.push(...(await indigo(page, CRUMBS, 'hover')));
                const hover = await reads(crumb);
                const hoverRatio = contrast(rgb(hover.ink), rgb(hover.ground));
                if (hoverRatio < 4.5) faults.push(`hover "${name}" ${hoverRatio.toFixed(2)}:1`);
                if (distance(rgb(hover.ink), rgb(rest.ink)) < 10) faults.push(`hover "${name}": the ink does not come up under the pointer`);
                await crumb.evaluate((el) => el.removeAttribute('data-kp-test-pointed'));
                await page.mouse.move(0, 0);
            }
            expect([...new Set(faults)]).toEqual([]);
        });

        test('the application shell’s bar: no blue hue in any paint of any element or pseudo element, at rest, under the pointer, focused or current', async ({
            page,
        }) => {
            // Kenny, 2026-09-15, navigation#app-shell, light: "blauw moet uit
            // navbar. Mogelijks ben je hier nog mee bezig". The check above
            // matches --primary and --link exactly; this one refuses any hue
            // from 190° to 260° at more than 15% saturation, so a tint or a mix
            // of the indigo is caught too. Paints darker than 20% lightness are
            // the ink (--foreground, hsl(224, 25%, 12%), reads as black) and
            // are not a blue. Drilled per KT3: light's `.kp-nav__link:hover,
            // :focus-visible, [aria-current]` ink set back to var(--primary) went
            // red, "rest a.kp-nav__link "Invoices" rgb(53, 46, 184) (243°, 60%)"
            // and 18 more; restored, green.
            test.setTimeout(120_000);
            await open(page, '/catalogue/navigation.html', 'light');
            const BAR = '#app-shell .kp-nav-wrap';
            /** @param {string} state */
            const blues = (state) =>
                page.evaluate(
                    ([bar, state]) => {
                        const w = /** @type {any} */ (window);
                        const root = /** @type {Element} */ (document.querySelector(bar));
                        const found = [];
                        for (const el of [root, ...root.querySelectorAll('*')])
                            for (const pseudo of [null, '::before', '::after', '::marker']) {
                                const s = getComputedStyle(el, pseudo);
                                if (pseudo && s.content === 'none') continue;
                                if (!pseudo && !(/** @type {HTMLElement} */ (el).offsetParent)) continue;
                                const values = [
                                    s.color,
                                    s.backgroundColor,
                                    s.borderTopColor,
                                    s.borderRightColor,
                                    s.borderBottomColor,
                                    s.borderLeftColor,
                                    s.textDecorationColor,
                                    s.outlineColor,
                                    s.fill,
                                    s.stroke,
                                    s.boxShadow,
                                    s.textShadow,
                                    s.backgroundImage,
                                ].join(' ');
                                for (const css of values.match(/(rgba?|color|oklch|oklab|hsla?|lab|lch)\([^)]*\)/g) ?? []) {
                                    const [r, g, b, a] = w.kpRgba(css);
                                    if (a === 0) continue;
                                    const max = Math.max(r, g, b);
                                    const min = Math.min(r, g, b);
                                    const l = (max + min) / 2;
                                    const d = max - min;
                                    if (d === 0 || l < 0.2) continue;
                                    const sat = d / (1 - Math.abs(2 * l - 1));
                                    let hue = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
                                    hue = (hue * 60 + 360) % 360;
                                    if (hue >= 190 && hue <= 260 && sat > 0.15)
                                        found.push(
                                            `${state} ${el.tagName.toLowerCase()}.${el.className}${pseudo ?? ''} "${(el.textContent ?? '').trim().slice(0, 12)}" ${css} (${Math.round(hue)}°, ${Math.round(sat * 100)}%)`,
                                        );
                                }
                            }
                        return found;
                    },
                    [BAR, state],
                );
            await page.mouse.move(0, 0);
            expect(await page.locator(`${BAR} [aria-current="page"]`).count(), 'the current item is in the bar').toBe(1);
            const faults = [...(await blues('rest'))];
            const targets = page.locator(`${BAR} :is(a, button)`);
            const count = await targets.count();
            let visited = 0;
            for (let i = 0; i < count; i++) {
                const target = targets.nth(i);
                if (!(await target.isVisible())) continue;
                visited++;
                await target.hover({ force: true, timeout: 2000 }).catch(() => {});
                faults.push(...(await blues(`hover #${i}`)));
                await page.mouse.move(0, 0);
                await target.evaluate((el) => /** @type {HTMLElement} */ (el).focus({ focusVisible: true }));
                faults.push(...(await blues(`focus #${i}`)));
                await target.blur();
            }
            expect(visited, 'brand, four links and the dropdown’s links').toBeGreaterThanOrEqual(5);
            expect([...new Set(faults)]).toEqual([]);
        });

        test('the call to action still reads as one: a drawn pill, its words at 4.5:1 at rest and under the pointer, and a plate that changes', async ({
            page,
        }) => {
            await open(page, '/catalogue/page-effects.html', 'light');
            const cta = page.locator('#nav-cta .kp-nav__link--cta').first();
            const read = () =>
                cta.evaluate((el) => {
                    const w = /** @type {any} */ (window);
                    const s = getComputedStyle(el);
                    return { ink: w.kpRgba(s.color), ground: w.kpGround(el), shadow: s.boxShadow, bg: s.backgroundColor };
                });
            await page.mouse.move(0, 0);
            const rest = await read();
            expect(rest.shadow, 'a ring drawn around the words').toMatch(/inset/);
            expect(contrast(rgb(rest.ink), rgb(rest.ground)), 'rest').toBeGreaterThanOrEqual(4.5);
            await cta.hover();
            const hover = await read();
            expect(contrast(rgb(hover.ink), rgb(hover.ground)), 'hover').toBeGreaterThanOrEqual(4.5);
            expect(distance(rgb(hover.ground), rgb(rest.ground)), 'the pill fills under the pointer').toBeGreaterThan(20);
        });
    },
);

/* ───────────────────────────── 6 · room around a call to action's plate */

// Forest stands for the registers that draw a plate. Until 2026-10-04
// solstice, Shade (dark), Lapis and nostromo ran the same test; Kenny trimmed
// them (form v9, trim-copies): their plates are in the approved screenshots.
for (const theme of ['forest']) {
    test.describe(
        `${theme}: the call to action’s words keep off its plate [page-effects#nav-cta]`,
        { tag: [`@theme:${theme}`, '@component:navigation'] },
        () => {
            test('where the link draws a plate, at least 12px lie between the words and each inline edge', async ({ page }) => {
                // Before: 0px on both sides in all five (padding-inline 0px).
                await open(page, '/catalogue/page-effects.html', theme);
                const read = await page
                    .locator('#nav-cta .kp-nav__link--cta')
                    .first()
                    .evaluate((el) => {
                        const s = getComputedStyle(el);
                        const r = el.getBoundingClientRect();
                        const range = document.createRange();
                        range.selectNodeContents(el);
                        const words = range.getBoundingClientRect();
                        return {
                            plate: s.backgroundColor !== 'rgba(0, 0, 0, 0)' || parseFloat(s.borderLeftWidth) > 0 || s.backgroundImage !== 'none',
                            start: words.left - r.left,
                            end: r.right - words.right,
                        };
                    });
                expect(read.plate, 'the link draws a plate').toBe(true);
                expect(read.start, 'room at the start').toBeGreaterThanOrEqual(12);
                expect(read.end, 'room at the end').toBeGreaterThanOrEqual(12);
            });
        },
    );
}
