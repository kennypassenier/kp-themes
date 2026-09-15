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
//       An approved verdict recorded for a block clears its review note in
//       that theme (catalogue/review-notes.json); a rejected one leaves it.
//
//   node gates/verdicts.mjs note <block> <theme> --rejected "<text>" --change "<text>" [--commit <hash>]
//       Writes the review note a block shows in one theme until it is
//       approved there: Kenny's rejection, verbatim, and what Claude changed
//       to answer it. Refuses a block no review page shows and a theme that
//       does not exist.
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
//   node gates/verdicts.mjs compare --against-browser [--commit <hash> | --all] [--at-recorded] [--register <file>]
//       Whether the hashes recorded at a commit (default HEAD) are the ones
//       Playwright's browser of the same engine reads on the working tree
//       now [fix-28], each at the device pixel ratio it was read at
//       [fix-34]. `record` prints this command with its own commit.
//
//   node gates/verdicts.mjs annotate-ratio --from <readings.json> [--commit <hash>] [--engine firefox] [--register <file>]
//       One-off [fix-34]: gives an entry the ratio at which a reading
//       matches its hash, for entries recorded before verdicts kept one.
//       Never changes a hash or a verdict; lists the entries no reading
//       matches. The readings: { "readings": { "<devPixelsPerPx>": { "<key>|<theme>": "<hash>" } } }.
//
//   node gates/verdicts.mjs reanchor --commit <hash> [--keys-from-compare <file>] [--register <file>]
//       One-off [scope-94]: the entries recorded at a commit that match no
//       ratio keep their verdict and take the hash of the block at rest at
//       that commit, at the ratio most of the theme's annotated entries have.
//
// Pixel ratio [fix-34]: Gecko resolves a border width to whole device
// pixels, so a block's hash follows the zoom it was read at. Kenny reviews
// at a zoom other than 100% by default (2026-09-15), so a verdict keeps the
// ratio (catalogue/engine.js reads it): a sixth field `@1.25` on its verdict
// line and `ratio` in its register entry, both left out at 1 — five-field
// lines and entries without a ratio stay valid and mean 1. The tools read an
// entry at its ratio: Firefox launched with `layout.css.devPixelsPerPx`, and
// a context with that deviceScaleFactor so `devicePixelRatio` agrees; one
// browser per ratio.
//
// The register's gate is gates/check-verdicts.mjs.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashVersion, knownBlocks, NOTES, ratioFault, REGISTER, VERDICTS } from './check-verdicts.mjs';

/**
 * @typedef {{ verdict: string, hash: string, commit: string, given: string, ratio?: number }} Entry
 * @typedef {{ hashVersion: number, verdicts: Record<string, Record<string, Record<string, Entry>>> }} Register
 */

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const registerPath = join(ROOT, REGISTER);
const notesPath = join(ROOT, NOTES);
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
                engines[engine] = {
                    verdict: entry.verdict,
                    hash: entry.hash,
                    commit: entry.commit,
                    given: entry.given,
                    ...(entry.ratio !== undefined && entry.ratio !== 1 ? { ratio: entry.ratio } : {}),
                };
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

/** The ratio an entry was read at: its own, or 1. @param {{ ratio?: number }} entry */
export const ratioOf = (entry) => entry.ratio ?? 1;

/**
 * The ratio a Playwright Firefox launched with `layout.css.devPixelsPerPx` =
 * `pref` reads at, as a page writes it: Gecko keeps 60 app units per CSS
 * pixel over a whole number per device pixel (1.1 is 60/55, 1.091).
 * @param {number | string} pref
 */
export const geckoRatio = (pref) => Math.round((60 / Math.round(60 / Number(pref))) * 1000) / 1000;

/**
 * The verdict lines of a pasted prompt: `key · theme · engine · verdict · hash`,
 * and a sixth field `@<ratio>` where the hash was read at a device pixel
 * ratio other than 1 [fix-34].
 * @param {string} text
 * @returns {{ version: number | null, lines: { key: string, theme: string, engine: string, verdict: string, hash: string, ratio: number, raw: string }[], faults: string[] }}
 */
