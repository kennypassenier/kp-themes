/**
 * Give one three-way chip a state, say so and fire the event.
 * @param {Element} group @param {HTMLElement} item @param {'any' | 'include' | 'exclude'} state
 */
export declare function turnTri(group: Element, item: HTMLElement, state: 'any' | 'include' | 'exclude'): void;
/**
 * Press one item: what a click or the keyboard's choice does.
 * @param {Element} group
 * @param {HTMLElement} item
 */
export declare function choose(group: Element, item: HTMLElement): void;
