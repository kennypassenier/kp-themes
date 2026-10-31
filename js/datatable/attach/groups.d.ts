import { getStrings } from '../../strings.js';
export type Strings = import('../../strings/types.js').Strings;
export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('../../strings/types.js').Strings} Strings */
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableGroups {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** Each group's heading row, by group key. @type {Map<string, HTMLTableRowElement>} */
    groups: Map<string, HTMLTableRowElement>;
    /** The group keys folded now; kept by key, so they outlive a refresh. @type {Set<string>} */
    folded: Set<string>;
    /** Rows of a folding group held shown while their arrival plays backwards. @type {Set<HTMLTableRowElement>} */
    departing: Set<HTMLTableRowElement>;
    /** Every group key seen, so a heading's data-kp-folded counts the first time only. @type {Set<string>} */
    seenGroups: Set<string>;
    /** The blocks in the order they stand: a group, or a run of rows outside every group. @type {string[]} */
    blockOrder: string[];
    /** @type {Map<HTMLTableRowElement, string>} */
    blockOf: Map<HTMLTableRowElement, string>;
    /** A heading's name, read before its toggle went in. @type {Map<HTMLTableRowElement, string>} */
    groupNames: Map<HTMLTableRowElement, string>;
    /** Heading rows this attach prepared, with what detach puts back. @type {Map<HTMLTableRowElement, { span: string | null, hidden: boolean }>} */
    preparedGroups: Map<HTMLTableRowElement, {
        span: string | null;
        hidden: boolean;
    }>;
    /** Member rows this attach gave an id, so their toggle can name them in aria-controls. @type {Set<HTMLTableRowElement>} */
    givenIds: Set<HTMLTableRowElement>;
    memberIds: number;
    /** The body's order at attach, headings included, for detach. */
    layoutAtAttach: HTMLTableRowElement[] | null;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** The count of the columns a reader sees. */
    visibleColumns(): number;
    /** The group a row belongs to, when that group has a heading row. @param {HTMLTableRowElement} row */
    groupOf(row: HTMLTableRowElement): string | null;
    /** A heading row's fold button, first in its first cell. @param {HTMLTableRowElement} heading */
    prepareGroup(heading: HTMLTableRowElement): void;
    /** Read the group rows and the blocks from the body as it stands now. */
    collectGroups(): void;
    /** Rows in the order of their blocks, each block's rows in the order given. @param {HTMLTableRowElement[]} rows */
    arrange(rows: HTMLTableRowElement[]): HTMLTableRowElement[];
    /** Is the row in a folded group? @param {HTMLTableRowElement} row */
    isFolded(row: HTMLTableRowElement): boolean;
    /**
     * Put the body in the order of its blocks: each heading, then its
     * rows, each with its detail. Nothing moves when the order already
     * stands, and a control that held the focus gets it back when it
     * moved, so a refresh leaves the reader where they were [R-LIVE].
     */
    placeGroups(): void;
    /** Name each heading's toggle, count its rows and show it where its rows are. @param {ReturnType<typeof getStrings>} s */
    syncGroups(s: ReturnType<typeof getStrings>): void;
}
