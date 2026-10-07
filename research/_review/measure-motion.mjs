// Measure what the motion scenes of a character demo really do, frame by
// frame, in Firefox (Kenny, 2026-10-07 15:16: a dialog that "measured"
// 520 ms read as near-instant next to 900 ms stems, because its keyframes
// put nearly all of the change in the first frames; "misschien moeten de
// andere metingen dan ook anders aangepakt worden zodat elementen wel gelijk
// aankomen en weggaan").
//
// The demos' one clock writes `data-<p>-phase` (gap, in, hold, out) on every
// `.<p>-scene[data-<p>-kind="cycle"]`, and their CSS keys every motion to
// it. This script stops that clock (the review dialog's pause element),
// drives each scene through gap → in and hold → out itself, pauses every
// animation and transition that starts, and seeks them together frame by
// frame. Per animated part (an element, or its ::before/::after) it reads
// the computed opacity, transform, translate, scale, rotate, clip-path,
// filter, size and the other animated properties, turns them into numbers
// (a clip-path's percentages resolved against the part's box), and reports:
//
// - t50, t90: when the part is 50 % and 90 % of the way from its first to
//   its last pose (closeness to the end pose, per changing component, so a
//   multi-step path counts how near the part is to where it lands);
// - run: from the first visible change to the last;
// - front: t90 as a share of the run (≤ 0.3 reads as instant);
// - for each part that arrives and leaves: whether the leave's frames are
//   the arrival's frames in reverse order, within a tolerance of one frame
//   in time and 8 % of each component's range in value;
// - for a part that turns (a translate or a drop-shadow offset going round
//   the part, or a rotation): how far it turned in each phase, in degrees,
//   positive clockwise (screen y points down). A leave that is not the
//   arrival's mirror but turns the same way is a rule broken on purpose
//   (grotesk, update 2: "I only like it going clockwise"): it is reported as
//   `clockwise both ways`, not as a mirror fault.
//
// Usage (a static server on the repository root must be running):
//   node research/_review/measure-motion.mjs research/nostromo-character \
//     [--base http://127.0.0.1:8743] [--aspect curve] [--width 1600] [--json out.json] [--parts]
//
// No gate runs it; it is a tool for whoever builds or audits a demo.

import { writeFileSync } from 'node:fs';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { firefox } from 'playwright';

export const STEP = 10; // ms between samples
const FRAME = 17; // one frame at 60 Hz, the time tolerance of the reverse check
const VALUE_TOLERANCE = 0.08;

/** Every property read per sample, besides the ones an animation names. */
export const ALWAYS = ['opacity', 'visibility', 'transform', 'translate', 'scale', 'rotate', 'clip-path', 'filter', 'width', 'height'];
/** The properties that move a part (the rest, colour, glow, filter, only dress it). */
const GEOMETRY = new Set([
    'opacity',
    'transform',
    'translate',
    'scale',
    'rotate',
    'clip-path',
    'mask-position',
    'mask-size',
    'width',
    'height',
    'inset-inline-start',
    'inset-inline-end',
    'inset-block-start',
    'left',
    'right',
    'top',
    'bottom',
    'stroke-dashoffset',
    'background-position',
    'background-size',
    'grid-template-rows',
    'grid-template-columns',
    'max-height',
    'max-width',
]);

/* ------------------------------------------------------------- in the page */

/**
 * Runs in the page: drives one scene from `from` to `to` and samples every
 * part that starts moving. Returns raw strings; Node turns them into numbers.
 * @param {{ sceneIndex: number, prefix: string, from: string, to: string, always: string[], step: number, also?: { key: string, props: string[] }[], awayBefore?: number[] }} input
 */
