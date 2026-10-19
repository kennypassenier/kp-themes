// research/audhd-opts-1019: the page's own wiring. Every component is the package's (js/auto.js attaches them); this file does
// four things: the buttons above a component set the attribute they name on it (what a page or the console does), the freshness
// lines get their ages, the sentence gets the functions behind its two computed words, and the readouts beside each component
// report what the component is doing.
import { setAgo } from '../../js/freshness.js';
import { sentence } from '../../js/sentence.js';

/** Resolves once js/auto.js has attached everything the page carries. */
const ready = new Promise((resolve) => {
    const done = () => document.documentElement.hasAttribute('data-kp-auto-ready');
    if (done()) return resolve(undefined);
    new MutationObserver((_, watch) => {
        if (done()) {
            watch.disconnect();
            resolve(undefined);
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
});
await ready;

const $ = (/** @type {string} */ id) => document.getElementById(id);
/** Write a readout. @param {string} key @param {string} text */
const read = (key, text) => {
    for (const el of document.querySelectorAll(`[data-ao-read="${key}"]`)) if (el.textContent !== text) el.textContent = text;
};

// ---- the buttons above a component ---------------------------------------------------------------------------------------
for (const button of /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-ao-target]')])) {
    button.addEventListener('click', () => {
        const target = $(button.dataset.aoTarget ?? '');
        const attr = button.dataset.aoAttr ?? '';
        if (!target || !attr) return;
        if (button.hasAttribute('data-ao-remove')) target.removeAttribute(attr);
        else target.setAttribute(attr, button.dataset.aoValue ?? '');
        for (const other of button.parentElement?.querySelectorAll('[data-ao-target]') ?? []) other.setAttribute('aria-pressed', String(other === button));
    });
}

// ---- 1 · the tile board: what the size sets ---------------------------------------------------------------------------------
const tiles = $('ao-tiles');
if (tiles) {
    const measure = () => {
        const first = /** @type {HTMLElement | null} */ (tiles.querySelector('.kp-action'));
        if (!first) return;
        const style = getComputedStyle(first);
        const title = first.querySelector('.kp-action__title');
        const columns = getComputedStyle(tiles).gridTemplateColumns.split(' ').filter(Boolean).length;
        read('size', tiles.getAttribute('data-kp-action-size') === 'compact' ? 'Compact' : tiles.getAttribute('data-kp-action-size') === 'large' ? 'Large' : 'Default');
        read('height', `${Math.round(first.getBoundingClientRect().height)} px`);
        read('title', title ? getComputedStyle(title).fontSize.replace(/(\.\d)\d+px/, '$1px') : '');
        read('pad', `${parseFloat(style.paddingTop)} px by ${parseFloat(style.paddingLeft)} px`);
        read('per-line', String(columns));
    };
    new ResizeObserver(measure).observe(tiles);
    new MutationObserver(measure).observe(tiles, { attributes: true, attributeFilter: ['data-kp-action-size'] });
    measure();
}

// ---- 2 · the freshness lines: their ages, and the live line's readout --------------------------------------------------------------
for (const line of /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-ao-age]')])) {
    setAgo(line, Date.now() - Number(line.dataset.aoAge) * 1000);
}
const live = $('ao-ago-live');
if (live) {
    const report = () => {
        read('moment', live.getAttribute('title') ?? '');
        read('tone', live.getAttribute('data-kp-stale-tone') === 'calm' ? 'Calm' : 'Warning');
        read('units', live.getAttribute('data-kp-ago-units') === 'days' ? 'Days only' : 'Two units');
    };
    new MutationObserver(report).observe(live, { attributes: true, attributeFilter: ['title', 'data-kp-stale-tone', 'data-kp-ago-units'] });
    report();
}

// ---- 3 · the sentence: the two computed words and the readout ---------------------------------------------------------------------
const form = /** @type {HTMLFormElement | null} */ ($('ao-sentence'));
const handle = form ? sentence(form) : null;
if (form && handle) {
    /** @param {string | null | undefined} hhmm @param {string | null | undefined} minutes */
    const readyAt = (hhmm, minutes) => {
        const m = /^(\d{1,2}):(\d{2})$/.exec((hhmm ?? '').trim());
        const add = Number((minutes ?? '').trim());
        if (!m || (minutes ?? '').trim() === '' || !Number.isFinite(add) || add < 0 || Number(m[1]) > 23 || Number(m[2]) > 59) return null;
        const at = (Number(m[1]) * 60 + Number(m[2]) + Math.round(add)) % 1440;
        return `${String(Math.floor(at / 60)).padStart(2, '0')}:${String(at % 60).padStart(2, '0')}`;
    };
    /** @param {string | null | undefined} people @param {string | null | undefined} grams */
    const total = (people, grams) => {
        if ((people ?? '').trim() === '' || (grams ?? '').trim() === '') return null;
        const n = Number(people) * Number(grams);
        if (!Number.isFinite(n) || n < 0) return null;
        return n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)} kg` : `${n} g`;
    };
    handle.compute('ready', (v) => readyAt(v.start, v.minutes));
    handle.compute('total', (v) => total(v.people, v.grams));
    const report = () => {
        read('summary', handle.summary());
        read('sent', [...new FormData(form).keys()].join(', '));
    };
    form.addEventListener('input', report);
    form.addEventListener('change', report);
    report();
    for (const button of /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-ao-field]')])) {
        button.addEventListener('click', () => {
            const input = form.querySelector(`[name="${button.dataset.aoField}"]`);
            if (!(input instanceof HTMLInputElement)) return;
            input.value = button.dataset.aoText ?? '';
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });
    }
}
