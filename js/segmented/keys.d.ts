/** The step an arrow key takes along the group, flipped for a right-to-left group; 0 for any other key. @param {KeyboardEvent} event @param {Element} group */
export declare function stepFor(event: KeyboardEvent, group: Element): -1 | 0 | 1;
/**
 * Where the focus goes for a key: the index among the enabled items, or -1 for a key that moves nothing.
 * @param {KeyboardEvent} event @param {Element} group @param {number} at the focused item's index @param {number} count the enabled items
 */
export declare function targetIndex(event: KeyboardEvent, group: Element, at: number, count: number): number;
