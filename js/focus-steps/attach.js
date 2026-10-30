// Attaches the focus steps to their element and wires their events.
import { getStrings } from '../strings.js';
import { registerShortcuts } from '../shortcuts.js';
import { watchOptions } from '../live-options.js';
import {
    FOCUS_STEPS,
    FOCUS_STEPS_DONE_EVENT,
    FOCUS_STEPS_EMPTY_ACTION_EVENT,
    FOCUS_STEPS_RETRY_EVENT,
    FOCUS_STEPS_SAVE_RETRY_EVENT,
    SWIPE_DISTANCE,
    WIRED,
} from './constants.js';
import { build, part, stateOf } from './dom.js';
import { paint } from './paint.js';
import { applyWake, holdScreen, letScreenGo, paintWake } from './wake.js';
import { answerReady, answering, lastIndex } from './resume.js';
import { goNext, pressAnswer, takeAnswer } from './flow.js';
import { activeTrack, layTracks, timerIdOf, tracksOn } from './tracks.js';
import { recompute, stepTrack, switchTrack, timerEnded, trackPrev } from './track-nav.js';
import { goToStep, typing } from './api.js';
import { clearAlert, renderBand } from './band.js';
import { applyProgress, memoryOf } from './memory.js';
import { layoutLanes } from './lanes.js';

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
            // A question is answered before the flow moves on: a multi pick or a written line is taken now.
            const answer = state.steps[state.index]?.answer;
            if (answering(root) && answer && !state.answers[answer.id]) {
                if (!answerReady(root, answer)) return;
                const held = state.draft[answer.id];
                if (!takeAnswer(root, typeof held === 'string' ? held.trim() : (held ?? ''), 'tap')) return;
            }
            goNext(root);
        };
        const prev = () => (tracksOn(root) ? trackPrev(root) : goToStep(root, state.index - 1));
        /** @param {MouseEvent} event */
        const click = (event) => {
            const button = event.target instanceof Element ? event.target.closest('button') : null;
            if (!button || !root.contains(button) || button.getAttribute('aria-disabled') === 'true') return;
            if (pressAnswer(root, button)) return;
            // Parallel tracks: a lane, the button that goes to a track, and "Got it" on the band.
            const go = button.getAttribute('data-kp-focus-go');
            if (button.classList.contains('kp-focus-steps__lane')) {
                switchTrack(root, button.getAttribute('data-kp-track-key') ?? '', 'tap');
                return;
            }
            if (go !== null) {
                const to = state.tracks[Number(go)];
                if (to) switchTrack(root, to.key, button.closest('.kp-focus-steps__band') ? 'attention' : 'tap');
                return;
            }
            const dismiss = button.getAttribute('data-kp-focus-dismiss');
            if (dismiss !== null) {
                const gone = state.tracks[Number(dismiss)];
                if (gone) clearAlert(root, gone.key);
                return;
            }
            if (button.hasAttribute('data-kp-focus-retry')) root.dispatchEvent(new CustomEvent(FOCUS_STEPS_RETRY_EVENT, { bubbles: true }));
            else if (button.hasAttribute('data-kp-focus-empty-action'))
                root.dispatchEvent(new CustomEvent(FOCUS_STEPS_EMPTY_ACTION_EVENT, { bubbles: true }));
            else if (button.hasAttribute('data-kp-focus-save-retry')) {
                root.dispatchEvent(new CustomEvent(FOCUS_STEPS_SAVE_RETRY_EVENT, { bubbles: true }));
                if (state.finished) root.dispatchEvent(new CustomEvent(FOCUS_STEPS_DONE_EVENT, { bubbles: true, detail: { ...state.finished } }));
            } else if (button.classList.contains('kp-focus-steps__resume-go') && state.pendingResume) applyProgress(root, state.pendingResume);
            else if (button.classList.contains('kp-focus-steps__resume-restart')) {
                memoryOf(root)?.forget('progress');
                state.pendingResume = null;
                paint(root, false);
            } else if (button.classList.contains('kp-focus-steps__next')) next();
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
            // ArrowUp and ArrowDown walk the answers of a question.
            if (
                (event.key === 'ArrowUp' || event.key === 'ArrowDown') &&
                onButton instanceof HTMLElement &&
                onButton.closest('.kp-focus-steps__answer')
            ) {
                const all = /** @type {HTMLElement[]} */ ([...root.querySelectorAll('.kp-focus-steps__answer button')]);
                const at = all.indexOf(onButton);
                const to = all[Math.max(0, Math.min(all.length - 1, at + (event.key === 'ArrowDown' ? 1 : -1)))];
                if (at >= 0 && to) {
                    event.preventDefault();
                    to.focus();
                }
                return;
            }
            // The tabs pattern on the lanes: ArrowUp and ArrowDown (Home, End) move the focus between them.
            if (
                ['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key) &&
                onButton instanceof HTMLElement &&
                onButton.classList.contains('kp-focus-steps__lane')
            ) {
                const all = /** @type {HTMLElement[]} */ ([...root.querySelectorAll('.kp-focus-steps__lane')]);
                const at = all.indexOf(onButton);
                const step = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
                const to = event.key === 'Home' ? all[0] : event.key === 'End' ? all[all.length - 1] : all[(at + step + all.length) % all.length];
                if (at >= 0 && to) {
                    event.preventDefault();
                    to.focus();
                }
                return;
            }
            let act = null;
            if (event.key === 'PageDown' || event.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) act = next;
            else if (event.key === 'PageUp' || event.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) act = prev;
            else if (event.key === ' ' && !onButton) act = next;
            else if (event.key === 'Home') act = () => goToStep(root, tracksOn(root) ? (activeTrack(state)?.order[0] ?? 0) : 0);
            else if (event.key === 'End') act = () => goToStep(root, tracksOn(root) ? (activeTrack(state)?.order.at(-1) ?? 0) : lastIndex(root));
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
        // s, u and n take the same as yesterday, the usual answer and Not today while the focus is in the view.
        const tap = (/** @type {string} */ selector) => () => {
            const button = /** @type {HTMLElement | null} */ (root.querySelector(selector));
            if (button && button.getAttribute('aria-disabled') !== 'true') pressAnswer(root, button);
        };
        const inView = () => answering(root) && root.contains(document.activeElement) && state.steps[state.index]?.answer !== undefined;
        const unkey = registerShortcuts(root, [
            {
                keys: 's',
                what: getStrings().focusSameYesterday('…'),
                group: 'Question',
                when: () => inView() && root.querySelector('[data-kp-same="yesterday"]') !== null,
                run: tap('[data-kp-same="yesterday"]'),
            },
            {
                keys: 'u',
                what: getStrings().focusSameUsual('…'),
                group: 'Question',
                when: () => inView() && root.querySelector('[data-kp-same="usual"]') !== null,
                run: tap('[data-kp-same="usual"]'),
            },
            {
                keys: 'n',
                what: getStrings().focusSkip,
                group: 'Question',
                when: () => inView() && root.querySelector('.kp-focus-steps__skip') !== null,
                run: tap('.kp-focus-steps__skip'),
            },
        ]);
        // T and Shift T walk the tracks while the focus is in the view (or on no control at all).
        const tracking = () => tracksOn(root) && (root.contains(document.activeElement) || document.activeElement === document.body);
        const unkeyTracks = registerShortcuts(root, [
            { keys: 't', what: getStrings().focusTrackKeyNext, group: 'Tracks', when: tracking, run: () => stepTrack(root, 1) },
            { keys: 'Shift T', what: getStrings().focusTrackKeyPrevious, group: 'Tracks', when: tracking, run: () => stepTrack(root, -1) },
        ]);
        // An option changed at run time is drawn at once [live-options-1019].
        const stopWatch = watchOptions(
            root,
            [
                'data-kp-progress',
                'data-kp-back',
                'data-kp-same',
                'data-kp-skip',
                'data-kp-choice-layout',
                'data-kp-summary',
                'data-kp-pinned-first',
                'data-kp-speak',
                'data-kp-focus-mode',
                'data-kp-wake',
                'data-kp-focus-steps-wake',
                'data-kp-tracks',
                'data-kp-lanes',
                'data-kp-lane-detail',
                'data-kp-track-follow',
                'data-kp-track-attention',
                'data-kp-track-shared',
            ],
            (names) => {
                if (names.some((n) => n === 'data-kp-wake' || n === 'data-kp-focus-steps-wake')) applyWake(root);
                if (names.includes('data-kp-track-shared')) layTracks(root);
                paint(root, false);
                if (names.includes('data-kp-track-attention') || names.includes('data-kp-tracks')) renderBand(root);
                recompute(root);
            },
        );
        // The timers of the steps: the lanes read them by their ids, an end asks for the person, and the lanes follow the clock.
        /** @param {Event} event */
        const timerEvent = (event) => {
            const timer = /** @type {CustomEvent} */ (event).detail?.timer;
            if (!timer || !tracksOn(root)) return;
            const at = state.steps.findIndex((_, i) => timerIdOf(state, i) === timer.id);
            if (at < 0) return;
            if (event.type === 'kp-timer-done') timerEnded(root, at, timer);
            else if (event.type === 'kp-timer-stop') for (const [key, alert] of state.alerts) if (alert.timerId === timer.id) clearAlert(root, key);
            recompute(root);
        };
        const timerEvents = ['kp-timer-start', 'kp-timer-change', 'kp-timer-done', 'kp-timer-stop'];
        for (const type of timerEvents) document.addEventListener(type, timerEvent);
        state.ticker = window.setInterval(() => {
            if (!document.hidden) recompute(root);
        }, 1000);
        const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(() => tracksOn(root) && layoutLanes(root)) : null;
        resize?.observe(root);
        // The empty plate's words and action are read again when the attributes change.
        const stopOptions = watchOptions(root, ['data-kp-focus-steps-empty', 'data-kp-focus-steps-empty-action'], () => paint(root, false));
        undo.push(() => {
            stopOptions();
            stopWatch();
            unkey();
            unkeyTracks();
            for (const type of timerEvents) document.removeEventListener(type, timerEvent);
            window.clearInterval(state.ticker);
            state.ticker = 0;
            resize?.disconnect();
            window.clearTimeout(state.timer);
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
