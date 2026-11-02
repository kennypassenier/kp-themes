// What stands beside a research demo besides its verdicts: its decision once it is archived (`demo_decided`), the
// update a character demo was republished with (`demo_updates`) and the version Kenny judged last, kept for the
// review dialog's "Previous version" (`demo_previous`). Each is one row per demo folder, read and written as the
// record the demo pages read: { decided, by, note, attributes, picks }, { update, picks, questions } and
// { round, from, commit, made }.

import { fromRow, toRow } from './record-shape.mjs';
/** @typedef {import('node:sqlite').DatabaseSync} Db */

/** @typedef {{ table: string, fields: import('./record-shape.mjs').Field[] }} Kind */

/** @type {Record<'decided' | 'update' | 'previous', Kind>} */
export const FACTS = {
    decided: {
        table: 'demo_decided',
        fields: [
            ['decided', 'decided', 'text'],
            ['by', 'decided_by', 'text'],
            ['note', 'note', 'text'],
            ['attributes', 'attributes', 'text'],
            ['picks', 'picks', 'json'],
        ],
    },
    update: {
        table: 'demo_updates',
        fields: [
            ['update', 'update_no', 'int'],
            ['picks', 'picks', 'json'],
            ['questions', 'questions', 'json'],
        ],
    },
    previous: {
        table: 'demo_previous',
        fields: [
            ['round', 'round', 'text'],
            ['from', 'from_ref', 'text'],
            ['commit', 'commit_id', 'text'],
            ['made', 'made', 'text'],
        ],
    },
};

/** @param {keyof typeof FACTS} kind */
function kindOf(kind) {
    const found = FACTS[kind];
    if (!found) throw new Error(`no demo fact "${kind}"; one of ${Object.keys(FACTS).join(', ')}`);
    return found;
}

/**
 * Write one demo's fact, replacing the one it had.
 * @param {Db} db @param {keyof typeof FACTS} kind @param {string} demo @param {Record<string, unknown>} record
 */
export function saveDemoFact(db, kind, demo, record) {
    const { table, fields } = kindOf(kind);
    const { values, extra } = toRow(record, fields);
    const columns = ['demo', ...fields.map(([, column]) => column), 'extra'];
    db.prepare(`INSERT OR REPLACE INTO ${table} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`).run(
        demo,
        ...fields.map(([, column]) => values[column]),
        extra,
    );
}

/** One demo's fact, or null. @param {Db} db @param {keyof typeof FACTS} kind @param {string} demo */
export function loadDemoFact(db, kind, demo) {
    const { table, fields } = kindOf(kind);
    const row = db.prepare(`SELECT * FROM ${table} WHERE demo = ?`).get(demo);
    return row ? fromRow(row, fields) : null;
}

/** Every demo's fact of one kind, keyed by folder, sorted. @param {Db} db @param {keyof typeof FACTS} kind */
export function loadDemoFacts(db, kind) {
    const { table, fields } = kindOf(kind);
    const rows = db.prepare(`SELECT * FROM ${table} ORDER BY demo`).all();
    return Object.fromEntries(rows.map((row) => [String(row.demo), fromRow(row, fields)]));
}

/** Remove one demo's fact (a previous version once the demo is archived). @param {Db} db @param {keyof typeof FACTS} kind @param {string} demo */
export function deleteDemoFact(db, kind, demo) {
    db.prepare(`DELETE FROM ${kindOf(kind).table} WHERE demo = ?`).run(demo);
}
