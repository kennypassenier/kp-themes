// The shipped fonts: licence, reserved names, budget, and no orphans
// [T19, AR39].
//
// S19 said the package ships no font files; Kenny reversed it at round
// six's Phase 3 (T19), and AR39 gave the reversal its shape:
//
//   fonts/<family-slug>/<file>.woff2   the faces, subset per script
//   fonts/<family-slug>/LICENSE        the licence text, verbatim
//   fonts/families.json                one entry per family: the family
//                                      name, the licence, whether the
//                                      family declares a Reserved Font
//                                      Name, which themes use it, and
//                                      the scripts it ships
//
// What fails, each with its reason:
//
//   unlisted    a directory under fonts/ that families.json does not name
//   missing     a family families.json names with no directory or no file
//   licence     a family without a LICENSE file, or whose licence is not
//               one the package may redistribute (SIL OFL 1.1, Apache 2.0,
//               Ubuntu Font Licence 1.0)
//   reserved    a family that declares a Reserved Font Name AND ships a
//               subset — under the OFL a subset is a Modified Version and
//               may not carry the reserved name. The critic caught this;
//               "a licence file beside it" had let such a family pass.
//   orphan      a family no theme names in its theme-font-* tokens
//   budget      a theme whose families together exceed fontsBudgetBytes
//               (gates/config.json), the knob the critic priced at 1.5 MB
//               against a measured 9–18 kB per latin face
//
// Before C4 there is no fonts/ directory. The gate says so and passes —
// an absent directory is not a fault, an unlisted one is. Drilled red at
// C0 on an injected family directory without a LICENSE.
//
// Usage: node gates/check-fonts.mjs

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { nameRecords } from './woff2-names.mjs';
import process from 'node:process';

const root = new URL('../', import.meta.url);
const CONFIG = JSON.parse(readFileSync(new URL('config.json', import.meta.url), 'utf8'));

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

/**
 * The first-choice families each theme names in its font tokens.
 *
 * @returns {Map<string, string[]>}
 */
export function familiesByTheme() {
    const order = /** @type {string[]} */ (JSON.parse(readFileSync(new URL('themes/order.json', root), 'utf8')));
    /** @type {Map<string, string[]>} */
    const out = new Map();
    for (const name of order) {
        const theme = JSON.parse(readFileSync(new URL(`themes/${name}/tokens.json`, root), 'utf8'));
        /** @type {string[]} */
        const families = [];
        for (const entry of theme.entries) {
            if (typeof entry.token !== 'string' || !entry.token.startsWith('theme-font-')) continue;
            const first = String(entry.value)
                .split(',')[0]
                .trim()
                .replace(/^['"]|['"]$/g, '');
            if (first !== '' && !families.includes(first)) families.push(first);
        }
        out.set(name, families);
    }
    return out;
}

/**
 * The families css/fonts.css declares, from its @font-face rules. This is
 * the gate's subject: what the stylesheet promises is what fonts/ must
 * carry. Before C4 the file declares nothing, and the gate says "0
 * families declared" rather than reporting green over a directory that
 * does not exist (the critic's objection to the first draft).
 *
 * @param {string} source
 * @returns {string[]} family names, deduplicated
 */
export function declaredFamilies(source) {
    /** @type {string[]} */
    const out = [];
    for (const m of source.matchAll(/@font-face\s*\{[^}]*font-family:\s*['"]?([^'";]+)['"]?\s*;[^}]*\}/g)) {
        const family = m[1].trim();
        if (!out.includes(family)) out.push(family);
    }
    return out;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const fontsDir = new URL('fonts/', root);
    const declared = declaredFamilies(readFileSync(new URL('css/fonts.css', root), 'utf8'));
    if (!existsSync(fontsDir)) {
        if (declared.length > 0) {
            console.error(
                `css/fonts.css declares ${declared.length} families and fonts/ does not exist — the stylesheet promises files the package does not carry.`,
            );
            process.exit(1);
        }
        console.log('Fonts: css/fonts.css declares 0 families and fonts/ does not exist yet (C4); 0 checked, nothing promised.');
        process.exit(0);
    }
    /** @type {Record<string, Family>} */
    let families = {};
    try {
        families = JSON.parse(readFileSync(new URL('families.json', fontsDir), 'utf8'));
    } catch {
        console.error('fonts/ exists and fonts/families.json is missing or unreadable — every shipped family is listed there with its licence.');
        process.exit(1);
    }
    delete (/** @type {Record<string, unknown>} */ (families)['//']);
    const onDisk = readdirSync(fontsDir).filter((name) => statSync(new URL(name, fontsDir)).isDirectory());
    const problems = audit(
        families,
        (slug) => {
            const dir = new URL(`${slug}/`, fontsDir);
            if (!existsSync(dir)) return null;
            const files = readdirSync(dir).filter((f) => f.endsWith('.woff2'));
            const bytes = files.reduce((sum, f) => sum + statSync(new URL(f, dir)).size, 0);
            return { files, licence: existsSync(new URL('LICENSE', dir)), bytes };
        },
        familiesByTheme(),
        Number(CONFIG.fontsBudgetBytes?.value ?? 1_500_000),
        onDisk,
        CONFIG.fontsBudgetBytes?.perTheme ?? {},
    );
    // The stylesheet and the listing must agree: a family declared and
    // not listed has no licence record; one listed and not declared is a
    // file nobody can load.
    const listed = Object.values(families)
        .filter((f) => !(f.reservedFontName && !f.subset))
        .map((f) => f.renamed ?? f.family);
    for (const family of declared)
        if (!listed.includes(family)) problems.push(`${family}: declared in css/fonts.css and not listed in fonts/families.json`);
    for (const family of listed)
        if (!declared.includes(family)) problems.push(`${family}: listed in fonts/families.json and not declared in css/fonts.css`);
    if (problems.length > 0) {
        console.error(`Fonts: ${problems.length} fault(s).\n${problems.join('\n')}`);
        process.exit(1);
    }
    console.log(`Fonts: ${declared.length} families declared in css/fonts.css, all listed, licensed, named by a theme and under budget.`);
}
