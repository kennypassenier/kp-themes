// research/list-action-1031: the page's own wiring. Every component is the package's (attached by js/auto.js from its data-kp-* attributes);
// this file wires the section's controls by its own elements: the card's data states, the actions taken out of every row and put back, the
// stage width, and the "I took one" buttons, which write what was noted under the list. The data is mock.

import { setCardState } from '../../js/card-state.js';

const $ = (/** @type {string} */ id) => /** @type {HTMLElement} */ (document.getElementById(id));

/** Each control group is a set of buttons with `data-pg="<group>"`; a press sets aria-pressed in its group and calls the group's handler. */
/** @type {Record<string, (value: string, button: HTMLElement) => void>} */
const HANDLERS = {};
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('button[data-pg]')) : null;
    if (!button) return;
    const handler = HANDLERS[button.dataset.pg ?? ''];
    if (!handler) return;
    for (const other of button.parentElement?.querySelectorAll('button[data-pg]') ?? []) other.setAttribute('aria-pressed', String(other === button));
    handler(button.dataset.value ?? '', button);
});
/** @param {string} name @param {(value: string, button: HTMLElement) => void} handler */
const on = (name, handler) => {
    HANDLERS[name] = handler;
};
/** Press a group's button from the page. @param {string} name @param {string} value */
const press = (name, value) => {
    for (const b of document.querySelectorAll(`button[data-pg="${name}"]`)) b.setAttribute('aria-pressed', String(/** @type {HTMLElement} */ (b).dataset.value === value));
};

// ---------------------------------------------------------------- width
on('width', (value, button) => {
    $(button.dataset.target ?? '').setAttribute('data-pg-width', value);
});

// ---------------------------------------------------------------- card states
/** What each state of the list says, in the package's plate. */
const PLATE = {
    empty: ['Nothing for a headache', 'No medicine in the cabinet is meant for a headache. Add one and it is listed here.'],
    error: ['The cabinet could not be read', 'The app did not answer. Try again in a moment.'],
    words: 'Reading the cabinet',
};
on('state', (value, button) => {
    const card = $(button.dataset.target ?? '');
    if (value === 'loading') setCardState(card, 'loading', { words: PLATE.words });
    else if (value === 'empty') setCardState(card, 'empty', { title: PLATE.empty[0], text: PLATE.empty[1] });
    else if (value === 'error') setCardState(card, 'error', { title: PLATE.error[0], text: PLATE.error[1] });
    else setCardState(card, 'ready');
});
document.addEventListener('kp-card-retry', (event) => {
    if (!(event.target instanceof HTMLElement) || event.target.id !== 'pg-symptoms') return;
    setCardState(event.target, 'ready');
    press('state', 'ready');
});

// ---------------------------------------------------------------- actions out of every row and back
// A hidden cell still counts as an action for the list's grid, so "No action in any row" takes the cells out of the rows and keeps them to put back.
/** @type {Map<HTMLElement, HTMLElement>} each action cell and the row it belongs to */
const taken = new Map();
on('actions', (value, button) => {
    const list = $(button.dataset.target ?? '');
    if (value === 'none') {
        for (const cell of list.querySelectorAll(':scope > .kp-listrow > .kp-listrow__action')) {
            taken.set(/** @type {HTMLElement} */ (cell), /** @type {HTMLElement} */ (cell.parentElement));
            cell.remove();
        }
        return;
    }
    for (const [cell, row] of taken) row.append(cell);
    taken.clear();
});

// ---------------------------------------------------------------- I took one
const clock = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });
document.addEventListener('click', (event) => {
    const take = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('[data-pg-take]')) : null;
    if (!take) return;
    $('pg-symptoms-log').textContent = `Noted: one ${take.dataset.pgTake} at ${clock.format(new Date())}.`;
});
