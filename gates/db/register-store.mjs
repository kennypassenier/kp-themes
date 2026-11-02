// The verdict register (table `verdicts`) and the review notes (table `review_notes`), read and written as the
// nested objects the verdict tools work with: register.verdicts[block][theme][engine] and notes[block][theme].

import { leaves, nest } from './nest.mjs';
import { fromRow, meta, toRow } from './record-shape.mjs';
/** @typedef {import('node:sqlite').DatabaseSync} Db */

/** @type {import('./record-shape.mjs').Field[]} */
const VERDICT = [
    ['verdict', 'verdict', 'text'],
    ['hash', 'hash', 'text'],
    ['commit', 'commit_id', 'text'],
    ['given', 'given', 'text'],
    ['ratio', 'ratio', 'real'],
];

/** @type {import('./record-shape.mjs').Field[]} */
const NOTE = [
    ['rejected', 'rejected', 'text'],
    ['change', 'change', 'text'],
    ['commit', 'commit_id', 'text'],
    ['given', 'given', 'text'],
];

/** Refuse a field a table has no room for: the register's entries are fixed, so an unknown key is a mistake. */
function strict(/** @type {string} */ what, /** @type {string | null} */ extra) {
    if (extra !== null) throw new Error(`${what}: fields the register does not keep: ${extra}`);
}

/** @param {Db} db @returns {{ hashVersion: number, verdicts: Record<string, any> }} */
export function loadRegister(db) {
    const rows = db.prepare('SELECT * FROM verdicts ORDER BY block, theme, engine').all();
    const head = /** @type {{ hashVersion: number }} */ (meta.get(db, 'verdicts'));
    return { ...head, verdicts: nest(rows, ['block', 'theme', 'engine'], (row) => fromRow(row, VERDICT)) };
}

/** @param {Db} db @param {{ hashVersion: number, verdicts: Record<string, any> }} register */
export function saveRegister(db, register) {
    const { verdicts, ...rest } = register;
    meta.put(db, 'verdicts', rest);
    db.prepare('DELETE FROM verdicts').run();
    const insert = db.prepare(
        'INSERT INTO verdicts (block, theme, engine, verdict, hash, commit_id, given, ratio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    );
    for (const { path, leaf } of leaves(verdicts, 3)) {
        const { values, extra } = toRow(leaf, VERDICT);
        strict(path.join(' · '), extra);
        insert.run(...path, values.verdict, values.hash, values.commit_id, values.given, values.ratio);
    }
}

/** @param {Db} db @returns {Record<string, Record<string, any>>} */
export function loadNotes(db) {
    const rows = db.prepare('SELECT * FROM review_notes ORDER BY block, theme').all();
    return nest(rows, ['block', 'theme'], (row) => fromRow(row, NOTE));
}

/** @param {Db} db @param {Record<string, Record<string, any>>} notes */
export function saveNotes(db, notes) {
    db.prepare('DELETE FROM review_notes').run();
    const insert = db.prepare('INSERT INTO review_notes (block, theme, rejected, change, commit_id, given) VALUES (?, ?, ?, ?, ?, ?)');
    for (const { path, leaf } of leaves(notes, 2)) {
        const { values, extra } = toRow(leaf, NOTE);
        strict(path.join(' · '), extra);
        insert.run(...path, values.rejected, values.change, values.commit_id, values.given);
    }
}
