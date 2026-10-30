// The `rehash` command: re-measure every entry at its own commit under the current hash recipe.

import { hashVersion, REGISTER } from '../check-verdicts.mjs';
import { ratioOf, readRegister, writeRegister } from './register.mjs';
import { hashAt } from './hash-at.mjs';
/** @typedef {import('./types.mjs').Entry} Entry */

/** @param {string[]} args */
export async function rehash(args) {
    const HASH_VERSION = hashVersion();
    const width = (args.includes('--width') && Number(args[args.indexOf('--width') + 1])) || 1920;
    const register = readRegister();
    /** @type {Map<string, { commit: string, engine: string, ratio: number, requests: { key: string, theme: string, entry: Entry }[] }>} */
    const groups = new Map();
    for (const [key, themes] of Object.entries(register.verdicts)) {
        for (const [theme, engines] of Object.entries(themes)) {
            for (const [engine, entry] of Object.entries(engines)) {
                // Each entry at the ratio it was read at [fix-34].
                const id = `${entry.commit}|${engine}|${ratioOf(entry)}`;
                const group = groups.get(id) ?? { commit: entry.commit, engine, ratio: ratioOf(entry), requests: [] };
                group.requests.push({ key, theme, entry });
                groups.set(id, group);
            }
        }
    }
    let moved = 0;
    let total = 0;
    for (const { commit, engine, ratio, requests } of groups.values()) {
        console.log(`${commit.slice(0, 12)} in ${engine} at ratio ${ratio}: ${requests.length} entr${requests.length === 1 ? 'y' : 'ies'}…`);
        const readings = await hashAt({ commit, engine, requests, width, ratio });
        for (const { key, theme, entry } of requests) {
            const reading = readings.get(`${key}|${theme}`);
            if (!reading) throw new Error(`${key} in ${theme}: no reading`);
            const { hash } = reading;
            total += 1;
            if (hash !== entry.hash) moved += 1;
            entry.hash = hash;
        }
    }
    const from = register.hashVersion;
    register.hashVersion = HASH_VERSION;
    writeRegister(register);
    console.log(`${REGISTER}: ${total} entr${total === 1 ? 'y' : 'ies'} rehashed from version ${from} to ${HASH_VERSION}, ${moved} hash(es) moved.`);
}

/* ------------------------------------------------------------------ pixels */
