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
//   register  { hashVersion, verdicts: { key: { theme: { engine: { verdict, hash, commit, given, ratio? } } } } }
//   storage   { key: { theme: { engine: { verdict, hash, v, at, ratio? } } } }
//
// `ratio` is the device pixel ratio the hash was read at (engine.js), kept
// only where it is not 1 (fix-34): a verdict without one was read at 1.
//
// The hash is what makes a verdict safe to act on later: a judged block stays
// hidden only while it still looks the way it did when it was judged, so a
// block that changed comes back to be judged again.
import { ENGINE } from './engine.js';
import { EARLIER_VERSIONS, HASH_VERSION } from './block-hash.js';

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

/**
 * Store one verdict of this browser, in its engine; returns the entry it replaced.
 * @param {number} [ratio] the device pixel ratio its hash was read at; 1 is not written
 */
export function storeVerdict(key, theme, verdict, hash, engine = ENGINE, ratio = 1) {
    const all = loadJudgements();
    const themes = ((all[key] ??= {})[theme] ??= {});
    const previous = themes[engine] ?? null;
    themes[engine] = { verdict, hash, v: HASH_VERSION, at: Date.now(), ...(ratio && ratio !== 1 ? { ratio } : {}) };
    saveJudgements(all);
    return previous;
}

/**
 * Carry verdicts stored under an earlier recipe over to this one (scope-95,
 * scope-96). A verdict this browser stored under version 2 or 3 (`v: 2`,
 * `v: 3`) whose hash is that version's reading of the block as it stands now,
 * at the same ratio, was given on this very block: it takes the current hash
 * and `v`, and keeps its verdict and its time. One whose block changed since
 * is left as it is, and shows "Changed since judged", as it did before.
 * Verdicts are carried over in the theme and engine a page reads, as it reads
 * them.
 * @param {{ key: string, theme: string, engine?: string, ratio?: number, earlier: Record<number, string>, hash: string }[]} readings
 *   earlier: the block's reading under each earlier version (readBlocks)
 * @returns {number} how many were carried over
 */
export function carryOver(readings, stored = loadJudgements()) {
    let moved = 0;
    for (const { key, theme, engine = ENGINE, ratio = 1, earlier, hash } of readings) {
        const local = stored[key]?.[theme]?.[engine];
        if (!local || !EARLIER_VERSIONS.includes(local.v) || local.hash !== earlier?.[local.v] || (local.ratio ?? 1) !== (ratio || 1)) continue;
        stored[key][theme][engine] = { ...local, hash, v: HASH_VERSION };
        moved += 1;
    }
    if (moved) saveJudgements(stored);
    return moved;
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
