export type RowsAttentionStrings = {
    /**
     * The word for one row when the page names none, "row" (js/row-editor.js) [mc-1030]
     */
    rowsUnitOne: string;
    /**
     * The word for several rows, "rows" (js/row-editor.js) [mc-1030]
     */
    rowsUnitMany: string;
    /**
     * The button that adds a row, "Add a time" (js/row-editor.js) [mc-1030]
     */
    rowsAdd: (unit: string) => string;
    /**
     * A row's remove button name, "Remove time 2" (js/row-editor.js) [mc-1030]
     */
    rowsRemove: (unit: string, n: number) => string;
    /**
     * Announced after a row was added, "Added time 2. 2 in all" (exact numbers) (js/row-editor.js) [mc-1030]
     */
    rowsAdded: (unit: string, n: number, total: number) => string;
    /**
     * Announced after a row was removed, "Removed time 2. 1 left" (exact numbers) (js/row-editor.js) [mc-1030]
     */
    rowsRemoved: (unit: string, n: number, total: number) => string;
    /**
     * The line while the fewest rows are held, also the remove buttons' reason, "At least 1 time is needed" (js/row-editor.js) [mc-1030]
     */
    rowsAtMin: (min: number, units: string) => string;
    /**
     * The line while the most rows are held, also the add button's reason, "At most 6 times" (js/row-editor.js) [mc-1030]
     */
    rowsAtMax: (max: number, units: string) => string;
    /**
     * The empty plate's title when no row is held, "No times yet" (js/row-editor.js) [mc-1030]
     */
    rowsEmptyTitle: (units: string) => string;
    /**
     * The empty plate's sentence, "Add the first time to start." (js/row-editor.js) [mc-1030]
     */
    rowsEmptyText: (unit: string) => string;
    /**
     * The band's button that unfolds the problems over its cap, "Show 4 more" (exact number) (js/attention.js) [mc-1030]
     */
    attentionMore: (n: number) => string;
    /**
     * The same button while the band is unfolded (js/attention.js) [mc-1030]
     */
    attentionFewer: string;
};
/**
 * @typedef {object} RowsAttentionStrings
 * @property {string} rowsUnitOne  The word for one row when the page names none, "row" (js/row-editor.js) [mc-1030]
 * @property {string} rowsUnitMany  The word for several rows, "rows" (js/row-editor.js) [mc-1030]
 * @property {(unit: string) => string} rowsAdd  The button that adds a row, "Add a time" (js/row-editor.js) [mc-1030]
 * @property {(unit: string, n: number) => string} rowsRemove  A row's remove button name, "Remove time 2" (js/row-editor.js) [mc-1030]
 * @property {(unit: string, n: number, total: number) => string} rowsAdded  Announced after a row was added, "Added time 2. 2 in all" (exact numbers) (js/row-editor.js) [mc-1030]
 * @property {(unit: string, n: number, total: number) => string} rowsRemoved  Announced after a row was removed, "Removed time 2. 1 left" (exact numbers) (js/row-editor.js) [mc-1030]
 * @property {(min: number, units: string) => string} rowsAtMin  The line while the fewest rows are held, also the remove buttons' reason, "At least 1 time is needed" (js/row-editor.js) [mc-1030]
 * @property {(max: number, units: string) => string} rowsAtMax  The line while the most rows are held, also the add button's reason, "At most 6 times" (js/row-editor.js) [mc-1030]
 * @property {(units: string) => string} rowsEmptyTitle  The empty plate's title when no row is held, "No times yet" (js/row-editor.js) [mc-1030]
 * @property {(unit: string) => string} rowsEmptyText  The empty plate's sentence, "Add the first time to start." (js/row-editor.js) [mc-1030]
 * @property {(n: number) => string} attentionMore  The band's button that unfolds the problems over its cap, "Show 4 more" (exact number) (js/attention.js) [mc-1030]
 * @property {string} attentionFewer  The same button while the band is unfolded (js/attention.js) [mc-1030]
 */
/** @type {RowsAttentionStrings} */
export declare const ROWS_ATTENTION_STRINGS: RowsAttentionStrings;
