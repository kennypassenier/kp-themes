// Kitchen timers: named countdowns that keep running [kpadopt4; the AuDHD recipe app].
//
// One or more countdowns, each with a name ("Rice", "Sauce"), side by side.
// The alarm (js/alarm.js) is a notice that counts down until it closes; a
// timer is a clock a person starts and that goes on until it is done.
//
//   <div class="kp-timers" data-kp-timers aria-label="Kitchen timers"></div>
//   <button class="kp-button" data-kp-timer-start="10m" data-kp-timer-name="Simmer the sauce">Simmer 10 min</button>
//
//   startTimer(list, { name: 'Rice', seconds: 12 * 60 });
//   list.addEventListener('kp-timer-done', (e) => …);
//
// A starter (`data-kp-timer-start`, a duration: "10m", "1h30m", "90s",
// "10:00" or seconds; `data-kp-timer-name`; `data-kp-timer-for` names the
// list, else the page's first) may stand anywhere in the page, in the text of
// a recipe step. Pressed again while its timer runs, it does not start a
// second one: the focus goes to the one that runs.
//
// What it does:
//   - Each timer is a card (`.kp-timer`): its name, a state word, the time
//     left large and in figures of one width, the theme's progress bar, and
//     Pause or Resume, +1 min and Remove. Nothing in a card changes size as
//     the clock runs or the state changes.
//   - It counts from the moment it ends, never by ticks: a page in the
//     background, a phone that locked, a laptop that slept all show the right
//     time again the moment they are back.
//   - When one ends: its card turns to the done plate with the name large
//     ("Rice is done") and one big Stop button; a soft two-note chime plays
//     every few seconds (`data-kp-timers-ring` seconds, 60; 0 is once;
//     `data-kp-timers-sound="off"` none), the phone buzzes where it can, and
//     the system shows a notification when the page has the permission
//     (askTimerNotifications() asks, from a press). +1 min on a done timer
//     starts it again for a minute.
//   - A screen reader hears a start, the last minute and the end (the end
//     at once, the rest politely), never every second.
//
// Nothing is stored: getTimers() gives the state (with each end time) for
// the page to keep, restoreTimers() puts it back after a reload.
//
// Events (bubbling, on the list):
//   kp-timer-start   { timer }
//   kp-timer-change  { timer, action: 'pause' | 'resume' | 'add' | 'stop-ring' }
//   kp-timer-done    { timer }
//   kp-timer-stop    { timer }            removed
//
// Every word it adds is in js/strings.js. Nothing runs on import.

import { getStrings } from './strings.js';
import { buildProgressbar } from './progressbar.js';

/** The lists this module looks after. */
export const TIMERS = '[data-kp-timers]';
/** A button anywhere in the page that starts a timer. */
export const TIMER_START = '[data-kp-timer-start]';
export const TIMER_START_EVENT = 'kp-timer-start';
export const TIMER_CHANGE_EVENT = 'kp-timer-change';
export const TIMER_DONE_EVENT = 'kp-timer-done';
export const TIMER_STOP_EVENT = 'kp-timer-stop';
/** How often the shown time is brought up to date [ms]; the time itself comes from the end, not from this. */
export const TIMER_TICK_MS = 250;

/**
 * @typedef {object} TimerState
 * @property {string} id
 * @property {string} name
 * @property {number} seconds  the length it was started with (plus what was added)
 * @property {number} remaining  seconds left, now
 * @property {number | null} endsAt  epoch ms it ends at while running, else null
 * @property {'running' | 'paused' | 'done'} state
 */

/**
 * @typedef {object} Timer
 * @property {string} id
 * @property {string} name
 * @property {number} total  ms
 * @property {number | null} endsAt  epoch ms, while running
 * @property {number} left  ms, while paused or done
 * @property {'running' | 'paused' | 'done'} state
 * @property {boolean} warned  the last minute was said
 * @property {ReturnType<typeof setInterval> | null} ring
 * @property {HTMLElement} card
 */

/** Per list: its timers, in the order they were started. @type {WeakMap<Element, Map<string, Timer>>} */
const LISTS = new WeakMap();
/** Per list: its ticker. @type {WeakMap<Element, ReturnType<typeof setInterval>>} */
const TICKERS = new WeakMap();
/** Lists already wired. @type {WeakSet<Element>} */
const WIRED = new WeakSet();
/** Starter presses already handled, when two attached roots hear the same one. @type {WeakSet<Event>} */
const HANDLED = new WeakSet();
/** @type {AudioContext | null} */
let audio = null;
let serial = 0;

