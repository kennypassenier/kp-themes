import { Controller } from '../controller.js';
export type AlarmReason = import('../alarm.js').AlarmReason;
export type SessionOptions = {
    ack: HTMLButtonElement;
    keep: HTMLButtonElement;
    when: HTMLElement;
    left: HTMLElement;
    strings: import('../strings.js').Strings;
    action: string;
    seconds: number;
    mode: 'ack' | 'auto';
    escape: boolean;
    trigger: HTMLElement | null;
    resolve: (reason: AlarmReason) => void;
};
/** @typedef {import('../alarm.js').AlarmReason} AlarmReason */
/**
 * @typedef {object} SessionOptions
 * @property {HTMLButtonElement} ack
 * @property {HTMLButtonElement} keep
 * @property {HTMLElement} when
 * @property {HTMLElement} left
 * @property {import('../strings.js').Strings} strings
 * @property {string} action
 * @property {number} seconds
 * @property {'ack' | 'auto'} mode
 * @property {boolean} escape
 * @property {HTMLElement | null} trigger
 * @property {(reason: AlarmReason) => void} resolve
 */
export declare class AlarmSession extends Controller {
    dialog: HTMLDialogElement;
    o: SessionOptions;
    /** @type {AlarmReason} */
    reason: AlarmReason;
    timer: number;
    /**
     * @param {HTMLDialogElement} host the dialog
     * @param {SessionOptions} options
     */
    constructor(host: HTMLDialogElement, options: SessionOptions);
    connect(): void;
    /** @param {AlarmReason} why */
    close(why: AlarmReason): void;
    escapeAllowed(): boolean;
    /** Keep open stops the countdown and turns the alarm into an acknowledged one. */
    onKeep(): void;
    /** @param {Event} event */
    onCancel(event: Event): void;
    /** The alarm closed: the focus goes back, the page hears why, the promise settles, and the session is over. */
    onClosed(): void;
    /** Put the alarm on the screen and take the focus. */
    open(): void;
    startCountdown(): void;
}
