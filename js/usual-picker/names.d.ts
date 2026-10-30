/** A name as the guard compares it: case, accents and spacing ignored. Pure. @param {string} text */
export declare function normaliseName(text: string): string;
/**
 * How alike two names are, 0 to 1: one minus the edit distance over the longer length, after `normaliseName`. Pure.
 * @param {string} a @param {string} b
 */
export declare function similarity(a: string, b: string): number;
/**
 * The names closest to what was typed, nearest first: at least `threshold` alike, at most `max`, never an identical one. Pure.
 * @template {{ label: string }} T
 * @param {string} typed @param {readonly T[]} names @param {number} [threshold] @param {number} [max]
 * @returns {T[]}
 */
export declare function nearNames<T extends {
    label: string;
}>(typed: string, names: readonly T[], threshold?: number, max?: number): T[];
