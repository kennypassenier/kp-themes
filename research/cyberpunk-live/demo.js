// Cyberpunk's live update, round one (Kenny, 2026-10-07 01:32, rejecting
// cyberpunk's live update on research/families): "The glitch effect where
// one colour goes a bit to the right and up/down and another colour goes to
// the right and the opposite of the other, with neon colours".
//
// A chromatic split: the new value is written at once and stays on top,
// crisp; behind it two neon copies of it jump out, both to the right, one
// up and the other down, and come back. Six options of that one idea, each
// different at a glance in what Kenny can see: how far the copies go, in
// hard frames or slices or a smooth glide, with or without a scan line,
// which two of cyberpunk's own neons, how long, and how it settles.
//
// A review-kit demo in aspect mode, cyberpunk only, one aspect: each option
// is one card (`data-cl-option`) with every place a live update happens on
// a dashboard, built from the package's own components on cyberpunk's
// register. demo.css draws the six ideas, keyed on the card's
// `data-cl-fx`; this file writes the cards, and one clock changes the
// values: every changed value's wrapper (`.cl-v`) gets the new text, its
// copy in `data-cl-text`, and `data-cl-hit` while the split plays.
import { attachSparklines, drawSparkline } from '../../js/kpi.js';

/* ------------------------------------------------------------ the options */

/**
 * @typedef {{ fx: string, name: string, see: string, offset: string, frames: string, colours: [string, string, string, string], ms: number, settle: string, verdict: string }} Option
 * @type {Option[]}
 */
const OPTIONS = [
    {
        fx: 'snap',
        name: 'Split and snap',
        see: 'A cyan copy jumps a hair right and up, a violet one right and down, in three hard frames, then both snap back at once.',
        offset: '3–4 px',
        frames: 'three hard frames',
        colours: ['cyan', '--accent', 'violet', '--chart-4'],
        ms: 240,
        settle: 'snaps back in one frame',
        verdict:
            'Recommended: it is exactly the glitch you described, in cyberpunk’s own glitch pair (cyan and violet are the two copies of its headline’s slice burst), and it is the shortest, so a dashboard where ten values change at once stays calm.',
    },
    {
        fx: 'shove',
        name: 'Shove and spring',
        see: 'The copies are thrown far out (cyan right and up, red right and down) while the value recoils a step left; they slide home and spring a pixel past the middle before they rest.',
        offset: '10 px',
        frames: 'one smooth slide',
        colours: ['cyan', '--accent', 'red', '--chart-3'],
        ms: 420,
        settle: 'springs past the middle, then rests',
        verdict:
            'Not recommended: the red is the leave’s pair, but in cyberpunk red means something is wrong, and ten pixels crowd the neighbours in a dense strip or a table.',
    },
    {
        fx: 'tick',
        name: 'Count-down stutter',
        see: 'A yellow copy right and up, a cyan copy right and down, coming home in four visible ticks (6, 4, 2, 1 px), like a counter running out.',
        offset: '6 → 0 px',
        frames: 'four ticks',
        colours: ['yellow', '--primary', 'cyan', '--accent'],
        ms: 480,
        settle: 'ticks down to nothing',
        verdict: 'Not recommended: yellow is cyberpunk’s action colour, and four ticks on many values at once read as busy rather than updated.',
    },
    {
        fx: 'slice',
        name: 'Sliced copies',
        see: 'Each copy is cut to one band of the value: a violet band right and up, a yellow band right and down, jumping between three heights before they drop out.',
        offset: '5 px',
        frames: 'three slices',
        colours: ['violet', '--chart-4', 'yellow', '--primary'],
        ms: 360,
        settle: 'the slices drop out',
        verdict:
            'Not recommended: it is closest to the headline’s slice burst, but on a small figure (a table cell, a delta) a third of a line is a sliver, and it reads as noise more than as a split.',
    },
    {
        fx: 'scan',
        name: 'Scanline tear',
        see: 'A cyan copy right and up, a red copy right and down, while a cyan scan line runs down the value; above the line it is clean, below it still split, so it settles from the top down.',
        offset: '5 px',
        frames: 'one sweep, linear',
        colours: ['cyan', '--accent', 'red', '--chart-3'],
        ms: 600,
        settle: 'wiped clean from the top down',
        verdict:
            'Not recommended: the scan line is a third idea on top of the split, it takes twice as long as option 1, and on a one-line cell the beam is hard to see.',
    },
    {
        fx: 'glow',
        name: 'Afterglow',
        see: 'A violet copy right and up, a cyan one right and down, with a neon glow; they glide home easing out while the glow fades from the value.',
        offset: '7 px',
        frames: 'one smooth glide',
        colours: ['violet', '--chart-4', 'cyan', '--accent'],
        ms: 900,
        settle: 'glides home, the glow fades',
        verdict:
            'Not recommended: a soft ease and a glow are synthwave’s grammar more than cyberpunk’s (a signal that fires once and locks), and at 900 ms it is the slowest.',
    },
];

