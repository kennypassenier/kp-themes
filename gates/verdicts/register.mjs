// Reading, ordering and writing the verdict register (data/kp-themes.sqlite, table `verdicts`, through gates/db/), and
// the pixel-ratio helpers its entries use. A one-off tool may still be pointed at a register kept as a JSON file
// (`--register <file>`, the shape `node gates/review-db.mjs export` writes): then that file is read and written instead.

import { readFileSync, writeFileSync } from 'node:fs';
import { loadRegister, reading, saveRegister, writing } from '../db/index.mjs';
/** @typedef {import('./types.mjs').Register} Register */

/**
 * The register: from the database, or from a JSON copy when `path` names one.
 * @param {string} [path]
 * @returns {Register}
 */
export function readRegister(path) {
    if (path) return JSON.parse(readFileSync(path, 'utf8'));
    return /** @type {Register} */ (reading(loadRegister));
}

/**
 * Keys, themes and engines in a fixed order, so a diff of the register shows only what moved.
 * @param {Register} register
 * @returns {Register}
 */
export function sortedRegister(register) {
    /**
     * @param {Record<string, any>} object
     * @param {number} depth
     * @returns {Record<string, any>}
     */
    const sort = (object, depth) =>
        Object.fromEntries(
            Object.keys(object)
                .sort()
                .map((key) => [key, depth ? sort(object[key], depth - 1) : object[key]]),
        );
    /** @type {Register['verdicts']} */
    const verdicts = sort(register.verdicts, 2);
    for (const themes of Object.values(verdicts))
        for (const engines of Object.values(themes))
            for (const [engine, entry] of Object.entries(engines))
                engines[engine] = {
                    verdict: entry.verdict,
                    hash: entry.hash,
                    commit: entry.commit,
                    given: entry.given,
                    ...(entry.ratio !== undefined && entry.ratio !== 1 ? { ratio: entry.ratio } : {}),
                };
    return { hashVersion: register.hashVersion, verdicts };
}

/**
 * Write the register: into the database, or into the JSON copy `path` names.
 * @param {Register} register
 * @param {string} [path]
 */
export function writeRegister(register, path) {
    if (path) return writeFileSync(path, `${JSON.stringify(sortedRegister(register), null, 4)}\n`);
    writing((db) => saveRegister(db, sortedRegister(register)));
}

/** Today in the local calendar, as the register writes a date. */
export function today(now = new Date()) {
    const pad = (/** @type {number} */ n) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** The ratio an entry was read at: its own, or 1. @param {{ ratio?: number }} entry */
export const ratioOf = (entry) => entry.ratio ?? 1;

/**
 * The ratio a Playwright Firefox launched with `layout.css.devPixelsPerPx` =
 * `pref` reads at, as a page writes it: Gecko keeps 60 app units per CSS
 * pixel over a whole number per device pixel (1.1 is 60/55, 1.091).
 * @param {number | string} pref
 */
export const geckoRatio = (pref) => Math.round((60 / Math.round(60 / Number(pref))) * 1000) / 1000;
