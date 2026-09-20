// The verdict register's gate: catalogue/verdicts.json is well formed, every
// key in it is a block a review page shows, and its hashes were taken with
// the recipe the pages use now. The review notes beside it
// (catalogue/review-notes.json) name known blocks and themes and say something.
//
// Kenny, 2026-09-13, on the register: his verdicts are kept for good, and
// "dit mag nooit veranderen door een change". A change to the hash recipe
// (catalogue/block-hash.js, HASH_VERSION) turns every recorded verdict into
// "changed since judged", because version 6 hashes a different set of lines
// than version 5 did; so the gate refuses while the two disagree.
//
// What gets it green is Kenny's rule of 2026-09-19 [fix-62], after all 3089
// pairs came back as changed at once and he had to judge the whole catalogue
// again: "vanaf nu kan de hash enkel nog veranderd worden als alle
// componenten goedgekeurd zijn, als de hash dan verandert keur je zelf alles
// goed". So a version bump is refused while any pair is unapproved, and once
// every pair is approved, `node gates/verdicts.mjs carry` measures them all
// again on the new recipe and keeps each verdict — Claude carries Kenny's
// approval across the bump instead of asking for it twice.
//
// `rehash` stays for the bumps it can replay: it measures each entry at the
// commit it was given on, which only works while the new recipe reads
// nothing the old checkouts lack.
//
// No browser: the block keys come from the pages' markup as written.
//
// Run: node gates/check-verdicts.mjs
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
export const REGISTER = 'catalogue/verdicts.json';
export const VERDICTS = ['approved', 'rejected'];
const ENTRY_FIELDS = ['commit', 'given', 'hash', 'verdict'];

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
 * The blocks one page carries, the way catalogue.js finds them: every
 * `.cat-block[id]`, or on a page without one, every `section[id]` inside `<main>`.
 * @param {string} html
 * @returns {string[]} the block ids, in document order
 */
