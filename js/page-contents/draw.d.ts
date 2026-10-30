import { ContentsSpy } from './spy.js';
export type ContentsEntry = import('./core.js').ContentsEntry;
/** @typedef {import('./core.js').ContentsEntry} ContentsEntry */
export declare class ContentsDraw extends ContentsSpy {
    /** One list item for an entry. @param {import('../page-contents.js').ContentsItem} item @param {HTMLElement} target @returns {ContentsEntry} */
    entryFor(item: import('../page-contents.js').ContentsItem, target: HTMLElement): ContentsEntry;
    /** Read the entries again and draw them; unchanged entries only get a spy. */
    draw(): void;
}
