import { Controller } from '../controller.js';
/** The controller of one `textarea[data-kp-json]`. */
export declare class JsonFieldController extends Controller {
    area: HTMLTextAreaElement;
    options: import("./constants.js").JsonFieldOptions;
    doc: Document;
    view: (Window & typeof globalThis) | null;
    strings: import("../strings/types.js").Strings;
    wrap: boolean;
    minRows: number;
    /** The schema the page's `kp-json-validate` handler is handed: parsed JSON, or the raw text. @type {unknown} */
    schema: unknown;
    id: string;
    parts: {
        tools: HTMLElement;
        toolFormat: HTMLButtonElement;
        toolMinify: HTMLButtonElement;
        toolWrap: HTMLButtonElement;
        word: HTMLElement;
        root: HTMLElement;
        frame: HTMLElement;
        gutter: HTMLElement;
        numbers: HTMLElement;
        status: HTMLElement;
        help: HTMLElement;
        mirror: HTMLElement;
    };
    /** @type {'empty' | 'valid' | 'invalid' | 'text'} */
    state: 'empty' | 'valid' | 'invalid' | 'text';
    /** The parsed value of a valid text. @type {unknown} */
    parsed: unknown;
    /** The line the error is on, 0 for none. */
    errorLine: number;
    /** @type {number | undefined} */
    debounce: number | undefined;
    /** @type {number | undefined} */
    copyTimer: number | undefined;
    /** Whether Esc was pressed, so the next Tab leaves the field. */
    escaped: boolean;
    field: Element | null;
    /** The field's own error slot (js/forms.js), when it has one. */
    holder: HTMLElement | null;
    /** What a page gets back from jsonField(). @type {import('./constants.js').JsonFieldHandle} */
    handle: import('./constants.js').JsonFieldHandle;
    /**
     * @param {HTMLElement} host the textarea
     * @param {import('./constants.js').JsonFieldOptions} [options] each field's own attributes fill what the page leaves out
     */
    constructor(host: HTMLElement, options?: import('./constants.js').JsonFieldOptions);
    modeOption(): "allow-text" | "strict";
    checkOption(): "blur" | "input";
    formatOption(): "button" | "off" | "on-blur";
    indent(): string;
    gutterWanted(): boolean;
    /** The schema attribute: JSON when it parses, else the raw text, else none. */
    readSchema(): any;
    connect(): void;
    /** Watch the attributes (disabled, read-only, the options) and the width. */
    watchAttributes(): void;
    /** Listen to the box, the gutter, the tools and the form's reset. */
    watchEvents(): void;
    /** Undo what the field got: validity, description, inline sizes and the frame. @param {string | null} describedBefore */
    undoDom(describedBefore: string | null): void;
    check(): void;
    /** Write a text as if typed. @param {string} text */
    write(text: string): void;
    /** Lay the JSON out with the indent; false when it is not JSON. */
    format(): boolean;
    /** Take the layout off; false when it is not JSON. */
    minify(): boolean;
    /** After a rewrite: no pending check, check now, size the box. */
    settle(): void;
    onInput(): void;
    onBlur(): void;
    onScroll(): void;
    /** The wheel over the line numbers scrolls the text, as it does over the box [kpadopt5-r3]. @param {WheelEvent} event */
    onGutterWheel(event: WheelEvent): void;
    /** @param {MutationRecord[]} records */
    onAttributes(records: MutationRecord[]): void;
    syncOptions(): void;
    /** The attribute names the wrap again, at run time [ALM 18]; the tool button's own toggle is not undone by another attribute. */
    syncWrap(): void;
}
