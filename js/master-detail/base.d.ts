import { Controller } from '../controller.js';
import { DetailState } from './detail-state.js';
import { Folding } from './folding.js';
import { DetailParts } from './parts.js';
/**
 * The state and movement of one `[data-kp-master-detail]` layout that has a detail pane and a window, and a list pane, or, without one, an
 * aside: the detail + aside variant [homelab gap 73], where the detail always shows and only the aside folds.
 */
export declare class MasterDetailBase extends Controller {
    doc: Document;
    view: Window;
    /** The list pane, or null in the detail + aside variant. */
    list: HTMLElement | null;
    detail: HTMLElement;
    aside: HTMLElement | null;
    useHistory: boolean;
    folding: Folding;
    parts: DetailParts;
    detailState: DetailState;
    /** The key of the selected item. @type {string | null} */
    selected: string | null;
    /** The item that opened the detail, to give the focus back to. @type {HTMLElement | null} */
    opener: HTMLElement | null;
    listScroll: number;
    /** Whether a history entry was pushed for the open detail. */
    pushed: boolean;
    /** What a page gets back from masterDetail(). @type {import('./constants.js').MasterDetailHandle} */
    handle: import('./constants.js').MasterDetailHandle;
    /**
     * @param {HTMLElement} host
     * @param {{ history?: boolean }} [options] `history: false` leaves the browser's history alone
     */
    constructor(host: HTMLElement, options?: {
        history?: boolean;
    });
    /** The columns, from `data-kp-pane-widths` or the defaults. */
    setColumns(): void;
    /** The list as a listbox: roles on the list and its items, and the item the markup already selected. */
    readItems(): void;
    /** Take the marks the layout wrote away. */
    undoMarks(): void;
    items(): HTMLElement[];
    /** @param {string | null} key */
    itemOf(key: string | null): HTMLElement | null;
    /** Mark the selected item and give the roving tab stop to it (or the first). */
    paint(): void;
    /** Write the fold marks on the layout, and let the loading look follow the pane on screen. */
    sync(): void;
    /** Select an item (without opening the detail). @param {string | null} key @param {{ focus?: boolean }} [how] */
    select(key: string | null, how?: {
        focus?: boolean;
    }): void;
    heading(): HTMLElement | null;
    /** Select an item and, folded, show the detail in its place. @param {string} key @param {{ focus?: boolean }} [how] */
    open(key: string, how?: {
        focus?: boolean;
    }): void;
    /** The detail replaces the list: arrive, push a history entry, focus the heading. @param {string} key @param {HTMLElement} item */
    showDetail(key: string, item: HTMLElement): void;
    /** Show the list again (folded). @param {{ fromHistory?: boolean }} [how] */
    close({ fromHistory }?: {
        fromHistory?: boolean;
    }): void;
}