async function samplePhase({ sceneIndex, prefix, from, to, always, step, also = [], awayBefore = [] }) {
    const scenes = [...document.querySelectorAll(`.${prefix}-scene[data-${prefix}-kind="cycle"]`)];
    const scene = scenes[sceneIndex];
    const attr = `data-${prefix}-phase`;
    const mine = () =>
        document.getAnimations().filter((a) => {
            const effect = /** @type {KeyframeEffect} */ (a.effect);
            return effect && effect.target && scene.contains(effect.target) && Number.isFinite(effect.getComputedTiming().endTime);
        });
    const settle = () => new Promise((resolve) => setTimeout(resolve, 0));
    scene.setAttribute(attr, from);
    await settle();
    for (const a of mine()) a.finish();
    // What is away in the `from` pose (hidden or see-through): a part that
    // comes back from there arrives; one that was there all along updates.
    const away = new Set(
        [...scene.querySelectorAll('*')].filter((el) => {
            const cs = getComputedStyle(el);
            return cs.visibility === 'hidden' || cs.opacity === '0';
        }),
    );
    const everyEl = [...scene.querySelectorAll('*')];
    const cellsOf = [...scene.querySelectorAll(`.${prefix}-part`)];
    const cellIndex = (/** @type {Element} */ el) => cellsOf.indexOf(/** @type {Element} */ (el.closest(`.${prefix}-part`)));
    // A cell arrived when something away at `gap` stands in it at `hold`
    // (the demos close exactly those cells).
    const arrivedCells = [
        ...new Set(
            awayBefore
                .map((i) => everyEl[i])
                .filter((el) => {
                    const cs = getComputedStyle(el);
                    return cs.visibility !== 'hidden' && cs.opacity !== '0';
                })
                .map(cellIndex),
        ),
    ];
    const wasAway = (/** @type {Element} */ el) => {
        for (let at = /** @type {Element | null} */ (el); at && at !== scene; at = at.parentElement) if (away.has(at)) return true;
        return false;
    };
    scene.setAttribute(attr, to);
    // A demo may react to the phase (a close played backwards by script):
    // let its observers run before reading what started.
    await Promise.resolve();
    const started = mine().filter((a) => a.playState !== 'finished');
    for (const a of started) a.pause();
    // Seek every animation along its own direction from where it stands now.
    const origin = new Map(started.map((a) => [a, { at: Number(a.currentTime ?? 0), rate: a.playbackRate }]));
    const kebab = (/** @type {string} */ s) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
    /** @type {Map<string, { el: Element, pseudo: string | null, props: Set<string>, names: string[], end: number }>} */
    const parts = new Map();
    const all = [...scene.querySelectorAll('*')];
    const keyOf = (/** @type {Element} */ el, /** @type {string | null} */ pseudo) => `${all.indexOf(el)}${pseudo || ''}`;
    let end = 0;
    for (const a of started) {
        const effect = /** @type {KeyframeEffect} */ (a.effect);
        const el = /** @type {Element} */ (effect.target);
        const key = keyOf(el, effect.pseudoElement);
        const part = parts.get(key) || { el, pseudo: effect.pseudoElement, props: new Set(always), names: [], end: 0 };
        const o = /** @type {{ at: number, rate: number }} */ (origin.get(a));
        // How long this animation still runs from here, in the page's time.
        const runs = o.rate < 0 ? o.at / -o.rate : (Number(effect.getComputedTiming().endTime) - o.at) / o.rate;
        part.end = Math.max(part.end, runs);
        const name = /** @type {any} */ (a).animationName || /** @type {any} */ (a).transitionProperty || 'script';
        part.names.push(`${name} ${Math.round(runs)}ms${o.rate < 0 ? ' reversed' : ''}`);
        if (/** @type {any} */ (a).transitionProperty) part.props.add(/** @type {any} */ (a).transitionProperty);
        for (const frame of effect.getKeyframes())
            for (const prop of Object.keys(frame))
                if (!['composite', 'easing', 'offset', 'computedOffset'].includes(prop)) part.props.add(kebab(prop));
        parts.set(key, part);
        end = Math.max(end, runs);
    }
    // Parts that moved in the other phase are read here too, standing still or not.
    const everything = [...scene.querySelectorAll('*')];
    for (const { key, props } of also) {
        if (parts.has(key)) {
            for (const prop of props) parts.get(key)?.props.add(prop);
            continue;
        }
        const m = /^(\d+)(.*)$/.exec(key);
        if (!m) continue;
        parts.set(key, { el: everything[Number(m[1])], pseudo: m[2] || null, props: new Set(props), names: [], end: 0 });
    }
    const label = (/** @type {Element} */ el, /** @type {string | null} */ pseudo) =>
        `${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 3).join('.')}${pseudo || ''}`;
    const cells = [...scene.querySelectorAll(`.${prefix}-part`)];
    const out = [...parts.entries()].map(([key, p]) => ({
        key,
        cell: cells.indexOf(/** @type {Element} */ (p.el.closest(`.${prefix}-part`))),
        away: wasAway(p.el),
        label: label(p.el, p.pseudo),
        names: p.names,
        end: p.end,
        props: [...p.props],
        samples: /** @type {{ t: number, v: Record<string, string>, box: [number, number] }[]} */ ([]),
    }));
    for (let t = 0; t <= end + step; t += step) {
        const at = Math.min(t, end);
        for (const a of started) {
            const o = /** @type {{ at: number, rate: number }} */ (origin.get(a));
            a.currentTime = Math.max(0, o.at + o.rate * at);
        }
        out.forEach((o, i) => {
            const p = [...parts.values()][i];
            const cs = getComputedStyle(p.el, p.pseudo);
            /** @type {Record<string, string>} */
            const v = {};
            for (const prop of o.props) v[prop] = cs.getPropertyValue(prop);
            const rect = p.el.getBoundingClientRect();
            const w = p.pseudo ? parseFloat(cs.width) || rect.width : /** @type {HTMLElement} */ (p.el).offsetWidth || rect.width;
            const h = p.pseudo ? parseFloat(cs.height) || rect.height : /** @type {HTMLElement} */ (p.el).offsetHeight || rect.height;
            o.samples.push({ t: at, v, box: [w, h] });
        });
        if (at === end) break;
    }
    for (const a of started) a.finish();
    return { end, parts: out, awayIdx: [...away].map((el) => everyEl.indexOf(el)), arrivedCells };
}

