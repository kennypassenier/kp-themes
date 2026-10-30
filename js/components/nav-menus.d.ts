/**
 * Wire every bar's dropdowns and mega menus [fix-27, scope-48].
 *
 * Dropdowns open on hover and on focus within, in CSS; this only places an
 * open one so it stays in the window (`placeNavMenu`), when it opens and
 * again when the window changes size.
 *
 * A mega menu is a `data-kp-nav-disclosure` button beside a
 * `.kp-nav__menu--wide` panel. The button gets `aria-expanded` and an
 * `aria-controls` naming the panel (an id is given when the panel has
 * none), and the panel shows while it says `true`. Every open state has a
 * way out [KT6]: the button again, Escape while the focus is in the bar
 * (the focus goes back to the button), a click outside the item, and the
 * focus leaving it. One panel is open at a time: opening one closes the
 * others. A button with no words of its own is named from the dictionary
 * (`navDisclosure`). The React NavBar wires its own bar and marks it
 * `data-kp-nav-owner`, so this module leaves that bar alone [AR29].
 *
 * @param {ParentNode} root
 * @param {{ strings?: Partial<import('../strings.js').Strings>, ownedBy?: string }} [options]
 * @returns {() => void} detach
 */
export declare function attachNavMenus(root?: ParentNode, { strings, ownedBy }?: {
    strings?: Partial<import('../strings.js').Strings>;
    ownedBy?: string;
}): () => void;
