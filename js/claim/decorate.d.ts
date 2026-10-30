/** @param {Element} list @param {string} filter */
export declare function setClaimFilter(list: Element, filter: string): void;
/** Show the width of the widest face on the list's buttons: the faces already share one cell, so nothing to do here. */
/** Everything that depends on the whole list: the groups' counts, the bar, the filter, the order, the plate. @param {HTMLElement} list */
export declare function decorate(list: HTMLElement): void;
