/**
 * Write the state of every item from a list of values, then the roving tab
 * stop, then the plate. Does not fire the event.
 * @param {Element} group
 * @param {readonly string[]} values
 * @param {boolean} [place] false leaves the plate to the caller, which places the plates of a whole pass together [attach-1104]
 */
export declare function paint(group: Element, values: readonly string[], place?: boolean): void;
