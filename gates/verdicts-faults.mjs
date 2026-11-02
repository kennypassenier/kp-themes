// The faults a verdict register and its review notes can have (gates/check-verdicts.mjs): every entry's fields, hashes, commits and blocks checked against what is known.
import { ENTRY_FIELDS, VERDICTS } from './verdicts-shared.mjs';


/**
 * Everything wrong with a register, one line each.
 * @param {any} register the verdict register (the review database, gates/db/)
 * @param {{ hashVersion: number, known: Set<string> | Map<string, unknown>, themes: string[], commitExists?: (sha: string) => boolean }} context
 * @returns {string[]}
 */
export function registerFaults(register, { hashVersion, known, themes, commitExists }) {
    const faults = [];
    if (!register || typeof register !== 'object' || Array.isArray(register)) return ['the register is not a JSON object'];
    const extra = Object.keys(register).filter((k) => k !== 'hashVersion' && k !== 'verdicts');
    if (extra.length) faults.push(`unknown top-level field(s): ${extra.join(', ')}`);
    if (!Number.isInteger(register.hashVersion)) faults.push('hashVersion is missing or not an integer');
    else if (register.hashVersion !== hashVersion) {
        // Kenny's rule [fix-62]: the recipe may only move while every pair is
        // approved, and then the approvals are carried across, not asked for
        // again. Naming what is still open is the difference between a gate
        // that blocks and a gate that says what to do.
        const open =
            known instanceof Map ? unapprovedPairs(register, /** @type {Map<string, { component: boolean, theme?: string }>} */ (known), themes) : [];
        faults.push(
            `the register's hashes are version ${register.hashVersion}, catalogue/block-hash.js reads version ${hashVersion}` +
                (open.length
                    ? `: ${open.length} pair(s) are not approved, so the recipe may not move yet [fix-62] — ` +
                      `${open
                          .slice(0, 5)
                          .map((pair) => `${pair.key} · ${pair.theme} (${pair.state})`)
                          .join('; ')}${open.length > 5 ? `; and ${open.length - 5} more` : ''}`
                    : ': every pair is approved, so run node gates/verdicts.mjs carry to carry those approvals onto the new recipe'),
        );
    }
    const verdicts = register.verdicts;
    if (!verdicts || typeof verdicts !== 'object' || Array.isArray(verdicts)) return [...faults, 'verdicts is missing or not an object'];
    for (const [key, byTheme] of Object.entries(verdicts)) {
        if (!known.has(key)) faults.push(`${key}: not a block any review page shows`);
        if (!byTheme || typeof byTheme !== 'object' || Array.isArray(byTheme)) {
            faults.push(`${key}: not an object of themes`);
            continue;
        }
        for (const [theme, byEngine] of Object.entries(byTheme)) {
            if (!themes.includes(theme)) faults.push(`${key} · ${theme}: not a theme`);
            if (!byEngine || typeof byEngine !== 'object' || Array.isArray(byEngine)) {
                faults.push(`${key} · ${theme}: not an object of engines`);
                continue;
            }
            for (const [engine, entry] of Object.entries(byEngine)) {
                const at = `${key} · ${theme} · ${engine}`;
                if (!/^[a-z0-9]+$/.test(engine)) faults.push(`${at}: an engine name is lower-case letters and digits`);
                if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
                    faults.push(`${at}: not an entry object`);
                    continue;
                }
                const fields = Object.keys(entry)
                    .filter((field) => field !== 'ratio')
                    .sort();
                if (fields.join() !== ENTRY_FIELDS.join())
                    faults.push(`${at}: fields are ${fields.join(', ')}, expected ${ENTRY_FIELDS.join(', ')} and an optional ratio`);
                if ('ratio' in entry) {
                    const wrong = ratioFault(entry.ratio);
                    if (wrong) faults.push(`${at}: ${wrong}`);
                }
                if (!VERDICTS.includes(entry.verdict)) faults.push(`${at}: verdict ${JSON.stringify(entry.verdict)} is not approved or rejected`);
                if (!/^[0-9a-f]{64}$/.test(String(entry.hash))) faults.push(`${at}: hash is not a full SHA-256`);
                if (!/^[0-9a-f]{7,40}$/.test(String(entry.commit))) faults.push(`${at}: commit is not a commit id`);
                else if (commitExists && !commitExists(entry.commit)) faults.push(`${at}: commit ${entry.commit} is not in this repository`);
                if (!/^\d{4}-\d{2}-\d{2}$/.test(String(entry.given)) || Number.isNaN(Date.parse(entry.given)))
                    faults.push(`${at}: given is not a YYYY-MM-DD date`);
            }
        }
    }
    return faults;
}

/**
 * The review notes: while a block is rejected in a theme, what Kenny's note
 * said and what Claude changed to answer it (Kenny, 2026-09-14: a temporary
 * text, gone once he approves, so the blocks' own explanations do not fill
 * up with addendums). Kept apart from the block's markup, so writing one
 * sends no other theme back to review.
 *
 *   { "<block key>": { "<theme>": { rejected, change, commit?, given } } }
 */
