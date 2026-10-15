// research/leftover-looks: photographs the two sections at the given widths, to look at. Not a test; no gate runs it.
//   node research/leftover-looks/shots.mjs <outDir> <widths,comma> [port]
import { mkdirSync } from 'node:fs';
import { firefox } from 'playwright';

const [out, widthList = '1280,390', port = '8793'] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const browser = await firefox.launch();
for (const width of widthList.split(',').map(Number)) {
    const ctx = await browser.newContext({ viewport: { width, height: width < 600 ? 900 : 1000 }, reducedMotion: 'no-preference' });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => console.log('pageerror:', e.message));
    page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && console.log('console:', m.type(), m.text()));
    await page.goto(`http://127.0.0.1:${port}/research/leftover-looks/demo.html`, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    // the catalogue's fixed header and Top button lie over a section photographed on its own
    await page.evaluate(() => {
        for (const el of document.querySelectorAll('body *')) if (['fixed', 'sticky'].includes(getComputedStyle(el).position)) el.style.visibility = 'hidden';
    });
    const overflow = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    console.log(width, 'scrollWidth', overflow.sw, 'clientWidth', overflow.cw);
    await page.locator('#phantom-plate').screenshot({ path: `${out}/phantom-${width}.png` });
    await page.locator('#deco-inlay').screenshot({ path: `${out}/deco-${width}-closed.png` });
    for (const place of ['start', 'middle', 'end']) {
        await page.locator(`#deco-inlay [data-lo-open="${place}"]`).first().click();
        await page.waitForTimeout(1800);
        await page.locator('#deco-inlay').screenshot({ path: `${out}/deco-${width}-${place}.png` });
        await page.locator(`#deco-inlay [data-lo-open="${place}"]`).first().click();
        await page.waitForTimeout(900);
    }
    // the first moment of the draw, held
    await page.locator('#deco-inlay [data-lo-hold]').first().click();
    for (const place of ['start', 'middle', 'end']) {
        await page.locator(`#deco-inlay [data-lo-open="${place}"]`).first().click();
        await page.waitForTimeout(600);
        await page.locator('#deco-inlay').screenshot({ path: `${out}/deco-${width}-${place}-held.png` });
        await page.locator(`#deco-inlay [data-lo-open="${place}"]`).first().click();
        await page.waitForTimeout(500);
    }
    await ctx.close();
}
await browser.close();