/* ------------------------------------------------------------- the places */

const SPARK = [
    3.36, 3.45, 3.44, 3.44, 3.45, 3.45, 3.44, 3.4, 3.35, 3.32, 3.35, 3.41, 3.44, 3.46, 3.44, 3.48, 3.55, 3.58, 3.55, 3.51, 3.38, 3.31, 3.3,
];

/** A value that changes: its key, read by the clock. */
const v = (/** @type {string} */ key, /** @type {string} */ text) => `<span class="cl-v" data-cl-key="${key}" data-cl-text="${text}">${text}</span>`;
const place = (/** @type {string} */ name, /** @type {string} */ html, cls = '') =>
    `<div class="cl-place ${cls}"><p class="cl-place__name">${name}</p>${html}</div>`;

const BOARD = () =>
    place(
        'Key figure',
        `<div class="kp-kpis cl-one"><div class="kp-kpi">
            <span class="kp-kpi__label">Flow now</span>
            <span class="kp-kpi__value">${v('flow', '412')}<small>m³/h</small></span>
            <span class="kp-kpi__trend"><span class="kp-kpi__delta" data-kp-direction="up" data-kp-tone="good">${v('delta', '6 %')}</span> on yesterday</span>
        </div></div>`,
    ) +
    place(
        'Trend tile',
        `<div class="kp-kpis cl-one"><div class="kp-kpi kp-kpi--trend">
            <span class="kp-kpi__label">Pressure <span class="kp-kpi__label-note">avg 15 min</span></span>
            <span class="kp-kpi__value">${v('pressure', '3.30')}<small>bar</small></span>
            <span class="kp-kpi__trend">peak 3.58 bar · two pumps</span>
            <svg class="kp-kpi__spark" data-cl-spark data-kp-spark="${SPARK.join(' ')}" aria-hidden="true"></svg>
        </div></div>`,
    ) +
    place(
        'Tiles',
        `<ul class="kp-tiles cl-tiles">
            <li class="kp-card"><h3 class="kp-card__title">Pump house 1</h3><p class="kp-card__body">Pressure ${v('tile', '4.2')} bar</p></li>
            <li class="kp-card"><h3 class="kp-card__title">Pump house 3</h3><p class="kp-card__body">Pressure 2.0 bar</p></li>
        </ul>`,
        'cl-place--wide',
    ) +
    place(
        'Columns (key-figure strip)',
        `<div class="kp-kpis cl-strip" role="group" aria-label="The northern network">
            <div class="kp-kpi"><span class="kp-kpi__label">Pressure</span><span class="kp-kpi__value">3.1<small>bar</small></span></div>
            <div class="kp-kpi"><span class="kp-kpi__label">Flow</span><span class="kp-kpi__value">${v('flow', '412')}<small>m³/h</small></span></div>
            <div class="kp-kpi"><span class="kp-kpi__label">Reservoir N</span><span class="kp-kpi__value">${v('reservoir', '71')}<small>%</small></span></div>
            <div class="kp-kpi"><span class="kp-kpi__label">Incidents</span><span class="kp-kpi__value">2</span></div>
        </div>`,
        'cl-place--full',
    ) +
    place(
        'State word',
        `<p class="kp-row cl-state"><b>Pump 1</b>
            <span class="kp-state-word" data-kp-words="Running&#10;Draining&#10;Starting">${v('state', 'Running')}</span>
            <button type="button" class="kp-button kp-button--sm">Stop</button></p>`,
    ) +
    place(
        'Table cell',
        `<div class="kp-table-wrap"><table class="kp-table cl-table">
            <thead><tr><th scope="col">Station</th><th scope="col" class="cl-num">Flow m³/h</th></tr></thead>
            <tbody>
                <tr><td>North 4</td><td class="cl-num">${v('cell', '128')}</td></tr>
                <tr><td>South 2</td><td class="cl-num">96</td></tr>
            </tbody>
        </table></div>`,
    );

