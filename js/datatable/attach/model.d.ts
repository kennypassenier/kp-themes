export type FilterValue = import('../events.js').FilterValue;
export type SortKey = import('../events.js').SortKey;
export type State = import('../events.js').State;
export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('../events.js').FilterValue} FilterValue */
/** @typedef {import('../events.js').SortKey} SortKey */
/** @typedef {import('../events.js').State} State */
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableModel {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    all: HTMLTableRowElement[];
    /** The order the server rendered, so detach can put it back. */
    rendered: HTMLTableRowElement[];
    /** @type {HTMLTableRowElement[]} */
    shownRows: HTMLTableRowElement[];
    /** @type {HTMLTableRowElement[]} */
    pageRows: HTMLTableRowElement[];
    page: number;
    query: string;
    /** @type {number | null} */
    scope: number | null;
    /** @type {Map<number, FilterValue>} */
    filters: Map<number, FilterValue>;
    /** @type {SortKey[]} */
    sorts: SortKey[];
    /** @type {State} */
    state: State;
    /** The consumer's own words for the status line while it loads (busy(), fix-80); null is the dictionary's busy word. @type {string | null} */
    busyText: string | null;
    /** Why the table failed, in the app's words (fail(), fix-85); null is the dictionary's. @type {string | null} */
    failReason: string | null;
    /** When the load began, for a count the table keeps itself (busy({ since }), fix-84); null is no count. @type {number | null} */
    busySince: number | null;
    /** The timer that moves that count, only while a counting table loads. @type {ReturnType<typeof setInterval> | null} */
    busyTimer: ReturnType<typeof setInterval> | null;
    /** The element the count is written into, so the tick touches nothing else. @type {HTMLElement | null} */
    busyClock: HTMLElement | null;
    /** A large spinner over the rows while it loads, for a table long or slow enough that the status line is out of sight (busy({ overlay }) or data-kp-busy-overlay). */
    busyOverlay: boolean;
    /** That layer, while it shows. @type {HTMLElement | null} */
    overlayLayer: HTMLElement | null;
    /** Its copy of the count, moved by the same tick. @type {HTMLElement | null} */
    overlayClock: HTMLElement | null;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** Every row as it was rendered. Sorting reorders this array, never the DOM's idea of it. */
    isRow(/** @type {HTMLTableRowElement} */ row: HTMLTableRowElement): boolean;
    /** A held row stays hidden whatever the table does; the page lifts it with the attribute [b3b4-1019]. */
    holdRows(): void;
}
