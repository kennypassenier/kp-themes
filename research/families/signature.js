// One signature element, drawn by the package, as a card of
// research/families/ (see signatures.js for which and why). The address says
// which: `signature.html?element=<element>&embed=<family>&theme=<theme>`.
// Everything on show is the package's own markup and modules on the
// theme's register; this file only writes the markup, plays it (Play) and
// slows it (the speed buttons), and the review kit's embed mode does the
// rest: it shows only the preview, presses Play for the family, and tells
// the families page the card's height, name and key.
import { attachProgressbars, setIndeterminate, setProgress } from '../../js/progressbar.js';
import { attachSparklines } from '../../js/kpi.js';
import { update } from '../../js/update.js';
import { SIGNATURES } from './signatures.js';

const params = new URLSearchParams(location.search);
const element = params.get('element') || 'progressbar';
const family = params.get('embed') || '';
const signature = SIGNATURES.find((s) => s.element === element);
const preview = /** @type {HTMLElement} */ (document.querySelector('[data-review-preview]'));
const section = /** @type {HTMLElement} */ (document.querySelector('[data-sg-section]'));

// What the kit reads to name the card: the choice's label, and the words
// "<label>: <name>" (the character demos' "Your combination" line); the key
// is the preview's own `data-sg-<family>`.
section.setAttribute('data-review-choices', JSON.stringify([{ id: family, label: 'Signature', options: [] }]));
/** @type {HTMLElement} */ (document.querySelector('[data-sg-picks]')).textContent = `Signature: ${signature?.name || element}`;
if (family) preview.setAttribute(`data-sg-${family}`, element);
preview.setAttribute('data-sg-element', element);

const SPARK = [380, 371, 352, 340, 335, 338, 360, 395, 430, 451, 448, 440, 436, 429, 431, 440, 452, 470, 480, 466, 441, 420, 409, 412];

/** The markup of each element: the package's own classes and ARIA, nothing of this page's. */
const MARKUP = {
    progressbar: () => `
        <div class="kp-progress-group sg-bars">
            <div class="kp-progress__wrap">
                <span class="kp-progress__label">Import</span>
                ${bar('Import', 'kp-progressbar--lg', 'data-sg-filling')}
                <span class="kp-progress__value" data-sg-reading>0 %</span>
            </div>
            <div class="kp-progress__wrap">
                <span class="kp-progress__label">Busy</span>
                ${bar('Waiting for the server', 'kp-progressbar--lg', 'data-kp-indeterminate')}
                <span class="kp-progress__value">…</span>
            </div>
        </div>
        <div class="kp-progress-group sg-bars sg-bars--small">
            <div class="kp-progress__wrap">
                <span class="kp-progress__label">Small, in a table row</span>
                ${bar('Import, small', '', 'data-sg-filling')}
                <span class="kp-progress__value" data-sg-reading>0 %</span>
            </div>
        </div>`,
    spinner: () => `
        <div class="sg-row">
            <span class="kp-spinner" role="status" aria-label="Loading readings"></span>
            <span class="sg-muted">Loading readings…</span>
        </div>
        <div class="sg-row">
            <span class="kp-spinner sg-spinner--large" role="status" aria-label="Loading the network"></span>
            <span class="sg-muted">Loading the network…</span>
        </div>`,
    skeleton: () => `
        <div class="kp-card sg-skel" aria-busy="true" aria-label="Loading the incident">
            <div class="sg-skel__head">
                <span class="kp-skeleton kp-skeleton--circle sg-skel__avatar"></span>
                <div class="sg-skel__lines">
                    <span class="kp-skeleton" style="inline-size: 92%"></span>
                    <span class="kp-skeleton" style="inline-size: 100%"></span>
                    <span class="kp-skeleton" style="inline-size: 58%"></span>
                </div>
            </div>
            <span class="kp-skeleton kp-skeleton--block"></span>
        </div>`,
    dialog: () => `
        <div class="sg-stage">
            <dialog class="kp-dialog sg-dialog" open aria-labelledby="sg-d-t" aria-describedby="sg-d-d">
                <h2 class="kp-dialog__title" id="sg-d-t">Close incident INC-4471?</h2>
                <p class="kp-dialog__description" id="sg-d-d">The day shift sees your note first.</p>
                <div class="kp-dialog__actions">
                    <button type="button" class="kp-button kp-button--secondary">Cancel</button
                    ><button type="button" class="kp-button kp-button--primary">Close incident</button>
                </div>
            </dialog>
        </div>`,
    toast: () => `
        <div class="sg-toasts">
            <div class="kp-toast" role="status">
                <div class="kp-toast__body">Readings exported: 1,240 rows.</div>
                <button type="button" class="kp-icon-button kp-toast__close" aria-label="Dismiss">×</button>
            </div>
            <div class="kp-toast kp-toast--success" role="status">
                <div class="kp-toast__body">Success: handover sent.</div>
                <button type="button" class="kp-icon-button kp-toast__close" aria-label="Dismiss">×</button>
            </div>
        </div>`,
    tooltip: () => `
        <div class="sg-tip">
            <button type="button" class="kp-button kp-button--secondary" aria-describedby="sg-t">Export readings</button>
            <span role="tooltip" id="sg-t" class="kp-popover kp-tooltip sg-tooltip">Takes about two minutes</span>
        </div>`,
    link: () => `
        <p class="sg-prose">
            Pump house 3 reported low pressure at 04:10. The field engineer’s notes are in the <a href="#incident">incident log</a>,
            and the readings since midnight are on <a href="#chart">the pressure chart</a>.
        </p>`,
    update: () => `
        <div class="kp-kpis sg-kpis">
            <div class="kp-kpi">
                <span class="kp-kpi__label">Flow now</span>
                <span class="kp-kpi__value"><span data-sg-num>412</span><small>m³/h</small></span>
                <span class="kp-kpi__trend">avg 15 min</span>
                <div class="sg-spark"><svg class="kp-kpi__spark" data-kp-spark="${SPARK.join(' ')}" aria-hidden="true"></svg></div>
            </div>
        </div>
        <p class="kp-row sg-state"><b>Pump 1</b> <span class="kp-state-word" data-kp-words="Running&#10;Draining">Running</span>
            <button type="button" class="kp-button kp-button--sm">Stop</button></p>`,
};

