export type EntityData = import('./types.js').EntityData;
/** @typedef {import('./types.js').EntityData} EntityData */
/** What each card was last drawn from, so a refill changes only what changed; `star` is the star as it stands now. @type {WeakMap<Element, { data: EntityData, drawn: Record<string, string>, star: boolean }>} */
export declare const DRAWN: WeakMap<Element, {
    data: EntityData;
    drawn: Record<string, string>;
    star: boolean;
}>;
/** @param {Element} el @param {string} name @returns {string | null} */
export declare const opt: (el: Element, name: string) => string | null;
/**
 * The key that stars a card: its own or its grid's `data-kp-entity-star-key`; with none, `s` - and `.` under a board whose tiles
 * jump by their first letter (`data-kp-tiles-keys="letters"`, js/tiles.js), so the star never takes a letter away from the search [wish-1120].
 * @param {Element} card
 */
export declare const starKeyOf: (card: Element) => string;
/**
 * Write a name into an element, the part that matches `match` (first occurrence, any case) wrapped in a `<mark>`. Text nodes and an
 * element only: nothing is parsed as HTML [wish-1120, homelab 121].
 * @param {HTMLElement} el @param {string} name @param {string | undefined} match
 */
export declare function writeName(el: HTMLElement, name: string, match: string | undefined): void;
/** @param {Document} doc @param {string} tag @param {string} className */
export declare const made: (doc: Document, tag: string, className: string) => HTMLElement;
/** @param {unknown} value */
export declare const sig: (value: unknown) => string;
/** The slots of a card, in order, for each kind. */
export declare const SLOTS: {
    stack: string[];
    tile: string[];
};
/** @param {HTMLElement} card @param {string} slot */
export declare const slotOf: (card: HTMLElement, slot: string) => HTMLElement;
/**
 * Make sure a card holds all the slots of its kind, once (again when the kind changes).
 * @param {HTMLElement} card
 * @returns {'stack' | 'tile'}
 */
export declare function frame(card: HTMLElement): 'stack' | 'tile';
/**
 * How many columns the actions stand in: the most buttons any card of the grid shows (at most `inline`), and one more for
 * a "More" when some card has actions left over. Never fewer than one.
 * @param {HTMLElement} host the grid, or the card when it stands alone
 * @param {number} inline
 */
export declare function columnsFor(host: HTMLElement, inline: number): number;
