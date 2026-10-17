// research/kpadopt6-calm: what this page does that the package does not.
//   1. the sample content, the fixed clock and the pretend server (a save that works or is refused);
//   2. the event readouts;
//   3. the buttons that drive a state or an option.
// Everything drawn is drawn by the package's own functions and attributes.
import { setRatingState } from '../../js/rating.js';

/** @param {string} selector @param {ParentNode} [root] */
const all = (selector, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(selector)]);
const sleep = (/** @type {number} */ ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Press one button of a group (aria-pressed), the others off. @param {HTMLElement} button */
function pressOnly(button) {
    const group = button.closest('[role="group"]');
    for (const other of all('button[aria-pressed]', group ?? document)) other.setAttribute('aria-pressed', String(other === button));
}

/** @param {string} attr @param {(value: string, button: HTMLElement) => void} run */
function onButtons(attr, run) {
    for (const button of all(`[${attr}]`)) {
        button.addEventListener('click', () => {
            if (button.hasAttribute('aria-pressed')) pressOnly(button);
            run(button.getAttribute(attr) ?? '', button);
        });
    }
}

/** @param {HTMLElement | null} box @param {string} text */
const log = (box, text) => {
    if (box) box.textContent = text;
};

// ---- 6 · star rating -----------------------------------------------------------------------------
{
    const first = document.getElementById('k6-rate-a');
    first?.addEventListener('kp-rating-change', (event) => {
        const { value, previous, source } = /** @type {CustomEvent} */ (event).detail;
        log(document.getElementById('k6-rate-log'), `kp-rating-change { value: ${value}, previous: ${previous}, source: '${source}' }`);
    });
    const driven = document.getElementById('k6-rate-state');
    let refuse = false;
    driven?.addEventListener('kp-rating-change', (event) => {
        const { value, previous, source, wait } = /** @type {CustomEvent} */ (event).detail;
        log(document.getElementById('k6-rate-state-log'), `kp-rating-change { value: ${value}, previous: ${previous}, source: '${source}' }`);
        wait(sleep(700).then(() => (refuse ? Promise.reject(new Error('refused')) : undefined)));
    });
    driven?.addEventListener('kp-rating-retry', () => {
        log(document.getElementById('k6-rate-state-log'), 'kp-rating-retry');
        if (driven) {
            setRatingState(driven, 'loading');
            void sleep(900).then(() => setRatingState(driven, 'ready'));
        }
    });
    onButtons('data-k6-rating-state', (value) => {
        if (driven) setRatingState(driven, /** @type {'ready' | 'loading' | 'error'} */ (value));
    });
    onButtons('data-k6-rating-save', (value) => {
        refuse = value === 'refused';
    });
}
