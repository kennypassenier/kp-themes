// Loading with ONE pen (Kenny, 2026-10-07 22:24: "it doesn't work well with
// components where there are multiple elements, it would be nice if it was
// always just one pen that traces everything").
//
// A component that waits (a table, a card with several lines, a form, a strip
// of key figures) is a skeleton with fixed proportions: every place a reading
// will stand is two dimension ticks on a baseline (the signature skeleton),
// at a known place (x in % of the component's width, y in rem from its top).
// ONE pen traces the whole component in one continuous route, the pen up
// between elements; the route is the only thing the four options change. When
// the route ends the readings are inked at once (the arrival, as the traced
// arrival inks a part), the marks stand a moment and are lifted, the
// component rests empty, and the pen starts again.
//
// The keyframes are generated from the route, so the pen and the marks it
// draws are written from the SAME offsets and the same ramp and cannot drift
// apart (the same rule as pen.css and options.css). Everything is plain CSS in
// `@layer kp.signature` once it is generated: the review dialog moves the
// section and the animations simply keep running; nothing reads the layout.

import { pen } from './pen.js';

/** G1: the plotter's feed, the stepper's trapezoid. */
const FEED = 'linear(0, 0.031 10%, 0.125 20%, 0.875 80%, 0.969 90%, 1)';

/** The loop in percent: the route ends at 6 of 18 units, the marks are lifted at 8, the readings stand to 15. */
const ROUTE_END = (6 / 18) * 100;
const LIFT = (8 / 18) * 100;
const RESET = (15 / 18) * 100;

/**
 * The four components. `places` are the readings' places in reading order
 * (`x0`, `x1` in %, `y` the baseline in rem, `v` the reading, `big` a figure);
 * `rows` group them by baseline; `statics` are the words that stand all the
 * time. `h` is the component's height in rem (fixed, so every y is exact).
 */
const SPECS = {
    table: {
        label: 'Table',
        h: 8.2,
        statics: [
            { x: 4, y: 0.55, t: 'Sheet' },
            { x: 52, y: 0.55, t: 'Rev' },
            { x: 74, y: 0.55, t: 'Plotted' },
        ],
        rules: [1.95],
        places: [
            { x0: 4, x1: 46, y: 3.6, v: 'A-201 Ground floor' },
            { x0: 52, x1: 68, y: 3.6, v: 'C' },
            { x0: 74, x1: 96, y: 3.6, v: '08:12' },
            { x0: 4, x1: 46, y: 5.45, v: 'A-202 First floor' },
            { x0: 52, x1: 68, y: 5.45, v: 'B' },
            { x0: 74, x1: 96, y: 5.45, v: '07:50' },
            { x0: 4, x1: 46, y: 7.3, v: 'S-110 Foundations' },
            { x0: 52, x1: 68, y: 7.3, v: 'D' },
            { x0: 74, x1: 96, y: 7.3, v: '—' },
        ],
        rows: [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
        ],
    },
    card: {
        label: 'Card',
        h: 7.2,
        statics: [{ x: 4, y: 0.5, t: 'Sheet A-201' }],
        rules: [],
        places: [
            { x0: 4, x1: 64, y: 2.7, v: 'Ground floor plan', big: true },
            { x0: 4, x1: 94, y: 4.3, v: 'Two beams on grid line C moved' },
            { x0: 4, x1: 86, y: 5.5, v: '150 mm after the structural check.' },
            { x0: 4, x1: 52, y: 6.7, v: 'Issued as revision C' },
        ],
        rows: [[0], [1], [2], [3]],
    },
    form: {
        label: 'Form',
        h: 10.2,
        statics: [
            { x: 4, y: 0.4, t: 'Drawing number' },
            { x: 4, y: 3.8, t: 'Level' },
            { x: 4, y: 7.2, t: 'Revision' },
        ],
        rules: [],
        places: [
            { x0: 4, x1: 96, y: 2.9, v: 'A-201' },
            { x0: 4, x1: 96, y: 6.3, v: 'Level 2' },
            { x0: 4, x1: 96, y: 9.7, v: 'C' },
        ],
        rows: [[0], [1], [2]],
    },
    strip: {
        label: 'Key figures',
        h: 5.6,
        statics: [
            { x: 4, y: 0.5, t: 'Issued' },
            { x: 36, y: 0.5, t: 'Held' },
            { x: 68, y: 0.5, t: 'Void' },
        ],
        rules: [],
        places: [
            { x0: 4, x1: 28, y: 3.0, v: '412', big: true },
            { x0: 36, x1: 60, y: 3.0, v: '38', big: true },
            { x0: 68, x1: 92, y: 3.0, v: '12', big: true },
            { x0: 4, x1: 20, y: 4.7, v: '+6 %' },
            { x0: 36, x1: 52, y: 4.7, v: '−1' },
            { x0: 68, x1: 84, y: 4.7, v: '+3' },
        ],
        rows: [
            [0, 1, 2],
            [3, 4, 5],
        ],
    },
};

