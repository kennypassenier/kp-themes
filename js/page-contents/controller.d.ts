import { ContentsDraw } from './draw.js';
export declare class ContentsList extends ContentsDraw {
    /** What the page gets back, the same object every time. @type {import('../page-contents.js').ContentsHandle} */
    handle: import('../page-contents.js').ContentsHandle;
    /**
     * @param {HTMLElement} host the nav
     * @param {Record<string, unknown>} [options]
     */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** The title, the list and the loading bars. @param {string} id */
    build(id: string): void;
    /** Scroll to a section: in its pane when it has one (the page does not move), else the page. @param {import('./core.js').ContentsEntry} hit */
    scrollTo(hit: import('./core.js').ContentsEntry): void;
    /** A press on an entry: scroll there, focus the heading, write the address, mark it. @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
}