/** The values every place steps through, one step per live update; a place not listed never changes. */
const VALUES = {
    flow: ['436', '398', '451', '412'],
    delta: ['12 %', '3 %', '15 %', '6 %'],
    pressure: ['3.36', '3.41', '3.28', '3.30'],
    tile: ['4.4', '4.1', '4.3', '4.2'],
    reservoir: ['72', '73', '72', '71'],
    state: ['Draining', 'Running', 'Starting', 'Running'],
    cell: ['131', '126', '133', '128'],
};

/* ---------------------------------------------------- the review kit's text */

const section = /** @type {HTMLElement} */ (document.querySelector('[data-review-item="live"]'));
section.setAttribute(
    'data-review-choices',
    JSON.stringify([
        {
            id: 'live',
            label: 'A live update in cyberpunk',
            options: OPTIONS.map((o, at) => ({
                value: String(at + 1),
                label: `${o.name}${at === 0 ? ' (recommended)' : ''}`,
                hint: `${o.see} ${o.offset}, ${o.frames}, ${o.colours[0]} and ${o.colours[2]}, ${o.ms} ms, ${o.settle}. ${o.verdict}`,
            })),
        },
    ]),
);

/* ---------------------------------------------------------------- the cards */

const row = /** @type {HTMLElement} */ (section.querySelector('[data-cl-aspect="live"]'));
OPTIONS.forEach((o, at) => {
    const card = document.createElement('article');
    card.className = 'cl-opt';
    card.setAttribute('data-cl-option', String(at + 1));
    card.setAttribute('data-cl-fx', o.fx);
    card.setAttribute('aria-labelledby', `cl-h-${o.fx}`);
    card.style.setProperty('--cl-up', `var(${o.colours[1]})`);
    card.style.setProperty('--cl-down', `var(${o.colours[3]})`);
    card.style.setProperty('--cl-ms', `${o.ms}ms`);
    card.innerHTML = `
        <header class="cl-opt__head">
            <h3 id="cl-h-${o.fx}"><span class="cl-opt__no">${at + 1}</span> <span data-cl-name></span></h3>
            ${at === 0 ? '<span class="cl-opt__rec">Recommended</span>' : ''}
        </header>
        <p class="cl-opt__see"></p>
        <dl class="cl-spec">
            <div><dt>Offset</dt><dd>${o.offset}</dd></div>
            <div><dt>Motion</dt><dd>${o.frames}</dd></div>
            <div><dt>Colours</dt><dd><span class="cl-swatch" style="--c: var(${o.colours[1]})"></span>${o.colours[0]} ↗
                <span class="cl-swatch" style="--c: var(${o.colours[3]})"></span>${o.colours[2]} ↘</dd></div>
            <div><dt>Time</dt><dd>${o.ms} ms</dd></div>
            <div><dt>Settles</dt><dd>${o.settle}</dd></div>
        </dl>
        <div class="cl-board">${BOARD()}</div>
        <p class="cl-opt__verdict"></p>`;
    /** @type {HTMLElement} */ (card.querySelector('[data-cl-name]')).textContent = o.name;
    /** @type {HTMLElement} */ (card.querySelector('.cl-opt__see')).textContent = o.see;
    const verdict = /** @type {HTMLElement} */ (card.querySelector('.cl-opt__verdict'));
    verdict.textContent = o.verdict;
    verdict.classList.toggle('cl-opt__verdict--rec', at === 0);
    row.append(card);
});
attachSparklines(row);

const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
const lookLine = document.createElement('p');
lookLine.setAttribute('data-for', 'cyberpunk');
lookLine.textContent =
    'Six ways to play your chromatic split on every place a value updates live. Watch a few updates per option (Z presses Live); the first is the recommendation. Pick the one that is cyberpunk to you, or None of these with a note.';
look.append(lookLine);

