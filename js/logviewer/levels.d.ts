/** The canonical level of a word. @param {string} word */
export declare const logLevel: (word: string) => string;
/** @param {number} ts @param {boolean} date */
export declare function clock(ts: number, date: boolean): string;
/** @param {unknown} value @returns {number} */
export declare function stamp(value: unknown): number;