/* ---------------------------------------------------------- into numbers */

/** A length, `calc()` of % and px included, in px against `ref`. */
function length(/** @type {string | undefined} */ text, /** @type {number} */ ref) {
    const s = (text ?? '0').trim();
    const inner = s.startsWith('calc(') ? s.slice(5, -1) : s;
    let sum = 0;
    let sign = 1;
    for (const tok of inner.replace(/\(|\)/g, ' ').split(/\s+/).filter(Boolean)) {
        if (tok === '+') sign = 1;
        else if (tok === '-') sign = -1;
        else {
            const m = /^(-?[\d.e+-]+)(%|px|deg|turn|rad)?$/.exec(tok);
            if (!m) continue;
            const n = Number(m[1]);
            sum += sign * (m[2] === '%' ? (n / 100) * ref : m[2] === 'turn' ? n * 360 : n);
            sign = 1;
        }
    }
    return sum;
}

/** Split a value on top-level spaces (not inside parentheses). */
function words(/** @type {string} */ s) {
    const out = [];
    let depth = 0;
    let cur = '';
    for (const c of s) {
        if (c === '(') depth += 1;
        if (c === ')') depth -= 1;
        if (c === ' ' && depth === 0) {
            if (cur) out.push(cur);
            cur = '';
        } else cur += c;
    }
    if (cur) out.push(cur);
    return out;
}

const FILTER_IDENTITY = { blur: 0, 'hue-rotate': 0, grayscale: 0, sepia: 0, invert: 0 };

/**
 * One property's computed value as named numbers, so samples whose value
 * changes shape (none → brightness(1.7), inset(a b) → inset(a b c d)) still
 * line up component by component.
 * @returns {Record<string, number>}
 */
function numbers(/** @type {string} */ prop, /** @type {string} */ value, /** @type {[number, number]} */ [w, h]) {
    const v = (value || '').trim();
    if (prop === 'visibility') return { visible: v === 'hidden' ? 0 : 1 };
    if (prop === 'clip-path') {
        if (v === 'none' || v === '') return { t: 0, r: 0, b: 0, l: 0 };
        const m = /^(inset|circle|ellipse|polygon)\((.*)\)/.exec(v);
        if (!m) return {};
        if (m[1] === 'inset') {
            const a = words(m[2].split(' round ')[0]);
            const [t, r = t, b = t, l = r] = a;
            return { t: length(t, h), r: length(r, w), b: length(b, h), l: length(l, w) };
        }
        if (m[1] === 'circle' || m[1] === 'ellipse') {
            const [shape, at = ''] = m[2].split(' at ');
            const pos = words(at);
            const radii = words(shape);
            const diag = Math.hypot(w, h) / Math.SQRT2;
            const o = /** @type {Record<string, number>} */ ({ x: length(pos[0] || '50%', w), y: length(pos[1] || '50%', h) });
            radii.forEach((r, i) => (o[`r${i}`] = length(r, m[1] === 'circle' ? diag : i ? h : w)));
            return o;
        }
        const o = /** @type {Record<string, number>} */ ({});
        m[2].split(',').forEach((pair, i) => {
            const [x, y] = words(pair.trim());
            o[`x${i}`] = length(x, w);
            o[`y${i}`] = length(y, h);
        });
        return o;
    }
    if (prop === 'transform') {
        if (v === 'none') return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
        const n = (v.match(/-?[\d.]+(e-?\d+)?/g) || []).map(Number);
        if (v.startsWith('matrix3d')) return { a: n[0], b: n[1], c: n[4], d: n[5], e: n[12], f: n[13] };
        const [a, b, c, d, e, f] = n;
        return { a, b, c, d, e, f };
    }
    if (prop === 'scale') {
        if (v === 'none') return { x: 1, y: 1 };
        const n = words(v).map(Number);
        return { x: n[0], y: n[1] ?? n[0] };
    }
    if (prop === 'translate') {
        if (v === 'none') return { x: 0, y: 0 };
        const a = words(v);
        return { x: length(a[0], w), y: length(a[1] || '0px', h) };
    }
    if (prop === 'rotate') return { r: v === 'none' ? 0 : length(v.replace(/^.*\s/, ''), 360) };
    if (prop === 'filter' || prop === 'backdrop-filter') {
        if (v === 'none') return {};
        const o = /** @type {Record<string, number>} */ ({});
        for (const m of v.matchAll(/([a-z-]+)\(([^()]*(\([^()]*\))?[^()]*)\)/g)) {
            const nums = (m[2].match(/-?[\d.]+(e-?\d+)?/g) || []).map(Number);
            nums.forEach((n, i) => (o[`${m[1]}${i || ''}`] = n));
        }
        return o;
    }
    const o = /** @type {Record<string, number>} */ ({});
    if (v === 'none' || v === 'auto' || v === 'normal') return o;
    const nums = v.match(/-?[\d.]+(e-?\d+)?(%|px)?/g) || [];
    nums.forEach((n, i) => (o[`n${i}`] = n.endsWith('%') ? (parseFloat(n) / 100) * w : parseFloat(n)));
    return o;
}

