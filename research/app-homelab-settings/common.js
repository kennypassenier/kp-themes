// research/app-homelab-settings: what every section of the page shares. The components are the package's (js/auto.js attaches the
// ones the markup carries, attachAll() the ones a section draws later); these helpers only wait for it, press the state
// buttons, write a readout and format a moment the way the dashboard does (dd/mm/yyyy HH:mm in the host's clock).

import { attachAll } from '../../js/auto.js';

/** Resolves once js/auto.js has attached everything the page carries. */
export const ready = new Promise((resolve) => {
    const done = () => document.documentElement.hasAttribute('data-kp-auto-ready');
    if (done()) return resolve(undefined);
    new MutationObserver((_, watch) => {
        if (done()) {
            watch.disconnect();
            resolve(undefined);
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
});

/** @param {string} id @returns {HTMLElement | null} */
export const byId = (id) => document.getElementById(id);

/** Write a readout. @param {string} id @param {string} text */
export function say(id, text) {
    const out = document.getElementById(id);
    if (out) out.textContent = text;
}

/** Exactly one button of a group is pressed. @param {string} attribute @param {string} value */
export function press(attribute, value) {
    for (const b of document.querySelectorAll(`[${attribute}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attribute) === value));
}

/**
 * Wire a group of state buttons: a press marks the button and calls `apply` with its value. Returns a function that
 * presses a value from code (without the click).
 * @param {string} attribute @param {(value: string) => void} apply
 */
export function stateButtons(attribute, apply) {
    const buttons = /** @type {HTMLButtonElement[]} */ ([...document.querySelectorAll(`[${attribute}]`)]);
    for (const button of buttons) {
        button.addEventListener('click', () => {
            const value = button.getAttribute(attribute) ?? '';
            press(attribute, value);
            apply(value);
        });
    }
    return (/** @type {string} */ value) => {
        press(attribute, value);
        apply(value);
    };
}

/** The value now pressed in a group. @param {string} attribute */
export const pressed = (attribute) => document.querySelector(`[${attribute}][aria-pressed="true"]`)?.getAttribute(attribute) ?? '';

/** Draw html into an element and attach every component it carries. @param {Element} el @param {string} html */
export async function mount(el, html) {
    el.innerHTML = html;
    await attachAll(el).ready;
}

/** @param {unknown} text */
export const esc = (text) =>
    String(text).replace(/[&<>"']/g, (c) => /** @type {Record<string, string>} */ ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);

export const pad = (/** @type {number} */ n) => String(n).padStart(2, '0');
/** An exact count, with a thousands separator. @param {number} n */
export const count = (n) => n.toLocaleString('en-GB');
export const MIN = 60_000;
export const HOUR = 3_600_000;
export const DAY = 86_400_000;
export const NOW = Date.now();

const zone = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Brussels',
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
});

/** dd/mm/yyyy HH:mm in the host's clock (Europe/Brussels). @param {number} ms */
export function dateTime(ms) {
    /** @type {Record<string, string>} */
    const p = {};
    for (const x of zone.formatToParts(new Date(ms))) p[x.type] = x.value;
    return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;
}

/** "3 days ago", "12 min ago": the coarsest honest distance. @param {number} ms how long ago */
export function ago(ms) {
    const min = Math.round(ms / MIN);
    if (min < 1) return 'just now';
    if (min < 60) return `${min} min ago`;
    if (min < 48 * 60) return `${Math.floor(min / 60)} h ago`;
    return `${Math.round(min / 1440)} days ago`;
}

/** Wait. @param {number} ms */
export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
