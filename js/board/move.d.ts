import { BoardLanes } from './lanes.js';
export type MenuGroup = import('../menu-button.js').MenuGroup;
export declare class BoardMoves extends BoardLanes {
    /** Set while a menu move runs, so the narrow board keeps the lane the reader is working in. */
    menuMove: boolean;
    /** @param {HTMLElement} el @param {{ strings?: Partial<import('../strings.js').Strings> }} [options] */
    constructor(el: HTMLElement, options?: {
        strings?: Partial<import('../strings.js').Strings>;
    });
    /** Listen for picks in the cards' menus; called from the board's connect(). */
    wireMoves(): void;
    count(): void;
    /** The lane that holds a card. @param {Element} card @returns {HTMLElement | undefined} */
    laneOf(card: Element): HTMLElement | undefined;
    /**
     * The "Move to" group for a card: every other lane with what it holds now; null when there is nowhere to go.
     * @param {HTMLElement} card @returns {MenuGroup | null}
     */
    moveGroup(card: HTMLElement): MenuGroup | null;
    /** Every card's own menu gets the group in front of the page's entries (a menu that shows the same is skipped by setMenu). */
    syncMenus(): void;
    /** A pick of a "Move to" entry, from a card's ⋯ menu or its context menu. @param {CustomEvent} event */
    onMovePick(event: CustomEvent): void;
    /**
     * Send a card to the end of a lane, said in words; the reorder list reports it as `kp-reorder` with `fromList` / `toList`.
     * @param {HTMLElement} card @param {string} key the lane's key @returns {boolean} whether it moved
     */
    move(card: HTMLElement, key: string): boolean;
    /**
     * The focus after a menu move: the card itself where it can be seen, else the card that took its place, the one before it,
     * or the lane's button in the switcher.
     * @param {HTMLElement} card @param {HTMLElement | null} source @param {number} at
     */
    refocus(card: HTMLElement, source: HTMLElement | null, at: number): void;
    /** The switcher's button of the lane shown; the board controller draws the switcher. */
    focusSwitcher(): void;
}
