// The audit of the shipped fonts (gates/check-fonts.mjs): licences, reserved names, budgets, and every directory under fonts/ accounted for.
import { readFileSync } from 'node:fs';
import { nameRecords } from './woff2-names.mjs';

const root = new URL('../', import.meta.url);


/** Licences the package may redistribute a font under. */
export const REDISTRIBUTABLE = ['OFL-1.1', 'Apache-2.0', 'UFL-1.0'];

/**
 * @typedef {{ family: string, licence: string, reservedFontName: boolean, renamed?: string, reservedWord?: string, subset: boolean, themes: string[], scripts: string[], why?: string }} Family
 */

/**
 * @param {Record<string, Family>} families slug → entry
 * @param {(slug: string) => { files: string[], licence: boolean, bytes: number } | null} readDir null when the directory is absent
 * @param {Map<string, string[]>} themeFamilies theme → family names its tokens name
 * @param {number} budgetBytes
 * @param {Record<string, number>} [perTheme] a theme's own budget, with its reason in gates/config.json
 * @param {string[]} onDisk every directory under fonts/
 * @returns {string[]} problems
 */
export function audit(families, readDir, themeFamilies, budgetBytes, onDisk, perTheme = {}) {
    /** @type {string[]} */
    const problems = [];
    for (const slug of onDisk)
        if (families[slug] === undefined) problems.push(`fonts/${slug}/ is on disk and fonts/families.json does not name it (unlisted)`);
    const named = new Set([...themeFamilies.values()].flat());
    /** @type {Map<string, number>} */
    const bytesBySlug = new Map();
    for (const [slug, entry] of Object.entries(families)) {
        const dir = readDir(slug);
        // A family with a Reserved Font Name ships nothing until R6-Q1 is
        // decided: listed, with its reason, and not a fault — as long as it
        // really ships nothing.
        if (entry.reservedFontName && !entry.subset) {
            if (dir !== null && dir.files.length > 0)
                problems.push(`${entry.family}: declares a Reserved Font Name and ships ${dir.files.length} file(s) anyway (reserved)`);
            continue;
        }
        if (dir === null || dir.files.length === 0) {
            problems.push(`${entry.family}: fonts/${slug}/ has no woff2 file (missing)`);
            continue;
        }
        if (!dir.licence) problems.push(`${entry.family}: fonts/${slug}/LICENSE is missing (licence)`);
        if (!REDISTRIBUTABLE.includes(entry.licence))
            problems.push(`${entry.family}: licence ${entry.licence} is not one the package may redistribute (licence)`);
        if (entry.reservedFontName && entry.subset) {
            // A renamed delivery (R6-Q1): the file itself must carry the new
            // family and none of the reserved word, measured on its name
            // table — the plan saying so is not the measurement.
            if (!entry.renamed || !entry.reservedWord)
                problems.push(
                    `${entry.family}: declares a Reserved Font Name and ships a subset without a renamed family and the reserved word to keep out of it (reserved)`,
                );
            else
                for (const file of dir.files) {
                    /** @type {{ id: number, text: string }[]} */
                    let records = [];
                    try {
                        records = nameRecords(readFileSync(new URL(`fonts/${slug}/${file}`, root)));
                    } catch (error) {
                        problems.push(
                            `${entry.family}: fonts/${slug}/${file} cannot be read as woff2 — ${/** @type {Error} */ (error).message} (reserved)`,
                        );
                        continue;
                    }
                    const family = records.filter((r) => r.id === 1 || r.id === 16).map((r) => r.text);
                    if (!family.some((t) => t === entry.renamed))
                        problems.push(
                            `${entry.family}: fonts/${slug}/${file} does not carry the renamed family '${entry.renamed}' in its name table (reserved)`,
                        );
                    const leaked = records.filter((r) => ![0, 7, 8, 9, 11, 13, 14].includes(r.id) && r.text.includes(entry.reservedWord ?? ''));
                    if (leaked.length > 0)
                        problems.push(
                            `${entry.family}: fonts/${slug}/${file} still carries the reserved word '${entry.reservedWord}' in name record(s) ${[...new Set(leaked.map((r) => r.id))].join(', ')} (reserved)`,
                        );
                }
        }
        if (!named.has(entry.renamed ?? entry.family))
            problems.push(`${entry.renamed ?? entry.family}: no theme names it in its theme-font-* tokens (orphan)`);
        bytesBySlug.set(slug, dir.bytes);
    }
    for (const [theme, names] of themeFamilies) {
        let total = 0;
        for (const [slug, entry] of Object.entries(families)) if (names.includes(entry.renamed ?? entry.family)) total += bytesBySlug.get(slug) ?? 0;
        // A theme may carry its own budget, named with its reason in
        // gates/config.json — woodblock is the first: two Japanese
        // families with a real bold face each cannot fit the shared
        // number, and Kenny raised it for this theme rather than ship a
        // browser-drawn bold (R6-Q6, 2026-09-08).
        const budget = perTheme[theme] ?? budgetBytes;
        if (total > budget) problems.push(`${theme}: its families weigh ${total} bytes, over the budget of ${budget} (budget)`);
    }
    return problems;
}
