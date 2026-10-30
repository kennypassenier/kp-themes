/** A mark the module fills from its name. */
export declare const IDMARK = "[data-kp-idmark]";
/** How many colours the theme's chart palette has. */
export declare const IDMARK_SLOTS = 5;
/** The corner glyphs, in the order the hash picks them. */
export declare const IDMARK_GLYPHS: readonly string[];
/**
 * The letters of a name: the initials of its first two words, or its first
 * two letters when it is one word. Letters and digits only.
 * @param {string} name @param {number} [count]
 */
export declare function idmarkLetters(name: string, count?: number): string;
/**
 * Everything a mark is, from its name. Pure: the same name gives the same
 * mark in node and in every browser.
 * @param {string} name
 * @returns {{ name: string, empty: boolean, slot: number, hue: number, letters: string, glyph: string, cells: [number, number][] }}
 *   `slot` 1 to 5 (the chart colour), `hue` 0 to 359 (the free hue)
 */
export declare function idmarkFor(name: string): {
    name: string;
    empty: boolean;
    slot: number;
    hue: number;
    letters: string;
    glyph: string;
    cells: [number, number][];
};
/**
 * Palette slots for names read together: each name keeps its own slot where
 * no other name took it; a collision moves the later name to the nearest
 * slot still free, and only when all five are taken do names share.
 * The order of `names` decides who keeps a contested slot.
 * @param {readonly string[]} names
 * @returns {Map<string, number>} name to slot, 1 to 5
 */
export declare function idmarkColours(names: readonly string[]): Map<string, number>;
