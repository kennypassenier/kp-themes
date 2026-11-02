// git's merge driver for the review database (`merge=kp-sqlite` in .gitattributes, `npm run db:git-setup` wires it).
//
// Sessions record verdicts in their own worktrees and rebase onto main, so two branches change the same binary file.
// This merges row by row: every row their side added, changed or removed since the common ancestor is applied to our
// side, unless our side changed that same row differently, which is a conflict. On a conflict nothing is written and
// git stops with our version in place; the conflicting rows are printed.
//
//   node gates/db/git-merge.mjs <ancestor %O> <ours %A, written in place> <theirs %B>

import process from 'node:process';
import { openDatabase } from './connection.mjs';
import { keyColumns, rowsOf, tables } from './rows.mjs';

/** @typedef {{ table: string, key: string, row: string | undefined }} Change */

/** @param {string} path */
const snapshot = (path) => {
    const db = openDatabase({ path, check: false });
    const out = new Map(tables(db).map((t) => [t, rowsOf(db, t)]));
    db.close();
    return out;
};

/**
 * Their changes since the ancestor, and the ones our side changed differently.
 * @param {Map<string, Map<string, string>>} base @param {Map<string, Map<string, string>>} ours @param {Map<string, Map<string, string>>} theirs
 */
export function plan(base, ours, theirs) {
    /** @type {Change[]} */
    const apply = [];
    /** @type {string[]} */
    const conflicts = [];
    for (const [table, rows] of theirs) {
        const before = base.get(table) ?? new Map();
        const mine = ours.get(table);
        if (!mine) throw new Error(`table ${table} is only on their side: the schemas differ; merge by hand (node gates/review-db.mjs)`);
        for (const key of new Set([...rows.keys(), ...before.keys()])) {
            const [was, theirsNow, oursNow] = [before.get(key), rows.get(key), mine.get(key)];
            if (theirsNow === was || theirsNow === oursNow) continue;
            if (oursNow === was) apply.push({ table, key, row: theirsNow });
            else conflicts.push(`${table} ${key}: ours ${oursNow ?? '(removed)'} / theirs ${theirsNow ?? '(removed)'}`);
        }
    }
    return { apply, conflicts };
}

/** @param {string} path @param {Change[]} changes */
function write(path, changes) {
    const db = openDatabase({ path, write: true });
    db.exec('PRAGMA defer_foreign_keys = ON');
    db.exec('BEGIN IMMEDIATE');
    try {
        for (const { table, key, row } of changes) {
            const keys = keyColumns(db, table);
            const where = keys.map((k) => `${JSON.stringify(k)} = ?`).join(' AND ');
            db.prepare(`DELETE FROM ${JSON.stringify(table)} WHERE ${where}`).run(...JSON.parse(key));
            if (row === undefined) continue;
            const values = JSON.parse(row);
            db.prepare(`INSERT INTO ${JSON.stringify(table)} VALUES (${values.map(() => '?').join(', ')})`).run(...values);
        }
        db.exec('COMMIT');
    } catch (error) {
        db.exec('ROLLBACK');
        throw error;
    }
    db.exec('VACUUM');
    db.close();
}

function main() {
    const [ancestor, ours, theirs] = process.argv.slice(2);
    if (!ancestor || !ours || !theirs) throw new Error('usage: node gates/db/git-merge.mjs <ancestor> <ours> <theirs>');
    const { apply, conflicts } = plan(snapshot(ancestor), snapshot(ours), snapshot(theirs));
    if (conflicts.length) {
        console.error(`review database: ${conflicts.length} row(s) changed on both sides; ours kept, nothing merged:\n  ${conflicts.join('\n  ')}`);
        process.exitCode = 1;
        return;
    }
    write(ours, apply);
    console.error(`review database: ${apply.length} row change(s) of theirs merged into ours`);
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
    try {
        main();
    } catch (error) {
        console.error(`git-merge: ${error instanceof Error ? error.message : error}`);
        process.exitCode = 1;
    }
}
