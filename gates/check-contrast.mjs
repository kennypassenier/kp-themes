// Every theme's declared colour pairs must meet WCAG AA (4.5:1; accent
// surfaces 3:1 for large text). Parses a themes stylesheet, computes the
// contrast per theme, exits non-zero on any violation. Wired into
// `npm run gates` - a theme that fails cannot ship.
//
// Usage: node scripts/check-contrast.mjs [path/to/themes.css]
//        (default: css/themes.css in this package)
import { readFileSync } from 'node:fs';
import process from 'node:process';
import { distance, hsl } from './colour.mjs';

const target = process.argv[2] ? new URL(process.argv[2], `file://${process.cwd()}/`) : new URL('../css/themes.css', import.meta.url);
const css = readFileSync(target, 'utf8');

// Discovered from the stylesheet: every [data-theme='x'] block that
// declares --background is a palette. The name pattern accepts digits and
// hyphens - it used to accept lowercase letters only, so a theme called
// `high-contrast` was silently skipped while the run reported that every
// theme passed (AR8-D1, found by the Phase 4 critic pass). The count is
// now checked against themes/order.json rather than a floor, so a theme
// going missing is an error instead of a smaller green number.
/**
 * @param {string} source
 * @param {{expect?: number}} [options]
 * @returns {string[]}
 */
export function discoverThemesFromCss(source, { expect } = {}) {
    const found = [...new Set([...source.matchAll(/\[data-theme='([a-z0-9-]+)'\]\s*\{[^}]*--background:/g)].map((m) => m[1]))];
    if (expect !== undefined && found.length !== expect) {
        throw new Error(`theme discovery broke: expected ${expect} themes, found ${found.length} [${found}]`);
    }
    return found;
}

/** The themes this stylesheet is supposed to contain, from the token source. */
export const EXPECTED_THEMES = JSON.parse(readFileSync(new URL('../themes/order.json', import.meta.url), 'utf8'));

const THEMES = discoverThemesFromCss(css, { expect: EXPECTED_THEMES.length });

// Application-pipeline status badges: text on a coloured plate.
export const STATUS_NAMES = ['draft', 'sent', 'screening', 'interview', 'offer', 'rejected', 'withdrawn'];

const PAIRS = [
    ['background', 'foreground'],
    ['card', 'card-foreground'],
    ['popover', 'popover-foreground'],
    ['primary', 'primary-foreground'],
    ['secondary', 'secondary-foreground'],
    ['muted', 'muted-foreground'],
    ['background', 'muted-foreground'],
    ['card', 'muted-foreground'],
    ['destructive', 'destructive-foreground'],
    ['success', 'success-foreground'],
    ['warning', 'warning-foreground'],
    ['info', 'info-foreground'],
    ['sidebar-background', 'sidebar-foreground'],
    ['sidebar-primary', 'sidebar-primary-foreground'],
    ['sidebar-accent', 'sidebar-accent-foreground'],
    ['background', 'primary'], // primary used as link text on the page bg
    ['background', 'destructive'], // the picker's "not saved" line is destructive text on the page
    ['fx-signal', 'fx-signal-foreground'], // TH15: the HUD signal plate carries text
    ['background', 'link'], // TH31: links, on the page and on a card
    ['card', 'link'],
    ['background', 'link-visited'],
    ['card', 'link-visited'],
    ['muted', 'foreground'], // TH32: code, pre and kbd sit on the muted surface
    ...STATUS_NAMES.map((s) => [`status-${s}`, `status-${s}-foreground`]),
];
// Accent surfaces carry large text/icons in this design system: 3:1.
const LARGE_PAIRS = [['accent', 'accent-foreground']];

/**
 * Non-text pairs [TH15]: SC 1.4.11 asks 3:1 of graphical objects needed to
 * understand the content, and of the parts of a control that identify it.
 * A chart series nobody can see against the page is a graph with a missing
 * line; a HUD accent is a graphic, not prose.
 */
