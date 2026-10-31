export type DataTableControl = import('./controller.js').DataTableControl;
export declare class TableWrapClick {
    /** The table this part belongs to. */
    t: import("./controller.js").DataTableControl;
    /** @param {DataTableControl} t */
    constructor(t: DataTableControl);
    /** @param {MouseEvent} event */
    onWrapClick(event: MouseEvent): void;
    /** The chrome's own buttons. @param {HTMLElement} target */
    clickChrome(target: HTMLElement): void;
    /**
     * A group row folds from its toggle, or from a click anywhere in it that is not on a control of its own or a selection [J2].
     * @param {HTMLElement} target @param {HTMLTableRowElement} groupRow
     */
    clickGroup(target: HTMLElement, groupRow: HTMLTableRowElement): void;
    /**
     * A click anywhere in an expandable row opens or closes it, as its toggle does (Kenny, 2026-10-02: "als we ergens in die rij
     * klikken, niet enkel op dat icoon"); not one on a control in the row, which does its own thing, and not one that ends a text
     * selection.
     * @param {HTMLElement} target
     */
    clickRow(target: HTMLElement): void;
}
