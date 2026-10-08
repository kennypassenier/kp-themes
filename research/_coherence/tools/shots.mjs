// Screenshots of an anchor demo in Chromium at two widths, mid-drawing and
// held, plus a clipping check and the console errors.
//   node shots.mjs research/<theme>-anchor [port]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const demo = process.argv[2];
const port = process.argv[3] || '8743';
const out = `research/_coherence/out/${demo.replace(/\W+/g, '-')}`;
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const errors = [];
const page = await browser.newPage();
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('requestfailed', (r) => errors.push('failed ' + r.url()));
page.on('response', (r) => r.status() >= 400 && errors.push(r.status() + ' ' + r.url()));
page.on('pageerror', (e) => errors.push(String(e)));
for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.goto(`http://127.0.0.1:${port}/${demo}/demo.html`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const options = page.locator('.an-options');
    const unit = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--an-unit')) || 110);
    for (const [name, at] of [
        ['mid', 2 * unit + 4.5 * unit],
        ['hold', 2 * unit + 8 * unit + 1.5 * unit],
        ['out', 2 * unit + 12 * unit + 4 * unit],
    ]) {
        await page.click('[data-an-replay]');
        await page.waitForTimeout(at);
        await options.screenshot({ path: `${out}/${width}-${name}.png`, animations: 'allow' });
    }
    // Clipping: any part of a scene whose box leaves the scene's box.
    const clipped = await page.evaluate(() => {
        const bad = [];
        for (const scene of document.querySelectorAll('.an-scene')) {
            const s = scene.getBoundingClientRect();
            for (const el of scene.querySelectorAll('*')) {
                const r = el.getBoundingClientRect();
                if (r.width === 0 || r.height === 0) continue;
                if (r.left < s.left - 1 || r.right > s.right + 1 || r.top < s.top - 1 || r.bottom > s.bottom + 1)
                    bad.push(
                        `${scene.dataset.anAnchor}: ${el.className || el.tagName} ${Math.round(r.left - s.left)},${Math.round(r.top - s.top)} ${Math.round(r.width)}x${Math.round(r.height)} vs ${Math.round(s.width)}x${Math.round(s.height)}`,
                    );
            }
            if (scene.scrollWidth > scene.clientWidth + 1)
                bad.push(`${scene.dataset.anAnchor}: scrollWidth ${scene.scrollWidth} > ${scene.clientWidth}`);
        }
        return bad;
    });
    console.log(`${width}px clipping: ${clipped.length ? '\n  ' + clipped.join('\n  ') : 'none'}`);
}
// The review dialog, phone width: open it and shoot the first step.
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`http://127.0.0.1:${port}/${demo}/demo.html`, { waitUntil: 'networkidle' });
await page.waitForTimeout(300);
const open = page.locator('button', { hasText: /Review in a dialog/ }).first();
if (await open.count()) {
    await open.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${out}/dialog-390.png` });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${out}/dialog-1280.png` });
}
console.log(`console errors: ${errors.length ? '\n  ' + errors.join('\n  ') : 'none'}`);
await browser.close();
