// Motion invariants [L3, DI5, DI7]. Reads the stylesheets, not the tokens.
//
// DI5 is the only invariant in this project whose violation causes physical
// injury, and until now nobody had computed its numbers.
//
// Usage: node gates/check-motion.mjs

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import process from 'node:process';
import { TIMINGS } from '../js/effects.js';
import { stylesheets } from './stylesheets.mjs';

/**
 * WCAG 2.2 SC 2.3.1 Three Flashes or Below Threshold, Level A. Standards
 * constants, pinned with their reason: no more than three opposing
 * relative-luminance changes of 10% or more per second. (The area escape —
 * a flash smaller than roughly 341 x 256 CSS px is exempt — is deliberately
 * not used here. These effects cover the page.)
 */
const MAX_FLASHES_PER_SECOND = 3;
const LUMINANCE_STEP = 0.1;

/**
 * The shortest --fx-duration any theme declares. An animation whose
 * duration is a calc() over that token is bounded by this, so the gate
 * measures the worst case rather than giving up.
 */
export const SHORTEST_THEME_DURATION_MS = Math.min(
    ...[...readFileSync(new URL('../css/themes.css', import.meta.url), 'utf8').matchAll(/--fx-duration:\s*([\d.]+)ms/g)].map((m) => Number(m[1])),
);

// components.css joined this list the moment it grew an animation. A
// motion gate that reads two of three stylesheets reports green over the
// one it does not read.
const CSS = stylesheets('motion').map((file) => `../${file}`);

/**
 * Animations the flash threshold does not reach, each with the reason.
 * AR8: a gate says what it did not check, or it is not a gate. An
 * animation missing from both this list and the opacity analysis fails.
 */
