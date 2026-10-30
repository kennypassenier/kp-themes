export type StackbarPart = import('../stackbar.js').StackbarPart;
export type DrawnPart = StackbarPart & {
    key: string;
    merged?: number;
    share: number;
    width: number;
};
export type StackbarArithmetic = {
    parts: DrawnPart[];
    whole: number;
    sum: number;
    rest: number;
    over: number;
};
/** @typedef {import('../stackbar.js').StackbarPart} StackbarPart */
/** @typedef {StackbarPart & { key: string, merged?: number, share: number, width: number }} DrawnPart a part as drawn: its key, its share of the whole and its width on the bar */
/** @typedef {{ parts: DrawnPart[], whole: number, sum: number, rest: number, over: number }} StackbarArithmetic */
/** @param {HTMLElement} el */
export declare const langOf: (el: HTMLElement) => string | undefined;
/** A share as words: one decimal under ten per cent, whole above. @param {number} share @param {string | undefined} lang */
export declare function shareText(share: number, lang: string | undefined): string;
/**
 * The arithmetic of a share bar, with no DOM: the parts as drawn (merged
 * into Other where asked), each with its share of the bar, the free rest,
 * and whether the parts run past the whole.
 * @param {StackbarPart[]} parts @param {number | undefined} total @param {number} [other]
 * @returns {StackbarArithmetic}
 */
export declare function stackbarParts(parts: StackbarPart[], total: number | undefined, other?: number): StackbarArithmetic;
