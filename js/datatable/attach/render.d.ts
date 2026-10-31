import { getStrings } from '../../strings.js';
export type DataTableControl = import('./controller.js').DataTableControl;
export declare class TableRender {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    pillsList: HTMLElement;
    clearButton: HTMLButtonElement;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    render(): void;
    /**
     * Show this page's rows and hide the rest. Reordering by appending: the rows are the same elements, so anything a consumer
     * attached to them survives a sort. A row's detail travels directly under it.
     */
    placeRows(): void;
    /**
     * The status line: what is shown, or the busy words with a spinner while loading. Loading, first or again: a spinner says it is
     * working [#states]. It used to come only on a refresh, so a first load that took minutes showed no sign of life [fix-80].
     * @param {HTMLElement} status @param {ReturnType<typeof getStrings>} s @param {number} from @param {number} count
     */
    writeStatus(status: HTMLElement, s: ReturnType<typeof getStrings>, from: number, count: number): void;
    /**
     * A count the table keeps itself, in a part the live region does not announce: a screen reader hears the words when they change,
     * not a number every second, and the tick rewrites this one element rather than rendering the table [fix-84].
     * @param {HTMLElement} status @param {ReturnType<typeof getStrings>} s
     */
    startBusyClock(status: HTMLElement, s: ReturnType<typeof getStrings>): void;
    /** The pager: the page-size choice, Back, the page and Next. @param {HTMLElement} pager @param {ReturnType<typeof getStrings>} s @param {number} pages */
    writePager(pager: HTMLElement, s: ReturnType<typeof getStrings>, pages: number): void;
    /**
     * The empty slot. Nothing yet, or nothing matching: each of the slot's two optional parts says its own thing and offers its own
     * way out [fix-85].
     * @param {HTMLElement} empty @param {number} count
     */
    syncEmpty(empty: HTMLElement, count: number): void;
    /** The parts that follow the rows. After a search or a filter the ticked row may be gone from the page, and the header box must say so [gap-13]. */
    syncParts(): void;
    /** @param {string} text @param {boolean} enabled @param {() => void} go @param {'back'} [direction] */
    pagerButton(text: string, enabled: boolean, go: () => void, direction?: 'back'): HTMLButtonElement;
}
