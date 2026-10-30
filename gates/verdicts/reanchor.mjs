// The `reanchor` command: entries at a commit take the reading at rest of that commit.

import { readFileSync } from 'node:fs';
import { entriesAt } from './compare.mjs';
import { ratioOf, readRegister, writeRegister } from './register.mjs';
import { git, registerPath } from './paths.mjs';
import { hashAt } from './hash-at.mjs';
import { compareCommand } from './record.mjs';
/** @typedef {import('./types.mjs').Entry} Entry */
/** @typedef {import('./types.mjs').Register} Register */

/**
 * The ratio each theme's entries at a commit are re-anchored at [scope-94]:
 * the ratio most of that theme's annotated entries (a ratio other than 1)
 * have; on a tie the one most annotated entries of the commit have, then the
 * lowest; 1 for a theme with none.
 * @param {Register} register
 * @param {{ commit: string, engine?: string }} options
 * @returns {Map<string, number>} theme -> ratio, for the themes with an annotated entry
 */
export function reanchorRatios(register, { commit, engine = 'firefox' }) {
    const entries = entriesAt(register, commit).filter((e) => e.engine === engine && ratioOf(e.entry) !== 1);
    /** @type {Map<number, number>} */
    const overall = new Map();
    /** @type {Map<string, Map<number, number>>} */
    const perTheme = new Map();
    for (const { theme, entry } of entries) {
        const ratio = ratioOf(entry);
        overall.set(ratio, (overall.get(ratio) ?? 0) + 1);
        const counts = perTheme.get(theme) ?? new Map();
        counts.set(ratio, (counts.get(ratio) ?? 0) + 1);
        perTheme.set(theme, counts);
    }
    return new Map(
        [...perTheme].map(([theme, counts]) => [
            theme,
            [...counts].sort(([a, n], [b, m]) => m - n || (overall.get(b) ?? 0) - (overall.get(a) ?? 0) || a - b)[0][0],
        ]),
    );
}

/**
 * The entries at a commit whose hash the reading at rest of that commit, at
 * the entry's own ratio and with the current recipe, does not read: an entry
 * without a ratio no ratio matched [fix-34, scope-94], or an entry the test
 * browser could not carry to a new hash version [scope-96].
 * @param {Register} register
 * @param {Map<string, { hash: string }>} readings `key|theme|ratio` -> the reading at that ratio at the commit
 * @param {{ commit: string, engine?: string }} options
 */
export function unmatchedEntries(register, readings, { commit, engine = 'firefox' }) {
    return entriesAt(register, commit).filter(
        (e) => e.engine === engine && readings.get(`${e.key}|${e.theme}|${ratioOf(e.entry)}`)?.hash !== e.entry.hash,
    );
}

/**
 * The `key · theme · engine` of every "differs:" line of a saved
 * `compare --against-browser` output.
 * @param {string} text
 * @returns {{ key: string, theme: string, engine: string }[]}
 */
export function keysFromCompare(text) {
    return [...text.matchAll(/^\s*differs: (\S+) · ([a-z0-9-]+) · ([a-z0-9]+) · /gm)].map(([, key, theme, engine]) => ({ key, theme, engine }));
}

/**
 * Re-anchor entries [scope-94]: each target's hash is replaced by the reading
 * at rest of the commit it was recorded at, at the target's ratio, which the
 * entry now keeps. Its verdict, commit and date stay; no other entry is touched.
 * @param {Register} register changed in place
 * @param {{ key: string, theme: string, engine: string, ratio: number }[]} targets
 * @param {Map<string, { hash: string }>} readings `key|theme|engine|ratio` -> reading
 * @returns {{ reanchored: string[], unread: string[], zoomed: string[] }} zoomed: left to the reviewer [fix-45]
 */
export function reanchorEntries(register, targets, readings, { force = false } = {}) {
    /** @type {{ reanchored: string[], unread: string[], zoomed: string[] }} */
    const out = { reanchored: [], unread: [], zoomed: [] };
    for (const { key, theme, engine, ratio } of targets) {
        const at = `${key} · ${theme} · ${engine} @${ratio}`;
        const entry = register.verdicts[key]?.[theme]?.[engine];
        const reading = readings.get(`${key}|${theme}|${engine}|${ratio}`);
        if (!entry || !reading) {
            out.unread.push(at);
            continue;
        }
        // Never anchor a zoomed entry on a reading of the tools [fix-45]. At a
        // ratio other than 1 the tools' Firefox and the reviewer's browser do
        // not read the same hash for every block, so such an anchor is a hash
        // his browser never gives: the block is "Changed since judged" for him
        // in every theme, for good. Left alone, it comes back to him once and
        // is settled by his own reading.
        if (ratio !== 1 && !force) {
            out.zoomed.push(at);
            continue;
        }
        entry.hash = reading.hash;
        if (ratio === 1) delete entry.ratio;
        else entry.ratio = ratio;
        out.reanchored.push(at);
    }
    return out;
}

