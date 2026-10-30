export type ChecklistItem = import('../checklist.js').ChecklistItem;
/** @typedef {import('../checklist.js').ChecklistItem} ChecklistItem */
/** The groups in the order their first item comes. @param {ChecklistItem[]} items */
export declare function groupsOf(items: ChecklistItem[]): Map<string, import("../checklist.js").ChecklistItem[]>;
/**
 * The order a group shows its items in: the open ones in their own order, then
 * the ticked ones in their own order (when the list sinks).
 * @param {Element} list @param {ChecklistItem[]} items
 */
export declare const shownOrder: (list: Element, items: ChecklistItem[]) => import("../checklist.js").ChecklistItem[];
/**
 * Build or update one row in place.
 * @param {HTMLElement | null} row @param {ChecklistItem} item
 * @returns {HTMLElement}
 */
export declare function rowFor(row: HTMLElement | null, item: ChecklistItem): HTMLElement;
