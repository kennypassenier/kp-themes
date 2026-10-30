import { Controller } from '../controller.js';
import { Digits } from './digits.js';
import { timerButton } from './parts.js';
/** The controller of one `[data-kp-countdown]` timer. */
export declare class CountdownController extends Controller {
    strings: import("../strings/types.js").Strings;
    doc: Document;
    wallNow: () => number;
    parts: {
        title: HTMLElement;
        time: HTMLElement;
        digits: HTMLElement;
        spoken: HTMLElement;
        line: HTMLElement;
        said: HTMLElement;
    };
    digits: Digits;
    seconds: number;
    step: number;
    name: string;
    disabled: boolean;
    bare: boolean;
    daysOn: boolean;
    /** The moment the timer counts down to, epoch ms, when the `until` option names one. @type {number | null} */
    until: number | null;
    /** Whether the timer shows hours (it holds an hour or more). */
    hours: boolean;
    /** The animation frame of the running loop. */
    frame: number;
    /** @type {ReturnType<typeof timerButton> | null} */
    go: ReturnType<typeof timerButton> | null;
    /** @type {ReturnType<typeof timerButton> | null} */
    more: ReturnType<typeof timerButton> | null;
    /** @type {ReturnType<typeof timerButton> | null} */
    reset: ReturnType<typeof timerButton> | null;
    /** @type {HTMLElement | null} */
    controls: HTMLElement | null;
    /** The clock a page drives from countdownOf(). @type {import('./constants.js').CountdownClock | undefined} */
    clock: import('./constants.js').CountdownClock | undefined;
    /**
     * @param {HTMLElement} host
     * @param {{ now?: () => number, wall?: () => number }} [options] `now` is the clock's (performance.now), `wall` the device's
     *   date and time (Date.now), which an `until` option is counted against
     */
    constructor(host: HTMLElement, options?: {
        now?: () => number;
        wall?: () => number;
    });
    /** The clock, which exists from `connect()` on. */
    get timer(): import('./constants.js').CountdownClock;
    /** Read the options from the attributes. */
    read(): void;
    connect(): void;
    /** Take the timer's markup away again. */
    undoDom(): void;
    /** Say how much time is left, for a screen reader. */
    speak(): void;
    /** Bring the digits, the name, the buttons and the status line in step with the clock. */
    show(): void;
    /** Write the digits on every frame while the clock runs. */
    loop(): void;
    /** The clock started, paused, reset or gained time. @param {import('./constants.js').CountdownState} state */
    changed(state: import('./constants.js').CountdownState): void;
    /** The time is up. */
    onEnd(): void;
    onGo(): void;
    onMore(): void;
    onReset(): void;
    /** The controls are built when the timer has them and left out of the document (and the tab order) when it has none. */
    mountControls(): void;
    startUntil(): void;
    onVisible(): void;
    /** An option attribute changed. @param {string[]} names */
    onOptions(names: string[]): void;
}
