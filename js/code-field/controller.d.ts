import { CodeFieldProblems } from './problem.js';
export declare class CodeFieldControl extends CodeFieldProblems {
    /** @type {number | undefined} */
    debounce: number | undefined;
    /** @type {number | undefined} */
    copyTimer: number | undefined;
    /** Esc was pressed: the next Tab leaves the field instead of indenting. */
    escaped: boolean;
    /** What `aria-describedby` was before the field added its own. @type {string | null} */
    describedBefore: string | null;
    /** The handle a page gets, made when the field is wired. @type {import('../code-field.js').CodeFieldHandle | null} */
    handle: import('../code-field.js').CodeFieldHandle | null;
    /** @param {HTMLElement} host a `textarea[data-kp-code-field]` */
    constructor(host: HTMLElement);
    connect(): void;
    /** Makes the handle a page gets from `codeField(area)`. @returns {import('../code-field.js').CodeFieldHandle} */
    makeHandle(): import('../code-field.js').CodeFieldHandle;
    /** Takes the chrome and the marks the field added off the textarea again. */
    unmount(): void;
    /** The tools, the gutter and the readout follow the attributes the page may change later. */
    watchAttributes(): void;
    /** The form was reset: the problem goes and the field is drawn again. */
    afterReset(): void;
    /** Esc then Tab leaves the field; any other key or a press puts Tab back to indenting. */
    dropEscape(): void;
    onInput(): void;
    onBlur(): void;
    /** The gutter's wheel scrolls the text. @param {WheelEvent} event */
    onGutterWheel(event: WheelEvent): void;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** Tab writes one indent over the selection. */
    indent(): void;
    /** Shift+Tab takes one indent off the start of the caret's line. */
    outdent(): void;
    /** The wrap tool flips the wrapping; the copy tool copies the text and says how it went. @param {MouseEvent} event */
    onTool(event: MouseEvent): Promise<void>;
    /** A disabled or read-only field switches its tools off, except Copy. */
    lock(): void;
}