/**
 * A duration in seconds from "10m", "1h30m", "90s", "1h 5m 30s", "10:00",
 * "1:30:00" or a bare number of seconds. NaN when it is none of those.
 * @param {string | number} text
 * @returns {number}
 */
export function parseDuration(text) {
    if (typeof text === 'number') return text;
    const t = text.trim().toLowerCase();
    if (/^\d+(\.\d+)?$/.test(t)) return Number(t);
    if (/^\d+(:\d{1,2}){1,2}$/.test(t)) return t.split(':').reduce((sum, part) => sum * 60 + Number(part), 0);
    const parts = [...t.matchAll(/(\d+(?:\.\d+)?)\s*(h|m|s)/g)];
    if (
        !parts.length ||
        parts
            .map((m) => m[0])
            .join('')
            .replace(/\s/g, '') !== t.replace(/\s/g, '')
    )
        return NaN;
    return parts.reduce((sum, [, n, unit]) => sum + Number(n) * (unit === 'h' ? 3600 : unit === 'm' ? 60 : 1), 0);
}

/**
 * The time left as a clock: "9:05", "1:02:03". Rounded up to the whole
 * second, so it shows 0:00 only when it is done.
 * @param {number} ms
 */
export function formatClock(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const two = (/** @type {number} */ n) => String(n).padStart(2, '0');
    return h > 0 ? `${h}:${two(m)}:${two(s)}` : `${m}:${two(s)}`;
}

/** @param {Timer} timer */
const leftOf = (timer) => (timer.state === 'running' && timer.endsAt !== null ? Math.max(0, timer.endsAt - Date.now()) : timer.left);

/** @param {Timer} timer @returns {TimerState} */
const stateOf = (timer) => ({
    id: timer.id,
    name: timer.name,
    seconds: Math.round(timer.total / 1000),
    remaining: Math.ceil(leftOf(timer) / 1000),
    endsAt: timer.state === 'running' ? timer.endsAt : null,
    state: timer.state,
});

/** @param {Element} list @returns {TimerState[]} */
export function getTimers(list) {
    return [...(LISTS.get(list)?.values() ?? [])].map(stateOf);
}

/** @param {string} className @param {string} [tag] */
const el = (className, tag = 'div') => {
    const node = document.createElement(tag);
    node.className = className;
    return node;
};

/** @param {Element} list @param {string} name @returns {HTMLElement} */
function part(list, name) {
    let node = /** @type {HTMLElement | null} */ (list.querySelector(`:scope > .kp-timers__${name}`));
    if (node) return node;
    if (name === 'list') {
        node = el('kp-timers__list', 'ul');
        list.prepend(node);
    } else if (name === 'empty') {
        node = el('kp-timers__empty', 'p');
        part(list, 'list').after(node);
    } else {
        node = el(`kp-sr-only kp-timers__${name}`, 'span');
        node.setAttribute('role', name === 'alert' ? 'alert' : 'status');
        list.append(node);
    }
    return node;
}

/** @param {Element} list @param {string} message @param {'live' | 'alert'} [where] */
function say(list, message, where = 'live') {
    const region = part(list, where);
    region.textContent = '';
    setTimeout(() => (region.textContent = message), 60);
}

/** @param {Element} list */
const listOf = (list) => {
    let timers = LISTS.get(list);
    if (!timers) {
        timers = new Map();
        LISTS.set(list, timers);
    }
    return timers;
};

/**
 * A card for a timer, its parts in place.
 * @param {string} id
 * @returns {HTMLElement}
 */
