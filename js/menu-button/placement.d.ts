export type Covered = import('./types.js').Covered;
export type Edges = import('./types.js').Edges;
export type MenuState = import('./types.js').MenuState;
/** @typedef {import('./types.js').Covered} Covered */
/** @typedef {import('./types.js').Edges} Edges */
/** @typedef {import('./types.js').MenuState} MenuState */
/**
 * Where an open menu goes so that all of it is on the screen (Kenny,
 * 2026-10-05: a menu under a button at the left edge opened off the
 * screen). Pure: boxes in, box out, all in viewport px.
 *
 * Across, the place the stylesheet gave it (under the button, at its end
 * edge; spanning the header's buttons on a phone) is kept when it fits;
 * else it lines up with the button's start edge, else with its end edge,
 * else it is pushed inside the room. Down, it hangs under the button when
 * it fits there, else over it when it fits there, else on the roomier side
 * at that side's height, scrolling inside itself.
 *
 * @param {object} at
 * @param {Edges} at.button the button's box
 * @param {Edges} at.menu where the stylesheet put the menu
 * @param {number} at.height the menu's whole height, within the stylesheet's own cap
 * @param {number} at.gap the space between the button and the menu
 * @param {Edges} at.room the screen less its gutter and what is stuck over its edges
 * @returns {{ left: number, top: number, width: number | null, height: number | null, side: 'below' | 'above' }}
 *   `width` and `height` are the caps to set, null where the menu fits whole
 */
export declare function menuPlacement({ button, menu, height, gap, room }: {
    button: Edges;
    menu: Edges;
    height: number;
    gap: number;
    room: Edges;
}): {
    left: number;
    top: number;
    width: number | null;
    height: number | null;
    side: 'below' | 'above';
};
/**
 * Lift the placed menu into the top layer at the spot it was placed on,
 * kept against its button as the page scrolls (js/top-layer.js), when a
 * container would clip it. It stays the button's child, so every register
 * selector still reaches it.
 * @param {MenuState} s
 * @param {Window} view
 */
export declare function raiseMenu(s: MenuState, view: Window): void;
/** @param {MenuState} s */
export declare function lowerMenu(s: MenuState): void;
/** @param {HTMLElement} menu */
export declare function unplaceMenu(menu: HTMLElement): void;
/**
 * Put the open menu where menuPlacement() says: one read of the boxes, then
 * one write, before the frame is painted, so it never shows in the wrong
 * place first.
 * @param {MenuState} s
 * @param {Window} view
 * @param {Covered} covered
 */
export declare function placeMenu(s: MenuState, view: Window, covered: Covered): void;