const NON_TEXT_PAIRS = [
    ['background', 'fx-signal'],
    ['background', 'chart-1'],
    ['background', 'chart-2'],
    ['background', 'chart-3'],
    ['background', 'chart-4'],
    ['background', 'chart-5'],
    ['background', 'ring'],
    ['sidebar-background', 'sidebar-ring'],
];

/**
 * Colour tokens deliberately not measured here, each with its reason
 * [TH15, AR8]. The completeness check below refuses a token that is in
 * neither a pair list nor this one, so the next token someone adds cannot
 * be silently unmeasured — which is exactly how the nine pairs this
 * milestone closes came to be uncovered in the first place.
 */
/** @type {Record<string, string>} */
const EXEMPT = {
    border: 'a hairline divider between areas of the same surface, not a control boundary — --border-strong is the one SC 1.4.11 applies to, and check-invariants.mjs holds it at 3:1 against all three surfaces',
    'sidebar-border': 'as --border',
    selected: 'a boundary, gated at 3:1 by check-invariants.mjs rather than here',
    'border-strong': 'gated at 3:1 by check-invariants.mjs',
    input: 'gated at 3:1 by check-invariants.mjs',
    'focus-ring': 'gated by check-invariants.mjs, which measures the pair and every surface it can land on (DI2)',
    'focus-ring-contrast': 'as --focus-ring',
    link: 'measured against background and card in PAIRS above',
    'link-visited': 'as --link',
    'color-scheme': 'not a colour',
    radius: 'not a colour',
    'theme-font-body': 'not a colour',
    'theme-font-display': 'not a colour',
    'fx-overprint':
        'a decorative second ink, drawn at 40% alpha behind a heading that carries its own --foreground; it is not a surface and nothing reads on it',
    'fx-scanline': 'a 1px line at 4% alpha across the texture layer; at that opacity it is a veil rather than a surface',
    'fx-notch': 'not a colour (a length)',
    'fx-lift': 'not a colour (how far a thing moves when it moves; 0 is a real answer)',
    'fx-shadow-offset': 'not a colour (a length: how far the hard shadow sits from its box; 0 paints nothing) [TH85]',
    'fx-duration': 'not a colour',
    'fx-ease': 'not a colour',
};

/** @param {string} name @returns {string} */
/**
 * Pairs that must be far APART rather than readable, measured on the
 * generated stylesheet [Phase 7, G1].
 *
 * These live here rather than in check-invariants.mjs for a reason found
 * in the Phase 7 audit: that gate reads the token source, and these
 * tokens are derived, so the check it held for the visited link guarded
 * `theme.tokens['link-visited'] !== undefined` — which no theme declares.
 * The branch never ran. It sat green next to the real checks, which is
 * worse than not having it.
 *
 * Read from the artefact, they measure what a consumer actually receives,
 * however it got there — derived, authored, or hand-edited afterwards.
 *
 * @type {[string, string, number][]}
 */
const DISTANCE_PAIRS = [
    ['link', 'link-visited', 12], // TH31: a visited link says something only if it looks different
    ['primary', 'primary-active', 10], // KT2: a pressed state you can see
    ['secondary', 'secondary-active', 10],
    ['accent', 'accent-active', 10],
    ['destructive', 'destructive-active', 10],
];

/** @param {string} name @returns {string} */
function themeBlock(name) {
    const re = new RegExp(`\\[data-theme='${name}'\\]\\s*\\{([^}]+)\\}`);
    const m = css.match(re);
    if (!m) throw new Error(`theme block not found: ${name}`);
    return m[1];
}

/** @param {string} block @param {string} token @returns {{h: number, s: number, l: number}} */
function tokenHsl(block, token) {
    const re = new RegExp(`--${token}:\\s*hsl\\(([^)]+)\\)`);
    const m = block.match(re);
    if (!m) throw new Error(`token --${token} missing`);
    const [h, s, l] = m[1].split(',').map(/** @param {string} v */ (v) => parseFloat(v));
    return { h, s: s / 100, l: l / 100 };
}

