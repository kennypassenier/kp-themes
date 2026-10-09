// The open/close pair meter [Kenny, 2026-10-09: "sluiten moet het omgekeerde zijn van openen"].
//
// For every pair a theme opens and closes (a menu, a dialog, a panel, a tour
// card ...) this records EVERY frame of the opening and of the closing - not
// a few paused ones - and compares the closing with the opening played
// backwards. The animations are paused the moment the pair is triggered and
// sought to N+1 fixed fractions of their own length, so the frames are exact
// and no timing noise comes into it.
//
// A pair passes only when, all at once:
//   1. the closing takes as long as the opening (within DURATION_TOLERANCE);
//   2. frame f of the opening and frame (1 - f) of the closing differ by at
//      most TOLERANCE of what the whole gesture changes on screen (the part
//      AND what is in it: a content that vanishes at once fails here);
//   3. once the closing has played out the screen is the one before the
//      opening (nothing stays visible, nothing jumped).
//
// Usage: node gates/measure-pairs.mjs [--theme forest] [--only id,id] [--engine firefox|chromium]
//        [--keep] (keeps the frames in test-results/pairs/ for looking at)

import { createServer } from 'node:http';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { chromium, firefox } from '@playwright/test';
import { PAIRS } from './measure-pairs.pairs.mjs';

export const TOLERANCE = 0.06;
export const DURATION_TOLERANCE = 0.06;
const FRAMES = 20;

const args = process.argv.slice(2);
const flag = (name, fallback) => {
    const at = args.indexOf(`--${name}`);
    return at === -1 ? fallback : (args[at + 1] ?? true);
};
const theme = flag('theme', 'forest');
const only = String(flag('only', '')).split(',').filter(Boolean);
const engine = flag('engine', 'firefox');
const keep = args.includes('--keep');
const probe = args.includes('--probe');

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
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

function serve() {
    const server = createServer((req, res) => {
        const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([\\/])+/, '');
        const file = join(ROOT, path);
        if (!file.startsWith(ROOT) || !existsSync(file)) {
            res.writeHead(404).end();
            return;
        }
        res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' }).end(readFileSync(file));
    });
    return new Promise((done) => server.listen(0, '127.0.0.1', () => done(server)));
}

/**
 * Pause what the action started, then keep that set for seeking.
 * @param {import('@playwright/test').Page} page
 */
async function startPaused(page, act, label) {
    await act(page);
    const { ms, list } = await page.evaluate(() => {
        const list = document
            .getAnimations()
            .filter((a) => !window.__ambient.has(a) && Number.isFinite(Number(a.effect?.getComputedTiming().endTime)) && Number(a.effect.getComputedTiming().iterations) !== Infinity);
        for (const a of list) a.pause();
        window.__pair = list;
        const name = (el) => (el ? `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''}` : '?');
        return {
            ms: Math.max(0, ...list.map((a) => Number(a.effect.getComputedTiming().endTime))),
            list: list.map((a) => {
                const t = a.effect.getComputedTiming();
                return `${name(a.effect.target)}${a.effect.pseudoElement ?? ''} ${a.animationName ?? a.transitionProperty ?? 'script'} delay ${Math.round(Number(t.delay))} end ${Math.round(Number(t.endTime))} ${a.effect.getTiming().direction}`;
            }),
        };
    });
    if (probe) console.log(`  ${label}: ${list.length} animations\n    ${list.join('\n    ')}`);
    return ms;
}

const seek = (page, ms) =>
    page.evaluate((t) => {
        for (const a of window.__pair) a.currentTime = Math.min(t, Number(a.effect.getComputedTiming().endTime));
    }, ms);

/** Decode PNG frames in a scratch page and return mean absolute difference tools. */
async function differ(browser) {
    const page = await browser.newPage();
    await page.setContent('<canvas id="c"></canvas>');
    return {
        page,
        /** @param {string[]} a base64 frames @param {string[]} b */
        async compare(a, b) {
            return page.evaluate(
                async ({ a, b }) => {
                    const px = async (b64) => {
                        const blob = await (await fetch(`data:image/png;base64,${b64}`)).blob();
                        const bmp = await createImageBitmap(blob);
                        const c = new OffscreenCanvas(bmp.width, bmp.height);
                        const ctx = c.getContext('2d');
                        ctx.drawImage(bmp, 0, 0);
                        return ctx.getImageData(0, 0, bmp.width, bmp.height).data;
                    };
                    const mad = (x, y) => {
                        let s = 0;
                        for (let i = 0; i < x.length; i += 4) s += Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2]);
                        return s / (x.length / 4) / 3 / 255;
                    };
                    const A = await Promise.all(a.map(px));
                    const B = await Promise.all(b.map(px));
                    return { A: A.length, mad: A.map((x, i) => mad(x, B[i])) };
                },
                { a, b },
            );
        },
    };
}

