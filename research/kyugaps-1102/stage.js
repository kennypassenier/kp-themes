// research/kyugaps-1102: one stage frame. `stage.html?scene=<scene>&v=<variant>&state=<state>` mounts a scene of
// stage-scenes.js with the variant's options, wires it with the package (js/auto.js attaches the table and the selection
// bar; the tour is started here, as kyu's Help does) and puts it in the state asked; the page around it calls
// `pgStage.set(state)` from its controls. Keys the frame does not use go up to the page, so the review dialog's keys work.
import { startTour } from '../../js/tour.js';
import { busy, dead } from './stage-scenes.js';

const params = new URLSearchParams(location.search);

/** A frame lets the paint settle before it presses the next control. */
const settle = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

/** Tick these rows of the dead letters table and untick the rest, as a reader's clicks do. @param {string[]} keys */
function tick(keys) {
    for (const box of /** @type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll('#pg-dead-table tbody [data-kp-select-row]'))) {
        const wanted = keys.includes(box.closest('tr')?.dataset.kpRowKey ?? '');
        if (box.checked !== wanted) box.click();
    }
}

/** @type {{ end: (finished?: boolean) => void } | null} */
let tour = null;
/** kyu's tour step on the dead letters card: the whole card is the part, however tall it is. */
const STEP = { target: '#pg-dead', title: 'Dead letters', text: 'A message nobody could deliver. Requeue puts it back in line; Delete removes it after you type the name.' };
function endTour() {
    tour?.end(false);
    tour = null;
}

/** @typedef {{ build: (attrs: string) => string, variants: Record<string, string>, states: Record<string, () => void | Promise<void>> }} Scene */
/** @type {Record<string, Scene>} */
const SCENES = {
    dead: {
        build: dead,
        variants: { hold: '', fold: ' data-kp-selection-room="fold"' },
        states: { none: () => tick([]), two: () => tick(['d-4812', 'd-4807']) },
    },
    tour: {
        build: busy,
        variants: { fixed: '' },
        states: {
            tour: () => {
                endTour();
                scrollTo(0, 0);
                tour = startTour([STEP]);
            },
            closed: () => {
                endTour();
                scrollTo(0, 0);
            },
        },
    },
};

const scene = SCENES[params.get('scene') ?? ''] ?? SCENES.dead;
const variant = params.get('v') ?? '';
const mount = /** @type {HTMLElement} */ (document.getElementById('pg-stage'));
mount.innerHTML = scene.build(scene.variants[variant] ?? '');
document.documentElement.dataset.pgVariant = variant;
document.documentElement.dataset.pgScene = params.get('scene') ?? 'dead';
document.getElementById('pg-help')?.addEventListener('click', () => void set('tour'));

// A dialog (the tour card) opened or closed here by the page (a state, a frame that loads) takes the focus into this frame in Firefox, at once
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

// scrollIntoView in a frame also scrolls every page around it (the review dialog's lane, which then no longer starts at the
// section): here the tour's scroll to its part moves this frame alone, to the nearest edge, a part taller than the frame by its top.
Element.prototype.scrollIntoView = function () {
    const box = this.getBoundingClientRect();
    if (box.top < 0 || box.height > innerHeight) scrollBy(0, box.top);
    else if (box.bottom > innerHeight) scrollBy(0, box.bottom - innerHeight);
};

let queue = Promise.resolve();
/** Settles once the first state (the address's) is set; until then `settled()` waits for it. @type {() => void} */
let begin = () => {};
const begun = new Promise((resolve) => {
    begin = () => resolve(undefined);
});
/** Put the stage in a state; states queue, so two presses never interleave. @param {string} state */
function set(state) {
    queue = queue.then(async () => {
        await settle();
        await scene.states[state]?.();
        document.documentElement.dataset.pgState = state;
    });
    return queue;
}
Object.assign(window, { pgStage: { set, settled: () => begun.then(() => queue) } });

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
void set(params.get('state') ?? 'none');
begin();
