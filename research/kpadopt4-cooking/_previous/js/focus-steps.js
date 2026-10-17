// One step at a time, large, with the screen kept on [kpadopt4; the AuDHD recipe app's cook mode].
//
// A recipe on a phone or a tablet on the counter: one step on the screen, in
// large type, with what that step needs, and two big buttons to go back and
// on. It is for reading and following, where the wizard is a form filled in
// page by page and the step list shows a whole run at once.
//
//   <div class="kp-focus-steps" data-kp-focus-steps aria-label="Chicken curry"></div>
//
//   setFocusSteps(el, [{ text: 'Rinse the rice…', ingredients: [{ amount: '300 g', name: 'basmati rice' }],
//                        timer: { seconds: 600, name: 'Rice' }, note: 'Do not walk away: it catches fast.' }, …], { start: 2 });
//   el.addEventListener('kp-focus-steps-change', (e) => remember(e.detail.index));
//
// Parts, made by the module: a head (`__head`) with "Step 3 of 8"
// (`__count`), the theme's progress bar (`__bar`), Read aloud (`__speak`,
// when the browser can) and the screen line (`__wake`); a body (`__body`)
// holding the step (`__step`: `__text`, the ingredients for this step
// `__needs`, a timer button `__timer`, a note `__note`); the two buttons
// (`__nav`: `__prev`, `__next`, which says Done on the last step).
//
// What it does:
//   - The screen stays on while it is attached and the page is shown (the
//     Wake Lock API, where the browser has it), asked again when the page
//     comes back, let go on detach; the head says which it is ("Screen stays
//     on" / "Screen may dim"), `data-kp-focus-steps-screen="on|off|unsupported"`.
//     `data-kp-focus-steps-wake="false"` does not ask.
//   - ArrowRight, PageDown and Space go on; ArrowLeft and PageUp go back;
//     Home and End go to the first and last step. A swipe across the step
//     does the same on a touch screen.
//   - The step arrives the theme's way (js/motion.js, at once under reduced
//     motion); the buttons stand where they stand, whatever the step's
//     length; a long step scrolls inside the body.
//   - A screen reader hears "Step 3 of 8" and the step on every change.
//   - A step's timer button is a starter of js/timer.js
//     (`data-kp-focus-steps-timers` names the timer list).
//
// States: setFocusStepsState(el, 'loading' | 'error' | 'ready', message):
// loading lays the busy card over the body, error says the message there;
// no steps says `data-kp-focus-steps-empty` (or the dictionary's sentence).
//
// Events (bubbling, on the root):
//   kp-focus-steps-change  { index, from, total, step }
//   kp-focus-steps-done    { total }             Done pressed on the last step
//   kp-focus-steps-wake    { state }             the screen line changed
//
// Every word it adds is in js/strings.js. Nothing runs on import.

import { getStrings } from './strings.js';
import { buildProgressbar } from './progressbar.js';
import { openBusyCard } from './busy-card.js';

export const FOCUS_STEPS = '[data-kp-focus-steps]';
export const FOCUS_STEPS_EVENT = 'kp-focus-steps-change';
export const FOCUS_STEPS_DONE_EVENT = 'kp-focus-steps-done';
export const FOCUS_STEPS_WAKE_EVENT = 'kp-focus-steps-wake';
/** How far a finger has to travel across the step to turn it [px]. */
export const SWIPE_DISTANCE = 56;

/**
 * @typedef {object} FocusIngredient
 * @property {string} name
 * @property {string} [amount]
 */

/**
 * @typedef {object} FocusStep
 * @property {string} text
 * @property {(FocusIngredient | string)[]} [ingredients]
 * @property {{ seconds: number, name?: string }} [timer]
 * @property {string} [note]
 * @property {'info' | 'warning'} [noteTone]
 */

/** @typedef {{ steps: FocusStep[], index: number, wake: WakeLockSentinel | null, wakeState: string, busy: import('./busy-card.js').BusyCard | null }} FocusState */

/** @type {WeakMap<Element, FocusState>} */
const STATES = new WeakMap();
/** @type {WeakSet<Element>} */
const WIRED = new WeakSet();
let serial = 0;

/** @param {string} className @param {string} [tag] */
const el = (className, tag = 'div') => {
    const node = document.createElement(tag);
    node.className = className;
    return node;
};

