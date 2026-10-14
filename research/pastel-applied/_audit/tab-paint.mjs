// @ts-nocheck: scratch audit tooling, not shipped
// A real keyboard Tab through the applied demo in $KP_THEME, read from what is PAINTED: for every focus
// stop (one per part signature) the box around the part (8 px of room) is shot while focused and again
// after a blur, and the share of pixels that differ is the focus mark. A stop whose mark changes under
// MIN_PX pixels reads as NOMARK: the keyboard user sees nothing. Firefox.
//   KP_THEME=formal node research/all-themes/_audit/tab-paint.mjs [max-stops]
import { mkdirSync, writeFileSync } from 'node:fs';
import { firefox } from '@playwright/test';
import { serve, openTheme, ROOT, THEME } from './lib.mjs';

const MIN_PX = 16; // a focus mark smaller than this many changed pixels is not seen
const PAD = 8;
const max = +(process.argv[2] ?? 300);
const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await firefox.launch();
const { page } = await openTheme(browser, `${base}/research/pastel-applied/demo.html`);
await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
await page.mouse.move(1, 1);

/** share of pixels that differ by more than a small step in any channel */
const differ = (a, b) =>
    page.evaluate(
        async ([a, b]) => {
            const load = (s) =>
                new Promise((done) => {
                    const i = new Image();
                    i.onload = () => done(i);
                    i.src = `data:image/png;base64,${s}`;
                });
            const [x, y] = await Promise.all([load(a), load(b)]);
            const px = (img) => {
                const c = document.createElement('canvas');
                c.width = img.width;
                c.height = img.height;
                const g = c.getContext('2d');
                g.drawImage(img, 0, 0);
                return g.getImageData(0, 0, c.width, c.height).data;
            };
            const p = px(x),
                q = px(y);
            let n = 0;
            for (let i = 0; i < p.length; i += 4)
                if (Math.abs(p[i] - q[i]) > 24 || Math.abs(p[i + 1] - q[i + 1]) > 24 || Math.abs(p[i + 2] - q[i + 2]) > 24) n++;
            return n;
        },
        [a, b],
    );

const seen = new Set();
const rows = [];
let first = null;
for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(80);
    const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        el.scrollIntoView({ block: 'center' });
        const r = el.getBoundingClientRect();
        const kp = [...el.classList]
            .filter((c) => c.startsWith('kp-'))
            .sort()
            .join('.');
        const sig = `${el.tagName.toLowerCase()}|${kp}|${el.getAttribute('role') ?? ''}|${el.getAttribute('type') ?? ''}`;
        el.setAttribute('data-tab-stop', '');
        return { sig, x: r.x, y: r.y, w: r.width, h: r.height, text: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30) };
    });
    if (!info) continue;
    if (first === info.sig + info.text && i > 3) break; // wrapped round
    first ??= info.sig + info.text;
    if (seen.has(info.sig) || info.w < 4 || info.h < 4) {
        await page.evaluate(() => document.querySelector('[data-tab-stop]')?.removeAttribute('data-tab-stop'));
        continue;
    }
    seen.add(info.sig);
    await page.waitForTimeout(500);
    const vp = page.viewportSize();
    const clip = {
        x: Math.max(0, info.x - PAD),
        y: Math.max(0, info.y - PAD),
        width: Math.min(vp.width - Math.max(0, info.x - PAD), info.w + 2 * PAD),
        height: Math.min(vp.height - Math.max(0, info.y - PAD), info.h + 2 * PAD),
    };
    if (clip.width < 4 || clip.height < 4) continue;
    const on = (await page.screenshot({ clip })).toString('base64');
    await page.evaluate(() => document.activeElement?.blur());
    await page.waitForTimeout(500);
    const off = (await page.screenshot({ clip })).toString('base64');
    const share = await differ(on, off);
    await page.evaluate(() => {
        const el = document.querySelector('[data-tab-stop]');
        el?.focus();
        el?.removeAttribute('data-tab-stop');
    });
    rows.push({ sig: info.sig, text: info.text, px: share, mark: share >= MIN_PX });
}
await browser.close();
server.close();
mkdirSync(`${ROOT}/research/all-themes/_audit/out/${THEME}`, { recursive: true });
writeFileSync(`${ROOT}/research/all-themes/_audit/out/${THEME}/tab-paint.json`, JSON.stringify(rows, null, 1));
const none = rows.filter((r) => !r.mark);
console.log(`${THEME}: ${rows.length} focus stops, ${none.length} without a visible mark`);
for (const r of none) console.log(`  NOMARK ${String(r.px).padStart(5)} px  ${r.sig}  "${r.text}"`);
