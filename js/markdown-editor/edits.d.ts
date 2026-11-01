export type Edit = {
    from: number;
    to: number;
    text: string;
    select: [number, number];
};
/**
 * Bold or italic: the selection wrapped in `marker`, or unwrapped when it already is.
 * @param {string} value @param {number} start @param {number} end @param {string} marker `**` or `_`
 * @returns {Edit}
 */
export declare function wrap(value: string, start: number, end: number, marker: string): Edit;
/**
 * A list, a checklist or a heading on every line the selection touches: added, or taken off when every line has it already.
 * @param {string} value @param {number} start @param {number} end @param {'list' | 'task' | 'heading'} kind
 * @returns {Edit}
 */
export declare function prefixLines(value: string, start: number, end: number, kind: 'list' | 'task' | 'heading'): Edit;
/**
 * A link: `[words](https://)` round the selection, with the address selected to type over; with nothing selected the words are
 * `placeholder`, selected first.
 * @param {string} value @param {number} start @param {number} end @param {string} placeholder
 * @returns {Edit}
 */
export declare function link(value: string, start: number, end: number, placeholder: string): Edit;
/**
 * Enter at the end of a list item: the next item, numbered one on and with an empty box when this one has a box. Enter on an
 * item with no words ends the list (its marker goes). Null when Enter is not the list's (not a list line, or a selection).
 * @param {string} value @param {number} start @param {number} end
 * @returns {Edit | null}
 */
export declare function continueList(value: string, start: number, end: number): Edit | null;
/**
 * The line `line` (from 0) of a text, as a range, for a change that touches only it.
 * @param {string} value @param {number} line
 * @returns {[number, number] | null}
 */
export declare function lineRange(value: string, line: number): [number, number] | null;
