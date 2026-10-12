// @ts-nocheck: scratch audit tooling for the cyberpunk review, not shipped
// (e) Every loading / busy / spinner / skeleton / progress picture in the demo and the catalogue pages:
// which animations it runs (own, pseudo, descendants) and what words it draws (the on-screen word LOADING).
//   node research/cyberpunk-applied/_audit/loading.mjs [--engine firefox|chromium|both]
import { mkdirSync, writeFileSync } from 'node:fs';
import process from 'node:process';
import { chromium, firefox } from '@playwright/test';
import { serve, openTheme, ROOT } from './lib.mjs';

const args = process.argv.slice(2);
const i = args.indexOf('--engine');
const engines = i === -1 || args[i + 1] === 'both' ? ['firefox', 'chromium'] : [args[i + 1]];
const PAGES = [
    '/research/cyberpunk-applied/demo.html',
    ...[
        'button',
        'feedback',
        'structure',
        'data',
        'table',
        'chart',
        'field',
        'media',
        'upload',
        'combobox',
        'datepicker',
        'navigation',
        'overlays',
        'alarm',
    ].map((p) => `/catalogue/${p}.html`),
];

function inPage() {
    const SEL =
        '.kp-spinner, .kp-skeleton, [data-kp-indeterminate], [aria-busy="true"], [data-kp-loading], [data-kp-tone="loading"], .kp-progressbar, .kp-datatable__busy-panel, .kp-datatable__busy-overlay, [data-kp-busy]';
    const seen = new Map();
    const label = (a) =>
        `${a.animationName ?? a.transitionProperty ?? 'script'}${a.effect.pseudoElement ?? ''}:${Math.round(Number(a.effect.getComputedTiming().duration))}ms:${a.effect.getComputedTiming().iterations === Infinity ? 'loop' : 'once'}:${a.effect.getTiming().easing.slice(0, 14)}`;
    const nameOf = (el) =>
        `${el.tagName.toLowerCase()}${[...el.classList]
            .filter((c) => c.startsWith('kp-'))
            .slice(0, 2)
            .map((c) => '.' + c)
            .join(
                '',
            )}${el.hasAttribute('data-kp-indeterminate') ? '[indeterminate]' : ''}${el.getAttribute('aria-busy') === 'true' ? '[busy]' : ''}${el.hasAttribute('data-kp-loading') ? '[loading]' : ''}${el.getAttribute('data-kp-tone') === 'loading' ? '[tone=loading]' : ''}`;
    for (const el of document.querySelectorAll(SEL)) {
        if (el.closest('.cat-bar, [data-cat-judge], [data-cat-chrome], [hidden]')) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) continue;
        const name = nameOf(el);
        if (seen.has(name)) {
            seen.get(name).n++;
            continue;
        }
        const own = [],
            words = [];
        for (const pe of [null, '::before', '::after']) {
            const cs = getComputedStyle(el, pe);
            if (pe && (cs.content === 'none' || cs.content === 'normal')) continue;
            if (pe) words.push(`${pe} ${cs.content.slice(0, 30)}`);
        }
        const all = [el, ...el.querySelectorAll('*')];
        const anims = new Set();
        for (const a of document.getAnimations()) {
            const t = a.effect?.target;
            if (t && (t === el || el.contains(t))) anims.add(label(a));
        }
        for (const d of el.querySelectorAll('*'))
            for (const pe of ['::before', '::after']) {
                const cs = getComputedStyle(d, pe);
                if (cs.content !== 'none' && cs.content !== 'normal' && /load|wait|busy|work/i.test(cs.content))
                    words.push(`${d.tagName.toLowerCase()}${pe} ${cs.content.slice(0, 30)}`);
            }
        seen.set(name, {
            name,
            n: 1,
            text: el.textContent.trim().slice(0, 30),
            size: `${Math.round(r.width)}x${Math.round(r.height)}`,
            words,
            anims: [...anims],
            bg: getComputedStyle(el).backgroundImage.slice(0, 70),
            color: getComputedStyle(el).color,
        });
    }
    return [...seen.values()];
}

const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
mkdirSync(`${ROOT}/research/cyberpunk-applied/_audit/out`, { recursive: true });
for (const engine of engines) {
    const browser = await (engine === 'chromium' ? chromium : firefox).launch();
    const out = {};
    for (const pg of PAGES) {
        const { context, page } = await openTheme(browser, `${base}${pg}`);
        try {
            if (pg.includes('demo.html')) {
                out[pg + '#loading'] = await (async () => {
                    await page.evaluate(() => document.getElementById('loading')?.scrollIntoView());
                    await page.waitForTimeout(500);
                    return page.evaluate(inPage);
                })();
                // the table and the calendar busy
                await page.evaluate(() => document.getElementById('table')?.scrollIntoView());
                await page.locator('[data-fa-table="busy"]').click();
                await page.waitForTimeout(1500);
                out[pg + '#table-busy'] = await page.evaluate(inPage);
                await page.locator('[data-fa-table="ready"]').click();
                await page.waitForTimeout(1500);
                await page.evaluate(() => document.getElementById('calendar')?.scrollIntoView());
                await page.locator('[data-fa-calendar="loading"]').click();
                await page.waitForTimeout(1500);
                out[pg + '#calendar-busy'] = await page.evaluate(inPage);
                await page.locator('[data-fa-calendar="ready"]').click();
            } else out[pg] = await page.evaluate(inPage);
        } catch (e) {
            out[pg] = { error: String(e.message).split('\n')[0] };
        }
        await context.close();
    }
    writeFileSync(`${ROOT}/research/cyberpunk-applied/_audit/out/loading-${engine}.json`, JSON.stringify(out, null, 1));
    await browser.close();
    console.log(engine, 'done');
}
server.close();