function buildCard(id) {
    const strings = getStrings();
    const card = el('kp-timer', 'li');
    card.setAttribute('data-kp-timer-id', id);
    serial += 1;
    const head = el('kp-timer__head');
    const name = el('kp-timer__name', 'span');
    name.id = `kp-timer-${serial}-name`;
    const word = el('kp-timer__state', 'span');
    word.setAttribute('data-kp-words', [strings.timerRunning, strings.timerPaused, strings.timerDoneWord].join('\n'));
    head.append(name, word);
    const time = el('kp-timer__time');
    time.setAttribute('role', 'timer');
    time.setAttribute('aria-labelledby', name.id);
    const bar = el('kp-progressbar kp-timer__bar');
    bar.setAttribute('aria-hidden', 'true');
    buildProgressbar(bar);
    bar.removeAttribute('role');
    const actions = el('kp-timer__actions');
    const toggle = /** @type {HTMLButtonElement} */ (el('kp-button kp-timer__toggle', 'button'));
    toggle.type = 'button';
    const more = /** @type {HTMLButtonElement} */ (el('kp-button kp-timer__more', 'button'));
    more.type = 'button';
    const remove = /** @type {HTMLButtonElement} */ (el('kp-button kp-button--ghost kp-timer__remove', 'button'));
    remove.type = 'button';
    const glyph = el('kp-timer__remove-glyph', 'span');
    glyph.setAttribute('aria-hidden', 'true');
    remove.append(glyph);
    actions.append(toggle, more, remove);
    card.append(head, time, bar, actions);
    card.setAttribute('aria-labelledby', name.id);
    return card;
}

/** Bring a card in step with its timer. @param {Timer} timer */
function paint(timer) {
    const strings = getStrings();
    const { card } = timer;
    const left = leftOf(timer);
    card.setAttribute('data-kp-timer-state', timer.state);
    const name = /** @type {HTMLElement} */ (card.querySelector('.kp-timer__name'));
    if (name.textContent !== timer.name) {
        name.textContent = timer.name;
        name.title = timer.name;
    }
    const word = /** @type {HTMLElement} */ (card.querySelector('.kp-timer__state'));
    word.textContent = timer.state === 'running' ? strings.timerRunning : timer.state === 'paused' ? strings.timerPaused : strings.timerDoneWord;
    const time = /** @type {HTMLElement} */ (card.querySelector('.kp-timer__time'));
    const shown = timer.state === 'done' ? strings.timerDone(timer.name) : formatClock(left);
    if (time.textContent !== shown) time.textContent = shown;
    time.title = timer.state === 'done' ? shown : '';
    const bar = /** @type {HTMLElement} */ (card.querySelector('.kp-timer__bar'));
    bar.style.setProperty('--kp-value', String(timer.total > 0 ? Math.min(1, 1 - left / timer.total) : 1));
    const toggle = /** @type {HTMLButtonElement} */ (card.querySelector('.kp-timer__toggle'));
    const label = timer.state === 'running' ? strings.timerPause : timer.state === 'paused' ? strings.timerResume : strings.timerStopRing;
    if (toggle.textContent !== label) toggle.textContent = label;
    toggle.classList.toggle('kp-button--primary', timer.state === 'done');
    toggle.setAttribute('data-kp-words', [strings.timerPause, strings.timerResume, strings.timerStopRing].join('\n'));
    const more = /** @type {HTMLButtonElement} */ (card.querySelector('.kp-timer__more'));
    more.textContent = strings.timerAddMinute;
    more.setAttribute('aria-label', strings.timerAddMinuteTo(timer.name));
    const remove = /** @type {HTMLButtonElement} */ (card.querySelector('.kp-timer__remove'));
    remove.setAttribute('aria-label', strings.timerRemove(timer.name));
    remove.title = strings.timerRemove(timer.name);
}

/** Show or hide the empty line, start or stop the ticker. @param {HTMLElement} list */
function sync(list) {
    const timers = listOf(list);
    const empty = part(list, 'empty');
    empty.textContent = list.getAttribute('data-kp-timers-empty') ?? getStrings().timerEmpty;
    empty.hidden = timers.size > 0;
    const running = [...timers.values()].some((t) => t.state === 'running');
    const ticker = TICKERS.get(list);
    if (running && !ticker)
        TICKERS.set(
            list,
            setInterval(() => tick(list), TIMER_TICK_MS),
        );
    else if (!running && ticker) {
        clearInterval(ticker);
        TICKERS.delete(list);
    }
}

/** @param {HTMLElement} list */
function tick(list) {
    for (const timer of listOf(list).values()) {
        if (timer.state !== 'running') continue;
        const left = leftOf(timer);
        if (left <= 0) finish(list, timer);
        else {
            if (!timer.warned && left <= 60_000 && timer.total > 90_000) {
                timer.warned = true;
                say(list, getStrings().timerLastMinute(timer.name));
            }
            paint(timer);
        }
    }
    sync(list);
}

