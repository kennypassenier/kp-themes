// research/parts-layout-1102: the page's own wiring, part one. Every component is the package's; this file wires the control
// groups and the four layout sections; demo-parts.js wires the four new parts. Each section is wired by its own elements, so it
// works on any page that shows it. The data is mock.

import { attachCalendars, setCalendarDays, setCalendarState } from '../../js/calendar.js';
import { deliveryDays } from './data.js';

export const $ = (/** @type {string} */ id) => /** @type {HTMLElement | null} */ (document.getElementById(id));

/** Each control group is a set of buttons with `data-pg="<group>"`; a press sets aria-pressed in its group and calls the handler. */
/** @type {Record<string, (value: string, target: HTMLElement | null) => void>} */
const HANDLERS = {};
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('button[data-pg]')) : null;
    const handler = HANDLERS[button?.dataset.pg ?? ''];
    if (!button || !handler) return;
    for (const other of button.parentElement?.querySelectorAll('button[data-pg]') ?? []) other.setAttribute('aria-pressed', String(other === button));
    handler(button.dataset.value ?? '', $(button.dataset.target ?? ''));
});
/** @param {string} name @param {(value: string, target: HTMLElement | null) => void} handler */
export const on = (name, handler) => {
    HANDLERS[name] = handler;
};
/** The pressed value of a group that drives `target`. @param {string} name @param {string} target @param {string} fallback */
export const pressed = (name, target, fallback) =>
    /** @type {HTMLElement | null} */ (document.querySelector(`button[data-pg="${name}"][data-target="${target}"][aria-pressed="true"]`))?.dataset.value ?? fallback;
/** @param {string} id @param {string} text */
export const say = (id, text) => {
    const line = $(id);
    if (line) line.textContent = text;
};
/** A promise that settles after `ms`, as a server would. @param {number} ms */
export const answer = (ms) => new Promise((resolve) => setTimeout(() => resolve(true), ms));
/** How long the mock server takes to answer [ms]. */
export const REPLY_MS = 600;

on('width', (value, target) => target?.setAttribute('data-pg-width', value));

// The option a section shows: written on every element of the component that names it in `data-pg-attr`, live; `off` takes it away.
on('opt', (value, target) => {
    for (const el of target?.querySelectorAll('[data-pg-attr]') ?? []) {
        const name = el.getAttribute('data-pg-attr') ?? '';
        if (value === 'off') el.removeAttribute(name);
        else el.setAttribute(name, value);
    }
});

// ---------------------------------------------------------------- 2 · calendar-spread (Almanac's deliveries month)
const months = /** @type {HTMLElement[]} */ (['pg-month'].map($).filter(Boolean));
attachCalendars(document);
for (const month of months) setCalendarDays(month, deliveryDays());
on('cal', (value) => {
    const state = /** @type {'ready' | 'loading' | 'empty' | 'error'} */ (value);
    for (const month of months) {
        const words = state === 'empty' ? 'No deliveries were planned in October.' : state === 'error' ? 'Almanac did not answer.' : undefined;
        setCalendarState(month, state, words);
        if (state === 'ready') setCalendarDays(month, deliveryDays());
    }
});

// ---------------------------------------------------------------- 4 · attention-formgrid (Almanac's Settings)
const bands = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('#attention-formgrid [data-pg-band]')]);
const asDrawn = new Map(bands.map((band) => [band, band.innerHTML]));
on('band', (value) => {
    for (const band of bands) band.innerHTML = value === 'none' ? '' : (asDrawn.get(band) ?? '');
});
