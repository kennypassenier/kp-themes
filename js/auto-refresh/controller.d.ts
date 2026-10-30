import { Controller } from '../controller.js';
import { Chooser } from './chooser.js';
import { BarLabels } from './labels.js';
/** The controller of one `[data-kp-refresh]` control. */
export declare class RefreshController extends Controller {
    doc: Document;
    view: Window;
    clock: () => number;
    memory: import("../remember.js").Memory | null;
    parts: {
        chooser: HTMLElement;
        custom: HTMLFormElement;
        input: HTMLInputElement;
        problem: HTMLElement;
        line: HTMLElement;
        ago: HTMLElement;
        busyWords: HTMLElement;
        now: HTMLButtonElement;
        count: HTMLElement;
        note: HTMLElement;
        retry: HTMLButtonElement;
        failure: HTMLElement;
        bar: HTMLElement;
    };
    chooser: Chooser;
    labels: BarLabels;
    interval: number;
    busy: boolean;
    failures: number;
    /** @type {'timer' | 'now' | 'retry' | 'return'} */
    reason: 'timer' | 'now' | 'retry' | 'return';
    dueAt: number;
    timer: number;
    /** @type {number | null} */
    updatedAt: number | null;
    missedWhileHidden: boolean;
    /** What a page gets back from refreshOf(). @type {import('./constants.js').RefreshHandle} */
    handle: import('./constants.js').RefreshHandle;
    /**
     * @param {HTMLElement} host
     * @param {{ now?: () => number }} [options] `now` so a test never reads the real clock
     */
    constructor(host: HTMLElement, options?: {
        now?: () => number;
    });
    /** The interval the control opens with: the attribute, else the default, else what the device remembered. */
    startInterval(): number;
    /** The seconds offered. */
    choices(): number[];
    /** `event` (the app fetches), `page` (reload) or `region` (swap one element). */
    mode(): string;
    connect(): void;
    /** Listen to the chooser, the custom form, the buttons, the R key and the tab's visibility. */
    wireEvents(): void;
    staleAfter(): number;
    paintAgo(): void;
    paintChoice(): void;
    /** Restart the thin rule that runs down to the next refresh. */
    runBar(): void;
    /** The wait before the next try: the interval, then twice, four times, then that. */
    delayNow(): number;
    /** Arm the timer for the next refresh. @param {number} [ms] */
    schedule(ms?: number): void;
    /** The app's answer to the refresh in progress. @param {boolean} ok */
    finish(ok: boolean): void;
    /**
     * Refresh. The timer calls it with no argument and only runs while an interval is set; "Refresh now", the R key and
     * "Retry now" call it as `manual` and always work, paused or not, and never wait for a dialog or a field: the person asked.
     * @param {boolean} [manual]
     */
    fire(manual?: boolean): void;
    /** The control is working: busy marks, "updating…" in the line's place, the rule stopped. */
    markBusy(): void;
    /** Fire `kp-refresh`; the app answers once with `detail.done(ok)`. @param {'timer' | 'now' | 'retry' | 'return'} reason */
    askApp(reason: 'timer' | 'now' | 'retry' | 'return'): void;
    /** Set the interval (any whole number of seconds; 0 pauses). @param {number} seconds @param {'user' | 'script'} [by] */
    setInterval(seconds: number, by?: 'user' | 'script'): void;
    /** Refresh at once. @param {'now' | 'retry'} [why] */
    refreshNow(why?: 'now' | 'retry'): void;
    /** The chooser picked a value: "other" opens the custom form. @param {CustomEvent} event */
    onPicked(event: CustomEvent): void;
    /** @param {SubmitEvent} event */
    onCustomSubmit(event: SubmitEvent): void;
    /** Escape closes the custom form and gives the focus back to the chooser. @param {KeyboardEvent} event */
    onCustomKey(event: KeyboardEvent): void;
    /** The R key refreshes now, except inside a field. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** Hidden: stop. Visible again: refresh once if one was due, else wait out the rest. */
    onVisible(): void;
    /**
     * The options are read again when their attribute changes [live-options-1019]: the look redraws the chooser (segments or a
     * menu), the choices and the freshness line follow their attributes, and a new `data-kp-refresh` sets the interval.
     * @param {string[]} names
     */
    onOptions(names: string[]): void;
}
