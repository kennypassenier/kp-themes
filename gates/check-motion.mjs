// Motion invariants [L3, DI5, DI7]. Reads the stylesheets, not the tokens.
//
// DI5 is the only invariant in this project whose violation causes physical
// injury, and until now nobody had computed its numbers.
//
// Usage: node gates/check-motion.mjs

import process from 'node:process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { TIMINGS } from '../js/effects.js';
import { CSS, GEOMETRY_ONLY, flashesPerSecond, keyframeProperties, parseOpacityKeyframes, reachableKeyframes } from './check-motion/keyframes.mjs';
import { animations, tableProblems, unguardedMotion, unsubscribedPreferenceReads } from './check-motion/guards.mjs';
import { durationBound } from './check-motion/flash.mjs';
import { MAX_FLASHES_PER_SECOND } from './check-motion/limits.mjs';
import { OUT_OF_SCOPE } from './check-motion/out-of-scope.mjs';
import { di5Report } from './check-motion/di5-report.mjs';

export { durationBound, flashVerdict } from './check-motion/flash.mjs';
export { GEOMETRY_ONLY, keyframeProperties, parseOpacityKeyframes, flashesPerSecond, reachableKeyframes } from './check-motion/keyframes.mjs';
export { animations, unguardedMotion, unsubscribedPreferenceReads, tableProblems } from './check-motion/guards.mjs';
export { di5Report } from './check-motion/di5-report.mjs';
export { SHORTEST_THEME_DURATION_MS } from './check-motion/limits.mjs';

if (import.meta.url === `file://${process.argv[1]}`) {
    let failed = 0;
    let checked = 0;
    // The flash threshold is a guideline, not a refusal (Kenny, 2026-10-08):
    // a rate over it is printed as a warning and the gate still passes. What
    // fails is a keyframe the gate cannot describe, a missing or drifted
    // TIMINGS row, and motion outside a reduced-motion guard.
    /** @type {string[]} */
    const warnings = [];
    /** @type {string[]} */
    const skipped = [];
    /** @type {Map<string, {stop: number, opacity: number}[]>} */
    const shared = new Map();
    for (const rel of CSS) for (const [k, v] of parseOpacityKeyframes(readFileSync(new URL(rel, import.meta.url), 'utf8'))) shared.set(k, v);
    /** @type {Map<string, Set<string>>} */
    const moved = new Map();
    for (const rel of CSS) for (const [k, v] of keyframeProperties(readFileSync(new URL(rel, import.meta.url), 'utf8'))) moved.set(k, v);

    for (const rel of CSS) {
        const path = new URL(rel, import.meta.url);
        const source = readFileSync(path, 'utf8');
        const name = rel.replace('../', '');
        const frames = reachableKeyframes(source, shared);

        for (const anim of animations(source)) {
            const stops = frames.get(anim.name);
            if (stops && anim.durationMs === null) {
                // It changes opacity and the gate cannot tell how fast.
                // The worst case is the shortest duration any theme
                // declares, so the flash rate is bounded by that.
                const shortest = durationBound(anim, source);
                checked++;
                const rate = flashesPerSecond(stops, shortest, anim.cycles);
                if (rate > MAX_FLASHES_PER_SECOND) {
                    warnings.push(
                        `${name}: ${anim.name} has a computed duration (${anim.duration}) and would make ${rate.toFixed(1)} ` +
                            `opposing luminance changes per second at the shortest duration any theme declares (${shortest}ms).`,
                    );
                }
                continue;
            }
            if (!stops) {
                const props = moved.get(anim.name);
                if (OUT_OF_SCOPE[anim.name] === undefined && props && props.size > 0 && [...props].every((p) => GEOMETRY_ONLY.has(p))) {
                    skipped.push(`${anim.name} — moves only (${[...props].join(', ')}); nothing that changes luminance`);
                    continue;
                }
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
            const rate = flashesPerSecond(stops, durationBound(anim, source), anim.cycles);
            if (rate > MAX_FLASHES_PER_SECOND) {
                warnings.push(
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
    for (const w of warnings) console.warn(`warning (guideline, not a refusal): ${w}`);
    if (failed > 0) {
        console.error(`\n${failed} motion violation(s).`);
        process.exit(1);
    }
    console.log(`Motion: ${checked} animation(s) read, ${warnings.length} over the flash guideline, none outside a reduced-motion guard.`);
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
