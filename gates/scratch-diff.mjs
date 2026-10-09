import { createServer } from 'node:http';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { firefox } from '@playwright/test';

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
const ROOT = resolve('.');
const server = createServer((req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([\\/])+/, '');
    const file = join(ROOT, path);
    if (!file.startsWith(ROOT) || !existsSync(file)) {
        res.writeHead(404).end();
        return;
    }
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file));
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const browser = await firefox.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(`http://127.0.0.1:${port}/research/forest-applied/demo.html`);
await page.locator('#fields').first().scrollIntoViewIfNeeded();

// Add style override to test wipe down
await page.addStyleTag({
    content: `
    @keyframes kp-sig-forest-root {
        from {
            clip-path: inset(0 calc(-1 * var(--kp-sig-fo-reach)) 100% calc(-1 * var(--kp-sig-fo-reach)));
        }
        to {
            clip-path: inset(0 calc(-1 * var(--kp-sig-fo-reach)) calc(-1 * var(--kp-sig-fo-reach)) calc(-1 * var(--kp-sig-fo-reach)));
        }
    }
    `
});

// Pause animations
await page.evaluate(() => {
    window.__ambient = new Set(document.getAnimations());
    for (const a of window.__ambient) a.pause();
    const s = document.querySelector('#fa-f-sev');
    s.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 }));
});

await page.evaluate(() => {
    const list = document.getAnimations().filter(a => !window.__ambient.has(a) && Number.isFinite(Number(a.effect?.getComputedTiming().endTime)));
    for (const a of list) a.pause();
    window.__pair = list;
});

for (const ms of [0, 200, 400, 600, 800, 1000]) {
    await page.evaluate((t) => {
        for (const a of window.__pair) a.currentTime = t;
    }, ms);
    const shot = await page.screenshot({ clip: { x: 500, y: 250, width: 400, height: 250 } });
    writeFileSync(`test-results/select-wipe-${ms}.png`, shot);
}
console.log('Saved select wipe frames');

await browser.close();
server.close();
