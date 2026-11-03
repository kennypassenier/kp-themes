// Kenny's release gos, one row per version in `release_gos`. Persistence only: whether a go is still active is
// decided by gates/release-go-logic.mjs, which also knows the git tags.
/** @typedef {import('node:sqlite').DatabaseSync} Db */
/** @typedef {{ version: string, given_at: string, given_by: string, source: string }} Go */

/** Every recorded go, oldest first. @param {Db} db @returns {Go[]} */
export function listGos(db) {
    return /** @type {Go[]} */ (/** @type {unknown} */ (db.prepare('SELECT version, given_at, given_by, source FROM release_gos ORDER BY given_at, version').all()));
}

/** Add one go; a version that already has one is refused. @param {Db} db @param {Go} go */
export function recordGo(db, go) {
    if (db.prepare('SELECT 1 FROM release_gos WHERE version = ?').get(go.version)) throw new Error(`a go for ${go.version} is already recorded`);
    db.prepare('INSERT INTO release_gos (version, given_at, given_by, source) VALUES (?, ?, ?, ?)').run(go.version, go.given_at, go.given_by, go.source);
}
