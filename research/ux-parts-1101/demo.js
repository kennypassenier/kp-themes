// research/ux-parts-1101, round 2: the page's own wiring. Every component is the package's; this file wires the control groups,
// the defaults each section asks and the filter chips; demo-more.js wires the refresh control. Each section is wired by its own
// elements, so it works on any page that shows it. The data is mock.

import { attachSegmented } from '../../js/segmented.js';

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

/**
 * The approved looks fold on the WINDOW's width (the list toolbar under 48rem, the refresh bar under 40rem), which a 390 px stage
 * inside a wide window never reaches; on a phone the window is that narrow. So the stage at a phone's width gives the approved
 * frame the folded markup a phone would show it in (the toolbar's own `kp-toolbar--stacked`, the bar's `data-kp-refresh-stack`),
 * and takes it away at full width. The new looks fold on their own width and need nothing.
 * @param {HTMLElement | null} stage @param {boolean} phone
 */
function asOnAPhone(stage, phone) {
    const now = stage?.querySelector('[data-pg-frame="now"]');
    for (const toolbar of now?.querySelectorAll('.kp-toolbar') ?? []) toolbar.classList.toggle('kp-toolbar--stacked', phone);
    for (const bar of now?.querySelectorAll('.kp-refresh') ?? []) bar.setAttribute('data-kp-refresh-stack', phone ? 'always' : 'auto');
}

on('width', (value, target) => {
    target?.setAttribute('data-pg-width', value);
    asOnAPhone(target, value === 'phone');
});

// The default an option section asks (DEMO_RULES ch. 7): the review kit fires `review:choice`; the frame it names wears the mark.
document.addEventListener('review:choice', (event) => {
    const { id, value } = /** @type {CustomEvent<{ id: string, value: string }>} */ (event).detail;
    const section = event.target instanceof Element ? event.target : null;
    // What a narrow group on tracks does: the grid (default) or the menu of round 1, on the new look's group.
    if (id === 'narrow') {
        $('pg-chips-new')?.setAttribute('data-kp-segmented-fold', value);
        return;
    }
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
