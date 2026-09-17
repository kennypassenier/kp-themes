// Opens demo.html in firefox and chromium and photographs the side-by-side
// windows as a simulated load runs, so the demo is checked before it is shown.
//
//   KP_TEST_PORT=4511 node research/intro-loading/verify-demo.mjs </dev/null
//
// Writes out/demo-<engine>-<seconds>s.png and prints every page error and
// each window's readout.
import { chromium, firefox } from 'playwright';
import process from 'node:process';
import { startServer } from './serve.mjs';

const PORT = Number(process.env.KP_TEST_PORT ?? 4511);
const server = await startServer(PORT);
const errors = [];
try {
    for (const [name, type] of [
        ['chromium', chromium],
        ['firefox', firefox],
    ]) {
        const browser = await type.launch();
        const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
        page.on('pageerror', (e) => errors.push(`${name} pageerror: ${e.message}`));
        page.on('console', (m) => m.type() === 'error' && errors.push(`${name} console: ${m.text()}`));
        await page.goto(`http://127.0.0.1:${PORT}/research/intro-loading/demo.html`, { waitUntil: 'load' });
        const grid = page.locator('#side-by-side .il-grid');
        await grid.scrollIntoViewIfNeeded();
        const start = Date.now();
        for (const at of [3.0, 6.2, 9.5]) {
            await page.waitForTimeout(Math.max(0, at * 1000 - (Date.now() - start)));
            await grid.screenshot({ path: new URL(`./out/demo-${name}-${at}s.png`, import.meta.url).pathname });
        }
        const readouts = await page.locator('[data-il-readout]').allTextContents();
        console.log(name, JSON.stringify(readouts, null, 1));
        await page.locator('#held-open .il-grid').screenshot({ path: new URL(`./out/demo-${name}-held.png`, import.meta.url).pathname });
        await browser.close();
    }
} finally {
    server.close();
    server.closeAllConnections?.();
}
console.log(errors.length ? errors.join('\n') : 'no page errors');
