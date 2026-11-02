// Comparison by UTF-16 code unit, for every sort that decides the order of a generated file.
// `localeCompare` follows the machine's locale (cs_CZ puts "ch" after "h", da_DK sorts "aa" last), so a generator that
// used it wrote another order on another machine and `--check` failed there [bunfix-1102].

/**
 * @param {string} a
 * @param {string} b
 * @returns {number} negative, zero or positive, like Array.prototype.sort wants
 */
export function byCodeUnit(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}
