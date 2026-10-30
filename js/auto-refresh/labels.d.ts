/** The title and label cells of one control. */
export declare class BarLabels {
    el: HTMLElement;
    bar: HTMLElement;
    /** An authored title element, moved into the bar's first cell [wish-1028]. */
    slotted: HTMLElement | null;
    /** The bar's title cell, drawn while `data-kp-refresh-title` has words or a slot was given. @type {HTMLElement | null} */
    titleCell: HTMLElement | null;
    /** The bar's label cell, drawn while `data-kp-refresh-label` has words [formgrid-notes-1019; homelab 52]. @type {HTMLElement | null} */
    labelCell: HTMLElement | null;
    /**
     * @param {HTMLElement} el the control
     * @param {HTMLElement} bar the bar the cells go in
     */
    constructor(el: HTMLElement, bar: HTMLElement);
    /** Draw, move or take away the title cell. */
    paintTitle(): void;
    /** Draw or take away the label cell. */
    paintLabel(): void;
}
