// Two surfaces in one theme [TH116, AR38].
//
// The concept demo carries a hero surface and an app surface. Under a
// theme that gives the hero its own ground, the two sections paint two
// different grounds, and every piece of text on either still clears its
// contrast floor with the ground it actually sits on — measured on the
// rendered page, not on the token file, because the hero block remaps
// what a component reads and a remap can point at the wrong thing.
//
// Drill [KT3]: with the generator's hero block removed (`heroes` left out
// of build() in gates/generate-themes.mjs, `npm run generate`), the hero
// and the app paint the same ground under cyberpunk and the first test
// goes red on "the hero paints the app's ground"; the contrast test alone
// would stay green, because the app's colours read fine on the hero too.
// Performed 2026-09-07, both browsers, then restored.

import { expect, test } from '@playwright/test';
import { THEMES } from '../js/theme-registry.js';

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

/** @param {string} rgb a computed `rgb(r, g, b)` or `rgba(r, g, b, a)` */
function luminance(rgb) {
    const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) throw new Error(`not a colour: ${rgb}`);
    const [r, g, b] = [m[1], m[2], m[3]].map((v) => {
        const c = Number(v) / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
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
        if (image && image !== 'none' && fills) {
            const stops = image.match(/rgba?\\([^)]*\\)/g) ?? [];
            const opaque = stops.filter((c) => !/rgba\\(\\d+, \\d+, \\d+, 0\\)/.test(c));
            if (opaque.length > 0) return opaque;
        }
        const bg = style.backgroundColor;
        if (bg && !/rgba\\(\\d+, \\d+, \\d+, 0\\)/.test(bg) && bg !== 'transparent') return [bg];
        node = node.parentElement;
    }
    return [getComputedStyle(document.documentElement).backgroundColor];
}`;

test.describe('two surfaces in one theme [TH116]', () => {
    test('under cyberpunk the hero paints its own ground, and the app paints the theme background', async ({ page }) => {
        await open(page, 'cyberpunk');
        const hero = page.locator('[data-kp-surface="hero"]').first();
        const app = page.locator('[data-kp-surface="app"]').first();
        const [heroGround] = await hero.evaluate((el, src) => new Function(`return ${src}`)()(el), GROUND);
        const [appGround] = await app.evaluate((el, src) => new Function(`return ${src}`)()(el), GROUND);
        const expected = await page.evaluate(() => {
            const style = getComputedStyle(document.documentElement);
            return { hero: style.getPropertyValue('--surface-hero-bg').trim(), app: style.getPropertyValue('--background').trim() };
        });
        // The token is an hsl() literal; the paint is rgb(). Compare by
        // painting the token on a probe element in the same document.
        const paint = await page.evaluate(
            ([hsl1, hsl2]) => {
                const probe = document.createElement('div');
                document.body.append(probe);
                const out = [];
                for (const value of [hsl1, hsl2]) {
                    probe.style.backgroundColor = value;
                    out.push(getComputedStyle(probe).backgroundColor);
                }
                probe.remove();
                return out;
            },
            [expected.hero, expected.app],
        );
        expect(heroGround, "the hero paints the app's ground").not.toBe(appGround);
        expect(heroGround).toBe(paint[0]);
        expect(appGround).toBe(paint[1]);
    });

    for (const theme of THEMES) {
        test(`every text on both surfaces clears its contrast floor under ${theme.name}`, async ({ page }) => {
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
                .map((f) => `${f.surface} ${f.tag} "${f.text}": ${f.fg} on ${f.bgs.join(' | ')} = ${worst(f).toFixed(2)} (floor ${f.floor})`);
            expect(failures.length, 'nothing measured').toBeGreaterThan(10);
            expect(bad).toEqual([]);
        });
    }
});
