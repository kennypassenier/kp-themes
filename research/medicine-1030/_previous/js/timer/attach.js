// Attaches the timer lists of a page.
import { getStrings } from '../strings.js';
import { parseDuration } from '../countdown.js';
import { TIMERS, TIMER_DONE_EVENT, TIMER_START } from './constants.js';
import { listOf, part, say } from './model.js';
import { addTimerTime, find, pauseTimer, resumeTimer, startTimer, stopTimer, targetOf } from './run.js';
import { stopRing } from './sound.js';
import { HANDLED, TICKERS, WIRED } from './state.js';
import { sync, tick } from './sync.js';

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
        const message = starter.getAttribute('data-kp-timer-say') ?? '';
        if (startTimer(list, { name, seconds, id, say: message })) starter.setAttribute('data-kp-timer-running', id);
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
