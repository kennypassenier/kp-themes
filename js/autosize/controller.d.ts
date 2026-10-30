import { Controller } from '../controller.js';
import { CounterLine } from './counter.js';
/** The controller of one `textarea[data-kp-autosize]`. */
export declare class AutosizeController extends Controller {
    area: HTMLTextAreaElement;
    doc: Document;
    view: Window;
    /** The words as they stood when the box attached. */
    strings: import("../strings/types.js").Strings;
    options: import("./constants.js").AutosizeOptions;
    /** @type {'ready' | 'loading' | 'error'} */
    state: 'ready' | 'loading' | 'error';
    /** The tallest the box has been (shrink off keeps it). */
    tallest: number;
    /** The last height reported, so the event fires on a change only. */
    lastHeight: number;
    /** @type {import('../busy-card.js').BusyCard | null} */
    card: import('../busy-card.js').BusyCard | null;
    /** The frame the busy card needs around the box. @type {HTMLElement | null} */
    frame: HTMLElement | null;
    wasReadOnly: boolean;
    phoneQuery: MediaQueryList;
    counter: CounterLine;
    /** Where the last paste started, or -1. */
    pasteAt: number;
    /** The width last measured, for the resize observer. */
    width: number;
    /** What a page gets back from autosize(). @type {import('./constants.js').AutosizeHandle} */
    handle: import('./constants.js').AutosizeHandle;
    /**
     * @param {HTMLElement} host the textarea
     * @param {import('./constants.js').AutosizeOptions} [options] overrides the markup
     */
    constructor(host: HTMLElement, options?: import('./constants.js').AutosizeOptions);
    /** @returns {import('./constants.js').AutosizeHandle} */
    makeHandle(): import('./constants.js').AutosizeHandle;
    minRows(): number;
    /** The most lines, or null for no cap (a disabled or read-only box shows its whole value). */
    maxRows(): number | null;
    shrinks(): boolean;
    counterMode(): "both" | "chars" | "lines" | "off";
    /** @returns {'css' | 'js'} */
    engineInUse(): 'css' | 'js';
    /** The cap a phone puts on the box, so the keyboard never hides Save; undefined elsewhere. */
    phoneCap(): number | undefined;
    count(): {
        chars: number;
        lines: number;
    };
    connect(): void;
    /** A script writes `value =`: the setter is the one door. */
    hookValueSetter(): void;
    /** A change of width changes the wrapping; the viewport and a font arriving change the cap and the lines. */
    watchSize(): void;
    /** Mod+Enter submits, and the `?` sheet lists it. */
    registerSubmitKey(): void;
    /** Undo what the box got: the card, frame, counter, twin, inline sizes, class and marks. */
    reset(): void;
    /** A person types, pastes or cuts. */
    onInput(): void;
    onChange(): void;
    drawCounter(): void;
    keepCaretInView(): void;
    /** Size the box for its text, with the engine in use, and report the height. */
    measure(): void;
    /** The browser sizes the field; the package says the least and the most, and measures to report. */
    measureCss(): void;
    /** The package sizes the field itself, from the twin's measure. */
    measureJs(): void;
    /** Mark the cap, and fire the event when the height changed. @param {number} height @param {number} lines @param {boolean} capped */
    report(height: number, lines: number, capped: boolean): void;
}
