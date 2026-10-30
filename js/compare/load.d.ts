import { CompareCore } from './core.js';
export declare class CompareLoad extends CompareCore {
    images: HTMLImageElement[];
    /** The failed-image notes standing in the panes. @type {HTMLElement[]} */
    notes: HTMLElement[];
    /** @type {import('../busy-card.js').BusyCard | null} */
    card: import('../busy-card.js').BusyCard | null;
    /** Whether the page holds the box in its loading state. */
    held: boolean;
    drawn: boolean;
    /**
     * @param {HTMLElement} host
     * @param {Record<string, unknown>} [options]
     */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    /** Hold the box in its loading state while the page reads its panes, or let it go. @param {boolean} busy */
    hold(busy: boolean): void;
    settle(): void;
    /** A failed image says so over its pane, with a normal-size Retry that loads it again. @param {HTMLElement} pane */
    noteFailed(pane: HTMLElement): void;
    /** @param {HTMLElement} pane @param {HTMLElement} note */
    retry(pane: HTMLElement, note: HTMLElement): void;
}
