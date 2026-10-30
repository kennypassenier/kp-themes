// The `carry` command: re-measure every entry on the working tree and keep its verdict.

import { hashVersion, knownBlocks, REGISTER, unapprovedPairs } from '../check-verdicts.mjs';
import { ROOT, git, registerPath } from './paths.mjs';
import { ratioOf, readRegister, today, writeRegister } from './register.mjs';
import { hashAt } from './hash-at.mjs';

/**
 * Carry every approval across a change to the hash recipe [fix-62].
 *
 * Kenny, 2026-09-19, after the bump from version 5 to 6 sent all 3089 pairs
 * back to him at once: "vanaf nu kan de hash enkel nog veranderd worden als
 * alle componenten goedgekeurd zijn, als de hash dan verandert keur je zelf
 * alles goed". So this refuses while any pair is unapproved — that is the
 * half `gates/check-verdicts.mjs` also refuses on — and otherwise measures
 * every entry on the working tree with the recipe as it stands now, keeps
 * the verdict it was given, and writes the new hash.
 *
 * It is not `rehash`: rehash replays each entry at the commit it was given
 * on, which a recipe that reads something the old checkouts lack cannot do
 * (version 6 reads catalogue/code-version.json's selectors map, and the
 * commits the register was anchored at carry the version-5 shape or no such
 * file at all). This measures the blocks as they are, which is what Kenny
 * approved when he last looked at them.
 * @param {string[]} args
 */
export async function carry(args) {
    const started = performance.now();
    const option = (/** @type {string} */ name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
    const width = Number(option('--width') ?? 1920);
    const file = option('--register') ?? registerPath;
    const register = readRegister(file);
    const known = await knownBlocks();
    const { THEMES } = await import('../../js/theme-registry.js');
    const open = unapprovedPairs(
        register,
        known,
        THEMES.map((t) => t.name),
    );
    if (open.length) {
        console.error(
            `${open.length} pair(s) are not approved, so the recipe may not move yet [fix-62]:\n  ` +
                open
                    .slice(0, 20)
                    .map((pair) => `${pair.key} · ${pair.theme} (${pair.state})`)
                    .join('\n  ') +
                (open.length > 20 ? `\n  … and ${open.length - 20} more` : '') +
                '\nLet Kenny judge those first; then this carries every approval onto the new recipe.',
        );
        process.exit(1);
    }
    const commit = git('rev-parse', 'HEAD');
    const given = today();
    // One browser per engine and ratio, as everywhere else [fix-34].
    /** @type {Map<string, { engine: string, ratio: number, requests: { key: string, theme: string }[] }>} */
    const groups = new Map();
    for (const [key, byTheme] of Object.entries(register.verdicts))
        for (const [theme, byEngine] of Object.entries(byTheme))
            for (const [engine, entry] of Object.entries(byEngine)) {
                const id = `${engine}|${ratioOf(entry)}`;
                const group = groups.get(id) ?? { engine, ratio: ratioOf(entry), requests: [] };
                group.requests.push({ key, theme });
                groups.set(id, group);
            }
    let carried = 0;
    let unchanged = 0;
    for (const { engine, ratio, requests } of groups.values()) {
        console.log(`the working tree in ${engine} at ratio ${ratio}: ${requests.length} entr${requests.length === 1 ? 'y' : 'ies'}…`);
        const read = await hashAt({ root: ROOT, engine, requests, width, ratio });
        for (const { key, theme } of requests) {
            const reading = read.get(`${key}|${theme}`);
            if (!reading) throw new Error(`${key} in ${theme}: no reading`);
            const entry = register.verdicts[key][theme][engine];
            if (entry.hash === reading.hash) {
                unchanged += 1;
                continue;
            }
            entry.hash = reading.hash;
            entry.commit = commit;
            entry.given = given;
            carried += 1;
        }
    }
    register.hashVersion = hashVersion();
    writeRegister(register, file);
    console.log(
        `${REGISTER}: ${carried} approval(s) carried onto hash version ${hashVersion()}, ${unchanged} already on it — ` +
            `${((performance.now() - started) / 1000).toFixed(1)} s.`,
    );
    console.log(
        `Whether the test browser reads the same hashes [fix-28]: node gates/verdicts.mjs compare --against-browser --commit ${commit.slice(0, 12)}`,
    );
}

/* ----------------------------------------------------------------- compare */