/** How messages name the notes: the `review_notes` table of the review database (gates/db/). */
export const NOTES = 'the review notes (data/kp-themes.sqlite)';
export const NOTE_FIELDS = ['change', 'commit', 'given', 'rejected'];

/**
 * Everything wrong with the review notes, one line each.
 * @param {any} notes the review notes (the review database, gates/db/)
 * @param {{ known: Set<string> | Map<string, unknown>, themes: string[] }} context
 * @returns {string[]}
 */
export function notesFaults(notes, { known, themes }) {
    const faults = [];
    const isObject = (/** @type {unknown} */ value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
    if (!isObject(notes)) return ['the review notes are not a JSON object'];
    for (const [key, byTheme] of Object.entries(notes)) {
        if (!known.has(key)) faults.push(`${key}: not a block any review page shows`);
        if (!isObject(byTheme)) {
            faults.push(`${key}: not an object of themes`);
            continue;
        }
        if (!Object.keys(byTheme).length) faults.push(`${key}: no theme holds a note; remove the block`);
        for (const [theme, note] of Object.entries(byTheme)) {
            const at = `${key} · ${theme}`;
            if (!themes.includes(theme)) faults.push(`${at}: not a theme`);
            if (!isObject(note)) {
                faults.push(`${at}: not a note object`);
                continue;
            }
            const extra = Object.keys(note).filter((field) => !NOTE_FIELDS.includes(field));
            if (extra.length) faults.push(`${at}: unknown field(s) ${extra.join(', ')}`);
            for (const field of ['rejected', 'change']) {
                if (typeof note[field] !== 'string' || !note[field].trim()) faults.push(`${at}: ${field} is missing or empty`);
            }
            if ('commit' in note && !/^[0-9a-f]{7,40}$/.test(String(note.commit))) faults.push(`${at}: commit is not a commit id`);
            if (!/^\d{4}-\d{2}-\d{2}$/.test(String(note.given)) || Number.isNaN(Date.parse(note.given)))
                faults.push(`${at}: given is not a YYYY-MM-DD date`);
        }
    }
    return faults;
}

/**
 * An entry's optional `ratio`: the device pixel ratio its hash was read at
 * (fix-34), a number above 0 and at most 10, to three decimals, never 1 (an
 * entry without one was read at 1). Null when it is one.
 * @param {unknown} ratio
 * @returns {string | null} what is wrong with it
 */
export function ratioFault(ratio) {
    if (typeof ratio !== 'number' || !Number.isFinite(ratio) || ratio <= 0 || ratio > 10) return 'ratio is not a number above 0 and at most 10';
    if (ratio === 1) return 'ratio 1 is not written (an entry without a ratio was read at 1)';
    if (Math.round(ratio * 1000) / 1000 !== ratio) return 'ratio has more than three decimals';
    return null;
}

/**
 * Every block/theme pair a verdict can be given on: the component blocks,
 * each in every theme, except a block written for one theme (a theme intro)
 * which exists only there.
 * @param {Map<string, { component: boolean, theme?: string }>} known
 * @param {string[]} themes
 * @returns {{ key: string, theme: string }[]}
 */
export function pairsOf(known, themes) {
    /** @type {{ key: string, theme: string }[]} */
    const pairs = [];
    for (const [key, block] of known) {
        if (!block.component) continue;
        for (const theme of block.theme ? [block.theme] : themes) pairs.push({ key, theme });
    }
    return pairs;
}

/**
 * The engines in which a pair is approved. One approval is enough: a block
 * Kenny approved in Firefox is approved, whatever a second engine reads.
 * @param {Record<string, any>} engines the register's entries for one pair
 * @returns {[string, any][]}
 */
export function approvedEntries(engines) {
    return Object.entries(engines ?? {}).filter(([, entry]) => entry?.verdict === 'approved');
}

/**
 * The pairs that carry no approval in the register itself — rejected, or
 * never judged. It says nothing about whether a block has changed since:
 * that needs a browser and lives in gates/advice-approvals.mjs. This is the
 * half a gate can read, and the half Kenny's rule is about [fix-62].
 * @param {any} register the verdict register (the review database, gates/db/)
 * @param {Map<string, { component: boolean, theme?: string }>} known
 * @param {string[]} themes
 * @returns {{ key: string, theme: string, state: 'rejected' | 'never judged' }[]}
 */
export function unapprovedPairs(register, known, themes) {
    const verdicts = register?.verdicts ?? {};
    /** @type {{ key: string, theme: string, state: 'rejected' | 'never judged' }[]} */
    const out = [];
    for (const { key, theme } of pairsOf(known, themes)) {
        const engines = verdicts[key]?.[theme] ?? {};
        if (approvedEntries(engines).length) continue;
        const says = Object.values(engines).map((entry) => entry?.verdict);
        out.push({ key, theme, state: says.includes('rejected') ? 'rejected' : 'never judged' });
    }
    return out;
}
