/**
 * The event a consumer listens for. A contract value [TH26]: the detail
 * carries `{ value, label, values, action }` — the value just chosen or
 * removed, its label, every value held (one for a combobox, the whole
 * set for a tag input), and which of 'add' | 'remove' | 'set' it was.
 */
export declare const CHANGE_EVENT = "kp-combobox-change";
/** Fired when the list opens or closes: `{ open }`. */
export declare const OPEN_EVENT = "kp-combobox-open";
export type Matcher = (optionText: string, query: string) => boolean;
/** @typedef {(optionText: string, query: string) => boolean} Matcher */
/** @type {Record<string, Matcher>} */
export declare const MATCHERS: Record<string, Matcher>;
export type ComboboxHandle = {
    element: HTMLElement;
    values: () => string[];
    /**
     * replace the held values (a combobox takes the first)
     */
    set: (values: readonly string[]) => void;
    open: () => void;
    close: () => void;
    /**
     * type on the consumer's behalf
     */
    query: (text: string) => void;
    /**
     * re-read the options after the consumer changed them
     */
    refresh: () => void;
};
/** The handle for an attached combobox. @param {Element} element */
export declare function combobox(element: Element): ComboboxHandle | null;
/**
 * Attach every combobox and tag input under `root`.
 *
 * @param {ParentNode} root
 * @param {{ match?: keyof typeof MATCHERS | Matcher, loop?: boolean, openOnFocus?: boolean, closeOnBlur?: boolean, backspaceRemoves?: boolean, stayOpen?: boolean, maxTags?: number, allowDuplicates?: boolean, debounceMs?: number, emptyRow?: boolean, renderTag?: (value: string, label: string) => HTMLElement, removeGlyph?: string }} [options]
 *   Defaults; per box as data-attributes: `data-kp-match`, `data-kp-loop`, `data-kp-open-on-focus`, `data-kp-close-on-blur`, `data-kp-backspace-removes`, `data-kp-stay-open`, `data-kp-max-tags`, `data-kp-duplicates`, `data-kp-debounce`, `data-kp-empty-row`.
 *   `emptyRow` (default true): a query that matches nothing keeps the list open with a "no results" row — the server's own `[data-kp-combobox-empty]` element inside the list if it wrote one, else one built from the dictionary; `false` closes the list instead, as before 6.1 [gap-11].
 * @returns {(() => void) & { handles: ComboboxHandle[] }} detach
 */
export declare function attachComboboxes(root?: ParentNode, { match, loop, openOnFocus, closeOnBlur, backspaceRemoves, stayOpen, maxTags, allowDuplicates, debounceMs, emptyRow, renderTag, removeGlyph, }?: {
    match?: keyof typeof MATCHERS | Matcher;
    loop?: boolean;
    openOnFocus?: boolean;
    closeOnBlur?: boolean;
    backspaceRemoves?: boolean;
    stayOpen?: boolean;
    maxTags?: number;
    allowDuplicates?: boolean;
    debounceMs?: number;
    emptyRow?: boolean;
    renderTag?: (value: string, label: string) => HTMLElement;
    removeGlyph?: string;
}): (() => void) & {
    handles: ComboboxHandle[];
};
