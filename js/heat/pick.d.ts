/**
 * Pick a column (or none, with `null`) without an event: the cells and the
 * axis name of that column are marked `data-kp-picked`.
 * @param {HTMLElement} el
 * @param {string | null} key
 */
export declare function setHeatPick(el: HTMLElement, key: string | null): void;
/**
 * Press the labels of these rows (and unpress the rest) without an event.
 * @param {HTMLElement} el
 * @param {readonly string[]} keys
 */
export declare function setHeatRows(el: HTMLElement, keys: readonly string[]): void;
/**
 * Press a cell: it holds the tab stop, its column is picked (or dropped, pressed again) unless the page owns the grid, and
 * `kp-heat-pick` tells the page. A press on the cell itself and a day chosen in its row's list of days are one press
 * [heatstates-1102]; `source` says which (`days` for the list, absent for the cell).
 * @param {HTMLElement} el the grid @param {HTMLElement} cell @param {string} [source]
 */
export declare function pressCell(el: HTMLElement, cell: HTMLElement, source?: string): void;
