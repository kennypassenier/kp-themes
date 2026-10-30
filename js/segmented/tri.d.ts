/**
 * The words of a three-way group's states: its own `data-kp-segmented-words`, else the dictionary's.
 * @param {Element} item
 * @returns {Record<'any' | 'include' | 'exclude', string>}
 */
export declare function triWords(item: Element): Record<'any' | 'include' | 'exclude', string>;
/**
 * Write one three-way chip's state: the attribute, the word a screen reader
 * hears after its name, and the mark (drawn by the stylesheet from the
 * attribute). The parts are made when the markup left them out.
 * @param {HTMLElement} item
 * @param {'any' | 'include' | 'exclude'} state
 */
export declare function writeTri(item: HTMLElement, state: 'any' | 'include' | 'exclude'): void;
/**
 * The three-way group's Clear all (dimmed while nothing is chosen), its
 * summary line and its roving tab stop.
 * @param {Element} group
 */
export declare function paintTri(group: Element): void;
/**
 * Say something through a three-way group's status region (made on first
 * need, after the group and its summary line).
 * @param {Element} group @param {string} message
 */
export declare function sayTri(group: Element, message: string): void;
/**
 * Set a three-way group's chips without firing the event; a value in neither list is let go.
 * @param {Element} group
 * @param {{ include?: Iterable<string>, exclude?: Iterable<string> }} values
 */
export declare function setTriValues(group: Element, { include, exclude }: {
    include?: Iterable<string>;
    exclude?: Iterable<string>;
}): void;
