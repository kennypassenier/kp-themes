// Reading @keyframes from stylesheets: moved properties, opacity stops, and the flash rate they imply.

import { stylesheets } from '../stylesheets.mjs';
import { LUMINANCE_STEP } from './limits.mjs';

// components.css joined this list the moment it grew an animation. A
// motion gate that reads two of three stylesheets reports green over the
// one it does not read.
export const CSS = stylesheets('motion').map((file) => `../${file}`);

/**
 * Properties that move or reshape what is drawn without changing its
 * colours: a keyframe that animates nothing else cannot change luminance,
 * so it cannot flash, and the gate says so itself instead of waiting for a
 * line in OUT_OF_SCOPE [scope-143, the port session, 2026-10-08]. Anything
 * outside this list (opacity without stops, filter, a shadow, a colour,
 * visibility, content, a custom property that may drive any of these)
 * still needs its line with the reason.
 */
export const GEOMETRY_ONLY = new Set([
    'transform',
    'translate',
    'rotate',
    'scale',
    'clip-path',
    'background-position',
    'background-position-x',
    'background-position-y',
    'mask-position',
    '-webkit-mask-position',
    'inset',
    'inset-block-start',
    'inset-block-end',
    'inset-inline-start',
    'inset-inline-end',
    'top',
    'right',
    'bottom',
    'left',
    'width',
    'height',
    'animation-timing-function',
]);

/**
 * Every keyframe's animated properties, by name.
 * @param {string} source
 * @returns {Map<string, Set<string>>}
 */
export function keyframeProperties(source) {
    const out = new Map();
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
        const found = new Set();
        for (const b of source.slice(from, i - 1).matchAll(/\{([^}]*)\}/g)) for (const d of b[1].matchAll(/(?:^|;)\s*([\w-]+)\s*:/g)) found.add(d[1]);
        out.set(m[1], found);
    }
    return out;
}

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
        // `from` and `to` are 0% and 100%: until the port session
        // (2026-10-08) they were not read, and every keyframe written with
        // them was reported as something the gate could not measure.
        for (const b of body.matchAll(/((?:[\d.]+%|from|to)(?:\s*,\s*(?:[\d.]+%|from|to))*)\s*\{([^}]*)\}/g)) {
            const o = b[2].match(/(?:^|;|\s)opacity:\s*([\d.]+)/);
            if (!o) continue;
            for (const p of b[1].split(',').map((x) => x.trim())) {
                stops.push({ stop: p === 'from' ? 0 : p === 'to' ? 100 : parseFloat(p), opacity: Number(o[1]) });
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
 * The opacity keyframes a stylesheet can reach: its own first, then every
 * other stylesheet's [scope-98]. A register may name a keyframe the package
 * declares — cyberpunk's alarm names kp-alarm-jitter, kp-alarm-caret and
 * kp-alarm-decode-noise from css/components.css — and the cascade resolves
 * that name across files. Until scope-98 this gate read keyframes only from
 * the file that used them, so such a register was reported as animating
 * "something this gate cannot measure" when the package's own stops were a
 * file away.
 *
 * @param {string} source the stylesheet that names the animation
 * @param {Map<string, {stop: number, opacity: number}[]>} shared every stylesheet's keyframes
 */
export function reachableKeyframes(source, shared) {
    return new Map([...shared, ...parseOpacityKeyframes(source)]);
}
