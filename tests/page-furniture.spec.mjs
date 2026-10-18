// A theme's page-level furniture belongs to the page, not to a preview
// [Kenny, 2026-09-12, at the release gate].
//
// Two faults he found by opening the documentation site, and neither was
// expressible as an assertion anyone had thought to write — which is the
// whole reason that rule exists.
//
// The first: terminal draws a CRT bezel and a scanning sweep as
// `position: fixed` pseudo-elements on whatever carries `data-theme`. A
// fixed element escapes its container, so a page that previews a theme
// inside a box — the site puts one story card per theme, each with its own
// `data-theme` — got terminal's bezel and its green sweep across the WHOLE
// viewport, over its own navigation, while the page itself wore formal.
//
// The second: the bezel is up to 18px of frame drawn over the viewport
// edge, and anything the page puts within that distance disappears behind
// it. Measured at 1600px before the repair: the site's first navigation
// link started at 8px and lost 9.8 of them, and the approved demo hid its
// own skip link and two picker buttons by ten pixels each. Clicks landed —
// the bezel takes no pointer events — but Kenny's words are the bar: "links
// moeten compleet en klikbaar zijn".
//
// Drilled 2026-09-13 in firefox; the record is beside each test.
import { readdirSync, readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// Motion stays on here: this file reads animations or transitions, and the
// suite runs with reduced motion otherwise (playwright.config.mjs).
test.use({ contextOptions: { reducedMotion: 'no-preference' } });

const THEMES = readdirSync(new URL('../showcase/themes/', import.meta.url))
    .filter((n) => n.endsWith('.html'))
    .map((n) => n.slice(0, -'.html'.length));

/** Every fixed-position pseudo-element a register hangs on the theme attribute itself. */
const rootFurniture = () => {
    /** @type {string[]} */
    const found = [];
    for (const file of readdirSync(new URL('../css/', import.meta.url)).filter((f) => f.endsWith('-register.css'))) {
        const source = readFileSync(new URL(`../css/${file}`, new URL('../css/', import.meta.url)), 'utf8');
        for (const m of source.matchAll(/^\s*(:?[a-z]*\[data-theme='[a-z-]+'\]::(?:before|after))\s*\{([^}]*)\}/gm)) {
            if (m[2].includes('position: fixed')) found.push(`${file}: ${m[1].trim()}`);
        }
    }
    return found;
};

// Drill: `:root` removed from the two terminal rules and the bundle
// regenerated -> red, both selectors reported. Restored: green.
test(
    'page-level furniture is bound to the root, so a preview cannot take over the page [Kenny 2026-09-12]',
    { tag: ['@sweep', '@component:site'] },
    () => {
        const furniture = rootFurniture();
        // Terminal, the theme whose bezel and sweep this guards against, was
        // removed on 2026-10-16; the guard stays for the next register that
        // hangs fixed furniture on the theme attribute.
        const loose = furniture.filter((line) => !line.includes(':root['));
        expect(
            loose,
            `these rules paint fixed furniture on ANY element carrying the theme, so a card previewing that theme covers the whole viewport:\n${loose.join('\n')}`,
        ).toEqual([]);
    },
);

// Drill: the same `:root` removal -> red on every theme, because
// terminal's sweep then covers all of them. Restored: green.
test(
    'a page previewing every theme in its own card gets no theme’s page furniture [Kenny 2026-09-12]',
    { tag: ['@sweep', '@component:site'] },
    async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.goto('/site/index.html');

        // The site's own theme stays formal; the cards below each wear their own.
        const leaked = await page.evaluate(() => {
            const out = [];
            for (const el of document.querySelectorAll('[data-theme]')) {
                if (el === document.documentElement) continue;
                for (const pseudo of ['::before', '::after']) {
                    const s = getComputedStyle(el, pseudo);
                    if (s.content === 'none') continue;
                    if (s.position === 'fixed')
                        out.push(`${el.getAttribute('data-theme')} ${pseudo}: ${s.animationName}, border ${s.borderTopWidth}`);
                }
            }
            return out;
        });

        expect(leaked, `a card previewing a theme paints fixed furniture over the whole page:\n${leaked.join('\n')}`).toEqual([]);
        expect(THEMES.length, 'the page should carry a card per theme').toBe(
            JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8')).length,
        );
    },
);
