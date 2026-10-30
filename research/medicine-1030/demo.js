// research/medicine-1030, round 2: the page's own wiring for the two sections Kenny did not approve. Every component is the package's (attached by
// js/auto.js from its data-kp-* attributes); this file wires the controls of each section by their own elements. The eleven approved sections of
// round 1 have left the page and their wiring with them (round 1 stays readable in _previous/). The data is the Medicine Cabinet app's own shape.

import { openConfirmation } from '../../js/components.js';
import { setQuantity } from '../../js/quantity.js';
import { combobox } from '../../js/combobox.js';
import { SEGMENTED_EVENT, getSegmentedValues } from '../../js/segmented.js';

const $ = (/** @type {string} */ id) => /** @type {HTMLElement} */ (document.getElementById(id));

/** Each control group is a set of buttons with `data-pg="<group>"`; a press sets aria-pressed in its group and calls the group's handler. */
/** @type {Record<string, (value: string, button: HTMLElement) => void>} */
const HANDLERS = {};
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('button[data-pg]')) : null;
    if (!button) return;
    const handler = HANDLERS[button.dataset.pg ?? ''];
    if (!handler) return;
    // A button without aria-pressed is an action (it opens a dialog), not a toggle: nothing in its group is marked.
    if (button.hasAttribute('aria-pressed')) for (const other of button.parentElement?.querySelectorAll('button[data-pg]') ?? []) other.setAttribute('aria-pressed', String(other === button));
    handler(button.dataset.value ?? '', button);
});
/** @param {string} name @param {(value: string, button: HTMLElement) => void} handler */
const on = (name, handler) => {
    HANDLERS[name] = handler;
};
const say = (/** @type {string} */ id, /** @type {string} */ text) => {
    $(id).textContent = text;
};
/** Every element that matches, as an array. @param {string} selector */
const all = (selector) => /** @type {HTMLElement[]} */ ([...document.querySelectorAll(selector)]);

// ---------------------------------------------------------------- width (every section)
on('width', (value, button) => {
    $(button.dataset.target ?? '').setAttribute('data-pg-width', value);
});

// ---------------------------------------------------------------- pills-none
{
    const log = (/** @type {string} */ words) => say('pg-pills-log', words);
    const form = $('pg-form-pills');
    on('pill-mode', (value) => form.setAttribute('data-kp-segmented', value));
    // How many pills the symptoms get: the package reads `data-kp-segmented-top` again when it changes, and leaves the field out when it is `all`.
    on('pill-top', (value) => {
        for (const id of ['pg-sym-pills', 'pg-find-pills']) $(id).setAttribute('data-kp-segmented-top', value);
    });
    // One line that says what the page heard from the three rows, whichever side (a pill or its field) the change came from.
    const report = () => {
        const symptoms = combobox($('pg-sym'))?.values() ?? [];
        const search = /** @type {HTMLInputElement} */ ($('pg-find-input')).value;
        const chosen = getSegmentedValues(form);
        log(`Form: ${chosen[0] ?? 'none chosen'} · Symptoms: ${symptoms.join(', ') || 'none'} · Search box: ${search || 'empty'}`);
    };
    document.addEventListener(SEGMENTED_EVENT, report);
    document.addEventListener('kp-combobox-change', report);
    $('pg-find-input').addEventListener('input', report);
    report();
}

// ---------------------------------------------------------------- dialogs
{
    const preview = $('pg-prev-stock');
    on('dlg-step', (value) => {
        preview.classList.remove('kp-dialog--narrow', 'kp-dialog--wide', 'kp-dialog--wider');
        if (value !== 'default') preview.classList.add(`kp-dialog--${value}`);
    });
    // The amount set from outside: the button follows it without a press of the stepper.
    on('dlg-amount', (value) => {
        for (const id of ['pg-prev-quantity', 'pg-stock-quantity']) setQuantity($(id), Number(value));
    });
    for (const close of all('[data-pg-close]')) close.addEventListener('click', () => close.closest('dialog')?.close());
    on('dlg-open', (value, button) => {
        if (value === 'stock') /** @type {HTMLDialogElement} */ ($('pg-stock')).showModal();
        else if (value === 'forms') /** @type {HTMLDialogElement} */ ($('pg-forms')).showModal();
        else {
            const line = (/** @type {string} */ html) => Object.assign(document.createElement('p'), { innerHTML: html });
            openConfirmation(button, {
                phrase: 'Too soon for another dose',
                description: [
                    line('You took Ibuprofen 400 mg at 14:10, 2 h ago.'),
                    line('The leaflet asks for at least <strong>6 h</strong> between doses: the next one is due at 20:10.'),
                    line('Taking it anyway is your choice; it is written down as an extra dose.'),
                ],
                acceptLook: 'primary',
                acceptLabel: 'Take it anyway',
            });
        }
    });
}