/* ------------------------------------------------------------------ routes */

/** A move of the pen: down (draws, `lead` a dotted leader) or up (travels). */
const draw = (x1, y1, x2, y2, lead = false) => ({ down: true, x1, y1, x2, y2, lead });
const jump = (x1, y1, x2, y2) => ({ down: false, x1, y1, x2, y2, lead: false });

/** The component's outline, one stroke a side, from the top-start corner round. */
const outline = (h) => [draw(0, 0, 100, 0), draw(100, 0, 100, h), draw(100, h, 0, h), draw(0, h, 0, 0)];

/**
 * The routes: what the four options differ in.
 * `outline`   the outline first, then each place underlined in reading order, the pen up between.
 * `leaders`   reading order, a row in one stroke: a dotted leader runs from the start edge to the first place and on to the next.
 * `snake`     the rows taken in turn, one way and back, only the places underlined, the pen up between places.
 * `meander`   one unbroken line, the pen never lifted: along a row, down the end, back along the next.
 * @type {Record<string, (spec: typeof SPECS.table) => ReturnType<typeof draw>[]>}
 */
const ROUTES = {
    outline(spec) {
        const moves = outline(spec.h);
        let at = [0, 0];
        for (const p of spec.places) {
            if (at[0] !== p.x0 || at[1] !== p.y) moves.push(jump(at[0], at[1], p.x0, p.y));
            moves.push(draw(p.x0, p.y, p.x1, p.y));
            at = [p.x1, p.y];
        }
        return moves;
    },
    leaders(spec) {
        const moves = [];
        let at = null;
        for (const row of spec.rows) {
            const places = row.map((i) => spec.places[i]);
            const y = places[0].y;
            if (at) moves.push(jump(at[0], at[1], 0, y));
            let x = 0;
            for (const p of places) {
                if (p.x0 > x) moves.push(draw(x, y, p.x0, y, true));
                moves.push(draw(p.x0, y, p.x1, y));
                x = p.x1;
            }
            at = [x, y];
        }
        return moves;
    },
    snake(spec) {
        const moves = [];
        let at = null;
        spec.rows.forEach((row, r) => {
            const places = row.map((i) => spec.places[i]);
            const y = places[0].y;
            const ordered = r % 2 ? [...places].reverse() : places;
            for (const p of ordered) {
                const [a, b] = r % 2 ? [p.x1, p.x0] : [p.x0, p.x1];
                if (at && (at[0] !== a || at[1] !== y)) moves.push(jump(at[0], at[1], a, y));
                moves.push(draw(a, y, b, y));
                at = [b, y];
            }
        });
        return moves;
    },
    meander(spec) {
        const moves = [];
        const ys = spec.rows.map((row) => spec.places[row[0]].y);
        ys.forEach((y, r) => {
            const [a, b] = r % 2 ? [100, 0] : [0, 100];
            moves.push(draw(a, y, b, y));
            if (r < ys.length - 1) moves.push(draw(b, y, b, ys[r + 1]));
        });
        return moves;
    },
};

