export { CODE_FIELD, CODE_FIELD_CHECK_EVENT, CODE_FIELD_STATE_EVENT, CODE_FIELD_CARET_EVENT, CODE_FIELD_CHECK_MS, CODE_FIELD_MAX_ROWS, caretPosition, } from './code-field/values.js';
export type CodeFieldHandle = {
    /**
     * the caret's line and column, counted from 1
     */
    position: () => {
        line: number;
        column: number;
    };
    /**
     * mark the problem the page found; `null` takes it back
     */
    setError: (line: number | null, column?: number | null, message?: string) => void;
    /**
     * ask the page to check the text now
     */
    check: () => void;
    state: () => {
        state: 'ready' | 'invalid';
        line: number | null;
        column: number | null;
        message: string;
    };
};
/**
 * @typedef {object} CodeFieldHandle
 * @property {() => { line: number, column: number }} position the caret's line and column, counted from 1
 * @property {(line: number | null, column?: number | null, message?: string) => void} setError mark the problem the page found; `null` takes it back
 * @property {() => void} check ask the page to check the text now
 * @property {() => { state: 'ready' | 'invalid', line: number | null, column: number | null, message: string }} state
 */
/**
 * The handle of a field that has been attached.
 * @param {Element} area
 * @returns {CodeFieldHandle | null}
 */
export declare function codeField(area: Element): CodeFieldHandle | null;
/**
 * Mark the problem the page found in a code field: its line in the gutter, "Line 3, column 12: why" under the field, the form held back.
 * `setCodeFieldError(area, null)` takes it back.
 * @param {Element} area an attached `textarea[data-kp-code-field]`
 * @param {number | null} line from 1; null: no problem
 * @param {number | null} [column] from 1
 * @param {string} [message]
 */
export declare function setCodeFieldError(area: Element, line: number | null, column?: number | null, message?: string): void;
/**
 * Give every `textarea[data-kp-code-field]` under `root` its gutter, readout and error line.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachCodeFields(root?: ParentNode): () => void;