/**
 * How much of the part's box a clip-path leaves visible, 0 to 1, on a 24 × 24
 * grid: what the eye sees of a reveal, rather than how far the shape's numbers
 * moved (a dome of 150 % covers the box long before its radius is done).
 */
function visibleArea(/** @type {string} */ value, /** @type {[number, number]} */ [w, h]) {
    const v = (value || '').trim();
    if (!w || !h || v === '' || v === 'none') return 1;
    const n = numbers('clip-path', v, [w, h]);
    const kind = /^(\w+)\(/.exec(v)?.[1];
    /** @type {(x: number, y: number) => boolean} */
    let inside = () => true;
    if (kind === 'inset') inside = (x, y) => x >= n.l && x <= w - n.r && y >= n.t && y <= h - n.b;
    else if (kind === 'circle') inside = (x, y) => Math.hypot(x - n.x, y - n.y) <= n.r0;
    else if (kind === 'ellipse') inside = (x, y) => ((x - n.x) / (n.r0 || 1e-9)) ** 2 + ((y - n.y) / (n.r1 || 1e-9)) ** 2 <= 1;
    else if (kind === 'polygon') {
        const pts = [];
        for (let i = 0; `x${i}` in n; i += 1) pts.push([n[`x${i}`], n[`y${i}`]]);
        inside = (x, y) => {
            let c = false;
            for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
                const [xi, yi] = pts[i];
                const [xj, yj] = pts[j];
                if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi || 1e-9) + xi) c = !c;
            }
            return c;
        };
    } else return 1;
    let seen = 0;
    const N = 24;
    for (let i = 0; i < N; i += 1) for (let j = 0; j < N; j += 1) if (inside(((i + 0.5) / N) * w, ((j + 0.5) / N) * h)) seen += 1;
    return seen / (N * N);
}

/** A default for a component missing from a sample (a filter function that is not there yet is its identity). */
function missing(/** @type {string} */ prop, /** @type {string} */ name) {
    if (prop === 'filter' || prop === 'backdrop-filter') {
        const fn = name.replace(/\d+$/, '');
        return fn in FILTER_IDENTITY ? FILTER_IDENTITY[/** @type {keyof typeof FILTER_IDENTITY} */ (fn)] : 1;
    }
    return 0;
}

/**
 * A part's samples as one table: components (`prop:name`) × samples.
 * @param {{ props: string[], end?: number, samples: { t: number, v: Record<string, string>, box: [number, number] }[] }} part
 */
export function table(part) {
    // A part's own run: the samples after its last animation ends add nothing.
    const samples = part.samples.filter((s, i) => i === 0 || s.t <= (part.end ?? Infinity) + STEP);
    const rows = samples.map((s) => {
        /** @type {Record<string, number>} */
        const row = {};
        for (const prop of part.props) for (const [k, n] of Object.entries(numbers(prop, s.v[prop], s.box))) row[`${prop}:${k}`] = n;
        if (part.props.includes('clip-path')) row['clip-path:area'] = visibleArea(s.v['clip-path'], s.box);
        return row;
    });
    const keys = [...new Set(rows.flatMap((r) => Object.keys(r)))];
    for (const r of rows)
        for (const k of keys) {
            const [prop, name] = k.split(':');
            if (!(k in r) || !Number.isFinite(r[k])) r[k] = missing(prop, name);
        }
    return { keys, rows, times: samples.map((s) => s.t) };
}

