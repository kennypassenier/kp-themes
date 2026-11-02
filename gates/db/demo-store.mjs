// Kenny's verdicts on a research demo, round by round (tables `demos`, `demo_rounds`, `demo_round_pairs` and
// `demo_reopened`), read and written as the record research/_review/README.md describes:
//
//   { demo, rounds: [{ round, page, allJudged, approved: [{ item, theme }], notApproved: [{ item, theme, note }], comment }],
//     reopened: [{ item, theme, reason }], bundledInto }
//
// A demo is named by its folder under research/ ("kpadopt-nav", "audhd-recepten/cook"); `demo` inside the record is
// the id the page uses, which is usually the same.

import { fromRow, toRow } from './record-shape.mjs';
/** @typedef {import('node:sqlite').DatabaseSync} Db */

/** The pair lists a round can carry, each kept as rows of `demo_round_pairs`. */
export const PAIR_LISTS = ['approved', 'approvedWithNote', 'notApproved', 'notes', 'choices', 'reopenedForThisRound', 'reopened'];

/** @type {import('./record-shape.mjs').Field[]} */
const DEMO = [
    ['demo', 'name', 'text'],
    ['bundledInto', 'bundled_into', 'text'],
];
/** @type {import('./record-shape.mjs').Field[]} */
const ROUND = [
    ['round', 'round', 'text'],
    ['page', 'page', 'text'],
    ['allJudged', 'all_judged', 'bool'],
    ['comment', 'comment', 'text'],
    ['generalNote', 'general_note', 'text'],
];
/** A pair's own words are a `reason` in the reopened lists and a `note` everywhere else. @param {string} list */
const pairFields = (list) => /** @type {import('./record-shape.mjs').Field[]} */ ([
    ['item', 'item', 'text'],
    ['theme', 'theme', 'text'],
    [list.startsWith('reopened') ? 'reason' : 'note', 'note', 'text'],
]);

/** @type {import('./record-shape.mjs').Field[]} */
const REOPENED = [
    ['item', 'item', 'text'],
    ['theme', 'theme', 'text'],
    ['reason', 'reason', 'text'],
];

/** A record's non-empty arrays under `keys`, and the record without them. @param {Record<string, any>} record @param {string[]} keys */
function takeLists(record, keys) {
    const rest = { ...record };
    /** @type {[string, any[]][]} */
    const lists = [];
    for (const key of keys) {
        if (!Array.isArray(record[key]) || !record[key].length) continue;
        lists.push([key, record[key]]);
        delete rest[key];
    }
    return { rest, lists };
}

/** @param {Db} db @param {string} demo @param {number} seq @param {Record<string, any>} round */
function insertRound(db, demo, seq, round) {
    const { rest, lists } = takeLists(round, PAIR_LISTS);
    const { values, extra } = toRow(rest, ROUND);
    db.prepare('INSERT INTO demo_rounds (demo, seq, round, page, all_judged, comment, general_note, extra) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
        demo, seq, values.round, values.page, values.all_judged, values.comment, values.general_note, extra,
    );
    const pair = db.prepare('INSERT INTO demo_round_pairs (demo, seq, list, pos, item, theme, note, extra) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    for (const [list, entries] of lists)
        entries.forEach((entry, pos) => {
            const row = toRow(entry, pairFields(list));
            pair.run(demo, seq, list, pos, row.values.item, row.values.theme, row.values.note, row.extra);
        });
}

/** Write a demo's whole record, replacing what was there. @param {Db} db @param {string} demo @param {Record<string, any>} record */
export function saveDemoVerdicts(db, demo, record) {
    if (!Array.isArray(record.rounds)) throw new Error(`research/${demo}: a verdict record needs a "rounds" list`);
    const { rest, lists } = takeLists(record, ['rounds', 'reopened']);
    delete rest.rounds;
    const { values, extra } = toRow(rest, DEMO);
    db.prepare('DELETE FROM demos WHERE demo = ?').run(demo);
    db.prepare('INSERT INTO demos (demo, name, bundled_into, extra) VALUES (?, ?, ?, ?)').run(demo, values.name, values.bundled_into, extra);
    record.rounds.forEach((round, seq) => insertRound(db, demo, seq, round));
    const reopened = lists.find(([key]) => key === 'reopened')?.[1] ?? [];
    const insert = db.prepare('INSERT INTO demo_reopened (demo, pos, item, theme, reason, extra) VALUES (?, ?, ?, ?, ?, ?)');
    reopened.forEach((entry, pos) => {
        const row = toRow(entry, REOPENED);
        insert.run(demo, pos, row.values.item, row.values.theme, row.values.reason, row.extra);
    });
}

/** @param {Db} db @param {string} demo @param {Record<string, any>} row */
function readRound(db, demo, row) {
    const round = fromRow(row, ROUND);
    const pairs = /** @type {any[]} */ (db.prepare('SELECT * FROM demo_round_pairs WHERE demo = ? AND seq = ? ORDER BY list, pos').all(demo, row.seq));
    for (const list of PAIR_LISTS) {
        const mine = pairs.filter((p) => p.list === list);
        if (mine.length) round[list] = mine.map((p) => fromRow(p, pairFields(list)));
    }
    return round;
}

/** A demo's record, or null when no verdict was ever recorded for it. @param {Db} db @param {string} demo */
export function loadDemoVerdicts(db, demo) {
    const head = db.prepare('SELECT * FROM demos WHERE demo = ?').get(demo);
    if (!head) return null;
    const record = fromRow(head, DEMO);
    const rounds = db.prepare('SELECT * FROM demo_rounds WHERE demo = ? ORDER BY seq').all(demo);
    record.rounds = rounds.map((row) => readRound(db, demo, row));
    const reopened = db.prepare('SELECT * FROM demo_reopened WHERE demo = ? ORDER BY pos').all(demo);
    if (reopened.length) record.reopened = reopened.map((row) => fromRow(row, REOPENED));
    return record;
}

/** Every demo folder with a verdict record, sorted. @param {Db} db @returns {string[]} */
export function verdictDemos(db) {
    return db.prepare('SELECT demo FROM demos ORDER BY demo').all().map((row) => String(row.demo));
}

/** The page round ids Claude has recorded answers for (a page's "received"). @param {Db} db @param {string} demo */
export function receivedPages(db, demo) {
    const rows = db.prepare('SELECT page FROM demo_rounds WHERE demo = ? AND page IS NOT NULL ORDER BY seq').all(demo);
    return [...new Set(rows.map((row) => String(row.page)))];
}

/** Start a demo's record with no rounds, unless it has one. @param {Db} db @param {string} demo @param {string} name */
export function ensureDemo(db, demo, name) {
    db.prepare('INSERT OR IGNORE INTO demos (demo, name) VALUES (?, ?)').run(demo, name);
}

/** Append one round to a demo's record (started when missing). @param {Db} db @param {string} demo @param {Record<string, any>} round */
export function addRound(db, demo, round) {
    ensureDemo(db, demo, demo);
    const next = /** @type {{ n: number }} */ (db.prepare('SELECT COUNT(*) AS n FROM demo_rounds WHERE demo = ?').get(demo)).n;
    insertRound(db, demo, next, round);
    return next;
}
