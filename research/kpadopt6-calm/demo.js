// research/kpadopt6-calm: what this page does that the package does not.
//   1. the sample content, the fixed clock and the pretend server (a save that works or is refused);
//   2. the event readouts;
//   3. the buttons that drive a state or an option.
// Everything drawn is drawn by the package's own functions and attributes.
import { setRatingState } from '../../js/rating.js';
import { setQuoteState } from '../../js/quote.js';
import { setStatus, settleToday, setTodayState } from '../../js/statusrow.js';

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

// ---- 3 · today card ------------------------------------------------------------------------------
{
    const listOf = (/** @type {string} */ id) => /** @type {HTMLElement} */ (document.querySelector(`#${id} .kp-statuslist`));
    const a = listOf('k6-today-a');
    for (const id of ['k6-today-a', 'k6-today-b']) {
        listOf(id).addEventListener('kp-status-resume', (event) => {
            log(document.getElementById('k6-today-log'), `kp-status-resume { id: '${/** @type {CustomEvent} */ (event).detail.id}' }`);
        });
        listOf(id).addEventListener('kp-status-undo', (event) => {
            log(document.getElementById('k6-today-log'), `kp-status-undo { id: '${/** @type {CustomEvent} */ (event).detail.id}', action: '${/** @type {CustomEvent} */ (event).detail.action}' }`);
        });
    }
    onButtons('data-k6-today-since', (value) => {
        for (const id of ['k6-today-a', 'k6-today-b']) {
            const list = listOf(id);
            if (value === 'date') list.removeAttribute('data-kp-today-since');
            else list.setAttribute('data-kp-today-since', value);
            for (const row of list.querySelectorAll('.kp-statusrow[data-state="paused"]')) setStatus(list, row.getAttribute('data-kp-status-id') ?? '', { state: 'paused' });
        }
    });
    document.querySelector('[data-k6-today-pause]')?.addEventListener('click', (event) => {
        const button = /** @type {HTMLElement} */ (event.currentTarget);
        const on = button.getAttribute('aria-pressed') !== 'true';
        button.setAttribute('aria-pressed', String(on));
        for (const id of ['k6-today-a', 'k6-today-b']) {
            const list = listOf(id);
            list.toggleAttribute('data-kp-today-pause', on);
            for (const row of list.querySelectorAll('.kp-statusrow:not(.kp-statusrow--fold)')) setStatus(list, row.getAttribute('data-kp-status-id') ?? '', {});
        }
    });
    document.querySelector('[data-k6-today-failed]')?.addEventListener('click', () => {
        setStatus(a, 'walk', { state: /** @type {any} */ ('failed') });
    });
    onButtons('data-k6-today-fold', (value) => {
        const list = listOf('k6-today-b');
        list.setAttribute('data-kp-today-paused', value);
        settleToday(list);
    });
    const driven = /** @type {HTMLElement} */ (document.getElementById('k6-today-s'));
    driven.addEventListener('kp-card-retry', () => {
        setTodayState(driven, 'loading');
        void sleep(1000).then(() => setTodayState(driven, 'ready'));
    });
    onButtons('data-k6-today-state', (value) => setTodayState(driven, /** @type {'ready' | 'loading' | 'empty' | 'error'} */ (value)));
}

// ---- 4 · quote card ------------------------------------------------------------------------------
{
    const first = document.getElementById('k6-quote-a');
    first?.addEventListener('kp-quote-hide', (event) => {
        log(document.getElementById('k6-quote-log'), 'kp-quote-hide: the page was told, after the Undo window');
        void event;
    });
    const driven = document.getElementById('k6-quote-state');
    let refuse = false;
    driven?.addEventListener('kp-quote-hide', (event) => {
        const { wait } = /** @type {CustomEvent} */ (event).detail;
        log(document.getElementById('k6-quote-state-log'), refuse ? 'kp-quote-hide: the save is refused' : 'kp-quote-hide: saved');
        wait(sleep(600).then(() => (refuse ? Promise.reject(new Error('The note could not be hidden')) : undefined)));
    });
    driven?.addEventListener('kp-quote-retry', () => {
        log(document.getElementById('k6-quote-state-log'), 'kp-quote-retry');
        if (driven) {
            setQuoteState(driven, 'loading');
            void sleep(1000).then(() => setQuoteState(driven, 'ready'));
        }
    });
    onButtons('data-k6-quote-state', (value) => {
        if (driven) setQuoteState(driven, /** @type {'ready' | 'loading' | 'empty' | 'error'} */ (value));
    });
    onButtons('data-k6-quote-hide', (value) => {
        refuse = value === 'refused';
    });
}

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
