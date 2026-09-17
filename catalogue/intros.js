// The intro inspector, catalogue/intros.html [scope-84].
//
// Each block names a theme (`data-cat-intro`) and holds a window
// (frame/intro.html) that performs that theme's arrival when asked. This file
// wires the controls: Play loads the window with `play=1` at the slider's
// rate, the slider's value is shown and used by the next play, and the words
// the dictionary gives that theme are listed beside it — read the way
// js/effects.js reads them, so the list is what the package shows. Under
// reduced motion the page says so and offers to play anyway, for inspection.
import { getStrings } from '../js/strings.js';
import { THEMES } from '../js/theme-registry.js';

const FRAME = new URL('./frame/intro.html', import.meta.url);
const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const force = /** @type {HTMLInputElement | null} */ (document.querySelector('[data-cat-intro-force]'));

/** What `--kp-arrival` a theme declares, read from a probe wearing it. */
function arrivalOf(theme) {
    const probe = document.createElement('div');
    probe.setAttribute('data-theme', theme);
    probe.hidden = true;
    document.body.append(probe);
    const value = getComputedStyle(probe).getPropertyValue('--kp-arrival').trim();
    probe.remove();
    return value;
}

/** The words a theme's arrival shows, as js/effects.js picks them. */
function wordsOf(theme, routine) {
    const words = getStrings();
    if (routine === 'card') return theme;
    const lines = words.arrivalLinesByTheme?.[theme];
    if (lines?.length) return lines.join('\n');
    const own = words.arrivalWordsByTheme?.[theme] ?? {};
    const progress = own.progress ?? words.arrivalProgress;
    return [own.line ?? words.arrivalLine, `${progress} N%`.trim(), own.ready ?? words.arrivalReady].join('\n');
}

/** @param {HTMLElement} block */
function play(block) {
    const theme = block.getAttribute('data-cat-intro') ?? '';
    const frame = /** @type {HTMLIFrameElement} */ (block.querySelector('[data-cat-intro-frame]'));
    const rate = /** @type {HTMLInputElement} */ (block.querySelector('[data-cat-intro-rate]')).value;
    const address = new URL(FRAME);
    address.search = new URLSearchParams({ theme, rate, play: '1', ...(force?.checked ? { force: '1' } : {}) }).toString();
    const status = block.querySelector('[data-cat-intro-status]');
    if (status) status.textContent = `Loading at ${Number(rate).toFixed(1)}×…`;
    frame.src = address.href;
}

/** @param {HTMLElement} block */
function mount(block) {
    const theme = block.getAttribute('data-cat-intro') ?? '';
    const routine = arrivalOf(theme);
    const words = block.querySelector('[data-cat-intro-words]');
    if (words) words.textContent = routine ? wordsOf(theme, routine) : 'This theme declares no intro.';
    const frame = /** @type {HTMLIFrameElement} */ (block.querySelector('[data-cat-intro-frame]'));
    const quiet = new URL(FRAME);
    quiet.search = new URLSearchParams({ theme }).toString();
    frame.src = quiet.href;

    const slider = /** @type {HTMLInputElement} */ (block.querySelector('[data-cat-intro-rate]'));
    const shown = block.querySelector('[data-cat-intro-rate-value]');
    slider.addEventListener('input', () => {
        if (shown) shown.textContent = `${Number(slider.value).toFixed(1)}×`;
    });
    block.querySelector('[data-cat-intro-play]')?.addEventListener('click', () => play(block));
}

/**
 * Every intro block on the page, mounted once [fix-43].
 *
 * This module is loaded by the inspector page and by "Every component, one
 * page" (catalogue/index.html), which gathers the blocks as markup and then
 * says so with `cat-composed`. Without this, Play on the review page — where
 * Kenny judges — did nothing at all.
 */
const blocks = /** @type {HTMLElement[]} */ ([]);
const mounted = new WeakSet();

function mountAll() {
    for (const block of /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-cat-intro]')])) {
        if (mounted.has(block)) continue;
        mounted.add(block);
        blocks.push(block);
        mount(block);
    }
}

mountAll();
document.addEventListener('cat-composed', mountAll);

// The frames report what they did; each message is routed to its theme's block.
window.addEventListener('message', (event) => {
    if (event.origin !== location.origin || event.data?.type !== 'kp-intro') return;
    const block = blocks.find((b) => b.getAttribute('data-cat-intro') === event.data.theme);
    if (!block) return;
    const live = block.querySelector('[data-cat-intro-live]');
    const status = block.querySelector('[data-cat-intro-status]');
    const { state } = event.data;
    if (state === 'playing' && status) status.textContent = 'Playing…';
    if (state === 'line' && live) live.textContent = event.data.text;
    if (state === 'ended' && status) status.textContent = `Played in ${event.data.elapsed} ms, from the overlay's appearance to its removal.`;
    if (state === 'rested' && status)
        status.textContent = reducedQuery.matches
            ? force
                ? 'At rest: your browser asks for reduced motion. Switch on "Play anyway for inspection" above.'
                : 'At rest: your browser asks for reduced motion. The intro page (Theme intros) carries the switch that plays it anyway.'
            : 'At rest: the module did not play it.';
    if (state === 'none' && status) status.textContent = 'This theme declares no intro.';
    block.setAttribute('data-cat-intro-state', state);
});

// Reduced motion: said on the page, with the one switch that overrides it here.
const notice = /** @type {HTMLElement | null} */ (document.querySelector('[data-cat-intro-reduced]'));
const showNotice = () => {
    if (notice) notice.hidden = !reducedQuery.matches;
};
showNotice();
reducedQuery.addEventListener('change', showNotice);

// Every theme without an intro, in one line, and any theme that has one but no block here.
const inspected = new Set(blocks.map((b) => b.getAttribute('data-cat-intro')));
const none = [];
const missing = [];
for (const { name } of THEMES) {
    const routine = arrivalOf(name);
    if (!routine) none.push(name);
    else if (!inspected.has(name)) missing.push(name);
}
const line = document.querySelector('[data-cat-intro-none]');
if (line) {
    line.textContent =
        `No intro: ${none.join(', ')}.` + (missing.length ? ` Declares an intro but has no block on this page: ${missing.join(', ')}.` : '');
}
