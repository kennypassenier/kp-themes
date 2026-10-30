export type UsualModel = import('./types.js').UsualModel;
/** @typedef {import('./types.js').UsualModel} UsualModel */
/** Where a value came from. @param {UsualModel} m @param {string} value @returns {'usual' | 'all' | 'pinned'} */
export declare function originOf(m: UsualModel, value: string): 'usual' | 'all' | 'pinned';
/** Say something on the status line after the combobox has written its own count. @param {UsualModel} m @param {string} text */
export declare const sayAfter: (m: UsualModel, text: string) => number;
/**
 * Light up the tag of a value for a moment: the answer to a pick, an add or a name typed that is already picked, where the
 * eyes are (the row of tags right above the field). A ring in the theme's own focus colour, switched on and off, never eased;
 * held still under reduced motion.
 * @param {UsualModel} m @param {string} value
 */
export declare function flashTag(m: UsualModel, value: string): void;
/** @param {UsualModel} m @param {string} value @param {'typed' | 'usual' | 'all' | 'pinned'} from */
export declare function pick(m: UsualModel, value: string, from: 'typed' | 'usual' | 'all' | 'pinned'): void;
/** Take a value out of the picks without a pick event (the check's "Not today", or pressing "Had it" again). @param {UsualModel} m @param {string} value */
export declare function unpick(m: UsualModel, value: string): void;
