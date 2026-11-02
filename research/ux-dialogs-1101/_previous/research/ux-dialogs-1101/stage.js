// research/ux-dialogs-1101: one stage frame. `stage.html?scene=<scene>&v=<variant>&state=<state>` mounts a scene of
// stage-scenes.js with the variant's options, wires it with the package (js/auto.js attaches the dialogs, the drawers,
// the confirmations and the guard) and puts it in the state asked; the page around it calls `pgStage.set(state)` from its
// controls. Keys the frame does not use go up to the page, so the review dialog's keys keep working with the focus here.
import { markDialogSaved, requestDialogClose } from '../../js/overlays.js';
import { CATEGORIES, categories, profiles, prune, recipe, symptoms, typed } from './stage-scenes.js';

const params = new URLSearchParams(location.search);
const $ = (/** @type {string} */ id) => /** @type {HTMLElement | null} */ (document.getElementById(id));
const click = (/** @type {string} */ selector) => /** @type {HTMLElement | null} */ (document.querySelector(selector))?.click();
/** The words the plain confirmation used before [uxdialogs1101] (the dictionary's, written on the button), to show "now" beside "new". */
const BEFORE = { acceptLabel: 'Yes, do it', description: 'This cannot be undone. Cancel leaves everything as it is.' };
const PRUNE = 'Prune 8 dead letters? This cannot be undone.';

/** @typedef {{ build: (attrs: string) => string, variants: Record<string, string>, states: Record<string, () => void | Promise<void>> }} Scene */
/** @type {Record<string, Scene>} */
const SCENES = {
    categories: {
        build: categories,
        variants: { now: '', beside: ' data-kp-drawer-mode="beside"', narrow: ' data-kp-drawer-width="narrow"' },
        states: { add: () => click('#pg-cat-add'), edit: () => click('[data-pg-cat="soups"]'), closed: () => {} },
    },
    recipe: {
        build: recipe,
        variants: { wide: ' data-kp-drawer-width="wide"', guard: ' data-kp-drawer-width="wide" data-kp-dialog-guard closedby="any"' },
        states: { open: () => click('#pg-edit-carbonara'), changed: changeRecipe, asking: askRecipe, closed: () => {} },
    },
    symptoms: {
        build: symptoms,
        variants: { now: '', scrim: ' data-kp-backdrop="scrim"', sheet: ' data-kp-dialog-phone="sheet"' },
        states: { open: openSymptom, closed: () => {} },
    },
    profiles: {
        build: profiles,
        variants: { now: '', replace: ' data-kp-dialog-stack="replace"' },
        states: { manage: () => click('#pg-prof-open'), confirm: confirmProfile, closed: () => {} },
    },
    prune: {
        build: prune,
        variants: { now: ` data-kp-confirm="${PRUNE}" data-kp-confirm-label="${BEFORE.acceptLabel}" data-kp-confirm-description="${BEFORE.description}"`, new: ` data-kp-confirm="${PRUNE}"` },
        states: { confirm: () => click('#pg-prune'), closed: () => {} },
    },
    typed: {
        build: typed,
        variants: { now: '', new: '' },
        states: { confirm: () => click('#pg-del-sub'), closed: () => {} },
    },
};

/** A frame lets the paint settle before it presses the next control. */
const settle = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

/** The recipe editor open, with the English name changed after it opened. */
async function changeRecipe() {
    click('#pg-edit-carbonara');
    await settle();
    const dialog = /** @type {HTMLDialogElement} */ ($('pg-recipe-drawer'));
    const field = /** @type {HTMLInputElement} */ ($('pg-r-en'));
    markDialogSaved(dialog);
    field.value = 'Spaghetti carbonara';
    field.dispatchEvent(new Event('input', { bubbles: true }));
}
/** The changed editor, and Cancel pressed: the guard's question. */
async function askRecipe() {
    await changeRecipe();
    const dialog = /** @type {HTMLDialogElement} */ ($('pg-recipe-drawer'));
    requestDialogClose(dialog, undefined, dialog.querySelector('.kp-drawer__foot [data-kp-dialog-close]'));
}
async function openSymptom() {
    click('#pg-sym-add');
    await settle();
    const name = /** @type {HTMLInputElement | null} */ ($('pg-sym-name'));
    if (name) name.value = 'Migraine';
}
async function confirmProfile() {
    click('#pg-prof-open');
    await settle();
    click('#pg-del-travel');
}

/** Close every open dialog at once, the native way, so no guard or motion holds a state change up. */
function closeAll() {
    for (const dialog of [...document.querySelectorAll('dialog[open]')].reverse()) HTMLDialogElement.prototype.close.call(dialog, '');
}

const scene = SCENES[params.get('scene') ?? ''] ?? SCENES.symptoms;
const variant = params.get('v') ?? 'now';
const mount = /** @type {HTMLElement} */ ($('pg-stage'));
mount.innerHTML = scene.build(scene.variants[variant] ?? '');
document.documentElement.dataset.pgVariant = variant;
document.documentElement.dataset.pgScene = params.get('scene') ?? 'symptoms';

