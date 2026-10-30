/**
 * Let a row leave the theme's way and take it out (js/motion.js leave(); at
 * once under reduced motion). When the focus is in it, the focus goes first
 * to the same place in the next row (the button at the same position, or the
 * row itself), else the row before, else the list.
 * @param {HTMLElement} row
 * @returns {Promise<void>} settled once it is gone
 */
export declare function removeRow(row: HTMLElement): Promise<void>;
