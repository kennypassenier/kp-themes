export type ChecklistItem = import('../checklist.js').ChecklistItem;
/** @typedef {import('../checklist.js').ChecklistItem} ChecklistItem */
/**
 * Give a list its items, changing the rows in place (by id).
 * @param {Element} list
 * @param {ChecklistItem[]} items
 */
export declare function setChecklistItems(list: Element, items: ChecklistItem[]): void;
/**
 * Tick or untick one item as the page (no event).
 * @param {Element} list @param {string} id @param {boolean} checked
 */
export declare function setChecklistChecked(list: Element, id: string, checked: boolean): void;
/**
 * The list's state: `loading` lays the busy card over the body (and keeps it
 * at its height), `error` says `message` where the rows were, `ready` is
 * neither.
 * @param {Element} list @param {'loading' | 'error' | 'ready'} state @param {string} [message]
 */
export declare function setChecklistState(list: Element, state: 'loading' | 'error' | 'ready', message?: string): void;
/** @param {HTMLElement} list @param {string} type @param {object} detail */
export declare const emit: (list: HTMLElement, type: string, detail: object) => boolean;
/** End the Undo on offer, if any. @param {HTMLElement} list */
export declare function endUndo(list: HTMLElement): void;
