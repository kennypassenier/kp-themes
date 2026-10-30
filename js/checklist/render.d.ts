import { getStrings } from '../strings.js';
export type ChecklistItem = import('../checklist.js').ChecklistItem;
export type Strings = ReturnType<typeof getStrings>;
/**
 * Draw the list from its items, changing what is there in place: a row keeps its element (and its focus) whatever moves
 * around it. Returns the rows' places before the change, for the glide.
 * @param {HTMLElement} list
 * @returns {Map<string, DOMRect>}
 */
export declare function render(list: HTMLElement): Map<string, DOMRect>;
/**
 * Let the rows that moved glide from where they stood to where they stand, in the theme's size time and on its curve;
 * nothing under reduced motion.
 * @param {HTMLElement} list @param {Map<string, DOMRect>} before
 */
export declare function glide(list: HTMLElement, before: Map<string, DOMRect>): Promise<void>;