/**
 * How far a part turned, in degrees, positive clockwise on the screen (y
 * points down). Reads the plate's polar position from its `translate` or the
 * offset of its `drop-shadow`, or a plain `rotate`. Null when it does not turn.
 * @param {{ samples: { v: Record<string, string> }[] } | null | undefined} part
 */
export function turnOf(part) {
    if (!part) return null;
    const num = (/** @type {string | undefined} */ t) => (t || '').match(/-?[\d.]+(?:e-?\d+)?/g)?.map(Number) || [];
    /** @type {number[]} */
    const angles = [];
    let rotated = 0;
    let hasRotate = false;
    for (const { v } of part.samples) {
        let x = NaN;
        let y = NaN;
        const f = (v.filter || '').replace(/(?:color|rgba?|hsla?)\([^)]*\)/g, '');
        const shadow = /drop-shadow\(\s*(-?[\d.]+(?:e-?\d+)?)px\s+(-?[\d.]+(?:e-?\d+)?)px/.exec(f);
        if (shadow) [x, y] = [Number(shadow[1]), Number(shadow[2])];
        else if (v.translate && v.translate !== 'none') [x, y] = [num(v.translate)[0] ?? 0, num(v.translate)[1] ?? 0];
        if (Number.isFinite(x) && Math.hypot(x, y) > 0.4) angles.push((Math.atan2(y, x) * 180) / Math.PI);
        if (v.rotate && v.rotate !== 'none') {
            hasRotate = true;
            rotated = num(v.rotate).at(-1) ?? rotated;
        }
    }
    let total = 0;
    for (let i = 1; i < angles.length; i += 1) {
        let d = angles[i] - angles[i - 1];
        while (d > 180) d -= 360;
        while (d < -180) d += 360;
        total += d;
    }
    if (hasRotate && Math.abs(rotated) > Math.abs(total)) total = rotated;
    return Math.abs(total) < 20 ? null : Math.round(total);
}

/* ---------------------------------------------------------------- metrics */

/**
 * How far along a part is at every sample: per component that differs
 * between the first and the last pose, 1 − |value − last| / |first − last|,
 * averaged over the moving (geometry) components, else over all.
 */
function progress(/** @type {ReturnType<typeof table>} */ tab) {
    const first = tab.rows[0];
    const last = tab.rows[tab.rows.length - 1];
    const range = (/** @type {string} */ k) => Math.abs(first[k] - last[k]);
    const scale = (/** @type {string} */ k) => Math.max(...tab.rows.map((r) => r[k])) - Math.min(...tab.rows.map((r) => r[k]));
    const moving = tab.keys.filter((k) => range(k) > 1e-3 && range(k) > 0.02 * Math.max(scale(k), 1e-9));
    // A clip-path counts by the area it shows, when that area changes.
    const byArea = moving.includes('clip-path:area');
    const geometric = moving.filter(
        (k) =>
            GEOMETRY.has(k.split(':')[0]) && k.split(':')[0] !== 'visibility' && (!byArea || !k.startsWith('clip-path:') || k === 'clip-path:area'),
    );
    const use = geometric.length ? geometric : moving;
    const excursion = tab.keys.filter((k) => scale(k) > 1e-3);
    if (!use.length) return { kind: excursion.length ? 'pulse' : 'still', p: tab.rows.map(() => 1), use, excursion };
    const p = tab.rows.map((r) => use.reduce((sum, k) => sum + (1 - Math.abs(r[k] - last[k]) / range(k)), 0) / use.length);
    return { kind: 'move', p, use, excursion };
}

