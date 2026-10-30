export type EntityData = import('./types.js').EntityData;
/** @typedef {import('./types.js').EntityData} EntityData */
/**
 * The tick of a selectable card and the mark made from its name, at the start of the identity row.
 * @param {HTMLElement} card
 * @param {HTMLElement} el the identity row
 * @param {EntityData} data
 * @param {boolean} selectable
 * @param {string} markKind
 */
export declare function tickAndMark(card: HTMLElement, el: HTMLElement, data: EntityData, selectable: boolean, markKind: string): void;
/**
 * The favourite star: a real toggle button (js/toggle.js) in the identity row, above the card's link, so pressing it never follows
 * the link. Its name is hidden text ("Favourite jellyfin"), the star is a drawing that fills while it is pressed.
 * @param {HTMLElement} card
 * @param {HTMLElement} el the identity row
 * @param {EntityData} data
 * @param {boolean} pressed
 * @param {string} starKey
 */
export declare function appendStar(card: HTMLElement, el: HTMLElement, data: EntityData, pressed: boolean, starKey: string): void;
/**
 * Put the star as the data says without an event (a refill with `starred`).
 * @param {HTMLElement} card
 * @param {boolean} star
 */
export declare function syncStar(card: HTMLElement, star: boolean): void;
