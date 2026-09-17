// While Kenny is judging, the blocks do not move [fix-46].
//
// The review site is redeployed by every push to round-six
// (.github/workflows/pages.yml), so a commit Claude makes while a round is
// open swaps the blocks under the reviewer. Measured on 2026-09-16: he
// approved the 27 titanium blocks at 06:00, four commits landed, and the same
// 27 came back "Changed since judged" at 07:05 — `button--groups · titanium`
// read 09fb3a33… in his first round and c4f65fa3… in the second, while the
// tools read c4f65fa3… at both commits. Nothing was wrong with the block: the
// ground moved. His words: "ik heb het gevoel dat ik nog altijd in cirkels
// blijf goedkeuren".
//
// So a round is opened when Claude asks him to look and closed when he is
// through. While it is open this gate refuses a commit that changes what a
// block looks like — `css/`, `js/`, `components/`, `catalogue/*.html` — and
// lets everything else through: the register, the notes, the documents, the
// gates themselves.
//
//   node gates/check-round.mjs            the gate (in npm run gates)
//   node gates/check-round.mjs --open     open a round at HEAD
//   node gates/check-round.mjs --close    close it
//
// The round is `catalogue/round.json`.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const root = new URL('../', import.meta.url);
export const ROUND = 'catalogue/round.json';

/** Whether a path is one a block's look comes from [fix-46]. @param {string} path */
export const movesABlock = (path) =>
    /^(css|js|components)\//.test(path) || (/^catalogue\//.test(path) && path.endsWith('.html')) || /^themes\/[^/]+\/tokens\.json$/.test(path);

/**
 * What the gate says about a set of changed paths while a round is open.
 * @param {{ open?: boolean, commit?: string, opened?: string } | null} round
 * @param {string[]} paths the files this commit changes
 * @returns {string[]} the paths it refuses; empty when the commit may pass
 */
export function refusedByRound(round, paths) {
    if (!round?.open) return [];
    return paths.filter(movesABlock).sort();
}

const file = new URL(ROUND, root);
const git = (/** @type {string[]} */ args) => execFileSync('git', args, { cwd: fileURLToPath(root), encoding: 'utf8' }).trim();
const readRound = () => (existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null);

function main() {
    const [flag] = process.argv.slice(2);
    if (flag === '--open' || flag === '--close') {
        const open = flag === '--open';
        writeFileSync(
            file,
            `${JSON.stringify(
                {
                    $comment:
                        'The review round Kenny is in [fix-46]. While it is open, npm run gates refuses a commit that changes what a block ' +
                        'looks like, so the review site does not move under him. Opened when Claude asks him to look, closed when he is through: ' +
                        'node gates/check-round.mjs --open | --close.',
                    open,
                    commit: git(['rev-parse', 'HEAD']),
                    opened: new Date().toISOString().slice(0, 10),
                },
                null,
                4,
            )}\n`,
        );
        console.log(`${ROUND}: the round is ${open ? 'open — blocks stay as they are until it closes' : 'closed'}.`);
        return;
    }
    const round = readRound();
    if (!round?.open) {
        console.log(`round: no review round is open; a change to a block may commit.`);
        return;
    }
    const staged = git(['diff', '--cached', '--name-only']).split('\n').filter(Boolean);
    const unstaged = git(['diff', '--name-only']).split('\n').filter(Boolean);
    const refused = refusedByRound(round, [...new Set([...staged, ...unstaged])]);
    if (!refused.length) {
        console.log(`round: open since ${round.opened} at ${String(round.commit).slice(0, 12)}; this change moves no block.`);
        return;
    }
    console.error(
        `${refused.length} file(s) change what a block looks like while Kenny's review round is open [fix-46]:\n  ` +
            `${refused.join('\n  ')}\n` +
            `The review site is redeployed by every push, so this would swap the blocks under him mid-round.\n` +
            `Close the round first: node gates/check-round.mjs --close`,
    );
    process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
