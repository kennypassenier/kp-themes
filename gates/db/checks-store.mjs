// The stores the verdict tools derive from the register: the pixel checks (`pixel_checks`), the hash readings of the
// working tree (`hash_readings`, a cache `node gates/verdicts.mjs snapshot` refills) and the open review round
// (`round_state`). Each is read and written whole, as the document its tools work with.

import { leaves, nest } from './nest.mjs';
import { fromRow, meta, toRow } from './record-shape.mjs';
/** @typedef {import('node:sqlite').DatabaseSync} Db */

/** @type {import('./record-shape.mjs').Field[]} */
const CHECK = [
    ['state', 'state', 'text'],
    ['from', 'from_commit', 'text'],
    ['shot', 'shot', 'text'],
];

/** @type {import('./record-shape.mjs').Field[]} */
const READING = [
    ['hash', 'hash', 'text'],
    ['ratio', 'ratio', 'real'],
];

/** @type {import('./record-shape.mjs').Field[]} */
const ROUND = [
    ['$comment', 'comment', 'text'],
    ['open', 'open', 'bool'],
    ['commit', 'commit_id', 'text'],
    ['opened', 'opened', 'text'],
];

/** @param {string} what @param {string | null} extra */
function strict(what, extra) {
    if (extra !== null) throw new Error(`${what}: fields the table does not keep: ${extra}`);
}

/**
 * Write a nested store: its meta fields and one row per leaf.
 * @param {Db} db
 * @param {{ table: string, columns: string[], fields: import('./record-shape.mjs').Field[] }} shape
 * @param {Record<string, unknown>} metaFields
 * @param {Record<string, any>} nested
 */
function saveNested(db, { table, columns, fields }, metaFields, nested) {
    meta.put(db, table, metaFields);
    db.prepare(`DELETE FROM ${table}`).run();
    const names = ['block', 'theme', 'engine', ...columns];
    const insert = db.prepare(`INSERT INTO ${table} (${names.join(', ')}) VALUES (${names.map(() => '?').join(', ')})`);
    for (const { path, leaf } of leaves(nested, 3)) {
        const { values, extra } = toRow(leaf, fields);
        strict(`${table} ${path.join(' · ')}`, extra);
        insert.run(...path, ...columns.map((c) => values[c]));
    }
}

const PIXELS = { table: 'pixel_checks', columns: ['state', 'from_commit', 'shot'], fields: CHECK };
const READINGS = { table: 'hash_readings', columns: ['hash', 'ratio'], fields: READING };

/** The pixel checks, or null when none were ever written. @param {Db} db */
export function loadPixelChecks(db) {
    const head = meta.get(db, 'pixel_checks');
    if (!Object.keys(head).length) return null;
    const rows = db.prepare('SELECT * FROM pixel_checks ORDER BY block, theme, engine').all();
    return { ...head, checks: nest(rows, ['block', 'theme', 'engine'], (row) => fromRow(row, CHECK)) };
}

/** @param {Db} db @param {{ checks: Record<string, any>, [key: string]: unknown }} document */
export function savePixelChecks(db, { checks, ...head }) {
    saveNested(db, PIXELS, head, checks);
}

/** The hash readings, or null when none were taken. @param {Db} db */
export function loadHashReadings(db) {
    const head = meta.get(db, 'hash_readings');
    if (!Object.keys(head).length) return null;
    const rows = db.prepare('SELECT * FROM hash_readings ORDER BY block, theme, engine').all();
    return { ...head, readings: nest(rows, ['block', 'theme', 'engine'], (row) => fromRow(row, READING)) };
}

/** @param {Db} db @param {{ readings: Record<string, any>, [key: string]: unknown }} document */
export function saveHashReadings(db, { readings, ...head }) {
    saveNested(db, READINGS, head, readings);
}

/** The review round, or null when none was ever opened. @param {Db} db */
export function loadRound(db) {
    const row = db.prepare('SELECT * FROM round_state WHERE id = 1').get();
    return row ? fromRow(row, ROUND) : null;
}

/** @param {Db} db @param {Record<string, unknown>} round */
export function saveRound(db, round) {
    const { values, extra } = toRow(round, ROUND);
    strict('round_state', extra);
    db.prepare('INSERT OR REPLACE INTO round_state (id, open, commit_id, opened, comment) VALUES (1, ?, ?, ?, ?)').run(
        values.open,
        values.commit_id,
        values.opened,
        values.comment,
    );
}