/** The four options, recommended first (demo.js writes their words). */
export const LOADING_ROUTES = ['outline', 'leaders', 'snake', 'meander'];

/* --------------------------------------------------------------- the markup */

const pct = (n) => `${+n.toFixed(3)}%`;
const rem = (n) => `${+n.toFixed(3)}rem`;

/** The geometry of one drawn segment, from its move: a 1 px line, horizontal or vertical. */
function box(spec, m) {
    const horizontal = m.y1 === m.y2;
    if (horizontal) {
        const x = Math.min(m.x1, m.x2);
        const y = m.y1 === spec.h ? `calc(${rem(m.y1)} - 1px)` : rem(m.y1);
        return `left:${pct(x)};width:${pct(Math.abs(m.x2 - m.x1))};top:${y};height:1px`;
    }
    const x = m.x1 === 100 ? `calc(100% - 1px)` : pct(m.x1);
    return `left:${x};width:1px;top:${rem(Math.min(m.y1, m.y2))};height:${rem(Math.abs(m.y2 - m.y1))}`;
}

/**
 * One waiting component: its words, its places (two ticks each), its readings
 * (hidden while the route runs), the segments the pen draws for the option on
 * show, and the one pen. The scene's `data-bw-loading` picks the route.
 */
export function skeleton(kind, route) {
    const spec = SPECS[kind];
    const moves = ROUTES[route](spec);
    const segs = moves
        .filter((m) => m.down)
        .map((m, n) => `<i class="bw-sk__g${m.lead ? ' bw-sk__g--lead' : ''}" data-s="${n}" style="${box(spec, m)}" aria-hidden="true"></i>`)
        .join('');
    return `<div class="bw-sk bw-plate" data-bw-sk="${kind}" data-bw-route="${route}" style="--bw-skh: ${rem(spec.h)}" aria-busy="true"><span class="bw-frame" aria-hidden="true"></span>
        ${spec.statics.map((s) => `<span class="bw-sk__s bw-label" style="left:${pct(s.x)};top:${rem(s.y)}">${s.t}</span>`).join('')}
        ${spec.rules.map((y) => `<span class="bw-sk__rule" style="top:${rem(y)}" aria-hidden="true"></span>`).join('')}
        ${spec.places.map((p) => `<span class="bw-sk__p" style="left:${pct(p.x0)};width:${pct(p.x1 - p.x0)};top:calc(${rem(p.y)} - 0.2rem)" aria-hidden="true"></span>`).join('')}
        ${spec.places
            .map(
                (p) =>
                    `<span class="bw-sk__v${p.big ? ' bw-sk__v--big' : ''}" style="left:${pct(p.x0)};max-width:${pct(p.x1 - p.x0)};top:calc(${rem(p.y)} - ${p.big ? '1.75rem' : '1.2rem'})">${p.v}</span>`,
            )
            .join('')}
        ${segs}${pen(true)}</div>`;
}

/** The four components, as the loading scene lays them out. */
export const SKELETON_KINDS = ['table', 'card', 'form', 'strip'];
export const skeletonLabel = (kind) => SPECS[kind].label;

/* ------------------------------------------------------------ the keyframes */

/** The length of a move in screen-ish units (a 360 px wide component), a travel at three times the speed. */
const lengthOf = (m) => (Math.abs(m.x2 - m.x1) * 3.6 + Math.abs(m.y2 - m.y1) * 16) / (m.down ? 1 : 3) + (m.down ? 0 : 14);

/** Times in % of the loop for each move, from 0.6 to just before the end of the route. */
function timed(moves) {
    const total = moves.reduce((sum, m) => sum + lengthOf(m), 0);
    const room = ROUTE_END - 0.6 - 0.6;
    let at = 0.6;
    return moves.map((m) => {
        const span = (lengthOf(m) / total) * room;
        const t = { ...m, t0: at, t1: at + span };
        at += span;
        return t;
    });
}

const hidden = (m) => {
    if (m.x1 === m.x2) return m.y2 > m.y1 ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)';
    return m.x2 > m.x1 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)';
};

