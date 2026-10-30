/** What a bar item's dropdown is, as opposed to its mega menu's panel. */
export declare const DROPDOWN = ":scope > .kp-nav__menu:not(.kp-nav__menu--wide)";
/**
 * Hang a bar item's open dropdown from whichever edge keeps it in the
 * window [fix-27].
 *
 * The panel hangs from its item's start edge. Under the last item of a bar
 * whose links sit at the window's end, that ran it past the window's right
 * edge in all 22 themes (grotesk's catalogue bar, Kenny's note of
 * 2026-09-14). A stylesheet cannot see where the window ends, so this
 * measures the open panel on both edges and keeps the one that lies less
 * outside — the start edge when both fit — writing
 * `data-kp-nav-menu-end` on the panel for the other. Both channels call it:
 * the module on hover and focus, the React NavBar from its item.
 *
 * Changing edges is not always enough, because the box that shows the bar
 * is not always the window [fix-39]: in a box that clips, both of an item's
 * edges can lie inside the window while the panel under it is cut. So the
 * edge is chosen against the box the panel is really seen in, and what
 * still hangs out afterwards is slid back in (`slideIntoView`).
 *
 * @param {Element} item the `.kp-nav__links > li` that holds the dropdown
 * @param {boolean} [retry] measure once more on the next frame when the panel is not open yet; default true
 * @returns {boolean} whether the panel now hangs from the end edge
 */
export declare function placeNavMenu(item: Element, retry?: boolean): boolean;
/**
 * Line an open mega menu's panel up with its bar's edges [scope-48].
 *
 * The panel is placed in whatever box contains it, and the registers
 * disagree about which box that is: the `.kp-nav-wrap` in the base, the
 * bar itself in eight registers, and cyberpunk's strip of links, which
 * must stay positioned because its cut-corner plate hangs from it. So the
 * bar is measured against that box, and the two offsets are written as
 * `--kp-nav-mega-start` and `--kp-nav-mega-end` on the panel.
 *
 * Lined up with its bar the panel is normally inside whatever shows the
 * bar, but it is placed against a box and judged against another, so it is
 * held to the same question the dropdown is [fix-39]: a bar wider than the
 * box that shows it would otherwise carry its panel out with it.
 *
 * @param {Element} panel the `.kp-nav__menu--wide`, open
 */
export declare function placeNavPanel(panel: Element): void;
