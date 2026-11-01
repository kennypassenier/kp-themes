// research/ux-parts-1101: the page's own wiring. Every component is the package's; this file wires the control groups, the
// default each option section asks, and the first four sections (chips, three-way chips, the popover form, the empty plate);
// demo-more.js wires the refresh control, the date navigation and Delete with Undo. Each section is wired by its own elements,
// so it works on any page that shows it. The data is mock.

import { attachSegmented, setSegmentedTri } from '../../js/segmented.js';
import { attachPopoverForms, openPopoverForm } from '../../js/popover-form.js';

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
/** A promise that settles after `ms`, as a server would. @param {number} ms @param {string} [refusal] */
export const answer = (ms, refusal) => new Promise((resolve, reject) => setTimeout(() => (refusal ? reject(new Error(refusal)) : resolve(true)), ms));
/** How long the mock server takes to answer [ms]. */
export const REPLY_MS = 600;

on('width', (value, target) => target?.setAttribute('data-pg-width', value));

// The default an option section asks (DEMO_RULES ch. 7): the review kit fires `review:choice`; the frame it names wears the mark.
document.addEventListener('review:choice', (event) => {
    const { value } = /** @type {CustomEvent<{ id: string, value: string }>} */ (event).detail;
    const section = event.target instanceof Element ? event.target : null;
    for (const frame of section?.querySelectorAll('[data-pg-frame]') ?? []) frame.toggleAttribute('data-pg-default', frame.getAttribute('data-pg-frame') === value);
});

attachSegmented(document);

// ---------------------------------------------------------------- 1 · chips-narrow (Medicine Cabinet's Overview)
for (const [id, name] of [['pg-chips-now', 'Now'], ['pg-chips-new', 'New']]) {
    $(id)?.addEventListener('kp-segmented-change', (event) => {
        const { values } = /** @type {CustomEvent<{ values: string[] }>} */ (event).detail;
        say('pg-chips-log', `${name}: kp-segmented-change, values [${values.join(', ')}]`);
    });
}

// ---------------------------------------------------------------- 2 · tri-state-chip (Kitchen's wheel filters)
for (const prefix of ['pg-wheel-now', 'pg-wheel']) {
    const ing = $(`${prefix}-ing`);
    if (ing) setSegmentedTri(ing, { include: ['chicken'], exclude: ['mushrooms'] });
    $(prefix)?.addEventListener('kp-segmented-change', (event) => {
        const { value, state } = /** @type {CustomEvent<{ value: string, state: string }>} */ (event).detail;
        say('pg-wheel-log', `${prefix === 'pg-wheel' ? 'New' : 'Now'}: kp-segmented-change, ${value} is now ${state}`);
    });
}

// ---------------------------------------------------------------- 3 · popover-form (Medicine Cabinet's Add stock)
const cabinet = $('pg-cabinet');
if (cabinet) attachPopoverForms(cabinet);
cabinet?.addEventListener('kp-popover-form-accept', (event) => {
    const { value, opener, waitUntil } = /** @type {CustomEvent<{ value: string, opener: HTMLElement, waitUntil: (p: Promise<unknown>) => void }>} */ (event).detail;
    const wrapper = /** @type {HTMLElement | null} */ (opener.closest('[data-kp-popover-form]'));
    const name = wrapper?.dataset.pgName ?? '';
    const fails = pressed('save', 'pg-cabinet', 'ok') === 'fail';
    say('pg-cabinet-log', `kp-popover-form-accept: ${value} for ${name}${fails ? ', the save will fail' : ''}`);
    const save = answer(REPLY_MS, fails ? 'The cabinet did not answer; nothing was added.' : undefined).then(() => {
        const badge = $(`pg-stock-${wrapper?.id.replace('pg-add-', '')}`);
        if (!badge) return;
        const boxes = Number(badge.dataset.pgBoxes ?? 0) + Number(value);
        badge.dataset.pgBoxes = String(boxes);
        badge.textContent = boxes === 1 ? '1 box' : `${boxes} boxes`;
        badge.classList.toggle('kp-badge--warning', boxes === 0);
        say('pg-cabinet-log', `Saved: ${name} now has ${badge.textContent}`);
    });
    waitUntil(save);
});
on('save', (value) =>
    say('pg-cabinet-log', value === 'fail' ? 'The next Add fails: the cabinet will not answer.' : 'The next Add is saved.'),
);
on('open', () => {
    const first = $('pg-add-ibuprofen');
    if (first) openPopoverForm(first);
});
