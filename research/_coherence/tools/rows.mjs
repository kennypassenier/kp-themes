// Screenshots of a character demo's rows at 1280 px (full viewport, so the
// sidebar is included and nothing is cut): copy to tests/tmp-rows.mjs and run
//   node tests/tmp-rows.mjs research/<theme>-character data-<px>-aspect [0,2,5]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const [demo, attr, which = ''] = process.argv.slice(2);
const out = `research/_coherence/out/rows/${demo.replace(/\W+/g, '-')}`;
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage({ viewport: { width: 1280, height: 1400 } });
await page.goto(`http://127.0.0.1:8743/${demo}/demo.html`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const rows = page.locator(`[${attr}]`);
const n = await rows.count();
const want = which ? which.split(',').map(Number) : [...Array(n).keys()];
for (const i of want) {
    const r = rows.nth(i);
    await r.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    const box = await r.boundingBox();
    await page.screenshot({
        path: `${out}/row-${String(i + 1).padStart(2, '0')}.png`,
        clip: { x: 0, y: Math.max(0, box.y), width: 1280, height: Math.min(box.height, 1400) },
        animations: 'allow',
    });
}
console.log('rows', n);
await browser.close();
