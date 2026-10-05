// research/character-trend: the fifth component of the character round
// (Kenny, form v18, 2026-10-05): the key figure with its 24-hour trend
// (`.kp-kpi--trend`), two characters per theme drawn in the theme's own
// world, beside the plain tile of today, all 22 themes in one demo judged
// through the review kit.
//
// The tiles are the package's own: attachTrendCharts() (js/chart.js) draws
// the trend, its crosshair, its chip and its axis, and keeps every behaviour
// (the pointer, the keys, a click that follows the tile's link, the live
// update). Each character is CSS only, in trends.css, scoped by
// `[data-theme]` and the column's `[data-tr]`; this file only says what each
// one is, gives the tiles their readings, sets the states, and runs the
// speed. js/chart.js and js/kpi.js are not changed.

import { attachTrendCharts, setTrendData } from '../../js/chart.js';
import { THEMES } from '../../js/theme-registry.js';

/** @param {string} an @param {string} at @param {string} bn @param {string} bt */
const two = (an, at, bn, bt) => ({ a: { name: an, text: at }, b: { name: bn, text: bt } });

/**
 * The two characters per theme: a name and what each part becomes.
 * @type {Record<string, { a: { name: string, text: string }, b: { name: string, text: string } }>}
 */
const IDEAS = {
    formal: two(
        'The engraved plate',
        'A brass-plate engraving on paper: a ruled double frame, the label in the serif’s small capitals, the number in the display serif, the line engraved as a fine rule with no wash under it, the change boxed like an engraved figure. Loading is a still dotted leader; nothing moves.',
        'The annual report',
        'A key figure from a printed annual report: a heavy rule above the label, the number large in the display serif, the line over ledger rules with a ruled baseline, the axis in small capitals, the change in italics on its own plate. Still while loading: the ledger rules alone.',
    ),
    light: two(
        'The soft card',
        'A white card lifted on a soft shadow, a wider radius, the line soft and round-capped over a fuller wash, the change as a soft pill. Loading: a still dashed baseline.',
        'Daylight',
        'A pale sky over the line, from the primary wash at the top to the card at the foot, the sun as a warm glow in the corner, the change as a pill. Loading: a slow band of daylight crosses the sky.',
    ),
    dark: two(
        'The status board',
        'A black operations board: the number lit in ticker mono, the plot a dark well with a fine grid, the line lit with a soft glow, the change as a lit square chip. Still while loading.',
        'The machined panel',
        'A machined black panel with a fine bevel: the label in mono capitals, the line in a recessed slot (an inner shadow above, a lit lip below), the change as a flat machined tab. Still while loading.',
    ),
    cyberpunk: two(
        'The neon trace',
        'A neon trace on a black board with a faint circuit grid: the line a neon tube with its glow, the number in tech mono with a cyan halo, cut corners on the frame, the change as a cut-corner chip. Loading: a packet runs along the baseline.',
        'The glitch HUD',
        'A netrunner HUD: yellow brackets at the corners of the plot, the number with an RGB split, the line a square-capped data stream, hazard tape along the top edge. Loading: a glitch bar jumps across the plot.',
    ),
    synthwave: two(
        'The grid-floor horizon',
        'The plot is a perspective grid floor under a pink horizon, the line a sunset laser with its glow, the number in VT323, the change on a glass chip. Loading: the grid floor drives toward you.',
        'The VCR display',
        'A VCR’s on-screen display on black: OSD numerals, scanlines over the tile, the line a hard square trace, the change as an inverse block. Loading: the tracking band rolls down the plot.',
    ),
    pastel: two(
        'The sticker chart',
        'A candy card with a flat sticker shadow: the line fat and round-capped like icing, the change as a sticker with its own flat shadow, the number in the rounded face. Loading: a candy dot hops along the plot.',
        'The washi planner',
        'A dotted planner pad with a strip of washi tape across the top of the tile, the line a dashed doodle, the change as a taped label. Loading: the tape drifts.',
    ),
    terminal: two(
        'The top(1) row',
        'A text screen framed in a double box-drawing line: everything in the mono, the label in capitals, the line square-joined in the phosphor, the change in reverse video. Loading: a block caret blinks in the plot, once a second.',
        'The dumb-terminal plot',
        'gnuplot’s dumb terminal: the plot a grid of character cells, the line drawn in dots like a row of asterisks, the axis in brackets of rules, the change underlined. Loading: the dots march.',
    ),
    forest: two(
        'The ranger’s logbook',
        'A ranger’s logbook on kraft paper: the label in serif italic, contour rings behind the line, the line a moss trail with round caps, the change on a wooden tag. Loading: a trail of light walks the plot.',
        'The canopy',
        'Looking up into a canopy: a leaf-green wash on the card, the area under the line a dense canopy, the line a twig in bark ink, the change on a leaf tag. Loading: the canopy sways.',
    ),
    'high-contrast': two(
        'Ink and frame',
        'Everything framed in a 2px rule: the number bold, the line 3px with no wash, a solid baseline under it, the change as a framed plate with its own ink. Still: nothing moves.',
        'The inverse plate',
        'The plot inverted: an ink plate with the line drawn in the paper colour, the label bold, the number heavy, the change framed. Still: nothing moves.',
    ),
    sepia: two(
        'The barograph',
        'A barograph drum: the plot is ruled chart paper (fine level lines and hour lines in sepia), the line a fine nib trace, an aged vignette on the paper. Loading: the nib sweeps across the drum.',
        'Letterpress',
        'A letterpress card on speckled paper: the number pressed into the sheet, the label in small capitals, the line a heavier ink rule, the change as a printed border. Loading: the platen presses.',
    ),
    blueprint: two(
        'The chart recorder',
        'A strip-chart recorder on blueprint paper: a millimetre grid in the plot, the line in white ink, the label and the axis in technical mono capitals. Loading: the recorder’s pen sweeps.',
        'The title block',
        'A drawing’s title block: the tile parted into cells by drawn rules, the axis with dimension ticks, the line as a chain line over a hatched area. Loading: a dash marches along the baseline.',
    ),
    solstice: two(
        'The low sun',
        'Charcoal paper lit from below by a low sun: a warm glow rising from the foot of the tile, the line in warm light, the change on a glowing chip. Loading: a dawn breathes in the plot.',
        'The embers',
        'Embers on charcoal: the line a glowing coal with a hot halo, the wash a faint heat, the number in the serif. Loading: the embers breathe.',
    ),
    brutalism: two(
        'The slab',
        'A concrete slab: a heavy black frame with a hard offset shadow, the label in heavy capitals, the line 3px square-capped, the change as a block with the hard shadow. Loading: the slab stamps.',
        'The sticker sheet',
        'A lavender sticker sheet: the number huge and heavy, the change as an askew sticker in a black outline, the plot a white well in black. Loading: the sticker drops in.',
    ),
    deco: two(
        'The gilt frame',
        'A gilt frame on lacquer: a double gold rule, a faint sunburst rising behind the number, the label and the number in the display face’s capitals, the change on a gold-framed plaque. Loading: a glint runs across.',
        'The marquee',
        'A theatre marquee: a row of bulbs along the top and the foot of the plot, the number in display capitals, the change as a marquee plaque. Loading: the bulbs chase.',
    ),
    phantom: two(
        'The evidence card',
        'A white evidence card pinned to the board: the label slanted, the line as red string, the change as a stamped ring set askew. Loading: the stamp beats.',
        'The calling card',
        'A black calling card under a halftone: the label skewed in display capitals, a red slash across the corner, the line in the card’s ink. Loading: the halftone shuffles.',
    ),
    'shade-light': two(
        'Pencil in the shade',
        'A pencil sketch on paper in soft shade: the plot hatched in pencil, the line a soft graphite stroke, the change on a lifted paper chip. Loading: the hatching sweeps in.',
        'The leaf shade',
        'Dappled leaf shade over the card, a soft line, the number on the paper. Loading: a cloud’s shade passes.',
    ),
    'shade-dark': two(
        'Silverpoint',
        'Silverpoint on dark paper: the line a silver hairline over a faint silver wash, a silver rule above the label. Loading: the silver hatches in.',
        'The reading lamp',
        'A warm reading lamp over the card: a pool of light behind the number, the line in warm ink. Loading: the pool breathes.',
    ),
    retro: two(
        'The 1995 dialog',
        'A 1995 dialog: a raised grey bevel around the tile, the plot a sunken white well, one-pixel line with no wash, the label in the system face without capitals, the change as a raised button. Still while loading.',
        'The performance monitor',
        'A 1995 performance monitor: a black well with a green grid, the line in the phosphor, the number in the mono. Still while loading.',
    ),
    grotesk: two(
        'The transit board',
        'A Swiss transit board: a thick bar in the series colour across the top, the number in bold grotesque, the line 3px round-capped, the change as a flat colour bar. Loading: a line runs across.',
        'The Swiss poster',
        'A Swiss poster: the number huge and flush left, the line a hairline, the change in the red index colour on its own plate. Loading: three blocks cut in.',
    ),
    lapis: two(
        'The girih tile',
        'A girih lattice on lapis: a faint star lattice on the tile, a double gold frame, the number in the display face, the line in gold. Loading: a glint runs the frame.',
        'Lapis on vellum',
        'Lapis ink on ivory vellum: the line in lapis ink, a gold rim around the plot, the label in serif italic. Loading: a burnisher’s glint.',
    ),
    nostromo: two(
        'The CRT trace',
        'A green-black CRT in the beige bezel: scanlines over the plot, the line a phosphor trace with its glow, the label and the number in mono capitals. Loading: a sweep runs across the tube.',
        'The indicator panel',
        'The ship’s indicator panel: the label on embossed label tape, the change as a lit indicator lamp, the plot an embossed window. Loading: the lamps scan.',
    ),
    titanium: two(
        'The milled plate',
        'A milled titanium plate: a brushed grain on the tile, the plot ringed in an anodised edge, the label in small capitals, the number in instrument mono. Loading: the cutter runs along the edge.',
        'The instrument dial',
        'An instrument dial: the plot a recessed aperture with an inner shadow, a knurled band along the top of the tile, the change on a machined tab. Loading: the knurl rolls.',
    ),
};

