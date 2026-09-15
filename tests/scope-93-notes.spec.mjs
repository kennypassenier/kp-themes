// Kenny's per-theme answers of 2026-09-15 [scope-93], read where he read them.
//
// hc-filled-hover "De opstijgende balk van Cancel": high-contrast's filled
// Save changes and Delete account showed no hover, because their hover ground
// was their border colour, which is their fill. light-indigo "Ook daar weg",
// and on navigation#app-shell "blauw moet uit navbar": no indigo left in a
// navigation in light. retro-scrollbars "Tooltips zonder scrollbalk". Retro's
// pressed destructive button, dark red on dark red. Retro's call to action,
// which still stepped with padding when pressed. cta-plates "Gelijktrekken":
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

/* ───────────────────────────── 1 · high-contrast: the filled two hover */

test.describe(
    'high-contrast: Save changes and Delete account take Cancel’s bar [button#variants]',
    { tag: ['@theme:high-contrast', '@component:button'] },
    () => {
        test('under the pointer the filled buttons paint differently from rest: the rising bar and the side bars, in an ink that reads on the fill', async ({
            page,
        }) => {
            // Before: rest and hover identical on both — box-shadow
            // "rgb(0, 0, 0) 0px 0px 0px 0px" at both, no ::after, grounds
            // rgb(0, 51, 153) and rgb(163, 0, 0) at rest and on hover.
            await open(page, '/catalogue/button.html', 'high-contrast');
            const faults = [];
            for (const variant of ['primary', 'destructive']) {
                const button = page.locator(`#variants .cat-stage .kp-button--${variant}`).first();
                const read = () =>
                    button.evaluate((el) => {
                        const w = /** @type {any} */ (window);
                        const cs = getComputedStyle(el);
                        const bar = getComputedStyle(el, '::after');
                        const r = el.getBoundingClientRect();
                        return {
                            shadow: cs.boxShadow,
                            ground: w.kpRgba(cs.backgroundColor),
                            barContent: bar.content,
                            barInk: w.kpRgba(bar.backgroundColor),
                            barTransform: bar.transform,
                            barHeight: parseFloat(bar.height),
                            rect: `${r.x},${r.y},${r.width},${r.height}`,
                        };
                    });
                await page.mouse.move(0, 0);
                const rest = await read();
                await button.hover();
                const hover = await read();
                await page.mouse.move(0, 0);
                if (rest.rect !== hover.rect) faults.push(`${variant}: the box moved on hover, ${rest.rect} → ${hover.rect}`);
                if (hover.shadow === rest.shadow) faults.push(`${variant}: hover box-shadow is the rest one (${rest.shadow})`);
                if (!/inset/.test(hover.shadow)) faults.push(`${variant}: no inset side bars on hover (${hover.shadow})`);
                if (hover.barContent === 'none' || !(hover.barHeight >= 3))
                    faults.push(`${variant}: no bar (content ${hover.barContent}, ${hover.barHeight}px)`);
                if (!/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/.test(hover.barTransform))
                    faults.push(`${variant}: the bar has not risen (${hover.barTransform})`);
                if (hover.barTransform === rest.barTransform) faults.push(`${variant}: the bar stands the same at rest and on hover`);
                const legible = contrast(rgb(hover.barInk), rgb(hover.ground));
                if (legible < 4.5) faults.push(`${variant}: the bar reads ${legible.toFixed(2)}:1 on its fill`);
            }
            expect(faults).toEqual([]);
        });

        test('the rising bar is white on every variant that carries it, Cancel included, at 7:1 or better on the hover ground', async ({ page }) => {
            // Kenny, 2026-09-15, button#variants: "Beter, maar de balk die naar
            // boven komt moet overal in het wit". Before: Cancel's bar
            // rgb(0, 0, 0) — --foreground — on its own black hover ground, 1:1,
            // so it rose unseen; Save changes and Delete account already white.
            await open(page, '/catalogue/button.html', 'high-contrast');
            const buttons = page.locator('#variants .cat-stage').first().locator('.kp-button');
            const faults = [];
            const carriers = [];
            for (let i = 0; i < (await buttons.count()); i++) {
                const button = buttons.nth(i);
                await page.mouse.move(0, 0);
                await button.hover();
                const read = await button.evaluate((el) => {
                    const w = /** @type {any} */ (window);
                    const bar = getComputedStyle(el, '::after');
                    return {
                        label: (el.textContent ?? '').trim(),
                        content: bar.content,
                        bar: bar.backgroundColor,
                        barInk: w.kpRgba(bar.backgroundColor),
                        ground: w.kpRgba(getComputedStyle(el).backgroundColor),
                        transform: bar.transform,
                    };
                });
                if (read.content === 'none') continue;
                carriers.push(read.label);
                if (read.bar !== 'rgb(255, 255, 255)') faults.push(`${read.label}: the bar is ${read.bar}`);
                if (!/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/.test(read.transform))
                    faults.push(`${read.label}: the bar has not risen (${read.transform})`);
                const ratio = contrast(rgb(read.barInk), rgb(read.ground));
                if (ratio < 7) faults.push(`${read.label}: the bar reads ${ratio.toFixed(2)}:1 on the hover ground`);
            }
            await page.mouse.move(0, 0);
            expect(carriers.sort(), 'the variants carrying the bar').toEqual(['Cancel', 'Delete account', 'Save changes']);
            expect(faults).toEqual([]);
        });

        test(
            'on every toast every bar the ghost button draws, the rising bar and the two side bars, reads at 7:1 or better on its own hover ground [feedback#toasts, scope-96, scope-98]',
            { tag: '@component:feedback' },
            async ({ page }) => {
                // Kenny, 2026-09-15, hc-bar "De drie knoppen, en Undo in de neutrale
                // toast zwart". Before (b9dc0afb): the plain toast's Undo raised a
                // white bar rgb(255, 255, 255) on its hover ground rgb(229, 229, 229),
                // 1.26:1; the four toasts of meaning read 9.12:1 or better. Success and
                // warning carry only a close button, so each gets a ghost action
                // button of the package's own markup to be hovered like the others.
                // hc-side-bars "Ook in de tekstkleur" [scope-98]: the side bars too.
                // Before: the plain toast's Undo drew its inset side bars in
                // rgb(255, 255, 255) on rgb(229, 229, 229), 1.26:1, while its rising
                // bar was already black.
                await open(page, '/catalogue/feedback.html', 'high-contrast');
                const toasts = page.locator('#toasts .cat-stage .kp-toast');
                expect(await toasts.count(), 'the plain toast and the four of meaning').toBe(5);
                await toasts.evaluateAll((els) => {
                    for (const toast of els) {
                        if (toast.querySelector('.kp-button--ghost')) continue;
                        const button = document.createElement('button');
                        button.type = 'button';
                        button.className = 'kp-button kp-button--ghost';
                        button.textContent = 'Action';
                        toast.insertBefore(button, toast.querySelector('.kp-toast__close'));
                    }
                });
                const faults = [];
                for (let i = 0; i < 5; i++) {
                    const toast = toasts.nth(i);
                    const button = toast.locator('.kp-button--ghost').first();
                    await page.mouse.move(0, 0);
                    await button.hover();
                    const read = async () =>
                        button.evaluate((el) => {
                            const w = /** @type {any} */ (window);
                            const bar = getComputedStyle(el, '::after');
                            return {
                                toast: /** @type {Element} */ (el.closest('.kp-toast')).className,
                                label: (el.textContent ?? '').trim(),
                                content: bar.content,
                                transform: bar.transform,
                                barInk: w.kpRgba(bar.backgroundColor),
                                // Each inset box-shadow is a side bar; its colour leads the computed value.
                                sides: getComputedStyle(el)
                                    .boxShadow.split(/,(?![^(]*\))/)
                                    .filter((layer) => /inset/.test(layer))
                                    .map((layer) => w.kpRgba((layer.match(/rgba?\([^)]*\)/) ?? ['transparent'])[0])),
                                ground: w.kpGround(el),
                            };
                        });
                    // KT16: the hover ground and the bar arrive, so read until the bar has risen.
                    await expect.poll(async () => (await read()).transform).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
                    const hover = await read();
                    if (hover.content === 'none') {
                        faults.push(`${hover.toast} "${hover.label}": no bar`);
                        continue;
                    }
                    if (hover.sides.length !== 2) faults.push(`${hover.toast} "${hover.label}": ${hover.sides.length} side bars, not 2`);
                    const drawn = [
                        ['the rising bar', hover.barInk],
                        ...hover.sides.map((/** @type {number[]} */ ink, /** @type {number} */ n) => [`side bar ${n + 1}`, ink]),
                    ];
                    for (const [name, ink] of drawn) {
                        const ratio = contrast(rgb(ink), rgb(hover.ground));
                        if (ratio < 7)
                            faults.push(
                                `${hover.toast} "${hover.label}": ${name} ${ink.map((/** @type {number} */ v) => Math.round(v * 255))} reads ${ratio.toFixed(2)}:1 on ${hover.ground.map((/** @type {number} */ v) => Math.round(v * 255))}`,
                            );
                    }
                }
                await page.mouse.move(0, 0);
                expect(faults).toEqual([]);
            },
        );

        test('pointed at while focused, the filled buttons keep the two-channel ring in front of the bars', async ({ page }) => {
            await open(page, '/catalogue/button.html', 'high-contrast');
            for (const variant of ['primary', 'destructive']) {
                const button = page.locator(`#variants .cat-stage .kp-button--${variant}`).first();
                await button.hover();
                await page.keyboard.press('Shift');
                await button.evaluate((el) => /** @type {HTMLElement} */ (el).focus({ focusVisible: true }));
                // Reached with the keyboard where focus() alone does not set :focus-visible.
                if (!(await button.evaluate((el) => el.matches(':focus-visible')))) {
                    await page.keyboard.press('Shift+Tab');
                    await page.keyboard.press('Tab');
                }
                await expect.poll(() => button.evaluate((el) => el.matches(':focus-visible'))).toBe(true);
                const shadow = await button.evaluate((el) => getComputedStyle(el).boxShadow);
                expect(shadow, `${variant} hovered and focused`).toMatch(/0px 0px 0px 4px/);
                expect(shadow, `${variant} hovered and focused`).toMatch(/inset/);
                await button.blur();
                await page.mouse.move(0, 0);
            }
        });
    },
);

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

