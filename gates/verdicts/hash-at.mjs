// Measuring block hashes at a commit (temporary worktree + served page) for the re-measuring commands.

import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { knownBlocks } from '../check-verdicts.mjs';
import { readFileSync } from 'node:fs';
import { ROOT, git } from './paths.mjs';

/**
 * A temporary git worktree of `commit` for the length of `work`.
 * @template T
 * @param {string} commit
 * @param {(dir: string) => Promise<T>} work
 * @returns {Promise<T>}
 */
export async function atCommit(commit, work) {
    const dir = await mkdtemp(join(tmpdir(), 'kp-verdicts-worktree-'));
    try {
        git('worktree', 'add', '--detach', dir, commit);
        return await work(dir);
    } finally {
        try {
            git('worktree', 'remove', '--force', dir);
        } finally {
            await rm(dir, { recursive: true, force: true });
            git('worktree', 'prune');
        }
    }
}

/**
 * Hash blocks as they were at a commit, with the current recipe.
 * @param {{ commit?: string, root?: string, engine: string, requests: { key: string, theme: string }[], width?: number, withLines?: boolean, ratio?: number, recipe?: string }} options
 *   commit: checked out into a temporary worktree; root: a directory served as it is (the working tree);
 *   ratio: the device pixel ratio to read at [fix-34] — Firefox's `layout.css.devPixelsPerPx`, and the
 *   context's deviceScaleFactor so `devicePixelRatio` agrees (Blink's borders do not follow it);
 *   recipe: the block-hash.js to serve instead of the current one (a check against an older recipe)
 * @returns {Promise<Map<string, { hash: string, previous?: string, earlier?: Record<string, string>, lines?: string[] }>>} `key|theme` -> reading;
 *   previous: the same reading under the previous hash version, earlier: under each earlier version, where the recipe returns them
 */
export async function hashAt({ commit, root, engine, requests, width = 1920, withLines = false, ratio = 1, recipe }) {
    const { serve, measurePlaywright } = await import('../verdict-hashes.mjs');
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
        server = await serve(served, { 'catalogue/block-hash.js': recipe ?? readFileSync(join(ROOT, 'catalogue/block-hash.js'), 'utf8') });
        browser = await type.launch({
            headless: true,
            ...(ratio !== 1 && engine === 'firefox' ? { firefoxUserPrefs: { 'layout.css.devPixelsPerPx': String(ratio) } } : {}),
        });
        const context = await browser.newContext({ viewport: { width, height: 1000 }, ...(ratio !== 1 ? { deviceScaleFactor: ratio } : {}) });
        const page = await context.newPage();
        /** @type {Map<string, { hash: string, previous?: string, earlier?: Record<string, string>, lines?: string[] }>} */
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
                /** @type {Record<string, { key: string, hash: string, previous?: string, earlier?: Record<string, string>, lines?: string[] }[]>} */ (
                    result.results
                ),
            )) {
                for (const row of rows)
                    out.set(`${row.key}|${theme}`, {
                        hash: row.hash,
                        ...(row.previous ? { previous: row.previous } : {}),
                        ...(row.earlier ? { earlier: row.earlier } : {}),
                        ...(withLines ? { lines: row.lines } : {}),
                    });
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
