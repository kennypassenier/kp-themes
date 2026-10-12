// @ts-nocheck: scratch audit tooling, not shipped
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

export const THEME = process.env.KP_THEME || 'cyberpunk';
export const ROOT = resolve(fileURLToPath(new URL('../../..', import.meta.url)));
const MIME = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.mjs': 'text/javascript',
    '.json': 'application/json',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
};

export function serve() {
    const server = createServer((req, res) => {
        const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([\\/])+/, '');
        const file = join(ROOT, path);
        if (!file.startsWith(ROOT) || !existsSync(file) || !extname(file)) {
            res.writeHead(404).end();
            return;
        }
        let body = readFileSync(file);
        // the cyberpunk applied demo, re-dressed in the theme under audit (its register, its data-theme)
        if (THEME !== 'cyberpunk' && /research[\\/]cyberpunk-applied[\\/]demo\.html$/.test(file))
            body = body
                .toString()
                .replace('cyberpunk-register.css" data-kp-register="cyberpunk"', `${THEME}-register.css" data-kp-register="${THEME}"`)
                .replace(/(data-theme|data-cat-theme|data-review-themes)="cyberpunk"/g, `$1="${THEME}"`);
        res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' }).end(body);
    });
    return new Promise((done) => server.listen(0, '127.0.0.1', () => done(server)));
}

/** Open a page in theme $KP_THEME (default cyberpunk), motion allowed, judged blocks unhidden. */
export async function openTheme(browser, url, { width = 1280, height = 900 } = {}) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'no-preference' });
    await context.addInitScript((t) => {
        try {
            localStorage.setItem('theme', t);
        } catch {}
    }, THEME);
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'load' });
    // a theme's boot screen (synthwave's tape, a terminal's lines) covers the page until it has played
    await page.waitForFunction(() => !document.querySelector('.kp-boot'), null, { timeout: 8000 }).catch(() =>
        page.evaluate(() => document.querySelectorAll('.kp-boot').forEach((e) => e.remove())),
    );
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    await page.evaluate((t) => {
        document.documentElement.setAttribute('data-theme', t);
        // judged blocks only: a block (and the components around it) that the judging bar hid
        for (const el of document.querySelectorAll('.cat-block[hidden], .cat-component[hidden], .cat-section[hidden], .cat-group[hidden]'))
            el.removeAttribute('hidden');
    }, THEME);
    return { context, page };
}