/** @param {Element} root @returns {FocusState} */
const stateOf = (root) => {
    let state = STATES.get(root);
    if (!state) {
        state = { steps: [], index: 0, wake: null, wakeState: 'off', busy: null };
        STATES.set(root, state);
    }
    return state;
};

/** @param {Element} root @param {string} name @returns {HTMLElement} */
const part = (root, name) => /** @type {HTMLElement} */ (root.querySelector(`.kp-focus-steps__${name}`));

/** Lay the parts once. @param {HTMLElement} root */
function build(root) {
    if (root.querySelector(':scope > .kp-focus-steps__head')) return;
    const strings = getStrings();
    serial += 1;
    const head = el('kp-focus-steps__head');
    const count = el('kp-focus-steps__count');
    count.id = `kp-focus-steps-${serial}-count`;
    const bar = el('kp-progressbar kp-focus-steps__bar');
    bar.setAttribute('aria-hidden', 'true');
    buildProgressbar(bar);
    bar.removeAttribute('role');
    const tools = el('kp-focus-steps__tools');
    const wake = el('kp-focus-steps__wake', 'span');
    const speak = /** @type {HTMLButtonElement} */ (el('kp-button kp-button--sm kp-focus-steps__speak', 'button'));
    speak.type = 'button';
    const said = el('kp-focus-steps__speak-text', 'span');
    said.textContent = strings.focusReadAloud;
    said.setAttribute('data-kp-words', `${strings.focusReadAloud}\n${strings.focusStopReading}`);
    speak.append(said);
    speak.setAttribute('aria-pressed', 'false');
    speak.hidden = typeof speechSynthesis === 'undefined';
    tools.append(wake, speak);
    head.append(count, tools, bar);
    const body = el('kp-focus-steps__body');
    const step = el('kp-focus-steps__step', 'article');
    step.setAttribute('aria-labelledby', count.id);
    step.tabIndex = -1;
    body.append(step);
    const nav = el('kp-focus-steps__nav');
    const prev = /** @type {HTMLButtonElement} */ (el('kp-button kp-button--lg kp-focus-steps__prev', 'button'));
    prev.type = 'button';
    const next = /** @type {HTMLButtonElement} */ (el('kp-button kp-button--lg kp-button--primary kp-focus-steps__next', 'button'));
    next.type = 'button';
    for (const [button, word, glyph] of /** @type {const} */ ([
        [prev, strings.focusPrevious, 'prev'],
        [next, strings.focusNext, 'next'],
    ])) {
        const mark = el(`kp-focus-steps__glyph kp-focus-steps__glyph--${glyph}`, 'span');
        mark.setAttribute('aria-hidden', 'true');
        const text = el('kp-button__text', 'span');
        text.textContent = word;
        if (glyph === 'prev') button.append(mark, text);
        else button.append(text, mark);
    }
    nav.append(prev, next);
    const live = el('kp-sr-only kp-focus-steps__live', 'span');
    live.setAttribute('role', 'status');
    root.append(head, body, nav, live);
    if (!root.hasAttribute('role')) root.setAttribute('role', 'region');
    if (root.tabIndex < 0 && !root.hasAttribute('tabindex')) root.tabIndex = -1;
}

/** @param {Element} root @param {string} message */
function say(root, message) {
    const region = part(root, 'live');
    region.textContent = '';
    setTimeout(() => (region.textContent = message), 60);
}

