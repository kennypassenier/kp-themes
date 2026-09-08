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
    // TH116: the hero surface is a second ground with its own ink, second
    // ink, muted ink, button, alert and card. Every text pair a component
    // can form on it is measured like the app's [AR38].
    ['surface-hero-bg', 'surface-hero-fg'],
    ['surface-hero-bg', 'surface-hero-fg-2'],
    ['surface-hero-bg', 'surface-hero-muted'],
    ['surface-hero-bg', 'surface-hero-primary'], // the hero's link and button colour as text on the hero
    ['surface-hero-bg', 'surface-hero-danger'], // the alert as text on the hero
    ['surface-hero-primary', 'surface-hero-primary-foreground'],
    ['surface-hero-danger', 'surface-hero-danger-foreground'],
    ['surface-hero-card', 'surface-hero-card-foreground'],
    ['surface-hero-card', 'surface-hero-muted'], // muted ink on the hero card
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
    ['surface-hero-bg', 'surface-hero-border'], // TH116: the hero's frame is a boundary on its ground (SC 1.4.11)

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
    'kp-text-xs': 'not a colour (a length: one step of the typography scale) [TH94, R0-TYPO]',
    'kp-text-sm': 'not a colour (a length: one step of the typography scale) [TH94, R0-TYPO]',
    'kp-text-md': 'not a colour (a length: one step of the typography scale) [TH94, R0-TYPO]',
    'kp-text-display': 'not a colour (a length: the display step of the typography scale, a headline on a hero) [S47]',
    'kp-space-xs': 'not a colour (a length: one step of the spacing scale) [TH94]',
    'kp-space-sm': 'not a colour (a length: one step of the spacing scale) [TH94]',
    'kp-space-md': 'not a colour (a length: one step of the spacing scale) [TH94]',
    'kp-space-lg': 'not a colour (a length: one step of the spacing scale) [TH94]',
    'kp-space-xl': 'not a colour (a length: one step of the spacing scale) [TH94]',
    'kp-space-2xl': 'not a colour (a length: one step of the spacing scale) [TH94]',
    'theme-font-body': 'not a colour',
    'theme-font-display': 'not a colour',
    'theme-font-mono': 'a font stack, not a colour; the mono face of the theme (the contract since 5.0.0, S47)',
    'fx-overprint':
        'a decorative second ink, drawn at 40% alpha behind a heading that carries its own --foreground; it is not a surface and nothing reads on it',
    'fx-scanline': 'a 1px line at 4% alpha across the texture layer; at that opacity it is a veil rather than a surface',
    'fx-hot':
        "the ink a theme that BRIGHTENS under pressure gives a hovered control, DI3's opt-out [S49, A9]. No pair here can measure it: which surface it lands on is the register's choice, and a theme whose register never opts in never paints it. The one register that does — terminal's, on its own plate — has the painted pair measured in the browser by tests/register-terminal.spec.mjs, which reads what is drawn rather than what a pair would predict.",
    'fx-hot-alarm': 'as --fx-hot, for the destructive control',
    'fx-notch': 'not a colour (a length)',
    'fx-lift': 'not a colour (how far a thing moves when it moves; 0 is a real answer)',
    'fx-shadow-offset': 'not a colour (a length: how far the hard shadow sits from its box; 0 paints nothing) [TH85]',
    'chart-pattern-1': 'not a colour (an image drawn over chart-1 so a series is told apart without hue; none in every theme but mono) [TH86]',
    'chart-pattern-2': 'not a colour (an image drawn over chart-2 so a series is told apart without hue; none in every theme but mono) [TH86]',
    'chart-pattern-3': 'not a colour (an image drawn over chart-3 so a series is told apart without hue; none in every theme but mono) [TH86]',
    'chart-pattern-4': 'not a colour (an image drawn over chart-4 so a series is told apart without hue; none in every theme but mono) [TH86]',
    'chart-pattern-5': 'not a colour (an image drawn over chart-5 so a series is told apart without hue; none in every theme but mono) [TH86]',
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

/**
 * The hero block of a theme, `[data-theme='x'] [data-kp-surface='hero']`
 * [TH116, AR38]: where the generator writes the hero's derived states.
 *
 * @param {string} name @returns {string}
 */
function heroBlock(name) {
    const re = new RegExp(`\\[data-theme='${name}'\\] \\[data-kp-surface='hero'\\]\\s*\\{([^}]+)\\}`);
    const m = css.match(re);
    if (!m) throw new Error(`hero block not found: ${name} (the generator writes one per theme since C1)`);
    return m[1];
}

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
    // Rounded to 8 bits per channel, because that is what the browser
    // paints: light's warning pair measured 4.50 here and 4.48 on the
    // rendered page (tests/surfaces.spec.mjs, 2026-09-07) until this
    // rounding matched the browser's [TH116].
    return [r + m, g + m, b + m].map((v) => Math.round(v * 255) / 255);
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
    // KT2 on the hero: the pressed button and alert are visibly pressed.
    // The base lives in the theme block, the state in the hero block.
    for (const [source, target] of [
        ['surface-hero-primary', 'primary'],
        ['surface-hero-danger', 'destructive'],
    ]) {
        try {
            const base = tokenHsl(block, source);
            const active = tokenHsl(heroBlock(theme), `${target}-active`);
            const d = distance(
                hsl(`hsl(${base.h}, ${base.s * 100}%, ${base.l * 100}%)`),
                hsl(`hsl(${active.h}, ${active.s * 100}%, ${active.l * 100}%)`),
            );
            if (d < 10) {
                failures++;
                console.error(`FAIL ${theme}: on the hero, --${target}-active is only ${d.toFixed(1)} from --${source} (need >= 10)`);
            }
        } catch (e) {
            failures++;
            console.error(`FAIL ${theme}: hero states: ${e instanceof Error ? e.message : String(e)}`);
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
