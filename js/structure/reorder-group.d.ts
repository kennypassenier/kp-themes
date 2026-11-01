/** How close to a scroller's side edge a dragged item must come before the scroller moves [px]. */
export declare const EDGE_PX = 40;
/** How far a scroller moves per pointer move near its edge [px]. */
export declare const EDGE_STEP_PX = 16;
/** The group a list belongs to, or null when it shares nothing. @param {HTMLElement} list */
export declare const groupOf: (list: HTMLElement) => string | null;
/**
 * The wired lists of a group, in document order (the order ← and → walk).
 * @param {HTMLElement} list one list of the group
 * @returns {HTMLElement[]}
 */
export declare function groupLists(list: HTMLElement): HTMLElement[];
/** The key a list is reported by in `fromList` / `toList`: `data-kp-reorder-list`, else its id, else ''. @param {HTMLElement} list */
export declare const listKey: (list: HTMLElement) => string;
/**
 * A list's name for what is said: its `aria-label`, the words of its `aria-labelledby`, `data-kp-reorder-label`, else its key.
 * @param {HTMLElement} list
 */
export declare function listName(list: HTMLElement): string;
/**
 * The list of the group under a point, if any: the shown list whose box holds it.
 * @param {HTMLElement[]} lists @param {number} x @param {number} y
 * @returns {HTMLElement | null}
 */
export declare function listAt(lists: HTMLElement[], x: number, y: number): HTMLElement | null;
/**
 * Where an item dropped at height `y` goes in a list: before the first other child whose middle is below `y`, else at the end.
 * @param {HTMLElement} list @param {HTMLElement} item the item being moved (not counted) @param {number} y
 */
export declare function indexAt(list: HTMLElement, item: HTMLElement, y: number): number;
/**
 * The neighbouring list in the group, `step` lists away in document order, or null at the end.
 * @param {HTMLElement} list @param {number} step 1 or -1
 */
export declare function neighbour(list: HTMLElement, step: number): HTMLElement;
/**
 * While an item is dragged near the side edge of a scroller that holds it (a board's lanes on a phone), move the scroller so the
 * next list comes into reach.
 * @param {HTMLElement} item @param {number} x
 */
export declare function nudgeScroll(item: HTMLElement, x: number): void;