/** @returns {Promise<{ id: string, ok: boolean, notes: string[], worst: number, open: number, close: number }>} */
async function measure(browser, differPage, base, pair) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    await page.goto(`${base}/research/forest-applied/demo.html`);
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({ content: 'html{scroll-behavior:auto!important}' });
    await pair.setup?.(page);
    await page.locator(pair.section ?? 'body').first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.evaluate(() => {
        window.__ambient = new Set(document.getAnimations());
        for (const a of window.__ambient) a.pause();
    });
    const shot = async () => (await page.screenshot()).toString('base64');
    const notes = [];
    const closed = await shot();

    const openMs = await startPaused(page, pair.open, "open");
    if (openMs <= 0) notes.push('the opening runs no animation at all');
    const opening = [];
    for (let i = 0; i <= FRAMES; i++) {
        await seek(page, (openMs * i) / FRAMES);
        opening.push(await shot());
    }
    // Let it settle for real.
    await page.evaluate(() => window.__pair.forEach((a) => a.finish()));
    await page.waitForTimeout(500);
    const open = await shot();

    const closeMs = await startPaused(page, pair.close, "close");
    if (closeMs <= 0) notes.push('the closing runs no animation at all: it is gone at once');
    const closing = [];
    for (let i = 0; i <= FRAMES; i++) {
        await seek(page, (closeMs * i) / FRAMES);
        closing.push(await shot());
    }
    await page.evaluate(() => window.__pair.forEach((a) => a.finish()));
    await page.waitForTimeout(700);
    const after = await shot();

    if (keep) {
        mkdirSync('test-results/pairs', { recursive: true });
        const save = (name, b64) => writeFileSync(`test-results/pairs/${pair.id}-${name}.png`, Buffer.from(b64, 'base64'));
        opening.forEach((f, i) => save(`open-${String(i).padStart(2, '0')}`, f));
        closing.forEach((f, i) => save(`close-${String(i).padStart(2, '0')}`, f));
        save('closed', closed);
        save('after', after);
    }

    // the whole gesture's change on screen = the scale every difference is read against
    const whole = (await differPage.compare([closed], [open])).mad[0] || 1e-6;
    const reversed = closing.slice().reverse();
    const { mad } = await differPage.compare(opening, reversed);
    const diffs = mad.map((d) => d / whole);
    const worst = Math.max(...diffs);
    const at = diffs.indexOf(worst);
    const gone = (await differPage.compare([closed], [after])).mad[0] / whole;

    if (closeMs > 0 && Math.abs(closeMs - openMs) / Math.max(openMs, 1) > DURATION_TOLERANCE)
        notes.push(`the closing lasts ${Math.round(closeMs)} ms, the opening ${Math.round(openMs)} ms`);
    if (closeMs > 0 && worst > TOLERANCE) notes.push(`the closing is not the opening backwards: ${(worst * 100).toFixed(1)} % off at frame ${at}/${FRAMES}`);
    if (gone > 0.01) notes.push(`after the closing the screen is not the one from before the opening: ${(gone * 100).toFixed(1)} % left over`);
    await context.close();
    return { id: pair.id, ok: notes.length === 0, notes, worst, open: openMs, close: closeMs };
}

const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await (engine === 'chromium' ? chromium : firefox).launch();
const { page: differPage, compare } = await differ(browser);
const results = [];
for (const pair of PAIRS.filter((p) => only.length === 0 || only.includes(p.id))) {
    try {
        const r = await measure(browser, { compare }, base, pair);
        results.push(r);
        console.log(`${r.ok ? 'ok  ' : 'FAIL'} ${r.id.padEnd(22)} open ${Math.round(r.open)} ms, close ${Math.round(r.close)} ms, worst ${(r.worst * 100).toFixed(1)} %`);
        for (const n of r.notes) console.log(`       - ${n}`);
    } catch (error) {
        results.push({ id: pair.id, ok: false });
        console.log(`ERR  ${pair.id.padEnd(22)} ${String(error.message).split('\n')[0]}`);
    }
}
await differPage.close();
await browser.close();
server.close();
process.exitCode = results.every((r) => r.ok) ? 0 : 1;
console.log(`\n${results.filter((r) => r.ok).length} of ${results.length} pairs pass (theme ${theme})`);