const LABEL = Object.fromEntries(THEMES.map((t) => [t.name, t.label]));

/* ------------------------------------------------- the review kit's text */

// Read by ../_review/review.js when it loads, which is after this module:
// one choice per theme, the two characters' names and parts as its hints.
const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="trend"]'));
const hints = (/** @type {'a' | 'b'} */ which) =>
    Object.fromEntries(Object.entries(IDEAS).map(([theme, t]) => [theme, `${t[which].name}. ${t[which].text}`]));
section.setAttribute(
    'data-review-choices',
    JSON.stringify([
        {
            id: 'trend',
            label: 'The trend tile for this theme',
            options: [
                { value: 'a', label: 'Character 1', hints: hints('a') },
                { value: 'b', label: 'Character 2', hints: hints('b') },
                {
                    value: 'plain',
                    label: 'The plain tile, as today',
                    hint: 'Keep the package trend tile in this theme: the same shape as everywhere, in the theme’s colours.',
                },
            ],
        },
    ]),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
const lower = (/** @type {string} */ name) => name.replace(/^(The|A) /, (m) => m.toLowerCase());
for (const [theme, t] of Object.entries(IDEAS)) {
    const p = document.createElement('p');
    p.setAttribute('data-for', theme);
    p.textContent =
        `Character 1 is ${lower(t.a.name)}, character 2 ${lower(t.b.name)}; the third column is the plain tile of today. ` +
        'Look at the plate, the label, the number, the change, the line and its wash, and the axis, then move the pointer over a trend: the chip reads one point. ' +
        'Press Loading, Nothing to draw and Could not read: the tile keeps its height. Try a long label, a wide value, the warning tone and the live update.';
    look.append(p);
}

/* --------------------------------------------------------- the readings */

// Pump house 1, 24 hours of readings every ten minutes up to a fixed now:
// 20/10/2026 14:40 in Brussels (12:40 UTC), the same on every load.
const MINUTE = 60_000;
const STEP = 10 * MINUTE;
const DAY = 24 * 60 * MINUTE;
let clock = Date.UTC(2026, 9, 20, 12, 40);

/** Noise from the time alone. @param {number} t @param {number} k */
const noise = (t, k) => {
    const v = Math.sin((t / MINUTE) * 12.9898 + k * 78.233) * 43758.5453;
    return v - Math.floor(v) - 0.5;
};
/** The network's demand at `t` on the Brussels clock: a morning and an evening peak. @param {number} t */
const demand = (t) => {
    const h = (((t / 3_600_000 + 2) % 24) + 24) % 24;
    return 0.55 + 0.4 * Math.exp(-((h - 7.5) ** 2) / 3) + 0.3 * Math.exp(-((h - 19) ** 2) / 4) - 0.25 * Math.exp(-((h - 3.5) ** 2) / 5);
};

/**
 * @typedef {{ label: string, note: string, unit?: string, unitKind?: import('../../js/chart.js').ChartUnitKind, digits: number,
 *   context: string, at: (t: number) => number, from?: () => number, until?: () => number, one?: boolean,
 *   tone?: 'warning', upIs: 'good' | 'bad' }} Figure
 */
/** @type {Record<string, Figure>} */
const FIGURES = {
    pressure: {
        label: 'Pressure',
        note: 'avg 15 min',
        unit: 'bar',
        digits: 2,
        context: 'two pumps',
        upIs: 'good',
        at: (t) => 3.6 - 0.6 * demand(t) + 0.04 * noise(t, 1),
    },
    long: {
        label: 'Pressure, far end of the ring',
        note: 'avg 15 min',
        unit: 'bar',
        digits: 2,
        context: 'Pleinstraat',
        upIs: 'good',
        at: (t) => 2.9 - 0.7 * demand(t) + 0.05 * noise(t, 5),
    },
    wide: {
        label: 'Water delivered this year',
        note: 'total',
        unit: 'm³',
        digits: 0,
        context: 'since 01/01/2026',
        upIs: 'good',
        at: (t) => Math.round(12_400_000 + ((t - Date.UTC(2026, 9, 19, 12, 40)) / STEP) * 550 * demand(t)),
    },
    stopped: {
        label: 'Flow into the network',
        note: 'avg 15 min',
        unit: 'm³/h',
        digits: 0,
        context: 'no reading for 40 min',
        upIs: 'good',
        at: (t) => 420 * demand(t) + 12 * noise(t, 2),
        until: () => clock - 40 * MINUTE,
    },
    today: {
        label: 'Reservoir South',
        note: 'avg 15 min',
        unitKind: 'percent',
        digits: 0,
        context: 'measured since 07:00',
        upIs: 'good',
        at: (t) => 72 - 9 * demand(t) + noise(t, 3),
        from: () => clock - 460 * MINUTE,
    },
    one: {
        label: 'Reservoir East',
        note: 'avg 15 min',
        unitKind: 'percent',
        digits: 0,
        context: 'measured since 14:30',
        upIs: 'good',
        at: () => 71,
        one: true,
    },
    warning: {
        label: 'Pump temperature',
        note: 'hottest pump',
        unitKind: 'celsius',
        digits: 0,
        context: 'limit 60 °C',
        upIs: 'bad',
        tone: 'warning',
        at: (t) => 47 + 11 * demand(t) + noise(t, 4),
    },
};

/** @param {Figure} f @returns {[number, number][]} */
const pointsOf = (f) => {
    if (f.one) return [[clock - STEP, f.at(clock)]];
    const end = Math.min(clock, f.until?.() ?? Infinity);
    const start = f.from?.() ?? clock - DAY;
    /** @type {[number, number][]} */
    const points = [];
    for (let t = start; t <= end; t += STEP) points.push([t, Number(f.at(t).toFixed(f.digits))]);
    return points;
};
const number = (/** @type {Figure} */ f, /** @type {number} */ v) =>
    v.toLocaleString('en-GB', { minimumFractionDigits: f.digits, maximumFractionDigits: f.digits });
const unitOf = (/** @type {Figure} */ f) => (f.unitKind === 'percent' ? '%' : f.unitKind === 'celsius' ? '°C' : (f.unit ?? ''));
const print = (/** @type {Figure} */ f, /** @type {number} */ v) => (f.unitKind === 'percent' ? `${number(f, v)}%` : `${number(f, v)} ${unitOf(f)}`);

const WORDS = {
    empty: 'nothing to draw yet: the sensor has sent no reading',
    error: 'could not read: the readings store did not answer',
};

const state = {
    shown: /** @type {'ready' | 'loading' | 'empty' | 'error'} */ ('ready'),
    figure: 'pressure',
};

const tiles = () => /** @type {HTMLElement[]} */ ([...section.querySelectorAll('[data-tr-tile]')]);

/** @param {HTMLElement} el @param {string} width @param {string} [height] */
const skeleton = (el, width, height) => {
    const s = document.createElement('span');
    s.className = 'kp-skeleton';
    s.style.inlineSize = width;
    if (height) s.style.setProperty('--kp-skeleton-height', height);
    el.replaceChildren(s);
};

function draw() {
    const f = FIGURES[state.figure];
    for (const tile of tiles()) {
        const figure = /** @type {HTMLElement} */ (tile.querySelector('.kp-kpi__chart'));
        const value = /** @type {HTMLElement} */ (tile.querySelector('.kp-kpi__value'));
        const words = /** @type {HTMLElement} */ (tile.querySelector('.kp-kpi__trend'));
        const name = tile.querySelector('[data-tr-name-of-figure]');
        const note = tile.querySelector('.kp-kpi__label-note');
        const link = tile.querySelector('.kp-kpi__link');
        if (name) name.textContent = f.label;
        if (note) note.textContent = f.note;
        link?.setAttribute('title', `Open ${f.label} on Charts`);
        figure.setAttribute('aria-label', `${f.label}, last 24 hours`);
        if (f.tone) tile.setAttribute('data-kp-tone', f.tone);
        else tile.removeAttribute('data-kp-tone');
        if (state.shown === 'loading') {
            skeleton(value, '3ch', '1.75rem');
            skeleton(words, '80%');
            setTrendData(figure, null);
            continue;
        }
        if (state.shown !== 'ready') {
            value.textContent = '—';
            words.textContent = WORDS[state.shown];
            setTrendData(figure, { points: [], step: STEP, unit: f.unit, unitKind: f.unitKind, digits: f.digits });
            continue;
        }
        const points = pointsOf(f);
        const last = points[points.length - 1][1];
        value.textContent = number(f, last);
        const unit = unitOf(f);
        if (unit) value.append(Object.assign(document.createElement('small'), { textContent: unit }));
        // The change over the last hour, its tone by what a rise means here.
        const hourAgo = points.length > 6 ? points[points.length - 7][1] : null;
        const parts = /** @type {(string | Node)[]} */ ([]);
        if (hourAgo != null && last !== hourAgo) {
            const up = last > hourAgo;
            const delta = document.createElement('span');
            delta.className = 'kp-kpi__delta';
            delta.setAttribute('data-kp-direction', up ? 'up' : 'down');
            delta.setAttribute('data-kp-tone', up === (f.upIs === 'good') ? 'good' : 'bad');
            delta.textContent = print(f, Math.abs(last - hourAgo));
            parts.push(delta, ' in the hour · ');
        }
        const peak = Math.max(...points.map((p) => p[1]));
        parts.push(points.length > 1 ? `peak ${print(f, peak)} · ${f.context}` : `one reading · ${f.context}`);
        words.replaceChildren(...parts);
        setTrendData(figure, { points, step: STEP, unit: f.unit, unitKind: f.unitKind, digits: f.digits });
    }
}

const pressed = (/** @type {string} */ attr, /** @type {string} */ value) => {
    for (const b of section.querySelectorAll(`[${attr}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attr) === value));
};

for (const b of section.querySelectorAll('[data-tr-state]'))
    b.addEventListener('click', () => {
        state.shown = /** @type {typeof state.shown} */ (b.getAttribute('data-tr-state') ?? 'ready');
        pressed('data-tr-state', state.shown);
        draw();
    });

for (const b of section.querySelectorAll('[data-tr-data]'))
    b.addEventListener('click', () => {
        state.figure = b.getAttribute('data-tr-data') ?? 'pressure';
        pressed('data-tr-data', state.figure);
        draw();
    });

// A live update: ten minutes later, one more reading at the end and the
// oldest gone; a point being read stays at its moment.
section.querySelector('[data-tr-live]')?.addEventListener('click', () => {
    clock += STEP;
    state.shown = 'ready';
    pressed('data-tr-state', 'ready');
    draw();
});

// The links go nowhere on this page: say where they would go.
const log = section.querySelector('[data-tr-log]');
section.addEventListener('click', (event) => {
    const link = event.target instanceof Element ? event.target.closest('.kp-kpi__link') : null;
    if (!link) return;
    event.preventDefault();
    if (log) log.textContent = `Opened: ${link.getAttribute('title')}.`;
});

attachTrendCharts(section, { now: () => clock });
draw();

/* ------------------------------------------------- the theme's words */

function showTheme() {
    const theme = document.documentElement.getAttribute('data-theme') ?? 'formal';
    for (const el of document.querySelectorAll('[data-tr-theme-name]')) el.textContent = LABEL[theme] ?? theme;
    // On the page, only this theme's look-at line; the dialog reads them all.
    for (const p of look.querySelectorAll('[data-for]')) /** @type {HTMLElement} */ (p).hidden = p.getAttribute('data-for') !== theme;
    const t = IDEAS[theme];
    for (const which of /** @type {const} */ (['a', 'b'])) {
        const name = document.querySelector(`[data-tr-name="${which}"]`);
        const desc = document.querySelector(`[data-tr-desc="${which}"]`);
        if (name) name.textContent = t ? t[which].name : '';
        if (desc) desc.textContent = t ? t[which].text : '';
    }
}
showTheme();
new MutationObserver(showTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
/* ------------------------------------------------------------- speed */

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced()) document.querySelector('[data-tr-motion]')?.removeAttribute('hidden');

// Every CSS animation on the page plays at the picked rate, as on
// research/character-meter; full speed by default, since a loop is judged at
// its own pace.
let rate = 1;
try {
    const kept = Number(localStorage.getItem('tr-speed'));
    if (kept > 0) rate = kept;
} catch {
    // No storage: full speed.
}
const slowNow = () => {
    for (const a of document.getAnimations()) if (a.playbackRate !== rate) a.playbackRate = rate;
};
const slowEachFrame = () => {
    slowNow();
    requestAnimationFrame(slowEachFrame);
};
document.addEventListener('animationstart', slowNow, { capture: true });
requestAnimationFrame(slowEachFrame);
const speedButtons = [...document.querySelectorAll('[data-tr-speed]')];
const showSpeed = () => {
    for (const b of speedButtons) b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-tr-speed')) === rate));
};
for (const b of speedButtons)
    b.addEventListener('click', () => {
        rate = Number(b.getAttribute('data-tr-speed'));
        try {
            localStorage.setItem('tr-speed', String(rate));
        } catch {
            // Not remembered; it still applies now.
        }
        showSpeed();
    });
showSpeed();

/* ----------------------------------------------------- the pick shown */

// What is ticked in the review dialog is what the page marks.
section.addEventListener('review:choice', (event) => {
    const { value } = /** @type {CustomEvent<{ id: string, value: string }>} */ (event).detail;
    for (const col of section.querySelectorAll('[data-tr-pick]')) col.classList.toggle('tr-picked', col.getAttribute('data-tr-pick') === value);
});
new MutationObserver(() => {
    // A pick for one theme says nothing about the next.
    for (const col of document.querySelectorAll('.tr-picked')) col.classList.remove('tr-picked');
}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