/**
 * `reanchor --commit <hash> [--keys-from-compare <file>] [--register <file>]`,
 * one-off [scope-94]: the entries recorded at a commit that match no ratio
 * keep their verdict and take the hash of the block at rest at that commit.
 * Without --keys-from-compare the entries are found by reading every entry
 * without a ratio at ratio 1 at the commit; with it, they are the "differs:"
 * lines of a saved `compare --against-browser --at-recorded` output.
 * @param {string[]} args
 */
export async function reanchor(args) {
    const option = (/** @type {string} */ name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
    const commit = option('--commit');
    if (!commit) throw new Error('reanchor needs --commit <hash>');
    const engine = option('--engine') ?? 'firefox';
    const file = option('--register') ?? registerPath;
    const register = readRegister(file);
    const full = git('rev-parse', `${commit}^{commit}`);
    const fromCompare = option('--keys-from-compare');
    /** @type {{ key: string, theme: string, engine: string, entry: Entry }[]} */
    let found;
    if (fromCompare) {
        const wanted = new Set(keysFromCompare(readFileSync(fromCompare, 'utf8')).map((k) => `${k.key}|${k.theme}|${k.engine}`));
        found = entriesAt(register, commit).filter((e) => wanted.has(`${e.key}|${e.theme}|${e.engine}`));
    } else {
        // Every entry of the commit at its own ratio, with the recipe as it stands.
        const all = entriesAt(register, commit).filter((e) => e.engine === engine);
        /** @type {Map<string, { hash: string }>} */
        const atOwn = new Map();
        for (const ratio of [...new Set(all.map((e) => ratioOf(e.entry)))].sort((a, b) => a - b)) {
            const group = all.filter((e) => ratioOf(e.entry) === ratio);
            console.log(`${full.slice(0, 12)} in ${engine} at ratio ${ratio}: reading ${group.length} entr${group.length === 1 ? 'y' : 'ies'}…`);
            const read = await hashAt({ commit: full, engine, requests: group.map(({ key, theme }) => ({ key, theme })), ratio });
            for (const e of group) {
                const reading = read.get(`${e.key}|${e.theme}`);
                if (reading) atOwn.set(`${e.key}|${e.theme}|${ratio}`, reading);
            }
        }
        found = unmatchedEntries(register, atOwn, { commit, engine });
    }
    const ratios = reanchorRatios(register, { commit, engine });
    // An entry that keeps a ratio is re-anchored at it; one without takes its theme's [scope-94].
    const targets = found.map(({ key, theme, engine: own, entry }) => ({
        key,
        theme,
        engine: own,
        ratio: entry.ratio ?? ratios.get(theme) ?? 1,
    }));
    /** @type {Map<string, { hash: string }>} */
    const readings = new Map();
    for (const ratio of new Set(targets.map((t) => t.ratio))) {
        const group = targets.filter((t) => t.ratio === ratio);
        console.log(`${full.slice(0, 12)} in ${engine} at ratio ${ratio}: ${group.length} entr${group.length === 1 ? 'y' : 'ies'}…`);
        const read = await hashAt({ commit: full, engine, requests: group.map(({ key, theme }) => ({ key, theme })), ratio });
        for (const t of group) {
            const reading = read.get(`${t.key}|${t.theme}`);
            if (reading) readings.set(`${t.key}|${t.theme}|${t.engine}|${ratio}`, reading);
        }
    }
    const result = reanchorEntries(register, targets, readings, { force: args.includes('--force') });
    writeRegister(register, file);
    console.log(
        `${file}: ${result.reanchored.length} entr${result.reanchored.length === 1 ? 'y' : 'ies'} re-anchored, ${result.unread.length} not read, ` +
            `${result.zoomed.length} left to the reviewer (read at a zoom the tools do not reproduce) [fix-45].`,
    );
    for (const row of result.reanchored) console.log(`  re-anchored: ${row}`);
    for (const row of result.unread) console.log(`  not read: ${row}`);
    for (const row of result.zoomed) console.log(`  left to the reviewer: ${row}`);
    console.log(`Check: ${compareCommand(full)} --at-recorded`);
}
