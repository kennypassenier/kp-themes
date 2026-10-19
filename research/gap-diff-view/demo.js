// research/gap-diff-view: the page's own wiring. The component is the package's (js/diff.js, attached by js/auto.js); this file
// gives each section its sample data and wires the buttons at the component. A section is wired by its own elements, so it
// works on any page that holds it.

import { setDiff } from '../../js/diff.js';
import { MEDIA_PLAN, CONTEXT_SAMPLES, WORD_SAMPLES, STATE_SAMPLES, longFile } from './data.js';

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

/** @param {string} id */
const component = (id) => /** @type {HTMLElement | null} */ (document.getElementById(`${id}-component`));

/** Mark one button of a group pressed and the others not. @param {Element} button */
function press(button) {
    const group = button.closest('[role="group"]');
    for (const other of group?.querySelectorAll('button[aria-pressed]') ?? []) other.setAttribute('aria-pressed', String(other === button));
}

/** Put the pressed state of a group on the button that carries `value`. @param {string} id @param {string} name @param {string} value */
function mark(id, name, value) {
    const button = document.querySelector(`[data-review-controls-for="${id}-component"] [data-gdv-${name}="${value}"]`);
    if (button) press(button);
}

// --- Several files -------------------------------------------------------------------------------------------------------
const files = component('diff-files');
if (files) setDiff(files, { files: MEDIA_PLAN });

// --- Folded context ------------------------------------------------------------------------------------------------------
const context = component('diff-context');
if (context) setDiff(context, { files: CONTEXT_SAMPLES.config });

// --- The changed words ---------------------------------------------------------------------------------------------------
const words = component('diff-words');
if (words) setDiff(words, { files: WORD_SAMPLES.images });

// --- States --------------------------------------------------------------------------------------------------------------
const states = component('diff-states');

/** @param {string} state */
function showState(state) {
    if (!states) return;
    if (state === 'ready') setDiff(states, { files: STATE_SAMPLES.ready, state: 'ready' });
    else if (state === 'empty') setDiff(states, { state: 'empty', compared: ['stacks/media/compose.yml (running)', 'stacks/media/compose.yml (plan)'] });
    else if (state === 'error') setDiff(states, { state: 'error', message: 'Could not read the plan of the media stack' });
    else setDiff(states, { state: 'loading' });
}
if (states) {
    showState('ready');
    // Try again reads again: a moment of reading, then the changes.
    states.addEventListener('kp-diff-retry', () => {
        mark('diff-states', 'state', 'loading');
        showState('loading');
        window.setTimeout(() => {
            mark('diff-states', 'state', 'ready');
            showState('ready');
        }, 1200);
    });
}

// --- A long file ---------------------------------------------------------------------------------------------------------
const long = component('diff-long');
if (long) setDiff(long, { files: longFile() });

// --- The buttons at the components ---------------------------------------------------------------------------------------
/** Which attribute each group of buttons sets on its component. */
const ATTRIBUTES = ['open', 'bar', 'copy', 'context', 'words', 'max'];

document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? event.target.closest('[data-review-controls] button[aria-pressed]') : null;
    if (!button) return;
    const id = (button.closest('[data-review-controls]')?.getAttribute('data-review-controls-for') ?? '').replace(/-component$/, '');
    const target = component(id);
    if (!target) return;
    for (const name of ATTRIBUTES) {
        const value = button.getAttribute(`data-gdv-${name}`);
        if (value === null) continue;
        press(button);
        target.setAttribute(`data-kp-diff-${name === 'max' ? 'max-lines' : name}`, value);
        return;
    }
    const sample = button.getAttribute('data-gdv-sample');
    if (sample !== null) {
        press(button);
        const set = id === 'diff-context' ? CONTEXT_SAMPLES : WORD_SAMPLES;
        setDiff(target, { files: set[sample] });
        return;
    }
    const state = button.getAttribute('data-gdv-state');
    if (state !== null) {
        press(button);
        showState(state);
    }
});
