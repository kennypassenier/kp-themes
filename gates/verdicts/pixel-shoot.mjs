// Screenshot helpers of the `pixels` command: which blocks moved between commits, and shooting them.

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { knownBlocks } from '../check-verdicts.mjs';
import { ROOT, git } from './paths.mjs';

/**
 * Which blocks a set of moved files can have changed, read from
 * catalogue/code-version.json at both commits: its rules (keyed
 * `theme||at-rule||selector`, the theme empty for every theme), its modules
 * (each with the selector the loader attaches it by) and its base (the CSS
 * that names no family, which reaches every block). Null when the map cannot
 * answer: missing at either commit, or its base moved.
 * @param {string} from
 * @param {string} to
 * @param {string[]} moved
 */
export function narrowing(from, to, moved) {
    /** @type {any} */
    let before;
    /** @type {any} */
    let after;
    try {
        before = JSON.parse(git('show', `${from}:catalogue/code-version.json`));
        after = JSON.parse(git('show', `${to}:catalogue/code-version.json`));
    } catch {
        return null;
    }
    if (!before?.rules || !after?.rules || before.base !== after.base) return null;
    const familiesIn = (/** @type {string} */ text) => [
        ...new Set([...text.matchAll(/(?<![\w-])((?:data-)?kp-[a-z0-9]+(?:-[a-z0-9]+)*)/g)].map((m) => m[1])),
    ];
    /** @type {{ theme: string, families: string[] }[]} */
    const changed = [];
    for (const key of new Set([...Object.keys(before.rules), ...Object.keys(after.rules)])) {
        if (before.rules[key] === after.rules[key]) continue;
        const parts = key.split('||');
        changed.push({ theme: parts[0], families: familiesIn(parts[parts.length - 1]) });
    }
    for (const name of new Set([...Object.keys(before.modules ?? {}), ...Object.keys(after.modules ?? {})])) {
        const a = before.modules?.[name];
        const b = after.modules?.[name];
        if (a?.digest === b?.digest) continue;
        changed.push({ theme: '', families: familiesIn(`${a?.when ?? ''} ${b?.when ?? ''}`) });
    }
    // A theme's own page-wide CSS (its tokens on its root, its faces) reaches
    // every block in that theme.
    for (const theme of new Set([...Object.keys(before.themes ?? {}), ...Object.keys(after.themes ?? {})]))
        if (before.themes?.[theme] !== after.themes?.[theme]) changed.push({ theme, families: [] });
    const modules = new Set([...Object.keys(before.modules ?? {}), ...Object.keys(after.modules ?? {})]);
    // A rule keyed by something other than a theme (a stylesheet of its own)
    // reaches every theme.
    const themeNames = new Set(Object.keys(after.themes ?? {}));
    /** @type {Map<string, string[]>} */
    const pageFamilies = new Map();
    const familiesOf = (/** @type {string} */ page, /** @type {string} */ key) => {
        const id = key.includes('#') ? key.split('#').pop() : key.split('--').slice(1).join('--');
        const cacheKey = `${page}#${id}`;
        if (!pageFamilies.has(cacheKey)) {
            const html = existsSync(join(ROOT, page)) ? readFileSync(join(ROOT, page), 'utf8') : '';
            const start = html.indexOf(`id="${id}"`);
            const end = start < 0 ? -1 : html.indexOf('<section', start + 1);
            const named = start < 0 ? [] : familiesIn(html.slice(start, end < 0 ? undefined : end));
            // What a script draws at run time is not in the markup (a
            // combobox's chips, a table's sort line): a block naming any
            // family of a component takes all of that component's, as the
            // block hash did from version 7 [scope-116].
            const all = new Set(named);
            for (const component of Object.values(after.components ?? {})) {
                const families = /** @type {string[]} */ (component.families ?? []);
                if (families.some((f) => all.has(f))) for (const f of families) all.add(f);
            }
            pageFamilies.set(cacheKey, [...all]);
        }
        return /** @type {string[]} */ (pageFamilies.get(cacheKey));
    };
    return {
        /** A file the map describes rule by rule. */
        // Every stylesheet the map is built from: css/themes.css too, whose
        // version header the map masks (Kenny, 2026-10-04: the 9.0.1 bump
        // alone photographed all 3031 pairs again).
        covers: (/** @type {string} */ file) => /^css\/[^/]+\.css$/.test(file) || modules.has(file),
        /** Whether a changed rule or module can reach this block in this theme. */
        touches: (/** @type {string} */ key, /** @type {string} */ theme, /** @type {string} */ page) => {
            const own = new Set(familiesOf(page, key));
            // A block whose markup the map cannot read is asked about.
            if (!own.size) return true;
            return changed.some(
                (rule) =>
                    (rule.theme === '' || rule.theme === theme || !themeNames.has(rule.theme)) &&
                    (!rule.families.length || rule.families.some((f) => own.has(f))),
            );
        },
    };
}