// Kitchen's drawer says which category it shows: Add, or the row's own names to edit.
document.addEventListener('kp-dialog-open', (event) => {
    const { trigger } = /** @type {CustomEvent<{ trigger: HTMLElement | null }>} */ (event).detail;
    if (/** @type {Element} */ (event.target).id !== 'pg-cat-drawer') return;
    const found = CATEGORIES.find(([key]) => key === trigger?.dataset.pgCat);
    const nl = /** @type {HTMLInputElement} */ ($('pg-cat-nl'));
    const en = /** @type {HTMLInputElement} */ ($('pg-cat-en'));
    nl.value = found ? String(found[1]) : '';
    en.value = found ? String(found[2]) : '';
    /** @type {HTMLElement} */ ($('pg-cat-title')).textContent = found ? `Edit ${found[2]}` : 'Add a category';
    const save = document.querySelector('#pg-cat-drawer [type="submit"]');
    if (save) save.textContent = found ? 'Save the category' : 'Add the category';
});
// A save in the stage keeps the page as it is: the stage shows the dialogs, not a server.
document.addEventListener('submit', (event) => {
    event.preventDefault();
    const dialog = /** @type {Element} */ (event.target).closest('dialog');
    if (dialog instanceof HTMLDialogElement) dialog.close('save');
});

// A modal opened or closed here by the page (a state, a frame that loads) takes the focus into this frame in Firefox, at once
// and also when the frame is not the one in use: the reviewer's note or keys would land here. While nobody uses the frame
// (it has no focus and no press came in the last second), opening and closing give the focus straight back to the element
// outside that had it, in the same task, and a focus() asked for meanwhile is left out. A press in the frame works as on any page.
let pressedAt = -Infinity;
for (const type of ['pointerdown', 'keydown']) addEventListener(type, (event) => event.isTrusted && (pressedAt = performance.now()), true);
const quiet = () => !document.hasFocus() && performance.now() - pressedAt > 1000;
/** The element the focus stands on, followed down through the frames from the top window, unless it is in this frame. */
function focusedOutside() {
    // The elements belong to other windows, so `instanceof` (this window's classes) never matches them: their tag names do.
    let el = /** @type {HTMLElement | null} */ (window.top?.document.activeElement ?? null);
    while (el?.tagName === 'IFRAME') {
        const frame = /** @type {HTMLIFrameElement} */ (el);
        if (frame.contentWindow === window || !frame.contentDocument?.activeElement) return null;
        el = /** @type {HTMLElement} */ (frame.contentDocument.activeElement);
    }
    return el && el.tagName !== 'BODY' && typeof el.focus === 'function' ? el : null;
}
for (const name of /** @type {const} */ (['showModal', 'show', 'close'])) {
    const own = /** @type {(this: HTMLDialogElement, ...args: unknown[]) => void} */ (HTMLDialogElement.prototype[name]);
    HTMLDialogElement.prototype[name] = function (/** @type {unknown[]} */ ...args) {
        const keep = quiet() ? focusedOutside() : null;
        own.apply(this, args);
        if (!keep) return;
        window.top?.focus();
        keep.focus({ preventScroll: true });
    };
}
const ownFocus = HTMLElement.prototype.focus;
HTMLElement.prototype.focus = function (/** @type {FocusOptions | undefined} */ options) {
    if (!quiet()) ownFocus.call(this, options);
};

let busy = Promise.resolve();
/** Settles once the first state (the address's) is set; until then `settled()` waits for it. @type {() => void} */
let begin = () => {};
const begun = new Promise((resolve) => {
    begin = () => resolve(undefined);
});
/** Put the stage in a state; states queue, so two presses never interleave. @param {string} state */
function set(state) {
    busy = busy.then(async () => {
        closeAll();
        await settle();
        await scene.states[state]?.();
        document.documentElement.dataset.pgState = state;
    });
    return busy;
}
Object.assign(window, { pgStage: { set, settled: () => begun.then(() => busy) } });

// The review dialog's keys (arrows, its letters) that nothing in the frame took go up to the page around it.
const TYPING = 'input, textarea, select, [contenteditable="true"]';
document.addEventListener('keydown', (event) => {
    if (parent === window || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
    if (['Escape', 'Tab', 'Enter', ' '].includes(event.key) || /** @type {Element} */ (event.target).matches?.(TYPING)) return;
    parent.document.dispatchEvent(new KeyboardEvent('keydown', { key: event.key, code: event.code, shiftKey: event.shiftKey, bubbles: true, cancelable: true }));
});

// js/auto.js is loaded once the scene stands, so it finds every part; it marks the root once they are attached.
await import('../../js/auto.js');
const ready = () => document.documentElement.hasAttribute('data-kp-auto-ready');
for (let wait = 0; !ready() && wait < 100; wait++) await new Promise((resolve) => setTimeout(resolve, 30));
void set(params.get('state') ?? 'closed');
begin();
