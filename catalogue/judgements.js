// What a reviewer decided about a block, per theme and per browser engine,
// and what the block looked like at that moment. Two places hold verdicts:
//
//   catalogue/verdicts.json  the register, committed: every verdict Kenny
//                            gave that a prompt brought into the repository.
//                            It is kept for good (Kenny, 2026-09-13: "dit mag
//                            nooit veranderen door een change").
//   browser storage          the scratch pad: what was judged in this browser
//                            and not yet recorded.
//
//   register  { hashVersion, verdicts: { key: { theme: { engine: { verdict, hash, commit, given } } } } }
//   storage   { key: { theme: { engine: { verdict, hash, v, at } } } }
//
// The hash is what makes a verdict safe to act on later: a judged block stays
// hidden only while it still looks the way it did when it was judged, so a
// block that changed comes back to be judged again.
import { ENGINE } from './engine.js';
import { HASH_VERSION } from './block-hash.js';

export const JUDGEMENTS_KEY = 'kp-catalogue-judgements:v3';
const LEGACY_V2 = 'kp-catalogue-judgements:v2';
const LEGACY_APPROVALS = 'kp-catalogue-approvals:v1';
export const JUDGEMENT_EVENT = 'cat-approval-change';

function read(key) {
    try {
        return JSON.parse(localStorage.getItem(key) ?? 'null');
    } catch {
        return null;
    }
}

/**
 * Every judgement stored in this browser. A verdict stored before verdicts
 * carried an engine was given in this browser, so it moves under this
 * browser's engine on the first read.
 * @returns {Record<string, Record<string, Record<string, { verdict: string, hash: string, v?: number, at?: number }>>>}
 */
export function loadJudgements() {
    const current = read(JUDGEMENTS_KEY);
    if (current) return current;
    const migrated = {};
    const v2 = read(LEGACY_V2);
    if (v2) {
        for (const [key, themes] of Object.entries(v2)) {
            for (const [theme, entry] of Object.entries(themes ?? {})) {
                if (entry?.verdict) ((migrated[key] ??= {})[theme] ??= {})[ENGINE] = { verdict: entry.verdict, hash: entry.hash };
            }
        }
    } else {
        for (const [key, themes] of Object.entries(read(LEGACY_APPROVALS) ?? {})) {
            for (const [theme, hash] of Object.entries(themes ?? {})) ((migrated[key] ??= {})[theme] ??= {})[ENGINE] = { verdict: 'approved', hash };
        }
    }
    if (Object.keys(migrated).length) saveJudgements(migrated);
    return migrated;
}

export function saveJudgements(all) {
    try {
        localStorage.setItem(JUDGEMENTS_KEY, JSON.stringify(all));
        return true;
    } catch {
        return false;
    }
}

/** Store one verdict of this browser, in its engine; returns the entry it replaced. */
export function storeVerdict(key, theme, verdict, hash, engine = ENGINE) {
    const all = loadJudgements();
    const themes = ((all[key] ??= {})[theme] ??= {});
    const previous = themes[engine] ?? null;
    themes[engine] = { verdict, hash, v: HASH_VERSION, at: Date.now() };
    saveJudgements(all);
    return previous;
}

/** Put back what a verdict replaced (Undo). */
export function restoreVerdict(key, theme, previous, engine = ENGINE) {
    const all = loadJudgements();
    const themes = ((all[key] ??= {})[theme] ??= {});
    if (previous) themes[engine] = previous;
    else delete themes[engine];
    if (!Object.keys(themes).length) delete all[key][theme];
    if (!Object.keys(all[key]).length) delete all[key];
    saveJudgements(all);
}

/* ------------------------------------------------------------ the register */

let register = { hashVersion: HASH_VERSION, verdicts: {} };
/** Resolves once catalogue/verdicts.json is read (or found missing); never rejects. */
export const registerReady = (async () => {
    try {
        const response = await fetch(new URL('./verdicts.json', import.meta.url), { cache: 'no-cache' });
        if (!response.ok) return register;
        const data = await response.json();
        if (data && typeof data.verdicts === 'object') register = data;
        if (register.hashVersion !== HASH_VERSION) {
            console.warn(
                `catalogue/verdicts.json holds hash version ${register.hashVersion}, the pages read ${HASH_VERSION}: run node gates/verdicts.mjs rehash`,
            );
        }
    } catch {
        /* no register: every verdict is this browser's */
    }
    return register;
})();

/** The register as read so far. */
export const registerVerdicts = () => register.verdicts ?? {};

/**
 * The verdict that counts for a block in a theme and engine, and where it
 * comes from. The register wins, unless this browser holds a different
 * verdict given the same day or later, under the current recipe — a verdict
 * made since the register's, not yet brought into it.
 * @returns {{ verdict: string, hash: string, source: 'register' | 'browser', recorded: boolean } | null}
 */
export function verdictOf(key, theme, engine = ENGINE, stored = loadJudgements()) {
    const kept = registerVerdicts()[key]?.[theme]?.[engine];
    const local = stored[key]?.[theme]?.[engine];
    const same = kept && local && kept.verdict === local.verdict && kept.hash === local.hash;
    if (kept && (!local || same || !newer(local, kept))) return { verdict: kept.verdict, hash: kept.hash, source: 'register', recorded: true };
    if (local) return { verdict: local.verdict, hash: local.hash, source: 'browser', recorded: false };
    return null;
}

function newer(local, kept) {
    if (!local.at || local.v !== HASH_VERSION) return false;
    return new Date(local.at).toISOString().slice(0, 10) >= String(kept.given ?? '');
}

/**
 * The state of a block in a theme and engine: its verdict while it still
 * looks as judged, "changed" once it does not, "new" when it was never judged.
 */
export function stateOf(key, theme, hash, engine = ENGINE, stored = loadJudgements()) {
    const entry = verdictOf(key, theme, engine, stored);
    if (!entry) return 'new';
    if (!hash) return entry.verdict;
    return entry.hash === hash ? entry.verdict : 'changed';
}
