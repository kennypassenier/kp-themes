import { PreviewCore } from './core.js';
export type PreviewLoad = import('./core.js').PreviewLoad;
export declare class PreviewRun extends PreviewCore {
    connect(): void;
    /** Show the document at `at`: title, buttons and position first, then the loading state, then what the server says. */
    load(): void;
    /**
     * The load failed: say so, unless a later load made this one stale.
     * @param {PreviewLoad} load
     * @param {string} url
     * @param {string} reason
     * @param {string} message
     */
    fail(load: PreviewLoad, url: string, reason: string, message: string): void;
    /**
     * Ask the server, then show the file.
     * @param {PreviewLoad} load
     * @param {string} url
     * @param {number} page
     */
    settle(load: PreviewLoad, url: string, page: number): Promise<void>;
    /**
     * What the server says about the file: a missing one is said before a frame shows an error page.
     * @param {PreviewLoad} load
     * @param {string} url
     * @returns {Promise<string | null>} the Content-Type ('' when unknown), or null when there is nothing left to show
     */
    probe(load: PreviewLoad, url: string): Promise<string | null>;
    /** The facts line: kind, size and when it was made, from the HEAD answer. @param {Response} head @param {string} url @param {string} contentType */
    writeFacts(head: Response, url: string, contentType: string): void;
    /**
     * Show the file as a picture or a frame, or say that the browser cannot show a PDF.
     * @param {PreviewLoad} load
     * @param {string} url
     * @param {number} page
     * @param {string} contentType
     */
    show(load: PreviewLoad, url: string, page: number, contentType: string): void;
    /** @param {PreviewLoad} load @param {string} url */
    imageFor(load: PreviewLoad, url: string): HTMLImageElement;
    /** @param {PreviewLoad} load @param {string} url @param {number} page @param {'pdf' | 'image' | 'text'} wanted */
    frameFor(load: PreviewLoad, url: string, page: number, wanted: 'pdf' | 'image' | 'text'): HTMLIFrameElement;
}
