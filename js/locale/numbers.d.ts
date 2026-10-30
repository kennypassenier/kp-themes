/**
 * A byte count as the locale writes numbers: "1,5 MB" in Dutch, "1.5 MB"
 * in English. Base 1000 with SI units, because a person reading a file
 * size is not counting sectors.
 *
 * @param {number} bytes
 * @param {string | undefined} [locale]
 * @param {{ base?: 1000 | 1024, units?: string[] }} [options]
 * @returns {string}
 */
export declare function formatBytes(bytes: number, locale?: string | undefined, { base, units }?: {
    base?: 1000 | 1024;
    units?: string[];
}): string;
/**
 * Read a number the way the locale writes it: "1.284,50" in Dutch,
 * "1,284.50" in English. Intl tells us which glyph is the decimal.
 *
 * @param {string} text
 * @param {string | undefined} [locale]
 * @returns {number}
 */
export declare function parseNumber(text: string, locale?: string | undefined): number;
