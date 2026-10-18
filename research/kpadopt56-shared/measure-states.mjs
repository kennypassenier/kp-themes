// Beside the evidence page (a measuring script, not a test): in Firefox, for each of the twelve themes, the numbers under the pairs of
// items 9 to 14 (the shared state faults). It presses the states in the order ready, loading, empty, failed (as the part pages' state
// buttons are pressed), measures both copies (Now and Proposed), and merges the result into measured.json / measured.js, which
// measure.mjs wrote for items 1 to 8 (those are kept as they are).
// Run (a static server on the repository root first):  node research/kpadopt56-shared/measure-states.mjs <port> [theme,theme,...]
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const require = createRequire('/home/kenny/Projects/kp-themes/node_modules/');
const { firefox } = require('playwright-core');
const port = process.argv[2];
if (!port) {
    console.error('usage: node research/kpadopt56-shared/measure-states.mjs <port> [themes]');
    process.exit(2);
}
const ALL = ['formal', 'dark', 'cyberpunk', 'synthwave', 'pastel', 'forest', 'blueprint', 'solstice', 'brutalism', 'deco', 'nostromo', 'titanium'];
const THEMES = process.argv[3] ? process.argv[3].split(',') : ALL;
const here = (f) => fileURLToPath(new URL(f, import.meta.url));

/** [item, slot name, id, what the id measures: heights over all states | busy card at loading | note at a state | inline at loading, states to press] */
const PLAN = [
    ['s9', 'uses', 's9-uses', 'height'], ['s9', 'entity', 's9-entity', 'height'], ['s9', 'claim', 's9-claim', 'height'], ['s9', 'notices', 's9-notices', 'height'],
    ['s10', 'gallery', 's10-gallery', 'busy'], ['s10', 'ops', 's10-ops', 'busy'], ['s10', 'claim', 's10-claim', 'busy'], ['s10', 'avail', 's10-avail', 'busy'], ['s10', 'inspector', 's10-inspector', 'busy'],
    ['s11', 'quote', 's11-quote', 'plate:error'], ['s11', 'today', 's11-today', 'plate:error'], ['s11', 'lede', 's11-lede', 'plate:error'],
    ['s12', 'chart', 's12-chart', 'plate:error'], ['s12', 'usual', 's12-usual-empty', 'plate:empty'], ['s12', 'usual', 's12-usual-error', 'plate:error'], ['s12', 'ops', 's12-ops', 'plate:error'],
    ['s13', 'md', 's13-md', 'plate:error'],
    ['s14', 'inline', 's14-slider', 'inline:.kp-slider'], ['s14', 'inline', 's14-time', 'inline:.kp-time'], ['s14', 'inline', 's14-version', 'inline:.kp-badge--version'],
];
const ORDER = ['ready', 'loading', 'empty', 'error'];