export function parseVerdictLines(text) {
    const rows = text.split(/\r?\n/);
    const start = rows.findIndex((row) => /^\s*Verdict lines \(hash version \d+\):\s*$/.test(row));
    if (start === -1) return { version: null, lines: [], faults: ['no "Verdict lines (hash version N):" block in the input'] };
    const version = Number(/\d+/.exec(rows[start])?.[0]);
    /** @type {{ key: string, theme: string, engine: string, verdict: string, hash: string, ratio: number, raw: string }[]} */
    const lines = [];
    /** @type {string[]} */
    const faults = [];
    for (const row of rows.slice(start + 1)) {
        const raw = row.trim();
        if (!raw) break;
        const parts = raw.split(' · ').map((part) => part.trim());
        if (parts.length !== 5 && parts.length !== 6) {
            faults.push(`not five fields (or six, with @ratio) separated by " · ": ${raw}`);
            continue;
        }
        const [key, theme, engine, verdict, hash, at] = parts;
        if (at !== undefined && !/^@\d+(?:\.\d+)?$/.test(at)) {
            faults.push(`the sixth field is not @<ratio>: ${raw}`);
            continue;
        }
        lines.push({ key, theme, engine, verdict, hash, ratio: at === undefined ? 1 : Number(at.slice(1)), raw });
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
        const wrong = (line.ratio ?? 1) === 1 ? null : ratioFault(line.ratio);
        if (wrong) report.faults.push(`${at}: ${wrong}`);
    }
    if (report.faults.length) return report;
    for (const line of lines) {
        const at = `${line.key} · ${line.theme} · ${line.engine} · ${line.verdict}`;
        const engines = ((register.verdicts[line.key] ??= {})[line.theme] ??= {});
        const before = engines[line.engine];
        const ratio = line.ratio ?? 1;
        if (before && before.verdict === line.verdict && before.hash === line.hash && ratioOf(before) === ratio) {
            report.unchanged.push(at);
            continue;
        }
        engines[line.engine] = { verdict: line.verdict, hash: line.hash, commit, given, ...(ratio !== 1 ? { ratio } : {}) };
        (before ? report.changed : report.added).push(before ? `${at} (was ${before.verdict}, ${before.hash.slice(0, 12)}…)` : at);
    }
    return report;
}

/* ------------------------------------------------------------ review notes */

/**
 * @typedef {{ rejected: string, change: string, commit?: string, given: string }} Note
 * @typedef {Record<string, Record<string, Note>>} Notes
 */

/** @returns {Notes} the review notes, or none when the file is not there */
export function readNotes(path = notesPath) {
    return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : {};
}

/**
 * Blocks and themes in a fixed order, fields in the order a reader wants them.
 * @param {Notes} notes
 * @returns {Notes}
 */
export function sortedNotes(notes) {
    /** @type {Notes} */
    const out = {};
    for (const key of Object.keys(notes).sort()) {
        const themes = Object.keys(notes[key]).sort();
        if (!themes.length) continue;
        out[key] = {};
        for (const theme of themes) {
            const { rejected, change, commit, given } = notes[key][theme];
            out[key][theme] = { rejected, change, ...(commit ? { commit } : {}), given };
        }
    }
    return out;
}

/** @param {Notes} notes */
export function writeNotes(notes, path = notesPath) {
    writeFileSync(path, `${JSON.stringify(sortedNotes(notes), null, 4)}\n`);
}

/**
 * Clear the note of every block and theme an approved line covers, in any
 * engine; a rejected line leaves the note, for Claude to rewrite.
 * @param {Notes} notes
 * @param {{ key: string, theme: string, verdict: string }[]} lines
 * @returns {string[]} `block · theme` for every note cleared
 */
export function clearApprovedNotes(notes, lines) {
    const cleared = [];
    for (const { key, theme, verdict } of lines) {
        if (verdict !== 'approved' || !notes[key]?.[theme]) continue;
        delete notes[key][theme];
        if (!Object.keys(notes[key]).length) delete notes[key];
        cleared.push(`${key} · ${theme}`);
    }
    return cleared;
}

