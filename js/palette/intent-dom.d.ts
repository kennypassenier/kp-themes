export type IntentMode = {
    foldDiacritics: boolean;
    splitHyphen: boolean;
    typo: 0 | 1;
};
/** @typedef {{ foldDiacritics: boolean, splitHyphen: boolean, typo: 0 | 1 }} IntentMode */
/**
 * The element that moves with a command: its `li` when the command is a link wrapped in a presentation item.
 * @param {HTMLElement} list @param {HTMLElement} option
 */
export declare function unitOf(list: HTMLElement, option: HTMLElement): HTMLElement;
/** The shown words of a command and the words that weigh less (a description, the hint attribute). @param {HTMLElement} option */
export declare function textsOf(option: HTMLElement): {
    label: string;
    hint: string;
};
/**
 * Put `ordered`, which share places in the page, into the order given without touching what stands between them.
 * @param {Document} doc @param {HTMLElement[]} ordered
 */
export declare function place(doc: Document, ordered: HTMLElement[]): void;
/** Take a command's marks off, its words whole again. @param {Document} doc @param {HTMLElement} option */
export declare function clearMarks(doc: Document, option: HTMLElement): void;
/**
 * The command's own words in one element, so marks inside them are inline parts of one flex item and not new items of the row (a
 * row is a flex box with a gap).
 * @param {Document} doc @param {HTMLElement} option
 */
export declare function wrapLabel(doc: Document, option: HTMLElement): void;
/** Mark the words of `want` in a command (never in its key hint). @param {Document} doc @param {HTMLElement} option @param {string[]} want @param {IntentMode} mode */
export declare function markWords(doc: Document, option: HTMLElement, want: string[], mode: IntentMode): void;
/** @param {HTMLElement} el @param {boolean} hidden */
export declare function setHidden(el: HTMLElement, hidden: boolean): void;
