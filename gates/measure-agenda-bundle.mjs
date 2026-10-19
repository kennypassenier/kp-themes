// Does the bundled Agenda (catalogue/agenda-bundle/) compute what the module tree computed? Firefox opens
// catalogue/agenda.html twice per scenario, once as it was before the bundle (the page text of a git revision, served
// at the same address, so location and every import.meta.url match) and once as it is now, and this compares what the
// two pages end up with: the whole <main>, the Saved verdicts and Done folds, the catalogue blocks laid out in the
// fold, and the browser storage the page left behind. It also reports the requests, the transferred bytes and the
// time to the first view and to idle (median of three) for both. A measuring script, not a test.
//
//   node gates/measure-agenda-bundle.mjs <before-checkout>
//
// <before-checkout> is a checkout of the revision before the bundle (git worktree add --detach <dir> <revision>): the
// "before" page is served from there, whole, with its own module tree, so the comparison covers every source change
// of the bundle's commit as well as the bundle.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { firefox } from 'playwright';
import { serve } from './verdict-hashes.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const beforeRoot = fileURLToPath(new URL(`file://${process.argv[2]?.replace(/\/?$/, '/')}`));
const index = JSON.parse(readFileSync(`${root}catalogue/agenda-index.json`, 'utf8'));

/** Stored state for the first demos: verdicts, notes, a journal and an answer, in a pattern that covers every state. */
function seeded() {
    /** @type {Record<string, string>} */
    const storage = {};
    Object.values(index.demos)
        .slice(0, 14)
        .forEach((/** @type {any} */ demo, n) => {
            const themes = (demo.facts.themes || 'formal')
                .split(',')
                .map((/** @type {string} */ t) => t.trim())
                .filter(Boolean);
            /** @type {Record<string, any>} */
            const store = {};
            /** @type {Record<string, any>[]} */
            const journal = [];
            demo.facts.sections.forEach((/** @type {any} */ section, /** @type {number} */ i) => {
                for (const theme of section.themes ? section.themes.split(/[\s,]+/) : themes) {
                    const mode = (i + n) % 4;
                    if (mode === 3) continue;
                    const verdict = mode === 0 ? 'approved' : 'rejected';
                    const note = verdict === 'rejected' ? `note ${i}` : '';
                    store[`${theme}|${section.item}`] = { verdict, note, fingerprint: demo.fingerprint };
                    journal.push({
                        at: '2026-10-18T10:00:00.000Z',
                        demo: demo.facts.id,
                        round: '',
                        pair: `${theme}|${section.item}`,
                        verdict,
                        note,
                        choice: null,
                    });
                }
            });
            storage[`kp-demo-review:${demo.facts.id}`] = JSON.stringify(store);
            storage[`kp-demo-review:${demo.facts.id}:journal`] = JSON.stringify(journal);
            if (n % 3 === 0)
                storage[`kp-demo-review:${demo.facts.id}:answer`] = JSON.stringify({ text: 'an answer', at: '2026-10-18T10:00:00.000Z' });
        });
    return storage;
}

const SCENARIOS = [
    { name: 'empty storage, real register', storage: {}, register: false, runs: 3 },
    { name: 'seeded storage, real register', storage: seeded(), register: false, runs: 3 },
    { name: 'seeded storage, empty register (every block open)', storage: seeded(), register: true, runs: 2 },
];

const server = await serve(root, {});
const oldServer = await serve(beforeRoot, {});
let browser = await firefox.launch();

/** Firefox's compositor sometimes dies with every theme's blocks on screen: a visit that loses its page is run again. @param {boolean} old @param {typeof SCENARIOS[number]} scenario */
async function visit(old, scenario, tries = 3) {
    try {
        return await visitOnce(old, scenario);
    } catch (error) {
        if (tries > 1 && /closed|crash/i.test(String(error))) {
            browser = await firefox.launch();
            return visit(old, scenario, tries - 1);
        }
        throw error;
    }
}

