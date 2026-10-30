export type UnsavedConfig = {
    storage?: Storage | null;
};
/** @typedef {{ storage?: Storage | null }} UnsavedConfig */
/** The page-wide default for where kept changes go; `undefined`: the bar's own choice (session or local). @type {{ storage: Storage | null | undefined }} */
export declare const config: {
    storage: Storage | null | undefined;
};
/**
 * Set where every bar keeps its changes, once: a browser `Storage`, or `null` to keep nothing. Without it a bar uses
 * `sessionStorage` (`localStorage` with `data-kp-keep="local"`). A bar attached with its own `storage` option keeps that one [wish-1028].
 * @param {UnsavedConfig} next
 */
export declare function configureUnsaved(next: UnsavedConfig): void;
/** An unsaved-changes bar. */
export declare const UNSAVED = "[data-kp-unsaved]";
/** Fired on the bar when the count changes: `{ count, changes }`. */
export declare const UNSAVED_CHANGE_EVENT = "kp-unsaved-change";
/** Fired on the bar, bubbling and cancelable, when Save is pressed: `{ changes }`. */
export declare const UNSAVED_SAVE_EVENT = "kp-unsaved-save";
/** Fired on the bar when the changes were discarded: `{ changes }`; and `kp-unsaved-undo` when they were put back. */
export declare const UNSAVED_DISCARD_EVENT = "kp-unsaved-discard";
/** Fired on the bar when a discard is undone: `{ changes }`. */
export declare const UNSAVED_UNDO_EVENT = "kp-unsaved-undo";
/** Fired on the bar, bubbling and cancelable, when a link would leave a page with unsaved changes: `{ href }`. */
export declare const UNSAVED_LEAVE_EVENT = "kp-unsaved-leave";
/** Fired on the bar, bubbling and cancelable, when one change is reverted: `{ key, row }`. */
export declare const UNSAVED_REVERT_EVENT = "kp-unsaved-revert";
/** What stands for a changed control: the row it sits in. */
export declare const ROW = ".kp-formrow, .kp-kv__row, [data-kp-row]";
/** The controls that count as form values (buttons, hidden fields and files do not). */
export declare const CONTROL = "input:not([type=\"hidden\"], [type=\"button\"], [type=\"submit\"], [type=\"reset\"], [type=\"file\"], [type=\"image\"]), select, textarea";
/** How long Discard offers Undo unless `data-kp-undo-ms` says otherwise [ms]. */
export declare const UNDO_MS_DEFAULT = 6000;
/** The pause before a count change is read out, so a burst of edits is announced once [ms]. */
export declare const ANNOUNCE_DELAY_MS = 400;
/** How long the "restored" toast stays after changes come back from storage [ms]. */
export declare const RESTORED_TOAST_MS = 6000;
/** How long the "all saved" toast stays [ms]. */
export declare const SAVED_TOAST_MS = 3000;
/** The gap between the count chip and the list panel under it, and the panel's distance from the window's edge [px]. */
export declare const PANEL_GAP_PX = 6;
export declare const PANEL_EDGE_PX = 8;
/** Below this width the bar puts Discard behind More: 30rem at the default font size [px]. */
export declare const COMPACT_BELOW_PX: number;
export type UnsavedChange = {
    /**
     * the row's name
     */
    key: string;
    /**
     * what it was
     */
    was: string;
    /**
     * what it is
     */
    now: string;
    /**
     * the row (or the control) that carries `data-kp-changed`
     */
    row: HTMLElement;
};
export type UnsavedHandle = {
    element: HTMLElement;
    /**
     * the changes now
     */
    changes: () => UnsavedChange[];
    state: () => 'clean' | 'dirty' | 'saving';
    /**
     * put every value back (with Undo)
     */
    discard: () => void;
    /**
     * the page's answer to Save
     */
    saved: (result?: {
        refused?: Record<string, string>;
    }) => void;
    /**
     * take what the form holds now as the saved values
     */
    markClean: () => void;
    setSaving: (saving: boolean) => void;
};
/**
 * @typedef {object} UnsavedChange
 * @property {string} key the row's name
 * @property {string} was what it was
 * @property {string} now what it is
 * @property {HTMLElement} row the row (or the control) that carries `data-kp-changed`
 */
/**
 * @typedef {object} UnsavedHandle
 * @property {HTMLElement} element
 * @property {() => UnsavedChange[]} changes the changes now
 * @property {() => 'clean' | 'dirty' | 'saving'} state
 * @property {() => void} discard put every value back (with Undo)
 * @property {(result?: { refused?: Record<string, string> }) => void} saved the page's answer to Save
 * @property {() => void} markClean take what the form holds now as the saved values
 * @property {(saving: boolean) => void} setSaving
 */
/**
 * What one bar's markup asks for, each with its default [KT6].
 * @param {HTMLElement} el the bar
 * @param {string} id the bar's id
 */
export declare function readSettings(el: HTMLElement, id: string): {
    scope: HTMLElement;
    placement: string;
    dockInContainer: boolean;
    scrollRoot: Element | null;
    auto: boolean;
    warn: string | undefined;
    keepAttribute: string | undefined;
    exclude: string;
    undoMs: number;
    saveLabel: string | undefined;
    storeKey: string;
};