/** A progress bar in the package's markup. */
function bar(/** @type {string} */ label, /** @type {string} */ size, /** @type {string} */ extra) {
    const busy = extra.includes('indeterminate');
    return `<div class="kp-progressbar ${size}" role="progressbar" aria-label="${label}" aria-valuemin="0" aria-valuemax="100"${
        busy ? '' : ' aria-valuenow="0"'
    } ${extra}><span class="kp-progressbar__track" aria-hidden="true"><span class="kp-progressbar__fill"></span><span class="kp-progressbar__head"></span></span></div>`;
}

preview.innerHTML = (MARKUP[/** @type {keyof typeof MARKUP} */ (element)] || MARKUP.progressbar)();
attachProgressbars(preview);
attachSparklines(preview);
for (const b of preview.querySelectorAll('[data-kp-indeterminate]')) setIndeterminate(/** @type {HTMLElement} */ (b), true);
// The links and buttons are scenery: a click does nothing.
preview.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a, button')) event.preventDefault();
});

/* ------------------------------------------------------------- the speed */

/** How fast everything plays: 1, ½ or ¼, from the speed buttons the kit presses. */
let pace = 1;
const applyPace = () => {
    for (const a of document.getAnimations()) a.playbackRate = pace;
};
// A motion that starts later (a replay, a hover, an update) plays at the pace too.
for (const type of ['animationstart', 'transitionrun']) document.addEventListener(type, applyPace, true);
for (const button of document.querySelectorAll('[data-sg-speed]'))
    button.addEventListener('click', () => {
        pace = Number(button.getAttribute('data-sg-speed')) || 1;
        for (const b of document.querySelectorAll('[data-sg-speed]')) b.setAttribute('aria-pressed', String(b === button));
        applyPace();
    });

/* -------------------------------------------------------------- the play */

// The determinate bars fill the way a real import does: in uneven steps,
// a pause at the end, then from the start again, without end.
const STEPS = [0, 6, 13, 21, 27, 34, 46, 52, 61, 68, 77, 85, 91, 97, 100];
let filling = 0;
let at = 0;
const fill = () => {
    clearTimeout(filling);
    const value = STEPS[at];
    for (const b of preview.querySelectorAll('[data-sg-filling]')) setProgress(/** @type {HTMLElement} */ (b), value);
    for (const r of preview.querySelectorAll('[data-sg-reading]')) r.textContent = `${value} %`;
    const last = at === STEPS.length - 1;
    at = last ? 0 : at + 1;
    filling = window.setTimeout(fill, (last ? 1800 : at === 1 ? 700 : 420) / pace);
};

/** Puts an element back in its place, so its entrance plays from the first frame. */
const again = (/** @type {Element} */ el) => el.replaceWith(el.cloneNode(true));

let tick = 0;
const FLOW = ['436', '398', '451', '412'];
const play = async () => {
    if (element === 'progressbar') {
        at = 0;
        fill();
    } else if (['dialog', 'toast', 'tooltip'].includes(element)) {
        for (const el of preview.querySelectorAll('.kp-dialog, .kp-toast, .kp-tooltip')) again(el);
    } else if (element === 'update') {
        tick += 1;
        const num = preview.querySelector('[data-sg-num]');
        const svg = preview.querySelector('svg[data-kp-spark]');
        const word = preview.querySelector('.kp-state-word');
        const value = FLOW[(tick - 1) % FLOW.length];
        SPARK.shift();
        SPARK.push(Number(value));
        await Promise.all([
            num ? update(num, value) : 0,
            svg ? update(svg, [...SPARK]) : 0,
            word && tick % 2 ? update(word, word.textContent?.trim() === 'Running' ? 'Draining' : 'Running') : 0,
        ]);
    }
};
document.querySelector('[data-sg-play]')?.addEventListener('click', () => void play());
if (element === 'progressbar') fill();

// The review kit last, once the preview is drawn: in embed mode it shows only
// the preview and plays it (research/_review/review.js, "Embed mode").
await import('../_review/review.js');
