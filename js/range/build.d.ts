export type Strings = import('../strings.js').Strings;
export type RangeBound = {
    set: HTMLFieldSetElement;
    picker: HTMLElement;
    date: HTMLInputElement;
    time: HTMLInputElement;
};
/** @typedef {import('../strings.js').Strings} Strings */
/** @typedef {{ set: HTMLFieldSetElement, picker: HTMLElement, date: HTMLInputElement, time: HTMLInputElement }} RangeBound */
/**
 * The bar of presets: a radio group of segmented items.
 * @param {Document} doc @param {Strings} s @param {string[]} presets @param {boolean} disabled
 * @returns {{ bar: HTMLElement, group: HTMLElement }}
 */
export declare function buildBar(doc: Document, s: Strings, presets: string[], disabled: boolean): {
    bar: HTMLElement;
    group: HTMLElement;
};
/**
 * The Custom… button that opens the panel.
 * @param {Document} doc @param {Strings} s @param {string} id @param {boolean} disabled
 */
export declare function buildCustomButton(doc: Document, s: Strings, id: string, disabled: boolean): HTMLButtonElement;
/**
 * The custom panel: two bounds, an error line, Cancel and Apply.
 * @param {Document} doc @param {Strings} s @param {string} id
 */
export declare function buildPanel(doc: Document, s: Strings, id: string): {
    panel: HTMLDivElement;
    from: RangeBound;
    to: RangeBound;
    error: HTMLParagraphElement;
    cancel: HTMLButtonElement;
    apply: HTMLButtonElement;
};
