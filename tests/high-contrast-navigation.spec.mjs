// No blue anywhere in high-contrast's navigation [scope-107, Kenny 2026-09-16].
//
// Kenny rejected three of this theme's navigation blocks in the catalogue —
// navigation#app-shell ("ook hier is nog blauw"), navigation#bar-search ("ik
// dacht dat we voor high contrast de blauwe links hadden vervangen door een
// donkerdere versie? ... ook de 'Search' text moet in de nieuwe, donkerdere,
// kleur zijn. Dit geldt voor alle navbars") and navigation#bar-sticky ("ook
// hier is het blauw"). The theme's own constraint is that nothing may lean on
// a hue (css/high-contrast-register.css), so a navigation drawn in --link
// (hsl(220, 100%, 30%)) contradicts the theme outright.
//
// This measures it rather than looking at it [scope-32, scope-73]: every
// element and pseudo-element of every navigation block, in rest, hover,
// focus-visible, active, aria-current and visited, and every colour it
// computes. A hue between 190° and 260° with more than 15% saturation is
// blue and is a failure. Text is measured against the ground it is composited
// on and must clear 7:1 — this theme's bar, not the 4.5:1 floor [DI2].
//
// Firefox answers getComputedStyle for a visited link with its unvisited
// style, for privacy, so the visited state cannot be read that way. It is
// resolved from the cascade instead: the rule that wins `color` for the link
// once `a:visited` is in play, its value resolved against the link's own
// custom properties. That is the same answer the pixel would give, and it is
// deterministic.

import { expect, test } from '@playwright/test';
import { contrast, rgbToHsl } from '../gates/colour.mjs';
import { waitForJudging } from './helpers/catalogue.mjs';
import { useEmptyRegister } from './helpers/empty-register.mjs';

/** Every block of catalogue/navigation.html, in page order. */
const BLOCKS = [
    'bar',
    'dropdown',
    'mega-menu',
    'bar-collapsed',
    'bar-long',
    'bar-search',
    'bar-sticky',
    'breadcrumb',
    'pagination',
    'tabs',
    'tabs-many',
    'sidenav-side',
    'sidenav-slim',
    'sidenav-slim-toggle',
    'app-shell',
    'sidenav-over',
    'to-top',
];

/**
 * What is measured inside a block: the demo itself, never the catalogue's
 * own chrome around it. The judging panel carries an Approve button, and
 * that button is `--primary`, this theme's blue — page furniture, not a
 * navigation, and not Kenny's to judge here.
 */
const STAGE = '.cat-stage';

/** The hue band Kenny calls blue, and the saturation under which a hue no longer reads as one. */
const BLUE = { from: 190, to: 260, saturation: 15 };

/** Text must clear this in this theme, not the 4.5:1 floor [DI2]. */
const BAR = 7;

/** @param {number[]} c */
const rgb = (c) => /** @type {[number, number, number]} */ (c.slice(0, 3));

/** @param {number[]} c */
const isBlue = (c) => {
    const { h, s } = rgbToHsl(rgb(c));
    return h >= BLUE.from && h <= BLUE.to && s > BLUE.saturation;
};

/** @param {number[]} c */
const show = (c) => {
    const { h, s, l } = rgbToHsl(rgb(c));
    const b = (/** @type {number} */ v) => Math.round(v * 255);
    return `rgb(${b(c[0])}, ${b(c[1])}, ${b(c[2])}) — hue ${h.toFixed(0)}°, saturation ${s.toFixed(0)}%, lightness ${l.toFixed(0)}%`;
};

/**
 * Open catalogue/navigation.html in high-contrast, with the page's measuring
 * kit installed.
 *
 * @param {import('@playwright/test').Page} page
 */
