// When this browser's answer outranks the register's entry for the same pair.
// Pure, so a node test can pin it (gates/verdict-age.test.mjs).

/**
 * Whether this browser's answer outranks the register's entry.
 *
 * Why an old answer once came back in a copied prompt (Kenny, 2026-10-15 02:30:
 * a deco rejection of 2026-10-05 sat in the prompt of a review that never
 * touched it): the register's entry was flipped to approved by hand, hash and
 * `given` untouched, so the browser's rejection, given the same day the entry
 * says, still counted as "same day or later" and won. Whoever changes a
 * register verdict by hand must therefore also move its `given` to the day it
 * was decided; every browser answer given before that day then loses here and
 * is dropped by verdictOf, never reaching the prompt.
 * @param {{ at?: number, v?: number }} local
 * @param {{ given?: string }} kept
 * @param {number} version the hash version of the recipe now
 */
export function newer(local, kept, version) {
    if (!local.at || local.v !== version) return false;
    return localDay(new Date(local.at)) >= String(kept.given ?? '');
}

/**
 * A day in the local calendar, as gates/verdicts.mjs writes `given`. In UTC
 * an approval Kenny gave at 01:50 in Brussels fell on the day before a
 * rejection recorded at 01:40 the same night, so the register's rejection
 * won and Approve did nothing (2026-10-08, phantom's theme menu).
 * @param {Date} date
 */
function localDay(date) {
    const pad = (/** @type {number} */ n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