/** Write the step shown, its count and bar, and the buttons. @param {HTMLElement} root @param {boolean} arrive */
function paint(root, arrive) {
    const strings = getStrings();
    const state = stateOf(root);
    const { steps, index } = state;
    const total = steps.length;
    const step = steps[index];
    part(root, 'count').textContent = total ? strings.focusCount(index + 1, total) : '';
    const bar = part(root, 'bar');
    bar.style.setProperty('--kp-value', String(total ? (index + 1) / total : 0));
    const holder = part(root, 'step');
    const error = root.getAttribute('data-kp-focus-steps-error');
    holder.replaceChildren();
    holder.removeAttribute('data-kp-focus-steps-kind');
    if (error !== null) {
        const alert = el('kp-alert kp-alert--destructive kp-focus-steps__message', 'p');
        alert.setAttribute('role', 'alert');
        alert.textContent = error;
        holder.append(alert);
        holder.setAttribute('data-kp-focus-steps-kind', 'error');
    } else if (!step) {
        if (!root.hasAttribute('aria-busy')) {
            const empty = el('kp-empty kp-focus-steps__message', 'p');
            empty.textContent = root.getAttribute('data-kp-focus-steps-empty') ?? strings.focusEmpty;
            holder.append(empty);
            holder.setAttribute('data-kp-focus-steps-kind', 'empty');
        }
    } else {
        const text = el('kp-focus-steps__text', 'p');
        text.textContent = step.text;
        holder.append(text);
        if (step.ingredients?.length) {
            const needs = el('kp-focus-steps__needs', 'section');
            const title = el('kp-focus-steps__needs-title', 'h3');
            serial += 1;
            title.id = `kp-focus-steps-${serial}-needs`;
            title.textContent = strings.focusNeeds;
            needs.setAttribute('aria-labelledby', title.id);
            const list = el('kp-focus-steps__needs-list', 'ul');
            for (const item of step.ingredients) {
                const row = el('kp-focus-steps__need', 'li');
                const { name, amount } = typeof item === 'string' ? { name: item, amount: '' } : item;
                const a = el('kp-focus-steps__amount', 'span');
                a.textContent = amount ?? '';
                const n = el('kp-focus-steps__name', 'span');
                n.textContent = name;
                row.append(a, n);
                list.append(row);
            }
            needs.append(title, list);
            holder.append(needs);
        }
        if (step.timer && step.timer.seconds > 0) {
            const minutes = Math.round(step.timer.seconds / 60);
            const button = /** @type {HTMLButtonElement} */ (el('kp-button kp-focus-steps__timer', 'button'));
            button.type = 'button';
            button.setAttribute('data-kp-timer-start', String(step.timer.seconds));
            button.setAttribute('data-kp-timer-name', step.timer.name ?? strings.focusCount(index + 1, total));
            const list = root.getAttribute('data-kp-focus-steps-timers');
            if (list) button.setAttribute('data-kp-timer-for', list);
            button.textContent = strings.focusTimer(step.timer.seconds < 60 ? `${step.timer.seconds} s` : `${minutes} min`);
            holder.append(button);
        }
        if (step.note) {
            const note = el(`kp-alert kp-alert--${step.noteTone === 'warning' ? 'warning' : 'info'} kp-focus-steps__note`, 'p');
            note.textContent = step.note;
            holder.append(note);
        }
    }
    const prev = /** @type {HTMLButtonElement} */ (part(root, 'prev'));
    const next = /** @type {HTMLButtonElement} */ (part(root, 'next'));
    const busy = root.hasAttribute('aria-busy');
    const blocked = !step || error !== null || busy;
    if (blocked || index === 0) prev.setAttribute('aria-disabled', 'true');
    else prev.removeAttribute('aria-disabled');
    if (blocked) next.setAttribute('aria-disabled', 'true');
    else next.removeAttribute('aria-disabled');
    const last = total > 0 && index === total - 1;
    const nextText = /** @type {HTMLElement} */ (next.querySelector('.kp-button__text'));
    nextText.textContent = last ? strings.focusDone : strings.focusNext;
    next.toggleAttribute('data-kp-focus-steps-last', last);
    part(root, 'body').scrollTop = 0;
    if (arrive) void import('./motion.js').then((m) => holder.isConnected && m.arriveShown(holder));
}

/** The screen line. @param {HTMLElement} root @param {string} wakeState */
function paintWake(root, wakeState) {
    const state = stateOf(root);
    const changed = state.wakeState !== wakeState;
    state.wakeState = wakeState;
    root.setAttribute('data-kp-focus-steps-screen', wakeState);
    const strings = getStrings();
    const line = part(root, 'wake');
    if (line)
        line.textContent =
            wakeState === 'on' ? strings.focusWakeOn : wakeState === 'unsupported' ? strings.focusWakeUnsupported : strings.focusWakeOff;
    if (changed) root.dispatchEvent(new CustomEvent(FOCUS_STEPS_WAKE_EVENT, { bubbles: true, detail: { state: wakeState } }));
}

