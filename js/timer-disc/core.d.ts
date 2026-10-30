import { Controller } from '../controller.js';
export declare class DiscCore extends Controller {
    s: import("../strings/types.js").Strings;
    doc: Document;
    view: Window & typeof globalThis;
    /** The device's date and time, which an `until` option is counted against. */
    wallNow: () => number;
    seconds: number;
    scaleSeconds: number;
    name: string;
    disabled: boolean;
    bare: boolean;
    /** The moment the disc counts down to, epoch ms, when the `until` option names one. @type {number | null} */
    until: number | null;
    parts: {
        face: HTMLDivElement;
        caption: HTMLParagraphElement;
        line: HTMLParagraphElement;
        said: HTMLSpanElement;
    };
    /**
     * @param {HTMLElement} host
     * @param {{ now?: () => number, wall?: () => number }} [options]
     */
    constructor(host: HTMLElement, options?: {
        now?: () => number;
        wall?: () => number;
    });
    /** The options, read again when an attribute changes. */
    read(): void;
    /** Whether motion is off, so the edge steps instead of gliding. */
    still(): boolean;
    /** The face with its sector, marks and hub, the caption, the status line and the spoken status. */
    buildParts(): {
        face: HTMLDivElement;
        caption: HTMLParagraphElement;
        line: HTMLParagraphElement;
        said: HTMLSpanElement;
    };
}
