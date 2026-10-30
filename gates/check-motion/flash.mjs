// DI5 flash arithmetic: the WCAG 2.3.1 limits, the shortest theme duration, and the per-effect verdicts.

import { MAX_FLASHES_PER_SECOND, SHORTEST_THEME_DURATION_MS } from './limits.mjs';
import { flashesPerSecond, parseOpacityKeyframes } from './keyframes.mjs';
import { animations } from './guards.mjs';

/**
 * The duration to rate an animation at: its literal, else, for a custom
 * property such as `var(--kp-sig-dur)`, the shortest value the same
 * stylesheet gives that property (a register sets it per element), else the
 * shortest a theme that moves declares. The compliance table rates with the
 * same function [step-6].
 * @param {{ name: string, durationMs: number | null, duration: string }} anim
 * @param {string} source
 * @returns {number}
 */
export function durationBound(anim, source) {
    if (anim.durationMs !== null) return anim.durationMs;
    const custom = /var\(\s*(--[\w-]+)/.exec(anim.duration);
    if (custom) {
        const declaration = new RegExp(`${custom[1]}:\\s*([\\d.]+)(ms|s)\\b`, 'g');
        const ms = (/** @type {RegExpMatchArray} */ m) => (m[2] === 's' ? Number(m[1]) * 1000 : Number(m[1]));
        // The property is set on the element the animation runs on, or on
        // the element whose pseudo-element runs it: read the rule block that
        // names the animation, else the blocks for the same element
        // (its selector without the pseudo-element).
        const selectorOf = (/** @type {number} */ open) => {
            const start = Math.max(source.lastIndexOf('}', open), source.lastIndexOf('{', open - 1), source.lastIndexOf('*/', open)) + 1;
            return source
                .slice(start, open)
                .replace(/::?(after|before)\b/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        };
        const found = [];
        const uses = new RegExp(`animation[^;]*\\b${anim.name}\\b`, 'g');
        for (const use of source.matchAll(uses)) {
            const open = source.lastIndexOf('{', use.index);
            const close = source.indexOf('}', use.index);
            const own = [...source.slice(open, close).matchAll(declaration)].map(ms);
            if (own.length) {
                found.push(Math.min(...own));
                continue;
            }
            const element = selectorOf(open);
            for (const brace of source.matchAll(/\{/g)) {
                const at = /** @type {number} */ (brace.index);
                if (selectorOf(at) !== element) continue;
                const end = source.indexOf('}', at);
                const there = [...source.slice(at, end).matchAll(declaration)].map(ms);
                if (there.length) found.push(Math.min(...there));
            }
        }
        if (found.length) return Math.min(...found);
        const declared = [...source.matchAll(declaration)].map(ms);
        if (declared.length) return Math.min(...declared);
    }
    return SHORTEST_THEME_DURATION_MS;
}

/**
 * Whether every opacity animation a stylesheet runs stays under the flash
 * threshold, rated the one way: the compliance table and the gate's test
 * read this, so the same sum cannot drift between them [step-6].
 * @param {string} source
 * @returns {boolean}
 */
export function flashVerdict(source) {
    const frames = parseOpacityKeyframes(source);
    for (const anim of animations(source)) {
        const stops = frames.get(anim.name);
        if (!stops) continue;
        if (flashesPerSecond(stops, durationBound(anim, source), anim.cycles) > MAX_FLASHES_PER_SECOND) return false;
    }
    return true;
}
