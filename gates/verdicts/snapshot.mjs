// The `snapshot` command: catalogue/hashes-now.json, the hashes the working tree reads now.

import { hashVersion, knownBlocks } from '../check-verdicts.mjs';
import { join } from 'node:path';
import { writeFileSync } from 'node:fs';
import { ratioOf, readRegister, today } from './register.mjs';
import { hashAt } from './hash-at.mjs';
import { ROOT, git } from './paths.mjs';
/** @typedef {import('./types.mjs').Register} Register */

/** Where the blocks as they stand now are written [scope-112]. */
export const SNAPSHOT = 'catalogue/hashes-now.json';

/**
 * The component pairs a snapshot measures, grouped by the engine and the
 * ratio their verdict was read at — a hash only says something against a
 * verdict read the same way [fix-34].
 * @param {Register} register
 * @param {Map<string, { component: boolean }>} known every block a verdict can name
 * @returns {{ engine: string, ratio: number, requests: { key: string, theme: string }[] }[]}
 */
export function snapshotGroups(register, known) {
    /** @type {Map<string, { engine: string, ratio: number, requests: { key: string, theme: string }[] }>} */
    const groups = new Map();
    for (const [key, themes] of Object.entries(register.verdicts)) {
        if (!known.get(key)?.component) continue;
        for (const [theme, engines] of Object.entries(themes)) {
            for (const [engine, entry] of Object.entries(engines)) {
                const id = `${engine}|${ratioOf(entry)}`;
                const group = groups.get(id) ?? { engine, ratio: ratioOf(entry), requests: [] };
                group.requests.push({ key, theme });
                groups.set(id, group);
            }
        }
    }
    return [...groups.values()];
}

/**
 * The snapshot file's content, keys and themes in a fixed order.
 * @param {{ hashVersion: number, commit: string, taken: string, readings: Record<string, Record<string, Record<string, { hash: string, ratio?: number }>>> }} snapshot
 */
export function sortedSnapshot(snapshot) {
    /** @type {(object: Record<string, any>, depth: number) => Record<string, any>} */
    const sort = (object, depth) =>
        Object.fromEntries(
            Object.keys(object)
                .sort()
                .map((key) => [key, depth ? sort(object[key], depth - 1) : object[key]]),
        );
    return {
        $comment:
            'The block hash of every judged component pair as the working tree stands, so the approval count can ' +
            'call a pair open when the block changed since the verdict [scope-112]. Written by ' +
            '`node gates/verdicts.mjs snapshot`, read by gates/advice-approvals.mjs. Never a gate.',
        hashVersion: snapshot.hashVersion,
        commit: snapshot.commit,
        taken: snapshot.taken,
        readings: sort(snapshot.readings, 2),
    };
}

/**
 * Measure every judged component pair in the working tree, and write the
 * readings beside the register [scope-112].
 * @param {string[]} args
 */
export async function snapshot(args) {
    const width = (args.includes('--width') && Number(args[args.indexOf('--width') + 1])) || 1920;
    const register = readRegister();
    const known = await knownBlocks();
    const groups = snapshotGroups(register, known);
    /** @type {Record<string, Record<string, Record<string, { hash: string, ratio?: number }>>>} */
    const readings = {};
    let moved = 0;
    let total = 0;
    for (const { engine, ratio, requests } of groups) {
        console.log(`the working tree in ${engine} at ratio ${ratio}: ${requests.length} pair(s)…`);
        const measured = await hashAt({ root: ROOT, engine, requests, width, ratio });
        for (const { key, theme } of requests) {
            const reading = measured.get(`${key}|${theme}`);
            if (!reading) throw new Error(`${key} in ${theme}: no reading`);
            readings[key] ??= {};
            readings[key][theme] ??= {};
            readings[key][theme][engine] = { hash: reading.hash, ...(ratio !== 1 ? { ratio } : {}) };
            total += 1;
            if (reading.hash !== register.verdicts[key][theme][engine].hash) moved += 1;
        }
    }
    const file = join(ROOT, SNAPSHOT);
    writeFileSync(
        file,
        `${JSON.stringify(sortedSnapshot({ hashVersion: hashVersion(), commit: git('rev-parse', 'HEAD'), taken: today(), readings }), null, 4)}\n`,
    );
    console.log(`${SNAPSHOT}: ${total} pair(s) measured, ${moved} of them no longer the block the verdict was given on.`);
}

/* ------------------------------------------------------------------- carry */
