// Opening the review database, applying the schema, and running a unit of work in one transaction.
//
// Readers open the file read-only and refuse a database whose schema is behind or ahead of this code, with the
// command that fixes it; they never write, so a gate that only reads leaves the file byte for byte as it found it.
// Writers open it read-write, bring the schema up to date, run their work in one transaction (all or nothing) and
// compact the file afterwards so the committed binary stays as small as its contents.

import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { databasePath, lockTimeout } from './config.mjs';
import { MIGRATIONS } from './migrations.mjs';

/** The schema version this code reads and writes. */
export const SCHEMA_VERSION = MIGRATIONS[MIGRATIONS.length - 1].version;

/** @param {DatabaseSync} db @returns {number} the highest applied migration, 0 for a new file */
function appliedVersion(db) {
    const table = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'schema_migrations'").get();
    if (!table) return 0;
    const row = /** @type {{ v: number | null }} */ (db.prepare('SELECT MAX(version) AS v FROM schema_migrations').get());
    return row.v ?? 0;
}

/** Apply every migration the file does not have yet, each in its own transaction. @param {DatabaseSync} db @param {string} path */
function migrate(db, path) {
    db.exec('CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, name TEXT NOT NULL) STRICT');
    const have = appliedVersion(db);
    if (have > SCHEMA_VERSION) throw new Error(`${path} has schema ${have}, newer than this code's ${SCHEMA_VERSION}: update the checkout`);
    for (const step of MIGRATIONS.filter((m) => m.version > have)) {
        db.exec('BEGIN IMMEDIATE');
        try {
            db.exec(step.sql);
            db.prepare('INSERT INTO schema_migrations (version, name) VALUES (?, ?)').run(step.version, step.name);
            db.exec('COMMIT');
        } catch (error) {
            db.exec('ROLLBACK');
            throw new Error(`migration ${step.version} (${step.name}) failed: ${error instanceof Error ? error.message : error}`);
        }
    }
}

/**
 * Open the database.
 * @param {{ path?: string, write?: boolean, create?: boolean, check?: boolean }} [options]
 *   path   another file than the configured one (a test's, a merge's)
 *   write  open read-write and bring the schema up to date (default: read-only)
 *   create allow a file that does not exist yet (only with write)
 *   check  refuse a read-only file whose schema is not this code's (default: true; git's views read any version)
 * @returns {DatabaseSync}
 */
export function openDatabase({ path = databasePath(), write = false, create = false, check = true } = {}) {
    // existsSync also tells the gate cache (.githooks/trace-inputs.cjs) that this check reads the file: SQLite opens it
    // natively, past the fs hooks the tracer counts on.
    if (!existsSync(path)) {
        if (!(write && create)) throw new Error(`the review database ${path} does not exist (KP_THEMES_DB, default data/kp-themes.sqlite)`);
        mkdirSync(dirname(path), { recursive: true });
    }
    const db = new DatabaseSync(path, { readOnly: !write, enableForeignKeyConstraints: true, timeout: lockTimeout() });
    if (write) {
        migrate(db, path);
        return db;
    }
    const have = appliedVersion(db);
    if (check && have !== SCHEMA_VERSION) {
        db.close();
        throw new Error(`${path} has schema ${have}, this code reads ${SCHEMA_VERSION}: run node gates/review-db.mjs migrate`);
    }
    return db;
}

/**
 * Run `work` against the database in one transaction and return what it returns. A write commits only when `work`
 * returns; anything it throws rolls the whole unit back and is thrown on, with the database closed either way.
 * @template T
 * @param {(db: DatabaseSync) => T} work
 * @param {{ path?: string, write?: boolean, create?: boolean }} [options]
 * @returns {T}
 */
export function withDatabase(work, options = {}) {
    const db = openDatabase(options);
    try {
        if (!options.write) return work(db);
        db.exec('BEGIN IMMEDIATE');
        let result;
        try {
            result = work(db);
            db.exec('COMMIT');
        } catch (error) {
            db.exec('ROLLBACK');
            throw error;
        }
        db.exec('VACUUM');
        return result;
    } finally {
        db.close();
    }
}

/** Read with the configured database. @template T @param {(db: DatabaseSync) => T} work @returns {T} */
export const reading = (work) => withDatabase(work);

/** Write to the configured database in one transaction. @template T @param {(db: DatabaseSync) => T} work @returns {T} */
export const writing = (work) => withDatabase(work, { write: true });
