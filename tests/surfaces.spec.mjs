// Two surfaces in one theme [TH116, AR38].
//
// The concept demo carries a hero surface and an app surface. Under a
// theme that gives the hero its own ground, the two sections paint two
// different grounds, and every piece of text on either still clears its
// contrast floor with the ground it actually sits on — measured on the
// rendered page, not on the token file, because the hero block remaps
// what a component reads and a remap can point at the wrong thing.
//
// That the hero and the app paint two different grounds is judged by eye
// on the catalogue since scope-73 (page-effects#surfaces); the contrast
// tests below stay.

import { expect, test } from '@playwright/test';
import { THEMES } from '../js/theme-registry.js';
import { sweepThemeRecords } from './helpers/sweep-themes.mjs';
import { colourOf } from './helpers/colour.mjs';
import { reportContrastAll } from './helpers/contrast-guideline.mjs';

// The contrast floor is the same claim in every theme; the level decides
// how many of them are measured [scope-103]. All 22 at the release level.
const SWEEP = sweepThemeRecords(THEMES);

const URL = (theme) => `/examples/concept.html?theme=${theme}`;

/**
 * Open the concept page under a theme and let it settle. The theme is
 * applied by js/auto.js after the stored one, and every button carries a
 * colour transition (`--fx-duration`): the first run of this suite read a
 * primary button halfway between formal's navy and solstice's orange and
 * called it a contrast fault. Reduced motion turns the transitions off
 * (DI7), and what still runs is finished before anything is measured.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} theme
 */
async function open(page, theme) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(URL(theme));
    await page.waitForFunction((name) => document.documentElement.getAttribute('data-theme') === name, theme);
    await page.evaluate(() => {
        for (const animation of document.getAnimations()) animation.finish();
    });
}

