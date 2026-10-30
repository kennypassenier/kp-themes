/** @param {number} n @param {number} lo @param {number} hi */
export declare const clamp: (n: number, lo: number, hi: number) => number;
/** A value snapped to the step and the scale. Pure. @param {number} value @param {number} max @param {number} step */
export declare function snapRating(value: number, max: number, step?: number): number;
/** The numbers as a person says them: 4, 4.5, never 4.50 (a number, so a sentence prints it plain). Pure. @param {number} n */
export declare const plain: (n: number) => number;
/** The words for the levels, from `a|b|c` or a JSON list. @param {string | undefined} raw @returns {string[]} */
export declare function parseLabels(raw: string | undefined): string[];
/** The level a value is at, for the labels: 1 to max, 0 for none. @param {number} value */
export declare const levelOf: (value: number) => number;
