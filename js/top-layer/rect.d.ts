/**
 * Where an element's box lies in window coordinates with its own `translate`
 * (and a `transform` that only translates) set aside: where the layout put
 * it, not where an arrival animation is drawing it this frame.
 *
 * Forest grows a menu, a popover, a combobox's list and a date picker's
 * panel out of their button from `translate: 0 -100%` (css/forest-register.css,
 * 2026-10-09). Measured on the frame it opened, the menu button's menu sat
 * its own height above where the layout put it, and the placement moved it
 * down by that much: in catalogue/overlays.html#menu-button the button
 * ended at 409 px and the menu started at 947 px, where formal starts it at
 * 413 px. Every placement measures through this instead, so every theme
 * places an overlay at its button whatever its arrival draws.
 *
 * @param {Element} element
 * @returns {DOMRect}
 */
export declare function layoutRect(element: Element): DOMRect;