/** A soft two-note chime, from the page's own sound: no file to fetch. */
function chime() {
    try {
        const Context = window.AudioContext ?? /** @type {any} */ (window).webkitAudioContext;
        if (!Context) return;
        audio ??= new Context();
        const ctx = /** @type {AudioContext} */ (audio);
        if (ctx.state === 'suspended') void ctx.resume();
        const at = ctx.currentTime + 0.02;
        [659.25, 880].forEach((hz, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = hz;
            const start = at + i * 0.32;
            gain.gain.setValueAtTime(0.0001, start);
            gain.gain.exponentialRampToValueAtTime(0.16, start + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);
            osc.connect(gain).connect(ctx.destination);
            osc.start(start);
            osc.stop(start + 0.95);
        });
    } catch {
        // No sound where the page may not make one; the card and the alert still say it.
    }
}

/** Wake the sound up from a press, so the chime may play later without one. */
function primeSound() {
    try {
        const Context = window.AudioContext ?? /** @type {any} */ (window).webkitAudioContext;
        if (!Context) return;
        audio ??= new Context();
        if (audio.state === 'suspended') void audio.resume();
    } catch {
        // As above.
    }
}

/** @param {Timer} timer */
function stopRing(timer) {
    if (timer.ring !== null) clearInterval(timer.ring);
    timer.ring = null;
    timer.card.removeAttribute('data-kp-timer-ringing');
}

/**
 * A timer has ended: the done plate, the chime, a buzz, a notification, the
 * alert and the event.
 * @param {HTMLElement} list @param {Timer} timer @param {{ quiet?: boolean }} [options]
 */
function finish(list, timer, { quiet = false } = {}) {
    timer.state = 'done';
    timer.endsAt = null;
    timer.left = 0;
    paint(timer);
    const strings = getStrings();
    say(list, strings.timerDone(timer.name), 'alert');
    if (!quiet) {
        if (list.getAttribute('data-kp-timers-sound') !== 'off') {
            chime();
            const ring = Number(list.getAttribute('data-kp-timers-ring') ?? 60);
            if (ring > 0) {
                const until = Date.now() + ring * 1000;
                timer.card.setAttribute('data-kp-timer-ringing', '');
                timer.ring = setInterval(() => {
                    if (Date.now() >= until || timer.state !== 'done') return stopRing(timer);
                    chime();
                }, 4000);
            }
        }
        navigator.vibrate?.([300, 150, 300]);
        if (list.getAttribute('data-kp-timers-notify') !== 'false' && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            try {
                new Notification(strings.timerDone(timer.name), { tag: `kp-timer-${timer.id}` });
            } catch {
                // A page that may not raise one from here (a phone's tab): the card says it.
            }
        }
    }
    list.dispatchEvent(new CustomEvent(TIMER_DONE_EVENT, { bubbles: true, detail: { timer: stateOf(timer) } }));
}

/**
 * Ask the browser for permission to show a system notification when a timer
 * ends. Call it from a press. Resolves with the answer.
 * @returns {Promise<NotificationPermission | 'unsupported'>}
 */
export async function askTimerNotifications() {
    if (typeof Notification === 'undefined') return 'unsupported';
    if (Notification.permission !== 'default') return Notification.permission;
    return Notification.requestPermission();
}

/** @param {HTMLElement} list @param {Timer} timer @param {string} type @param {object} [extra] */
const emit = (list, timer, type, extra = {}) =>
    list.dispatchEvent(new CustomEvent(type, { bubbles: true, detail: { timer: stateOf(timer), ...extra } }));

/** @param {Element} list @param {string} id */
const find = (list, id) => LISTS.get(list)?.get(id) ?? null;

/**
 * Start a timer. With an `id` that already runs, nothing new starts and that
 * id is returned.
 * @param {Element} list
 * @param {{ name: string, seconds: number, id?: string }} options
 * @returns {string | null} the timer's id
 */
export function startTimer(list, { name, seconds, id }) {
    if (!(list instanceof HTMLElement) || !(seconds > 0)) return null;
    const timers = listOf(list);
    const key = id ?? `t${Date.now().toString(36)}${(serial += 1)}`;
    const existing = timers.get(key);
    if (existing && existing.state !== 'done') return key;
    if (existing) removeCard(list, existing, false);
    primeSound();
    const card = buildCard(key);
    /** @type {Timer} */
    const timer = {
        id: key,
        name,
        total: seconds * 1000,
        endsAt: Date.now() + seconds * 1000,
        left: seconds * 1000,
        state: 'running',
        warned: false,
        ring: null,
        card,
    };
    timers.set(key, timer);
    paint(timer);
    part(list, 'list').append(card);
    void import('./motion.js').then((m) => card.isConnected && m.arriveShown(card));
    sync(list);
    say(list, getStrings().timerStarted(name, formatClock(timer.total)));
    emit(list, timer, TIMER_START_EVENT);
    return key;
}