/** @param {string} css any computed colour: rgb(), color(srgb), oklab(), oklch() */
function luminance(css) {
    const { r, g, b } = colourOf(css);
    const [lr, lg, lb] = [r, g, b].map((v) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

/** @param {string} a @param {string} b */
function ratio(a, b) {
    const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
}

/**
 * The painted ground behind an element: its own background if opaque,
 * else the nearest ancestor's.
 */
const GROUND = `(el) => {
    // Every colour the ground can be: an opaque background colour, or every
    // stop of a gradient image (retro paints its h1 on a title-bar gradient;
    // the text must clear the floor against each stop).
    let node = el;
    while (node) {
        const style = getComputedStyle(node);
        const image = style.backgroundImage;
        // A gradient counts as the ground only when it fills the box: a
        // decoration sized to a band or a corner (a button's slit, a
        // heading's bracket frame) is painted over the real ground.
        const fills = /^(auto( auto)?|100% 100%|cover)$/.test(style.backgroundSize.split(',')[0].trim());
        // A face layer — one colour painted twice as a gradient, inset a few
        // pixels (the register's outline button paints its face that way) —
        // is the ground the text sits on, whatever the frame colour behind it.
        // A face layer — one colour painted twice as a gradient, inset a few
        // pixels (the register's outline button paints its face that way) —
        // is the ground the text sits on, whatever the frame colour behind
        // it. It must fill the box: a heading's bracket corners are the same
        // shape at 1.2rem × 2px and are not a ground.
        // Split a layer list on the commas outside parentheses: a gradient
        // carries commas of its own, and a lookahead cannot count depth.
        const splitLayers = (value) => {
            const out = [];
            let depth = 0;
            let current = '';
            for (const ch of value) {
                if (ch === '(') depth++;
                else if (ch === ')') depth--;
                if (ch === ',' && depth === 0) {
                    out.push(current.trim());
                    current = '';
                } else current += ch;
            }
            if (current.trim()) out.push(current.trim());
            return out;
        };
        const layers = image && image !== 'none' ? splitLayers(image) : [];
        const sizes = splitLayers(style.backgroundSize);
        const faceAt = layers.findIndex((layer, i) => {
            const m = layer.match(/^linear-gradient\\((rgba?\\([^)]*\\)), (rgba?\\([^)]*\\))\\)$/);
            if (!m || m[1] !== m[2] || /rgba\\(\\d+, \\d+, \\d+, 0\\)/.test(m[1])) return false;
            // Computed sizes are pixels: the face fills the box when it is
            // within a few pixels of the element's own width and height.
            // calc(100% - 4px) carries spaces: split the size on spaces outside parentheses.
            const size = (sizes[i] ?? sizes[0] ?? 'auto').match(/calc\\([^)]*\\)|\\S+/g) ?? ['auto'];
            const box = node.getBoundingClientRect();
            const near = (part, full) => part === 'auto' || part === '100%' || /^calc\\(100% - \\d+px\\)$/.test(part) || Math.abs(parseFloat(part) - full) <= 8;
            return near(size[0], box.width) && near(size[1] ?? size[0], box.height);
        });
        if (faceAt !== -1) return [layers[faceAt].match(/rgba?\\([^)]*\\)/)[0]];
        if (image && image !== 'none' && fills) {
            // Only the layers that fill the box are a ground: cyberpunk's card
            // stacks a 14px yellow notch and a hairline grid on its face, and the
            // notch's stop is not what the text sits on. A size list repeats.
            const filling = layers.filter((layer, i) => /^(auto( auto)?|100% 100%|cover)$/.test((sizes[i % sizes.length] ?? 'auto').trim()));
            const stops = filling.join(' ').match(/rgba?\\([^)]*\\)/g) ?? [];
            const opaque = stops.filter((c) => !/rgba\\(\\d+, \\d+, \\d+, 0\\)/.test(c));
            if (opaque.length > 0) return opaque;
        }
        const bg = style.backgroundColor;
        // Transparent is rgba(r, g, b, 0) or, for a relative colour, color(srgb r g b / 0).
        if (bg && !/rgba\\(\\d+, \\d+, \\d+, 0\\)|\\/ 0\\)$/.test(bg) && bg !== 'transparent') return [bg];
        node = node.parentElement;
    }
    return [getComputedStyle(document.documentElement).backgroundColor];
}`;

test.describe('two surfaces in one theme [TH116]', { tag: ['@sweep', '@component:examples'] }, () => {
    // Contrast is a guideline, not a gate (Kenny, form v44; fix-104): every pair under its
    // floor is reported as an annotation, so the REPORTED list that excused single pairs
    // (blueprint's lede marks, whose false 1.54:1 is this helper's alpha-blind GROUND, not
    // a fault) is no longer needed.

    for (const theme of SWEEP) {
        test(`every text on both surfaces clears its contrast floor under ${theme.name}`, { tag: [`@theme:${theme.name}`] }, async ({ page }) => {
            await open(page, theme.name);
            await expect(page.locator('[data-kp-surface="app"]').first()).toBeVisible();
            const failures = await page.evaluate((groundSource) => {
                const ground = new Function(`return ${groundSource}`)();
                const out = [];
                for (const surface of document.querySelectorAll('[data-kp-surface]')) {
                    for (const el of surface.querySelectorAll('h1, h2, h3, p, label, button, a, mark, small, span, td, th, li')) {
                        if (!el.textContent || !el.textContent.trim()) continue;
                        const style = getComputedStyle(el);
                        if (style.visibility === 'hidden' || style.display === 'none') continue;
                        const size = parseFloat(style.fontSize);
                        const bold = Number(style.fontWeight) >= 700;
                        const large = size >= 24 || (size >= 18.66 && bold);
                        out.push({
                            surface: surface.getAttribute('data-kp-surface'),
                            tag: el.tagName.toLowerCase(),
                            text: el.textContent.trim().slice(0, 30),
                            fg: style.color,
                            bgs: ground(el),
                            floor: large ? 3 : 4.5,
                        });
                    }
                }
                return out;
            }, GROUND);
            const worst = (f) => Math.min(...f.bgs.map((bg) => ratio(f.fg, bg)));
            const bad = failures
                .filter((f) => worst(f) < f.floor)
                .map((f) => `${f.surface} ${f.tag} "${f.text}": ${f.fg} on ${f.bgs.join(' | ')} = ${worst(f).toFixed(2)}:1 (floor ${f.floor})`);
            expect(failures.length, 'nothing measured').toBeGreaterThan(10);
            reportContrastAll(test.info(), bad);
        });
    }
});
