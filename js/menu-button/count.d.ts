/**
 * How many lines a menu has: its children. In a menu `setMenu()` filled they
 * are its groups (a nameless group is one line, a named one is its heading
 * and entries); in a menu written by hand they are its entries, which is
 * what a register counting with `:has(> :nth-child(k))` counts too. Pure.
 * @param {{ children: { length: number } }} menu
 * @returns {number}
 */
export declare function menuLineCount(menu: {
    children: {
        length: number;
    };
}): number;
/**
 * Write menuLineCount() on a menu, and on the popover it stands in (the
 * element a register clips and rules), when it changed.
 * @param {HTMLElement} menu
 */
export declare function countMenu(menu: HTMLElement): void;
