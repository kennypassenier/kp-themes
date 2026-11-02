export type HeatDay = {
    /**
     * the cell it stands for
     */
    cell: HTMLElement;
    /**
     * the column key
     */
    key: string;
    /**
     * the column's name: its `full` name, else the axis name, else the header's accessible name, else the key
     */
    name: string;
    /**
     * what the cell says: its own words (`data-kp-said`), else its whole accessible name
     */
    value: string;
    tone: string;
    /**
     * `--kp-heat-level`, for a `level` cell
     */
    level: string;
    disabled: boolean;
    picked: boolean;
};
/**
 * The days of `row`, in the grid's column order.
 * @param {HTMLElement} el the grid @param {HTMLElement} row
 * @returns {HeatDay[]}
 */
export declare function rowDays(el: HTMLElement, row: HTMLElement): HeatDay[];
/** The row's name: its label's words, else its key. @param {HTMLElement} row */
export declare function rowName(row: HTMLElement): string;
/**
 * The panel: the row's name, one line on what a choice does, and the list of its days. It stands on the menu's raised plate
 * (`.kp-menu`, which every register paints opaque) and is a non-modal dialog.
 * @param {Document} doc @param {string} name the row's name @param {HeatDay[]} days @param {string} id
 */
export declare function daysPanel(doc: Document, name: string, days: HeatDay[], id: string): HTMLElement;
