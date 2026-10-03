// No ornament touches a dialog title's letters, in any theme (Kenny,
// 2026-10-03: grotesk's "red line above the title is touching the text").
//
// Measured on the package as the catalogue renders it (overlays.html, the
// frozen dialog): the title is photographed three times, with its letters
// only, with its ornaments (::before, ::after) only, and with neither. Per
// pixel column, the nearest ornament pixel and letter pixel must stand at
// least MIN_GAP CSS pixels apart; touching or overlapping fails.
//
//   flock /tmp/kp-themes-shot.lock node research/dialog-title/check-clear.mjs [theme …]
//
// Needs the repo served on 127.0.0.1:8735. Exits 1 on any failure.
import { chromium } from '/home/kenny/Projects/kp-themes/node_modules/playwright/index.mjs';
import { THEMES } from '../../js/theme-registry.js';

const MIN_GAP = 2;
const themes = process.argv.slice(2).length ? process.argv.slice(2) : THEMES.map((t) => t.name);
const browser = await chromium.launch();
const failures = [];

for (const theme of themes) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce', deviceScaleFactor: 2 });
    await context.addInitScript((t) => {
        try {
            localStorage.setItem('theme', t);
        } catch {}
    }, theme);
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:8735/catalogue/overlays.html', { timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    const title = page.locator('#dialog .kp-dialog__title').first();
    await title.scrollIntoViewIfNeeded();
    const box = await title.boundingBox();
    // Wide enough to hold ornaments that stand outside the title's box.
    const clip = { x: box.x - 24, y: box.y - 24, width: box.width + 48, height: box.height + 48 };
    const style = (css) => page.evaluate((css) => {
        let tag = document.getElementById('clear-check');
        if (!tag) {
            tag = document.createElement('style');
            tag.id = 'clear-check';
            document.head.append(tag);
        }
        tag.textContent = css;
    }, css);
    const T = '#dialog .kp-dialog__title';
    const HIDE_TEXT = `${T} { color: transparent !important; -webkit-text-fill-color: transparent !important; text-shadow: none !important; }`;
    const HIDE_ORN = `${T}::before, ${T}::after { visibility: hidden !important; }`;
    const shot = async () => (await page.screenshot({ clip, animations: 'disabled' })).toString('base64');
    await style(`${HIDE_TEXT} ${HIDE_ORN}`);
    const bare = await shot();
    await style(HIDE_ORN);
    const letters = await shot();
    await style(HIDE_TEXT);
    const ornaments = await shot();
    await style('');
    const gap = await page.evaluate(
        async ({ bare, letters, ornaments }) => {
            const load = (src) =>
                new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.src = `data:image/png;base64,${src}`;
                });
            const imgs = await Promise.all([bare, letters, ornaments].map(load));
            const data = imgs.map((img) => {
                const c = document.createElement('canvas');
                c.width = img.width;
                c.height = img.height;
                const ctx = c.getContext('2d');
                ctx.drawImage(img, 0, 0);
                return ctx.getImageData(0, 0, c.width, c.height).data;
            });
            const [w, h] = [imgs[0].width, imgs[0].height];
            const differs = (a, b, i) => Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 30;
            let best = Infinity;
            let any = false;
            for (let x = 0; x < w; x++) {
                const text = [];
                const orn = [];
                for (let y = 0; y < h; y++) {
                    const i = (y * w + x) * 4;
                    if (differs(data[1], data[0], i)) text.push(y);
                    if (differs(data[2], data[0], i)) orn.push(y);
                }
                if (!text.length || !orn.length) continue;
                any = true;
                for (const o of orn) for (const t of text) best = Math.min(best, Math.abs(o - t));
            }
            return any ? best / 2 : null; // device pixels to CSS pixels
        },
        { bare, letters, ornaments },
    );
    if (gap !== null && gap < MIN_GAP) failures.push(`${theme}: an ornament comes within ${gap}px of the title's letters`);
    else console.log(`ok ${theme}: ${gap === null ? 'no ornament shares a column with the letters' : `${gap}px clear`}`);
    await context.close();
}

await browser.close();
if (failures.length) {
    console.error(`${failures.length} theme(s) where an ornament touches the dialog title:\n  ${failures.join('\n  ')}`);
    process.exit(1);
}
console.log(`no ornament touches the dialog title in ${themes.length} theme(s)`);