/** @param {boolean} old @param {typeof SCENARIOS[number]} scenario */
async function visitOnce(old, scenario) {
    const context = await browser.newContext();
    await context.addInitScript((storage) => {
        for (const [k, v] of Object.entries(storage)) localStorage.setItem(k, v);
        // the clock starts at a fixed day (and runs), so a relative "3 days ago" is the same in both runs
        const fixed = new Date('2026-10-19T08:00:00Z').getTime();
        const RealDate = Date;
        // @ts-ignore
        globalThis.Date = class extends RealDate {
            /** @param {any[]} args */
            constructor(...args) {
                // @ts-ignore
                super(...(args.length ? args : [fixed + Math.round(performance.now())]));
            }
            static now() {
                return fixed + Math.round(performance.now());
            }
        };
    }, scenario.storage);
    const page = await context.newPage();
    const from = old ? oldServer : server;
    const url = `${from.base}catalogue/agenda.html`;
    if (scenario.register) await page.route('**/catalogue/verdicts.json', (route) => route.fulfill({ json: { hashVersion: 10, verdicts: {} } }));
    /** @type {[string, number][]} */
    const requests = [];
    page.on('response', async (response) => {
        try {
            requests.push([response.url().replace(from.base, ''), (await response.body()).length]);
        } catch {
            requests.push([response.url().replace(from.base, ''), 0]);
        }
    });
    const t0 = Date.now();
    await page.goto(url, { waitUntil: 'load' });
    const load = Date.now() - t0;
    await page.waitForFunction(() => document.querySelector('[data-agenda-waiting]')?.getAttribute('aria-busy') !== 'true', null, {
        timeout: 600000,
    });
    const first = Date.now() - t0;
    await page.waitForFunction(
        () => !document.querySelector('[aria-busy="true"]') && !document.querySelector('[data-agenda-start]')?.hasAttribute('disabled'),
        null,
        {
            timeout: 600000,
        },
    );
    // idle: nothing left to fetch for half a second
    let seen = -1;
    while (seen !== requests.length) {
        seen = requests.length;
        await page.waitForTimeout(500);
    }
    const idle = Date.now() - t0 - 500;
    if (process.env.KP_LOG) console.log(`  ${old ? 'before' : 'after'}: first view ${first} ms, idle ${idle} ms`);
    const firstView = requests.length;
    const firstBytes = requests.reduce((n, r) => n + r[1], 0);
    // lay the blocks out and open the folds, as a reader does
    await page.evaluate(() => {
        for (const d of document.querySelectorAll('details')) d.open = true;
    });
    // laying out every block takes minutes when all of them are open: wait for the fold to settle, then read what is there
    await page.waitForTimeout(Number(process.env.KP_BLOCKS_WAIT ?? 2500));
    await page.waitForFunction(() => !document.querySelector('[aria-busy="true"]'), null, { timeout: 1000 }).catch(() => {});
    const state = await page.evaluate(() => {
        const clean = (/** @type {string} */ html) =>
            html
                .replaceAll(location.origin, '')
                .replace(/127\.0\.0\.1(?::|%3A)\d+/g, '')
                .replace(/\s+/g, ' ')
                .replace(/ (data-(?:id|uid)|id)="[^"]*(?:\d{6,}|[a-z0-9]{8,}-[a-z0-9-]{8,})[^"]*"/g, '');
        const text = (/** @type {string} */ sel) => document.querySelector(sel)?.textContent?.replace(/\s+/g, ' ').trim() ?? null;
        return {
            main: (() => {
                // <main> without the laid-out blocks, which are compared by digest below
                const copy = /** @type {HTMLElement} */ (document.querySelector('main')?.cloneNode(true));
                const host = copy?.querySelector('[data-cat-compose="agenda"]');
                if (host) host.replaceChildren();
                return clean(copy?.innerHTML ?? '');
            })(),
            status: text('[data-agenda-status]'),
            start: text('[data-agenda-start]'),
            next: text('[data-agenda-next]'),
            answers: text('[data-agenda-answers]'),
            saved: text('[data-agenda-saved]'),
            done: text('[data-agenda-done]'),
            ...(() => {
                // the laid-out blocks are megabytes of markup: compared by digest (FNV-1a over the normalised text)
                const host = document.querySelector('[data-cat-compose="agenda"]');
                const digest = (/** @type {string} */ text) => {
                    let h = 0x811c9dc5;
                    for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193) >>> 0;
                    return `${text.length}:${h.toString(16)}`;
                };
                const flat = (/** @type {string} */ text) =>
                    text
                        .replaceAll(location.origin, '')
                        .replace(/127\.0\.0\.1(?::|%3A)\d+/g, '')
                        .replace(/\s+/g, ' ');
                return {
                    // one digest per child of every component section (and per top-level child), so a difference can be placed
                    sections: Object.fromEntries(
                        [...(host?.children ?? [])].flatMap((section, n) =>
                            section.matches('section[id]')
                                ? [...section.children].map((child, i) => [`${section.id}#${i}`, digest(flat(child.innerHTML))])
                                : [[`top#${n}`, digest(flat(section.outerHTML))]],
                        ),
                    ),
                    blockKids: host?.children.length ?? 0,
                    reviewCount: host?.querySelector('[data-cat-review-count]')?.textContent?.trim() ?? null,
                };
            })(),
            blockCount: document.querySelectorAll('[data-cat-compose="agenda"] .cat-block, [data-cat-compose="agenda"] [data-cat-block]').length,
            theme: document.documentElement.dataset.theme,
            href: location.pathname,
            storage: Object.fromEntries(
                Object.keys(localStorage)
                    .sort()
                    .map((k) => [k, clean(localStorage.getItem(k) ?? '')]),
            ),
        };
    });
    await context.close();
    return { state, load, first, idle, firstView, firstBytes, requests };
}

