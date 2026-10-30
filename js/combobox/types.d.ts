export type Matcher = (optionText: string, query: string) => boolean;
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
    /**
     * let a layer on top of the combobox (js/usual-picker.js) decide which options show, what the status says and what a choice does [kpadopt6]
     */
    extend: (hook: ComboboxHook | null) => void;
};
export type ComboboxHook = {
    shown?: (option: HTMLElement, query: string, matched: boolean) => boolean;
    after?: (query: string, visible: number) => void;
    status?: (query: string, visible: number) => string | null;
    choose?: (option: HTMLElement) => boolean;
};
export type SelectHandle = {
    element: HTMLSelectElement;
    /**
     * the drawn listbox
     */
    list: HTMLElement;
    open: () => void;
    close: () => void;
    /**
     * re-read the options and the value
     */
    refresh: () => void;
};
/** @typedef {(optionText: string, query: string) => boolean} Matcher */
/**
 * @typedef {object} ComboboxHandle
 * @property {HTMLElement} element
 * @property {() => string[]} values
 * @property {(values: readonly string[]) => void} set replace the held values (a combobox takes the first)
 * @property {() => void} open
 * @property {() => void} close
 * @property {(text: string) => void} query type on the consumer's behalf
 * @property {() => void} refresh re-read the options after the consumer changed them
 * @property {(hook: ComboboxHook | null) => void} extend let a layer on top of the combobox (js/usual-picker.js) decide which options show, what the status says and what a choice does [kpadopt6]
 */
/**
 * What a layer on top of the combobox may decide [kpadopt6]. `shown` has the last word on one option (its default is what
 * the matcher said), `after` runs once the options are filtered, `status` replaces the status line, `choose` returns true to
 * swallow a choice (a row that is not a value).
 * @typedef {object} ComboboxHook
 * @property {(option: HTMLElement, query: string, matched: boolean) => boolean} [shown]
 * @property {(query: string, visible: number) => void} [after]
 * @property {(query: string, visible: number) => string | null} [status]
 * @property {(option: HTMLElement) => boolean} [choose]
 */
/**
 * @typedef {object} SelectHandle
 * @property {HTMLSelectElement} element
 * @property {HTMLElement} list the drawn listbox
 * @property {() => void} open
 * @property {() => void} close
 * @property {() => void} refresh re-read the options and the value
 */
export {};
