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


import { REGISTER, VERDICTS, root } from './verdicts-shared.mjs';

import { NOTES, notesFaults, registerFaults } from './verdicts-faults.mjs';


export { registerFaults, NOTES, NOTE_FIELDS, notesFaults, ratioFault, pairsOf, approvedEntries, unapprovedPairs } from './verdicts-faults.mjs';
export { REGISTER, VERDICTS } from './verdicts-shared.mjs';



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
