// Reduced-motion checks: unguarded animation, unsubscribed preference reads, and the TIMINGS table.

import { readdirSync } from 'node:fs';
import { moduleSource } from '../js-parts.mjs';
import { parseOpacityKeyframes } from './keyframes.mjs';

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
    // A `reduce` block is the preference honoured (its `transition: none`
    // is the guard itself), so it counts as guarded too.
    const guards = [...source.matchAll(/@media\s*\(prefers-reduced-motion:\s*(?:no-preference|reduce)\)\s*\{/g)].map((m) => m.index);
    /** @type {{line: number, declaration: string}[]} */
    const problems = [];
    // `transition: none` and `animation: none` are the ABSENCE of motion.
    // High-contrast's quirk [scope-12] is exactly that — a state change is a
    // switch, not a fade, because every frame between two legible states is
    // less legible than either. Wrapping that in a no-preference guard would
    // mean someone asking for less motion gets MORE of it.
    for (const m of source.matchAll(/^\s*(transition|animation):(?!\s*none\s*;)/gm)) {
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
        // Inside the progress bar the guard is css/components.css's own
        // `prefers-reduced-motion: reduce` block, which reaches every
        // register's motion in the bar with `!important` [scope-140]: a
        // register's bar rule is guarded from there, whichever file it is in.
        const open = source.lastIndexOf('{', m.index);
        const selectorStart = Math.max(source.lastIndexOf('}', open), source.lastIndexOf('{', open - 1), source.lastIndexOf('*/', open)) + 1;
        const inBar = /kp-progressbar/.test(source.slice(selectorStart, open));
        if (!guarded && !inBar) {
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
    // Every source in the directory, not only the React ones (until 2026-09-08 this filtered on `.jsx`, and `js/` holds none: the
    // scan read zero files and passed every time; the audit found it by running the function). A split module is read whole.
    for (const file of readdirSync(dir).filter((f) => /\.(js|jsx|mjs)$/.test(f))) {
        const source = moduleSource(dir, file);
        // A file may read the preference as long as it also subscribes to
        // it: that is the whole rule. `js/effects.js` reads it once and
        // adds a `change` listener, which is correct; a file that reads
        // and never listens shows the state the page had at load forever.
        const subscribes = /addEventListener\s*\(\s*['"`]change['"`]|addListener\s*\(|\.onchange\s*=/.test(source);
        if (subscribes) continue;
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