/* ------------------------------------------------------------- the clock */

const root = document.documentElement;
const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = /** @type {HTMLElement | null} */ (document.querySelector('[data-cl-motion-note]'));
let slow = 1;
let auto = true;
let step = 0;
let autoTimer = 0;
/** @type {Map<Element, number>} */
const clearing = new Map();

/** Whether the review dialog's Pause (Space) is on: then the clock stands still too. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);
/** Reduced motion: the reader's own setting, or the preview button. */
const reduced = () => reducedQuery.matches || root.getAttribute('data-cl-motion') === 'reduced';

/** One live update: every place's next value, written at once; the split plays on each value that changed. */
function liveUpdate() {
    const at = step % 4;
    step += 1;
    // Reads first, then writes, then one reflow for all: reading layout per
    // value between writes forced a full layout ~60 times per update, which
    // froze the page (Kenny, 2026-10-07 02:39: "alles reageert super traag").
    /** @type {{ el: Element, next: string, ms: number }[]} */
    const changed = [];
    /** @type {Map<Element, number>} */
    const msOf = new Map();
    for (const el of section.querySelectorAll('.cl-v')) {
        const key = /** @type {keyof typeof VALUES} */ (el.getAttribute('data-cl-key'));
        const next = VALUES[key]?.[at];
        if (!next || next === el.textContent) continue;
        const card = el.closest('.cl-opt');
        if (card && !msOf.has(card)) msOf.set(card, parseFloat(getComputedStyle(card).getPropertyValue('--cl-ms')) || 600);
        changed.push({ el, next, ms: reduced() ? 1200 : (card && msOf.get(card)) || 600 });
    }
    for (const { el, next } of changed) {
        el.textContent = next;
        el.setAttribute('data-cl-text', next);
        // A second update during the first starts it again from its first frame.
        el.removeAttribute('data-cl-hit');
    }
    if (changed.length) void section.offsetWidth;
    for (const { el, ms } of changed) {
        el.setAttribute('data-cl-hit', '');
        clearTimeout(clearing.get(el));
        clearing.set(
            el,
            window.setTimeout(() => el.removeAttribute('data-cl-hit'), (ms + 80) * slow),
        );
    }
    // The trend line takes its new point at once: the split is the value's.
    for (const svg of section.querySelectorAll('svg[data-cl-spark]')) {
        const values = (svg.getAttribute('data-kp-spark') || '').split(' ').map(Number).slice(1);
        values.push(Number(VALUES.pressure[at]));
        svg.setAttribute('data-kp-spark', values.join(' '));
        drawSparkline(/** @type {SVGSVGElement} */ (svg), values);
    }
}

/** Auto: a live update every few seconds, so each option is seen many times without a key. */
function run() {
    clearTimeout(autoTimer);
    if (!auto) return;
    autoTimer = window.setTimeout(() => {
        if (!dialogPaused()) liveUpdate();
        run();
    }, 2600 * slow);
}

/* --------------------------------------------------------------- controls */

/** A radio-like group: one pressed button. */
function radio(/** @type {string} */ attr, /** @type {(value: string) => void} */ apply) {
    const buttons = [...document.querySelectorAll(`[${attr}]`)];
    for (const b of buttons)
        b.addEventListener('click', () => {
            for (const other of buttons) other.setAttribute('aria-pressed', String(other === b));
            apply(b.getAttribute(attr) || '');
        });
}
document.querySelector('[data-cl-live]')?.addEventListener('click', () => {
    liveUpdate();
    run();
});
radio('data-cl-auto', (value) => {
    auto = value === 'on';
    run();
});
radio('data-cl-speed', (value) => {
    slow = 1 / (Number(value) || 1);
    root.style.setProperty('--cl-slow', String(slow));
    run();
});
radio('data-cl-motion', (value) => {
    if (value === 'reduced') root.setAttribute('data-cl-motion', 'reduced');
    else root.removeAttribute('data-cl-motion');
    syncMotion();
});

// The buttons and links in the places are scenery: a click does nothing.
row.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('.cl-board button, .cl-board a')) event.preventDefault();
});

function syncMotion() {
    if (motionNote) motionNote.hidden = !reducedQuery.matches;
}
reducedQuery.addEventListener('change', syncMotion);
syncMotion();
run();
