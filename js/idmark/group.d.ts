/**
 * Draw a group of marks with an exact "+N" for the people left out. The "+N" is
 * a button that opens the list of their names (`list: false` leaves it a plain
 * count). Counts are the real number, never "9+".
 * @param {HTMLElement} el the group, a `.kp-idmark-group`
 * @param {readonly import('../idmark.js').IdmarkPerson[]} people
 * @param {{ max?: number, size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl', round?: boolean, list?: boolean }} [options]
 *   `max` marks shown (default 4); `size` the marks' size (default md); `round` round marks (default true)
 */
export declare function setIdmarkGroup(el: HTMLElement, people: readonly import('../idmark.js').IdmarkPerson[], { max, size, round, list }?: {
    max?: number;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    round?: boolean;
    list?: boolean;
}): void;
