// Every skeleton line starts at the inline-start edge, in every theme (Kenny,
// 2026-10-03, twice: shade-light in round one, formal in round two — "dat is
// lelijk en moet in elke skeleton links beginnen").
//
// Measured, not grepped: for each theme the signature skeleton is
// photographed in its still state (reduced motion) with and without its
// lines, and per line the first column where the two differ is its leftmost
// paint. A line whose paint starts more than 1px right of the skeleton box's
// edge fails, whatever drew the gap: a margin, a padding, an indent, an
// inset pseudo-element, a right alignment.
//
//   flock /tmp/kp-themes-shot.lock node research/signature-elements/check-flush.mjs [theme …]
//
// Needs the repo served on 127.0.0.1:8735. Exits 1 on any failure. Run it
// before a skeleton is shown to Kenny.
import { chromium } from '/home/kenny/Projects/kp-themes/node_modules/playwright/index.mjs';
import { THEMES } from '../../js/theme-registry.js';

const themes = process.argv.slice(2).length ? process.argv.slice(2) : THEMES.map((t) => t.name);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
const failures = [];

for (const theme of themes) {
    await page.goto(`http://127.0.0.1:8735/research/signature-elements/demo.html?theme=${theme}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    const box = page.locator('.sx-sig .sx-skel').first();
    await box.scrollIntoViewIfNeeded();
    const shot = async () => (await box.screenshot({ animations: 'disabled' })).toString('base64');
    const withLines = await shot();
    await page.addStyleTag({ content: '.sx-sig .sx-skel > * { visibility: hidden !important; }' });
    const without = await shot();
    const result = await page.evaluate(
        async ({ a, b }) => {
            const load = (src) =>
                new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.src = `data:image/png;base64,${src}`;
                });
            const [ia, ib] = await Promise.all([load(a), load(b)]);
            const read = (img) => {
                const c = document.createElement('canvas');
                c.width = img.width;
                c.height = img.height;
                const ctx = c.getContext('2d');
                ctx.drawImage(img, 0, 0);
                return ctx.getImageData(0, 0, c.width, c.height).data;
            };
            const [pa, pb] = [read(ia), read(ib)];
            const width = ia.width;
            const host = document.querySelector('.sx-sig .sx-skel');
            const top = host.getBoundingClientRect().top;
            const scale = width / host.getBoundingClientRect().width;
            return [...host.children].map((line, index) => {
                const r = line.getBoundingClientRect();
                const y0 = Math.max(0, Math.floor((r.top - top) * scale));
                const y1 = Math.min(ia.height, Math.ceil((r.bottom - top) * scale));
                let left = Infinity;
                for (let y = y0; y < y1; y++) {
                    for (let x = 0; x < Math.min(left, width); x++) {
                        const i = (y * width + x) * 4;
                        if (Math.abs(pa[i] - pb[i]) + Math.abs(pa[i + 1] - pb[i + 1]) + Math.abs(pa[i + 2] - pb[i + 2]) > 8) {
                            left = x;
                            break;
                        }
                    }
                }
                return { index, left: left === Infinity ? null : left / scale };
            });
        },
        { a: withLines, b: without },
    );
    const bad = result.filter((line) => line.left === null || line.left > 1);
    const text = result.map((l) => (l.left === null ? 'nothing painted' : `${l.left.toFixed(1)}px`)).join(', ');
    if (bad.length) failures.push(`${theme}: line(s) ${bad.map((l) => l.index + 1).join(', ')} start right of the edge (${text})`);
    else console.log(`ok ${theme}: ${text}`);
}

await browser.close();
if (failures.length) {
    console.error(`${failures.length} theme(s) with a skeleton line that does not start at the left edge:\n  ${failures.join('\n  ')}`);
    process.exit(1);
}
console.log(`every skeleton line starts at the left edge in ${themes.length} theme(s)`);
