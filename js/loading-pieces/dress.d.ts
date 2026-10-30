/**
 * Take a part's pieces away.
 * @param {Element} el
 */
export declare function undress(el: Element): void;
/**
 * Give a part the pieces its theme names, measured now; a part whose theme
 * names none, or that no longer waits, loses any it had.
 * @param {HTMLElement} el
 * @returns {boolean} whether the part wears pieces now
 */
export declare function dress(el: HTMLElement): boolean;