/* ───────────────────────────── 3 · retro: tooltips draw no scrollbar */

test.describe('retro: a tooltip draws no scrollbar [overlays#tooltip]', { tag: ['@theme:retro', '@component:overlays'] }, () => {
    test('the tooltips wear no drawn bar and take no room for one, while the menu beside them keeps its bar', async ({ page }) => {
        // Before: both open tooltips painted the 1995 bar (35 gradient layers)
        // with 26px of end padding against 8px at the start, 18px of it for the bar.
        await open(page, '/catalogue/overlays.html', 'retro');
        const read = (/** @type {string} */ selector) =>
            page.locator(selector).evaluateAll((els) =>
                els
                    .filter((el) => /** @type {HTMLElement} */ (el).offsetParent !== null)
                    .map((el) => {
                        const s = getComputedStyle(el);
                        return {
                            layers: (s.backgroundImage.match(/linear-gradient\(/g) ?? []).length,
                            end: s.paddingInlineEnd,
                            start: s.paddingInlineStart,
                        };
                    }),
            );
        const tips = await read('#tooltip .cat-stage .kp-tooltip');
        expect(tips.length).toBeGreaterThanOrEqual(2);
        for (const tip of tips) {
            expect(tip.layers, 'drawn scrollbar layers on a tooltip').toBe(0);
            expect(tip.end, "the tooltip's end padding is its start padding").toBe(tip.start);
        }
        const menus = await read('#menu .cat-stage .kp-popover');
        expect(menus.length).toBeGreaterThan(0);
        for (const menu of menus) expect(menu.layers, 'a menu keeps its bar').toBeGreaterThanOrEqual(30);
    });
});

/* ───────────────────────────── 4 · retro: the pressed destructive button reads */

test.describe('retro: a pressed destructive button stays readable [button#variants]', { tag: ['@theme:retro', '@component:button'] }, () => {
    test('held down, the dark-red label reads at 4.5:1 on the face drawn behind it', async ({ page }) => {
        // Before: rgb(128, 0, 0) on the pressed face rgb(82, 7, 4), 1.38:1, on all three (Delete account, Delete, Discard).
        await open(page, '/catalogue/button.html', 'retro');
        const buttons = page.locator('.cat-stage .kp-button--destructive:not(:disabled)');
        const faults = [];
        for (let i = 0; i < (await buttons.count()); i++) {
            const button = buttons.nth(i);
            if (!(await button.isVisible())) continue;
            await button.scrollIntoViewIfNeeded();
            const box = await button.boundingBox();
            if (!box) continue;
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await page.mouse.down();
            const read = await button.evaluate((el) => {
                const w = /** @type {any} */ (window);
                const s = getComputedStyle(el);
                // The face is repainted by ::before; the control's own ground is clipped to its glyphs.
                const face = getComputedStyle(el, '::before');
                const ground = face.content !== 'none' ? w.kpRgba(face.backgroundColor) : w.kpRgba(s.backgroundColor);
                return { label: (el.textContent ?? '').trim(), ink: w.kpRgba(s.color), ground };
            });
            await page.mouse.up();
            await page.mouse.move(0, 0);
            const ratio = contrast(rgb(read.ink), rgb(read.ground));
            if (ratio < 4.5) faults.push(`${read.label}: ${ratio.toFixed(2)}:1 pressed`);
        }
        expect(faults).toEqual([]);
    });
});

/* ───────────────────────────── 5 · retro: the call to action presses in paint */

test.describe(
    'retro: pressing the call to action moves its words, not the bar [page-effects#nav-cta]',
    { tag: ['@theme:retro', '@component:navigation'] },
    () => {
        test('held down, the link and every neighbour keep their boxes, the label steps 1px, and the padding is the rest padding', async ({
            page,
        }) => {
            // Before: padding 9px 13.4px 7px 15.4px pressed against 8px 14.4px at
            // rest, translate "none".
            await open(page, '/catalogue/page-effects.html', 'retro');
            const cta = page.locator('#nav-cta .kp-nav__link--cta').first();
            await cta.scrollIntoViewIfNeeded();
            const read = () =>
                cta.evaluate((el) => {
                    const self = /** @type {HTMLElement} */ (el);
                    const s = getComputedStyle(self);
                    const bar = /** @type {HTMLElement} */ (self.closest('.kp-nav'));
                    return {
                        padding: s.padding,
                        translate: s.translate,
                        boxes: [
                            `self ${self.offsetLeft},${self.offsetTop},${self.offsetWidth},${self.offsetHeight}`,
                            ...[...bar.querySelectorAll('.kp-nav__brand, .kp-nav__link:not(.kp-nav__link--cta)')].map((n) => {
                                const r = n.getBoundingClientRect();
                                return `${n.textContent?.trim()} ${r.x.toFixed(2)},${r.y.toFixed(2)},${r.width.toFixed(2)},${r.height.toFixed(2)}`;
                            }),
                            `bar ${bar.getBoundingClientRect().height.toFixed(2)}`,
                        ],
                    };
                });
            const rest = await read();
            const box = /** @type {{ x: number, y: number, width: number, height: number }} */ (await cta.boundingBox());
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await page.mouse.down();
            const pressed = await read();
            await page.mouse.up();
            await page.mouse.move(0, 0);
            expect(pressed.boxes).toEqual(rest.boxes);
            expect(pressed.padding, 'no padding moves on press').toBe(rest.padding);
            expect(pressed.translate, 'the label steps a pixel down and right').toBe('1px 1px');
        });
    },
);

/* ───────────────────────────── 6 · room around a call to action's plate */

for (const theme of ['forest', 'solstice', 'shade-dark', 'lapis', 'nostromo']) {
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
