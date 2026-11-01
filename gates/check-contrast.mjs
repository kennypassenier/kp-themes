// Every theme's declared colour pairs measured against WCAG AA (4.5:1;
// accent surfaces 3:1 for large text). Parses a themes stylesheet,
// computes the contrast per theme, and exits non-zero on any shortfall.
//
// This is ADVICE, not a gate (Kenny, 2026-09-09): it is in `npm run
// advice`, not in `npm run gates`, and nothing refuses a release over it.
// The exit code is for a person reading a terminal. gates/compliance.mjs
// quotes what this prints into docs/DESIGN_INVARIANTS.md so the package
// says plainly where it falls short rather than claiming it never does —
// and Phase 7 had to teach that call not to die on the exit code, which
// had quietly made this a gate again.
//
// Usage: node scripts/check-contrast.mjs [path/to/themes.css]
//        (default: css/themes.css in this package)
import { readFileSync } from 'node:fs';
import process from 'node:process';
import { distance, hsl, paintedContrast } from './colour.mjs';
import { DISTANCE_PAIRS, EXEMPT, LARGE_PAIRS, NON_TEXT_PAIRS, PAIRS, STATUS_NAMES } from './contrast-pairs.mjs';
export { STATUS_NAMES } from './contrast-pairs.mjs';

const target = process.argv[2] ? new URL(process.argv[2], `file://${process.cwd()}/`) : new URL('../css/themes.css', import.meta.url);
const css = readFileSync(target, 'utf8');

// Discovered from the stylesheet: every [data-theme='x'] block that
// declares --background is a palette. The name pattern accepts digits and
// hyphens - it used to accept lowercase letters only, so a theme called
// `high-contrast` (removed 2026-10-08) was silently skipped while the run reported that every
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

/**
 * The pair as the browser paints it [TH116, fix-59]. The rounding to 8 bits
 * a channel used to live here; it is `paintedContrast` in gates/colour.mjs
 * now, so the site gate and this one cannot answer differently about the
 * same two colours.
 * @param {{h: number, s: number, l: number}} a @param {{h: number, s: number, l: number}} b
 */
function ratio(a, b) {
    const asText = (/** @type {{h: number, s: number, l: number}} */ c) => `hsl(${c.h}, ${c.s * 100}%, ${c.l * 100}%)`;
    return paintedContrast(hsl(asText(a)), hsl(asText(b)));
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

// The measurement runs only when this file IS the command [fix-13].
//
// Until 2026-09-12 it ran on import, and ended in `process.exit(1)`. That
// made the accessibility floor a hard gate by accident — Kenny's decision of
// 2026-09-09 is that contrast is ADVICE, printed and never refused — and it
// did it invisibly: `gates/gates.test.mjs` imports `discoverThemesFromCss`
// from here, so the whole unit-test file died on a contrast message about a
// theme it does not test, with no test name attached.
if (import.meta.url === `file://${process.argv[1]}`) {
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
        console.error(`\n${failures} pair(s) short of the floor. This is advice: it is measured and printed, never refused [Kenny, 2026-09-09].`);
        process.exit(1);
    }
    console.log(
        `All ${THEMES.length} themes pass on ${PAIRS.length + LARGE_PAIRS.length + NON_TEXT_PAIRS.length} pairs ` +
            `(${PAIRS.length} at 4.5, ${LARGE_PAIRS.length + NON_TEXT_PAIRS.length} at 3.0, incl. ${STATUS_NAMES.length} status badges), ` +
            `${DISTANCE_PAIRS.length} pairs held apart in the shipped stylesheet; ` +
            `${Object.keys(EXEMPT).length} tokens are exempt with a stated reason.`,
    );
}