/**
 * Write one note into `notes`, or say why not.
 * @param {Notes} notes
 * @param {{ key?: string, theme?: string, rejected?: string, change?: string, commit?: string }} note
 * @param {{ known: Set<string> | Map<string, unknown>, themes: string[], commit: string, given: string }} context
 * @returns {string[]} faults; none means the note is written
 */
export function putNote(notes, { key, theme, rejected, change, commit }, context) {
    const faults = [];
    const at = `${key} · ${theme}`;
    if (!key || !context.known.has(key)) faults.push(`${at}: not a block any review page shows`);
    if (!theme || !context.themes.includes(theme)) faults.push(`${at}: not a theme`);
    if (!rejected?.trim()) faults.push(`${at}: --rejected "<Kenny's note>" is missing or empty`);
    if (!change?.trim()) faults.push(`${at}: --change "<what changed>" is missing or empty`);
    const id = commit ?? context.commit;
    if (!/^[0-9a-f]{7,40}$/.test(id)) faults.push(`${at}: --commit ${id} is not a commit id`);
    if (faults.length || !key || !theme) return faults;
    (notes[key] ??= {})[theme] = { rejected: String(rejected), change: String(change).trim(), commit: id, given: context.given };
    return [];
}

/**
 * Record a pasted prompt: the verdicts into the register, and every note an
 * approval answers out of the notes.
 * @param {string} input
 * @param {{ registerFile?: string, notesFile?: string, hashVersion: number, known: Set<string> | Map<string, unknown>, themes: string[], commit: string, given: string }} context
 * @returns {{ ok: boolean, out: string[], err: string[] }}
 */
export function recordPrompt(input, { registerFile = registerPath, notesFile = notesPath, ...context }) {
    const parsed = parseVerdictLines(input);
    if (parsed.faults.length) return { ok: false, out: [], err: [`Nothing recorded:\n  ${parsed.faults.join('\n  ')}`] };
    const register = readRegister(registerFile);
    const report = applyVerdictLines(register, parsed, context);
    if (report.faults.length) {
        return { ok: false, out: [], err: [`Nothing recorded; ${report.faults.length} line(s) refused:\n  ${report.faults.join('\n  ')}`] };
    }
    writeRegister(register, registerFile);
    /** @type {string[]} */
    const out = [];
    const list = (/** @type {string} */ title, /** @type {string[]} */ rows) => {
        if (rows.length) out.push(`${title} (${rows.length}):\n  ${rows.join('\n  ')}`);
    };
    list('Added', report.added);
    list('Changed', report.changed);
    list('Already recorded', report.unchanged);
    out.push(`${REGISTER}: ${report.added.length} added, ${report.changed.length} changed, ${report.unchanged.length} already there.`);
    out.push(`Whether the test browser reads the same hashes [fix-28]: ${compareCommand(context.commit)}`);
    const notes = readNotes(notesFile);
    const cleared = clearApprovedNotes(notes, parsed.lines);
    if (cleared.length) {
        writeNotes(notes, notesFile);
        for (const row of cleared) out.push(`note cleared: ${row}`);
    }
    return { ok: true, out, err: [] };
}

/** The command that checks the entries recorded at `commit` against the test browser. @param {string} commit */
export const compareCommand = (commit) => `node gates/verdicts.mjs compare --against-browser --commit ${commit.slice(0, 12)}`;

async function record() {
    const { THEMES } = await import('../js/theme-registry.js');
    const result = recordPrompt(readFileSync(0, 'utf8'), {
        hashVersion: hashVersion(),
        known: await knownBlocks(),
        themes: THEMES.map((t) => t.name),
        commit: git('rev-parse', 'HEAD'),
        given: today(),
    });
    for (const line of result.err) console.error(line);
    for (const line of result.out) console.log(line);
    if (!result.ok) process.exit(1);
}

