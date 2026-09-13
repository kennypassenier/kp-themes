// The verdict register's tools (Kenny, 2026-09-13, form item
// verdict-ledger: "Register in de repository").
//
//   node gates/verdicts.mjs record < prompt.txt
//       Reads the "Verdict lines" block a copied catalogue prompt ends with
//       and writes each verdict into catalogue/verdicts.json, with the commit
//       it was recorded on (HEAD) and today's date. Refuses a block that no
//       review page shows, a theme that does not exist, and lines taken with
//       another hash recipe.
//
//   node gates/verdicts.mjs rehash [--width 1920]
//       After a change to the hash recipe (catalogue/block-hash.js,
//       HASH_VERSION): every entry is measured again at the commit it was
//       given on — a temporary git worktree of that commit, served on a free
//       port with the CURRENT block-hash.js in place of its own — in the
//       engine it was given in, and written with the new hash version. What
//       Kenny judged stays judged; only the way it is written down changes.
//
//   node gates/verdicts.mjs compare --browser /usr/bin/firedragon
//       Whether a reviewer's own browser reads the hashes the tools read,
//       block by block (see compare below).
//
// The register's gate is gates/check-verdicts.mjs.
import { readFileSync, writeFileSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashVersion, knownBlocks, REGISTER, VERDICTS } from './check-verdicts.mjs';

/**
 * @typedef {{ verdict: string, hash: string, commit: string, given: string }} Entry
 * @typedef {{ hashVersion: number, verdicts: Record<string, Record<string, Record<string, Entry>>> }} Register
 */

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const registerPath = join(ROOT, REGISTER);
/** @param {string[]} args */
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();

/** @returns {Register} */
export function readRegister(path = registerPath) {
    return JSON.parse(readFileSync(path, 'utf8'));
}

/**
 * Keys, themes and engines in a fixed order, so a diff of the register shows only what moved.
 * @param {Register} register
 * @returns {Register}
 */
export function sortedRegister(register) {
    /**
     * @param {Record<string, any>} object
     * @param {number} depth
     * @returns {Record<string, any>}
     */
    const sort = (object, depth) =>
        Object.fromEntries(
            Object.keys(object)
                .sort()
                .map((key) => [key, depth ? sort(object[key], depth - 1) : object[key]]),
        );
    /** @type {Register['verdicts']} */
    const verdicts = sort(register.verdicts, 2);
    for (const themes of Object.values(verdicts))
        for (const engines of Object.values(themes))
            for (const [engine, entry] of Object.entries(engines))
                engines[engine] = { verdict: entry.verdict, hash: entry.hash, commit: entry.commit, given: entry.given };
    return { hashVersion: register.hashVersion, verdicts };
}

/** @param {Register} register */
export function writeRegister(register, path = registerPath) {
    writeFileSync(path, `${JSON.stringify(sortedRegister(register), null, 4)}\n`);
}

