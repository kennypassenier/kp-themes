export type FilterKind = import('../events.js').FilterKind;
export type FilterValue = import('../events.js').FilterValue;
export type Strings = import('../../strings/types.js').Strings;
export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('../events.js').FilterKind} FilterKind */
/** @typedef {import('../events.js').FilterValue} FilterValue */
/** @typedef {import('../../strings/types.js').Strings} Strings */
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TablePills {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    renderPills(): void;
    /** One pill per filter, in the order the filters were added. @param {import('../../strings.js').Strings} s */
    renderAddPills(s: import('../../strings.js').Strings): void;
    /** The menu of filterable columns; a filtered one is marked, and choosing it edits its filter. @param {import('../../strings.js').Strings} s */
    renderAddMenu(s: import('../../strings.js').Strings): void;
    /** @param {MouseEvent} event */
    onAddMenuClick(event: MouseEvent): void;
    /** @param {KeyboardEvent} event */
    onAddMenuKey(event: KeyboardEvent): void;
    /** @param {Event} event */
    onAddToggle(event: Event): void;
    /** @param {MouseEvent} event */
    onPillsClick(event: MouseEvent): void;
}
