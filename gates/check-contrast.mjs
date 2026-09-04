// Every theme's declared colour pairs must meet WCAG AA (4.5:1; accent
// surfaces 3:1 for large text). Parses a themes stylesheet, computes the
// contrast per theme, exits non-zero on any violation. Wired into
// `npm run gates` - a theme that fails cannot ship.
//
// Usage: node scripts/check-contrast.mjs [path/to/themes.css]
//        (default: css/themes.css in this package)
import { readFileSync } from 'node:fs';
import process from 'node:process';

const target = process.argv[2] ? new URL(process.argv[2], `file://${process.cwd()}/`) : new URL('../css/themes.css', import.meta.url);
const css = readFileSync(target, 'utf8');

// Discovered from the stylesheet: every [data-theme='x'] block that
// declares --background is a palette. The name pattern accepts digits and
// hyphens - it used to accept lowercase letters only, so a theme called
// `high-contrast` was silently skipped while the run reported that every
// theme passed (AR8-D1, found by the Phase 4 critic pass). The count is
// now checked against themes/order.json rather than a floor, so a theme
// going missing is an error instead of a smaller green number.
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
    ...STATUS_NAMES.map((s) => [`status-${s}`, `status-${s}-foreground`]),
];
// Accent surfaces carry large text/icons in this design system: 3:1.
const LARGE_PAIRS = [['accent', 'accent-foreground']];

function themeBlock(name) {
    const re = new RegExp(`\\[data-theme='${name}'\\]\\s*\\{([^}]+)\\}`);
    const m = css.match(re);
    if (!m) throw new Error(`theme block not found: ${name}`);
    return m[1];
}

function tokenHsl(block, token) {
    const re = new RegExp(`--${token}:\\s*hsl\\(([^)]+)\\)`);
    const m = block.match(re);
    if (!m) throw new Error(`token --${token} missing`);
    const [h, s, l] = m[1].split(',').map((v) => parseFloat(v));
    return { h, s: s / 100, l: l / 100 };
}

function hslToRgb({ h, s, l }) {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
    return [r + m, g + m, b + m];
}

function luminance(rgb) {
    const [r, g, b] = rgb.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
    const [l1, l2] = [luminance(hslToRgb(a)), luminance(hslToRgb(b))].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
}

let failures = 0;
for (const theme of THEMES) {
    const block = themeBlock(theme);
    for (const [list, min] of [
        [PAIRS, 4.5],
        [LARGE_PAIRS, 3.0],
    ]) {
        for (const [bg, fg] of list) {
            let r;
            try {
                r = ratio(tokenHsl(block, bg), tokenHsl(block, fg));
            } catch (e) {
                failures++;
                console.error(`FAIL ${theme}: ${e.message}`);
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
console.log(`All ${THEMES.length} themes pass WCAG AA on ${PAIRS.length + LARGE_PAIRS.length} pairs (incl. ${STATUS_NAMES.length} status badges).`);
