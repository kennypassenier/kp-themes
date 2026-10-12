// @ts-nocheck: audit tooling, not shipped
// Every button and link text of the demo, in every state, read from what is PAINTED, not from the
// colour tokens [Kenny, 2026-10-12: the alarm's close button was unreadable: a tiled yellow notch
// line sat under a dark label, and a token check says "dark on yellow, 15:1"]. For each element and
// state (rest, hover, keyboard focus, press) the element's box is screenshotted; the colours that
// fill at least MIN_SHARE of it and are not the text's own (or its antialiasing) are the grounds the
// label sits on, and the worst contrast of the label's computed colour against any of them is the
// element's reading. Firefox. WCAG 2.2 AA is 4.5:1 (3:1 for large text); reported, never a gate.
//   node research/cyberpunk-applied/_audit/contrast-sweep.mjs [--below 4.5]
import process from 'node:process';
import { firefox } from '@playwright/test';
import { serve } from './lib.mjs';

const args = process.argv.slice(2);
const below = Number(args[args.indexOf('--below') + 1]) || 4.5;
const MIN_SHARE = 0.05;
const only = process.env.SWEEP_ONLY ? new RegExp(process.env.SWEEP_ONLY, 'i') : null; // limit by label text, for a quick look

const lum = ([r, g, b]) => {
    const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
};

const server = await serve();
const browser = await firefox.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' });
const page = await context.newPage();
await page.goto(`http://127.0.0.1:${server.address().port}/research/cyberpunk-applied/demo.html`);
await page.evaluate(() => document.fonts.ready);
await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
await page.waitForTimeout(800);

// a scratch page decodes the PNGs
const decoder = await browser.newPage();
await decoder.setContent('<canvas></canvas>');
const grounds = (png, text) =>
    decoder.evaluate(
        async ({ b64, text, MIN_SHARE }) => {
            const blob = await (await fetch(`data:image/png;base64,${b64}`)).blob();
            const bmp = await createImageBitmap(blob);
            const c = new OffscreenCanvas(bmp.width, bmp.height);
            const ctx = c.getContext('2d');
            ctx.drawImage(bmp, 0, 0);
            const d = ctx.getImageData(0, 0, bmp.width, bmp.height).data;
            const bins = new Map();
            let n = 0;
            for (let i = 0; i < d.length; i += 4) {
                const px = [d[i], d[i + 1], d[i + 2]];
                if (Math.abs(px[0] - text[0]) + Math.abs(px[1] - text[1]) + Math.abs(px[2] - text[2]) < 90) continue;
                const k = px.map((v) => v >> 4).join(',');
                const e = bins.get(k) ?? { px, count: 0 };
                e.count++;
                bins.set(k, e);
                n++;
            }
            return [...bins.values()].filter((e) => e.count / Math.max(n, 1) >= MIN_SHARE).map((e) => e.px);
        },
        { b64: png.toString('base64'), text, MIN_SHARE },
    );

const parse = (css) => {
    const m = css.match(/color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)\)/) ?? css.match(/rgba?\((\d+), (\d+), (\d+)/);
    if (!m) return null;
    return css.startsWith('color(') ? [m[1], m[2], m[3]].map((v) => Math.round(Number(v) * 255)) : [m[1], m[2], m[3]].map(Number);
};

const SELECTOR = 'button, a[href], [role="button"], [role="tab"], [role="menuitem"], .kp-button, summary, label.kp-switch';
async function sweep(scopeSelector, label) {
    const total = await page.locator(`${scopeSelector} :is(${SELECTOR})`).count();
    const rows = [];
    for (let i = 0; i < total; i++) {
        const el = page.locator(`${scopeSelector} :is(${SELECTOR})`).nth(i);
        if (!(await el.isVisible())) continue;
        const text = (await el.innerText().catch(() => '')).trim().slice(0, 28);
        const aria = await el.getAttribute('aria-label');
        if (!text && !aria) continue;
        if (only && !only.test(text)) continue;
        if (!text) continue; // an icon-only control has no label text to read
        await el.scrollIntoViewIfNeeded();
        const b = await el.boundingBox();
        if (!b || b.width < 4 || b.height < 4) continue;
        // the inside of the box: a state's edge lines (the split edge, the brackets) are not the ground a label sits on
        const inset = b.height > 20 && b.width > 20 ? 5 : 0;
        const clip = {
            x: Math.max(0, b.x) + inset,
            y: Math.max(0, b.y) + inset,
            width: Math.min(b.width, 1280 - b.x) - 2 * inset,
            height: Math.min(b.height, 900 - b.y) - 2 * inset,
        };
        const states = {
            rest: async () => page.mouse.move(2, 2),
            hover: async () => page.mouse.move(b.x + b.width / 2, b.y + b.height / 2),
            focus: async () => {
                await page.mouse.move(2, 2);
                await el.evaluate((e) => e.focus({ focusVisible: true }));
            },
            press: async () => {
                await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
                await page.mouse.down();
            },
        };
        for (const [state, go] of Object.entries(states)) {
            await go();
            await page.waitForTimeout(450);
            const color = await el.evaluate((e) => getComputedStyle(e).color);
            const fg = parse(color);
            if (!fg) continue;
            const png = await page.screenshot({ clip });
            if (state === 'press') {
                await page.mouse.move(2, 2); // released away from the element: no click fires
                await page.mouse.up();
            }
            await el.evaluate((e) => e.blur());
            const gs = await grounds(png, fg);
            if (gs.length === 0) continue;
            const worst = Math.min(...gs.map((g) => ratio(fg, g)));
            rows.push({
                label,
                text,
                state,
                worst,
                cls: await el.evaluate((e) => `${e.tagName.toLowerCase()}.${String(e.className).split(/\s+/)[0]}`),
            });
        }
    }
    return rows;
}

let rows = [];
// page-level (the modal parts are closed here): everything visible in the sections
rows = rows.concat(await sweep('main, body > header, body > nav, .fa-sec', 'page'));
// the modal parts, opened one by one
for (const [name, open, scope, close] of [
    ['dialog', '[data-kp-dialog="fa-dialog"]', '#fa-dialog', 'Escape'],
    ['drawer', '[data-kp-dialog="fa-drawer"]', '#fa-drawer', 'Escape'],
    ['alarm', '[data-kp-alarm="Pressure lost"]', 'dialog.kp-alarm', null],
    ['palette', '[data-kp-palette-open="fa-pal"]', '#fa-pal', 'Escape'],
]) {
    await page.reload();
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    await page.waitForTimeout(800);
    await page.locator(open).first().scrollIntoViewIfNeeded();
    await page.locator(open).first().click();
    await page.waitForTimeout(400);
    rows = rows.concat(await sweep(scope, name));
    if (close) await page.keyboard.press(close);
    else await page.locator('dialog.kp-alarm .kp-alarm__ack').click();
    await page.waitForTimeout(400);
}
await browser.close();
server.close();

const seen = new Set();
const bad = rows
    .filter((r) => r.worst < below)
    .filter((r) => (seen.has(`${r.cls}|${r.text}|${r.state}`) ? false : seen.add(`${r.cls}|${r.text}|${r.state}`)));
console.log(`${rows.length} readings (element x state); ${bad.length} below ${below}:1`);
for (const r of bad.sort((a, b) => a.worst - b.worst))
    console.log(`${r.worst.toFixed(2).padStart(6)}:1  ${r.state.padEnd(5)} ${r.label.padEnd(8)} ${r.cls.padEnd(28)} "${r.text}"`);
