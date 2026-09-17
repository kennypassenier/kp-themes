// Measures when a page's resources are ready against when its intro ends
// [scope-85]. Research only; nothing in css/, js/ or the tests changes.
//
//   KP_TEST_PORT=4511 node research/intro-loading/measure.mjs [--engine=chromium|firefox] [--quick] </dev/null
//
// Starts serve.mjs on KP_TEST_PORT (its own process, stopped when done), then
// loads examples/concept.html in firefox and chromium with the theme stored
// in localStorage, the way a returning reader arrives, and writes
// out/results.json. Each case is a pair: a cold load in a fresh browser
// context, then a warm one in a new tab of the same context (same HTTP cache,
// new sessionStorage, so the intro plays again).
//
// Timings are performance.now() on the page, from navigation start. Frames
// are logged from requestAnimationFrame, which runs once per rendering
// update and not while rendering is blocked, so the first frame is the first
// paint in both engines (chromium's paint entry is recorded beside it).
import { chromium, firefox } from 'playwright';
import { writeFile, mkdir } from 'node:fs/promises';
import process from 'node:process';
import { startServer } from './serve.mjs';

const PORT = Number(process.env.KP_TEST_PORT ?? 4511);
const BASE = `http://127.0.0.1:${PORT}`;
const OUT = new URL('./out/', import.meta.url);
const QUICK = process.argv.includes('--quick');
const DISCOVER = process.argv.includes('--discover');
const ENGINE = process.argv.find((a) => a.startsWith('--engine='))?.slice(9) ?? null;

/** Runs on every page before any of its own scripts. */
const INSTRUMENT = () => {
    const m = { marks: {}, frames: [], fontsReady: null };
    // @ts-ignore
    window.__m = m;
    const now = () => Math.round(performance.now());
    const mark = (k) => {
        if (m.marks[k] === undefined) m.marks[k] = now();
    };
    const theme = () => document.documentElement.getAttribute('data-theme');
    new MutationObserver((records) => {
        for (const r of records) {
            if (r.type === 'childList') {
                for (const n of r.addedNodes) if (n.nodeType === 1 && n.classList.contains('kp-boot')) mark('arrivalStart');
                for (const n of r.removedNodes) if (n.nodeType === 1 && n.classList.contains('kp-boot')) mark('arrivalEnd');
            } else if (r.type === 'attributes') {
                const el = r.target;
                if (r.attributeName === 'data-kp-text' && el.matches('[data-kp-reveal="headline"]')) mark('attach');
                if (r.attributeName === 'data-kp-reveal-state' && el === document.documentElement)
                    m.marks.arrivalState = el.getAttribute('data-kp-reveal-state');
                if (r.attributeName === 'data-kp-reveal-state' && el.matches('[data-kp-reveal="headline"]')) mark('headlineEnd');
                if (r.attributeName === 'class' && el.classList.contains('kp-boot') && el.classList.contains('is-off')) mark('arrivalOff');
                if (r.attributeName === 'data-kp-veil' && el.getAttribute('data-kp-veil') !== 'on') mark('veilOff');
                if (r.attributeName === 'data-kp-effects-done') mark('effectsDone');
            }
        }
    }).observe(document, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['data-kp-text', 'data-kp-reveal-state', 'class', 'data-kp-veil', 'data-kp-effects-done'],
    });
    document.addEventListener('DOMContentLoaded', () => {
        mark('dcl');
        requestAnimationFrame(() =>
            requestAnimationFrame(() =>
                document.fonts.ready.then(() => {
                    mark('fontsReady');
                }),
            ),
        );
    });
    document.fonts.addEventListener('loadingdone', () => (m.marks.lastFontDone = now()));
    window.addEventListener('load', () => mark('load'));
    const faceOk = (el) => {
        if (!el) return null;
        const cs = getComputedStyle(el);
        try {
            return document.fonts.check(`${cs.fontStyle} ${cs.fontWeight} 16px ${cs.fontFamily}`, el.textContent?.trim().slice(0, 8) || 'A');
        } catch {
            return null;
        }
    };
    let last = '';
    const frame = () => {
        const html = document.documentElement;
        const h1 = document.querySelector('[data-kp-reveal="headline"]');
        const boot = document.querySelector('.kp-boot');
        const veil = html.getAttribute('data-kp-veil');
        const row = {
            boot: boot ? (boot.classList.contains('is-off') ? 'off' : 'on') : '',
            veil: veil ?? '',
            bg: document.body ? getComputedStyle(document.body).backgroundColor : '',
            h1Font: faceOk(h1),
            bodyFont: document.body ? faceOk(document.querySelector('p') ?? document.body) : null,
            bootFont: boot ? faceOk(boot.querySelector('.kp-boot__line')) : null,
            h1Text: h1 ? (h1.textContent ?? '').slice(0, 14) : null,
            theme: theme(),
        };
        const key = JSON.stringify(row);
        if (key !== last) {
            last = key;
            m.frames.push({ t: now(), ...row });
        }
        if (m.frames.length === 1 && m.marks.firstFrame === undefined) m.marks.firstFrame = m.frames[0].t;
        if (now() < 30000) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
};

