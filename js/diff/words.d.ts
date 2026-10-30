export type DiffLine = import('./types.js').DiffLine;
export type Segment = import('./types.js').Segment;
/**
 * The words that differ between two lines: the longest run of pieces they share is kept, the rest is marked.
 * `changed` is false when there is nothing to mark, or when so much of the line differs that the line itself is the
 * change (more than `DIFF_WORD_SHARE` of the longer one), or when a line is too long to split.
 *
 * @param {string} oldText @param {string} newText
 * @returns {{ old: Segment[], new: Segment[], changed: boolean, share: number }}
 */
export declare function diffWords(oldText: string, newText: string): {
    old: Segment[];
    new: Segment[];
    changed: boolean;
    share: number;
};
/**
 * Pair the lines of each run "removed lines, then added lines" one to one and split every pair into words.
 * @param {DiffLine[]} lines @returns {Map<DiffLine, Segment[]>}
 */
export declare function wordPairs(lines: DiffLine[]): Map<DiffLine, Segment[]>;