/** In the page: the numbers of one copy of one component in its current state. */
function measureCopy({ item, name, side, kind }) {
    const comp = document.querySelector(`#${item} .${side} [data-slot="${name}"]`).firstElementChild;
    const R = (e) => e.getBoundingClientRect();
    const vis = (e) => {
        const r = R(e);
        const cs = getComputedStyle(e);
        return r.width > 2 && r.height > 2 && cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.05 && !e.closest('[hidden]');
    };
    const c = R(comp);
    const out = { h: Math.round(c.height) };
    if (kind === 'busy') {
        const panels = [...comp.querySelectorAll('.kp-datatable__busy-panel')].filter(vis);
        if (panels.length) {
            const p = R(panels[0]);
            out.dy = Math.round(Math.abs(p.top + p.height / 2 - (c.top + c.height / 2)));
            out.dx = Math.round(Math.abs(p.left + p.width / 2 - (c.left + c.width / 2)));
            out.own = Math.round(Math.max(...panels.map((q) => {
                const host = q.closest('.kp-card');
                if (!host) return 0;
                const h = R(host);
                const r = R(q);
                return Math.abs(r.top + r.height / 2 - (h.top + h.height / 2));
            })));
        } else Object.assign(out, { dy: null, dx: null, own: null });
    } else if (kind.startsWith('plate')) {
        const painted = (e) => {
            const cs = getComputedStyle(e);
            const bg = cs.backgroundColor;
            const hasBg = bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
            return hasBg || ['Top', 'Right', 'Bottom', 'Left'].some((s) => parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none');
        };
        const cand = [...comp.querySelectorAll('.kp-stateplate, .kp-card__failure, .kp-chart__state, .kp-attention__item, .kp-alert, .kp-empty')].filter(vis).filter(painted);
        const plate = cand[0];
        if (!plate) Object.assign(out, { fill: 0, off: null, fs: null, btn: null, none: true });
        else {
            const area = plate.closest('.kp-card__stage, .kp-usual__state') ?? comp;
            const a = R(area);
            const p = R(plate);
            const title = [...plate.querySelectorAll('.kp-stateplate__title, .kp-card__state-title, .kp-attention__text strong, .kp-chart__state-text, strong')].find(vis) ?? plate;
            const btn = [...plate.querySelectorAll('button')].find(vis);
            out.fill = Math.round((p.height / a.height) * 100);
            out.off = Math.round(Math.hypot(p.left + p.width / 2 - (a.left + a.width / 2), p.top + p.height / 2 - (a.top + a.height / 2)));
            out.fs = Math.round(parseFloat(getComputedStyle(title).fontSize));
            out.btn = btn ? Math.round(R(btn).height) : null;
        }
    } else if (kind.startsWith('inline')) {
        const ctrl = comp.querySelector(kind.slice(7));
        const cr = R(ctrl);
        const panel = ctrl.querySelector('.kp-datatable__busy-panel');
        out.ctrl = Math.round(cr.height);
        out.card = panel ? Math.round(panel.offsetHeight) : 0;
        out.over = Math.max(0, out.card - out.ctrl);
    }
    return out;
}

const browser = await firefox.launch({ executablePath: `${process.env.HOME}/.cache/ms-playwright/firefox-1538/firefox/firefox` });
let result = {};
try {
    result = JSON.parse(readFileSync(here('measured.json'), 'utf8'));
} catch {
    // First run: nothing to keep.
}
for (const theme of THEMES) {
    const page = await browser.newPage({ viewport: { width: 1500, height: 900 } });
    page.on('pageerror', (e) => console.log('PAGEERROR', theme, e.message));
    await page.goto(`http://127.0.0.1:${port}/research/kpadopt56-shared/evidence.html?theme=${theme}`);
    await page.waitForSelector('html[data-shared-ready]', { state: 'attached', timeout: 20000 });
    await page.waitForTimeout(2000);
    result[theme] ??= { now: {}, prop: {} };
    // one pass per (item, slot): the states in order, measured on both copies
    const passes = new Map();
    for (const [item, name, id, what] of PLAN) {
        const key = `${item}/${name}`;
        if (!passes.has(key)) passes.set(key, { item, name, ids: [] });
        passes.get(key).ids.push({ id, what });
    }
    for (const { item, name, ids } of passes.values()) {
        const raw = { now: {}, proposal: {} };
        for (const state of ORDER) {
            if (!ids.some(({ what }) => what === 'height' || (what === 'busy' && ['ready', 'loading'].includes(state)) || what.endsWith(`:${state}`) || (what.startsWith('inline') && ['ready', 'loading'].includes(state)) || (what.startsWith('plate') && state === 'ready'))) continue;
            await page.evaluate(([i, n, s]) => window.kpDriveState(i, n, s), [item, name, state]);
            await page.waitForTimeout(state === 'ready' ? 1600 : 1400);
            for (const side of ['now', 'proposal']) {
                raw[side][state] = {};
                for (const kind of new Set(ids.map(({ what }) => (what === 'height' ? 'height' : what.split(':')[0] === 'plate' ? 'plate' : what.startsWith('inline') ? 'inline:' : what)))) {
                    if (kind === 'inline:') {
                        for (const { what } of ids.filter(({ what: w }) => w.startsWith('inline'))) raw[side][state][what] = await page.evaluate(measureCopy, { item, name, side, kind: what });
                    } else raw[side][state][kind] = await page.evaluate(measureCopy, { item, name, side, kind });
                }
            }
        }
        for (const { id, what } of ids) {
            for (const [side, into] of [['now', 'now'], ['proposal', 'prop']]) {
                const r = raw[side];
                let v;
                if (what === 'height') {
                    const ready = r.ready.height.h;
                    v = { ready, loading: Math.abs(r.loading.height.h - ready), empty: Math.abs(r.empty.height.h - ready), error: Math.abs(r.error.height.h - ready), hLoading: r.loading.height.h, hEmpty: r.empty.height.h, hError: r.error.height.h };
                } else if (what === 'busy') v = r.loading.busy;
                else if (what.startsWith('plate')) v = r[what.split(':')[1]].plate;
                else v = r.loading[what];
                result[theme][into][id] = v;
            }
        }
    }
    await page.close();
    console.log(theme, 'done');
}
await browser.close();
writeFileSync(here('measured.json'), JSON.stringify(result, null, 1) + '\n');
writeFileSync(here('measured.js'), `// Written by measure.mjs and measure-states.mjs: do not edit.\nwindow.KP_SHARED_MEASURED = ${JSON.stringify(result)};\n`);
