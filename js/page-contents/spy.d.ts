import { ContentsRead } from './read.js';
export declare class ContentsSpy extends ContentsRead {
    /** Mark an entry as the current one and say so when it changed. @param {string | null} next */
    mark(next: string | null): void;
    /** Whether the page, or the pane the sections scroll in, is scrolled to its foot. @param {HTMLElement | null} own */
    atEnd(own: HTMLElement | null): boolean;
    /** Find the current section from the boxes of the sections and mark it. */
    spy(): void;
    /** Ask for a spy on the next frame. */
    queueSpy(): void;
    /** A pane with its own scroll: its scroll does not bubble to the window, so it is listened to itself (and again when the sections move to another pane). */
    bindPane(): void;
}
