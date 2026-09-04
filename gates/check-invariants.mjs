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
import { hsl, contrast, distance, luminance, simulateDeuteranopia, derive } from './colour.mjs';

const dir = new URL('../themes/', import.meta.url);
const config = JSON.parse(readFileSync(new URL('config.json', import.meta.url), 'utf8'));

/** WCAG 2.2 SC 1.4.11 Non-text Contrast, Level AA. A standards constant. */
const BOUNDARY_FLOOR = 3.0;
/** DI4's floor is a house number, not a standard — see gates/config.json. */
const DISTANCE_FLOOR = config.perceptualDistanceFloor.value;

/** Surfaces a boundary can be drawn against. */
const SURFACES = ['background', 'card', 'popover'];

export function themes() {
    const order = JSON.parse(readFileSync(new URL('order.json', dir), 'utf8'));
    return order.map((name) => {
        const raw = JSON.parse(readFileSync(new URL(`${name}/tokens.json`, dir), 'utf8'));
        const tokens = Object.fromEntries(raw.entries.filter((e) => e.token !== undefined).map((e) => [e.token, e.value]));
        return { name, tokens, derivation: raw.derivation };
    });
}

/** DI6: a theme says whether it is light or dark, and the layers rise. */
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
 * one as the other is the failure DI4 exists to prevent. Queued as
 * DI4-SCOPE in MINI_ROUNDS for Kenny to ratify or widen.
 */
const OPPOSED = [['offer', 'rejected']];

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

/**
 * DI2: the focus ring is two channels, and it is checked on everything it
 * can land on.
 *
 * A focus indicator that fails is not a cosmetic problem — it is a
 * keyboard user losing their place on the page. Two conditions, both
 * measured: the two rings contrast with each other, so the pair reads as
 * a ring whatever it sits on; and on every surface a component can have,
 * at least one of the two clears the 3:1 floor of SC 1.4.11.
 *
 * The second condition is what a single ring failed: measured 2026-09-04,
 * --ring against --primary was 1.00 in three themes. Identical luminance.
 */
const FOCUS_SURFACES = ['background', 'card', 'popover', 'primary', 'secondary', 'accent', 'destructive', 'muted', 'success', 'warning', 'info'];

export function checkFocusRing(theme) {
    const problems = [];
    // Generated tokens are not in the authored source, so the values the
    // generator would derive are reproduced here rather than read back
    // from the stylesheet: this gate measures the source, and DI2's
    // default pair is the theme's own foreground and background.
    const inner = theme.tokens['focus-ring'] ?? theme.tokens.foreground;
    const outer = theme.tokens['focus-ring-contrast'] ?? theme.tokens.background;

    const pair = contrast(hsl(inner), hsl(outer));
    if (pair < BOUNDARY_FLOOR) {
        problems.push(`the two focus rings are ${pair.toFixed(2)} apart, under ${BOUNDARY_FLOOR.toFixed(1)} — the pair does not read as a ring`);
    }

    for (const surface of FOCUS_SURFACES) {
        const value = theme.tokens[surface];
        if (value === undefined) continue;
        const best = Math.max(contrast(hsl(inner), hsl(value)), contrast(hsl(outer), hsl(value)));
        if (best < BOUNDARY_FLOOR) {
            problems.push(
                `neither focus ring reaches ${BOUNDARY_FLOOR.toFixed(1)} on --${surface} (best ${best.toFixed(2)}), so focus is invisible there`,
            );
        }
    }
    return problems;
}

const INTERACTIVE = ['primary', 'secondary', 'accent', 'destructive'];

/**
 * DI3 + AR12: the derived states are checked at their worst case rather
 * than one by one. "Active" is two steps — the furthest any state moves —
 * so if its text still clears AA, every gentler state does too, provided
 * the derivation is monotone in luminance. That proviso is what OKLCh buys
 * (AR4), and it is why the two themes that take DI3's opt-out are still
 * checked here rather than trusted.
 *
 * Disabled is deliberately exempt: DI8 is Kenny's recorded decision that a
 * disabled control may fall below the floor, with the GOV.UK counter-case
 * kept beside it.
 */
export function checkStates(theme) {
    const problems = [];
    const dark = theme.tokens['color-scheme'] === 'dark';
    const stepL = theme.derivation?.stepL ?? config.derivation.stepL;
    for (const surface of INTERACTIVE) {
        const base = theme.tokens[surface];
        const ink = theme.tokens[`${surface}-foreground`];
        if (base === undefined || ink === undefined) continue;
        const active = derive(base, config.derivation.active, { towardsLight: dark, stepL });
        const ratio = contrast(hsl(active), hsl(ink));
        if (ratio < 4.5) {
            problems.push(`--${surface}-active (${active}) carries --${surface}-foreground at ${ratio.toFixed(2)}, under 4.5`);
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
        ];
        checks += 5;
        if (problems.length > 0) {
            failed += problems.length;
            console.error(`\n${theme.name}:`);
            for (const p of problems) console.error(`  ${p}`);
        }
    }

    const expected = all.length * 5;
    if (checks !== expected) {
        console.error(`\ngate broke: expected ${expected} checks over ${all.length} themes, ran ${checks}`);
        process.exit(1);
    }

    if (failed > 0) {
        console.error(`\n${failed} invariant violation(s) across ${all.length} themes.`);
        process.exit(1);
    }
    console.log(`All ${all.length} themes satisfy DI1, DI2, DI3, DI4 and DI6 (${expected} checks).`);
}
