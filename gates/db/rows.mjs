// Every row of every table, keyed by its primary key: what the git text view (git-dump.mjs) prints and what the merge
// driver (git-merge.mjs) compares. Generic over the schema, so a new table needs nothing here.

/** @typedef {import('node:sqlite').DatabaseSync} Db */

/** The user tables of a database, sorted. @param {Db} db @returns {string[]} */
export function tables(db) {
    return db
        .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
        .all()
        .map((row) => String(row.name));
}

/** A table's primary key columns in key order, or every column when it has none. @param {Db} db @param {string} table */
export function keyColumns(db, table) {
    const columns = /** @type {{ name: string, pk: number }[]} */ (db.prepare(`PRAGMA table_info(${JSON.stringify(table)})`).all());
    const keyed = columns.filter((c) => c.pk > 0).sort((a, b) => a.pk - b.pk);
    return (keyed.length ? keyed : columns).map((c) => c.name);
}

/**
 * A table's rows as key (JSON of the primary key values) to row (JSON of every column, in column order).
 * @param {Db} db @param {string} table
 * @returns {Map<string, string>}
 */
export function rowsOf(db, table) {
    const keys = keyColumns(db, table);
    /** @type {Map<string, string>} */
    const out = new Map();
    for (const row of db.prepare(`SELECT * FROM ${JSON.stringify(table)}`).all())
        out.set(JSON.stringify(keys.map((k) => row[k])), JSON.stringify(Object.values(row)));
    return out;
}
