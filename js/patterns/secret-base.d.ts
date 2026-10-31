import { Controller } from '../controller.js';
/** One countdown step, in ms. */
export declare const TICK_MS = 1000;
/** The seconds left at which a long countdown is announced once more. */
export declare const LAST_CALL_SECONDS = 10;
export type SecretOptions = {
    copiedMs?: number;
    clearAfterMs?: number | false;
    load?: import('./types.js').SecretLoad;
};
/**
 * @typedef {{ copiedMs?: number, clearAfterMs?: number | false, load?: import('./types.js').SecretLoad }} SecretOptions
 */
/** The base of both secret field controllers. */
export declare class SecretBase extends Controller {
    doc: Document;
    s: import("../strings/types.js").Strings;
    copiedMs: number;
    clearAfterMs: number | false;
    /** The parts this controller made, removed on detach. @type {Element[]} */
    built: Element[];
    /** How long a shown value stays, in seconds; 0: until hidden. */
    seconds: number;
    /** The seconds left while shown. */
    left: number;
    /** The countdown interval, 0 when none runs. */
    timer: number;
    /** The timer that puts Copy's own words back. */
    copiedTimer: number;
    /** Cancels the clipboard clearing a copy scheduled. */
    cancelClear: () => void;
    /** The polite region. Set by the subclass's build. @type {HTMLElement | null} */
    spoken: HTMLElement | null;
    /** @param {HTMLElement} host @param {SecretOptions} [options] */
    constructor(host: HTMLElement, options?: SecretOptions);
    /** Start the field: registered first, the registry entry and the timers go last on detach. */
    register(): void;
    /** Show the value; the subclass says how. @param {string} [reason] @returns {void | Promise<void>} */
    show(reason?: string): void | Promise<void>;
    /** Hide the value; the subclass says how. @param {string} [reason] */
    hide(reason?: string): void;
    /** Tell a screen reader, politely. @param {string} text */
    say(text: string): void;
    /** Count down from now, once a second, unless the value stays shown. @param {() => void} tick */
    startTicking(tick: () => void): void;
    stop(): void;
    /** The drain under the value restarts with every showing. @param {HTMLElement} drain */
    restartDrain(drain: HTMLElement): void;
    /** Tell the page the value was shown or hidden. @param {boolean} shown @param {string} reason */
    announce(shown: boolean, reason: string): void;
    /**
     * Copy `read()`'s text: the button says so, the page hears it (never the value itself), and the clipboard is emptied again
     * later. A refusal is said too, so the button is not one people click twice and then distrust.
     * @param {HTMLButtonElement} copy
     * @param {() => string | Promise<string>} read
     * @param {string} name what the announcement calls the field
     * @param {() => void} settle puts the button's own words back
     */
    copyOut(copy: HTMLButtonElement, read: () => string | Promise<string>, name: string, settle: () => void): Promise<void>;
    /** Empty the clipboard again some seconds after a copy [wish-1120, homelab 108]. @param {string} secret */
    scheduleClear(secret: string): void;
}