/** Ask for the screen to stay on. @param {HTMLElement} root */
async function holdScreen(root) {
    if (root.getAttribute('data-kp-focus-steps-wake') === 'false') return paintWake(root, 'off');
    const lock = /** @type {any} */ (navigator).wakeLock;
    if (!lock?.request) return paintWake(root, 'unsupported');
    if (document.visibilityState !== 'visible') return;
    const state = stateOf(root);
    if (state.wake && !state.wake.released) return paintWake(root, 'on');
    try {
        const sentinel = /** @type {WakeLockSentinel} */ (await lock.request('screen'));
        if (!WIRED.has(root)) {
            void sentinel.release();
            return;
        }
        state.wake = sentinel;
        sentinel.addEventListener('release', () => {
            if (stateOf(root).wake === sentinel) paintWake(root, 'off');
        });
        paintWake(root, 'on');
    } catch {
        paintWake(root, 'off');
    }
}

/** @param {HTMLElement} root */
function letScreenGo(root) {
    const state = stateOf(root);
    const sentinel = state.wake;
    state.wake = null;
    if (sentinel && !sentinel.released) void sentinel.release().catch(() => undefined);
}

/**
 * Go to a step (as a person did: the event fires when it moved).
 * @param {Element} root @param {number} index
 * @returns {boolean} whether it moved
 */
export function goToStep(root, index) {
    if (!(root instanceof HTMLElement)) return false;
    const state = stateOf(root);
    const to = Math.max(0, Math.min(state.steps.length - 1, index));
    if (!state.steps.length || to === state.index || root.hasAttribute('aria-busy')) return false;
    const from = state.index;
    state.index = to;
    if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
    paint(root, true);
    const strings = getStrings();
    say(root, `${strings.focusCount(to + 1, state.steps.length)}. ${state.steps[to].text}`);
    root.dispatchEvent(
        new CustomEvent(FOCUS_STEPS_EVENT, { bubbles: true, detail: { index: to, from, total: state.steps.length, step: state.steps[to] } }),
    );
    return true;
}

/** @param {Element} root */
export const getStepIndex = (root) => stateOf(root).index;

/**
 * Give the steps, and where to begin (to come back where a person stopped).
 * No event: the page knows.
 * @param {Element} root @param {FocusStep[]} steps @param {{ start?: number }} [options]
 */
export function setFocusSteps(root, steps, { start = 0 } = {}) {
    if (!(root instanceof HTMLElement)) return;
    build(root);
    const state = stateOf(root);
    state.steps = steps.map((step) => ({ ...step }));
    state.index = Math.max(0, Math.min(steps.length - 1, start));
    if (steps.some((step) => step.timer)) void import('./timer.js').then((m) => m.attachTimers(root));
    paint(root, false);
}

/**
 * The state: `loading` lays the busy card over the body, `error` says the
 * message where the step was, `ready` is neither.
 * @param {Element} root @param {'loading' | 'error' | 'ready'} kind @param {string} [message]
 */
export function setFocusStepsState(root, kind, message) {
    if (!(root instanceof HTMLElement)) return;
    build(root);
    const state = stateOf(root);
    root.setAttribute('data-kp-state', kind);
    if (kind === 'error') root.setAttribute('data-kp-focus-steps-error', message ?? getStrings().focusFailed);
    else root.removeAttribute('data-kp-focus-steps-error');
    if (kind === 'loading') {
        root.setAttribute('aria-busy', 'true');
        const body = part(root, 'body');
        state.busy ??= openBusyCard(body, { words: message ?? getStrings().focusLoading, area: () => [body], className: 'kp-focus-steps__busy' });
    } else {
        root.removeAttribute('aria-busy');
        const card = state.busy;
        state.busy = null;
        void card?.close();
    }
    paint(root, false);
}

/** @param {EventTarget | null} target */
const typing = (target) => target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

/**
 * Wire every focus-steps view under `root`: its buttons, keys, swipe, Read
 * aloud, and the screen kept on until the detach.
 * @param {ParentNode} [scope]
 * @returns {() => void} detach
 */
