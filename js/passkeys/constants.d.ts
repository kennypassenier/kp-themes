/** A passkey list the page fills with setPasskeys(). */
export declare const PASSKEYS = "[data-kp-passkeys]";
/** Fired on the root when Register (the empty list's button) is pressed. */
export declare const PASSKEYS_REGISTER_EVENT = "kp-passkeys-register";
/** Fired on the root when the Retry of a failed list is pressed. */
export declare const PASSKEYS_RETRY_EVENT = "kp-passkeys-retry";
/** Fired on the root, cancelable, when a removal was confirmed and the page gave no `remove`: `{ key, row }`. */
export declare const PASSKEYS_REMOVE_EVENT = "kp-passkeys-remove";
/** Fired on the root, cancelable, when a new name was saved and the page gave no `rename`: `{ key, row, label }`. */
export declare const PASSKEYS_RENAME_EVENT = "kp-passkeys-rename";
/** The kinds of way in, each with its glyph. */
export declare const PASSKEY_KINDS: readonly string[];
/** Milliseconds in a day, for the "unused for N days" flag. */
export declare const DAY_MS = 86400000;
/** Days without use after which a way is flagged as a candidate to remove (the page may change it, 0 turns it off). */
export declare const DEFAULT_NEVER_USED_DAYS = 90;
/** How many waiting rows a first loading state draws when no list was shown yet. */
export declare const DEFAULT_WAIT_ROWS = 3;
/** The glyph's view box: 20 by 20, drawn with the text colour. */
export declare const GLYPH_BOX = "0 0 20 20";
/** The SVG namespace. */
export declare const SVG_NS = "http://www.w3.org/2000/svg";
/** The glyphs: 20 by 20, drawn with the text colour. @type {Record<PasskeyKind, string>} */
export declare const GLYPHS: Record<PasskeyKind, string>;
export type PasskeyKind = 'passkey' | 'magic-link' | 'password' | 'token';
export type PasskeyRow = {
    key: string;
    label: string;
    /**
     * default `passkey`
     */
    kind?: PasskeyKind;
    /**
     * ms
     */
    createdAt?: number;
    /**
     * ms; null or missing: never used
     */
    lastUsedAt?: number | null;
    /**
     * the way this session signed in with
     */
    current?: boolean;
};
export type PasskeysSpec = {
    rows?: PasskeyRow[];
    state?: 'ready' | 'loading' | 'empty' | 'error';
    /**
     * the sentence of a failed list
     */
    message?: string;
    /**
     * false leaves Retry out of a failed list
     */
    retry?: boolean;
    emptyTitle?: string;
    emptyText?: string;
    /**
     * false leaves the Register button out of the empty list
     */
    register?: boolean;
    /**
     * the page is not served over https: a warning with what to do next
     */
    insecure?: boolean;
    protectLast?: 'refuse' | 'confirm' | 'off';
    confirm?: 'dialog' | 'type-name';
    refuseLook?: 'button' | 'note';
    markCurrent?: boolean;
    /**
     * days
     */
    neverUsedAfter?: number;
    /**
     * the clock (a test gives its own)
     */
    now?: () => number;
    /**
     * reject with an Error to refuse; its message is shown
     */
    remove?: (row: PasskeyRow) => Promise<unknown> | unknown;
    rename?: (row: PasskeyRow, label: string) => Promise<unknown> | unknown;
    /**
     * how many waiting rows (default: the rows shown last, else 3)
     */
    loadingRows?: number;
    /**
     * what the busy card says
     */
    loadingWords?: string;
};
/**
 * @typedef {'passkey' | 'magic-link' | 'password' | 'token'} PasskeyKind
 * @typedef {object} PasskeyRow
 * @property {string} key
 * @property {string} label
 * @property {PasskeyKind} [kind] default `passkey`
 * @property {number} [createdAt] ms
 * @property {number | null} [lastUsedAt] ms; null or missing: never used
 * @property {boolean} [current] the way this session signed in with
 * @typedef {object} PasskeysSpec
 * @property {PasskeyRow[]} [rows]
 * @property {'ready' | 'loading' | 'empty' | 'error'} [state]
 * @property {string} [message] the sentence of a failed list
 * @property {boolean} [retry] false leaves Retry out of a failed list
 * @property {string} [emptyTitle]
 * @property {string} [emptyText]
 * @property {boolean} [register] false leaves the Register button out of the empty list
 * @property {boolean} [insecure] the page is not served over https: a warning with what to do next
 * @property {'refuse' | 'confirm' | 'off'} [protectLast]
 * @property {'dialog' | 'type-name'} [confirm]
 * @property {'button' | 'note'} [refuseLook]
 * @property {boolean} [markCurrent]
 * @property {number} [neverUsedAfter] days
 * @property {() => number} [now] the clock (a test gives its own)
 * @property {(row: PasskeyRow) => Promise<unknown> | unknown} [remove] reject with an Error to refuse; its message is shown
 * @property {(row: PasskeyRow, label: string) => Promise<unknown> | unknown} [rename]
 * @property {number} [loadingRows] how many waiting rows (default: the rows shown last, else 3)
 * @property {string} [loadingWords] what the busy card says
 */
