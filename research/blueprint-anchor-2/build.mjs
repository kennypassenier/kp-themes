// research/blueprint-anchor-2: writes art.js (the six drawings) and options.css
// (their poses and motion) from one description of each pen route.
//
//   node research/blueprint-anchor-2/build.mjs
//
// Why a generator: every option is a pen that walks a route (a gantry rail
// that follows the pen's height, a carriage that follows its position, a nib
// that is down or up, ink that is exactly where the pen has been). Written by
// hand that is a few hundred keyframes per option that must agree with each
// other to the pixel; written from the route they cannot disagree.
//
// One timeline for all six, T = 2880 ms (18 units of the register's 160 ms).
// Every part's finished pose is its base style (so reduced motion shows the
// finished picture) and its first keyframe is written out for `gap`. The
// leave is the same keyframes backwards (`animation-direction: reverse`).

import { writeFileSync } from 'node:fs';

const OUT = new URL('.', import.meta.url);
const UNITS = 18;
const r = (v, d = 2) => +v.toFixed(d);
const pct = (u) => r((u * 100) / UNITS, 3);
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const xy = (p) => `${r(p[0])}px ${r(p[1])}px`;
const FEED = 'var(--ba2-feed)';

/* G1's trapezoid, `linear(0, 0.031 10%, 0.125 20%, 0.875 80%, 0.969 90%, 1)`, and its inverse. */
const KNOTS = [
    [0, 0],
    [0.1, 0.031],
    [0.2, 0.125],
    [0.8, 0.875],
    [0.9, 0.969],
    [1, 1],
];
const feedAt = (x) => {
    for (let i = 0; i < KNOTS.length - 1; i++) {
        const [x0, y0] = KNOTS[i];
        const [x1, y1] = KNOTS[i + 1];
        if (x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
    }
    return 1;
};
const feedInv = (y) => {
    for (let i = 0; i < KNOTS.length - 1; i++) {
        const [x0, y0] = KNOTS[i];
        const [x1, y1] = KNOTS[i + 1];
        if (y <= y1) return x0 + ((y - y0) / (y1 - y0)) * (x1 - x0);
    }
    return 1;
};

/* ------------------------------------------------------------------ scene */

class Scene {
    constructor(key, short) {
        this.key = key;
        this.short = short;
        this.svg = [];
        this.defs = [];
        this.tracks = new Map();
    }
    cls(name) {
        return `ba2-${this.short}-${name}`;
    }
    add(markup) {
        this.svg.push(markup);
    }
    /** Stops are `{ u | pct, p: { prop: value }, e }`; `e` shapes the interval that starts at the stop. */
    track(cls, stops) {
        const norm = stops.map((s) => ({ at: s.pct ?? pct(s.u), p: { ...s.p }, e: s.e })).sort((a, b) => a.at - b.at);
        const out = [];
        for (const s of norm) {
            const last = out[out.length - 1];
            if (last && last.at === s.at) {
                last.p = { ...last.p, ...s.p };
                if (s.e) last.e = s.e;
            } else out.push(s);
        }
        if (out[0].at !== 0) throw new Error(`${cls}: a track starts at 0`);
        const keys = Object.keys(out[0].p).sort().join();
        for (const s of out) if (Object.keys(s.p).sort().join() !== keys) throw new Error(`${cls}: every stop names the same properties`);
        this.tracks.set(cls, out);
    }
    render() {
        const defs = this.defs.length ? `<defs>${this.defs.join('')}</defs>` : '';
        return defs + this.svg.join('\n        ');
    }
    css() {
        const decl = (p) =>
            Object.entries(p)
                .map(([k, v]) => `${k}: ${v};`)
                .join(' ');
        const base = [];
        const gap = [];
        const kfs = [];
        for (const [cls, stops] of this.tracks) {
            base.push(`    .ba2-scene .${cls} {\n        --ba2-k: ${cls};\n        ${decl(stops[stops.length - 1].p)}\n    }`);
            gap.push(`    .ba2-scene[data-ba2-phase='gap'] .${cls} {\n        ${decl(stops[0].p)}\n    }`);
            const body = stops
                .map((s) => `        ${s.at}% {\n            ${decl(s.p)}${s.e ? `\n            animation-timing-function: ${s.e};` : ''}\n        }`)
                .join('\n');
            kfs.push(`    @keyframes ${cls} {\n${body}\n    }`);
        }
        return { base: base.join('\n\n'), gap: gap.join('\n\n'), kfs: kfs.join('\n\n') };
    }
}

/* ------------------------------------------------------------- the pen */

/** The gantry rail and the carriage, drawn as in round one so the family reads as one. */
function penMarkup(S, id, rail = 'M40 -2.5H440M40 2.5H440') {
    return `<path class="ba2-p ba2-ln ba2-steel ${S.cls(id + '-rail')}" d="${rail}"/>
        <g class="ba2-p ${S.cls(id + '-car')}">
            <rect class="ba2-fill-ground" x="-8" y="-8" width="16" height="16"/>
            <rect class="ba2-ln ba2-steel" x="-8" y="-8" width="16" height="16"/>
            <path class="ba2-ln ba2-steel" d="M-13 0H-3M3 0H13M0 -13V-3M0 3V13"/>
            <circle class="ba2-p ba2-nib ${S.cls(id + '-nib')}" r="3.5"/>
        </g>`;
}

/**
 * Walks the pen through `moves` and writes every track that follows from it:
 * carriage, rail, nib and the ink of each stroke. Time per stroke is its
 * length over `vd` (pen down) or `vh` (pen up), at least `minU`, shared by
 * its segments in proportion to their length; the feed ramps at every vertex.
 *
 *   { k: 'draw', pts, cls, tag? }   pen down along pts (pts[0] is where the pen is)
 *   { k: 'hop', to, u? }            pen up
 *   { k: 'at', u }                  wait until u
 *   { k: 'wait', u }                wait u units
 */
function penRoute(S, id, { start, t0 = 1, vd, vh, minU = 0.3, moves, ramp = 0.12 }) {
    const car = [{ u: 0, p: { translate: xy(start) } }];
    const rail = [{ u: 0, p: { translate: `0 ${r(start[1])}px` } }];
    const nib = [{ u: 0, p: { 'fill-opacity': 0 } }];
    const log = [];
    let t = t0;
    let pos = start;
    let down = false;
    let strokes = 0;
    const stop = (u, pt, e) => {
        car.push({ u, p: { translate: xy(pt) }, e });
        rail.push({ u, p: { translate: `0 ${r(pt[1])}px` }, e });
    };
    stop(t, pos);
    const setNib = (to, at, dur) => {
        if (to === down) return;
        const w = Math.min(ramp, dur * 0.4);
        nib.push({ u: at, p: { 'fill-opacity': down ? 1 : 0 } });
        nib.push({ u: at + w, p: { 'fill-opacity': to ? 1 : 0 } });
        down = to;
    };
    for (const m of moves) {
        if (m.k === 'at') {
            if (m.u < t - 1e-9) throw new Error(`${S.key}: pen is late for u=${m.u} (at ${r(t)})`);
            t = m.u;
            continue;
        }
        if (m.k === 'wait') {
            t += m.u;
            continue;
        }
        const pts = m.k === 'hop' ? [pos, m.to] : m.pts;
        if (dist(pts[0], pos) > 0.01) throw new Error(`${S.key}: stroke starts at ${pts[0]}, pen is at ${pos}`);
        const lens = pts.slice(1).map((p, i) => dist(pts[i], p));
        const total = lens.reduce((a, b) => a + b, 0);
        const dur = m.u ?? Math.max(minU, total / (m.k === 'hop' ? vh : vd));
        const t1 = t + dur;
        setNib(m.k === 'draw', t, dur);
        const times = [t];
        let acc = t;
        lens.forEach((l, i) => {
            acc = i === lens.length - 1 ? t1 : acc + (dur * l) / total;
            times.push(acc);
        });
        stop(t, pts[0], FEED);
        times.slice(1).forEach((u, i) => stop(u, pts[i + 1], i < lens.length - 1 ? FEED : undefined));
        if (m.k === 'draw') {
            strokes += 1;
            const name = `s${strokes}`;
            const d = `M${pts.map((p) => `${r(p[0])} ${r(p[1])}`).join('L')}`;
            S.add(`<path class="ba2-p ba2-ln ba2-draw ${m.cls} ${S.cls(id + '-' + name)}" pathLength="1" stroke-linejoin="round" d="${d}"/>`);
            const ink = [
                { u: 0, p: { 'stroke-dashoffset': 1 } },
                { u: t, p: { 'stroke-dashoffset': 1 }, e: FEED },
            ];
            let cum = 0;
            lens.forEach((l, i) => {
                cum += l;
                ink.push({ u: times[i + 1], p: { 'stroke-dashoffset': r(1 - cum / total, 4) }, e: i < lens.length - 1 ? FEED : undefined });
            });
            S.track(S.cls(id + '-' + name), ink);
        }
        log.push({ ...m, from: pos, to: pts[pts.length - 1], t0: t, t1 });
        pos = pts[pts.length - 1];
        t = t1;
    }
    stop(t, pos);
    setNib(false, t, 1);
    S.track(S.cls(id + '-car'), car);
    S.track(S.cls(id + '-rail'), rail);
    S.track(S.cls(id + '-nib'), nib);
    return { end: t, log, pos };
}

/** An opacity track: away until `from`, shown from `to`. */
function fade(S, name, from, to) {
    S.track(S.cls(name), [
        { u: 0, p: { opacity: 0 } },
        { u: from, p: { opacity: 0 } },
        { u: to, p: { opacity: 1 } },
    ]);
}

/** A column of readings behind a fixed window that steps from one to the next at the given times. */
function odometer(S, name, steps, step) {
    // steps: [{ t0, t1 }] one per change; the column moves up by `step` px in each
    const stops = [{ u: 0, p: { translate: '0px 0px' } }];
    steps.forEach((s, i) => {
        stops.push({ u: s.t0, p: { translate: `0px ${-step * i}px` }, e: FEED });
        stops.push({ u: s.t1, p: { translate: `0px ${-step * (i + 1)}px` } });
    });
    S.track(S.cls(name), stops);
}

/* ═══ 1 · The pen that dimensions ════════════════════════════════════════ */

function dimension() {
    const S = new Scene('dimension', 'dm');
    const X1 = 150;
    const X2 = 330;
    const DY = 142; // the dimension line
    const EY0 = 112; // extension lines, from the part's foot (6 clear) to past the dimension line
    const EY1 = 148;
    const park = [432, 30];
    // The part being measured stands on the sheet, in the steel's thin line.
    S.add(`<rect class="ba2-part-line" x="${X1}" y="50" width="${X2 - X1}" height="56"/>`);
    S.add(`<circle class="ba2-part-line" cx="240" cy="78" r="10"/>`);
    S.add(`<path class="ba2-part-line" d="M226 78H254M240 64V92"/>`);
    // Single-stroke lettering, 11 x 17, as the pen writes it.
    const GLYPH = {
        2: [
            [0, 4],
            [2, 1],
            [5.5, 0],
            [9, 1],
            [11, 4],
            [10, 8],
            [0, 17],
            [11, 17],
        ],
        4: [
            [8, 17],
            [8, 0],
            [0, 12],
            [11, 12],
        ],
        0: [
            [3, 0],
            [8, 0],
            [11, 4],
            [11, 13],
            [8, 17],
            [3, 17],
            [0, 13],
            [0, 4],
            [3, 0],
        ],
    };
    const letters = [];
    [...'240'].forEach((ch, i) => {
        const pts = GLYPH[ch].map(([x, y]) => [217 + i * 17 + x, 114 + y]);
        letters.push({ k: 'hop', to: pts[0] }, { k: 'draw', pts, cls: 'ba2-note ba2-bold ba2-round' });
    });
    const tick = (x) => [
        [x - 5, DY + 5],
        [x + 5, DY - 5],
    ];
    penRoute(S, 'pen', {
        start: [X1, EY0],
        vd: 45,
        vh: 90,
        moves: [
            {
                k: 'draw',
                pts: [
                    [X1, EY0],
                    [X1, EY1],
                ],
                cls: 'ba2-pen',
            },
            { k: 'hop', to: tick(X1)[0] },
            { k: 'draw', pts: tick(X1), cls: 'ba2-pen ba2-bold ba2-round' },
            { k: 'hop', to: [X1, DY] },
            {
                k: 'draw',
                pts: [
                    [X1, DY],
                    [X2, DY],
                ],
                cls: 'ba2-pen',
            },
            { k: 'hop', to: tick(X2)[0] },
            { k: 'draw', pts: tick(X2), cls: 'ba2-pen ba2-bold ba2-round' },
            { k: 'hop', to: [X2, EY0] },
            {
                k: 'draw',
                pts: [
                    [X2, EY0],
                    [X2, EY1],
                ],
                cls: 'ba2-pen',
            },
            ...letters,
            { k: 'hop', to: park },
        ],
    });
    S.add(penMarkup(S, 'pen'));
    return S;
}

/* ═══ 2 · The plotter pen, unchanged (round one's option 2) ═══════════════ */

function plotter() {
    const S = new Scene('plotter', 'pl');
    S.defs.push(`<pattern id="ba2-g-__U__" width="10" height="10" patternUnits="userSpaceOnUse"><path class="ba2-mm" d="M10 0H0V10"/></pattern>`);
    S.add(`<rect x="70" y="40" width="350" height="140" fill="url(#ba2-g-__U__)"/>`);
    S.add(`<path class="ba2-p ba2-ln ba2-steel ${S.cls('rail')}" d="M40 -2.5H440M40 2.5H440"/>`);
    S.add(
        `<path class="ba2-p ba2-ln ba2-bold ba2-pen ba2-draw ${S.cls('line')}" pathLength="1" stroke-linejoin="round" d="M80 138L140 112L190 126L250 84L310 98L400 54"/>`,
    );
    S.add(`<path class="ba2-p ba2-ln ba2-pen ba2-draw ${S.cls('mark')}" pathLength="1" d="M405 54A5 5 0 1 1 395 54A5 5 0 1 1 405 54"/>`);
    S.add(`<path class="ba2-p ba2-ln ba2-note ba2-draw ${S.cls('leader')}" pathLength="1" d="M400 54L432 30"/>`);
    S.add(`<text class="ba2-p ba2-note-text ${S.cls('label')}" x="438" y="34">412 KN</text>`);
    S.add(`<g class="ba2-p ${S.cls('car')}">
            <rect class="ba2-fill-ground" x="-8" y="-8" width="16" height="16"/>
            <rect class="ba2-ln ba2-steel" x="-8" y="-8" width="16" height="16"/>
            <path class="ba2-ln ba2-steel" d="M-13 0H-3M3 0H13M0 -13V-3M0 3V13"/>
            <circle class="ba2-p ba2-nib ${S.cls('nib')}" r="3.5"/>
        </g>`);
    // Round one's keyframes, percent for percent.
    const V = [5.556, 16.897, 25.903, 38.606, 49.292, 66.667];
    const OFF = [1, 0.8144, 0.667, 0.4592, 0.2843, 0];
    const pts = [
        [80, 138],
        [140, 112],
        [190, 126],
        [250, 84],
        [310, 98],
        [400, 54],
    ];
    const ink = [{ pct: 0, p: { 'stroke-dashoffset': 1 } }];
    const car = [{ pct: 0, p: { translate: xy(pts[0]) } }];
    const rail = [{ pct: 0, p: { translate: `0 ${pts[0][1]}px` } }];
    V.forEach((at, i) => {
        const last = i === V.length - 1;
        ink.push({ pct: at, p: { 'stroke-dashoffset': OFF[i] }, e: last ? undefined : FEED });
        car.push({ pct: at, p: { translate: xy(pts[i]) }, e: last ? undefined : FEED });
        rail.push({ pct: at, p: { translate: `0 ${pts[i][1]}px` }, e: last ? undefined : FEED });
    });
    car.push({ pct: 72.222, p: { translate: xy(pts[5]) }, e: FEED }, { pct: 77.778, p: { translate: xy([432, 30]) } });
    rail.push({ pct: 72.222, p: { translate: '0 54px' }, e: FEED }, { pct: 77.778, p: { translate: '0 30px' } });
    S.track(S.cls('line'), ink);
    S.track(S.cls('car'), car);
    S.track(S.cls('rail'), rail);
    S.track(S.cls('nib'), [
        { pct: 0, p: { 'fill-opacity': 0 } },
        { pct: 5.556, p: { 'fill-opacity': 1 } },
        { pct: 77.778, p: { 'fill-opacity': 1 } },
        { pct: 83.333, p: { 'fill-opacity': 0 } },
    ]);
    S.track(S.cls('mark'), [
        { pct: 0, p: { 'stroke-dashoffset': 1 } },
        { pct: 66.667, p: { 'stroke-dashoffset': 1 }, e: FEED },
        { pct: 72.222, p: { 'stroke-dashoffset': 0 } },
    ]);
    S.track(S.cls('leader'), [
        { pct: 0, p: { 'stroke-dashoffset': 1 } },
        { pct: 72.222, p: { 'stroke-dashoffset': 1 }, e: FEED },
        { pct: 77.778, p: { 'stroke-dashoffset': 0 } },
    ]);
    S.track(S.cls('label'), [
        { pct: 0, p: { opacity: 0 } },
        { pct: 83.333, p: { opacity: 0 } },
        { pct: 100, p: { opacity: 1 } },
    ]);
    return S;
}

/* ═══ 3 · The pen on the straightedge ════════════════════════════════════ */

function straightedge() {
    const S = new Scene('straightedge', 'sx');
    const Y = [62, 82, 102, 122, 142]; // the rulings: the working edge of the blade stops on each
    const XL = 170;
    const XR = 310;
    const BX0 = 124; // blade start (after the head)
    const BX1 = 424;
    const MX = 104; // the margin scale
    const park = [414, Y[4]];
    // The margin: a scale along the board's edge with a tick every 10, a long one every 20.
    let scale = `M${MX} 40V160`;
    for (let y = 40; y <= 160; y += 10) scale += `M${MX - (y % 20 === 0 ? 8 : 5)} ${y}H${MX}`;
    S.add(`<path class="ba2-ln ba2-steel" d="${scale}"/>`);
    // The sheet's ruled zone: four corner brackets, no frame.
    const br = (x, y, sx, sy) => `M${x} ${y + sy * 8}V${y}H${x + sx * 8}`;
    S.add(`<path class="ba2-ln ba2-steel" d="${br(156, 46, 1, 1)}${br(324, 46, -1, 1)}${br(324, 154, -1, -1)}${br(156, 154, 1, -1)}"/>`);
    // The readout in the margin: the distance ruled so far, a window on a column of figures.
    S.add(`<text class="ba2-note-text" x="30" y="80">DIST</text>`);
    const col = [20, 40, 60, 80, 100]
        .map((v, i) => `<text class="ba2-note-text" x="30" y="${101 + 16 * i}">${String(v).padStart(3, '0')}</text>`)
        .join('');
    S.add(`<g class="ba2-sx-win"><g class="ba2-p ${S.cls('odo')}">${col}</g></g>`);
    S.add(`<text x="60" y="101">MM</text>`);
    // The rulings, then the straightedge over them, then the pen.
    let blade = `M${BX0 + 10} -10v3`;
    for (let x = BX0 + 10; x <= BX1 - 10; x += 10) blade += `M${x} -10v${(x - BX0 - 10) % 50 === 0 ? 5 : 3}`;
    const bladeMarkup = `<g class="ba2-p ${S.cls('blade')}">
            <rect class="ba2-fill-ground" x="${MX + 4}" y="-24" width="16" height="32"/>
            <rect class="ba2-ln ba2-steel" x="${MX + 4}" y="-24" width="16" height="32"/>
            <rect class="ba2-fill-ground" x="${BX0}" y="-10" width="${BX1 - BX0}" height="10"/>
            <path class="ba2-ln ba2-steel" d="M${BX0} -10H${BX1}V0H${BX0}${blade}"/>
        </g>`;
    S.add(bladeMarkup);
    const moves = [];
    Y.forEach((y, i) => {
        const pts =
            i % 2 === 0
                ? [
                      [XL, y],
                      [XR, y],
                  ]
                : [
                      [XR, y],
                      [XL, y],
                  ];
        moves.push({ k: 'draw', pts, cls: 'ba2-pen' });
        if (i < Y.length - 1) moves.push({ k: 'hop', to: [pts[1][0], Y[i + 1]], u: 0.45, tag: 'slide' });
    });
    moves.push({ k: 'hop', to: park });
    // penRoute writes the carriage and the rail; the straightedge is the rail here.
    const route = penRoute(S, 'pen', { start: [XL, Y[0]], vd: 60, vh: 100, moves });
    S.add(`<g class="ba2-p ${S.cls('pen-car')}">
            <rect class="ba2-fill-ground" x="-8" y="-8" width="16" height="16"/>
            <rect class="ba2-ln ba2-steel" x="-8" y="-8" width="16" height="16"/>
            <path class="ba2-ln ba2-steel" d="M-13 0H-3M3 0H13M0 -13V-3M0 3V13"/>
            <circle class="ba2-p ba2-nib ${S.cls('pen-nib')}" r="3.5"/>
        </g>`);
    // The straightedge follows the rail's stops.
    S.tracks.set(S.cls('blade'), S.tracks.get(S.cls('pen-rail')));
    S.tracks.delete(S.cls('pen-rail'));
    odometer(
        S,
        'odo',
        route.log.filter((m) => m.tag === 'slide'),
        16,
    );
    return S;
}

/* ═══ 4 · The dividers ═══════════════════════════════════════════════════ */

function dividers() {
    const S = new Scene('dividers', 'dv');
    const BY = 150;
    const SP = 60; // the span the dividers are set to
    const X = (k) => 60 + SP * k;
    const L = 72; // leg length
    const H0 = Math.sqrt(L * L - (SP / 2) ** 2);
    const LIFT = 12;
    const STEPS = 5;
    const SEC = 1.9; // one step, units
    const T1 = 1;
    const park = [432, 30];
    const PENUP = BY - 8;
    const PENDN = BY + 8;
    S.add(`<path class="ba2-ln ba2-steel" d="M48 ${BY}H432"/>`);
    // The count: how many ticks are inked.
    S.add(`<text class="ba2-note-text" x="60" y="52">STEPS</text>`);
    const col = Array.from({ length: 8 }, (_, i) => `<text class="ba2-note-text" x="106" y="${52 + 16 * i}">${i}</text>`).join('');
    S.add(`<g class="ba2-dv-win"><g class="ba2-p ${S.cls('odo')}">${col}</g></g>`);
    S.add(`<text x="122" y="52">× 60 MM</text>`);
    // The inked ticks (the pen, below).
    // The dividers: a hinge and a handle, two legs, one fade for the whole instrument.
    S.add(`<g class="ba2-p ${S.cls('inst')}">
            <g class="ba2-p ${S.cls('legA')}"><path class="ba2-ln ba2-bold ba2-steel" d="M0 0V${L}"/><path class="ba2-ln ba2-bold ba2-pen" d="M0 ${L - 10}V${L}"/></g>
            <g class="ba2-p ${S.cls('legB')}"><path class="ba2-ln ba2-bold ba2-steel" d="M0 0V${L}"/><path class="ba2-ln ba2-bold ba2-pen" d="M0 ${L - 10}V${L}"/></g>
            <g class="ba2-p ${S.cls('apex')}">
                <rect class="ba2-fill-ground" x="-3" y="-24" width="6" height="18"/>
                <rect class="ba2-ln ba2-steel" x="-3" y="-24" width="6" height="18"/>
                <circle class="ba2-fill-ground" r="4"/>
                <circle class="ba2-ln ba2-steel" r="4"/>
            </g>
        </g>`);
    // The legs, sampled eight times a step at the plotter's feed.
    const tips = (j, p) => {
        // step j: the free leg crosses from X(j-1) to X(j+1) over the planted one at X(j)
        const freeA = j % 2 === 1;
        const free = [X(j - 1) + 2 * SP * p, BY - LIFT * Math.sin(Math.PI * p)];
        const planted = [X(j), BY];
        return freeA ? { A: free, B: planted } : { A: planted, B: free };
    };
    const leg = (tip, apex) => {
        const dx = tip[0] - apex[0];
        const dy = tip[1] - apex[1];
        return { translate: xy(apex), rotate: `${r((Math.atan2(-dx, dy) * 180) / Math.PI, 3)}deg`, scale: `1 ${r(Math.hypot(dx, dy) / L, 4)}` };
    };
    const A = [];
    const B = [];
    const AP = [];
    const pose = (t, j, p) => {
        const { A: a, B: b } = tips(j, p);
        const apex = [(a[0] + b[0]) / 2, BY - (H0 + 5 * Math.sin(Math.PI * p))];
        A.push({ u: t, p: leg(a, apex) });
        B.push({ u: t, p: leg(b, apex) });
        AP.push({ u: t, p: { translate: xy(apex) } });
    };
    pose(0, 1, 0);
    pose(T1, 1, 0);
    const N = 8;
    for (let j = 1; j <= STEPS; j++) {
        for (let i = 1; i <= N; i++) pose(T1 + (j - 1) * SEC + SEC * feedInv(i / N), j, i / N);
    }
    S.track(S.cls('legA'), A);
    S.track(S.cls('legB'), B);
    S.track(S.cls('apex'), AP);
    const T2 = T1 + STEPS * SEC; // the dividers are lifted away
    S.track(S.cls('inst'), [
        { u: 0, p: { opacity: 0 } },
        { u: 0.6, p: { opacity: 1 } },
        { u: T2, p: { opacity: 1 } },
        { u: T2 + 0.9, p: { opacity: 0 } },
    ]);
    // The pen follows one step behind and inks each tick the dividers have pricked.
    const moves = [];
    const inkTick = (k) => {
        moves.push(
            { k: 'hop', to: [X(k), PENUP] },
            {
                k: 'draw',
                pts: [
                    [X(k), PENUP],
                    [X(k), PENDN],
                ],
                cls: 'ba2-pen ba2-bold',
                tag: 'tick',
            },
        );
    };
    for (let j = 1; j <= STEPS; j++) {
        moves.push({ k: 'at', u: T1 + (j - 1) * SEC + 0.7 });
        inkTick(j - 1);
    }
    moves.push({ k: 'at', u: T2 + 0.6 });
    inkTick(STEPS);
    inkTick(STEPS + 1);
    moves.push({ k: 'hop', to: park });
    const route = penRoute(S, 'pen', { start: [30, PENUP], vd: 40, vh: 100, moves, t0: 0 });
    S.add(penMarkup(S, 'pen', 'M20 -2.5H460M20 2.5H460'));
    const ticks = route.log.filter((m) => m.tag === 'tick');
    odometer(
        S,
        'odo',
        ticks.map((m) => ({ t0: m.t1 - 0.05, t1: m.t1 + 0.2 })),
        16,
    );
    return S;
}

/* ═══ 5 · The hatching pen ═══════════════════════════════════════════════ */

function hatching() {
    const S = new Scene('hatching', 'ht');
    const C = [240, 92];
    const R = 54;
    const D = 12; // perpendicular distance between strokes
    const park = [432, 30];
    S.add(`<circle class="ba2-ln ba2-steel" cx="${C[0]}" cy="${C[1]}" r="${R}"/>`);
    S.add(
        `<path class="ba2-ln ba2-steel" d="M${C[0] - R - 14} ${C[1]}H${C[0] - R + 6}M${C[0] + R - 6} ${C[1]}H${C[0] + R + 14}M${C[0]} ${C[1] - R - 14}V${C[1] - R + 6}M${C[0]} ${C[1] + R - 6}V${C[1] + R + 14}" style="stroke: hsl(from var(--ba2-line) h s l / 0.5)"/>`,
    );
    S.add(`<text class="ba2-p ba2-note-text ${S.cls('label')}" x="240" y="174" text-anchor="middle">SECTION A–A</text>`);
    const k = Math.floor(R / D);
    const strokes = [];
    for (let m = -k; m <= k; m++) {
        const half = Math.sqrt(R * R - (m * D) ** 2);
        const cx = C[0] + (m * D) / Math.SQRT2;
        const cy = C[1] + (m * D) / Math.SQRT2;
        const dx = half / Math.SQRT2;
        const bl = [cx - dx, cy + dx];
        const tr = [cx + dx, cy - dx];
        strokes.push((m + k) % 2 === 0 ? [bl, tr] : [tr, bl]);
    }
    const moves = [];
    strokes.forEach((pts, i) => {
        if (i > 0) moves.push({ k: 'hop', to: pts[0] });
        moves.push({ k: 'draw', pts, cls: 'ba2-pen' });
    });
    moves.push({ k: 'hop', to: park });
    penRoute(S, 'pen', { start: strokes[0][0], vd: 75, vh: 70, moves, minU: 0.28 });
    S.add(penMarkup(S, 'pen'));
    fade(S, 'label', 14.5, 17.5);
    return S;
}

/* ═══ 6 · The tracing pen ════════════════════════════════════════════════ */

function tracing() {
    const S = new Scene('tracing', 'tr');
    const OX = 96;
    const OY = 154;
    const W = 300;
    const Hh = 120;
    const XMAX = 10;
    const YMAX = 150;
    const px = (x) => OX + (x / XMAX) * W;
    const py = (v) => OY - (v / YMAX) * Hh;
    const f = (x) => 100 * (1 - Math.exp(-0.5 * x) * Math.cos(1.1 * x));
    const park = [432, 30];
    // The graticule: a faint line at every division, the axes, their ticks and figures.
    let grid = '';
    for (let i = 1; i <= 10; i++) grid += `M${px(i)} ${OY}V${OY - Hh}`;
    for (let j = 1; j <= 6; j++) grid += `M${OX} ${OY - (Hh / 6) * j}H${OX + W}`;
    S.add(`<path class="ba2-mm" style="stroke-width: 0.8" d="${grid}"/>`);
    let axes = `M${OX} ${OY - Hh}V${OY}H${OX + W}`;
    for (let i = 0; i <= 10; i++) axes += `M${px(i)} ${OY}v${i % 5 === 0 ? 7 : 4}`;
    for (let j = 0; j <= 6; j++) axes += `M${OX} ${OY - (Hh / 6) * j}h${j % 3 === 0 ? -7 : -4}`;
    S.add(`<path class="ba2-ln ba2-steel" d="${axes}"/>`);
    S.add(`<g style="font-size: 10px"><text x="${px(0)}" y="${OY + 20}" text-anchor="middle">0</text><text x="${px(5)}" y="${OY + 20}" text-anchor="middle">5</text><text x="${px(10)}" y="${OY + 20}" text-anchor="middle">10</text>
        <text x="${OX - 12}" y="${OY + 3}" text-anchor="end">0</text><text x="${OX - 12}" y="${py(75) + 3}" text-anchor="end">75</text><text x="${OX - 12}" y="${py(150) + 3}" text-anchor="end">150</text></g>`);
    // The curve, sampled finely; the pen, its ink, the pointers and the witness lines share the samples.
    const N = 56;
    const pts = Array.from({ length: N + 1 }, (_, i) => {
        const x = (XMAX * i) / N;
        return [px(x), py(f(x))];
    });
    const lens = pts.slice(1).map((p, i) => dist(pts[i], p));
    const total = lens.reduce((a, b) => a + b, 0);
    const T0 = 1;
    const dur = total / 42;
    let cum = 0;
    const times = [T0];
    const frac = [0];
    lens.forEach((l) => {
        cum += l;
        frac.push(cum / total);
        times.push(T0 + dur * feedInv(cum / total));
    });
    const tEnd = T0 + dur;
    S.add(
        `<path class="ba2-p ba2-ln ba2-bold ba2-pen ba2-draw ${S.cls('ink')}" pathLength="1" stroke-linejoin="round" d="M${pts.map((p) => `${r(p[0])} ${r(p[1])}`).join('L')}"/>`,
    );
    // Witness lines from the pen to both axes, and a pointer on each: the measuring.
    S.add(`<path class="ba2-p ba2-ln ba2-note ba2-nse ${S.cls('wv')}" d="M0 0V-1"/>`);
    S.add(`<path class="ba2-p ba2-ln ba2-note ba2-nse ${S.cls('wh')}" d="M0 0H1"/>`);
    S.add(`<path class="ba2-p ba2-fill-note ${S.cls('px')}" d="M0 ${OY + 2}L-4 ${OY + 10}H4Z"/>`);
    S.add(`<path class="ba2-p ba2-fill-note ${S.cls('py')}" d="M${OX - 2} 0L${OX - 10} -4V4Z"/>`);
    S.add(`<text class="ba2-p ba2-note-text ${S.cls('label')}" x="${r(pts[N][0] + 8)}" y="${r(pts[N][1] - 8)}">${r(f(XMAX), 1)}</text>`);
    const ease = (u, p) => ({ u, p });
    /** One stop per sample, the first pose held from 0 to the pen's start. */
    const sampled = (fn) => [ease(0, fn(pts[0])), ...pts.map((p, i) => ease(times[i], fn(p)))];
    S.track(S.cls('ink'), [ease(0, { 'stroke-dashoffset': 1 }), ...pts.map((_, i) => ease(times[i], { 'stroke-dashoffset': r(1 - frac[i], 4) }))]);
    S.track(
        S.cls('wv'),
        sampled((p) => ({ translate: `${r(p[0])}px ${OY}px`, scale: `1 ${r(OY - p[1], 2)}` })),
    );
    S.track(
        S.cls('wh'),
        sampled((p) => ({ translate: `${OX}px ${r(p[1])}px`, scale: `${r(p[0] - OX, 2)} 1` })),
    );
    S.track(
        S.cls('px'),
        sampled((p) => ({ translate: `${r(p[0])}px 0px` })),
    );
    S.track(
        S.cls('py'),
        sampled((p) => ({ translate: `0px ${r(p[1])}px` })),
    );
    // The pen itself is a track of the same samples (its own stops, not penRoute's).
    S.track(S.cls('pen-car'), [
        ease(0, { translate: xy(pts[0]) }),
        ...pts.map((p, i) => ease(times[i], { translate: xy(p) })),
        ease(tEnd + 0.6, { translate: xy(park) }),
    ]);
    S.track(S.cls('pen-rail'), [
        ease(0, { translate: `0 ${r(pts[0][1])}px` }),
        ...pts.map((p, i) => ease(times[i], { translate: `0 ${r(p[1])}px` })),
        ease(tEnd + 0.6, { translate: `0 ${park[1]}px` }),
    ]);
    S.track(S.cls('pen-nib'), [
        ease(0, { 'fill-opacity': 0 }),
        ease(T0, { 'fill-opacity': 0 }),
        ease(T0 + 0.12, { 'fill-opacity': 1 }),
        ease(tEnd, { 'fill-opacity': 1 }),
        ease(tEnd + 0.12, { 'fill-opacity': 0 }),
    ]);
    fade(S, 'label', 14.5, 17.5);
    S.add(penMarkup(S, 'pen'));
    // The route above is sampled, so the pen's first and last poses are the curve's ends and the park.
    S.end = tEnd + 0.6;
    return S;
}

const HEAD = `/* research/blueprint-anchor-2: round two of what anchors blueprint. Six pens,
   every drawing and every motion, in the theme's signature layer. Generated by
   build.mjs from the pen routes; edit the generator, not this file.

   Each option is one inline SVG (viewBox 480 x 200) on a stage, scoped by the
   stage's own attribute ('.ba2-scene[data-ba2-anchor='<key>']'); colours come
   from the theme's tokens only.

   One timeline for all six: T = 2880 ms (18 units of the register's 160 ms).
   The leave is the same keyframes on the same duration played backwards
   ('animation-direction: reverse'), so every frame of the leave is a frame of
   the arrival, last in, first out.

   The stage's clock (demo.js) writes 'data-ba2-phase' on every stage: 'gap'
   (everything away), 'in' (the forward run), 'hold' (the finished picture),
   'out' (the same run backwards). The base style of every part is its FINISHED
   pose, so 'hold' needs no animation and the reduced-motion pose is the
   finished picture. Every animation sits under
   'prefers-reduced-motion: no-preference'.

   The review dialog moves the section out of the page into its stage, so every
   rule and custom property here hangs on '.ba2-scene', never on the page. The
   plotter's feed (G1) is written once as '--ba2-feed'. */

@layer kp.signature {
    .ba2-scene {
        --ba2-pen: var(--primary);
        --ba2-note: var(--accent);
        --ba2-line: var(--border-strong);
        --ba2-ink: var(--foreground);
        --ba2-ground: var(--background);
        /* G1: the stepper plotter's trapezoid: a fifth to reach the feed, three fifths at it, a fifth to stop. */
        --ba2-feed: linear(0, 0.031 10%, 0.125 20%, 0.875 80%, 0.969 90%, 1);
        --ba2-T: 2880ms;

        display: grid;
        place-items: center;
        box-sizing: border-box;
        min-block-size: 15rem;
        padding: 1.25rem;
        /* The ruled sheet the instruments stand on (the register's own texture); no frame. */
        background-color: var(--background);
        background-image: var(--fx-texture);
        background-size: var(--fx-texture-size);
    }

    .ba2-lineup .ba2-scene {
        min-block-size: 0;
        padding: 0.5rem;
    }

    .ba2-scene .ba2-part {
        display: grid;
        inline-size: 100%;
        place-items: center;
    }

    .ba2-scene .ba2-art {
        display: block;
        inline-size: 100%;
        max-inline-size: 36rem;
        block-size: auto;
        overflow: visible;
    }

    /* ── What every drawing is made of ───────────────────────────────── */

    .ba2-scene .ba2-ln {
        fill: none;
        stroke-width: 1.5;
    }

    .ba2-scene .ba2-bold {
        stroke-width: 2;
    }

    .ba2-scene .ba2-round {
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .ba2-scene .ba2-pen {
        stroke: var(--ba2-pen);
    }

    .ba2-scene .ba2-steel {
        stroke: var(--ba2-line);
    }

    .ba2-scene .ba2-note {
        stroke: var(--ba2-note);
    }

    .ba2-scene .ba2-fill-note {
        fill: var(--ba2-note);
        stroke: none;
    }

    .ba2-scene .ba2-fill-ground {
        fill: var(--ba2-ground);
        stroke: none;
    }

    /* The part a pen measures or fills: the steel's thin line, half strength. */
    .ba2-scene .ba2-part-line {
        fill: none;
        stroke: hsl(from var(--ba2-line) h s l / 0.55);
        stroke-width: 1.5;
    }

    /* G15: the draughtsman's lettering, mono capitals sloped 15 degrees. */
    .ba2-scene .ba2-art text {
        fill: var(--ba2-ink);
        font-family: var(--theme-font-mono);
        font-size: 11px;
        font-style: oblique 15deg;
        letter-spacing: 0.04em;
        text-transform: uppercase;
    }

    .ba2-scene .ba2-art text.ba2-note-text {
        fill: var(--ba2-note);
    }

    .ba2-scene .ba2-nib {
        fill: var(--ba2-pen);
        stroke: var(--ba2-pen);
        stroke-width: 1.5;
    }

    .ba2-scene .ba2-mm {
        fill: none;
        stroke: hsl(from var(--ba2-line) h s l / 0.3);
        stroke-width: 0.6;
    }

    /* A line drawn by the pen: one normalised length (pathLength 1), hidden by shifting the dash. */
    .ba2-scene .ba2-draw {
        stroke-dasharray: 1;
        stroke-dashoffset: 0;
    }

    /* A line stretched to a length (a witness line) keeps its stroke. */
    .ba2-scene .ba2-nse {
        vector-effect: non-scaling-stroke;
        stroke-width: 1;
    }

    /* The windows the readouts show one figure through. */
    .ba2-scene .ba2-sx-win {
        clip-path: inset(90px 422px 96px 26px) view-box;
    }

    .ba2-scene .ba2-dv-win {
        clip-path: inset(42px 360px 144px 104px) view-box;
    }

    /* ── One rule for every part ───────────────────────────────────────
       'in' and 'out' are the same keyframes, forward and backwards. They are
       never adjacent to one another: 'hold' and 'gap' carry no animation, so each
       run starts a fresh animation. 'hold' is the base style, the finished
       picture; 'gap' is written out below, the first frame of every part. */

    .ba2-scene .ba2-p {
        --ba2-k: none;
    }

    @media (prefers-reduced-motion: no-preference) {
        .ba2-scene[data-ba2-phase='in'] .ba2-p {
            animation: var(--ba2-k) calc(var(--ba2-T) * var(--ba2-slow, 1)) linear 0s 1 normal both;
        }

        .ba2-scene[data-ba2-phase='out'] .ba2-p {
            animation: var(--ba2-k) calc(var(--ba2-T) * var(--ba2-slow, 1)) linear 0s 1 reverse both;
        }
    }
`;

/* ------------------------------------------------------------- the output */

const SCENES = [dimension(), plotter(), straightedge(), dividers(), hatching(), tracing()];

writeFileSync(
    new URL('art.js', OUT),
    `// Generated by build.mjs from the pen routes; do not edit by hand.
/** The six drawings (viewBox 480 x 200). \`__U__\` is replaced by a unique number: the page holds each drawing twice. */
export const ART = {
${SCENES.map((S) => `    ${S.key}: \`${S.render()}\`,`).join('\n')}
};
`,
);

const head = HEAD;
const parts = SCENES.map((S) => ({ S, c: S.css() }));
const css = `${head}
${parts
    .map(
        ({ S, c }) => `    /* ═══ ${S.key} ═══ */

${c.base}

${c.gap}

${c.kfs}
`,
    )
    .join('\n')}}
`;
writeFileSync(new URL('options.css', OUT), css);

for (const S of SCENES) {
    const ends = [...S.tracks.values()].flatMap((t) => t.map((s) => s.at));
    console.log(
        S.key.padEnd(13),
        'tracks',
        String(S.tracks.size).padStart(3),
        'last motion at',
        r(Math.max(...ends.filter((a) => a < 100)) * 0.18, 2),
        'units',
    );
}