/** After the page has settled: resource timing and paint entries. */
const COLLECT = () => {
    // @ts-ignore
    const m = window.__m;
    const nav = performance.getEntriesByType('navigation')[0];
    const res = performance.getEntriesByType('resource');
    const by = (re) => res.filter((r) => re.test(new URL(r.name).pathname));
    const max = (list) => (list.length ? Math.round(Math.max(...list.map((r) => r.responseEnd))) : null);
    const paint = Object.fromEntries(performance.getEntriesByType('paint').map((p) => [p.name, Math.round(p.startTime)]));
    const css = by(/\.css$/);
    const js = by(/\.js$/);
    const fonts = by(/\.woff2$/);
    return {
        marks: { ...m.marks, navResponseEnd: Math.round(nav.responseEnd), dclNav: Math.round(nav.domContentLoadedEventStart) },
        paint,
        css: { count: css.length, end: max(css), register: max(by(/-register\.css$/)) },
        js: { count: js.length, end: max(js) },
        fonts: { count: fonts.length, end: max(fonts), urls: fonts.map((f) => new URL(f.name).pathname) },
        jsUrls: js.map((r) => new URL(r.name).pathname),
        frames: m.frames,
        finalText: document.querySelector('[data-kp-reveal="headline"]')?.textContent ?? '',
    };
};

const ARRIVAL_THEMES = new Set(['synthwave', 'terminal', 'retro', 'phantom']);

/** Flash analysis over the frame log. */
function analyse(r, theme) {
    const f = r.frames;
    if (!f.length) return {};
    const endT = f[f.length - 1].t + 16;
    const finalBg = f[f.length - 1].bg;
    const covered = (row) => row.boot === 'on' || row.veil === 'on';
    // document.fonts.check() stays false for a face the page never needs; a
    // span only counts when the same element reads true by the end.
    const lastOf = (key) => [...f].reverse().find((row) => row[key] !== null)?.[key];
    const trust = { h1Font: lastOf('h1Font') === true, bodyFont: lastOf('bodyFont') === true, bootFont: f.some((row) => row.bootFont === true) };
    const fallback = (row, key) => trust[key] && row[key] === false;
    const spans = { unthemed: 0, fallbackFont: 0, fallbackFontInIntro: 0, pageBeforeIntro: 0, headlineAtRestBeforeReveal: 0 };
    for (let i = 0; i < f.length; i++) {
        const row = f[i];
        const until = i + 1 < f.length ? f[i + 1].t : endT;
        const dt = Math.max(0, until - row.t);
        if (!covered(row)) {
            if (row.bg !== finalBg) spans.unthemed += dt;
            if (fallback(row, 'h1Font') || fallback(row, 'bodyFont')) spans.fallbackFont += dt;
            if (ARRIVAL_THEMES.has(theme) && r.marks.arrivalStart !== undefined && row.t < r.marks.arrivalStart) spans.pageBeforeIntro += dt;
            if (r.marks.attach !== undefined && row.t < r.marks.attach && row.h1Text === r.finalText.slice(0, 14))
                spans.headlineAtRestBeforeReveal += dt;
        } else if (row.boot === 'on' && fallback(row, 'bootFont')) spans.fallbackFontInIntro += dt;
    }
    const firstFrame = f[0].t;
    const lastCover = Math.max(r.marks.arrivalEnd ?? 0, r.marks.veilOff ?? 0);
    // What the reader waits for: the page itself, uncovered and in its own fonts.
    const fontOkAt = (() => {
        for (let i = 0; i < f.length; i++) if (f.slice(i).every((x) => !fallback(x, 'h1Font') && !fallback(x, 'bodyFont'))) return f[i].t;
        return null;
    })();
    return {
        firstFrame,
        pageUncovered: Math.max(firstFrame, lastCover),
        pageFinal: Math.max(firstFrame, lastCover, fontOkAt ?? 0),
        resourcesReady: Math.max(r.css.end ?? 0, r.marks.dcl ?? 0, r.marks.fontsReady ?? 0),
        spans: Object.fromEntries(Object.entries(spans).map(([k, v]) => [k, Math.round(v)])),
        fontCheckTrusted: trust,
    };
}