/** @param {Element} list @param {string} id */
export function pauseTimer(list, id) {
    const timer = find(list, id);
    if (!timer || timer.state !== 'running' || !(list instanceof HTMLElement)) return;
    timer.left = leftOf(timer);
    timer.endsAt = null;
    timer.state = 'paused';
    paint(timer);
    sync(list);
    emit(list, timer, TIMER_CHANGE_EVENT, { action: 'pause' });
}

/** @param {Element} list @param {string} id */
export function resumeTimer(list, id) {
    const timer = find(list, id);
    if (!timer || timer.state !== 'paused' || !(list instanceof HTMLElement)) return;
    primeSound();
    timer.endsAt = Date.now() + timer.left;
    timer.state = 'running';
    paint(timer);
    sync(list);
    emit(list, timer, TIMER_CHANGE_EVENT, { action: 'resume' });
}

/**
 * Add time to a timer; a done one starts again for that long.
 * @param {Element} list @param {string} id @param {number} [seconds]
 */
export function addTimerTime(list, id, seconds = 60) {
    const timer = find(list, id);
    if (!timer || !(list instanceof HTMLElement)) return;
    const ms = seconds * 1000;
    if (timer.state === 'done') {
        stopRing(timer);
        timer.total = ms;
        timer.endsAt = Date.now() + ms;
        timer.state = 'running';
        timer.warned = ms <= 60_000;
    } else if (timer.state === 'running' && timer.endsAt !== null) {
        timer.endsAt += ms;
        timer.total += ms;
        if (leftOf(timer) > 60_000) timer.warned = false;
    } else {
        timer.left += ms;
        timer.total += ms;
    }
    paint(timer);
    sync(list);
    emit(list, timer, TIMER_CHANGE_EVENT, { action: 'add' });
}

/** Stop a done timer's chime and let it rest on its done plate. @param {Element} list @param {string} id */
export function stopTimerRing(list, id) {
    const timer = find(list, id);
    if (!timer || !(list instanceof HTMLElement)) return;
    stopRing(timer);
    emit(list, timer, TIMER_CHANGE_EVENT, { action: 'stop-ring' });
}

/** @param {HTMLElement} list @param {Timer} timer @param {boolean} animate */
function removeCard(list, timer, animate) {
    stopRing(timer);
    listOf(list).delete(timer.id);
    const { card } = timer;
    if (animate) void import('./motion.js').then((m) => m.leave(card)).catch(() => card.remove());
    else card.remove();
}

/**
 * Remove a timer (Stop): its card leaves the theme's way.
 * @param {Element} list @param {string} id
 */
export function stopTimer(list, id) {
    const timer = find(list, id);
    if (!timer || !(list instanceof HTMLElement)) return;
    removeCard(list, timer, true);
    sync(list);
    for (const starter of document.querySelectorAll(`${TIMER_START}[data-kp-timer-running="${CSS.escape(id)}"]`))
        starter.removeAttribute('data-kp-timer-running');
    emit(list, timer, TIMER_STOP_EVENT);
}

/**
 * Put saved timers back (after a reload): a running one counts on from its
 * end time, one whose end has passed is shown done (and rings only when it
 * ended within the last minute).
 * @param {Element} list @param {TimerState[]} saved
 */
export function restoreTimers(list, saved) {
    if (!(list instanceof HTMLElement)) return;
    const timers = listOf(list);
    for (const s of saved) {
        if (timers.has(s.id)) continue;
        const card = buildCard(s.id);
        /** @type {Timer} */
        const timer = {
            id: s.id,
            name: s.name,
            total: s.seconds * 1000,
            endsAt: s.state === 'running' ? s.endsAt : null,
            left: s.remaining * 1000,
            state: s.state,
            warned: s.remaining <= 60,
            ring: null,
            card,
        };
        timers.set(s.id, timer);
        part(list, 'list').append(card);
        if (timer.state === 'running' && leftOf(timer) <= 0) finish(list, timer, { quiet: Date.now() - (s.endsAt ?? 0) > 60_000 });
        else paint(timer);
    }
    sync(list);
}

