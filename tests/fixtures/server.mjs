// A static file server for the browser tests, and nothing more.
//
// ES modules cannot be loaded over file://, and the whole point of these
// tests is that both channels load the way a consumer loads them: the
// framework-free script as a module the browser fetches, the React mount
// as a bundle. So the repository is served over http, read-only, from the
// port the Playwright config names.
//
// Deliberately not a dependency: twenty lines of node:http beat a package
// whose transitive tree we would have to keep an eye on.

import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import process from 'node:process';

const ROOT = new URL('../../', import.meta.url).pathname.replace(/\/$/, '');
const PORT = Number(process.env.PORT ?? 4173);

const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.jsx': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
};

createServer(async (req, res) => {
    // normalize() collapses `..`, and the prefix check refuses anything
    // that still points outside the repository.
    const path = join(ROOT, normalize(decodeURIComponent((req.url ?? '/').split('?')[0])));
    if (!path.startsWith(ROOT)) {
        res.writeHead(403).end('forbidden');
        return;
    }
    try {
        const info = await stat(path);
        if (info.isDirectory()) {
            res.writeHead(404).end('not found');
            return;
        }
        res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' });
        createReadStream(path).pipe(res);
    } catch {
        res.writeHead(404).end('not found');
    }
}).listen(PORT, () => console.log(`fixtures on http://127.0.0.1:${PORT}`));
