import { Controller } from '../controller.js';
export declare class CodeFieldCore extends Controller {
    area: HTMLTextAreaElement;
    doc: Document;
    view: (Window & typeof globalThis) | null;
    strings: import("../strings/types.js").Strings;
    wrap: boolean;
    minRows: number;
    id: string;
    ui: {
        root: HTMLDivElement;
        tools: HTMLDivElement;
        frame: HTMLDivElement;
        gutter: HTMLDivElement;
        numbers: HTMLDivElement;
        status: HTMLParagraphElement;
        readout: HTMLParagraphElement;
        help: HTMLParagraphElement;
        mirror: HTMLDivElement;
        word: HTMLSpanElement;
    };
    /** The last caret position announced, as "line:column". */
    lastCaret: string;
    /** The line of the error, 0 for none; the gutter marks it. */
    errorLine: number;
    /** @param {HTMLElement} host a `textarea[data-kp-code-field]` */
    constructor(host: HTMLElement);
    language(): string;
    getWhen(): "blur" | "input";
    getIndent(): string;
    gutterWanted(): boolean;
    blocks(): boolean;
    /** Wrap long lines or let them scroll; the tool, the gutter and the height follow. @param {boolean} on */
    setWrap(on: boolean): void;
    lineHeight(): number;
    /** The height of each line: one line height, or what the mirror measures when long lines wrap. @param {string[]} lines @returns {number[]} */
    lineHeights(lines: string[]): number[];
    drawGutter(): void;
    /** Grow the field with its text, from `rows` lines to the most it grows to. */
    grow(): void;
    /** "Line 3, column 12 · YAML": where the caret is. */
    drawReadout(): void;
}
