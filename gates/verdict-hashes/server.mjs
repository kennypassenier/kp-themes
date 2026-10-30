// A static file server for a worktree (with in-memory overrides) and the review pages it serves.

import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { readFile, stat } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

/** @type {Record<string, string>} */
const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.woff2': 'font/woff2',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
};

/**
 * Serve `root` read-only on a free port of 127.0.0.1.
 * @param {string} root an absolute directory
 * @param {Record<string, string>} [overrides] repository path (`catalogue/block-hash.js`) -> content served instead
 * @returns {Promise<{ base: string, close: () => Promise<void> }>}
 */
export async function serve(root, overrides = {}) {
    const clean = root.replace(/\/$/, '');
    const server = createServer(async (req, res) => {
        const relative = normalize(decodeURIComponent((req.url ?? '/').split('?')[0])).replace(/^\/+/, '');
        const path = join(clean, relative);
        if (!path.startsWith(clean)) {
            res.writeHead(403).end('forbidden');
            return;
        }
        const type = TYPES[extname(path)] ?? 'application/octet-stream';
        if (relative in overrides) {
            res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' }).end(overrides[relative]);
            return;
        }
        try {
            if ((await stat(path)).isDirectory()) throw new Error('directory');
            res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' }).end(await readFile(path));
        } catch {
            res.writeHead(404).end('not found');
        }
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(undefined)));
    const address = /** @type {import('node:net').AddressInfo} */ (server.address());
    return {
        base: `http://127.0.0.1:${address.port}/`,
        close: () =>
            new Promise((resolve) => {
                server.closeAllConnections?.();
                server.close(() => resolve(undefined));
            }),
    };
}

/**
 * The review pages that judge blocks of their own, at a checkout: every
 * component page and every research demo in its catalogue/pages.js.
 * @param {string} root
 * @returns {Promise<{ href: string, label: string, component: boolean }[]>}
 */
export async function blockPages(root) {
    /** @type {{ PAGES: { pages: { href: string, label: string, component?: boolean }[] }[] }} */
    const { PAGES } = await import(`${pathToFileURL(join(root, 'catalogue/pages.js')).href}?t=${Date.now()}`);
    return PAGES.flatMap((group) => group.pages)
        .filter((page) => page.component || page.href.startsWith('research/'))
        .map((page) => ({ href: page.href, label: page.label, component: Boolean(page.component) }));
}
