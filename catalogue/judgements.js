// What a reviewer decided about a block, per theme, and what the block
// looked like at that moment. Shared by the review page (which writes it)
// and the notes prompt (which reports it).
//
//   { "<block id>": { "<theme>": { "verdict": "approved" | "rejected", "hash": "…" } } }
//
// The hash is what makes a verdict safe to act on later: a judged block stays
// hidden only while it still looks the way it did when it was judged, so a
// block that changed comes back to be judged again (Kenny, 2026-09-13).
const KEY = 'kp-catalogue-judgements:v2';
const LEGACY_APPROVALS = 'kp-catalogue-approvals:v1';

function read(key) {
    try {
        return JSON.parse(localStorage.getItem(key) ?? 'null');
    } catch {
        return null;
    }
}

/** Every judgement, migrating the approvals the first review page stored. */
export function loadJudgements() {
    const current = read(KEY);
    if (current) return current;
    const legacy = read(LEGACY_APPROVALS) ?? {};
    const migrated = {};
    for (const [id, themes] of Object.entries(legacy)) {
        for (const [theme, hash] of Object.entries(themes)) {
            (migrated[id] ??= {})[theme] = { verdict: 'approved', hash };
        }
    }
    return migrated;
}

export function saveJudgements(all) {
    try {
        localStorage.setItem(KEY, JSON.stringify(all));
        return true;
    } catch {
        return false;
    }
}

/**
 * The state of a block in a theme: its verdict while it still looks as judged,
 * "changed" once it does not, "new" when it was never judged.
 */
export function stateOf(all, id, theme, hash) {
    const entry = all[id]?.[theme];
    if (!entry) return 'new';
    if (!hash) return entry.verdict;
    return entry.hash === hash ? entry.verdict : 'changed';
}

export const JUDGEMENT_EVENT = 'cat-approval-change';