export function attachFocusSteps(scope = document) {
    const roots = /** @type {HTMLElement[]} */ ([
        ...(scope instanceof HTMLElement && scope.matches(FOCUS_STEPS) ? [scope] : []),
        ...scope.querySelectorAll(FOCUS_STEPS),
    ]);
    /** @type {(() => void)[]} */
    const undo = [];
    for (const root of roots) {
        if (WIRED.has(root)) continue;
        WIRED.add(root);
        build(root);
        paint(root, false);
        void holdScreen(root);
        const state = stateOf(root);
        const next = () => {
            if (state.index === state.steps.length - 1 && state.steps.length && !root.hasAttribute('aria-busy')) {
                root.dispatchEvent(new CustomEvent(FOCUS_STEPS_DONE_EVENT, { bubbles: true, detail: { total: state.steps.length } }));
                return;
            }
            goToStep(root, state.index + 1);
        };
        const prev = () => goToStep(root, state.index - 1);
        /** @param {MouseEvent} event */
        const click = (event) => {
            const button = event.target instanceof Element ? event.target.closest('button') : null;
            if (!button || !root.contains(button) || button.getAttribute('aria-disabled') === 'true') return;
            if (button.classList.contains('kp-focus-steps__next')) next();
            else if (button.classList.contains('kp-focus-steps__prev')) prev();
            else if (button.classList.contains('kp-focus-steps__speak')) {
                const strings = getStrings();
                if (speechSynthesis.speaking) {
                    speechSynthesis.cancel();
                    return;
                }
                const step = state.steps[state.index];
                if (!step) return;
                const utterance = new SpeechSynthesisUtterance([step.text, step.note ?? ''].filter(Boolean).join('. '));
                utterance.lang = root.closest('[lang]')?.getAttribute('lang') ?? '';
                const word = /** @type {HTMLElement} */ (button.querySelector('.kp-focus-steps__speak-text'));
                word.textContent = strings.focusStopReading;
                button.setAttribute('aria-pressed', 'true');
                utterance.onend = utterance.onerror = () => {
                    word.textContent = strings.focusReadAloud;
                    button.setAttribute('aria-pressed', 'false');
                };
                speechSynthesis.speak(utterance);
            }
        };
        /** @param {KeyboardEvent} event */
        const key = (event) => {
            if (event.altKey || event.ctrlKey || event.metaKey || typing(event.target)) return;
            const onButton = event.target instanceof Element && event.target.closest('button, a, [role="button"]');
            const rtl = getComputedStyle(root).direction === 'rtl';
            let act = null;
            if (event.key === 'PageDown' || event.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) act = next;
            else if (event.key === 'PageUp' || event.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) act = prev;
            else if (event.key === ' ' && !onButton) act = next;
            else if (event.key === 'Home') act = () => goToStep(root, 0);
            else if (event.key === 'End') act = () => goToStep(root, state.steps.length - 1);
            if (!act) return;
            event.preventDefault();
            act();
        };
        /** @type {{ x: number, y: number, id: number } | null} */
        let touch = null;
        /** @param {PointerEvent} event */
        const down = (event) => {
            if (event.pointerType === 'mouse' || !(event.target instanceof Element) || !part(root, 'body').contains(event.target)) return;
            touch = { x: event.clientX, y: event.clientY, id: event.pointerId };
        };
        /** @param {PointerEvent} event */
        const up = (event) => {
            if (!touch || touch.id !== event.pointerId) return;
            const dx = event.clientX - touch.x;
            const dy = event.clientY - touch.y;
            touch = null;
            if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy) * 1.5) return;
            const rtl = getComputedStyle(root).direction === 'rtl';
            if (dx < 0 !== rtl) next();
            else prev();
        };
        const cancel = () => (touch = null);
        const back = () => {
            if (document.visibilityState === 'visible') void holdScreen(root);
        };
        root.addEventListener('click', click);
        root.addEventListener('keydown', key);
        root.addEventListener('pointerdown', down);
        root.addEventListener('pointerup', up);
        root.addEventListener('pointercancel', cancel);
        document.addEventListener('visibilitychange', back);
        undo.push(() => {
            WIRED.delete(root);
            root.removeEventListener('click', click);
            root.removeEventListener('keydown', key);
            root.removeEventListener('pointerdown', down);
            root.removeEventListener('pointerup', up);
            root.removeEventListener('pointercancel', cancel);
            document.removeEventListener('visibilitychange', back);
            if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
            letScreenGo(root);
            paintWake(root, 'off');
        });
    }
    return () => undo.forEach((u) => u());
}
