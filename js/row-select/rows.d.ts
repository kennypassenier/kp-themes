/** An element that gets the keys whether or not it is a data table. */
export declare const ROW_SELECT = "[data-kp-select-keys]";
/** A data table that carries a select column gets them too. */
export declare const ROW_SELECT_AUTO = "[data-kp-datatable]:has([data-kp-select-row])";
/** The boxes this module sets. */
export declare const SELECT_BOX = "[data-kp-select-row]";
/** Fired on the element after this module changed the ticks: `{ keys, count, source, skipped }`. */
export declare const ROW_SELECT_EVENT = "kp-rows-select";
/** Fired on a row when Enter is pressed on the row itself, the event js/actions.js' row keys fire too: `{ row }`. */
export declare const ROW_OPEN_EVENT = "kp-row-open";
/** The cursor row. */
export declare const CURSOR_CLASS = "is-cursor";
/** How long a finger rests on a row before selection mode starts [ms]. */
export declare const LONG_PRESS_MS = 500;
/** What counts as a row around a box. */
export declare const ROW_LIKE = "[data-kp-row-key], tr, li, [role=\"row\"]";
/** Controls a tap in selection mode leaves alone. */
export declare const CONTROLS = "a, button, input, select, textarea";
/** An option that is on unless the attribute says `false` (Kenny, 2026-10-17: the arrows walk and Ctrl+A ticks, by default). @param {Element} el @param {string} name */
export declare const onByDefault: (el: Element, name: string) => boolean;
/** Every box of the element in document order. @param {Element} el @returns {HTMLInputElement[]} */
export declare const boxesOf: (el: Element) => HTMLInputElement[];
/** The row a box belongs to. @param {Element} box @returns {HTMLElement | null} */
export declare const rowOf: (box: Element) => HTMLElement | null;
/** A row's own box. @param {HTMLElement} row @returns {HTMLInputElement | null} */
export declare const boxOf: (row: HTMLElement) => HTMLInputElement | null;
/** A row's key: its `data-kp-row-key`, else its id, else its box's value, else its place. @param {HTMLElement} row @param {number} index */
export declare const keyOfRow: (row: HTMLElement, index: number) => string;
/** What the voice calls a row. @param {HTMLElement} row */
export declare const labelOfRow: (row: HTMLElement) => string;
/** A row the walk may land on: in the page and not hidden by a filter or a page. @param {HTMLElement} row */
export declare const shown: (row: HTMLElement) => boolean;
/** A box a tick may reach. @param {HTMLInputElement} box */
export declare const tickable: (box: HTMLInputElement) => boolean;
/** Mark a row as the cursor, or as not the cursor. @param {HTMLElement} row @param {boolean} on */
export declare function markCursor(row: HTMLElement, on: boolean): void;
