export type UnsavedConfig = {
    /**
     * where the changes are kept (null: nowhere)
     */
    storage?: Storage | null;
    /**
     * the words a value reads as in the list, for an editor the bar cannot word itself [homelab 71]
     */
    show?: UnsavedShow;
};
export type UnsavedShow = (control: HTMLElement, value: string, row: HTMLElement) => string | null | undefined;
/**
 * What one `attachUnsaved` call may hand its bars.
 * @typedef {object} UnsavedConfig
 * @property {Storage | null} [storage] where the changes are kept (null: nowhere)
 * @property {UnsavedShow} [show] the words a value reads as in the list, for an editor the bar cannot word itself [homelab 71]
 */
/**
 * Names a value in the list of changes: what `control` holding `value` reads as, in the page's own words. It is asked for both
 * sides of a row ("was" and "now"); a string is shown, anything else leaves the bar's own wording. A secret is never asked.
 * @callback UnsavedShow
 * @param {HTMLElement} control the tracked control (a mirror input, or a composite field)
 * @param {string} value the value to word: the saved one or the current one
 * @param {HTMLElement} row the row that stands for the control
 * @returns {string | null | undefined}
 */
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
/** Fired on the bar, bubbling and cancelable, when a link would leave a page with unsaved changes: `{ href, link, route(fn) }`; `route` hands Leave to an app router [forms-1102]. */
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
 * Where a bar stands, from its `data-kp-placement`: read at attach and again whenever the attribute changes [homelab 38].
 * @param {HTMLElement} el the bar
 * @returns {'header' | 'sticky-bottom' | 'header+sticky'}
 */
export declare function readPlacement(el: HTMLElement): 'header' | 'sticky-bottom' | 'header+sticky';
/**
 * What one bar's markup asks for, each with its default [KT6].
 * @param {HTMLElement} el the bar
 * @param {string} id the bar's id
 */
export declare function readSettings(el: HTMLElement, id: string): {
    scope: HTMLElement;
    placement: "header" | "header+sticky" | "sticky-bottom";
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
/** On the bar: the key that saves the changes (a key spec, js/key-spec.js; `none` for no key). */
export declare const UNSAVED_SAVE_KEY_ATTRIBUTE = "data-kp-unsaved-save-key";
/** The key that saves the changes when the bar names none. */
export declare const UNSAVED_SAVE_KEY = "Mod+S";
