import { Controller } from '../controller.js';
import { createListbox } from '../listbox.js';
import { createIntentFilter } from './intent-filter.js';
import { MATCHERS } from './keys.js';
export type Matcher = import('./types.js').Matcher;
export type PaletteHandle = import('./types.js').PaletteHandle;
export type PaletteOptions = {
    hotkey?: string | null;
    match?: keyof typeof MATCHERS | Matcher;
    clearOnClose?: boolean;
    closeOnRun?: boolean;
};
/** @typedef {import('./types.js').Matcher} Matcher */
/** @typedef {import('./types.js').PaletteHandle} PaletteHandle */
/** @typedef {{ hotkey?: string | null, match?: keyof typeof MATCHERS | Matcher, clearOnClose?: boolean, closeOnRun?: boolean }} PaletteOptions */
/** One palette: its options, its matcher and intent filter, the last state the page set, and the click a choice rides on. */
export declare class PaletteControl extends Controller {
    dialog: HTMLDialogElement;
    input: HTMLInputElement;
    list: HTMLElement;
    status: HTMLElement | null;
    match: string | import("./types.js").Matcher;
    key: string | null;
    clears: boolean;
    closes: boolean;
    /** @type {Matcher} */
    matcher: Matcher;
    /** @type {ReturnType<typeof createIntentFilter> | null} */
    intent: ReturnType<typeof createIntentFilter> | null;
    /** The last state the page set, handed on when the matcher is swapped. @type {{ state: 'ready' | 'loading' | 'error', options?: { message?: string } } | null} */
    lastSet: {
        state: 'ready' | 'loading' | 'error';
        options?: {
            message?: string;
        };
    } | null;
    /** The click a choice rides on, while it is being dispatched. @type {MouseEvent | null} */
    clicking: MouseEvent | null;
    /** The listbox over the list, made in connect(). @type {ReturnType<typeof createListbox> | null} */
    listbox: ReturnType<typeof createListbox> | null;
    /** @type {PaletteHandle} */
    handle: PaletteHandle;
    /** @param {HTMLElement} host @param {PaletteOptions} [options] */
    constructor(host: HTMLElement, options?: PaletteOptions);
    connect(): void;
    /** Put back what the palette changed: the commands shown again, the key hints taken off, the dialog closed and unmarked. */
    restore(): void;
    /**
     * `data-kp-match` is read again when it changes [live-options-1019]. Words in any order is the default [kpadopt6-ops]: the
     * palette ranks, marks and caps itself.
     */
    chooseMatcher(): void;
    /** The old filter gives the commands back (order, marks, hidden), then the new one draws the list. */
    onMatch(): void;
    /** data-kp-keys, rendered: the documented attribute nothing read. */
    renderKeys(): void;
    /** A link option is pointed at, never tabbed to [scope-48]. */
    untab(): void;
    /** Filter for what is typed: the intent filter, or the plain matcher. */
    filter(): void;
    /** @param {'ready' | 'loading' | 'error'} state @param {{ message?: string }} [options] */
    setState(state: 'ready' | 'loading' | 'error', options?: {
        message?: string;
    }): void;
    /** @param {HTMLElement} option */
    choose(option: HTMLElement): void;
    /** @param {string} [query] */
    open(query?: string): void;
    /**
     * Reopening with the last query still in the box is a small trap: the list looks filtered for no visible reason. The close
     * event arrives a task later: a palette opened again with a query in between keeps that query.
     */
    onClose(): void;
    /**
     * Only ONE palette answers the key: the nominated one, else the first in the document. Found by the contract suite: with a
     * palette from each channel on one page, both handlers fired and the second showModal() landed on top of the first.
     * @param {KeyboardEvent} event
     */
    onKey(event: KeyboardEvent): void;
    /** The triggers that open this palette say so, and print its key [scope-48]. Only what the markup left out is written, and only that is taken back. */
    stampOpeners(): void;
}
