// The JSON files the review stores were kept in until 2026-11-02, and the mapping between them and the database:
// `importTree` reads them from a checkout into the database (once, at the move), `exportTree` gives the same files
// back from the database, in the same shapes, so the move can be proven lossless and an old tool can still be fed.

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { loadDemoFacts, saveDemoFact } from './demo-facts-store.mjs';
import { loadDemoVerdicts, saveDemoVerdicts, verdictDemos } from './demo-store.mjs';
import { loadHashReadings, loadPixelChecks, loadRound, saveHashReadings, savePixelChecks, saveRound } from './checks-store.mjs';
import { loadNotes, loadRegister, saveNotes, saveRegister } from './register-store.mjs';
/** @typedef {import('node:sqlite').DatabaseSync} Db */

/** The whole-document stores: file, how to read it from the database, how to write it. */
const DOCUMENTS = [
    { file: 'catalogue/verdicts.json', load: loadRegister, save: saveRegister },
    { file: 'catalogue/review-notes.json', load: loadNotes, save: saveNotes },
    { file: 'catalogue/pixel-checks.json', load: loadPixelChecks, save: savePixelChecks },
    { file: 'catalogue/hashes-now.json', load: loadHashReadings, save: saveHashReadings },
    { file: 'catalogue/round.json', load: loadRound, save: saveRound },
];

/** Per demo folder: the file beside the demo and the fact it holds (VERDICTS.json is the verdict record). */
const DEMO_FILES = { 'VERDICTS.json': 'verdicts', 'decided.json': 'decided', 'update.json': 'update' };
const PREVIOUS = `_previous${sep}previous.json`;

/**
 * Every per-demo store file under research/, as [repository path, demo folder, kind]. A demo's `_previous/` copy holds
 * the files of the round it froze; those are part of the frozen copy, not stores, and are skipped.
 * @param {string} root
 * @returns {[string, string, string][]}
 */
export function demoFiles(root) {
    /** @type {[string, string, string][]} */
    const found = [];
    const walk = (/** @type {string} */ dir) => {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
            const path = join(dir, entry.name);
            if (entry.isDirectory() && entry.name !== '_previous' && entry.name !== 'node_modules') walk(path);
            const folder = relative(join(root, 'research'), dir).split(sep).join('/');
            if (entry.isFile() && entry.name in DEMO_FILES) found.push([relative(root, path), folder, DEMO_FILES[/** @type {keyof typeof DEMO_FILES} */ (entry.name)]]);
        }
        if (existsSync(join(dir, PREVIOUS))) found.push([relative(root, join(dir, PREVIOUS)), relative(join(root, 'research'), dir).split(sep).join('/'), 'previous']);
    };
    walk(join(root, 'research'));
    return found.map(([path, folder, kind]) => /** @type {[string, string, string]} */ ([path.split(sep).join('/'), folder, kind])).sort();
}

/** @param {string} path */
function readJson(path) {
    try {
        return JSON.parse(readFileSync(path, 'utf8'));
    } catch (error) {
        throw new Error(`${path} cannot be read as JSON: ${error instanceof Error ? error.message : error}`);
    }
}

/**
 * Read every store file of a checkout into the database. Returns the files read.
 * @param {Db} db @param {string} root
 */
export function importTree(db, root) {
    const read = [];
    for (const { file, save } of DOCUMENTS) {
        if (!existsSync(join(root, file))) continue;
        save(db, readJson(join(root, file)));
        read.push(file);
    }
    for (const [path, folder, kind] of demoFiles(root)) {
        const record = readJson(join(root, path));
        if (kind === 'verdicts') saveDemoVerdicts(db, folder, record);
        else saveDemoFact(db, /** @type {'decided' | 'update' | 'previous'} */ (kind), folder, record);
        read.push(path);
    }
    return read;
}

/**
 * Every store as the file it used to be: repository path to parsed content.
 * @param {Db} db
 * @returns {Map<string, any>}
 */
export function exportTree(db) {
    /** @type {Map<string, any>} */
    const files = new Map();
    for (const { file, load } of DOCUMENTS) {
        const document = load(db);
        if (document !== null) files.set(file, document);
    }
    for (const demo of verdictDemos(db)) files.set(`research/${demo}/VERDICTS.json`, loadDemoVerdicts(db, demo));
    for (const [kind, name] of [['decided', 'decided.json'], ['update', 'update.json'], ['previous', '_previous/previous.json']])
        for (const [demo, record] of Object.entries(loadDemoFacts(db, /** @type {'decided' | 'update' | 'previous'} */ (kind))))
            files.set(`research/${demo}/${name}`, record);
    return files;
}

