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
    // A relative colour (`hsl(from …)`, the synthwave register) computes
    // to `color(srgb r g b)`; a plain one to `rgb(r, g, b)`.
    const srgb = rgb.match(/color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)/);
    const m = srgb ? [srgb[0], ...srgb.slice(1).map((v) => String(Math.round(Number(v) * 255)))] : rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
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

    // A pair an approved demo puts under the floor is REPORTED, not lifted
    // [S49, S42]: the register carries the demo's own value, the shortfall
    // is measured here with the demo it came from, and Kenny decides at
    // that theme's ratification. An entry whose theme no longer paints it
    // is a failure of its own, so this list cannot go stale quietly.
    /**
     * One theme may excuse more than one pair — blueprint's lede carries
     * two marks with the demo's identical translucent wash, both caught by
     * this helper's alpha-blind GROUND (below), which reads a translucent
     * `background-color` as an opaque one instead of compositing it over
     * its ancestor. So every entry is a list.
     *
     * @type {Record<string, { measured: number, what: string, why: string }[]>}
     */
    const REPORTED = {
        'shade-dark': [
            {
                measured: 4.21,
                what: 'app p "FILE 06 · STATUS: PREVIEW · CL"',
                why: "the demo's own `.microlabel { color: var(--accent) }` is one rule for every surface, and on the card the accent measures 4.21 against the 4.5 floor. The demo's contrast table lists twelve pairs and never this one — it only ever measured the accent as a background. Reported at the shade-dark lift, 2026-09-08, awaiting Kenny.",
            },
        ],
        blueprint: [
            {
                measured: 1.54,
                what: 'hero mark "where it counts"',
                why: "the demo's own `.kp-lede mark { background-color: rgba(81, 210, 236, .28); color: var(--fg); }` is a translucent cyan wash, and this helper's GROUND treats any non-fully-transparent `background-color` as an opaque ground rather than compositing it over the mark's true ancestor (`--background`). Composited by hand (alpha-blend in sRGB, the way a browser paints it): rgb(223,242,246) on the wash-over-background is 7.75, well clear of 4.5 — this entry is the test tool's limitation, not a contrast fault. Reported at the blueprint lift, 2026-09-08, awaiting Kenny.",
            },
            {
                measured: 1.54,
                what: 'hero mark "where it hurts"',
                why: 'the demo\'s second lede mark, the same wash and the same false reading as "where it counts" above — see that entry for the composited value.',
            },
        ],
        ticker: [
            {
                measured: 1.7,
                what: 'hero mark "where it counts"',
                why: "the demo's own `.kp-lede mark.kp-revealed { background: rgba(245, 161, 36, 0.18); color: var(--fg); }` — one rule for every mark — measures 1.70 here because this suite reads the mark's own declared colour pair without compositing the 18% wash over the black it actually sits on; the demo's own contrast table (scratchpad/ticker-demo.html) never scores this pair either, only the solid ones. The rendered pixel is not this number: 18% amber over #0A0A0A composites to roughly rgb(52,37,15), which clears the floor by a wide margin against near-white ink. Reported at the ticker lift, 2026-09-08, awaiting Kenny.",
            },
            {
                measured: 1.7,
                what: 'hero mark "where it hurts"',
                why: "the same rule, the lede's second mark.",
            },
            {
                measured: 1.7,
                what: 'app mark "violet night and magenta"',
                why: "the dossier's marks read the same rule at 22% (`.kp-card[data-kp-reveal='emphasis'] mark.is-cleared`), the demo's own `.kp-card[data-kp-revealed] mark { background: rgba(245, 161, 36, 0.22); }` — same finding, same composited pixel is fine.",
            },
            {
                measured: 1.7,
                what: 'app mark "signal yellow and blood red"',
                why: "the dossier's second mark, same rule.",
            },
            {
                measured: 1.7,
                what: 'app mark "opt-in and reduced-motion safe"',
                why: "the dossier's third mark, same rule.",
            },
        ],
    };

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
            const reported = REPORTED[theme.name];
            if (reported) {
                for (const entry of reported) {
                    const named = bad.filter((line) => line.startsWith(entry.what));
                    expect(named, `${theme.name} no longer paints the pair this list excuses — remove the entry:\n${entry.why}`).toHaveLength(1);
                    expect(Number(named[0].match(/= ([\d.]+) /)?.[1]), 'the reported pair still measures what the report says').toBeCloseTo(
                        entry.measured,
                        1,
                    );
                }
                const unexplained = bad.filter((line) => !reported.some((entry) => line.startsWith(entry.what)));
                expect(unexplained, `${theme.name} has bad pairs the REPORTED list does not excuse`).toEqual([]);
                return;
            }
            expect(bad).toEqual([]);
        });
    }
});
