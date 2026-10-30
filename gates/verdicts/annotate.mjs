// The `annotate-ratio` command: give entries the pixel ratio at which a reading matches their hash.

import { readFileSync } from 'node:fs';
import { geckoRatio, readRegister, writeRegister } from './register.mjs';
import { entriesAt } from './compare.mjs';
import { registerPath } from './paths.mjs';
/** @typedef {import('./types.mjs').Entry} Entry */
/** @typedef {import('./types.mjs').Register} Register */

/**
 * Give entries recorded before verdicts kept a ratio the ratio at which a
 * reading matches their hash [fix-34]. An entry whose hash a ratio-1 reading
 * matches, or that has a ratio already, is left as it is. Where several
 * ratios match, the one that matches the most entries overall is taken
 * (Kenny's default zoom), then the lowest. No hash and no verdict changes.
 * @param {Register} register changed in place
 * @param {Record<string, Record<string, string>>} readings `<devPixelsPerPx>` -> `key|theme` -> hash, read in `engine`
 * @param {{ commit?: string | null, engine?: string }} [options] commit: only the entries recorded at it (a prefix)
 * @returns {{ annotated: { key: string, theme: string, ratio: number }[], equal: number, kept: number, unmatched: { key: string, theme: string }[], unread: { key: string, theme: string }[] }}
 */
export function annotateRatios(register, readings, { commit = null, engine = 'firefox' } = {}) {
    const prefs = Object.keys(readings);
    const one = prefs.filter((pref) => geckoRatio(pref) === 1);
    const others = prefs.filter((pref) => geckoRatio(pref) !== 1);
    /** @type {ReturnType<typeof annotateRatios>} */
    const out = { annotated: [], equal: 0, kept: 0, unmatched: [], unread: [] };
    const candidates = entriesAt(register, commit).filter((e) => e.engine === engine);
    const matches = (/** @type {string} */ pref, /** @type {{ key: string, theme: string, entry: Entry }} */ e) =>
        readings[pref]?.[`${e.key}|${e.theme}`] === e.entry.hash;
    // How many entries each ratio matches: the tie-break.
    /** @type {Map<number, number>} */
    const weight = new Map();
    for (const e of candidates)
        for (const ratio of new Set(others.filter((pref) => matches(pref, e)).map(geckoRatio))) weight.set(ratio, (weight.get(ratio) ?? 0) + 1);
    for (const e of candidates) {
        const id = { key: e.key, theme: e.theme };
        if (e.entry.ratio !== undefined) {
            out.kept += 1;
            continue;
        }
        if (one.some((pref) => matches(pref, e))) {
            out.equal += 1;
            continue;
        }
        if (!prefs.some((pref) => `${e.key}|${e.theme}` in (readings[pref] ?? {}))) {
            out.unread.push(id);
            continue;
        }
        const ratios = [...new Set(others.filter((pref) => matches(pref, e)).map(geckoRatio))].sort(
            (a, b) => (weight.get(b) ?? 0) - (weight.get(a) ?? 0) || a - b,
        );
        if (!ratios.length) {
            out.unmatched.push(id);
            continue;
        }
        e.entry.ratio = ratios[0];
        out.annotated.push({ ...id, ratio: ratios[0] });
    }
    return out;
}

/** @param {string[]} args */
export async function annotateRatio(args) {
    const option = (/** @type {string} */ name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
    const from = option('--from');
    if (!from) throw new Error('annotate-ratio needs --from <readings.json>');
    const file = option('--register') ?? registerPath;
    const register = readRegister(file);
    const { readings } = JSON.parse(readFileSync(from, 'utf8'));
    const result = annotateRatios(register, readings, { commit: option('--commit') ?? null, engine: option('--engine') ?? 'firefox' });
    writeRegister(register, file);
    /** @param {{ key: string, theme: string }[]} rows */
    const byTheme = (rows) => {
        /** @type {Record<string, string[]>} */
        const grouped = {};
        for (const { key, theme } of rows) (grouped[theme] ??= []).push(key);
        return Object.entries(grouped)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([theme, keys]) => `${theme} (${keys.length}): ${keys.sort().join(', ')}`);
    };
    /** @type {Record<string, number>} */
    const perRatio = {};
    for (const { ratio } of result.annotated) perRatio[ratio] = (perRatio[ratio] ?? 0) + 1;
    console.log(
        `${file}: ${result.annotated.length} entr${result.annotated.length === 1 ? 'y' : 'ies'} given a ratio (${Object.entries(perRatio)
            .map(([ratio, n]) => `@${ratio} ${n}`)
            .join(
                ', ',
            )}), ${result.equal} equal at ratio 1, ${result.kept} with a ratio already, ${result.unmatched.length} matched by no reading, ${result.unread.length} not read.`,
    );
    for (const row of byTheme(result.annotated.map(({ key, theme, ratio }) => ({ key: `${key} @${ratio}`, theme }))))
        console.log(`  given a ratio: ${row}`);
    for (const row of byTheme(result.unmatched)) console.log(`  no ratio matches: ${row}`);
    for (const row of byTheme(result.unread)) console.log(`  not read: ${row}`);
}

/* ----------------------------------------------------------------- migrate */
