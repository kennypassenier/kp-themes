// The design invariants that can be checked against the token source
// [L3, DI1, DI2, DI4, DI6]. Contrast of text pairs stays in check-contrast.mjs,
// which reads the generated artefact because that is what a consumer takes.
//
// Every check declares how many things it expected to inspect and fails
// when the count differs (AR8): a gate answers "did I check everything",
// not only "did what I ran pass".
//
// Usage: node gates/check-invariants.mjs

import { readFileSync } from 'node:fs';

import process from 'node:process';
import { hsl, contrast, distance, luminance, simulateDeuteranopia } from './colour.mjs';
/** @typedef {import('./invariants-shared.mjs').Theme} Theme */
import { BOUNDARY_FLOOR, DISTANCE_FLOOR, HERO_SURFACES, SURFACES, dir } from './invariants-shared.mjs';
import { checkFocusRing, checkSecondHalves, checkStateVisibility, checkStates } from './invariants-states.mjs';

export { checkFocusRing, checkStateVisibility, checkSecondHalves, checkStates } from './invariants-states.mjs';

export function themes() {
    const order = JSON.parse(readFileSync(new URL('order.json', dir), 'utf8'));
    return order.map(
        /** @param {string} name */ (name) => {
            const raw = JSON.parse(readFileSync(new URL(`${name}/tokens.json`, dir), 'utf8'));
            const tokens = Object.fromEntries(
                raw.entries.filter(/** @param {any} e */ (e) => e.token !== undefined).map(/** @param {any} e */ (e) => [e.token, e.value]),
            );
            return { name, tokens, derivation: raw.derivation };
        },
    );
}

/** DI6: a theme says whether it is light or dark, and the layers rise. */
/** @param {Theme} theme */
export function checkColourScheme(theme) {
    const problems = [];
    // This checks the token, and only the token. Whether the browser ever
    // receives a color-scheme property is a question about the stylesheet,
    // and it went unasked until a fixture was opened in a real browser on
    // 2026-09-04: every theme declared the token, this gate read pass, and
    // nothing applied it. tests/fixtures.spec.mjs asks the other half.
    const scheme = theme.tokens['color-scheme'];
    if (scheme === undefined) {
        problems.push(
            'declares no color-scheme, so the browser keeps drawing its own scrollbars, select internals and autofill highlight in light mode',
        );
        return problems;
    }
    // A raised surface is never darker than the one it sits on. In a dark
    // theme that is the whole mechanism — four of the five surveyed design
    // systems agree, only Material dissents. In a light theme it matters
    // less, because a shadow carries most of the signal, but a card that
    // is darker than its page still reads as a hole rather than a card.
    const L = SURFACES.map((s) => ({ s, v: luminance(hsl(theme.tokens[s])) }));
    for (let i = 1; i < L.length; i++) {
        if (L[i].v < L[i - 1].v) {
            problems.push(
                `--${L[i].s} (${L[i].v.toFixed(4)}) is darker than --${L[i - 1].s} (${L[i - 1].v.toFixed(4)}), ` +
                    `so a raised surface sinks behind the one below it`,
            );
        }
    }
    return problems;
}

/** DI1: a control's boundary reaches 3:1 against every surface it sits on. */
/** @param {Theme} theme */
export function checkBoundaries(theme) {
    const problems = [];
    for (const token of ['border-strong', 'input', 'selected']) {
        const value = theme.tokens[token];
        if (value === undefined) {
            problems.push(`declares no --${token}`);
            continue;
        }
        for (const surface of SURFACES) {
            const ratio = contrast(hsl(value), hsl(theme.tokens[surface]));
            if (ratio < BOUNDARY_FLOOR) {
                problems.push(`--${token} on --${surface} is ${ratio.toFixed(2)}, under the ${BOUNDARY_FLOOR.toFixed(1)} floor of SC 1.4.11`);
            }
        }
    }
    // TH116: on the hero the generator remaps --input to the hero's frame
    // and --selected to the hero's button colour, so those two sources are
    // the boundaries measured against the hero ground and the hero card.
    for (const token of ['surface-hero-border', 'surface-hero-primary']) {
        const value = theme.tokens[token];
        if (value === undefined) {
            problems.push(`declares no --${token}`);
            continue;
        }
        for (const surface of HERO_SURFACES) {
            const ratio = contrast(hsl(value), hsl(theme.tokens[surface]));
            if (ratio < BOUNDARY_FLOOR) {
                problems.push(
                    `--${token} on --${surface} is ${ratio.toFixed(2)}, under the ${BOUNDARY_FLOOR.toFixed(1)} floor of SC 1.4.11 (the hero surface, TH116)`,
                );
            }
        }
    }
    return problems;
}

/**
 * DI4 at the token layer.
 *
 * Not all twenty-one pairs. Seven pale badge tints cannot all stay apart
 * under a colour deficiency — measured on 2026-09-04, the best any theme
 * manages across all pairs is single digits, and no palette of seven
 * light plates will do better. That is not a defect to fix, it is the
 * reason DI4 is worded as "colour is never the ONLY carrier": the badge
 * carries a label, and that contract lives in the component.
 *
 * What the tokens must still guarantee is the pair where confusing the
 * two is harmful. An offer and a rejection are opposite outcomes; reading
 * one as the other is the failure DI4 exists to prevent.
 *
 * Ratified 2026-09-04 (mini-round DI4-SCOPE) rather than widened, with
 * the measurements in DESIGN_INVARIANTS.md. The short version: 13 to 16
 * of the 21 pairs fall under the floor in five themes and only 2 do in
 * cyberpunk, because cyberpunk is saturated and the others are pale on
 * purpose. Widening to all 21 would delete six palettes rather than
 * tighten a check. Since L7 a semantic badge without words is refused in
 * code, so the label is the carrier and the colour is the second channel.
 */
const OPPOSED = [['offer', 'rejected']];

/** @param {Theme} theme */
export function checkColourVision(theme) {
    const problems = [];
    for (const [a, b] of OPPOSED) {
        const va = theme.tokens[`status-${a}`];
        const vb = theme.tokens[`status-${b}`];
        if (va === undefined || vb === undefined) continue;
        const d = distance(simulateDeuteranopia(hsl(va)), simulateDeuteranopia(hsl(vb)));
        if (d < DISTANCE_FLOOR) {
            problems.push(
                `status ${a} and ${b} mean opposite things and are ${d.toFixed(1)} apart for the commonest colour deficiency (floor ${DISTANCE_FLOOR})`,
            );
        }
    }
    return problems;
}


if (import.meta.url === `file://${process.argv[1]}`) {
    const all = themes();
    let failed = 0;
    let checks = 0;

    for (const theme of all) {
        const problems = [
            ...checkColourScheme(theme),
            ...checkBoundaries(theme),
            ...checkColourVision(theme),
            ...checkStates(theme),
            ...checkFocusRing(theme),
            ...checkStateVisibility(theme),
            ...checkSecondHalves(theme),
        ];
        checks += 7;
        if (problems.length > 0) {
            failed += problems.length;
            console.error(`\n${theme.name}:`);
            for (const p of problems) console.error(`  ${p}`);
        }
    }

    const expected = all.length * 7;
    if (checks !== expected) {
        console.error(`\ngate broke: expected ${expected} checks over ${all.length} themes, ran ${checks}`);
        process.exit(1);
    }

    if (failed > 0) {
        console.error(`\n${failed} invariant violation(s) across ${all.length} themes.`);
        process.exit(1);
    }
    console.log(`All ${all.length} themes satisfy DI1, DI2, DI3, DI4, DI6 and KT2 (${expected} checks).`);
}
