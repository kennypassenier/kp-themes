import { Controller } from '../controller.js';
export type PreviewOptions = import('../docpreview.js').PreviewOptions;
export type ViewerHandle = import('../viewer.js').ViewerHandle;
export type PreviewEntry = {
    url: string;
    title?: string | undefined;
    name?: string | undefined;
};
/** @typedef {import('../docpreview.js').PreviewOptions} PreviewOptions */
/** @typedef {import('../viewer.js').ViewerHandle} ViewerHandle */
/** @typedef {{ url: string, title?: string | undefined, name?: string | undefined }} PreviewEntry */
/** One load of one document: whether it is still the one that counts, and its timeout. A later load makes an earlier one stale. */
export declare class PreviewLoad {
    live: boolean;
    /** The timeout's id, 0 for none. */
    timer: number;
    constructor();
    /** Stop counting: late answers of this load do nothing. */
    stop(): void;
}
export declare class PreviewCore extends Controller {
    preview: import("../docpreview.js").PreviewOptions;
    viewer: import("../viewer.js").ViewerHandle;
    group: PreviewEntry[] | null;
    doc: Document;
    strings: import("../strings/types.js").Strings;
    locale: string;
    /** Where in the group the shown document is. */
    at: number;
    /** @type {HTMLIFrameElement | null} */
    frame: HTMLIFrameElement | null;
    /** @type {PreviewLoad | null} */
    current: PreviewLoad | null;
    /**
     * @param {HTMLElement} host the viewer's dialog
     * @param {{ preview: PreviewOptions, viewer: ViewerHandle, group: PreviewEntry[] | null }} init
     */
    constructor(host: HTMLElement, init: {
        preview: PreviewOptions;
        viewer: ViewerHandle;
        group: PreviewEntry[] | null;
    });
    /** The document shown now. @returns {PreviewEntry} */
    entry(): PreviewEntry;
    /**
     * The foot's buttons for a document.
     * @param {string} url
     * @param {string} name
     * @returns {import('../viewer.js').ViewerAction[]}
     */
    actionsFor(url: string, name: string): import('../viewer.js').ViewerAction[];
    /** The title of the document shown. @param {PreviewEntry} entry */
    titleOf(entry: PreviewEntry): string;
    /** Print the frame. */
    printFrame(): void;
    /** Whether the foot has the button for an action. @param {string} kind */
    hasAction(kind: string): boolean;
    /** Press the foot's button for an action. @param {string} kind */
    pressAction(kind: string): void;
    /** Whether Print is offered and there is a frame to print. */
    canPrint(): boolean;
    /** Whether there is a document `by` places away in the group. @param {number} by */
    canStep(by: number): boolean;
    /** Go to the document `by` places away in the group. @param {number} by */
    step(by: number): void;
    /** Show the document at `at`. The run overrides it. */
    load(): void;
    /** @param {HTMLIFrameElement | null} frame */
    setFrame(frame: HTMLIFrameElement | null): void;
    /** Start a load: the one before it goes stale. @returns {PreviewLoad} */
    beginLoad(): PreviewLoad;
    /** Stop the load that is running, if there is one. */
    stopLoad(): void;
    /** The viewer was closed: stop loading, say so, and undo. */
    closed(): void;
}
