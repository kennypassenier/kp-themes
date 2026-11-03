// The database schema, as numbered migrations. A migration is never edited once it has reached main: a change to the
// schema is a new entry at the end, which connection.mjs applies in order and records in `schema_migrations`.
//
// Design notes:
// - Each table mirrors one record the review tools used to keep in a JSON file, one row per record, with the fields
//   that every record has as columns. Fields only some hand-written records carry (a `choice` on a pair, a stray key
//   on a round) go to an `extra` column as a JSON object, so nothing is lost and no column exists for one row.
// - `commit` and `from` are SQL keywords, so those columns are `commit_id` and `from_commit` / `from_ref`.
// - Booleans are INTEGER 0/1; JSON columns are TEXT checked with json_valid.

/** @type {{ version: number, name: string, sql: string }[]} */
export const MIGRATIONS = [
    {
        version: 1,
        name: 'review stores moved out of JSON files',
        sql: `
CREATE TABLE store_meta (
    store TEXT NOT NULL,
    key TEXT NOT NULL,
    pos INTEGER NOT NULL,
    value TEXT NOT NULL CHECK (json_valid(value)),
    PRIMARY KEY (store, key)
) STRICT;

CREATE TABLE verdicts (
    block TEXT NOT NULL,
    theme TEXT NOT NULL,
    engine TEXT NOT NULL,
    verdict TEXT NOT NULL CHECK (verdict IN ('approved', 'rejected')),
    hash TEXT NOT NULL,
    commit_id TEXT NOT NULL,
    given TEXT NOT NULL,
    ratio REAL,
    PRIMARY KEY (block, theme, engine)
) STRICT;

CREATE TABLE review_notes (
    block TEXT NOT NULL,
    theme TEXT NOT NULL,
    rejected TEXT NOT NULL,
    change TEXT NOT NULL,
    commit_id TEXT,
    given TEXT NOT NULL,
    PRIMARY KEY (block, theme)
) STRICT;

CREATE TABLE pixel_checks (
    block TEXT NOT NULL,
    theme TEXT NOT NULL,
    engine TEXT NOT NULL,
    state TEXT NOT NULL,
    from_commit TEXT,
    shot TEXT,
    PRIMARY KEY (block, theme, engine)
) STRICT;

CREATE TABLE hash_readings (
    block TEXT NOT NULL,
    theme TEXT NOT NULL,
    engine TEXT NOT NULL,
    hash TEXT NOT NULL,
    ratio REAL,
    PRIMARY KEY (block, theme, engine)
) STRICT;

CREATE TABLE round_state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    open INTEGER NOT NULL CHECK (open IN (0, 1)),
    commit_id TEXT NOT NULL,
    opened TEXT NOT NULL,
    comment TEXT
) STRICT;

CREATE TABLE demos (
    demo TEXT PRIMARY KEY,
    name TEXT,
    bundled_into TEXT,
    extra TEXT CHECK (extra IS NULL OR json_valid(extra))
) STRICT;

CREATE TABLE demo_rounds (
    demo TEXT NOT NULL REFERENCES demos (demo) ON DELETE CASCADE,
    seq INTEGER NOT NULL,
    round TEXT,
    page TEXT,
    all_judged INTEGER CHECK (all_judged IS NULL OR all_judged IN (0, 1)),
    comment TEXT,
    general_note TEXT,
    extra TEXT CHECK (extra IS NULL OR json_valid(extra)),
    PRIMARY KEY (demo, seq)
) STRICT;

CREATE TABLE demo_round_pairs (
    demo TEXT NOT NULL,
    seq INTEGER NOT NULL,
    list TEXT NOT NULL,
    pos INTEGER NOT NULL,
    item TEXT,
    theme TEXT,
    note TEXT,
    extra TEXT CHECK (extra IS NULL OR json_valid(extra)),
    PRIMARY KEY (demo, seq, list, pos),
    FOREIGN KEY (demo, seq) REFERENCES demo_rounds (demo, seq) ON DELETE CASCADE
) STRICT;

CREATE TABLE demo_reopened (
    demo TEXT NOT NULL REFERENCES demos (demo) ON DELETE CASCADE,
    pos INTEGER NOT NULL,
    item TEXT,
    theme TEXT,
    reason TEXT,
    extra TEXT CHECK (extra IS NULL OR json_valid(extra)),
    PRIMARY KEY (demo, pos)
) STRICT;

CREATE TABLE demo_decided (
    demo TEXT PRIMARY KEY,
    decided TEXT,
    decided_by TEXT,
    note TEXT,
    attributes TEXT,
    picks TEXT CHECK (picks IS NULL OR json_valid(picks)),
    extra TEXT CHECK (extra IS NULL OR json_valid(extra))
) STRICT;

CREATE TABLE demo_updates (
    demo TEXT PRIMARY KEY,
    update_no INTEGER,
    picks TEXT CHECK (picks IS NULL OR json_valid(picks)),
    questions TEXT CHECK (questions IS NULL OR json_valid(questions)),
    extra TEXT CHECK (extra IS NULL OR json_valid(extra))
) STRICT;

CREATE TABLE demo_previous (
    demo TEXT PRIMARY KEY,
    round TEXT,
    from_ref TEXT,
    commit_id TEXT,
    made TEXT,
    extra TEXT CHECK (extra IS NULL OR json_valid(extra))
) STRICT;
`,
    },
    {
        version: 2,
        name: 'release gos recorded in the database',
        sql: `
CREATE TABLE release_gos (
    version TEXT PRIMARY KEY CHECK (version GLOB '[0-9]*.[0-9]*.[0-9]*'),
    given_at TEXT NOT NULL,
    given_by TEXT NOT NULL,
    source TEXT NOT NULL
) STRICT;
`,
    },
];
