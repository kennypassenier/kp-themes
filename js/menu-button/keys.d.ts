/**
 * Where a key moves the focus in an open menu, or null when the key is not
 * the menu's: ↓ and ↑ step and wrap, Home and End go to the ends, and a
 * printable letter goes to the next entry after `at` whose label starts with
 * it (wrapping, the entry at `at` itself last). `at` is -1 when no entry has
 * the focus.
 * @param {{ key: string, ctrlKey?: boolean, metaKey?: boolean, altKey?: boolean }} event
 * @param {number} at
 * @param {readonly string[]} labels every entry's label, in order
 * @returns {number | null}
 */
export declare function menuKeyTarget(event: {
    key: string;
    ctrlKey?: boolean;
    metaKey?: boolean;
    altKey?: boolean;
}, at: number, labels: readonly string[]): number | null;