const open = async (page) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await useEmptyRegister(page.context());
    await page.goto('/catalogue/navigation.html');
    await waitForJudging(page);
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'high-contrast'));
    await expect.poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe('high-contrast');
    await page.evaluate(() => {
        const ctx = /** @type {CanvasRenderingContext2D} */ (document.createElement('canvas').getContext('2d', { willReadFrequently: true }));
        /** Any CSS colour as [r, g, b, a], channels 0..1; [0,0,0,0] for a keyword no canvas knows. @param {string} css */
        const rgba = (css) => {
            ctx.clearRect(0, 0, 1, 1);
            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            const before = ctx.fillStyle;
            ctx.fillStyle = css;
            if (ctx.fillStyle === before && !/transparent|rgba\(0,\s*0,\s*0,\s*0\)/.test(css)) return [0, 0, 0, 0];
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

        /** A readable path to an element, for the failure line. @param {Element} el */
        const path = (el) => {
            const bits = [];
            for (let e = /** @type {Element | null} */ (el); e && e !== document.body; e = e.parentElement) {
                const cls = [...e.classList].filter((c) => c.startsWith('kp-')).join('.');
                bits.unshift(e.id ? `#${e.id}` : cls ? `${e.tagName.toLowerCase()}.${cls}` : e.tagName.toLowerCase());
                if (e.classList.contains('cat-block')) break;
            }
            return bits.join(' ');
        };

        /** Every colour one element (or one of its pseudo-elements) paints. @param {Element} el @param {string | null} pseudo */
        const paints = (el, pseudo) => {
            const cs = getComputedStyle(el, pseudo);
            if (pseudo && (cs.content === 'none' || cs.content === '')) return [];
            /** @type {{ property: string, value: string }[]} */
            const found = [];
            const plain = {
                color: null,
                'background-color': null,
                'outline-color': cs.outlineStyle === 'none' || parseFloat(cs.outlineWidth) === 0 ? 'skip' : null,
                'text-decoration-color': cs.textDecorationLine === 'none' ? 'skip' : null,
                fill: null,
                stroke: null,
            };
            for (const [property, skip] of Object.entries(plain)) {
                if (skip) continue;
                found.push({ property, value: cs.getPropertyValue(property) });
            }
            for (const side of ['top', 'right', 'bottom', 'left']) {
                if (cs.getPropertyValue(`border-${side}-style`) === 'none') continue;
                if (parseFloat(cs.getPropertyValue(`border-${side}-width`)) === 0) continue;
                found.push({ property: `border-${side}-color`, value: cs.getPropertyValue(`border-${side}-color`) });
            }
            // The colours inside a shorthand: shadows and gradients paint too.
            for (const property of ['box-shadow', 'text-shadow', 'background-image']) {
                const value = cs.getPropertyValue(property);
                if (!value || value === 'none') continue;
                for (const token of value.match(/rgba?\([^)]*\)|(?:^|[\s(,])#[0-9a-f]{3,8}\b/gi) ?? []) found.push({ property, value: token.trim() });
            }
            return found.map((f) => ({ ...f, rgba: rgba(f.value), pseudo: pseudo ?? '' }));
        };

        /**
         * Every colour painted inside `root` (itself included), the
         * hidden descendants too: a closed dropdown still computes the
         * ink it will show when it opens.
         *
         * @param {Element} root
         */
        const scan = (root) => {
            /** @type {{ where: string, property: string, rgba: number[] }[]} */
            const out = [];
            for (const el of [root, ...root.querySelectorAll('*')]) {
                for (const pseudo of [null, '::before', '::after', '::marker']) {
                    for (const p of paints(el, pseudo)) {
                        if (p.rgba[3] === 0) continue;
                        out.push({ where: `${path(el)}${p.pseudo}`, property: p.property, rgba: p.rgba });
                    }
                }
            }
            return out;
        };

        Object.assign(window, { kpRgba: rgba, kpGround: ground, kpScan: scan, kpPath: path });
    });
};

/**
 * Give an element the keyboard focus, so `:focus-visible` matches — a
 * programmatic `focus()` does not, in either engine. A span is slipped in
 * front of it in the tab order, focused, and tabbed out of [fix-38's idiom].
 *
 * @param {import('@playwright/test').Page} page
 * @param {import('@playwright/test').Locator} element
 */
const keyboardFocus = async (page, element) => {
    await element.evaluate((el) => {
        const span = document.createElement('span');
        span.tabIndex = 0;
        span.id = 'kp-focus-probe';
        el.parentElement?.insertBefore(span, el);
        span.focus();
    });
    await page.keyboard.press('Tab');
    const landed = await element.evaluate((el) => el === document.activeElement);
    await page.evaluate(() => document.getElementById('kp-focus-probe')?.remove());
    return landed;
};

/** The things in a navigation block a pointer or the keyboard can reach. */
const REACHABLE = 'a, button, summary, [tabindex]:not([tabindex="-1"]), input';

test.describe('high-contrast: no blue is left in a navigation [navigation]', { tag: ['@theme:high-contrast', '@component:navigation'] }, () => {
    test.describe.configure({ timeout: 180_000 });

    test('at rest, no element or pseudo-element of any navigation block paints a hue between 190° and 260°', async ({ page }) => {
        await open(page);
        /** @type {string[]} */
        const faults = [];
        for (const block of BLOCKS) {
            const painted = await page.evaluate(([id, stage]) => {
                const stages = [...document.querySelectorAll(`#${id} ${stage}`)];
                if (stages.length === 0) throw new Error(`no stage in block #${id}`);
                return stages.flatMap((root) => /** @type {any} */ (window).kpScan(root));
            }, /** @type {[string, string]} */ ([block, STAGE]));
            for (const p of painted) if (isBlue(p.rgba)) faults.push(`#${block} ${p.where} { ${p.property} } ${show(p.rgba)}`);
        }
        expect(faults, `blue at rest:\n${faults.join('\n')}`).toEqual([]);
    });

    test('under the pointer, with the keyboard focus and while pressed, no navigation control paints a blue', async ({ page }) => {
        await open(page);
        /** @type {string[]} */
        const faults = [];
        for (const block of BLOCKS) {
            const controls = page.locator(`#${block} ${STAGE} :is(${REACHABLE})`);
            const count = await controls.count();
            for (let i = 0; i < count; i++) {
                const control = controls.nth(i);
                if (!(await control.isVisible())) continue;
                const read = async (/** @type {string} */ state) => {
                    const painted = await control.evaluate((el) => /** @type {any} */ (window).kpScan(el));
                    for (const p of painted) if (isBlue(p.rgba)) faults.push(`#${block} ${state} ${p.where} { ${p.property} } ${show(p.rgba)}`);
                };
                await control.scrollIntoViewIfNeeded().catch(() => {});
                await control.hover({ trial: false, force: true }).catch(() => {});
                await read('hover');
                if (await keyboardFocus(page, control)) await read('focus-visible');
                const box = await control.boundingBox();
                if (box) {
                    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
                    await page.mouse.down();
                    await read('active');
                    await page.mouse.up();
                    // A link followed inside the page moves the hash; put it back.
                    await page.keyboard.press('Escape').catch(() => {});
                }
            }
            await page.mouse.move(0, 0);
        }
        expect(faults, `blue in a state:\n${faults.join('\n')}`).toEqual([]);
    });

    test('the page you are on, marked with aria-current, is not blue either', async ({ page }) => {
        await open(page);
        /** @type {string[]} */
        const faults = [];
        const painted = await page.evaluate((blocks) => {
            /** @type {any[]} */
            const out = [];
            for (const id of blocks) {
                for (const root of document.querySelectorAll(`#${id} .cat-stage`)) {
                    for (const el of root.querySelectorAll('[aria-current], [aria-selected="true"]')) {
                        for (const p of /** @type {any} */ (window).kpScan(el)) out.push({ ...p, block: id });
                    }
                }
            }
            return out;
        }, BLOCKS);
        for (const p of painted) if (isBlue(p.rgba)) faults.push(`#${p.block} aria-current ${p.where} { ${p.property} } ${show(p.rgba)}`);
        expect(faults, `blue on the current page:\n${faults.join('\n')}`).toEqual([]);
    });

    test('a visited link in a navigation is not blue: the rule that wins its colour once :visited applies', async ({ page }) => {
        await open(page);
        const visited = await page.evaluate((blocks) => {
            /** Roughly WCAG-free selector specificity; enough to order these rules. @param {string} sel */
            const weigh = (sel) => {
                const bare = sel.replace(/:where\([^)]*\)/g, '');
                const ids = (bare.match(/#[\w-]+/g) ?? []).length;
                const mid = (bare.match(/\.[\w-]+|\[[^\]]+\]|:(?!:)[\w-]+/g) ?? []).length;
                const low = (bare.match(/(?:^|[\s>+~,(])[a-z][\w-]*/gi) ?? []).length + (bare.match(/::[\w-]+/g) ?? []).length;
                return ids * 10000 + mid * 100 + low;
            };
            /** @type {{ selector: string, value: string, order: number, important: boolean }[]} */
            const rules = [];
            /** @param {CSSGroupingRule | CSSStyleSheet} sheet */
            const walk = (sheet) => {
                let list;
                try {
                    list = sheet.cssRules;
                } catch {
                    return;
                }
                for (const r of list) {
                    const any = /** @type {any} */ (r);
                    // The catalogue loads one deps.css that @imports the
                    // package's sheets, so the rules are a level down.
                    if (any.styleSheet) walk(any.styleSheet);
                    if (any.cssRules) walk(any);
                    if (!any.selectorText || !any.style) continue;
                    const value = any.style.getPropertyValue('color');
                    if (!value) continue;
                    rules.push({
                        selector: any.selectorText,
                        value,
                        order: rules.length,
                        important: any.style.getPropertyPriority('color') === 'important',
                    });
                }
            };
            for (const sheet of document.styleSheets) walk(/** @type {any} */ (sheet));

            /** @type {any[]} */
            const out = [];
            for (const id of blocks) {
                for (const link of document.querySelectorAll(`#${id} .cat-stage a`)) {
                    let winner = null;
                    for (const rule of rules) {
                        // A :visited rule applies to a visited link; every
                        // other rule applies whatever the history says.
                        const bare = rule.selector.replace(/:visited\b/g, '');
                        if (bare !== rule.selector && !bare.trim()) continue;
                        let matches = false;
                        try {
                            matches = link.matches(bare);
                        } catch {
                            matches = false;
                        }
                        if (!matches) continue;
                        // Weighed as written, matched with `:visited` taken
                        // out: `a:visited` is (0, 1, 1) and outranks a plain
                        // `a` wherever the two sit in the file.
                        const weight = weigh(rule.selector);
                        if (
                            !winner ||
                            rule.important > winner.important ||
                            (rule.important === winner.important &&
                                (weight > winner.weight || (weight === winner.weight && rule.order > winner.order)))
                        )
                            winner = { ...rule, weight };
                    }
                    if (!winner) continue;
                    const probe = document.createElement('span');
                    probe.style.setProperty('color', winner.value);
                    link.append(probe);
                    const resolved = getComputedStyle(probe).color;
                    probe.remove();
                    out.push({
                        block: id,
                        where: /** @type {any} */ (window).kpPath(link),
                        selector: winner.selector,
                        rgba: /** @type {any} */ (window).kpRgba(resolved),
                    });
                }
            }
            return out;
        }, BLOCKS);

        expect(visited.length, 'the navigation blocks hold links to measure').toBeGreaterThan(0);
        const faults = visited.filter((v) => isBlue(v.rgba)).map((v) => `#${v.block} visited ${v.where} — "${v.selector}" ${show(v.rgba)}`);
        expect(faults, `blue when visited:\n${faults.join('\n')}`).toEqual([]);
    });

    test('every word in a navigation block clears 7:1 against the ground it is composited on', async ({ page }) => {
        await open(page);
        const measured = await page.evaluate((blocks) => {
            /** @type {any[]} */
            const out = [];
            for (const id of blocks) {
                for (const root of document.querySelectorAll(`#${id} .cat-stage`)) {
                    for (const el of [root, ...root.querySelectorAll('*')]) {
                        const own = [...el.childNodes].some((n) => n.nodeType === 3 && (n.textContent ?? '').trim().length > 0);
                        if (!own) continue;
                        if (el.getClientRects().length === 0) continue;
                        const cs = getComputedStyle(el);
                        if (cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
                        const ink = /** @type {any} */ (window).kpRgba(cs.color);
                        if (ink[3] === 0) continue;
                        out.push({
                            block: id,
                            where: /** @type {any} */ (window).kpPath(el),
                            words: (el.textContent ?? '').trim().slice(0, 30),
                            ink,
                            ground: /** @type {any} */ (window).kpGround(el),
                        });
                    }
                }
            }
            return out;
        }, BLOCKS);

        expect(measured.length, 'the navigation blocks hold text to measure').toBeGreaterThan(0);
        /** @type {string[]} */
        const faults = [];
        for (const m of measured) {
            const ratio = contrast(rgb(m.ink), rgb(m.ground));
            if (ratio < BAR) faults.push(`#${m.block} ${m.where} "${m.words}" ${ratio.toFixed(2)}:1 — ${show(m.ink)} on ${show(m.ground)}`);
        }
        expect(faults, `under ${BAR}:1:\n${faults.join('\n')}`).toEqual([]);
    });
});