/**
 * Photograph blocks at a commit (a temporary worktree) or in a directory.
 * With `print`, no photograph: each page once, in the first theme asked of
 * it, read for what the review shell does to its blocks (printShell), keyed
 * by block alone.
 * @param {{ commit?: string, root?: string, engine: string, ratio: number, width: number, requests: { key: string, theme: string }[], repeat?: boolean, parallel?: number, print?: boolean }} options
 * @returns {Promise<Map<string, { first: string, second: string }>>}
 */
export async function shootAt({ commit, root, engine, ratio, width, requests, repeat = true, parallel = 0, print = false }) {
    const { serve, shootPlaywright, printShell } = await import('../verdict-hashes.mjs');
    const playwright = await import('@playwright/test');
    /** @type {Record<string, import('@playwright/test').BrowserType>} */
    const engines = { firefox: playwright.firefox, chromium: playwright.chromium, webkit: playwright.webkit };
    const type = engines[engine];
    if (!type) throw new Error(`no browser for the engine "${engine}"`);
    /** @type {string | null} */
    let dir = null;
    /** @type {{ base: string, close: () => Promise<void> } | null} */
    let server = null;
    /** @type {import('@playwright/test').Browser[]} */
    const browsers = [];
    /** @type {Map<string, { first: string, second: string }>} */
    const out = new Map();
    try {
        if (!root) {
            dir = await mkdtemp(join(tmpdir(), 'kp-pixels-worktree-'));
            git('worktree', 'add', '--detach', dir, String(commit));
        }
        const served = root ?? String(dir);
        const known = await knownBlocks(served);
        server = await serve(served);
        const launch = () =>
            type.launch({
                headless: true,
                ...(ratio !== 1 && engine === 'firefox' ? { firefoxUserPrefs: { 'layout.css.devPixelsPerPx': String(ratio) } } : {}),
            });
        const contextOf = (/** @type {import('@playwright/test').Browser} */ b) =>
            b.newContext({
                viewport: { width, height: 1000 },
                reducedMotion: 'reduce',
                ...(ratio !== 1 ? { deviceScaleFactor: ratio } : {}),
            });
        /** @type {Map<string, { themes: Set<string>, keys: Set<string> }>} */
        const byPage = new Map();
        for (const request of requests) {
            const block = known.get(request.key);
            if (!block) continue;
            const wanted = byPage.get(block.page) ?? { themes: new Set(), keys: new Set() };
            wanted.themes.add(request.theme);
            wanted.keys.add(request.key);
            byPage.set(block.page, wanted);
        }
        // One review page in one theme is a unit of work, handed to several
        // browsers side by side, each its own process (Kenny, 2026-09-30:
        // the machine has 16 cores and the run used one browser). A page in
        // every theme was one unit before, and the table page alone took
        // 145 s while the others waited.
        /** @type {[string, { themes: Set<string>, keys: Set<string> }][]} */
        const queue = [];
        for (const [href, wanted] of byPage)
            for (const theme of print ? [[...wanted.themes].sort()[0]] : wanted.themes)
                queue.push([href, { themes: new Set([theme]), keys: wanted.keys }]);
        const units = queue.length;
        const where = commit ? String(commit).slice(0, 12) : 'HEAD';
        const base = server.base;
        let done = 0;
        const worker = async () => {
            const own = await launch();
            browsers.push(own);
            const page = await (await contextOf(own)).newPage();
            for (let next = queue.shift(); next; next = queue.shift()) {
                const [href, wanted] = next;
                const started = Date.now();
                try {
                    if (print) {
                        const prints = await printShell(page, { base, href, theme: [...wanted.themes][0], width, only: [...wanted.keys] });
                        for (const [k, v] of prints) out.set(k, { first: v, second: v });
                    } else {
                        const shots = await shootPlaywright(page, { base, href, themes: [...wanted.themes], width, only: [...wanted.keys], repeat });
                        for (const [k, v] of shots) out.set(k, v);
                    }
                } catch (error) {
                    console.error(`  ${href} at ${where}: ${String(error).split('\n')[0]}`);
                }
                done += 1;
                if (done % 20 === 0 || done === units)
                    console.log(`  ${where}: ${done}/${units} page-and-theme units, last ${href} in ${Math.round((Date.now() - started) / 1000)} s`);
            }
            await page.close();
        };
        const workers = Math.max(1, Math.min(units, parallel || Number(process.env.PIXELS_WORKERS) || 4));
        await Promise.all(Array.from({ length: workers }, worker));
        return out;
    } finally {
        await Promise.all(browsers.map((b) => b.close()));
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

/* ------------------------------------------------------------------ settle */
