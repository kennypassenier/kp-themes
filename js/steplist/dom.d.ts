export type StepState = import('../steplist.js').StepState;
/** @typedef {import('../steplist.js').StepState} StepState */
/** @param {unknown} state @returns {StepState} */
export declare const known: (state: unknown) => StepState;
/** @param {string} className @param {string} [tag] */
export declare const span: (className: string, tag?: string) => HTMLElement;
/**
 * Set the text parts of an item from a row or a change.
 * @param {Element} item
 * @param {{ title?: string, note?: string, time?: string }} change
 */
export declare function writeText(item: Element, { title, note, time }: {
    title?: string;
    note?: string;
    time?: string;
}): void;
