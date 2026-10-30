// The `compare` commands: do a reviewer's browser (or Playwright's) read the recorded hashes.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { knownBlocks } from '../check-verdicts.mjs';
import { ROOT, git, registerPath } from './paths.mjs';
import { ratioOf, readRegister } from './register.mjs';
import { hashAt } from './hash-at.mjs';
/** @typedef {import('./types.mjs').Entry} Entry */
/** @typedef {import('./types.mjs').Register} Register */

/**
 * Does a reviewer's own browser read the hashes the tools read? Every block
 * of every review page, in the themes asked for, in that browser and in
 * Playwright's browser of the same engine; one line per theme, and the first
 * difference of each block that parts. A Gecko browser is driven over
 * WebDriver BiDi (Playwright cannot drive FireDragon), a Blink one by
 * Playwright with its executable. How the recipe was made engine-proof on
 * 2026-09-13 started with this comparison.
 * @param {string[]} args
 */
export async function compare(args) {
    const option = (/** @type {string} */ name, /** @type {string} */ fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
    const executable = option('--browser', '');
    if (!executable) throw new Error('compare needs --browser <path to the executable>');
    const engine = option('--engine', /chrom|edge|brave/i.test(executable) ? 'chromium' : 'firefox');
    const width = Number(option('--width', '1920'));
    const height = Number(option('--height', '1000'));
    const themes = option('--themes', 'formal,cyberpunk,nostromo,brutalism').split(',');
    const { serve, blockPages, measurePlaywright, BidiGecko, firstDifference } = await import('../verdict-hashes.mjs');
    const playwright = await import('@playwright/test');
    const PROPS = [...readFileSync(join(ROOT, 'catalogue/block-hash.js'), 'utf8').matchAll(/^ {4}'([a-z-]+)',$/gm)].map((m) => m[1]);
    const server = await serve(ROOT);
    const reference = await (engine === 'chromium' ? playwright.chromium : playwright.firefox).launch({ headless: true });
    const gecko = engine === 'firefox' ? await BidiGecko.launch(executable) : null;
    const blink = engine === 'chromium' ? await playwright.chromium.launch({ headless: true, executablePath: executable }) : null;
    try {
        const referencePage = await (await reference.newContext({ viewport: { width, height } })).newPage();
        const ownPage = blink ? await (await blink.newContext({ viewport: { width, height } })).newPage() : null;
        console.log(
            `${gecko?.version ?? `${executable} ${blink?.version()}`} against Playwright's ${engine} ${reference.version()}, ${width}×${height}`,
        );
        /** @type {Record<string, { readings: number, differ: string[] }>} */
        const tally = Object.fromEntries(themes.map((theme) => [theme, { readings: 0, differ: [] }]));
        for (const { href } of await blockPages(ROOT)) {
            const measure = { base: server.base, href, themes, width, height, withLines: true };
            const mine = gecko
                ? await gecko.measure(measure)
                : await measurePlaywright(/** @type {import('@playwright/test').Page} */ (ownPage), measure);
            const theirs = await measurePlaywright(referencePage, measure);
            for (const theme of themes) {
                mine.results[theme].forEach((row, i) => {
                    const other = theirs.results[theme][i];
                    tally[theme].readings += 1;
                    if (row.hash !== other.hash)
                        tally[theme].differ.push(`${row.key}: ${firstDifference(row.lines ?? [], other.lines ?? [], PROPS)}`);
                });
            }
        }
        for (const [theme, { readings, differ }] of Object.entries(tally)) {
            console.log(`${theme}: ${differ.length} of ${readings} block(s) differ`);
            for (const line of differ.slice(0, 10)) console.log(`  ${line}`);
        }
    } finally {
        await gecko?.close();
        await blink?.close();
        await reference.close();
        await server.close();
    }
}

/* ------------------------------------------ recorded against the test browser */

/**
 * The register's entries recorded at one commit (a prefix of its id), or all
 * of them when `commit` is null, as requests for hashAt.
 * @param {Register} register
 * @param {string | null} commit
 * @returns {{ key: string, theme: string, engine: string, entry: Entry }[]}
 */
export function entriesAt(register, commit) {
    const out = [];
    for (const [key, themes] of Object.entries(register.verdicts))
        for (const [theme, engines] of Object.entries(themes))
            for (const [engine, entry] of Object.entries(engines))
                if (commit === null || entry.commit.startsWith(commit) || commit.startsWith(entry.commit)) out.push({ key, theme, engine, entry });
    return out;
}

/**
 * Which recorded hashes the test browser read too.
 * @param {{ key: string, theme: string, engine: string, entry: Entry }[]} entries
 * @param {Map<string, { hash: string }>} readings `key|theme|engine` -> the test browser's reading, at the entry's ratio
 * @param {Set<string> | Map<string, unknown>} known the blocks the review pages show now
 * @returns {{ equal: string[], differ: string[], gone: string[] }}
 */
export function againstReadings(entries, readings, known) {
    /** @type {{ equal: string[], differ: string[], gone: string[] }} */
    const out = { equal: [], differ: [], gone: [] };
    for (const { key, theme, engine, entry } of entries) {
        const at = `${key} · ${theme} · ${engine} · ${entry.verdict}${ratioOf(entry) === 1 ? '' : ` · @${ratioOf(entry)}`}`;
        const reading = readings.get(`${key}|${theme}|${engine}`);
        if (!known.has(key) || !reading) out.gone.push(at);
        else if (reading.hash === entry.hash) out.equal.push(at);
        else out.differ.push(`${at} (recorded ${entry.hash.slice(0, 12)}…, the test browser reads ${reading.hash.slice(0, 12)}…)`);
    }
    return out;
}

/**
 * `compare --against-browser` [fix-28, scope-83]: every entry recorded at a
 * commit (default HEAD; `--all` for the whole register), hashed again in
 * Playwright's browser of the engine it was given in, on the working tree as
 * it stands. An entry whose hash the test browser does not read was judged
 * on something the tools do not see — a desktop font on an unset control was
 * the cause of 39 of 158 on 2026-09-14. Blocks changed since that commit
 * differ for that reason too, so it is meant to run straight after `record`.
 * @param {string[]} args
 */
export async function compareAgainstBrowser(args) {
    const started = performance.now();
    const option = (/** @type {string} */ name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
    const head = git('rev-parse', 'HEAD');
    const commit = args.includes('--all') ? null : (option('--commit') ?? head);
    const width = Number(option('--width') ?? 1920);
    // --at-recorded: each entry at the commit it was recorded on (a temporary
    // worktree), which separates "the browser read it differently" from
    // "the block changed since".
    const atRecorded = args.includes('--at-recorded');
    // --register <file>: another register than catalogue/verdicts.json (a copy to try a change on).
    const entries = entriesAt(readRegister(option('--register') ?? registerPath), commit);
    const known = await knownBlocks(ROOT);
    /** @type {Map<string, { hash: string }>} */
    const readings = new Map();
    const engines = [...new Set(entries.map((e) => e.engine))];
    const commits = atRecorded ? [...new Set(entries.map((e) => e.entry.commit))] : [null];
    // One browser per ratio: each entry is read at the ratio it was read at [fix-34].
    const ratios = [...new Set(entries.map((e) => ratioOf(e.entry)))].sort((a, b) => a - b);
    for (const engine of engines) {
        for (const at of commits) {
            for (const ratio of ratios) {
                const requests = entries
                    .filter((e) => e.engine === engine && ratioOf(e.entry) === ratio && (at === null ? known.has(e.key) : e.entry.commit === at))
                    .map(({ key, theme }) => ({ key, theme }));
                if (!requests.length) continue;
                const read = await hashAt(
                    at === null ? { root: ROOT, engine, requests, width, ratio } : { commit: at, engine, requests, width, ratio },
                );
                // Only what was asked: a page reads every asked block in every asked theme,
                // and a block asked in another theme at another ratio must keep its own reading.
                for (const { key, theme } of requests) {
                    const reading = read.get(`${key}|${theme}`);
                    if (reading) readings.set(`${key}|${theme}|${engine}`, reading);
                }
            }
        }
    }
    const result = againstReadings(entries, readings, atRecorded ? new Set(entries.map((e) => e.key)) : known);
    const dirty = git('status', '--porcelain').length > 0;
    console.log(
        `${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} recorded ${commit === null ? 'in the register' : `at ${commit.slice(0, 12)}`}, ` +
            `hashed in Playwright's ${engines.join(' and ') || 'browser'} at ratio ${ratios.join(', ') || 1} ${atRecorded ? 'at the commit each was recorded on' : `on the working tree at ${head.slice(0, 12)}${dirty ? ' (with uncommitted changes)' : ''}`}:`,
    );
    for (const line of result.differ) console.log(`  differs: ${line}`);
    for (const line of result.gone) console.log(`  no longer a block: ${line}`);
    console.log(
        `${result.equal.length} equal, ${result.differ.length} differ, ${result.gone.length} gone — ${((performance.now() - started) / 1000).toFixed(1)} s.`,
    );
}

/* ---------------------------------------------------------- annotate-ratio */
