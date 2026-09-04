// The compliance table in docs/DESIGN_INVARIANTS.md, written by the gates
// that measure it [L3, AR8].
//
// The table said "measured by the gates, not by hand" while being kept by
// hand — true about where the numbers came from, false about how they got
// into the document, and one forgotten edit away from claiming a pass this
// project cannot show. Correction KT1's measure is that a checkable claim
// is checked; a table that regenerates cannot drift from what it claims.
//
// Rows an actual gate produces are computed below. Rows nothing measures
// yet are printed as `not gated` with the reason, never as `pass` — an
// unmeasured invariant is not a satisfied one.
//
// Usage: node gates/compliance.mjs [--check]

import { readFileSync, writeFileSync } from 'node:fs';
import { leakedColours } from './check-layers.mjs';
import { execFileSync } from 'node:child_process';
import process from 'node:process';
import {
    themes,
    checkBoundaries,
    checkColourScheme,
    checkColourVision,
    checkFocusRing,
    checkSecondHalves,
    checkStates,
    checkStateVisibility,
} from './check-invariants.mjs';
import { animations, flashesPerSecond, parseOpacityKeyframes, unguardedMotion, unsubscribedPreferenceReads } from './check-motion.mjs';

const DOC = new URL('../docs/DESIGN_INVARIANTS.md', import.meta.url);
const START = '<!-- compliance:start -->';
const END = '<!-- compliance:end -->';

/** Invariants asserted in prose because no gate reads them yet. */
/** @type {Record<string, string>} */
const NOT_GATED = {};

/** A theme is in DI5's scope when the register actually targets it. */
function motionScope() {
    const css = readFileSync(new URL('../css/cyberpunk-register.css', import.meta.url), 'utf8');
    return new Set([...css.matchAll(/\[data-theme='([^']+)'\]/g)].map((m) => m[1]));
}

/** DI5 and DI7 are properties of the stylesheets, so they are measured once. */
function motionVerdicts() {
    const flash = [];
    const guard = [];
    for (const rel of ['../css/cyberpunk-register.css', '../css/_rules.css']) {
        const source = readFileSync(new URL(rel, import.meta.url), 'utf8');
        const frames = parseOpacityKeyframes(source);
        for (const a of animations(source)) {
            const stops = frames.get(a.name);
            if (stops) flash.push(flashesPerSecond(stops, a.durationMs) <= 3);
        }
        guard.push(unguardedMotion(source).length === 0);
    }
    const fx = new URL('../fx/', import.meta.url).pathname.replace(/\/$/, '');
    guard.push(unsubscribedPreferenceReads(fx).length === 0);
    return { flash: flash.every(Boolean), guard: guard.every(Boolean) };
}

/** @typedef {import('./check-invariants.mjs').Theme} Theme */

/** DI9 is a property of the authored stylesheets, so it is measured once. */
function layersClean() {
    return ['../css/_rules.css', '../css/_header.css', '../css/components.css', '../css/cyberpunk-register.css', '../css/tailwind-bridge.css'].every(
        (rel) => leakedColours(readFileSync(new URL(rel, import.meta.url), 'utf8')).length === 0,
    );
}

export function table() {
    const all = themes();
    const scope = motionScope();
    const motion = motionVerdicts();
    /** @param {boolean} ok */
    const verdict = (ok) => (ok ? 'pass' : 'FAIL');

    /** @type {[string, (t: Theme) => string][]} */
    const rows = [
        ['DI1 boundaries at 3:1', (t) => verdict(checkBoundaries(t).length === 0)],
        ['DI2 two-channel focus ring', (t) => verdict(checkFocusRing(t).length === 0)],
        ['DI3 states carry their text', (t) => verdict(checkStates(t).length === 0)],
        ['DI3 states are visible as states [KT2]', (t) => verdict(checkStateVisibility(t).length === 0)],
        ['DI4 badge plates read against their surface [KT2]', (t) => verdict(checkSecondHalves(t).length === 0)],
        ['DI4 opposed status plates distinguishable', (t) => verdict(checkColourVision(t).length === 0)],
        ['DI5 flash threshold', (t) => (scope.has(t.name) ? verdict(motion.flash) : 'n/a')],
        ['DI6 declares colour-scheme and layers rise', (t) => verdict(checkColourScheme(t).length === 0)],
        ['DI7 reduced motion honoured', () => verdict(motion.guard)],
        ['DI9 theme colour stays in the token layer', () => verdict(layersClean())],
    ];

    const lines = [
        `| Invariant | ${all.map(/** @param {Theme} t */ (t) => t.name).join(' | ')} |`,
        `| --- | ${all.map(() => '---').join(' | ')} |`,
        ...rows.map(([label, f]) => `| ${label} | ${all.map(/** @param {Theme} t */ (t) => f(t)).join(' | ')} |`),
        ...Object.keys(NOT_GATED).map((id) => `| ${id} | ${all.map(() => 'not gated').join(' | ')} |`),
    ];

    // The two lines under the table used to be typed by hand and had gone
    // stale — "24 pairs" when the gate measured 39, "63 names" when it
    // declared 65 — sitting directly under a generated table, which lends
    // them an authority they had not earned. They are the gates' own
    // output now [Phase 7, G2].
    /** @param {string} script */
    const said = (script) => execFileSync(process.execPath, [new URL(script, import.meta.url).pathname], { encoding: 'utf8' }).trim();

    const notes = [
        `- ${said('check-contrast.mjs')}`,
        `- ${said('check-tokens.mjs')}`,
        ...Object.entries(NOT_GATED).map(([id, why]) => `- **${id} is not gated:** ${why}.`),
        '- **Gated in the browser, not here:** DI11 (reflow at 320 px, forced text spacing) and the other half of DI6 ' +
            '(whether the browser actually receives a `color-scheme`) are measured by `tests/fixtures.spec.mjs` against the ' +
            'bare per-theme fixtures. This table reads the token source, which cannot see either.',
    ];

    return [
        `Generated by \`node gates/compliance.mjs\`; \`npm run gates\` fails when this table and the code disagree.`,
        '',
        ...lines,
        '',
        ...notes,
    ].join('\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const doc = readFileSync(DOC, 'utf8');
    const a = doc.indexOf(START);
    const b = doc.indexOf(END);
    if (a === -1 || b === -1) {
        console.error(`gate broke: ${START} / ${END} markers missing from docs/DESIGN_INVARIANTS.md`);
        process.exit(1);
    }
    const next = `${doc.slice(0, a + START.length)}\n\n${table()}\n\n${doc.slice(b)}`;
    if (process.argv.includes('--check')) {
        if (next !== doc) {
            console.error('The compliance table no longer matches what the gates measure. Run: node gates/compliance.mjs');
            process.exit(1);
        }
        console.log('Compliance table matches the gates.');
    } else {
        writeFileSync(DOC, next);
        console.log('Compliance table written from the gates.');
    }
}