export function timing(/** @type {ReturnType<typeof table>} */ tab) {
    const pr = progress(tab);
    const { times } = tab;
    const end = times[times.length - 1];
    const firstOf = (/** @type {(x: number) => boolean} */ test) => {
        const i = pr.p.findIndex(test);
        return i < 0 ? null : times[i];
    };
    // A pulse (a live flash that ends where it began): when it starts and peaks.
    const changed = tab.rows.map((r) => tab.keys.some((k) => Math.abs(r[k] - tab.rows[0][k]) > 1e-3));
    const start = times[changed.indexOf(true)] ?? null;
    const lastChange = times[changed.lastIndexOf(true)] ?? null;
    const settle = (() => {
        const last = tab.rows[tab.rows.length - 1];
        let at = 0;
        tab.rows.forEach((r, i) => {
            if (tab.keys.some((k) => Math.abs(r[k] - last[k]) > 1e-3)) at = times[Math.min(i + 1, times.length - 1)];
        });
        return at;
    })();
    if (pr.kind !== 'move')
        return { kind: pr.kind, start, t50: null, t90: null, settle: lastChange, run: lastChange === null ? 0 : lastChange - start, end };
    const t0 = Math.max(0, (times[pr.p.findIndex((x) => x > 0.02)] ?? STEP) - STEP);
    const t50 = firstOf((x) => x >= 0.5);
    const t90 = firstOf((x) => x >= 0.9);
    const run = settle - t0;
    return {
        kind: pr.kind,
        start: t0,
        t50,
        t90,
        settle,
        run,
        end,
        front: t90 === null || run <= 0 ? null : (t90 - t0) / run,
        use: pr.use,
    };
}

/**
 * Whether `leave` is `arrive` played backwards: the same duration within a
 * frame, and at every leave sample a pose the arrival had at the mirrored
 * time (±1 frame), within 8 % of each component's range.
 */
export function reversed(
    /** @type {ReturnType<typeof table>} */ arrive,
    /** @type {ReturnType<typeof table>} */ leave,
    /** @type {number} */ arriveSpan,
    /** @type {number} */ leaveSpan,
) {
    const keys = [...new Set([...arrive.keys, ...leave.keys])].filter((k) => !k.startsWith('visibility'));
    const span = (/** @type {string} */ k) => {
        const all = [...arrive.rows, ...leave.rows].map((r) => r[k] ?? 0);
        return Math.max(...all) - Math.min(...all);
    };
    const live = keys.filter((k) => span(k) > 1e-3);
    if (!live.length) return { ok: true, why: 'nothing moves' };
    // A cell (one dialog, one week of days) is one arrival: its close is the
    // whole cell's arrival backwards, so a part is mirrored on the cell's span.
    const Ta = arriveSpan;
    const Tl = leaveSpan;
    const atTime = (/** @type {ReturnType<typeof table>} */ tab, /** @type {number} */ t) => {
        let i = tab.times.findIndex((x) => x >= t);
        if (i < 0) i = tab.times.length - 1;
        return tab.rows[i];
    };
    let worst = 0;
    let worstAt = 0;
    let worstKey = '';
    for (let i = 0; i < leave.times.length; i += 1) {
        const t = leave.times[i];
        const mirror = Ta - t;
        let best = Infinity;
        let bestKey = '';
        for (const dt of [-FRAME, -FRAME / 2, 0, FRAME / 2, FRAME]) {
            const a = atTime(arrive, Math.min(Math.max(mirror + dt, 0), Ta));
            let dev = 0;
            let devKey = '';
            for (const k of live) {
                const d = Math.abs((leave.rows[i][k] ?? 0) - (a[k] ?? 0)) / span(k);
                if (d > dev) {
                    dev = d;
                    devKey = k;
                }
            }
            if (dev < best) {
                best = dev;
                bestKey = devKey;
            }
        }
        if (best > worst) {
            worst = best;
            worstAt = t;
            worstKey = bestKey;
        }
    }
    const sameLength = Math.abs(Ta - Tl) <= FRAME + STEP;
    const ok = sameLength && worst <= VALUE_TOLERANCE;
    return {
        ok,
        why: ok
            ? 'mirror'
            : `${sameLength ? '' : `open ${Math.round(Ta)} ms, close ${Math.round(Tl)} ms; `}worst ${(worst * 100).toFixed(0)} % off at ${worstAt} ms (${worstKey})`,
    };
}

/* ------------------------------------------------------------------- run */

