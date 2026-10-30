import { Controller } from '../controller.js';
import { buildViewerParts } from './parts.js';
export type ViewerOptions = import('../viewer.js').ViewerOptions;
export type ViewerGiven = {
    /**
     * what the page asked for
     */
    options: ViewerOptions;
    doc: Document;
    strings: import('../strings.js').Strings;
    /**
     * the elements built for it
     */
    parts: ReturnType<typeof buildViewerParts>;
};
/**
 * @typedef {object} ViewerGiven
 * @property {ViewerOptions} options what the page asked for
 * @property {Document} doc
 * @property {import('../strings.js').Strings} strings
 * @property {ReturnType<typeof buildViewerParts>} parts the elements built for it
 */
export declare class Viewer extends Controller {
    doc: Document;
    strings: import("../strings/types.js").Strings;
    parts: {
        dialog: HTMLDialogElement;
        title: HTMLElement;
        desc: HTMLElement;
        facts: HTMLElement;
        position: HTMLElement;
        close: HTMLButtonElement;
        stage: HTMLElement;
        content: HTMLElement;
        plate: HTMLElement;
        foot: HTMLElement;
    };
    dialog: HTMLDialogElement;
    viewerOptions: import("../viewer.js").ViewerOptions;
    /** @type {import('../busy-card.js').BusyCard | null} */
    card: import('../busy-card.js').BusyCard | null;
    current: string;
    /** What the page gets back, the same object every time. @type {import('../viewer.js').ViewerHandle} */
    handle: import('../viewer.js').ViewerHandle;
    /**
     * @param {HTMLDialogElement} host the dialog
     * @param {ViewerGiven} given
     */
    constructor(host: HTMLDialogElement, given: ViewerGiven);
    /** @returns {import('../viewer.js').ViewerHandle} */
    buildHandle(): import('../viewer.js').ViewerHandle;
    connect(): void;
    /** @param {HTMLElement} node @param {string} text */
    setText(node: HTMLElement, text: string): void;
    /** "4 of 37", exact, announced politely. @param {{ index: number, total: number } | null} at */
    setPosition(at: {
        index: number;
        total: number;
    } | null): void;
    /**
     * @param {'ready' | 'loading' | 'error' | 'unsupported'} next
     * @param {{ message?: string, retry?: () => void, title?: string }} [detail]
     */
    setState(next: 'ready' | 'loading' | 'error' | 'unsupported', detail?: {
        message?: string;
        retry?: () => void;
        title?: string;
    }): void;
    /** The dialog closed: everything it held goes, then the page hears and the focus goes back. */
    finish(): void;
}
/**
 * Build a viewer's dialog, wire it and open it; a wiring that throws is undone and thrown again.
 * @param {ViewerOptions} options
 */
export declare function launchViewer(options: ViewerOptions): import("../viewer.js").ViewerHandle;