/** @type {Record<string, string>} */
const OUT_OF_SCOPE = {
    // The phantom register [PH1]: the loader's bar and its shove out, both
    // transforms; the retro register [RT1]: the selection bar and the
    // redaction brush, both clip-paths; the terminal register [TM1]: the
    // sweep band; the brutalism register [BR1]: the slam and the marquee.
    'kp-bar-run': 'a horizontal scale on a 3px bar, once; no luminance change and nothing over 341x256 px',
    'kp-load-out': 'the arrival overlay skewing and translating off the viewport once; the overlay keeps its colours, only its position moves',
    'kp-drag-select': 'a clip-path widening over a phrase once (the selection bar); under 341x256 px',
    'kp-redact-lift': 'a clip-path narrowing over a phrase once (the redaction brush); under 341x256 px',
    'kp-sweep': 'a band translating down the viewport once per ten seconds, resting eight of them; a transform, and the band is a 9% tint',
    'kp-caret': 'a background layer of one character cell appearing and disappearing once a second; rated in TIMINGS at 1/s and under 341x256 px',
    'kp-slam': 'a word translating onto its text-shadow once; a transform on a word, under 341x256 px',
    'kp-marquee': 'a strip translating -50% over 42 seconds; the strip keeps its colours, only its position moves',
    // The synthwave register [SW1].
    'kp-shine':
        'a highlight band sliding across clipped text once (background-position); the text keeps its colours and the band is under 341x256 px',
    'kp-tube-on': 'a colour and text-shadow switch on an inline phrase, one dip, once; rated in TIMINGS at 2.7/s and under 341x256 px',
    'kp-floor-drift': 'a background-position slide of a grid over 6 seconds; the pattern keeps its colours, only its position moves',

    'kp-spin': 'a rotation: no luminance change at all',
    'kp-rule-in': 'a horizontal scale on a 1px rule; no luminance change and nothing over 341x256 px',
    'kp-settle': 'a scale from 0.92 to 1 on a badge, once',
    'kp-slide-in': 'a 6px translate on a badge, once; nothing changes luminance [TH70]',
    'kp-drift': 'a background-position slide over 40 seconds; the texture keeps its colours, only their position moves',
    'kp-ember': 'a box-shadow that grows and fades once over the card edge; the card itself does not change luminance',
    'kp-charge':
        'a skewed light band translating across a button once on hover, blended over the face; the face itself does not change luminance and the band is under 341x256 px [TH118]',
    // The dark register [S48, LIFT_PLAN row 15]: the mark's ignite and the
    // rule's sweep are both bound to `animation-timeline: view()` — the
    // reader's own scroll position, not a clock — so neither can free-run
    // or loop; each is one monotonic change across its range.
    'kp-ignite':
        'a mark’s ink and underline colour resolving once as the reader scrolls past it; a colour property this gate cannot parse from opacity stops, and it cannot oscillate because it is scroll-bound, not timed',
    'kp-sweep-in':
        'a rule sweeping in under a heading once as it enters the viewport (background-position); the rule keeps its colours, only its position moves, and it is scroll-bound so it cannot loop',
    // The high-contrast register [S48, LIFT_PLAN row 14]: the headline's
    // ellipse wipe (a clip-path reveal, once, on load) and the rule's
    // horizontal scale (a transform on a 3px bar, once, under 341x256 px).
    'kp-hc-headline-wipe': 'a clip-path ellipse wipe across the hero headline, once, on load; no opacity change anywhere',
    'kp-hc-rule-wipe': 'a horizontal scale on a 3px rule under a heading, once, on load; no luminance change and under 341x256 px',
    // The solstice register [S48, LIFT_PLAN row 18].
    'kp-cal-slide':
        'a clip-path sweep, once, over the headline overlay (mix-blend-mode: difference); strictly monotonic in one direction, so it has zero opposing luminance changes, which is the threshold DI5 measures',
    'kp-cal-rule': 'a horizontal scale on a 3px rule; no luminance change and nothing over 341x256 px',
    'kp-cal-redact': 'a clip-path narrowing over one marked phrase in a dossier paragraph, once; under 341x256 px',
    // The mono register [S48, LIFT_PLAN row 11]: a hard-edge mask sweeping
    // once across a headline or a redaction bar (mask-position).
    'kp-wipe':
        'a hard-edge mask sweeping once across a headline (the whole line, unsplit) or a redaction bar (mark::after); the content under the mask keeps its own colours, only the reveal edge moves',
    // The tazhib register [S48, LIFT_PLAN row 6].
    'kp-burnish':
        'a clip-path wipe over the headline once (the burnish); the text is gold from the first frame of the wipe and stays gold, only the reveal boundary moves',
    // The blueprint register [S48, LIFT_PLAN row 6]: the two dimension
    // lines extending like a tape measure, one transform each.
    'kp-dim-draw': 'a horizontal scale on a hairline under the headline, once; no luminance change and nothing over 341x256 px',
    'kp-elev-draw': 'a vertical scale on a hairline beside the headline, once; no luminance change and nothing over 341x256 px',
    // The grotesk register [S48, LIFT_PLAN row 12]: the headline's optical
    // resolve, on the whole, unsplit line (`kp-sharpen-in` — not
    // `kp-focus-in`/`focus`, which the dark and shade-dark registers
    // already own for their own, different mechanics).
    'kp-sharpen-in':
        "a blur+brightness filter resolving a headline from dim to full once, monotone, over 640ms — one change, well under the three DI5 allows, matching the demo's own worked example of a single fade [S49]",
    // The light register [S48, LIFT_PLAN, A1]: the lede mark's
    // background-size sweep, one colour swap on an inline phrase, once —
    // matches the shape of the retro selection bar's kp-drag-select below;
    // under 341x256 px.
    'kp-mark-sweep': 'a background-size sweep with one colour swap on an inline phrase, once; under 341x256 px',
    // The topo register [TP1]: the contour trace beside the headline.
    'kp-trace': 'a stroke-dashoffset draw on a 9rem SVG path once; no luminance change and well under 341x256 px',
    // The shade-light register [SL2]: the lede mark's ink-fill is a
    // background-size change, not a luminance one — the fill colour and
    // its alpha are constant throughout, only the covered area grows.
    'kp-mark-in': 'a background-size widening over a mark once, 0% to 100%; the fill colour and alpha never change, only the area',
    // The pastel register [S48, LIFT_PLAN row 6].
    'kp-fill': "a mark's background-size growing from 0% to 100% once; the ink colour itself never changes, only how much of the word it covers",
    'kp-draw': "a rule's width growing from 0% to 100% once; no luminance change and the rule is a few px tall",
};