async function load(context, url, theme, { cdp = false, reuse = null } = {}) {
    const page = reuse ?? (await context.newPage());
    if (!reuse) {
        await page.addInitScript(
            ({ theme }) => {
                try {
                    localStorage.setItem('theme', theme);
                } catch {}
            },
            { theme },
        );
        await page.addInitScript(INSTRUMENT);
    }
    if (cdp && !reuse) {
        const session = await context.newCDPSession(page);
        await session.send('Network.enable');
        await session.send('Network.emulateNetworkConditions', {
            offline: false,
            latency: 562.5,
            downloadThroughput: 180000,
            uploadThroughput: 84375,
        });
    }
    await fetch(`${BASE}/__hits`);
    if (reuse) await page.reload({ waitUntil: 'load', timeout: 60000 });
    else await page.goto(url, { waitUntil: 'load', timeout: 60000 });
    await page
        .waitForFunction(
            () => {
                // @ts-ignore
                const m = window.__m;
                const k = m.marks;
                const boot = document.querySelector('.kp-boot');
                const veil = document.documentElement.hasAttribute('data-kp-veil');
                return (
                    k.load !== undefined && k.fontsReady !== undefined && !boot && !veil && (k.headlineEnd !== undefined || performance.now() > 12000)
                );
            },
            null,
            { timeout: 40000, polling: 50 },
        )
        .catch(() => {});
    await page.waitForTimeout(250);
    const r = await page.evaluate(COLLECT);
    r.serverHits = (await (await fetch(`${BASE}/__hits`)).json()).hits;
    return { page, r };
}

function url(net, route, option, theme) {
    const q = new URLSearchParams();
    q.set('route', route);
    if (option !== 'A') q.set('option', option);
    q.set('theme', theme);
    return `${BASE}/net/${net}/examples/concept.html?${q}`;
}

async function pair(browser, engine, c) {
    const context = await browser.newContext({ reducedMotion: c.reduced ? 'reduce' : 'no-preference', viewport: { width: 1280, height: 800 } });
    const net = c.cdp ? 'none' : c.net;
    const u = url(net, c.route, c.option, c.theme);
    const out = [];
    const cold = await load(context, u, c.theme, { cdp: c.cdp });
    out.push({ ...c, engine, cache: 'cold', ...cold.r, analysis: analyse(cold.r, c.theme) });
    if (c.reload) {
        const again = await load(context, u, c.theme, { reuse: cold.page });
        out.push({ ...c, engine, cache: 'warm-same-tab', ...again.r, analysis: analyse(again.r, c.theme) });
    } else {
        await cold.page.close();
        const warm = await load(context, u, c.theme, { cdp: c.cdp });
        out.push({ ...c, engine, cache: 'warm', ...warm.r, analysis: analyse(warm.r, c.theme) });
    }
    await context.close();
    return out;
}

