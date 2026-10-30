import { Controller } from '../controller.js';
import { MATCHERS } from './matchers.js';
export type ComboboxHook = import('./types.js').ComboboxHook;
export type Matcher = import('./types.js').Matcher;
export type Listbox = ReturnType<typeof import('../listbox.js').createListbox>;
export type ComboboxSettings = {
    match: keyof typeof MATCHERS | Matcher;
    loop: boolean;
    openOnFocus: boolean;
    closeOnBlur: boolean;
    backspaceRemoves: boolean;
    stayOpen: boolean;
    maxTags: number;
    allowDuplicates: boolean;
    debounceMs: number;
    emptyRow: boolean;
    creatable: boolean;
    renderTag?: (value: string, label: string) => HTMLElement;
    removeGlyph: string;
};
/** @typedef {import('./types.js').ComboboxHook} ComboboxHook */
/** @typedef {import('./types.js').Matcher} Matcher */
/** @typedef {ReturnType<typeof import('../listbox.js').createListbox>} Listbox */
/**
 * What `attachComboboxes` hands each combobox, its defaults already applied.
 * @typedef {object} ComboboxSettings
 * @property {keyof typeof MATCHERS | Matcher} match
 * @property {boolean} loop
 * @property {boolean} openOnFocus
 * @property {boolean} closeOnBlur
 * @property {boolean} backspaceRemoves
 * @property {boolean} stayOpen
 * @property {number} maxTags
 * @property {boolean} allowDuplicates
 * @property {number} debounceMs
 * @property {boolean} emptyRow
 * @property {boolean} creatable
 * @property {(value: string, label: string) => HTMLElement} [renderTag]
 * @property {string} removeGlyph
 */
export declare class ComboboxBase extends Controller {
    /** The defaults and the page's options. */
    settings: ComboboxSettings;
    /** @type {HTMLInputElement} */
    input: HTMLInputElement;
    /** @type {HTMLElement} */
    list: HTMLElement;
    /** @type {HTMLElement | null} */
    status: HTMLElement | null;
    /** @type {HTMLElement | null} */
    tagList: HTMLElement | null;
    isTags: boolean;
    opens: boolean;
    closes: boolean;
    backspaces: boolean;
    stays: boolean;
    duplicates: boolean;
    cap: number;
    debounce: number;
    /** @type {Matcher} */
    matcher: Matcher;
    showsEmpty: boolean;
    creates: boolean;
    /** The row that says nothing matched: the server's own, or one built here. @type {HTMLElement | null} */
    empty: HTMLElement | null;
    /** The server's own empty row, if it wrote one. @type {HTMLElement | null} */
    serverEmpty: HTMLElement | null;
    /** Whether the server's empty row was hidden before we took it over. */
    emptyWasHidden: "until-found" | boolean;
    /** The values held: the tags the server rendered, then what was added. @type {string[]} */
    chosen: string[];
    /** Whether a tag list written `hidden` is shown once it holds a tag. */
    tagsHidden: "until-found" | boolean;
    /** What the markup looked like before this controller touched it. */
    before: {
        expanded: string | null;
        listHidden: HTMLElement['hidden'];
        hidden: HTMLElement['hidden'][];
        tags: Element[];
        status: string;
    };
    /** Puts the status line back where it was. */
    unslot: () => void;
    /** Takes the open list out of the top layer again (js/top-layer.js). */
    lower: () => void;
    /** A layer on top of the combobox (js/usual-picker.js) decides what shows [kpadopt6]. @type {ComboboxHook | null} */
    hook: ComboboxHook | null;
    /** The virtual focus between the input and the list; set by `setListbox` before first use. @type {Listbox} */
    listbox: Listbox;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    /** A boolean option: the box's `data-kp-…` attribute when it has one, else the default. @param {string} name @param {boolean} fallback */
    flag(name: string, fallback: boolean): boolean;
    /** Keep the listbox and undo it on destroy. @param {Listbox} listbox */
    setListbox(listbox: Listbox): void;
    /** A layer on top of the combobox takes over (or lets go, with null). @param {ComboboxHook | null} next */
    extend(next: ComboboxHook | null): void;
    /** The status line moves into a form-grid row where there is one. */
    claimStatus(): void;
    addEmptyRow(): void;
    /** Tags the server rendered are the starting set, not invisible. */
    readChosen(): void;
    /** Remember the markup as the server wrote it, for detach. */
    snapshot(): void;
    /** Put the markup back as the server wrote it. */
    restore(): void;
    /** @param {boolean} next */
    setOpen(next: boolean): void;
    open(): void;
    close(): void;
    /** Show only the options whose text matches, and say how many are left. @returns {number} */
    filter(): number;
    /** The option whose value (or text) is `value`. @param {string} value @returns {HTMLElement | null} */
    optionFor(value: string): HTMLElement | null;
    /** @param {string} value @param {string} label @param {'add' | 'remove' | 'set'} action */
    announce(value: string, label: string, action: 'add' | 'remove' | 'set'): void;
}