/** The list a starter speaks to. @param {Element} starter */
const targetOf = (starter) => {
    const named = starter.getAttribute('data-kp-timer-for');
    const found = named ? document.getElementById(named) : document.querySelector(TIMERS);
    return found instanceof HTMLElement ? found : null;
};

/**
 * Wire every timer list under `root` (its buttons) and every starter in the
 * page. Counting goes on from the end time when the page comes back.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export function attachTimers(root = document) {
    const lists = /** @type {HTMLElement[]} */ ([
        ...(root instanceof HTMLElement && root.matches(TIMERS) ? [root] : []),
        ...root.querySelectorAll(TIMERS),
    ]);
    /** @type {(() => void)[]} */
    const undo = [];
    for (const list of lists) {
        if (WIRED.has(list)) continue;
        WIRED.add(list);
        part(list, 'list');
        sync(list);
        /** @param {MouseEvent} event */
        const click = (event) => {
            const button = event.target instanceof Element ? event.target.closest('button') : null;
            const card = button?.closest('.kp-timer');
            if (!button || !card || !list.contains(card)) return;
            const id = card.getAttribute('data-kp-timer-id') ?? '';
            const timer = find(list, id);
            if (!timer) return;
            if (button.classList.contains('kp-timer__toggle')) {
                if (timer.state === 'running') pauseTimer(list, id);
                else if (timer.state === 'paused') resumeTimer(list, id);
                else {
                    stopRing(timer);
                    stopTimer(list, id);
                }
            } else if (button.classList.contains('kp-timer__more')) addTimerTime(list, id, 60);
            else if (button.classList.contains('kp-timer__remove')) {
                // The focus goes to the next card's first button, else the previous one's, so it is never lost.
                const next = card.nextElementSibling ?? card.previousElementSibling;
                stopTimer(list, id);
                /** @type {HTMLElement | null} */ (next?.querySelector('.kp-timer__toggle') ?? null)?.focus();
            }
        };
        const back = () => {
            if (document.visibilityState === 'visible') tick(list);
        };
        list.addEventListener('click', click);
        document.addEventListener('visibilitychange', back);
        undo.push(() => {
            WIRED.delete(list);
            list.removeEventListener('click', click);
            document.removeEventListener('visibilitychange', back);
            const ticker = TICKERS.get(list);
            if (ticker) clearInterval(ticker);
            TICKERS.delete(list);
            for (const timer of listOf(list).values()) stopRing(timer);
        });
    }
    // Starters anywhere under `root`, one listener for all.
    /** @param {MouseEvent} event */
    const start = (event) => {
        const starter = event.target instanceof Element ? event.target.closest(TIMER_START) : null;
        if (!starter || starter.closest('[aria-disabled="true"]') || HANDLED.has(event)) return;
        HANDLED.add(event);
        const list = targetOf(starter);
        if (!list) return;
        const seconds = parseDuration(starter.getAttribute('data-kp-timer-start') ?? '');
        const name = starter.getAttribute('data-kp-timer-name') ?? starter.textContent?.trim() ?? '';
        const id = starter.getAttribute('data-kp-timer-id') ?? `start:${name}`;
        const running = find(list, id);
        if (running && running.state !== 'done') {
            /** @type {HTMLElement | null} */ (running.card.querySelector('.kp-timer__toggle'))?.focus();
            say(list, getStrings().timerAlready(name));
            return;
        }
        if (startTimer(list, { name, seconds, id })) starter.setAttribute('data-kp-timer-running', id);
    };
    /** @param {Event} event */
    const ended = (event) => {
        const id = /** @type {CustomEvent} */ (event).detail?.timer?.id;
        if (id)
            for (const starter of document.querySelectorAll(`${TIMER_START}[data-kp-timer-running="${CSS.escape(id)}"]`))
                starter.removeAttribute('data-kp-timer-running');
    };
    root.addEventListener('click', /** @type {EventListener} */ (start));
    root.addEventListener(TIMER_DONE_EVENT, ended);
    undo.push(() => {
        root.removeEventListener('click', /** @type {EventListener} */ (start));
        root.removeEventListener(TIMER_DONE_EVENT, ended);
    });
    return () => undo.forEach((u) => u());
}