/**
 * Generates the whole loading stylesheet: for every option and component the
 * pen's route, every segment's drawing, and the readings' inking. Written
 * under `prefers-reduced-motion: no-preference` and in `@layer kp.signature`;
 * the reduced pose (the readings inked, no marks, no pen) needs no rule: it is
 * the base style.
 */
export function loadingCss() {
    const loop = 'calc(var(--bw-loop) * var(--bw-slow, 1))';
    let css = `@layer kp.signature { @media (prefers-reduced-motion: no-preference) {
@keyframes bw-lv { 0%, ${(ROUTE_END - 0.1).toFixed(3)}% { visibility: hidden; } ${ROUTE_END.toFixed(3)}%, ${RESET.toFixed(3)}% { visibility: visible; } ${(RESET + 0.1).toFixed(3)}%, 100% { visibility: hidden; } }
`;
    for (const route of LOADING_ROUTES) {
        for (const kind of SKELETON_KINDS) {
            const spec = SPECS[kind];
            const moves = timed(ROUTES[route](spec));
            const scope = `.bw-scene[data-bw-loading='${route}'] .bw-sk[data-bw-sk='${kind}']`;
            const name = `bw-l-${route}-${kind}`;
            // The pen: a keyframe at every boundary (position), and the nib held steady inside each move.
            let pen = `@keyframes ${name}-pen {\n`;
            const first = moves[0];
            pen += `0% { visibility: hidden; --bw-px: ${first.x1 / 100}; --bw-py: 0; --bw-ox: 0px; --bw-oy: ${rem(first.y1)}; --bw-nib: 0; }\n`;
            pen += `${pct(first.t0 - 0.05)} { visibility: visible; --bw-nib: 0; }\n`;
            moves.forEach((m, i) => {
                pen += `${pct(m.t0)} { --bw-px: ${m.x1 / 100}; --bw-py: 0; --bw-ox: 0px; --bw-oy: ${rem(m.y1)}; animation-timing-function: ${FEED}; }\n`;
                pen += `${pct(Math.min(m.t0 + 0.25, m.t1 - 0.05))} { --bw-nib: ${m.down ? 1 : 0}; }\n`;
                pen += `${pct(Math.max(m.t1 - 0.25, m.t0 + 0.05))} { --bw-nib: ${m.down ? 1 : 0}; }\n`;
                if (i === moves.length - 1) pen += `${pct(m.t1)} { --bw-px: ${m.x2 / 100}; --bw-py: 0; --bw-ox: 0px; --bw-oy: ${rem(m.y2)}; }\n`;
            });
            const end = moves[moves.length - 1];
            pen += `${pct(end.t1 + 0.7)} { --bw-nib: 0; }\n${pct(end.t1 + 1.4)}, 100% { visibility: hidden; --bw-nib: 0; --bw-px: ${end.x2 / 100}; --bw-oy: ${rem(end.y2)}; }\n}\n`;
            css += pen;
            css += `${scope} .bw-pen { animation: ${name}-pen ${loop} linear infinite; }\n`;
            css += `${scope} .bw-sk__v { animation: bw-lv ${loop} linear infinite; }\n`;
            // The segments the pen draws, each from its move's own offsets.
            let n = 0;
            for (const m of moves) {
                if (!m.down) continue;
                css += `@keyframes ${name}-${n} {
0% { visibility: hidden; clip-path: ${hidden(m)}; }
${pct(m.t0)} { visibility: visible; clip-path: ${hidden(m)}; animation-timing-function: ${FEED}; }
${pct(m.t1)} { clip-path: inset(0); }
${LIFT.toFixed(3)}% { visibility: visible; clip-path: inset(0); }
${(LIFT + 0.1).toFixed(3)}%, 100% { visibility: hidden; clip-path: inset(0); }
}
${scope} .bw-sk__g[data-s='${n}'] { animation: ${name}-${n} ${loop} linear infinite; }\n`;
                n += 1;
            }
        }
    }
    return `${css}} }\n`;
}
