// Advice, never a gate: what is still waiting for Kenny's approval
// [scope-107, scope-109].
//
// Kenny, 2026-09-16: "we releasen pas als elk element approved is. Dit is een
// vaste regel vanaf nu". A release therefore needs one number nobody had: how
// many block/theme pairs carry no approval. This prints it, names the first
// twenty, and always exits 0 — the work that earns an approval must be able to
// commit.
//
// A pair counts as approved when `catalogue/verdicts.json` holds a verdict
// `approved` for that block in that theme, in any engine. A pair is open when
// the verdict is `rejected`, or when there is no verdict at all: a block Kenny
// has never seen in that theme is as unreleasable as one he turned down.
//
// Research demos are left out: they are Kenny's to look at, not part of the
// package a release ships.
import { readFileSync } from 'node:fs';
import process from 'node:process';
import { knownBlocks } from './check-verdicts.mjs';

const root = new URL('../', import.meta.url);

/**
 * The block/theme pairs with no approval, and the counts around them.
 *
 * A block written for one theme — a theme intro, which carries
 * `data-cat-theme` — is only ever shown in that theme, so it is counted in
 * that theme alone [scope-111].
 * @param {Map<string, { component: boolean, theme?: string }>} known every block a verdict can name
 * @param {string[]} themes the themes in their order
 * @param {any} register the parsed catalogue/verdicts.json
 */
export function openPairs(known, themes, register) {
    const verdicts = register?.verdicts ?? {};
    /** @type {{ key: string, theme: string, state: 'rejected' | 'never judged' }[]} */
    const open = [];
    let approved = 0;
    for (const [key, block] of known) {
        if (!block.component) continue;
        for (const theme of block.theme ? [block.theme] : themes) {
            const engines = verdicts[key]?.[theme] ?? {};
            const says = Object.values(engines).map((entry) => /** @type {any} */ (entry)?.verdict);
            if (says.includes('approved')) {
                approved += 1;
                continue;
            }
            open.push({ key, theme, state: says.includes('rejected') ? 'rejected' : 'never judged' });
        }
    }
    return { open, approved, pairs: approved + open.length };
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

async function main() {
    const known = await knownBlocks();
    for (const [key, block] of known) {
        if (!block.component) continue;
        const html = readFileSync(new URL(block.page, root), 'utf8');
        const theme = fixedThemes(html).get(block.block);
        if (theme) Object.assign(block, { theme });
    }
    const themes = /** @type {string[]} */ (JSON.parse(readFileSync(new URL('themes/order.json', root), 'utf8')));
    const register = JSON.parse(readFileSync(new URL('catalogue/verdicts.json', root), 'utf8'));
    const { open, approved, pairs } = openPairs(known, themes, register);
    const rejected = open.filter((pair) => pair.state === 'rejected');

    console.log(
        `advice · approvals [scope-107]: ${approved} of ${pairs} block/theme pairs approved; ` +
            `${open.length} still open (${rejected.length} rejected, ${open.length - rejected.length} never judged)`,
    );
    if (!open.length) {
        console.log('  nothing is waiting: every block is approved in every theme.');
        return;
    }
    for (const pair of [...rejected, ...open.filter((p) => p.state !== 'rejected')].slice(0, 20)) {
        console.log(`    - ${pair.key} · ${pair.theme}: ${pair.state}`);
    }
    if (open.length > 20) console.log(`    … and ${open.length - 20} more`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
