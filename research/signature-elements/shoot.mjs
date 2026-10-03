// Screenshots of demo.html, Playwright firefox. Needs the repo served on
// 127.0.0.1:8735 (python3 -m http.server 8735 --bind 127.0.0.1, from the repo root).
// node research/signature-elements/shoot.mjs [theme ...]
import { firefox } from '/home/kenny/Projects/kp-themes/node_modules/@playwright/test/index.mjs';
import { mkdirSync } from 'node:fs';

const out = new URL('./out/', import.meta.url).pathname;
mkdirSync(out, { recursive: true });
const full = process.argv.slice(2).length ? process.argv.slice(2) : ['formal', 'cyberpunk', 'retro'];
const closeUps = full; // every theme asked for gets its close-ups
const sections = ['spinner', 'skeleton', 'switch', 'check', 'toast', 'dialog', 'tooltip', 'steps', 'empty', 'link'];
const url = (t) => `http://127.0.0.1:8735/research/signature-elements/demo.html?theme=${t}`;

const browser = await firefox.launch();
for (const [w, h, tag] of [
    [1280, 900, 'desktop'],
    [390, 844, 'phone'],
]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    for (const t of full) {
        await page.goto(url(t));
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(1500);
        await page.screenshot({ path: `${out}${t}-${tag}.png`, fullPage: true });
        if (tag === 'desktop' && closeUps.includes(t)) {
            for (const s of sections) {
                await page.locator(`[data-sx="${s}"]`).screenshot({ path: `${out}${s}-${t}.png` });
            }
        }
    }
    await page.close();
}
await browser.close();
console.log('done', full.join(' '));
