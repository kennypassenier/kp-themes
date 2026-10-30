// The `migrate` command: move entries to a newer hash-recipe version where their readings agree.

import { hashVersion } from '../check-verdicts.mjs';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { ratioOf, readRegister, writeRegister } from './register.mjs';
import { entriesAt } from './compare.mjs';
import { registerPath } from './paths.mjs';
import { atCommit, hashAt } from './hash-at.mjs';
/** @typedef {import('./types.mjs').Entry} Entry */
/** @typedef {import('./types.mjs').Register} Register */

/** Where migrate keeps an entry's reading: its block, theme, engine, commit and ratio. @param {string} key @param {string} theme @param {string} engine @param {Entry} entry */
export const migrationKey = (key, theme, engine, entry) => `${key}|${theme}|${engine}|${entry.commit}|${ratioOf(entry)}`;

/**
 * Carry the register over from hash version `to - 1` to `to` [scope-95,
 * scope-96]. An entry whose stored hash is the `to - 1` reading of its block
 * at its commit and ratio takes the `to` reading of that same moment; its
 * verdict, commit, date and ratio stay. An entry whose `to - 1` reading is
 * another hash (its block could not be read back as it was judged) keeps its
 * hash and is listed, and so is one with no reading. The register is marked
 * version `to` either way: a kept hash matches no new reading, and its block
 * comes back.
 * @param {Register} register changed in place
 * @param {Map<string, { hash: string, previous?: string }>} readings migrationKey -> the reading at that commit and ratio;
 *   previous: the same reading under version `to - 1`
 * @param {{ to?: number }} [options] default 3
 * @returns {{ migrated: string[], unreproducible: string[], unread: string[] }}
 */
export function migrateEntries(register, readings, { to = 3 } = {}) {
    if (register.hashVersion !== to - 1) throw new Error(`the register is at hash version ${register.hashVersion}, not ${to - 1}`);
    /** @type {{ migrated: string[], unreproducible: string[], unread: string[] }} */
    const out = { migrated: [], unreproducible: [], unread: [] };
    for (const { key, theme, engine, entry } of entriesAt(register, null)) {
        const at = `${key} · ${theme} · ${engine}${ratioOf(entry) === 1 ? '' : ` @${ratioOf(entry)}`}`;
        const reading = readings.get(migrationKey(key, theme, engine, entry));
        if (!reading?.previous) out.unread.push(at);
        else if (reading.previous !== entry.hash) out.unreproducible.push(`${at} (recorded at ${entry.commit.slice(0, 12)})`);
        else {
            entry.hash = reading.hash;
            out.migrated.push(at);
        }
    }
    register.hashVersion = to;
    return out;
}

/**
 * `migrate --to <version> [--register <file>] [--readings <file> [--only <commit>]]`
 * [scope-95, scope-96]: one worktree per commit, one browser per engine and
 * ratio in it, every entry read once with the current recipe, which returns
 * the reading under each earlier version (`earlier`) beside its own; the one
 * under `to - 1` decides. --readings keeps the readings in a file after each
 * commit and reads only the commits it does not hold yet; --only reads one
 * commit into it and leaves the register alone, so the run can be taken in
 * parts.
 * @param {string[]} args
 */
export async function migrate(args) {
    const started = performance.now();
    const option = (/** @type {string} */ name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
    const to = Number(option('--to'));
    if (!Number.isInteger(to) || to < 3) throw new Error('migrate needs --to <version>, 3 or higher');
    const from = to - 1;
    const file = option('--register') ?? registerPath;
    const cache = option('--readings');
    const only = option('--only');
    if (only && !cache) throw new Error('--only needs --readings <file> to keep what it reads');
    const register = readRegister(file);
    if (hashVersion() !== to) throw new Error(`catalogue/block-hash.js reads version ${hashVersion()}; migrate --to ${to} needs it to read ${to}`);
    if (register.hashVersion !== from) throw new Error(`${file} is at hash version ${register.hashVersion}, not ${from}`);
    const entries = entriesAt(register, null);
    /** @type {Map<string, { hash: string, previous?: string }>} */
    const readings = new Map(cache && existsSync(cache) ? Object.entries(JSON.parse(readFileSync(cache, 'utf8'))) : []);
    for (const commit of new Set(entries.map((e) => e.entry.commit))) {
        if (only && !commit.startsWith(only)) continue;
        const here = entries.filter((e) => e.entry.commit === commit && !readings.has(migrationKey(e.key, e.theme, e.engine, e.entry)));
        if (!here.length) continue;
        await atCommit(commit, async (dir) => {
            for (const engine of new Set(here.map((e) => e.engine))) {
                const ratios = [...new Set(here.filter((e) => e.engine === engine).map((e) => ratioOf(e.entry)))].sort((a, b) => a - b);
                for (const ratio of ratios) {
                    const group = here.filter((e) => e.engine === engine && ratioOf(e.entry) === ratio);
                    console.log(`${commit.slice(0, 12)} in ${engine} at ratio ${ratio}: ${group.length} entr${group.length === 1 ? 'y' : 'ies'}…`);
                    const read = await hashAt({ root: dir, engine, requests: group.map(({ key, theme }) => ({ key, theme })), ratio });
                    for (const e of group) {
                        const reading = read.get(`${e.key}|${e.theme}`);
                        // The reading under the register's version; a recipe older than `earlier` gave only `previous`.
                        const previous = reading?.earlier?.[from] ?? reading?.previous;
                        if (reading) readings.set(migrationKey(e.key, e.theme, e.engine, e.entry), { hash: reading.hash, previous });
                    }
                }
            }
        });
        if (cache) writeFileSync(cache, `${JSON.stringify(Object.fromEntries(readings))}\n`);
    }
    if (only) {
        console.log(`${cache}: ${readings.size} reading(s) kept; the register is left as it is until a run without --only.`);
        return;
    }
    const result = migrateEntries(register, readings, { to });
    writeRegister(register, file);
    console.log(
        `${file}: ${result.migrated.length} of ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} carried over from hash version ${from} to ${to}, ` +
            `${result.unreproducible.length} not reproducible, ${result.unread.length} not read — ${((performance.now() - started) / 1000).toFixed(1)} s.`,
    );
    for (const row of result.unreproducible) console.log(`  not reproducible, kept: ${row}`);
    for (const row of result.unread) console.log(`  not read, kept: ${row}`);
}

/* ---------------------------------------------------------------- reanchor */
