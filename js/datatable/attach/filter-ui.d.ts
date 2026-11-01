import { TableFilterChoices } from './filter-choices.js';
import { FilterPopover } from './filter-popover.js';
export type FilterKind = import('../events.js').FilterKind;
export type DataTableControl = import('./controller.js').DataTableControl;
/** @typedef {import('../events.js').FilterKind} FilterKind */
/** @typedef {import('./controller.js').DataTableControl} DataTableControl */
export declare class TableFilterUi {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** The choice values, the boxes that follow them and the date picker's markup. */
    choices: TableFilterChoices;
    filterColumns: number[];
    /** @type {HTMLElement | null} */
    panel: HTMLElement | null;
    /** @type {HTMLButtonElement | null} */
    toggle: HTMLButtonElement | null;
    /** The panel's popover, unless the table keeps it inline [ux-1101]. @type {FilterPopover | null} */
    popover: FilterPopover | null;
    /** @type {HTMLElement | null} */
    pills: HTMLElement | null;
    addMode: boolean;
    /** `data-kp-filter-ui="none"`: the filters work, the page draws them [datatable-r5-1019, O22]. */
    bareFilters: boolean;
    /** The add-filter mode's button, its menu, the list in the menu and the editor [#filter-add]. */
    /** @type {HTMLButtonElement | null} */
    addButton: HTMLButtonElement | null;
    /** @type {HTMLElement | null} */
    addPop: HTMLElement | null;
    /** @type {HTMLElement | null} */
    addMenu: HTMLElement | null;
    /** @type {HTMLFormElement | null} */
    filterEditor: HTMLFormElement | null;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** The row of pills that shows the filters set: the page's, or one made here. */
    findPills(): void;
    /** The panel mode: the panel of every filter, and the toggle that opens it. */
    buildPanel(): void;
    /** Open or close the panel, wherever it is drawn. @param {boolean} open @param {boolean} [focus] */
    setPanelOpen(open: boolean, focus?: boolean): void;
    /** The panel's toggle: the page's, or one made here, in the top bar. @param {HTMLElement} panel */
    takeToggle(panel: HTMLElement): HTMLButtonElement;
    /** One filter column's fieldset in the panel: a choice list, or a range of two bounds. @param {number} at */
    panelField(at: number): HTMLElement;
    /**
     * A range filter's two bounds: numbers, or the package's own date pickers. A date bound is the package's own date picker, not a
     * bare date input, so it wears every theme's picker (scope-58, Kenny's second nostromo pass). The picker holds ISO in
     * data-kp-date-value whatever the field shows. Every bound has its own visible label, "Min" and "Max" for numbers, "From" and
     * "To" for days [ux-1101]; the column's name is the fieldset's legend.
     * @param {number} at @param {FilterKind} kind
     */
    rangeField(at: number, kind: FilterKind): HTMLElement;
    /** The add-filter mode [#filter-add]: its button (the page's or one made here), its menu and the filter editor. */
    buildAddMode(): void;
    /**
     * The editor's frame is the package's own, not a .kp-card or a .kp-popover: both carry a clip-path in some registers, which cut
     * off the calendar a date bound opens (measured on the mock, 2026-09-13). The calendar itself goes to the top layer.
     */
    makeFilterEditor(): void;
    /** The add-filter button: one made here, or the page's, whose attributes and words the detach gives back. */
    takeAddButton(): HTMLButtonElement;
}
