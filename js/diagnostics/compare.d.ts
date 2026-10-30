/**
 * Compare two dotted version numbers.
 *
 * @param {string} a
 * @param {string} b
 * @returns {number | null} negative when a is older, 0 when equal, positive when a is newer; null when either is not a version
 */
export declare function compareVersions(a: string, b: string): number | null;
