// Motion invariants [L3, DI5, DI7]. Reads the stylesheets, not the tokens.
//
// DI5 is the only invariant in this project whose violation causes physical
// injury, and until now nobody had computed its numbers.
//
// Usage: node gates/check-motion.mjs

import { readdirSync, readFileSync } from 'node:fs';
import process from 'node:process';

/**
 * WCAG 2.2 SC 2.3.1 Three Flashes or Below Threshold, Level A. Standards
 * constants, pinned with their reason: no more than three opposing
 * relative-luminance changes of 10% or more per second. (The area escape —
 * a flash smaller than roughly 341 x 256 CSS px is exempt — is deliberately
 * not used here. These effects cover the page.)
 */
const MAX_FLASHES_PER_SECOND = 3;
const LUMINANCE_STEP = 0.1;

const CSS = ['../css/cyberpunk-register.css', '../css/_rules.css'];

/**
 * Animations the flash threshold does not reach, each with the reason.
 * AR8: a gate says what it did not check, or it is not a gate. An
 * animation missing from both this list and the opacity analysis fails.
 */
const OUT_OF_SCOPE = {
    'fx-glitch-a':
        'transform and clip-path on a text pseudo-element — no luminance change, and far under the 341x256 px area the threshold applies to',
    'fx-glitch-b': 'as fx-glitch-a',
    'fx-rgb-split': 'drop-shadow offsets on a single text element; the colours do not change, only their position',
    'fx-cellflash': 'text colour and shadow on one cell, one iteration of 200ms',
};

/** @param {string} source @returns {Map<string, {stop: number, opacity: number}[]>} */
export function parseOpacityKeyframes(source) {
    const out = new Map();
    for (const m of source.matchAll(/@keyframes\s+([\w-]+)\s*\{([\s\S]*?)\n\}/g)) {
        const stops = [];
        // A block is `0%, 100% { ... }` — several selectors, one body.
        for (const b of m[2].matchAll(/([\d.%,\s]+)\{([^}]*)\}/g)) {
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
export function flashesPerSecond(stops, durationMs) {
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
    return opposing / (durationMs / 1000);
}

/** Every `animation:` shorthand, with the keyframe name and its duration. */
export function animations(source) {
    return [...source.matchAll(/animation:\s*([\w-]+)\s+([\d.]+)(m?s)/g)].map((m) => ({
        name: m[1],
        durationMs: m[3] === 's' ? Number(m[2]) * 1000 : Number(m[2]),
    }));
}

/** DI7: no transition or animation outside a reduced-motion guard. */
export function unguardedMotion(source) {
    const guards = [...source.matchAll(/@media\s*\(prefers-reduced-motion:\s*no-preference\)\s*\{/g)].map((m) => m.index);
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
            const rate = flashesPerSecond(stops, anim.durationMs);
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

    const fxDir = new URL('../fx/', import.meta.url).pathname.replace(/\/$/, '');
    for (const p of unsubscribedPreferenceReads(fxDir)) {
        checked++;
        failed++;
        console.error(
            `fx/${p.file}:${p.line}: reads prefers-reduced-motion directly. Use useReducedMotion() from fx/use-reduced-motion.js, ` +
                'which keeps listening after mount (DI7).',
        );
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
}
