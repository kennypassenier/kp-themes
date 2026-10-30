import { Controller } from '../controller.js';
export type DepItem = import('../deplist.js').DepItem;
export type DepRow = import('../deplist.js').DepRow;
export type DeplistHandle = import('../deplist.js').DeplistHandle;
export type DeplistState = 'ready' | 'loading' | 'empty' | 'error';
export type DeplistSettings = {
    /**
     * rows are numbered in the order things must go
     */
    numbers: boolean;
    /**
     * a thing lists itself
     */
    self: boolean;
    /**
     * the rows read "reaches" instead of "needs"
     */
    reaches: boolean;
    /**
     * the arrow's glyph
     */
    arrow: string;
    /**
     * a state badge beside each needed thing
     */
    withStates: boolean;
    /**
     * the rows shown before "Show all"
     */
    collapse: number;
    /**
     * `none`, `by-to` or `by-from`
     */
    group: string;
};
/** @typedef {import('../deplist.js').DepItem} DepItem */
/** @typedef {import('../deplist.js').DepRow} DepRow */
/** @typedef {import('../deplist.js').DeplistHandle} DeplistHandle */
/** @typedef {'ready' | 'loading' | 'empty' | 'error'} DeplistState */
/**
 * @typedef {object} DeplistSettings
 * @property {boolean} numbers rows are numbered in the order things must go
 * @property {boolean} self a thing lists itself
 * @property {boolean} reaches the rows read "reaches" instead of "needs"
 * @property {string} arrow the arrow's glyph
 * @property {boolean} withStates a state badge beside each needed thing
 * @property {number} collapse the rows shown before "Show all"
 * @property {string} group `none`, `by-to` or `by-from`
 */
/** @param {Document} doc @param {string} tag @param {string} className */
export declare const made: (doc: Document, tag: string, className: string) => HTMLElement;
export declare class DeplistCore extends Controller {
    doc: Document;
    /** The rows the page gave. @type {readonly DepItem[]} */
    items: readonly DepItem[];
    /** @type {DeplistState} */
    state: DeplistState;
    stateMessage: string;
    expanded: boolean;
    /** The rows as drawn. @type {DepRow[]} */
    drawn: DepRow[];
    /** @type {import('../busy-card.js').BusyCard | null} */
    busy: import('../busy-card.js').BusyCard | null;
    /** The empty or failed plate standing in for the rows. @type {HTMLElement | null} */
    plate: HTMLElement | null;
    heading: HTMLElement;
    body: HTMLElement;
    list: HTMLElement;
    foot: HTMLElement;
    /** The one handle a page gets back, the same object every time. */
    handle: import("../deplist.js").DeplistHandle;
    /**
     * @param {HTMLElement} host
     * @param {Record<string, unknown>} [options]
     */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    /** Take away the busy card and the plate the last draw stood in for the rows. */
    clearStandIns(): void;
    /** @param {import('../busy-card.js').BusyCard} card */
    setBusy(card: import('../busy-card.js').BusyCard): void;
    /** @param {HTMLElement} plate */
    setPlate(plate: HTMLElement): void;
    /** Fold or unfold the rows past the limit. */
    toggleExpanded(): void;
    /** @param {string} name @param {string} fallback */
    attr(name: string, fallback: string): string;
    /** What the list's attributes ask for right now. @returns {DeplistSettings} */
    settings(): DeplistSettings;
    /** The least rows the list stands as high as. */
    minRows(): number;
    /** @returns {DeplistHandle} */
    makeHandle(): DeplistHandle;
    /** Draw the list. The controller overrides it. */
    draw(): void;
    /**
     * Show a state. The height the list has with its rows is kept for the states that stand in for them.
     * @param {DeplistState} next
     */
    go(next: DeplistState): void;
}
