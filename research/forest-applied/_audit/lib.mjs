// @ts-nocheck: scratch audit tooling, not shipped
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(fileURLToPath(new URL('../../..', import.meta.url)));
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml', '.png': 'image/png' };

export function serve() {
    const server = createServer((req, res) => {
        const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([\\/])+/, '');
        const file = join(ROOT, path);
        if (!file.startsWith(ROOT) || !existsSync(file) || !extname(file)) { res.writeHead(404).end(); return; }
        res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file));
    });
    return new Promise((done) => server.listen(0, '127.0.0.1', () => done(server)));
}

/** Open a page in theme forest, motion allowed, judged blocks unhidden. */
export async function openForest(browser, url, { width = 1280, height = 900 } = {}) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'no-preference' });
    await context.addInitScript(() => { try { localStorage.setItem('theme', 'forest'); } catch {} });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'forest');
        // judged blocks only: a block (and the components around it) that the judging bar hid
        for (const el of document.querySelectorAll('.cat-block[hidden], .cat-component[hidden], .cat-section[hidden], .cat-group[hidden]')) el.removeAttribute('hidden');
    });
    return { context, page };
}