/** @param {string} source @returns {Map<string, {stop: number, opacity: number}[]>} */
export function parseOpacityKeyframes(source) {
    const out = new Map();
    // Brace counting rather than a lazy regex: since AR17 the authored
    // stylesheets sit inside an @layer block, so every keyframes body is
    // indented and its steps close with braces of their own. A lazy match
    // stopped at the first step and reported the whole file unreadable.
    const head = /@keyframes\s+([\w-]+)\s*\{/g;
    for (let m = head.exec(source); m !== null; m = head.exec(source)) {
        let depth = 1;
        let i = m.index + m[0].length;
        const from = i;
        while (i < source.length && depth > 0) {
            if (source[i] === '{') depth += 1;
            else if (source[i] === '}') depth -= 1;
            i += 1;
        }
        const body = source.slice(from, i - 1);
        const stops = [];
        // A block is `0%, 100% { ... }` — several selectors, one body.
        for (const b of body.matchAll(/([\d.%,\s]+)\{([^}]*)\}/g)) {
            const o = b[2].match(/opacity:\s*([\d.]+)/);
            if (!o) continue;
            for (const p of b[1].match(/[\d.]+(?=%)/g) ?? []) {
                stops.push({ stop: Number(p), opacity: Number(o[1]) });
            }
        }
        if (stops.length > 0)
            out.set(
                m[1],
                stops.sort((a, b) => a.stop - b.stop),
            );
    }
    return out;
}

/**
 * The worst case an opacity animation can produce: the element is assumed to
 * be fully bright over a fully dark ground, so a swing from opacity a to b
 * is a relative-luminance change of |a - b|. Real elements are dimmer than
 * that, so a run that passes here passes in fact — the bound is deliberately
 * pessimistic, because the alternative is rendering every frame.
 *
 * @param {{stop: number, opacity: number}[]} stops
 * @param {number} durationMs
 * @returns {number} opposing changes of >= 10% per second
 */
export function flashesPerSecond(stops, durationMs, cycles = Infinity) {
    if (stops.length < 2) return 0;
    let opposing = 0;
    let lastDirection = 0;
    for (let i = 1; i < stops.length; i++) {
        const delta = stops[i].opacity - stops[i - 1].opacity;
        if (Math.abs(delta) < LUMINANCE_STEP) continue;
        const direction = Math.sign(delta);
        if (direction !== lastDirection) {
            opposing++;
            lastDirection = direction;
        }
    }
    // A run that plays once occupies at most one second of the reader's
    // attention: its changes are counted over the second they happen in,
    // never extrapolated as if it looped. The 4.x register set its hover
    // glitch to 340ms to dodge that extrapolation (one change in 320ms
    // read as 3.1 per second); the approved demo's 320ms is honest at
    // 1 per second, and a burst of four changes in 320ms still reads 4.
    // A looping run is extrapolated as before, because it does loop.
    const windowMs = cycles === Infinity ? durationMs : Math.max(durationMs * cycles, 1000);
    return opposing / (windowMs / 1000);
}

/**
 * Every `animation:` shorthand, with the keyframe name and its duration.
 *
 * The duration may be a calc() — `calc(var(--fx-duration) * 3)` — and the
 * first version of this matched a literal number only, so three
 * animations with computed durations were not skipped with a reason:
 * they were not seen at all. An unreadable duration now comes back as
 * null, and the runner measures the worst case rather than ignoring it.
 *
 * @param {string} source
 * @returns {{name: string, durationMs: number | null, duration: string, cycles: number}[]}
 */
