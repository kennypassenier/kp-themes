import { Controller } from '../controller.js';
export declare class SnoozePanel extends Controller {
    s: import("../strings/types.js").Strings;
    doc: Document;
    id: string;
    zone: string;
    locale: string | undefined;
    choiceKeys: string[];
    morning: string | undefined;
    evening: string | undefined;
    max: string;
    chips: boolean;
    fixed: number;
    nowGiven: (() => number) | undefined;
    /** The clock: the page's, else the picker's own fixed moment, else now. */
    now: () => number;
    memory: string;
    /** The moment snoozed until, the last moment picked, and whether the page is saving. @type {number | null} */
    until: number | null;
    /** @type {number | null} */
    last: number | null;
    busy: boolean;
    /** Lowers the panel from the top layer. @type {(() => void) | null} */
    lower: (() => void) | null;
    bar: {
        bar: HTMLElement;
        status: HTMLElement;
        end: HTMLButtonElement;
        trigger: HTMLElement;
        wrapper: null;
        row: HTMLElement;
    } | {
        bar: HTMLElement;
        status: HTMLElement;
        end: HTMLButtonElement;
        trigger: HTMLButtonElement;
        wrapper: HTMLElement;
        row: null;
    };
    p: {
        panel: HTMLElement;
        picker: HTMLElement;
        date: HTMLInputElement;
        time: HTMLInputElement;
        error: HTMLElement;
        cancel: HTMLButtonElement;
        apply: HTMLButtonElement;
    };
    /** @param {HTMLElement} el @param {{ now?: () => number }} [options] */
    constructor(el: HTMLElement, options?: {
        now?: () => number;
    });
    /** The element the panel stands under: the menu button, or the picker. */
    anchor(): HTMLElement;
    /** @param {HTMLElement} p */
    place(p: HTMLElement): void;
    /** Open the panel at the last moment picked, else tomorrow morning. */
    openPanel(): void;
    /** @param {boolean} [refocus] */
    closePanel(refocus?: boolean): Promise<void>;
    /** Mark the fields that are wrong, and only those. @param {HTMLInputElement[]} bad */
    markBad(bad: HTMLInputElement[]): void;
    /**
     * The moment the panel says, or what is wrong with it: no date, no time, in the past, or beyond the picker's longest.
     * @returns {{ ms: number } | { bad: HTMLInputElement[], words: string[] }}
     */
    readPanel(): {
        ms: number;
    } | {
        bad: HTMLInputElement[];
        words: string[];
    };
}