/** Today in the local calendar, as the register writes a date. */
export function today(now = new Date()) {
    const pad = (/** @type {number} */ n) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/**
 * The verdict lines of a pasted prompt.
 * @param {string} text
 * @returns {{ version: number | null, lines: { key: string, theme: string, engine: string, verdict: string, hash: string, raw: string }[], faults: string[] }}
 */
export function parseVerdictLines(text) {
    const rows = text.split(/\r?\n/);
    const start = rows.findIndex((row) => /^\s*Verdict lines \(hash version \d+\):\s*$/.test(row));
    if (start === -1) return { version: null, lines: [], faults: ['no "Verdict lines (hash version N):" block in the input'] };
    const version = Number(/\d+/.exec(rows[start])?.[0]);
    /** @type {{ key: string, theme: string, engine: string, verdict: string, hash: string, raw: string }[]} */
    const lines = [];
    /** @type {string[]} */
    const faults = [];
    for (const row of rows.slice(start + 1)) {
        const raw = row.trim();
        if (!raw) break;
        const parts = raw.split(' · ').map((part) => part.trim());
        if (parts.length !== 5) {
            faults.push(`not five fields separated by " · ": ${raw}`);
            continue;
        }
        const [key, theme, engine, verdict, hash] = parts;
        lines.push({ key, theme, engine, verdict, hash, raw });
    }
    if (!lines.length && !faults.length) faults.push('the "Verdict lines" block is empty');
    return { version, lines, faults };
}

/**
 * Apply parsed lines to a register.
 * @param {Register} register
 * @param {ReturnType<typeof parseVerdictLines>} parsed
 * @param {{ hashVersion: number, known: Set<string> | Map<string, unknown>, themes: string[], commit: string, given: string }} context
 * @returns {{ added: string[], changed: string[], unchanged: string[], faults: string[] }}
 */
export function applyVerdictLines(register, { version, lines }, { hashVersion: current, known, themes, commit, given }) {
    /** @type {{ added: string[], changed: string[], unchanged: string[], faults: string[] }} */
    const report = { added: [], changed: [], unchanged: [], faults: [] };
    if (version !== current) report.faults.push(`the lines were taken with hash version ${version}, the pages read ${current}`);
    if (register.hashVersion !== current)
        report.faults.push(`the register is at hash version ${register.hashVersion}: run node gates/verdicts.mjs rehash first`);
    for (const line of lines) {
        const at = `${line.key} · ${line.theme} · ${line.engine}`;
        if (!known.has(line.key)) report.faults.push(`${at}: not a block any review page shows`);
        if (!themes.includes(line.theme)) report.faults.push(`${at}: not a theme`);
        if (!/^[a-z0-9]+$/.test(line.engine)) report.faults.push(`${at}: not an engine name`);
        if (!VERDICTS.includes(line.verdict)) report.faults.push(`${at}: verdict ${line.verdict} is not approved or rejected`);
        if (!/^[0-9a-f]{64}$/.test(line.hash)) report.faults.push(`${at}: the hash is not a full SHA-256`);
    }
    if (report.faults.length) return report;
    for (const line of lines) {
        const at = `${line.key} · ${line.theme} · ${line.engine} · ${line.verdict}`;
        const engines = ((register.verdicts[line.key] ??= {})[line.theme] ??= {});
        const before = engines[line.engine];
        if (before && before.verdict === line.verdict && before.hash === line.hash) {
            report.unchanged.push(at);
            continue;
        }
        engines[line.engine] = { verdict: line.verdict, hash: line.hash, commit, given };
        (before ? report.changed : report.added).push(before ? `${at} (was ${before.verdict}, ${before.hash.slice(0, 12)}…)` : at);
    }
    return report;
}

async function record() {
    const HASH_VERSION = hashVersion();
    const { THEMES } = await import('../js/theme-registry.js');
    const input = readFileSync(0, 'utf8');
    const parsed = parseVerdictLines(input);
    if (parsed.faults.length) {
        console.error(`Nothing recorded:\n  ${parsed.faults.join('\n  ')}`);
        process.exit(1);
    }
    const register = readRegister();
    const report = applyVerdictLines(register, parsed, {
        hashVersion: HASH_VERSION,
        known: await knownBlocks(),
        themes: THEMES.map((t) => t.name),
        commit: git('rev-parse', 'HEAD'),
        given: today(),
    });
    if (report.faults.length) {
        console.error(`Nothing recorded; ${report.faults.length} line(s) refused:\n  ${report.faults.join('\n  ')}`);
        process.exit(1);
    }
    writeRegister(register);
    const list = (/** @type {string} */ title, /** @type {string[]} */ rows) =>
        rows.length && console.log(`${title} (${rows.length}):\n  ${rows.join('\n  ')}`);
    list('Added', report.added);
    list('Changed', report.changed);
    list('Already recorded', report.unchanged);
    console.log(`${REGISTER}: ${report.added.length} added, ${report.changed.length} changed, ${report.unchanged.length} already there.`);
}

/* ------------------------------------------------------------------ rehash */

/**
 * Hash blocks as they were at a commit, with the current recipe.
 * @param {{ commit?: string, root?: string, engine: string, requests: { key: string, theme: string }[], width?: number, withLines?: boolean }} options
 *   commit: checked out into a temporary worktree; root: a directory served as it is (the working tree)
 * @returns {Promise<Map<string, { hash: string, lines?: string[] }>>} `key|theme` -> reading
 */
export async function hashAt({ commit, root, engine, requests, width = 1920, withLines = false }) {
    const { serve, measurePlaywright } = await import('./verdict-hashes.mjs');
    const playwright = await import('@playwright/test');
    /** @type {Record<string, import('@playwright/test').BrowserType>} */
    const engines = { firefox: playwright.firefox, chromium: playwright.chromium, webkit: playwright.webkit };
    const type = engines[engine];
    if (!type) throw new Error(`no browser to rehash an entry given in the engine "${engine}"`);
    if (!root && !commit) throw new Error('hashAt needs a commit or a root');
    /** @type {string | null} */
    let dir = null;
    /** @type {{ base: string, close: () => Promise<void> } | null} */
    let server = null;
    /** @type {import('@playwright/test').Browser | null} */
    let browser = null;
    try {
        if (!root) {
            dir = await mkdtemp(join(tmpdir(), 'kp-verdicts-worktree-'));
            git('worktree', 'add', '--detach', dir, String(commit));
        }
        const served = root ?? String(dir);
        const known = await knownBlocks(served);
        server = await serve(served, { 'catalogue/block-hash.js': readFileSync(join(ROOT, 'catalogue/block-hash.js'), 'utf8') });
        browser = await type.launch({ headless: true });
        const context = await browser.newContext({ viewport: { width, height: 1000 } });
        const page = await context.newPage();
        /** @type {Map<string, { hash: string, lines?: string[] }>} */
        const out = new Map();
        /** @type {Map<string, { themes: Set<string>, keys: Set<string> }>} */
        const byPage = new Map();
        for (const request of requests) {
            const block = known.get(request.key);
            if (!block) throw new Error(`${request.key} is not a block at ${commit ?? root}`);
            const wanted = byPage.get(block.page) ?? { themes: new Set(), keys: new Set() };
            wanted.themes.add(request.theme);
            wanted.keys.add(request.key);
            byPage.set(block.page, wanted);
        }
        for (const [href, wanted] of byPage) {
            const result = await measurePlaywright(page, {
                base: server.base,
                href,
                themes: [...wanted.themes],
                width,
                withLines,
                only: [...wanted.keys],
            });
            for (const [theme, rows] of Object.entries(
                /** @type {Record<string, { key: string, hash: string, lines?: string[] }[]>} */ (result.results),
            )) {
                for (const row of rows) out.set(`${row.key}|${theme}`, { hash: row.hash, ...(withLines ? { lines: row.lines } : {}) });
            }
        }
        for (const request of requests) {
            if (!out.has(`${request.key}|${request.theme}`)) throw new Error(`${request.key} in ${request.theme}: no reading at ${commit ?? root}`);
        }
        return out;
    } finally {
        await browser?.close();
        await server?.close();
        if (dir) {
            try {
                git('worktree', 'remove', '--force', dir);
            } finally {
                await rm(dir, { recursive: true, force: true });
                git('worktree', 'prune');
            }
        }
    }
}

/** @param {string[]} args */
async function rehash(args) {
    const HASH_VERSION = hashVersion();
    const width = (args.includes('--width') && Number(args[args.indexOf('--width') + 1])) || 1920;
    const register = readRegister();
    /** @type {Map<string, { commit: string, engine: string, requests: { key: string, theme: string, entry: Entry }[] }>} */
    const groups = new Map();
    for (const [key, themes] of Object.entries(register.verdicts)) {
        for (const [theme, engines] of Object.entries(themes)) {
            for (const [engine, entry] of Object.entries(engines)) {
                const id = `${entry.commit}|${engine}`;
                const group = groups.get(id) ?? { commit: entry.commit, engine, requests: [] };
                group.requests.push({ key, theme, entry });
                groups.set(id, group);
            }
        }
    }
    let moved = 0;
    let total = 0;
    for (const { commit, engine, requests } of groups.values()) {
        console.log(`${commit.slice(0, 12)} in ${engine}: ${requests.length} entr${requests.length === 1 ? 'y' : 'ies'}…`);
        const readings = await hashAt({ commit, engine, requests, width });
        for (const { key, theme, entry } of requests) {
            const reading = readings.get(`${key}|${theme}`);
            if (!reading) throw new Error(`${key} in ${theme}: no reading`);
            const { hash } = reading;
            total += 1;
            if (hash !== entry.hash) moved += 1;
            entry.hash = hash;
        }
    }
    const from = register.hashVersion;
    register.hashVersion = HASH_VERSION;
    writeRegister(register);
    console.log(`${REGISTER}: ${total} entr${total === 1 ? 'y' : 'ies'} rehashed from version ${from} to ${HASH_VERSION}, ${moved} hash(es) moved.`);
}

/* ----------------------------------------------------------------- compare */

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
async function compare(args) {
    const option = (/** @type {string} */ name, /** @type {string} */ fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
    const executable = option('--browser', '');
    if (!executable) throw new Error('compare needs --browser <path to the executable>');
    const engine = option('--engine', /chrom|edge|brave/i.test(executable) ? 'chromium' : 'firefox');
    const width = Number(option('--width', '1920'));
    const height = Number(option('--height', '1000'));
    const themes = option('--themes', 'formal,cyberpunk,nostromo,grotesk,brutalism,phantom').split(',');
    const { serve, blockPages, measurePlaywright, BidiGecko, firstDifference } = await import('./verdict-hashes.mjs');
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

async function main() {
    const [command, ...args] = process.argv.slice(2);
    if (command === 'record') return record();
    if (command === 'rehash') return rehash(args);
    if (command === 'compare') return compare(args);
    console.error(
        'usage: node gates/verdicts.mjs record < prompt.txt\n' +
            '       node gates/verdicts.mjs rehash [--width 1920]\n' +
            '       node gates/verdicts.mjs compare --browser /usr/bin/firedragon [--engine firefox] [--width 1920] [--height 1000] [--themes formal,nostromo]',
    );
    process.exit(2);
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch((error) => {
        console.error(error.stack ?? String(error));
        process.exit(1);
    });
}
