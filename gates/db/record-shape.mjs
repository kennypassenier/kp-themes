// Moving a JSON record into a table row and back without losing anything.
//
// A row has a column for each field the records share. A field a record carries that has no column, or whose value
// does not fit its column's kind (a null, a number where text was written), is kept in the row's `extra` column as a
// JSON object; reading the row back merges it in again. So a hand-written record with an unforeseen key survives the
// round trip, and the columns still hold what every reader queries.

/** @typedef {'text' | 'int' | 'real' | 'bool' | 'json'} Kind */
/** @typedef {[key: string, column: string, kind: Kind]} Field */

/** @type {Record<Kind, (value: unknown) => boolean>} */
const FITS = {
    text: (v) => typeof v === 'string',
    int: (v) => Number.isInteger(v),
    real: (v) => typeof v === 'number' && Number.isFinite(v),
    bool: (v) => typeof v === 'boolean',
    json: (v) => v !== null && v !== undefined,
};

/** @param {Kind} kind @param {unknown} value */
function encode(kind, value) {
    if (kind === 'bool') return value ? 1 : 0;
    if (kind === 'json') return JSON.stringify(value);
    return /** @type {string | number} */ (value);
}

/** @param {Kind} kind @param {unknown} value */
function decode(kind, value) {
    if (kind === 'bool') return value === 1;
    if (kind === 'json') return JSON.parse(String(value));
    return value;
}

/**
 * The column values of a record and what has no column.
 * @param {Record<string, unknown>} record
 * @param {Field[]} fields
 * @returns {{ values: Record<string, string | number | null>, extra: string | null }}
 */
export function toRow(record, fields) {
    if (!record || typeof record !== 'object' || Array.isArray(record)) throw new Error(`a record must be an object, not ${JSON.stringify(record)}`);
    /** @type {Record<string, string | number | null>} */
    const values = {};
    /** @type {Record<string, unknown>} */
    const rest = { ...record };
    for (const [key, column, kind] of fields) {
        const fits = Object.hasOwn(record, key) && FITS[kind](record[key]);
        values[column] = fits ? encode(kind, record[key]) : null;
        if (fits) delete rest[key];
    }
    return { values, extra: Object.keys(rest).length ? JSON.stringify(rest) : null };
}

/**
 * The record a row holds: its columns under their record keys (a NULL column is a field the record did not have),
 * then whatever `extra` kept.
 * @param {Record<string, unknown>} row
 * @param {Field[]} fields
 * @returns {Record<string, any>}
 */
export function fromRow(row, fields) {
    /** @type {Record<string, any>} */
    const record = {};
    for (const [key, column, kind] of fields) if (row[column] !== null && row[column] !== undefined) record[key] = decode(kind, row[column]);
    if (row.extra !== null && row.extra !== undefined) Object.assign(record, JSON.parse(String(row.extra)));
    return record;
}

/** Store-level fields (a `$comment`, a version, a commit) that sit beside a store's rows. */
export const meta = {
    /**
     * @param {import('node:sqlite').DatabaseSync} db
     * @param {string} store
     * @param {Record<string, unknown>} values
     */
    put(db, store, values) {
        db.prepare('DELETE FROM store_meta WHERE store = ?').run(store);
        const insert = db.prepare('INSERT INTO store_meta (store, key, pos, value) VALUES (?, ?, ?, ?)');
        Object.entries(values)
            .filter(([, value]) => value !== undefined)
            .forEach(([key, value], pos) => insert.run(store, key, pos, JSON.stringify(value)));
    },
    /** @param {import('node:sqlite').DatabaseSync} db @param {string} store @returns {Record<string, any>} */
    get(db, store) {
        const rows = /** @type {{ key: string, value: string }[]} */ (db.prepare('SELECT key, value FROM store_meta WHERE store = ? ORDER BY pos').all(store));
        return Object.fromEntries(rows.map((r) => [r.key, JSON.parse(r.value)]));
    },
};