/** @param {string[]} args */
async function note(args) {
    const [key, theme] = args;
    const option = (/** @type {string} */ name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
    const { THEMES } = await import('../js/theme-registry.js');
    const file = process.env.KP_REVIEW_NOTES ?? notesPath;
    const notes = readNotes(file);
    const faults = putNote(
        notes,
        { key, theme, rejected: option('--rejected'), change: option('--change'), commit: option('--commit') },
        { known: await knownBlocks(), themes: THEMES.map((t) => t.name), commit: git('rev-parse', '--short', 'HEAD'), given: today() },
    );
    if (faults.length) {
        console.error(`No note written:\n  ${faults.join('\n  ')}`);
        process.exit(1);
    }
    writeNotes(notes, file);
    console.log(`${NOTES}: note written for ${key} · ${theme}.`);
}

/* ------------------------------------------------------------------ rehash */

/**
 * Hash blocks as they were at a commit, with the current recipe.
 * @param {{ commit?: string, root?: string, engine: string, requests: { key: string, theme: string }[], width?: number, withLines?: boolean, ratio?: number }} options
 *   commit: checked out into a temporary worktree; root: a directory served as it is (the working tree);
 *   ratio: the device pixel ratio to read at [fix-34] — Firefox's `layout.css.devPixelsPerPx`, and the
 *   context's deviceScaleFactor so `devicePixelRatio` agrees (Blink's borders do not follow it)
 * @returns {Promise<Map<string, { hash: string, lines?: string[] }>>} `key|theme` -> reading
 */
export async function hashAt({ commit, root, engine, requests, width = 1920, withLines = false, ratio = 1 }) {
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
        browser = await type.launch({
            headless: true,
            ...(ratio !== 1 && engine === 'firefox' ? { firefoxUserPrefs: { 'layout.css.devPixelsPerPx': String(ratio) } } : {}),
        });
        const context = await browser.newContext({ viewport: { width, height: 1000 }, ...(ratio !== 1 ? { deviceScaleFactor: ratio } : {}) });
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
    /** @type {Map<string, { commit: string, engine: string, ratio: number, requests: { key: string, theme: string, entry: Entry }[] }>} */
    const groups = new Map();
    for (const [key, themes] of Object.entries(register.verdicts)) {
        for (const [theme, engines] of Object.entries(themes)) {
            for (const [engine, entry] of Object.entries(engines)) {
                // Each entry at the ratio it was read at [fix-34].
                const id = `${entry.commit}|${engine}|${ratioOf(entry)}`;
                const group = groups.get(id) ?? { commit: entry.commit, engine, ratio: ratioOf(entry), requests: [] };
                group.requests.push({ key, theme, entry });
                groups.set(id, group);
            }
        }
    }
    let moved = 0;
    let total = 0;
    for (const { commit, engine, ratio, requests } of groups.values()) {
        console.log(`${commit.slice(0, 12)} in ${engine} at ratio ${ratio}: ${requests.length} entr${requests.length === 1 ? 'y' : 'ies'}…`);
        const readings = await hashAt({ commit, engine, requests, width, ratio });
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
async function compareAgainstBrowser(args) {
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

/**
 * Give entries recorded before verdicts kept a ratio the ratio at which a
 * reading matches their hash [fix-34]. An entry whose hash a ratio-1 reading
 * matches, or that has a ratio already, is left as it is. Where several
 * ratios match, the one that matches the most entries overall is taken
 * (Kenny's default zoom), then the lowest. No hash and no verdict changes.
 * @param {Register} register changed in place
 * @param {Record<string, Record<string, string>>} readings `<devPixelsPerPx>` -> `key|theme` -> hash, read in `engine`
 * @param {{ commit?: string | null, engine?: string }} [options] commit: only the entries recorded at it (a prefix)
 * @returns {{ annotated: { key: string, theme: string, ratio: number }[], equal: number, kept: number, unmatched: { key: string, theme: string }[], unread: { key: string, theme: string }[] }}
 */
export function annotateRatios(register, readings, { commit = null, engine = 'firefox' } = {}) {
    const prefs = Object.keys(readings);
    const one = prefs.filter((pref) => geckoRatio(pref) === 1);
    const others = prefs.filter((pref) => geckoRatio(pref) !== 1);
    /** @type {ReturnType<typeof annotateRatios>} */
    const out = { annotated: [], equal: 0, kept: 0, unmatched: [], unread: [] };
    const candidates = entriesAt(register, commit).filter((e) => e.engine === engine);
    const matches = (/** @type {string} */ pref, /** @type {{ key: string, theme: string, entry: Entry }} */ e) =>
        readings[pref]?.[`${e.key}|${e.theme}`] === e.entry.hash;
    // How many entries each ratio matches: the tie-break.
    /** @type {Map<number, number>} */
    const weight = new Map();
    for (const e of candidates)
        for (const ratio of new Set(others.filter((pref) => matches(pref, e)).map(geckoRatio))) weight.set(ratio, (weight.get(ratio) ?? 0) + 1);
    for (const e of candidates) {
        const id = { key: e.key, theme: e.theme };
        if (e.entry.ratio !== undefined) {
            out.kept += 1;
            continue;
        }
        if (one.some((pref) => matches(pref, e))) {
            out.equal += 1;
            continue;
        }
        if (!prefs.some((pref) => `${e.key}|${e.theme}` in (readings[pref] ?? {}))) {
            out.unread.push(id);
            continue;
        }
        const ratios = [...new Set(others.filter((pref) => matches(pref, e)).map(geckoRatio))].sort(
            (a, b) => (weight.get(b) ?? 0) - (weight.get(a) ?? 0) || a - b,
        );
        if (!ratios.length) {
            out.unmatched.push(id);
            continue;
        }
        e.entry.ratio = ratios[0];
        out.annotated.push({ ...id, ratio: ratios[0] });
    }
    return out;
}

/** @param {string[]} args */
async function annotateRatio(args) {
    const option = (/** @type {string} */ name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
    const from = option('--from');
    if (!from) throw new Error('annotate-ratio needs --from <readings.json>');
    const file = option('--register') ?? registerPath;
    const register = readRegister(file);
    const { readings } = JSON.parse(readFileSync(from, 'utf8'));
    const result = annotateRatios(register, readings, { commit: option('--commit') ?? null, engine: option('--engine') ?? 'firefox' });
    writeRegister(register, file);
    /** @param {{ key: string, theme: string }[]} rows */
    const byTheme = (rows) => {
        /** @type {Record<string, string[]>} */
        const grouped = {};
        for (const { key, theme } of rows) (grouped[theme] ??= []).push(key);
        return Object.entries(grouped)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([theme, keys]) => `${theme} (${keys.length}): ${keys.sort().join(', ')}`);
    };
    /** @type {Record<string, number>} */
    const perRatio = {};
    for (const { ratio } of result.annotated) perRatio[ratio] = (perRatio[ratio] ?? 0) + 1;
    console.log(
        `${file}: ${result.annotated.length} entr${result.annotated.length === 1 ? 'y' : 'ies'} given a ratio (${Object.entries(perRatio)
            .map(([ratio, n]) => `@${ratio} ${n}`)
            .join(
                ', ',
            )}), ${result.equal} equal at ratio 1, ${result.kept} with a ratio already, ${result.unmatched.length} matched by no reading, ${result.unread.length} not read.`,
    );
    for (const row of byTheme(result.annotated.map(({ key, theme, ratio }) => ({ key: `${key} @${ratio}`, theme }))))
        console.log(`  given a ratio: ${row}`);
    for (const row of byTheme(result.unmatched)) console.log(`  no ratio matches: ${row}`);
    for (const row of byTheme(result.unread)) console.log(`  not read: ${row}`);
}

/* ---------------------------------------------------------------- reanchor */

/**
 * The ratio each theme's entries at a commit are re-anchored at [scope-94]:
 * the ratio most of that theme's annotated entries (a ratio other than 1)
 * have; on a tie the one most annotated entries of the commit have, then the
 * lowest; 1 for a theme with none.
 * @param {Register} register
 * @param {{ commit: string, engine?: string }} options
 * @returns {Map<string, number>} theme -> ratio, for the themes with an annotated entry
 */
export function reanchorRatios(register, { commit, engine = 'firefox' }) {
    const entries = entriesAt(register, commit).filter((e) => e.engine === engine && ratioOf(e.entry) !== 1);
    /** @type {Map<number, number>} */
    const overall = new Map();
    /** @type {Map<string, Map<number, number>>} */
    const perTheme = new Map();
    for (const { theme, entry } of entries) {
        const ratio = ratioOf(entry);
        overall.set(ratio, (overall.get(ratio) ?? 0) + 1);
        const counts = perTheme.get(theme) ?? new Map();
        counts.set(ratio, (counts.get(ratio) ?? 0) + 1);
        perTheme.set(theme, counts);
    }
    return new Map(
        [...perTheme].map(([theme, counts]) => [
            theme,
            [...counts].sort(([a, n], [b, m]) => m - n || (overall.get(b) ?? 0) - (overall.get(a) ?? 0) || a - b)[0][0],
        ]),
    );
}

/**
 * The entries at a commit without a ratio whose hash a ratio-1 reading at
 * rest of that commit does not read: the ones no ratio matched [fix-34].
 * @param {Register} register
 * @param {Map<string, { hash: string }>} readings `key|theme` -> the reading at ratio 1 at the commit
 * @param {{ commit: string, engine?: string }} options
 */
export function unmatchedEntries(register, readings, { commit, engine = 'firefox' }) {
    return entriesAt(register, commit).filter(
        (e) => e.engine === engine && e.entry.ratio === undefined && readings.get(`${e.key}|${e.theme}`)?.hash !== e.entry.hash,
    );
}

/**
 * The `key · theme · engine` of every "differs:" line of a saved
 * `compare --against-browser` output.
 * @param {string} text
 * @returns {{ key: string, theme: string, engine: string }[]}
 */
export function keysFromCompare(text) {
    return [...text.matchAll(/^\s*differs: (\S+) · ([a-z0-9-]+) · ([a-z0-9]+) · /gm)].map(([, key, theme, engine]) => ({ key, theme, engine }));
}

/**
 * Re-anchor entries [scope-94]: each target's hash is replaced by the reading
 * at rest of the commit it was recorded at, at the target's ratio, which the
 * entry now keeps. Its verdict, commit and date stay; no other entry is touched.
 * @param {Register} register changed in place
 * @param {{ key: string, theme: string, engine: string, ratio: number }[]} targets
 * @param {Map<string, { hash: string }>} readings `key|theme|engine|ratio` -> reading
 * @returns {{ reanchored: string[], unread: string[] }}
 */
export function reanchorEntries(register, targets, readings) {
    /** @type {{ reanchored: string[], unread: string[] }} */
    const out = { reanchored: [], unread: [] };
    for (const { key, theme, engine, ratio } of targets) {
        const at = `${key} · ${theme} · ${engine} @${ratio}`;
        const entry = register.verdicts[key]?.[theme]?.[engine];
        const reading = readings.get(`${key}|${theme}|${engine}|${ratio}`);
        if (!entry || !reading) {
            out.unread.push(at);
            continue;
        }
        entry.hash = reading.hash;
        if (ratio === 1) delete entry.ratio;
        else entry.ratio = ratio;
        out.reanchored.push(at);
    }
    return out;
}

/**
 * `reanchor --commit <hash> [--keys-from-compare <file>] [--register <file>]`,
 * one-off [scope-94]: the entries recorded at a commit that match no ratio
 * keep their verdict and take the hash of the block at rest at that commit.
 * Without --keys-from-compare the entries are found by reading every entry
 * without a ratio at ratio 1 at the commit; with it, they are the "differs:"
 * lines of a saved `compare --against-browser --at-recorded` output.
 * @param {string[]} args
 */
async function reanchor(args) {
    const option = (/** @type {string} */ name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
    const commit = option('--commit');
    if (!commit) throw new Error('reanchor needs --commit <hash>');
    const engine = option('--engine') ?? 'firefox';
    const file = option('--register') ?? registerPath;
    const register = readRegister(file);
    const full = git('rev-parse', `${commit}^{commit}`);
    const fromCompare = option('--keys-from-compare');
    /** @type {{ key: string, theme: string, engine: string, entry: Entry }[]} */
    let found;
    if (fromCompare) {
        const wanted = new Set(keysFromCompare(readFileSync(fromCompare, 'utf8')).map((k) => `${k.key}|${k.theme}|${k.engine}`));
        found = entriesAt(register, commit).filter((e) => wanted.has(`${e.key}|${e.theme}|${e.engine}`));
    } else {
        const plain = entriesAt(register, commit).filter((e) => e.engine === engine && e.entry.ratio === undefined);
        const atOne = await hashAt({ commit: full, engine, requests: plain.map(({ key, theme }) => ({ key, theme })), ratio: 1 });
        found = unmatchedEntries(register, atOne, { commit, engine });
    }
    const ratios = reanchorRatios(register, { commit, engine });
    const targets = found.map(({ key, theme, engine: own }) => ({ key, theme, engine: own, ratio: ratios.get(theme) ?? 1 }));
    /** @type {Map<string, { hash: string }>} */
    const readings = new Map();
    for (const ratio of new Set(targets.map((t) => t.ratio))) {
        const group = targets.filter((t) => t.ratio === ratio);
        console.log(`${full.slice(0, 12)} in ${engine} at ratio ${ratio}: ${group.length} entr${group.length === 1 ? 'y' : 'ies'}…`);
        const read = await hashAt({ commit: full, engine, requests: group.map(({ key, theme }) => ({ key, theme })), ratio });
        for (const t of group) {
            const reading = read.get(`${t.key}|${t.theme}`);
            if (reading) readings.set(`${t.key}|${t.theme}|${t.engine}|${ratio}`, reading);
        }
    }
    const result = reanchorEntries(register, targets, readings);
    writeRegister(register, file);
    console.log(
        `${file}: ${result.reanchored.length} entr${result.reanchored.length === 1 ? 'y' : 'ies'} re-anchored, ${result.unread.length} not read.`,
    );
    for (const row of result.reanchored) console.log(`  re-anchored: ${row}`);
    for (const row of result.unread) console.log(`  not read: ${row}`);
    console.log(`Check: ${compareCommand(full)} --at-recorded`);
}

async function main() {
    const [command, ...args] = process.argv.slice(2);
    if (command === 'reanchor') return reanchor(args);
    if (command === 'record') return record();
    if (command === 'note') return note(args);
    if (command === 'rehash') return rehash(args);
    if (command === 'compare' && args.includes('--against-browser')) return compareAgainstBrowser(args);
    if (command === 'compare') return compare(args);
    if (command === 'annotate-ratio') return annotateRatio(args);
    console.error(
        'usage: node gates/verdicts.mjs record < prompt.txt\n' +
            '       node gates/verdicts.mjs note <block> <theme> --rejected "<text>" --change "<text>" [--commit <hash>]\n' +
            '       node gates/verdicts.mjs rehash [--width 1920]\n' +
            '       node gates/verdicts.mjs compare --browser /usr/bin/firedragon [--engine firefox] [--width 1920] [--height 1000] [--themes formal,nostromo]\n' +
            '       node gates/verdicts.mjs compare --against-browser [--commit <hash> | --all] [--at-recorded] [--width 1920]\n' +
            '       node gates/verdicts.mjs annotate-ratio --from <readings.json> [--commit <hash>] [--engine firefox] [--register <file>]\n' +
            '       node gates/verdicts.mjs reanchor --commit <hash> [--keys-from-compare <file>] [--engine firefox] [--register <file>]',
    );
    process.exit(2);
}

if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch((error) => {
        console.error(error.stack ?? String(error));
        process.exit(1);
    });
}
