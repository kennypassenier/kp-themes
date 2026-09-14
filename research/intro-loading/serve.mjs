// The measuring server for research/intro-loading [scope-85].
//
// tests/fixtures/server.mjs answers every file with `cache-control: no-store`,
// so a browser behind it never has a warm cache and never sees a slow network.
// This one serves the same repository the way a static host does — gzip for
// text, `max-age=600` like GitHub Pages — and can slow itself down:
//
//   /net/none/<path>    as fast as the machine
//   /net/fast3g/<path>  every response waits 562 ms before its first byte and
//                       all responses share one 180 kB/s budget (Chrome
//                       DevTools' "Fast 3G": 562.5 ms RTT, 1.44 Mbit/s down)
//
// Server-side, so it throttles firefox and chromium identically; measure.mjs
// cross-checks it against chromium's own CDP throttling. A throttled path
// keeps its prefix, so every relative URL the page asks for is throttled too.
//
// `examples/concept.html` takes three query parameters that rewrite the page
// on the way out, never the file on disk:
//
//   route=lazy     drop the 22 register links and write the stored theme's
//                  register from the no-flash snippet (scope-50's route)
//   option=B|C|D   insert the prototype of that option (proto/intro-proto.js)
//
// Run alone: `KP_TEST_PORT=4511 node research/intro-loading/serve.mjs`.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { gzipSync } from 'node:zlib';
import process from 'node:process';

const ROOT = new URL('../../', import.meta.url).pathname.replace(/\/$/, '');
const HERE = new URL('./', import.meta.url).pathname;

const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.woff2': 'font/woff2',
    '.json': 'application/json; charset=utf-8',
};

export const PROFILES = {
    none: { latencyMs: 0, bytesPerSecond: Infinity },
    fast3g: { latencyMs: 562, bytesPerSecond: 180_000 },
};

const THEMES = JSON.parse(await readFile(join(ROOT, 'themes/order.json'), 'utf8'));
const themeNames = (Array.isArray(THEMES) ? THEMES : (THEMES.order ?? THEMES.themes)).map((t) => (typeof t === 'string' ? t : t.name));

/** One shared budget per profile, like a single link. */
const buckets = new Map();
function bucketOf(name) {
    if (!buckets.has(name)) buckets.set(name, { next: 0 });
    return buckets.get(name);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** @param {import('node:http').ServerResponse} res @param {Buffer} body @param {string} profileName */
async function send(res, body, profileName) {
    const profile = PROFILES[profileName];
    if (profile.latencyMs) await sleep(profile.latencyMs);
    if (!Number.isFinite(profile.bytesPerSecond)) {
        res.end(body);
        return;
    }
    const bucket = bucketOf(profileName);
    const chunk = 4096;
    for (let offset = 0; offset < body.length; offset += chunk) {
        const piece = body.subarray(offset, offset + chunk);
        // Reserve this piece's slot on the shared link, then wait for it.
        const now = Date.now();
        const start = Math.max(now, bucket.next);
        bucket.next = start + (piece.length / profile.bytesPerSecond) * 1000;
        if (bucket.next - now > 1) await sleep(bucket.next - now);
        if (res.destroyed) return;
        res.write(piece);
    }
    res.end();
}

const read = (p) => readFile(join(HERE, p), 'utf8');

/** The page rewrites, applied to examples/concept.html only. */
async function rewrite(html, params) {
    let out = html;
    if (params.get('route') === 'lazy') {
        out = out.replace(/\s*<link rel="stylesheet" href="\.\.\/css\/[a-z-]+-register\.css" \/>/g, '');
        const names = JSON.stringify(themeNames);
        const snippet = `
        <script>
            (function () {
                var d = document.documentElement;
                var n = d.getAttribute('data-theme');
                if (${names}.indexOf(n) < 0) n = 'formal';
                document.write('<link rel="stylesheet" href="../css/' + n + '-register.css" data-kp-register="' + n + '" blocking="render">');
            })();
        </script>`;
        out = out.replace(
            '<link rel="stylesheet" href="../css/utilities.css" />',
            () => `<link rel="stylesheet" href="../css/utilities.css" />${snippet}`,
        );
    }
    const option = params.get('option');
    if (option === 'B' || option === 'C') {
        const proto = await read('proto/intro-proto.js');
        const style = await read('proto/intro-proto.css');
        const head = `
        <style>${style}</style>
        <script>${proto}</script>
        <script>kpIntroProto.head(${JSON.stringify({ option, maxMs: Number(params.get('max') ?? 4000) })});</script>`;
        // <body> first: the inlined prototype mentions <body> in its comments.
        out = out.replace(/<body([^>]*)>/, (_, attrs) => `<body${attrs}>\n        <script>kpIntroProto.body();</script>`);
        out = out.replace('</head>', () => `${head}\n    </head>`);
    }
    if (option === 'D') {
        const hints = JSON.parse(await read('proto/preload-hints.json'));
        const theme = params.get('theme') ?? '';
        const links = [
            ...hints.modules.map((href) => `<link rel="modulepreload" href="${href}" />`),
            ...(hints.fontsByTheme[theme] ?? []).map((href) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="${href}" />`),
        ].join('\n        ');
        out = out.replace(
            '<link rel="stylesheet" href="../css/fonts.css" />',
            () => `${links}\n        <link rel="stylesheet" href="../css/fonts.css" />`,
        );
    }
    return out;
}

export function startServer(port = Number(process.env.KP_TEST_PORT ?? 4511)) {
    let hits = 0;
    const server = createServer(async (req, res) => {
        const url = new URL(req.url ?? '/', 'http://x');
        if (url.pathname === '/__hits') {
            res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' }).end(JSON.stringify({ hits }));
            hits = 0;
            return;
        }
        let profile = 'none';
        let pathname = url.pathname;
        const m = /^\/net\/(none|fast3g)(\/.*)$/.exec(pathname);
        if (m) {
            profile = m[1];
            pathname = m[2];
        }
        const path = join(ROOT, normalize(decodeURIComponent(pathname)));
        if (!path.startsWith(ROOT)) {
            res.writeHead(403).end('forbidden');
            return;
        }
        try {
            const info = await stat(path);
            if (info.isDirectory()) throw new Error('dir');
            hits++;
            const type = extname(path);
            let body = await readFile(path);
            if (pathname === '/examples/concept.html' && url.search) body = Buffer.from(await rewrite(body.toString('utf8'), url.searchParams));
            const headers = { 'content-type': TYPES[type] ?? 'application/octet-stream', 'cache-control': 'max-age=600' };
            if (type !== '.woff2' && /gzip/.test(String(req.headers['accept-encoding'] ?? ''))) {
                body = gzipSync(body);
                headers['content-encoding'] = 'gzip';
            }
            headers['content-length'] = String(body.length);
            res.writeHead(200, headers);
            await send(res, body, profile);
        } catch {
            if (!res.headersSent) res.writeHead(404).end('not found');
        }
    });
    return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const server = await startServer();
    console.log(`intro-loading server on http://127.0.0.1:${server.address().port}`);
}
