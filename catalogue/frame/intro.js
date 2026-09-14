// One theme's arrival, on demand, for catalogue/intros.html [scope-84].
//
// The address carries everything: `theme`, `rate` (written to the root as
// --kp-arrival-rate, the knob js/effects.js reads), `play=1` to perform the
// arrival, and `force=1` to perform it even when the browser asks for reduced
// motion — the package never does that for a reader; this frame does it only
// because the page around it is an inspector and the reviewer asked.
//
// The arrival runs once per session per page. A frame that is told to play
// forgets that memo first, so every load of it is a replay. What happens is
// posted to the page around it: `playing`, each `line` the overlay shows,
// `ended` with the milliseconds from the overlay's appearance to its removal,
// or `rested` when the module went straight to rest.
import { attachEffects, ARRIVAL, KNOBS, MEMO_PREFIX, REVEAL_EVENT } from '../../js/effects.js';

const query = new URLSearchParams(location.search);
const theme = query.get('theme') ?? 'formal';
const rate = query.get('rate');
const root = document.documentElement;
root.setAttribute('data-theme', theme);
// No `rate` in the address leaves the knob unset, which is how every page
// that is not this inspector plays the arrival.
if (rate !== null) root.style.setProperty(KNOBS.arrivalRate, rate);
for (const heading of document.querySelectorAll('[data-cat-intro-theme]')) heading.textContent = theme;

/** @param {Record<string, unknown>} message */
const post = (message) => {
    if (window.parent !== window) window.parent.postMessage({ type: 'kp-intro', theme, ...message }, location.origin);
};

if (query.get('play') === '1') {
    try {
        const prefix = `${MEMO_PREFIX}${location.pathname}:arrival:`;
        for (const key of Object.keys(sessionStorage)) if (key.startsWith(prefix)) sessionStorage.removeItem(key);
    } catch {
        /* no storage: nothing is remembered, so the arrival plays */
    }

    let started = 0;
    let last = '';
    const watch = new MutationObserver(() => {
        const overlay = document.querySelector(`.${ARRIVAL.root}`);
        if (overlay && !started) {
            started = performance.now();
            post({ state: 'playing' });
        }
        const text = overlay?.querySelector(`.${ARRIVAL.line}`)?.textContent ?? '';
        if (overlay && text !== last) {
            last = text;
            post({ state: 'line', text });
        }
    });
    watch.observe(document.body, { childList: true, subtree: true, characterData: true });
    root.addEventListener(REVEAL_EVENT, (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.reveal !== 'arrival') return;
        watch.disconnect();
        if (detail.skipped) post({ state: 'rested', routine: detail.routine });
        else post({ state: 'ended', routine: detail.routine, elapsed: Math.round(performance.now() - started), text: last });
    });

    const force = query.get('force') === '1';
    attachEffects(document, force ? { reduceMotion: false } : {});
    if (!getComputedStyle(root).getPropertyValue('--kp-arrival').trim()) post({ state: 'none' });
}
