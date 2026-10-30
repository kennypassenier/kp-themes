import { Controller } from '../controller.js';
export type UndoToast = import('../undo-toast.js').UndoToast;
export type UndoToastOptions = import('../undo-toast.js').UndoToastOptions;
export type UndoState = 'counting' | 'committing' | 'failed' | 'undone' | 'done';
export type UndoOutcome = 'committed' | 'undone' | 'failed' | 'left';
export type UndoRunOptions = {
    /**
     * what the caller passed
     */
    options: UndoToastOptions;
    settings: ReturnType<typeof import('./build.js').readSettings>;
    /**
     * the content of the toast
     */
    ui: ReturnType<typeof import('./build.js').buildBody>;
};
/** @typedef {import('../undo-toast.js').UndoToast} UndoToast */
/** @typedef {import('../undo-toast.js').UndoToastOptions} UndoToastOptions */
/** @typedef {'counting' | 'committing' | 'failed' | 'undone' | 'done'} UndoState */
/** @typedef {'committed' | 'undone' | 'failed' | 'left'} UndoOutcome */
/**
 * @typedef {object} UndoRunOptions
 * @property {UndoToastOptions} options what the caller passed
 * @property {ReturnType<typeof import('./build.js').readSettings>} settings
 * @property {ReturnType<typeof import('./build.js').buildBody>} ui the content of the toast
 */
export declare class UndoCore extends Controller {
    toast: HTMLElement & {
        dismiss: () => void;
    };
    doc: Document;
    view: (Window & typeof globalThis) | null;
    strings: import("../strings/types.js").Strings;
    given: import("../undo-toast.js").UndoToastOptions;
    settings: {
        region: HTMLElement | null;
        ms: number;
        mode: string;
        clock: string;
        key: string | false;
        leaves: string;
        max: number;
        seconds: number;
    };
    ui: {
        body: HTMLElement;
        ring: HTMLElement | null;
        secs: HTMLElement | null;
        words: HTMLElement;
        said: HTMLElement;
    };
    /** @type {UndoState} */
    state: UndoState;
    /** Settles `done`. @type {(how: UndoOutcome) => void} */
    finish: (how: UndoOutcome) => void;
    /** @type {Promise<UndoOutcome>} */
    done: Promise<UndoOutcome>;
    /** The time left in the window, in ms. */
    remaining: number;
    startedAt: number;
    timer: number;
    tick: number;
    /** Whether the pointer, or the focus, is on the toast. */
    pointer: boolean;
    focus: boolean;
    /**
     * @param {HTMLElement} host the toast (it carries `dismiss`)
     * @param {UndoRunOptions} run
     */
    constructor(host: HTMLElement, run: UndoRunOptions);
    /** Move to another state; the toast's attribute follows where the caller sets it. @param {UndoState} next */
    enterState(next: UndoState): void;
    stopClocks(): void;
    /** @param {string} line */
    setLine(line: string): void;
    /** @param {UndoOutcome} how */
    announce(how: UndoOutcome): void;
    /** The seconds on the toast, written from what is left. */
    writeSeconds(): void;
    /** Start the clock: the commit after what is left, and the seconds every tick. */
    run(): void;
    /** Commit now; the running toast overrides it. @returns {Promise<void>} */
    accept(): Promise<void>;
    /** The pointer or the focus came: stop the clock where it is. */
    hold(): void;
    /** Both left: go on where it stopped. */
    go(): void;
    attended(): void;
    /** The pointer came or left. @param {boolean} on */
    setPointer(on: boolean): void;
    /** The focus came or left. @param {boolean} on */
    setFocus(on: boolean): void;
}
