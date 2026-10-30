// The `settle` command: decide the approvals `pixels` left unstable.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REGISTER } from '../check-verdicts.mjs';
import { ROOT, git } from './paths.mjs';
import { readRegister, today, writeRegister } from './register.mjs';

/**
 * Bring the register up to what the REVIEW page reads, theme by theme, at one
 * zoom [fix-49].
 *
 * Kenny judges on `catalogue/index.html` at a zoom of 2.222, and the tools
 * read the blocks on their own component pages at whatever zoom they were
 * told. Measured 2026-09-16: 2919 of 3062 pairs held a hash the review page
 * does not read at his zoom, so those blocks asked to be judged again on
 * every visit, whatever he answered. This reads every block where he reads
 * it, and records the reading under the verdict it already carries — a
 * rejection stays a rejection.
 *
 * It is the reviewer's surface, so it is only run when he asks for it
 * ("fix het", 2026-09-16); the guard of fix-45 stands for everything else.
 * @param {string[]} args
 */
export async function settle(args) {
    const option = (/** @type {string} */ name, /** @type {string} */ fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
    const width = Number(option('--width', '1920'));
    const { serve } = await import('../verdict-hashes.mjs');
    const playwright = await import('@playwright/test');
    const server = await serve(ROOT);
    const browser = await playwright.firefox.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    const page = await context.newPage();
    /** @type {Record<string, Record<string, string>>} */
    const readings = {};
    try {
        await page.goto(`${server.base}/catalogue/index.html`);
        await page.waitForFunction("document.querySelectorAll('.cat-block[id]').length > 100", null, { timeout: 180_000 });
        const themes = /** @type {string[]} */ (JSON.parse(readFileSync(join(ROOT, 'themes/order.json'), 'utf8')));
        for (const theme of themes) {
            // Since scope-114 the hash reads the inputs, so the theme only has
            // to stand on the root element: no register to paint, no reading to
            // settle, one page load for all 22 themes.
            await page.evaluate(`document.documentElement.setAttribute('data-theme', ${JSON.stringify(theme)})`);
            readings[theme] = await page.evaluate(async () => {
                /** @type {any} */ const win = window;
                const { COMPONENT_PAGES } = await win.eval("import('/catalogue/pages.js')");
                const { readPage } = await win.eval("import('/catalogue/review.js')");
                const { readBlocks } = await win.eval("import('/catalogue/block-hash.js')");
                const pages = await Promise.all(COMPONENT_PAGES.map(readPage));
                const sources = new Map(
                    pages.flatMap((/** @type {any} */ one) => one.blocks.map((/** @type {any} */ block) => [block.id, block.source])),
                );
                const blocks = [...document.querySelectorAll('.cat-block[id]')];
                const read = await readBlocks(blocks.map((root) => ({ root, source: sources.get(root.id) ?? root.outerHTML })));
                return Object.fromEntries(blocks.map((block, i) => [block.id, read[i].hash]));
            });
            console.log(`${theme}: ${Object.keys(readings[theme]).length} block(s) read`);
        }
    } finally {
        await browser.close();
        await server.close();
    }
    const register = readRegister();
    const commit = git('rev-parse', 'HEAD');
    let moved = 0;
    let same = 0;
    for (const [theme, hashes] of Object.entries(readings)) {
        for (const [key, hash] of Object.entries(hashes)) {
            const entry = register.verdicts[key]?.[theme]?.firefox;
            if (!entry) continue;
            if (entry.hash === hash) {
                same += 1;
                continue;
            }
            moved += 1;
            entry.hash = hash;
            entry.commit = commit;
            entry.given = today();
            delete entry.ratio;
        }
    }
    writeRegister(register);
    console.log(`${REGISTER}: ${same} pair(s) already read what the review page reads, ${moved} brought up to it.`);
}

/* ---------------------------------------------------------------- snapshot */
