// What is the theme's anchor element (Kenny, 2026-10-07 18:13: every theme
// gets ONE recognisable anchor element, the thing every later decision of the
// theme departs from; forest: the tree progress bar, titanium: the anodising
// bath, cyberpunk: the glitch, grotesk: the red plate falling into register,
// synthwave: the page horizon; the colours are already right and are the
// shared base). Kenny, 2026-10-08: the same round for the nine themes that
// have no anchor yet, "6 to 10 bold, inventive candidates; safe fades get
// rejected".
//
// The engine is the one research/grotesk-anchor built (the clock, the three
// places, the review kit's text); the candidates are data in anchors.js, so
// the same file serves every theme's anchor demo. A review-kit demo in
// aspect mode, one theme only, ONE aspect (one page in the dialog), each
// OPTION a live scene with three places, so the reviewer sees whether the
// anchor carries the theme: the anchor in its own scene (centred, large),
// the same anchor as a progress bar, and as a button press. The first option
// is the recommendation.
//
// The page's one clock writes `data-an-phase` (gap, in, hold, out) on every
// scene; options.css keys every motion to it. The clock only writes
// attributes, it never reads layout; Replay restarts it, the speed buttons
// stretch every duration by 2 or 4, and the dialog's Pause stops it.

import { THEME, UNIT, QUESTION, WHY, LOOK, ANCHORS } from './anchors.js';

/* ---------------------------------------------------- the review kit's text */

const rec = (why) => `Recommended: this one, because ${why}`;
const not = (why) => `Not recommended, because ${why}`;

const section = /** @type {HTMLElement} */ (document.querySelector(`[data-review-item="${THEME}-anchor"]`));
section.setAttribute('data-an-show', 'all');
// Each hint repeats the question and says what the option shows and why it is or is not recommended: the dialog shows only the hint of the option on screen.
section.setAttribute(
    'data-review-choices',
    JSON.stringify([
        {
            id: 'anchor',
            label: 'The anchor element',
            options: ANCHORS.map((o, at) => ({
                value: String(at + 1),
                label: `${o.name}${at === 0 ? ' (recommended)' : ''}`,
                hint: `${QUESTION} ${o.see} What follows from it: ${o.follows} ${at === 0 ? rec(o.why) : not(o.why)}`,
            })),
        },
    ]),
);
const look = /** @type {HTMLElement} */ (section.querySelector('[data-review-look]'));
const lookLine = document.createElement('p');
lookLine.setAttribute('data-for', THEME);
lookLine.textContent = LOOK;
look.append(lookLine);

/* ---------------------------------------------------------------- the row */

/** The anchor's place in its scene. */
const place = (cap, html, cls) => `<div class="an-part an-part--${cls}"><p class="an-cap">${cap}</p>${html}</div>`;

const rows = /** @type {HTMLElement} */ (section.querySelector('[data-an-aspects]'));
const box = document.createElement('section');
box.className = 'an-aspect';
box.id = 'an-anchor';
box.setAttribute('data-an-aspect', 'anchor');
box.setAttribute('aria-labelledby', 'h-an-anchor');
box.innerHTML = `<div class="an-aspect__head"><h3 id="h-an-anchor"><span class="an-aspect__no">1</span> The anchor element</h3>
    <p class="an-aspect__q"></p><p class="an-aspect__why"></p></div><div class="an-options"></div>`;
/** @type {HTMLElement} */ (box.querySelector('.an-aspect__q')).textContent = QUESTION;
/** @type {HTMLElement} */ (box.querySelector('.an-aspect__why')).textContent = WHY;
const options = /** @type {HTMLElement} */ (box.querySelector('.an-options'));
ANCHORS.forEach((o, at) => {
    const col = document.createElement('div');
    col.className = 'an-col';
    col.setAttribute('data-an-option', String(at + 1));
    col.innerHTML = `<p class="an-label-row"><span class="an-label-row__no">${at + 1}</span> <span class="an-label-row__name"></span>${
        at === 0 ? ' <span class="an-label-row__rec">Recommended</span>' : ''
    }</p><p class="an-see"></p><p class="an-follows"></p><p class="an-verdict"></p>
    <div class="an-scene" data-an-kind="cycle" data-an-anchor="${o.key}" data-an-phase="hold">${place(o.caps[0], o.hero, 'hero')}${place(o.caps[1], o.bar, 'bar')}${place(o.caps[2], o.button, 'button')}</div>`;
    /** @type {HTMLElement} */ (col.querySelector('.an-label-row__name')).textContent = o.name;
    /** @type {HTMLElement} */ (col.querySelector('.an-see')).textContent = o.see;
    /** @type {HTMLElement} */ (col.querySelector('.an-follows')).textContent = `What follows from it: ${o.follows}`;
    const verdict = /** @type {HTMLElement} */ (col.querySelector('.an-verdict'));
    verdict.textContent = at === 0 ? rec(o.why) : not(o.why);
    verdict.classList.toggle('an-verdict--rec', at === 0);
    options.append(col);
});
rows.append(box);

/* ---------------------------------------------------------- the one clock */

// One cycle in units of the theme's own beat (UNIT, anchors.js): `gap` (the
// parts are not drawn), `in` (8: they are drawn), `hold` (4: the dwell, the
// press held), `out` (8: the drawing played backwards). The clock counts only
// the time the dialog's Pause (Space) leaves running, so a paused scene
// stands exactly where it was.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionNote = document.querySelector('[data-an-motion]');
const PHASES = /** @type {const} */ ([
    ['gap', 2],
    ['in', 8],
    ['hold', 4],
    ['out', 8],
]);
const scenes = [...section.querySelectorAll('.an-scene')];
let slow = 1;
let at = 0;
let elapsed = 0;
let last = 0;
let timer = 0;

document.documentElement.style.setProperty('--an-unit', `${UNIT}ms`);

/** Whether the review dialog's Pause (Space) is on. */
const dialogPaused = () => Boolean(document.getElementById('rv-flip-pause')?.textContent);

function setPhase(/** @type {string} */ phase) {
    for (const scene of scenes) scene.setAttribute('data-an-phase', phase);
}

function tick() {
    const now = performance.now();
    const dt = now - last;
    last = now;
    if (dialogPaused()) return;
    elapsed += dt;
    if (elapsed < PHASES[at][1] * UNIT * slow) return;
    at = (at + 1) % PHASES.length;
    elapsed = 0;
    setPhase(PHASES[at][0]);
}

/** Starts a cycle at its gap. */
function run() {
    clearInterval(timer);
    if (reduced.matches) {
        setPhase('hold');
        return;
    }
    at = 0;
    elapsed = 0;
    last = performance.now();
    setPhase(PHASES[0][0]);
    timer = window.setInterval(tick, 20);
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
radio('data-an-speed', (value) => {
    slow = 1 / Number(value);
    document.documentElement.style.setProperty('--an-slow', String(slow));
    run();
});
radio('data-an-show', (value) => {
    section.setAttribute('data-an-show', value);
});
document.querySelector('[data-an-replay]')?.addEventListener('click', () => run());

// The buttons in the scenes are scenery: a click does nothing.
section.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.an-scene button') : null;
    if (target) event.preventDefault();
});

const syncMotion = () => {
    if (motionNote) /** @type {HTMLElement} */ (motionNote).hidden = !reduced.matches;
    run();
};
reduced.addEventListener('change', syncMotion);
syncMotion();