/** @param {{h: number, s: number, l: number}} hsl @returns {number[]} */
function hslToRgb({ h, s, l }) {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
    return [r + m, g + m, b + m];
}

/** @param {number[]} rgb */
function luminance(rgb) {
    const [r, g, b] = rgb.map(/** @param {number} v */ (v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** @param {{h: number, s: number, l: number}} a @param {{h: number, s: number, l: number}} b */
function ratio(a, b) {
    const [l1, l2] = [luminance(hslToRgb(a)), luminance(hslToRgb(b))].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
}

/**
 * AR8: the gate answers "did I check everything". Every colour token a
 * theme declares must appear in a pair list or in EXEMPT with a reason.
 * @param {string} block
 * @returns {string[]} tokens nothing accounts for
 */
export function unaccountedTokens(block) {
    const declared = [...block.matchAll(/--([a-z0-9-]+):/g)].map((m) => m[1]);
    const covered = new Set([...PAIRS, ...LARGE_PAIRS, ...NON_TEXT_PAIRS].flat());
    // A derived state belongs to the surface it came from, which is
    // already measured; listing twelve of them would say nothing new.
    const derived = /-(hover|active|disabled)$/;
    return declared.filter((t) => !covered.has(t) && EXEMPT[t] === undefined && !derived.test(t));
}

let failures = 0;
for (const theme of THEMES) {
    const block = themeBlock(theme);
    for (const [a, b, floor] of DISTANCE_PAIRS) {
        let d;
        try {
            d = distance(
                hsl(`hsl(${tokenHsl(block, a).h}, ${tokenHsl(block, a).s * 100}%, ${tokenHsl(block, a).l * 100}%)`),
                hsl(`hsl(${tokenHsl(block, b).h}, ${tokenHsl(block, b).s * 100}%, ${tokenHsl(block, b).l * 100}%)`),
            );
        } catch (e) {
            failures++;
            console.error(`FAIL ${theme}: ${e instanceof Error ? e.message : String(e)}`);
            continue;
        }
        if (d < floor) {
            failures++;
            console.error(`FAIL ${theme}: --${b} is only ${d.toFixed(1)} from --${a} (need >= ${floor}); the difference is not visible`);
        }
    }
    for (const token of unaccountedTokens(block)) {
        failures++;
        console.error(`FAIL ${theme}: --${token} is measured by nothing. Add it to a pair list, or to EXEMPT with the reason.`);
    }
    /** @type {[string[][], number][]} */
    const lists = [
        [PAIRS, 4.5],
        [LARGE_PAIRS, 3.0],
        [NON_TEXT_PAIRS, 3.0],
    ];
    for (const [list, min] of lists) {
        for (const [bg, fg] of list) {
            let r;
            try {
                r = ratio(tokenHsl(block, bg), tokenHsl(block, fg));
            } catch (e) {
                failures++;
                console.error(`FAIL ${theme}: ${e instanceof Error ? e.message : String(e)}`);
                continue;
            }
            const ok = r >= min;
            if (!ok) {
                failures++;
                console.error(`FAIL ${theme}: ${fg} on ${bg} = ${r.toFixed(2)} (need >= ${min})`);
            }
        }
    }
}

if (failures > 0) {
    console.error(`\n${failures} contrast violation(s). A theme that fails AA cannot ship.`);
    process.exit(1);
}
console.log(
    `All ${THEMES.length} themes pass on ${PAIRS.length + LARGE_PAIRS.length + NON_TEXT_PAIRS.length} pairs ` +
        `(${PAIRS.length} at 4.5, ${LARGE_PAIRS.length + NON_TEXT_PAIRS.length} at 3.0, incl. ${STATUS_NAMES.length} status badges), ` +
        `${DISTANCE_PAIRS.length} pairs held apart in the shipped stylesheet; ` +
        `${Object.keys(EXEMPT).length} tokens are exempt with a stated reason.`,
);
