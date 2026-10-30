import { MATCHERS } from './matchers.js';
export type ComboboxHandle = import('./types.js').ComboboxHandle;
export type ComboboxHook = import('./types.js').ComboboxHook;
export type Matcher = import('./types.js').Matcher;
/** @typedef {import('./types.js').ComboboxHandle} ComboboxHandle */
/** @typedef {import('./types.js').ComboboxHook} ComboboxHook */
/** @typedef {import('./types.js').Matcher} Matcher */
/**
 * Attach every combobox and tag input under `root`.
 *
 * @param {ParentNode} root
 * @param {{ match?: keyof typeof MATCHERS | Matcher, loop?: boolean, openOnFocus?: boolean, closeOnBlur?: boolean, backspaceRemoves?: boolean, stayOpen?: boolean, maxTags?: number, allowDuplicates?: boolean, debounceMs?: number, emptyRow?: boolean, creatable?: boolean, renderTag?: (value: string, label: string) => HTMLElement, removeGlyph?: string }} [options]
 *   Defaults; per box as data-attributes: `data-kp-match`, `data-kp-loop`, `data-kp-open-on-focus`, `data-kp-close-on-blur`, `data-kp-backspace-removes`, `data-kp-stay-open`, `data-kp-max-tags`, `data-kp-duplicates`, `data-kp-debounce`, `data-kp-empty-row`, `data-kp-creatable`.
 *   A tag input adds from typed text with Enter or a comma [scope-60]: text that names an option (its label, any case) takes that option; other text becomes a tag of its own only with `creatable` (default false, as the React channel's prop).
 *   `backspaceRemoves` (default false since Kenny's second nostromo pass, 2026-09-13): Backspace in an empty field removes the last tag; `data-kp-backspace-removes` opts one box in.
 *   `emptyRow` (default true): a query that matches nothing keeps the list open with a "no results" row — the server's own `[data-kp-combobox-empty]` element inside the list if it wrote one, else one built from the dictionary; `false` closes the list instead, as before 6.1 [gap-11].
 * @returns {(() => void) & { handles: ComboboxHandle[] }} detach
 */
export declare function attachComboboxes(root?: ParentNode, { match, loop, openOnFocus, closeOnBlur, backspaceRemoves, stayOpen, maxTags, allowDuplicates, debounceMs, emptyRow, creatable, renderTag, removeGlyph, }?: {
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
    creatable?: boolean;
    renderTag?: (value: string, label: string) => HTMLElement;
    removeGlyph?: string;
}): (() => void) & {
    handles: ComboboxHandle[];
};
