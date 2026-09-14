// The verdict register's gate: catalogue/verdicts.json is well formed, every
// key in it is a block a review page shows, and its hashes were taken with
// the recipe the pages use now. The review notes beside it
// (catalogue/review-notes.json) name known blocks and themes and say something.
//
// Kenny, 2026-09-13, on the register: his verdicts are kept for good, and
// "dit mag nooit veranderen door een change". A change to the hash recipe
// (catalogue/block-hash.js, HASH_VERSION) would silently turn every recorded
// verdict into "changed since judged"; so the gate refuses until the register
// is rehashed — every entry measured again at the commit it was given on,
// with the new recipe (node gates/verdicts.mjs rehash).
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
 * Every block key a verdict can be given on, at a checkout: `slug--block` for
 * a component page, `research/x/demo.html#block` for a research demo.
 * @param {URL | string} [at] the checkout's root
 * @returns {Promise<Map<string, { page: string, label: string, block: string, component: boolean }>>}
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
        for (const block of blockIds(readFileSync(file, 'utf8'))) {
            const key = page.component ? `${slug}--${block}` : `${page.href}#${block}`;
            known.set(key, { page: page.href, label: page.label, block, component: Boolean(page.component) });
        }
    }
    return known;
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
        faults.push(
            `the register's hashes are version ${register.hashVersion}, catalogue/block-hash.js reads version ${hashVersion}: run node gates/verdicts.mjs rehash`,
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
                const fields = Object.keys(entry).sort();
                if (fields.join() !== ENTRY_FIELDS.join()) faults.push(`${at}: fields are ${fields.join(', ')}, expected ${ENTRY_FIELDS.join(', ')}`);
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
