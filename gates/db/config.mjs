// Where the review database lives and what the generated browser exports are called (Kenny, 2026-11-02: "ALLE info gaat
// vanaf nu in databases, geen aparte .json bestanden meer"). Every value here has a default and can be moved by the
// environment, so a test or a one-off run points the tools at another database without touching the repository's own.
//
//   KP_THEMES_DB          the SQLite file every store reads and writes (default data/kp-themes.sqlite in the repository)
//   KP_THEMES_DB_TIMEOUT  milliseconds a writer waits for another writer's lock before it fails (default 5000)

import { isAbsolute, join, relative } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

/** The repository root, with a trailing separator. */
export const ROOT = fileURLToPath(new URL('../../', import.meta.url));

/** The database's path inside the repository, as git and the gates name it. */
export const DB_FILE = 'data/kp-themes.sqlite';

/** The generated browser exports (build output, never edited by hand; gates/generate-review-data.mjs writes them). */
export const EXPORTS = Object.freeze({
    /** the verdict register and the review notes, which every catalogue page reads */
    data: 'catalogue/review-data.json',
    /** the pixel checks, kept apart because the Agenda reads the few that reopen from its own index */
    pixels: 'catalogue/review-pixels.json',
    /** per demo folder its decision, its update and its previous version, which the demo pages read */
    demos: 'catalogue/review-demos.json',
});

const DEFAULT_TIMEOUT_MS = 5000;

/** The absolute path of the database the tools use now. */
export function databasePath(env = process.env) {
    const chosen = env.KP_THEMES_DB;
    if (!chosen) return join(ROOT, DB_FILE);
    return isAbsolute(chosen) ? chosen : join(process.cwd(), chosen);
}

/** Whether the tools use the repository's own database (and not one an environment variable named). */
export const usesRepositoryDatabase = (env = process.env) => relative(join(ROOT, DB_FILE), databasePath(env)) === '';

/** How long a writer waits for a lock, in milliseconds. */
export function lockTimeout(env = process.env) {
    const raw = env.KP_THEMES_DB_TIMEOUT;
    if (raw === undefined || raw === '') return DEFAULT_TIMEOUT_MS;
    const value = Number(raw);
    if (!Number.isInteger(value) || value < 0) throw new Error(`KP_THEMES_DB_TIMEOUT=${raw} is not a whole number of milliseconds`);
    return value;
}