async function main() {
    const args = process.argv.slice(2);
    const flag = (/** @type {string} */ name, /** @type {string} */ fallback) => {
        const at = args.indexOf(name);
        return at >= 0 ? args[at + 1] : fallback;
    };
    const demo = args.find((a) => !a.startsWith('--') && !args[args.indexOf(a) - 1]?.startsWith('--')) || '';
    if (!demo) {
        console.error(
            'usage: node research/_review/measure-motion.mjs research/<demo> [--base URL] [--aspect id] [--width px] [--json file] [--parts]',
        );
        process.exit(2);
    }
    const BASE = flag('--base', 'http://127.0.0.1:8743');
    const ONLY = flag('--aspect', '');
    const WIDTH = Number(flag('--width', '1600'));
    const JSON_OUT = flag('--json', '');
    const SHOW_PARTS = args.includes('--parts');

    const browser = await firefox.launch();
    const page = await browser.newPage({ viewport: { width: WIDTH, height: 1000 }, reducedMotion: 'no-preference' });
    await page.goto(`${BASE}/${demo.replace(/\/$/, '')}/demo.html`);
    await page.waitForSelector('[data-review-item]');
    const meta = await page.evaluate(async () => {
        const pause = document.createElement('span');
        pause.id = 'rv-flip-pause';
        pause.textContent = 'paused by measure-motion';
        pause.hidden = true;
        document.body.append(pause);
        const cls =
            [...document.querySelectorAll('[class*="-scene"]')].flatMap((el) => [...el.classList]).find((c) => /^[a-z]+-scene$/.test(c)) || '';
        const prefix = cls.replace(/-scene$/, '');
        const scenes = [...document.querySelectorAll(`.${prefix}-scene[data-${prefix}-kind="cycle"]`)];
        return {
            prefix,
            scenes: scenes.map((s) => {
                const aspect = s.closest(`[data-${prefix}-aspect]`)?.getAttribute(`data-${prefix}-aspect`) || '';
                const col = s.closest(`[data-${prefix}-option]`);
                return {
                    aspect,
                    option: col?.getAttribute(`data-${prefix}-option`) || '',
                    key: s.getAttribute(`data-${prefix}-${aspect}`) || '',
                    name: col?.querySelector('[class$="__name"]')?.textContent || '',
                };
            }),
        };
    });
    // Let the page's own clock run into the pause before driving the scenes.
    await page.waitForTimeout(3000);

    const source = await (await fetch(`${BASE}/${demo.replace(/\/$/, '')}/demo.js`)).text();
    const phaseMs = Object.fromEntries([...source.matchAll(/\['(gap|in|hold|out)',\s*(\d+)\]/g)].map((m) => [m[1], Number(m[2])]));

    const report = [];
    for (const [sceneIndex, s] of meta.scenes.entries()) {
        if (ONLY && s.aspect !== ONLY) continue;
        const arrive = await page.evaluate(samplePhase, { sceneIndex, prefix: meta.prefix, from: 'gap', to: 'in', always: ALWAYS, step: STEP });
        const also = arrive.parts.map((p) => ({ key: p.key, props: p.props }));
        const leave = await page.evaluate(samplePhase, {
            sceneIndex,
            prefix: meta.prefix,
            from: 'hold',
            to: 'out',
            always: ALWAYS,
            step: STEP,
            also,
            awayBefore: arrive.awayIdx,
        });
        // The pose a part has in `gap` (after its leave), to catch a leave that
        // ends shown and is then cut away at once.
        const keys = [...new Set([...arrive.parts.map((p) => p.key), ...leave.parts.map((p) => p.key)])];
        const spanOf = (/** @type {typeof arrive.parts} */ list, /** @type {number} */ cell) =>
            Math.max(0, ...list.filter((p) => p.cell === cell && p.cell >= 0).map((p) => p.end));
        const parts = keys.map((key) => {
            const a = arrive.parts.find((p) => p.key === key);
            const l = leave.parts.find((p) => p.key === key);
            const ta = a ? table(a) : null;
            const tl = l ? table(l) : null;
            const ma = ta ? timing(ta) : null;
            const ml = tl ? timing(tl) : null;
            let symmetry = '';
            const arrives = Boolean(a && leave.arrivedCells.includes(/** @type {any} */ (a).cell));
            if (a && !arrives) symmetry = '';
            else if (ta && ma && ma.kind !== 'still') {
                if (ma.kind === 'move' && (!tl || !ml || ml.kind === 'still')) {
                    // Standing still through `out`: where?
                    const pose = tl ? tl.rows[0] : null;
                    const near = (/** @type {Record<string, number>} */ row) =>
                        pose
                            ? ta.keys
                                  .filter((k) => GEOMETRY.has(k.split(':')[0]) && Math.abs(ta.rows[0][k] - ta.rows[ta.rows.length - 1][k]) > 1e-3)
                                  .every(
                                      (k) =>
                                          Math.abs((pose[k] ?? 0) - row[k]) <=
                                          Math.max(0.1 * Math.abs(ta.rows[0][k] - ta.rows[ta.rows.length - 1][k]), 8),
                                  )
                            : false;
                    symmetry = near(ta.rows[0])
                        ? 'BLINK: snaps shut as out starts'
                        : near(ta.rows[ta.rows.length - 1])
                          ? 'BLINK: shown through out, cut at gap'
                          : 'BLINK: jumps to another pose at out';
                } else {
                    const cell = /** @type {any} */ (a).cell;
                    const r = reversed(ta, tl, Math.max(spanOf(arrive.parts, cell), a?.end ?? 0), Math.max(spanOf(leave.parts, cell), l?.end ?? 0));
                    symmetry = r.ok ? 'mirror' : r.why;
                }
            } else if (tl && ml && ml.kind !== 'still' && (!ma || ma.kind === 'still')) symmetry = 'closes with motion, opens without';
            const turnIn = turnOf(a);
            const turnOut = turnOf(l);
            // Turning the same way in and out is the opposites rule broken on purpose, not a mirror fault.
            if (turnOut !== null && turnOut > 0 && (turnIn === null || turnIn > 0) && symmetry !== 'mirror')
                symmetry = `clockwise both ways, not mirrored on purpose (in ${turnIn === null ? 'none' : `+${turnIn}°`}, out +${turnOut}°)`;
            else if (turnIn !== null || turnOut !== null)
                symmetry = `${symmetry}${symmetry ? ' ' : ''}[turns in ${turnIn ?? 0}°, out ${turnOut ?? 0}°]`;
            return {
                cell: (a || l)?.cell,
                turnOut,
                label: (a || l)?.label,
                in: ma && { ...ma, names: a?.names },
                out: ml && { ...ml, names: l?.names },
                symmetry,
                cutIn:
                    ma && phaseMs.in && phaseMs.hold && ma.end > phaseMs.in + phaseMs.hold
                        ? `runs ${ma.end} ms, in+hold ${phaseMs.in + phaseMs.hold} ms`
                        : '',
                // A close played backwards by the demo's script is waited for by its clock; a leave the CSS draws is not.
                cutOut:
                    ml && phaseMs.out && ml.end > phaseMs.out && !l?.names.some((n) => n.startsWith('script'))
                        ? `runs ${ml.end} ms, out phase ${phaseMs.out} ms`
                        : '',
            };
        });
        // A leave drawn by another part of the cell (a hand, the lines of a row) that turns clockwise: say so, not "off".
        for (const p of parts) {
            const by = parts.find((q) => q !== p && q.cell === p.cell && q.cell >= 0 && (q.turnOut ?? 0) > 0);
            if (by && /^worst /.test(p.symmetry))
                p.symmetry = `leave drawn by ${by.label}, clockwise (+${by.turnOut}°); the arrival is not played backwards, on purpose`;
        }
        report.push({ ...s, parts });
    }
    await browser.close();

    /* ---------------------------------------------------------------- report */

    const ms = (/** @type {number | null | undefined} */ n) => (n === null || n === undefined ? '–' : String(Math.round(n)));
    const line = (/** @type {any} */ m) =>
        !m
            ? '·'
            : m.kind !== 'move'
              ? `${m.kind} ${ms(m.start)}+${ms(m.run)}`
              : `t50 ${ms(m.t50)} t90 ${ms(m.t90)} run ${ms(m.start)}→${ms(m.settle)}${m.front !== null && m.front <= 0.3 ? ' FRONT' : ''}`;
    console.log(`${demo} · phases ${JSON.stringify(phaseMs)} · width ${WIDTH}`);
    let current = '';
    for (const r of report) {
        if (r.aspect !== current) {
            current = r.aspect;
            console.log(`\n## ${r.aspect}`);
        }
        console.log(`  ${r.option} ${r.key} — ${r.name}`);
        const moving = r.parts.filter((p) => (p.in && p.in.kind !== 'still') || (p.out && p.out.kind !== 'still'));
        // Parts with the same label and the same numbers collapse into one line.
        const seen = new Map();
        for (const p of moving) {
            const text = `in ${line(p.in)} | out ${line(p.out)}${p.symmetry ? ` | ${p.symmetry}` : ''}${p.cutIn ? ` | CUT-IN ${p.cutIn}` : ''}${p.cutOut ? ` | CUT-OUT ${p.cutOut}` : ''}`;
            const k = `${p.label}|${text}`;
            seen.set(k, (seen.get(k) || 0) + 1);
        }
        for (const [k, n] of seen) {
            const label = k.split('|')[0];
            console.log(`    ${label}${n > 1 ? ` ×${n}` : ''}: ${k.slice(label.length + 1)}`);
        }
        if (SHOW_PARTS)
            for (const p of moving) console.log(`      ${p.label}: in [${p.in?.names?.join(', ') || ''}] out [${p.out?.names?.join(', ') || ''}]`);
    }
    if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify(report, null, 2));
}

// Run as a command; imported, it only lends its measuring (table, timing, reversed).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