function cases() {
    const list = [];
    const themes = ['synthwave', 'terminal', 'retro', 'phantom', 'cyberpunk'];
    const nets = ['none', 'fast3g'];
    const routes = ['eager', 'lazy'];
    if (DISCOVER) {
        for (const theme of themes) list.push({ theme, route: 'eager', net: 'none', option: 'A' });
        return list;
    }
    for (const route of routes)
        for (const net of nets) for (const theme of QUICK ? ['synthwave'] : themes) list.push({ theme, route, net, option: 'A' });
    const optionThemes = { B: ['synthwave', 'phantom'], C: ['synthwave', 'cyberpunk'], D: ['synthwave', 'cyberpunk'] };
    for (const option of ['B', 'C', 'D'])
        for (const route of routes)
            for (const net of nets)
                for (const theme of QUICK ? optionThemes[option].slice(0, 1) : optionThemes[option]) list.push({ theme, route, net, option });
    // Reduced motion: what a reader who asked for less motion sees while loading.
    for (const option of ['A', 'C']) list.push({ theme: 'synthwave', route: 'lazy', net: 'fast3g', option, reduced: true });
    // Once per session: the same tab loads the page again.
    list.push({ theme: 'synthwave', route: 'lazy', net: 'fast3g', option: 'A', reload: true });
    return list;
}

await mkdir(OUT, { recursive: true });
const server = await startServer(PORT);
const results = [];
try {
    for (const [engine, type] of [
        ['chromium', chromium],
        ['firefox', firefox],
    ].filter(([name]) => !ENGINE || name === ENGINE)) {
        const browser = await type.launch();
        const list = cases();
        if (engine === 'chromium' && !DISCOVER) {
            // The server's throttle cross-checked against chromium's own.
            for (const route of ['eager', 'lazy']) list.push({ theme: 'synthwave', route, net: 'fast3g-cdp', option: 'A', cdp: true });
        }
        for (const c of list) {
            const rows = await pair(browser, engine, c);
            for (const row of rows) {
                const a = row.analysis;
                const k = row.marks;
                console.log(
                    [
                        engine,
                        row.option,
                        row.route,
                        row.net,
                        row.cache,
                        row.theme,
                        row.reduced ? 'reduced' : '',
                        `hits=${row.serverHits}`,
                        `paint=${a.firstFrame}`,
                        `css=${row.css.end}`,
                        `dcl=${k.dcl}`,
                        `attach=${k.attach}`,
                        `fonts=${k.fontsReady}`,
                        `intro=${k.arrivalStart ?? '-'}..${k.arrivalEnd ?? '-'}`,
                        `veilOff=${k.veilOff ?? '-'}`,
                        `final=${a.pageFinal}`,
                        JSON.stringify(a.spans),
                    ].join(' '),
                );
                results.push(row);
            }
        }
        await browser.close();
    }
} finally {
    server.close();
    server.closeAllConnections?.();
}

if (DISCOVER) {
    const modules = [...new Set(results.flatMap((r) => r.jsUrls))].map((p) => `..${p.replace(/^\/net\/[a-z0-9-]+/, '')}`);
    const fontsByTheme = {};
    for (const r of results.filter((x) => x.engine === 'chromium'))
        fontsByTheme[r.theme] = [...new Set(r.fonts.urls)].map((p) => `..${p.replace(/^\/net\/[a-z0-9-]+/, '')}`);
    await writeFile(new URL('../proto/preload-hints.json', OUT), JSON.stringify({ modules, fontsByTheme }, null, 4) + '\n');
    console.log(`preload-hints.json: ${modules.length} modules, fonts for ${Object.keys(fontsByTheme).length} themes`);
} else {
    for (const r of results) r.frames = r.frames.slice(0, 60);
    await writeFile(
        new URL(QUICK ? 'results-quick.json' : `results${ENGINE ? `-${ENGINE}` : ''}.json`, OUT),
        JSON.stringify(results, null, 1) + '\n',
    );
}