/** @param {string} source */
export function animations(source) {
    return [...source.matchAll(/animation:\s*([\w-]+)\s+([^;]+);/g)].map((m) => {
        const literal = m[2].match(/^\s*([\d.]+)(m?s)/);
        // The iteration count: `infinite`, a bare number outside any
        // parentheses (`steps(2, end)` carries one that is not a count), or
        // the CSS default of one. A one-shot run is rated over the second
        // it occupies; a loop is extrapolated.
        const rest = m[2].replace(/\([^)]*\)/g, '');
        const count = rest.match(/(?:^|\s)(\d+(?:\.\d+)?)(?=\s|$)/);
        const cycles = /\binfinite\b/.test(rest) ? Infinity : count ? Number(count[1]) : 1;
        return {
            cycles,
            name: m[1],
            durationMs: literal ? (literal[2] === 's' ? Number(literal[1]) * 1000 : Number(literal[1])) : null,
            duration: m[2].trim(),
        };
    });
}

/** DI7: no transition or animation outside a reduced-motion guard. */
/** @param {string} source @returns {{line: number, declaration: string}[]} */
export function unguardedMotion(source) {
    const guards = [...source.matchAll(/@media\s*\(prefers-reduced-motion:\s*no-preference\)\s*\{/g)].map((m) => m.index);
    /** @type {{line: number, declaration: string}[]} */
    const problems = [];
    for (const m of source.matchAll(/^\s*(transition|animation):/gm)) {
        // A declaration is guarded when it sits after a guard's opening brace
        // and before that block closes. Brace-count from each guard rather
        // than assume, since the register nests theme selectors inside.
        const guarded = guards.some((start) => {
            let depth = 0;
            for (let i = source.indexOf('{', start); i < source.length; i++) {
                if (source[i] === '{') depth++;
                else if (source[i] === '}') depth--;
                if (depth === 0) return m.index > start && m.index < i;
            }
            return false;
        });
        if (!guarded) {
            const line = source.slice(0, m.index).split('\n').length;
            problems.push({ line, declaration: m[1] });
        }
    }
    return problems;
}

/**
 * DI7's other half. A component that reads the preference once at mount
 * keeps animating for someone who turns the setting on mid-session — the
 * defect all four effect components shipped with, invisible to any test
 * that mounts after setting the preference. The fix is a shared subscribing
 * hook; this keeps a direct read from creeping back in beside it.
 *
 * @param {string} dir
 * @returns {{file: string, line: number}[]}
 */
export function unsubscribedPreferenceReads(dir) {
    const problems = [];
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.jsx'))) {
        const source = readFileSync(new URL(file, `file://${dir}/`), 'utf8');
        // The call, not the word: every one of these files mentions the
        // preference in its own doc comment, and prose is not a defect.
        for (const m of source.matchAll(/matchMedia\s*\(\s*['"`][^'"`]*prefers-reduced-motion/g)) {
            problems.push({ file, line: source.slice(0, m.index).split('\n').length });
        }
    }
    return problems;
}

/**
 * The table pass [TH129, AR40]: every keyframe a stylesheet declares has
 * a row in TIMINGS, and where the row says "opacity" its steps are the
 * keyframe's own stops, so the table the report is computed from cannot
 * drift from the CSS it describes. Per S42 nothing is corrected here: a
 * row over the threshold is a line in the report for Kenny, and what
 * fails is a missing or mismatched row, because a table with a hole is
 * not a report.
 *
 * @param {string} source a stylesheet
 * @param {Readonly<Record<string, Readonly<{ property: string, luminanceSteps: readonly number[] }>>>} timings
 * @returns {string[]} problems
 */
export function tableProblems(source, timings) {
    /** @type {string[]} */
    const problems = [];
    const frames = parseOpacityKeyframes(source);
    for (const m of source.matchAll(/@keyframes\s+([\w-]+)\s*\{/g)) {
        const row = timings[m[1]];
        if (!row) {
            problems.push(`@keyframes ${m[1]} has no row in TIMINGS (js/effects.js) — the DI5 report cannot describe it.`);
            continue;
        }
        if (row.property !== 'opacity') continue;
        const expected = JSON.stringify(frames.get(m[1])?.map((s) => s.opacity) ?? []);
        const declared = JSON.stringify(row.luminanceSteps);
        if (expected !== declared)
            problems.push(`@keyframes ${m[1]} steps opacity ${expected} but TIMINGS says ${declared} — the table drifted from the keyframe.`);
    }
    return problems;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    let failed = 0;
    let checked = 0;
    /** @type {string[]} */
    const skipped = [];

    for (const rel of CSS) {
        const path = new URL(rel, import.meta.url);
        const source = readFileSync(path, 'utf8');
        const name = rel.replace('../', '');
        const frames = parseOpacityKeyframes(source);

        for (const anim of animations(source)) {
            const stops = frames.get(anim.name);
            if (stops && anim.durationMs === null) {
                // It changes opacity and the gate cannot tell how fast.
                // The worst case is the shortest duration any theme
                // declares, so the flash rate is bounded by that.
                const shortest = SHORTEST_THEME_DURATION_MS;
                checked++;
                const rate = flashesPerSecond(stops, shortest);
                if (rate > MAX_FLASHES_PER_SECOND) {
                    failed++;
                    console.error(
                        `${name}: ${anim.name} has a computed duration (${anim.duration}) and would make ${rate.toFixed(1)} ` +
                            `opposing luminance changes per second at the shortest duration any theme declares (${shortest}ms).`,
                    );
                }
                continue;
            }
            if (!stops) {
                if (OUT_OF_SCOPE[anim.name] === undefined) {
                    failed++;
                    console.error(
                        `${name}: ${anim.name} animates something this gate cannot measure and is not listed as out of scope. ` +
                            'Add it to OUT_OF_SCOPE with the reason, or teach the gate to read it.',
                    );
                } else {
                    skipped.push(`${anim.name} — ${OUT_OF_SCOPE[anim.name]}`);
                }
                continue;
            }
            checked++;
            // Reached only when the duration is a literal: the computed
            // case is handled above and returns before here.
            const rate = flashesPerSecond(stops, anim.durationMs ?? SHORTEST_THEME_DURATION_MS, anim.cycles);
            if (rate > MAX_FLASHES_PER_SECOND) {
                failed++;
                console.error(
                    `${name}: ${anim.name} makes ${rate.toFixed(1)} opposing luminance changes per second ` +
                        `over ${anim.durationMs}ms — SC 2.3.1 allows ${MAX_FLASHES_PER_SECOND}.`,
                );
            }
        }

        for (const p of unguardedMotion(source)) {
            checked++;
            failed++;
            console.error(`${name}:${p.line}: ${p.declaration} sits outside a prefers-reduced-motion guard (DI7).`);
        }
    }

    // The table pass [TH129, AR40], per stylesheet.
    for (const rel of CSS) {
        const name = rel.replace('../', '');
        for (const problem of tableProblems(readFileSync(new URL(rel, import.meta.url), 'utf8'), TIMINGS)) {
            checked++;
            failed++;
            console.error(`${name}: ${problem}`);
        }
    }
    /** @type {string[]} */
    const report = [];
    for (const [effect, row] of Object.entries(TIMINGS)) {
        const stops = row.luminanceSteps.map((opacity, i) => ({ stop: i, opacity }));
        const rate = row.property === 'opacity' ? flashesPerSecond(stops, row.durationMs, row.cycles) : 0;
        const loop = row.cycles === Infinity ? 'loops' : `${row.cycles}×`;
        report.push(
            `  ${effect}: ${row.property}, ${row.durationMs}ms ${loop} → ${rate.toFixed(2)}/s${rate > MAX_FLASHES_PER_SECOND ? '  OVER THE THRESHOLD (reported, S42)' : ''}`,
        );
    }

    // The scan covers fx/ and, since C3, js/ [AR40]: js/effects.js reads
    // the preference and subscribes to its change, which is what the scan
    // asks for; a module that read it once and stopped listening would be
    // named here.
    for (const dir of ['fx', 'js']) {
        const path = new URL(`../${dir}/`, import.meta.url).pathname.replace(/\/$/, '');
        for (const p of unsubscribedPreferenceReads(path)) {
            checked++;
            failed++;
            console.error(
                `${dir}/${p.file}:${p.line}: reads prefers-reduced-motion directly without listening for a change. ` +
                    'Use useReducedMotion() (React) or subscribe to the media query (DI7).',
            );
        }
    }

    if (checked === 0) {
        console.error('gate broke: found nothing to check, which cannot be right while the register ships animations.');
        process.exit(1);
    }
    if (failed > 0) {
        console.error(`\n${failed} motion violation(s).`);
        process.exit(1);
    }
    console.log(`Motion: ${checked} animation(s) under the flash threshold, none outside a reduced-motion guard.`);
    for (const s of skipped) console.log(`  out of scope: ${s}`);
    console.log(`DI5 report, ${report.length} effect(s) from TIMINGS [TH129]:`);
    for (const line of report) console.log(line);

    // The written report [TH129, T20]: reports/di5.md names every effect
    // with its rate, committed, so a reader sees the number without
    // running the gate. `--report` writes it; `--report --check` refuses a
    // stale one. Per S42 the gate corrects nothing: an effect over the
    // threshold shows red in the report and the run still passes here —
    // the flash pass above is the invariant, this is the ledger.
    if (process.argv.includes('--report')) {
        const target = new URL('../reports/di5.md', import.meta.url);
        const content = di5Report(TIMINGS);
        if (process.argv.includes('--check')) {
            let current = '';
            try {
                current = readFileSync(target, 'utf8');
            } catch {
                current = '';
            }
            if (current !== content) {
                console.error('reports/di5.md does not match TIMINGS. Run `npm run report:di5` and commit the result.');
                process.exit(1);
            }
            console.log(`DI5 report: reports/di5.md matches TIMINGS (${Object.keys(TIMINGS).length} effects).`);
        } else {
            mkdirSync(new URL('../reports/', import.meta.url), { recursive: true });
            writeFileSync(target, content);
            console.log(`wrote reports/di5.md (${Object.keys(TIMINGS).length} effects).`);
        }
    }
}

/**
 * The DI5 ledger as markdown: one row per effect, its rate, and a verdict
 * that says OVER when it is — reported, never corrected (S42).
 *
 * @param {Record<string, { durationMs: number, cycles: number, property: string, luminanceSteps: number[] }>} timings
 * @returns {string}
 */
export function di5Report(timings) {
    const lines = [
        '# DI5 — the flash rate of every effect [TH129, T20]',
        '',
        'Generated by `node gates/check-motion.mjs --report` from `TIMINGS` in',
        '`js/effects.js`; `npm run gates` refuses a stale copy. The rate is the',
        'number of opposing luminance changes of 10% or more per second: a loop',
        'is extrapolated, a run that plays once is rated over the second it',
        'occupies. SC 2.3.1 allows three. Per S42 a rate over the threshold is',
        'reported here in capitals and corrected by nobody but Kenny.',
        '',
        '| Effect | Property | Duration | Plays | Opacity steps | Rate | Verdict |',
        '| --- | --- | --- | --- | --- | --- | --- |',
    ];
    for (const [effect, row] of Object.entries(timings)) {
        const stops = row.luminanceSteps.map((opacity, i) => ({ stop: i, opacity }));
        const rate = row.property === 'opacity' ? flashesPerSecond(stops, row.durationMs, row.cycles) : 0;
        const plays = row.cycles === Infinity ? 'loops' : `${row.cycles}×`;
        const steps = row.luminanceSteps.length > 0 ? row.luminanceSteps.join(' → ') : '—';
        const verdict = rate > MAX_FLASHES_PER_SECOND ? '**OVER THE THRESHOLD (S42: reported)**' : 'under';
        lines.push(`| \`${effect}\` | ${row.property} | ${row.durationMs} ms | ${plays} | ${steps} | ${rate.toFixed(2)}/s | ${verdict} |`);
    }
    return lines.join('\n') + '\n';
}
