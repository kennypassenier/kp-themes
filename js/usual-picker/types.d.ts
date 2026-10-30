export type UsualItem = {
    value: string;
    label: string;
    el: HTMLElement;
};
export type UsualModel = {
    box: HTMLElement;
    input: HTMLInputElement;
    list: HTMLElement;
    status: HTMLElement | null;
    handle: import('../combobox.js').ComboboxHandle;
    items: UsualItem[];
    /**
     * the band set from a script
     */
    given: {
        value: string;
        uses?: number;
    }[] | null;
    expanded: boolean;
    nextFrom: string | null;
    notToday: Set<string>;
    panel: HTMLElement;
    busy: import('../busy-card.js').BusyCard | null;
    hintEl: HTMLElement;
    /**
     * the line under the field after an add, with its Undo
     */
    noteEl: HTMLElement;
    /**
     * the usual choices' own check (Not today), when the picker has one
     */
    check: HTMLElement | null;
    /**
     * what the check was drawn for (its look and the band), so a sync redraws only on a change
     */
    checkKey: string;
    /**
     * detaches the three-way chips of the check
     */
    checkOff: () => void;
    /**
     * a change made by the check itself: no pick event
     */
    silent: boolean;
};
export type UsualHandle = {
    element: HTMLElement;
    /**
     * hand over the band (`{ value, uses }` with the source `counts`)
     */
    setUsual: (values: readonly (string | {
        value: string;
        uses?: number;
    })[]) => void;
    /**
     * the band as drawn
     */
    usual: () => string[];
    /**
     * the values marked "Not today"
     */
    notToday: () => string[];
    setState: (state: 'ready' | 'loading' | 'empty' | 'error') => void;
    setHint: (text: string) => void;
    /**
     * read the options again after the page changed them
     */
    refresh: () => void;
};
/**
 * @typedef {object} UsualItem
 * @property {string} value
 * @property {string} label
 * @property {HTMLElement} el
 */
/**
 * @typedef {object} UsualModel
 * @property {HTMLElement} box
 * @property {HTMLInputElement} input
 * @property {HTMLElement} list
 * @property {HTMLElement | null} status
 * @property {import('../combobox.js').ComboboxHandle} handle
 * @property {UsualItem[]} items
 * @property {{ value: string, uses?: number }[] | null} given the band set from a script
 * @property {boolean} expanded
 * @property {string | null} nextFrom
 * @property {Set<string>} notToday
 * @property {HTMLElement} panel
 * @property {import('../busy-card.js').BusyCard | null} busy
 * @property {HTMLElement} hintEl
 * @property {HTMLElement} noteEl the line under the field after an add, with its Undo
 * @property {HTMLElement | null} check the usual choices' own check (Not today), when the picker has one
 * @property {string} checkKey what the check was drawn for (its look and the band), so a sync redraws only on a change
 * @property {() => void} checkOff detaches the three-way chips of the check
 * @property {boolean} silent a change made by the check itself: no pick event
 */
/**
 * @typedef {object} UsualHandle
 * @property {HTMLElement} element
 * @property {(values: readonly (string | { value: string, uses?: number })[]) => void} setUsual hand over the band (`{ value, uses }` with the source `counts`)
 * @property {() => string[]} usual the band as drawn
 * @property {() => string[]} notToday the values marked "Not today"
 * @property {(state: 'ready' | 'loading' | 'empty' | 'error') => void} setState
 * @property {(text: string) => void} setHint
 * @property {() => void} refresh read the options again after the page changed them
 */
export {};
