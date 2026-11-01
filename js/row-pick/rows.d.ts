export { CONTROLS, CURSOR_CLASS, LONG_PRESS_MS, ROW_SELECT_EVENT, labelOfRow, markCursor } from '../row-select/rows.js';
/** An element whose keyed rows can be picked. */
export declare const ROW_PICK = "[data-kp-row-pick]";
/** A row that can be picked: it carries a key. */
export declare const PICK_ROW = "[data-kp-row-key]";
/** The mark a picked row carries, for any row; a row with a selectable role also gets `aria-selected`. */
export declare const PICKED_ATTRIBUTE = "data-kp-picked";
/** The roles whose rows say `aria-selected` (a listbox option, a grid or table row, a cell, a tree item). */
export declare const SELECTABLE_ROLES: string[];
/** The roles of a container that is told it can hold several picks (`aria-multiselectable`). */
export declare const MULTI_ROLES: string[];
/** How far a finger may wander before a press counts as a scroll instead [px]. */
export declare const PRESS_SLOP_PX = 10;
/** A row's key. @param {HTMLElement} row */
export declare const keyOf: (row: HTMLElement) => string;
/** Whether a row can be seen now: not hidden by a filter, and not inside a closed section. @param {HTMLElement} row */
export declare const visible: (row: HTMLElement) => boolean;
/** Whether a click or press landed on a control of the row that keeps its own meaning. @param {Element} target @param {string} extra a page's own selector */
export declare const ownControl: (target: Element, extra: string) => boolean;
