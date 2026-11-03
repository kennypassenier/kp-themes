// The review database's own tools (gates/db/ is the persistence module; this is its command line).
//
//   node gates/review-db.mjs migrate                  bring the configured database's schema up to date
//   node gates/review-db.mjs counts                   rows per table
//   node gates/review-db.mjs import --from <checkout> read a checkout's old JSON stores into the configured database
//                                                     (a new file; --replace empties an existing one first)
//   node gates/review-db.mjs export --to <dir>        write every store back out as the JSON file it used to be
//   node gates/review-db.mjs roundtrip --from <checkout>
//                                                     import the checkout's JSON stores into a scratch database, export
//                                                     them again and compare every file: as data, key order, bytes
//   node gates/review-db.mjs adopt                    move the research VERDICTS.json, decided.json, update.json and
//                                                     _previous/previous.json files this checkout still holds (a branch
//                                                     from before the move) into the database and delete them
//   node gates/review-db.mjs git-setup                wire git's text view and merge driver for the database file
//                                                     (.gitattributes names them; the commands live in .git/config)
//
// The configured database is data/kp-themes.sqlite unless KP_THEMES_DB names another.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import process from 'node:process';
import { databasePath, openDatabase, reading, withDatabase, writing } from './db/index.mjs';
import { deepEqual, firstDifference, orderedEqual } from './db/compare.mjs';
import { adoptDemoFiles, catalogueFiles, exportTree, importTree } from './db/legacy-json.mjs';
import { ROOT } from './db/config.mjs';

const TABLES = [
    'verdicts', 'review_notes', 'pixel_checks', 'hash_readings', 'round_state', 'demos', 'demo_rounds',
    'demo_round_pairs', 'demo_reopened', 'demo_decided', 'demo_updates', 'demo_previous', 'store_meta', 'release_gos',
];

/** @param {string[]} args @param {string} name */
const option = (args, name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);

/** @param {import('node:sqlite').DatabaseSync} db */
const countRows = (db) => Object.fromEntries(TABLES.map((t) => [t, Number(db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get()?.n)]));

/** @param {string[]} args */
function runImport(args) {
    const from = option(args, '--from');
    if (!from) throw new Error('import needs --from <checkout>');
    const path = databasePath();
    if (existsSync(path) && !args.includes('--replace')) throw new Error(`${path} exists; pass --replace to empty it and import again`);
    if (existsSync(path)) rmSync(path);
    const read = withDatabase((db) => importTree(db, resolve(from)), { write: true, create: true });
    console.log(`${path}: ${read.length} file(s) imported from ${resolve(from)}`);
    console.log(reading(countRows));
}

/** @param {string[]} args */
function runExport(args) {
    const to = option(args, '--to');
    if (!to) throw new Error('export needs --to <dir>');
    const files = reading(exportTree);
    for (const [path, content] of files) {
        const target = join(resolve(to), path);
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, `${JSON.stringify(content, null, 4)}\n`);
    }
    console.log(`${files.size} file(s) written under ${resolve(to)}`);
}

/**
 * Compare each exported file with the one it came from.
 * @param {Map<string, any>} exported @param {string[]} read @param {string} root
 */
function compareAll(exported, read, root) {
    const tally = { files: read.length, data: 0, keyOrder: 0, bytes: 0, missing: 0, extra: 0 };
    /** @type {string[]} */
    const faults = [];
    for (const path of read) {
        if (!exported.has(path)) {
            tally.missing += 1;
            faults.push(`${path}: not exported`);
            continue;
        }
        const raw = readFileSync(join(root, path), 'utf8');
        const original = JSON.parse(raw);
        const back = exported.get(path);
        if (deepEqual(original, back)) tally.data += 1;
        else faults.push(`${path}: ${firstDifference(original, back)}`);
        if (orderedEqual(original, back)) tally.keyOrder += 1;
        if (raw === `${JSON.stringify(back, null, 4)}\n`) tally.bytes += 1;
    }
    for (const path of exported.keys()) if (!read.includes(path)) (tally.extra += 1), faults.push(`${path}: exported, never imported`);
    return { tally, faults };
}

/** @param {string[]} args */
function runRoundtrip(args) {
    const root = resolve(option(args, '--from') ?? '.');
    const scratch = mkdtempSync(join(tmpdir(), 'kp-review-db-'));
    const path = join(scratch, 'roundtrip.sqlite');
    try {
        const read = withDatabase((db) => importTree(db, root), { path, write: true, create: true });
        const db = openDatabase({ path });
        const [exported, counts] = [exportTree(db), countRows(db)];
        db.close();
        const { tally, faults } = compareAll(exported, read, root);
        console.log(JSON.stringify({ counts, tally }, null, 2));
        if (faults.length) {
            console.error(`roundtrip: ${faults.length} difference(s)\n  ${faults.join('\n  ')}`);
            process.exitCode = 1;
        }
    } finally {
        rmSync(scratch, { recursive: true, force: true });
    }
}

function runAdopt() {
    const stale = catalogueFiles(ROOT);
    if (stale.length) throw new Error(`${stale.join(', ')}: merge these by hand (node gates/review-db.mjs export, compare, then the verdict tools); adopt takes only research files`);
    const read = writing((db) => adoptDemoFiles(db, ROOT));
    for (const path of read) rmSync(join(ROOT, path));
    console.log(`${read.length} file(s) moved into ${databasePath()} and deleted${read.length ? `:\n  ${read.join('\n  ')}` : ''}`);
    if (read.length) console.log('now run node gates/generate-review-data.mjs and node gates/generate-agenda-index.mjs');
}

/** The git settings `diff=kp-sqlite` and `merge=kp-sqlite` in .gitattributes point at. */
const GIT_SETTINGS = [
    ['diff.kp-sqlite.textconv', 'node gates/db/git-dump.mjs'],
    ['merge.kp-sqlite.name', 'review database: merge row by row (gates/db/git-merge.mjs)'],
    ['merge.kp-sqlite.driver', 'node gates/db/git-merge.mjs %O %A %B'],
];

function runGitSetup() {
    for (const [key, value] of GIT_SETTINGS) execFileSync('git', ['config', key, value], { stdio: 'inherit' });
    console.log(`git: ${GIT_SETTINGS.map(([key]) => key).join(', ')} set for this repository and its worktrees`);
}

function main() {
    const [command, ...args] = process.argv.slice(2);
    if (command === 'migrate') return void writing(() => console.log(`${databasePath()}: schema up to date`));
    if (command === 'counts') return void console.log(reading(countRows));
    if (command === 'import') return runImport(args);
    if (command === 'export') return runExport(args);
    if (command === 'roundtrip') return runRoundtrip(args);
    if (command === 'git-setup') return runGitSetup();
    if (command === 'adopt') return runAdopt();
    console.error('usage: node gates/review-db.mjs migrate | counts | import --from <checkout> [--replace] | export --to <dir> | roundtrip --from <checkout> | adopt | git-setup');
    process.exitCode = 2;
}

try {
    main();
} catch (error) {
    console.error(`review-db: ${error instanceof Error ? error.message : error}`);
    process.exitCode = 1;
}
