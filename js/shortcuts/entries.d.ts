export type Entry = import('../shortcuts.js').Entry;
/** @typedef {import('../shortcuts.js').Entry} Entry */
/** @param {Entry} entry */
export declare function scopeActive(entry: Entry): boolean;
/** @param {Entry} entry */
export declare function available(entry: Entry): boolean;
/**
 * Whether a typed-in field lets this entry's step through: a chord with Mod always, and a shortcut that said `inFields`.
 * @param {Entry} entry @param {number} index
 */
export declare const inFieldsToo: (entry: Entry, index: number) => boolean;