export function blockIds(html) {
    const text = html.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<(script|style|template)\b[\s\S]*?<\/\1>/gi, ' ');
    const blocks = [];
    const sections = [];
    let inMain = 0;
    for (const match of text.matchAll(/<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g)) {
        const [, closing, rawName, attributes] = match;
        const name = rawName.toLowerCase();
        if (name === 'main') inMain += closing ? -1 : 1;
        if (closing) continue;
        const value = (/** @type {string} */ attribute) => {
            const m = new RegExp(`(?:^|\\s)${attribute}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i').exec(attributes);
            return m ? (m[2] ?? m[3] ?? m[4] ?? '') : null;
        };
        const id = value('id');
        if (!id) continue;
        if ((value('class') ?? '').split(/\s+/).includes('cat-block')) blocks.push(id);
        if (name === 'section' && inMain > 0) sections.push(id);
    }
    return blocks.length ? blocks : sections;
}

/**
 * The theme a block is written for, when it is written for one: the
 * `data-cat-theme` on its own section [scope-111].
 * @param {string} html the page's source
 * @returns {Map<string, string>} block id → theme
 */
export function fixedThemes(html) {
    const fixed = new Map();
    for (const match of html.matchAll(/<section\b([^>]*)>/g)) {
        const attributes = match[1];
        const id = /(?:^|\s)id\s*=\s*"([^"]*)"/.exec(attributes)?.[1];
        const theme = /(?:^|\s)data-cat-theme\s*=\s*"([^"]*)"/.exec(attributes)?.[1];
        if (id && theme) fixed.set(id, theme);
    }
    return fixed;
}

/**
 * Every block key a verdict can be given on, at a checkout: `slug--block` for
 * a component page, `research/x/demo.html#block` for a research demo.
 * @param {URL | string} [at] the checkout's root
 * @returns {Promise<Map<string, { page: string, label: string, block: string, component: boolean, theme?: string }>>}
 */
export async function knownBlocks(at = root) {
    const base = typeof at === 'string' ? new URL(`file://${at.replace(/\/?$/, '/')}`) : at;
    /** @type {{ PAGES: { pages: { href: string, label: string, component?: boolean }[] }[] }} */
    const { PAGES } = await import(`${new URL('catalogue/pages.js', base).href}?at=${Date.now()}`);
    const known = new Map();
    for (const page of PAGES.flatMap((group) => group.pages)) {
        if (!page.component && !page.href.startsWith('research/')) continue;
        const file = new URL(page.href, base);
        if (!existsSync(file)) continue;
        const slug = (page.href.split('/').pop() ?? '').replace(/\.html$/, '');
        const html = readFileSync(file, 'utf8');
        const fixed = fixedThemes(html);
        for (const block of blockIds(html)) {
            const key = page.component ? `${slug}--${block}` : `${page.href}#${block}`;
            // A theme intro exists in one theme only [scope-111]; it is read
            // here so that no caller has to remember to add it, which is what
            // the first draft of the fix-62 gate forgot and reported 84 theme
            // intros as never judged.
            const theme = fixed.get(block);
            known.set(key, { page: page.href, label: page.label, block, component: Boolean(page.component), ...(theme ? { theme } : {}) });
        }
    }
    return known;
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
 * @param {any} register the parsed catalogue/verdicts.json
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

/**
 * Everything wrong with a register, one line each.
 * @param {any} register the parsed catalogue/verdicts.json
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
export const NOTES = 'catalogue/review-notes.json';
export const NOTE_FIELDS = ['change', 'commit', 'given', 'rejected'];

/**
 * Everything wrong with the review notes, one line each.
 * @param {any} notes the parsed catalogue/review-notes.json
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

/** Whether a commit is in the repository at `root`, asked once per id. */
export function commitChecker(at = fileURLToPath(root)) {
    /** @type {Map<string, boolean>} */
    const seen = new Map();
    return (/** @type {string} */ sha) => {
        if (!seen.has(sha)) {
            try {
                execFileSync('git', ['cat-file', '-e', `${sha}^{commit}`], { cwd: at, stdio: 'ignore' });
                seen.set(sha, true);
            } catch {
                seen.set(sha, false);
            }
        }
        return Boolean(seen.get(sha));
    };
}

/**
 * The recipe version catalogue/block-hash.js declares, read from its text: the
 * module is browser code, and the gate stays out of the browser.
 * @param {URL} [at] the checkout's root
 */
export function hashVersion(at = root) {
    const match = /export const HASH_VERSION = (\d+);/.exec(readFileSync(new URL('catalogue/block-hash.js', at), 'utf8'));
    if (!match) throw new Error('catalogue/block-hash.js declares no HASH_VERSION');
    return Number(match[1]);
}

async function main() {
    const HASH_VERSION = hashVersion();
    const { THEMES } = await import('../js/theme-registry.js');
    let register;
    try {
        register = JSON.parse(readFileSync(new URL(REGISTER, root), 'utf8'));
    } catch (error) {
        console.error(`${REGISTER} cannot be read as JSON: ${error instanceof Error ? error.message : error}`);
        process.exit(1);
    }
    const known = await knownBlocks();
    const themes = THEMES.map((t) => t.name);
    const faults = registerFaults(register, {
        hashVersion: HASH_VERSION,
        known,
        themes,
        commitExists: commitChecker(),
    });
    if (faults.length) {
        console.error(`${faults.length} fault(s) in ${REGISTER}:\n  ${faults.join('\n  ')}`);
        process.exit(1);
    }
    let notes = {};
    if (existsSync(new URL(NOTES, root))) {
        try {
            notes = JSON.parse(readFileSync(new URL(NOTES, root), 'utf8'));
        } catch (error) {
            console.error(`${NOTES} cannot be read as JSON: ${error instanceof Error ? error.message : error}`);
            process.exit(1);
        }
    }
    const noteFaults = notesFaults(notes, { known, themes });
    if (noteFaults.length) {
        console.error(`${noteFaults.length} fault(s) in ${NOTES}:\n  ${noteFaults.join('\n  ')}`);
        process.exit(1);
    }
    let count = 0;
    for (const byTheme of Object.values(register.verdicts)) for (const engines of Object.values(byTheme)) count += Object.keys(engines).length;
    let noteCount = 0;
    for (const byTheme of Object.values(notes)) noteCount += Object.keys(byTheme).length;
    console.log(
        `verdicts: ${count} recorded verdict(s) at hash version ${HASH_VERSION}, ${noteCount} review note(s), every key one of ${known.size} known block(s).`,
    );
}

if (import.meta.url === `file://${process.argv[1]}`) main();
