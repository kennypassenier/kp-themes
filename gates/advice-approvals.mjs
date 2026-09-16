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
// The count follows the hash (scope-112). Kenny, 2026-09-16: an approval
// given on a block that changed afterwards is not an approval of what a
// release would ship — "anders kan een release met jouw regel toch iets
// bevatten dat jij in deze vorm nooit zag". The block hash needs a browser,
// so it is measured on its own (`node gates/verdicts.mjs snapshot`) into
// `catalogue/hashes-now.json`; this reads that file, counts a pair open when
// its reading no longer matches the verdict's hash, and says at which commit
// the readings were taken — an advice that names its own age rather than one
// that spends minutes in a browser at every run.
//
// Research demos are left out: they are Kenny's to look at, not part of the
// package a release ships.
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { knownBlocks } from './check-verdicts.mjs';
import { SNAPSHOT } from './verdicts.mjs';

/** The directories a block's look is made of: markup, registers, scripts, tokens. */
export const SOURCES = ['catalogue', 'css', 'js', 'themes'];

const root = new URL('../', import.meta.url);

/**
 * The block/theme pairs with no approval, and the counts around them.
 *
 * A block written for one theme — a theme intro, which carries
 * `data-cat-theme` — is only ever shown in that theme, so it is counted in
 * that theme alone [scope-111].
 * An approval counts for the block as it stands: where the snapshot of the
 * working tree reads a hash the approving entry was not given on, the pair is
 * open again, "changed since judged" [scope-112]. Without a snapshot, or
 * without a reading for that pair, the verdict is taken as it is.
 * @param {Map<string, { component: boolean, theme?: string }>} known every block a verdict can name
 * @param {string[]} themes the themes in their order
 * @param {any} register the parsed catalogue/verdicts.json
 * @param {any} [snapshot] the parsed catalogue/hashes-now.json
 */
export function openPairs(known, themes, register, snapshot) {
    const verdicts = register?.verdicts ?? {};
    const readings = snapshot?.readings ?? {};
    /** @type {{ key: string, theme: string, state: 'rejected' | 'never judged' | 'changed since judged' }[]} */
    const open = [];
    let approved = 0;
    for (const [key, block] of known) {
        if (!block.component) continue;
        for (const theme of block.theme ? [block.theme] : themes) {
            const engines = /** @type {Record<string, any>} */ (verdicts[key]?.[theme] ?? {});
            const approvals = Object.entries(engines).filter(([, entry]) => entry?.verdict === 'approved');
            if (approvals.length) {
                // An approval still standing: one engine where nothing was
                // measured, or where the reading is the hash it was given on.
                const stands = approvals.some(([engine, entry]) => {
                    const now = readings[key]?.[theme]?.[engine];
                    if (!now || (now.ratio ?? 1) !== (entry.ratio ?? 1)) return true;
                    return now.hash === entry.hash;
                });
                if (stands) approved += 1;
                else open.push({ key, theme, state: 'changed since judged' });
                continue;
            }
            const says = Object.values(engines).map((entry) => entry?.verdict);
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

/**
 * What the reading is worth: when it was taken, and whether a source that
 * shapes a block has moved since [scope-112].
 * @param {{ commit?: string, taken?: string } | null} snapshot
 * @param {string[]} moved the files under SOURCES that changed since that commit, working tree included
 */
export function snapshotLine(snapshot, moved) {
    if (!snapshot)
        return `no reading of the blocks as they stand — run \`node gates/verdicts.mjs snapshot\` to let the count follow the hash [scope-112]`;
    const at = `read at ${String(snapshot.commit).slice(0, 12)} (${snapshot.taken})`;
    if (!moved.length) return `${at}; nothing that shapes a block moved since, so the count is the tree as it stands`;
    return `${at}; ${moved.length} file(s) under ${SOURCES.join('/')} moved since — measure again before the count is trusted`;
}

/**
 * The files under SOURCES that changed since `commit`, the working tree
 * included.
 * @param {string} commit
 * @param {URL} at the repository
 */
function movedSince(commit, at) {
    const git = (/** @type {string[]} */ args) => execFileSync('git', args, { cwd: fileURLToPath(at), encoding: 'utf8' }).trim();
    try {
        const committed = git(['diff', '--name-only', commit, '--', ...SOURCES]);
        const uncommitted = git(['status', '--porcelain', '--', ...SOURCES]).replace(/^.{3}/gm, '');
        // The readings themselves are not a block's look.
        return [...new Set([...committed.split('\n'), ...uncommitted.split('\n')].filter(Boolean))].filter((path) => path !== SNAPSHOT);
    } catch {
        return [];
    }
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
    const file = new URL(SNAPSHOT, root);
    const snapshot = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
    const { open, approved, pairs } = openPairs(known, themes, register, snapshot);
    const counted = (/** @type {string} */ state) => open.filter((pair) => pair.state === state);
    const rejected = counted('rejected');
    const changed = counted('changed since judged');
    const never = counted('never judged');

    console.log(
        `advice · approvals [scope-107]: ${approved} of ${pairs} block/theme pairs approved; ` +
            `${open.length} still open (${rejected.length} rejected, ${changed.length} changed since judged, ${never.length} never judged)`,
    );
    console.log(`  ${snapshotLine(snapshot, snapshot ? movedSince(snapshot.commit, root) : [])}`);
    if (!open.length) {
        console.log('  nothing is waiting: every block is approved in every theme.');
        return;
    }
    for (const pair of [...rejected, ...changed, ...never].slice(0, 20)) {
        console.log(`    - ${pair.key} · ${pair.theme}: ${pair.state}`);
    }
    if (open.length > 20) console.log(`    … and ${open.length - 20} more`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