const median = (/** @type {number[]} */ list) => [...list].sort((a, b) => a - b)[Math.floor(list.length / 2)];
let allEqual = true;
for (const [n, scenario] of SCENARIOS.entries()) {
    if (process.env.KP_ONLY && Number(process.env.KP_ONLY) !== n) continue;
    /** @type {Record<'before' | 'after', Awaited<ReturnType<typeof visit>>[]>} */
    const runs = { before: [], after: [] };
    for (let i = 0; i < scenario.runs; i++) {
        runs.before.push(await visit(true, scenario));
        runs.after.push(await visit(false, scenario));
    }
    console.log(`\n## ${scenario.name}`);
    for (const side of /** @type {const} */ (['before', 'after'])) {
        const r = runs[side];
        console.log(
            `${side.padEnd(6)} requests ${median(r.map((x) => x.firstView))}  KB ${Math.round(median(r.map((x) => x.firstBytes)) / 1024)}  load ${median(r.map((x) => x.load))} ms  first view ${median(r.map((x) => x.first))} ms  idle ${median(r.map((x) => x.idle))} ms`,
        );
    }
    const a = runs.before[0].state;
    const b = runs.after[0].state;
    /** @param {any} x @param {any} y keys whose values differ, one level down for the per-section digests */
    const changed = (x, y) => {
        /** @type {string[]} */
        const keys = [];
        for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) {
            if (k === 'sections') {
                for (const j of new Set([...Object.keys(x[k]), ...Object.keys(y[k])])) if (x[k][j] !== y[k][j]) keys.push(`sections.${j}`);
            } else if (JSON.stringify(x[k]) !== JSON.stringify(y[k])) keys.push(k);
        }
        return keys;
    };
    const differ = changed(a, b);
    // a run against itself shows what is noise: the same side twice (the blocks carry live measurements and animation state)
    const noise = new Set([...(runs.before[1] ? changed(a, runs.before[1].state) : []), ...(runs.after[1] ? changed(b, runs.after[1].state) : [])]);
    const real = differ.filter((k) => !noise.has(k));
    console.log(
        `state: ${real.length ? `DIFFERS in ${real.join(', ')}` : 'identical'} (${Object.keys(a).length} fields; ${a.blockCount} blocks laid out; ${Object.keys(a.sections).length} section parts compared; ${differ.length - real.length} parts differ between two runs of the same page and are left out: ${[...noise].slice(0, 6).join(', ') || 'none'})`,
    );
    if (real.length) {
        allEqual = false;
        for (const k of real.slice(0, 5)) {
            const pick = (/** @type {any} */ state) => (k.startsWith('sections.') ? state.sections[k.slice(9)] : state[k]);
            const x = String(JSON.stringify(pick(a)));
            const y = String(JSON.stringify(pick(b)));
            let i = 0;
            while (i < x.length && x[i] === y[i]) i++;
            console.log(
                `  ${k}: first difference at ${i}\n    before ...${x.slice(Math.max(0, i - 80), i + 120)}\n    after  ...${y.slice(Math.max(0, i - 80), i + 120)}`,
            );
        }
    }
    if (process.env.KP_LIST) console.log(runs.after[0].requests.map((r) => `  ${r[1]}\t${r[0]}`).join('\n'));
}
console.log(allEqual ? '\nSTATE EQUAL in every scenario' : '\nSTATE DIFFERS');
await browser.close();
await server.close();
await oldServer.close();
