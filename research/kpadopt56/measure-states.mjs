// A measuring script (not a test), beside measure-gaps.mjs: in Firefox, for each section of the eleven kpadopt56 pages that has
// loading / empty / failed states, presses each state button and measures DEMO_RULES chapter 3 per component: the component's
// height per state against its loaded height, the state plate's centre against the component's centre, the plate's heading size,
// the Retry / action button's size, the busy card (present, centred, animating), and the section's height change (layout shift).
//
// Run (a static server on the repository root first):
//   node research/kpadopt56/measure-states.mjs <port> <themes> <widths> [part:item ...]   e.g.  8756 solstice 1280,390 lists:claim-row
//   add --shots=<dir> to save one PNG per theme, width, section and state.
import { createRequire } from 'node:module';

const require = createRequire('/home/kenny/Projects/kp-themes/node_modules/');
const { firefox } = require('playwright-core');
const args = process.argv.slice(2);
const shots = args.find((a) => a.startsWith('--shots='))?.slice(8);
const [port, themeArg, widthArg, ...only] = args.filter((a) => !a.startsWith('--'));

/** [part, item, component selector, state-button attribute, state value for ready] */
const SPECS = [
    ['calm', 'calm-tones-states', '.kp-calendar', 'data-kc-cal-state'],
    ['calm', 'quote-states', '#kc-quote-state', 'data-kc-quote-state'],
    ['calm', 'focus-states', '#kc-focus-s', 'data-kc-focus-state'],
    ['charts', 'chart-annotations', 'figure.kp-chart', 'data-kp5-ch-state'],
    ['charts', 'uses-states', '#km-uses-live', 'data-km-uses-state'],
    ['charts', 'trace-states', '#kv-trace-states', 'data-kv-trace-state'],
    ['charts', 'availability-grid', '.kp-availability', 'data-ks-av-state'],
    ['choose', 'usual-states', '#kc-usual-s', 'data-kc-usual-state'],
    ['choose', 'intent-states', '.kp-palette', 'data-kv-intent-state'],
    ['choose', 'dated-states', '#kt-dated-live', 'data-kt-dated-state'],
    ['fields', 'slider-states', '.kp-slider', 'data-kt-slider-state'],
    ['fields', 'time-field', '#ks-time', 'data-ks-time-state'],
    ['fields', 'autosize-states', '.kp-autosize__frame', 'data-km-auto-state'],
    ['fields', 'rating-states', '#kc-rate-state', 'data-kc-rating-state'],
    ['lists', 'claim-row', '#ks-claim', 'data-ks-claim-state'],
    ['lists', 'master-detail', '.kp-split', 'data-ko-md-state'],
    ['lists', 'interactive-console', '.kp-console', 'data-ks-con-state'],
    ['lists', 'ops-page', '.kp-ops', 'data-ko-ops-state'],
    ['lists', 'payload-cell', '.kp-datatable', 'data-k5-last'],
    ['lists', 'request-inspector', '#k5-requests', 'data-k5-req'],
    ['media', 'gallery-states', '#km-gal-live', 'data-km-gal-state'],
    ['media', 'qr-code', '#ks-qr', 'data-ks-qr-state'],
    ['people', 'passkey-list', '.kp-passkeys', 'data-kp5-pk-state'],
    ['people', 'conversation-thread', '.kp-thread', 'data-kp5-th-state'],
    ['people', 'entity-states', '#kv-entity-gstates', 'data-kv-entity-gstate'],
    ['schedule', 'runs-states', '#kt-runs-live', 'data-kt-runs-state'],
    ['schedule', 'sentence-states', '.kp-sentence', 'data-kt-sentence-state'],
    ['status', 'notices', '#ko-inbox', 'data-ko-n-state'],
    ['status', 'today-states', '#kc-today-s', 'data-kc-today-state'],
    ['status', 'explain-lede', '#kb-lede-card', '#kb-lede-states [data-value]'],
    ['updates', 'version-states', '#kv-version-live', 'data-kv-version-state'],
    ['updates', 'ack-states', '.kp-ack', 'data-kv-ack-state'],
    ['updates', 'deplist-states', '.kp-deplist', 'data-kv-dep-state'],
];
const WANT = ['ready', 'loading', 'running', 'uploading', 'empty', 'nobody', 'error', 'save-error'];

/** In the page: press one state button of a section and measure its component. */
async function press(spec, value) {
    const [, item, compSel, attr] = spec;
    const sec = document.querySelector(`[data-review-item="${item}"]`);
    const btn = attr.startsWith('data-')
        ? sec.querySelector(`button[${attr}="${value}"]`)
        : sec.querySelector(`${attr.replace('[data-value]', '')}[data-value="${value}"]`);
    if (!btn) return null;
    btn.scrollIntoView({ block: 'center' });
    btn.click();
    await new Promise((r) => setTimeout(r, 1100));
    const comp = sec.querySelector(compSel);
    if (!comp) return { error: 'component not found' };
    const R = (e) => e.getBoundingClientRect();
    const vis = (e) => {
        const r = R(e);
        const cs = getComputedStyle(e);
        return r.width > 2 && r.height > 2 && cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.05 && !e.closest('[hidden]');
    };
    const c = R(comp);
    const cx = c.left + c.width / 2;
    const cy = c.top + c.height / 2;
    const plates = [...comp.querySelectorAll('.kp-empty, .kp-alert, .kp-datatable__busy-card, [class*="__state"], [class*="__failure"], [class*="__empty"], [class*="__problem"], [class*="__wait"], [role="alert"], [role="status"]')]
        .filter(vis)
        .filter((e) => !e.parentElement.closest('.kp-empty, .kp-alert, .kp-datatable__busy-card'))
        .slice(0, 3)
        .map((e) => {
            const r = R(e);
            const t = [...e.querySelectorAll('h1,h2,h3,h4,strong,.kp-empty__title,[class*="title"],[class*="heading"]')].find(vis) || e;
            const buttons = [...e.querySelectorAll('button, a.kp-button')].filter(vis).map((b) => `${Math.round(R(b).width)}x${Math.round(R(b).height)}`);
            // the text block: union of the visible text rects, to judge text centre against component centre
            const range = document.createRange();
            range.selectNodeContents(e);
            const tr = range.getBoundingClientRect();
            return {
                cls: (e.className || '').toString().split(' ').filter((k) => k.startsWith('kp-')).slice(0, 2).join('.'),
                w: Math.round(r.width), h: Math.round(r.height),
                dx: Math.round(r.left + r.width / 2 - cx), dy: Math.round(r.top + r.height / 2 - cy),
                tdy: Math.round(tr.top + tr.height / 2 - cy),
                fs: Math.round(parseFloat(getComputedStyle(t).fontSize)),
                text: e.textContent.trim().replace(/\s+/g, ' ').slice(0, 40),
                buttons,
            };
        });
    const busy = [...comp.querySelectorAll('.kp-datatable__busy-card, [aria-busy="true"], [data-kp-state="loading"], [data-kp-busy]')].filter(vis);
    const anims = document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.target && comp.contains(a.effect.target)).length;
    const retry = [...comp.querySelectorAll('button')].filter(vis).filter((b) => /retry|try again|add|send|reload/i.test(b.textContent)).map((b) => `${b.textContent.trim().slice(0, 12)} ${Math.round(R(b).width)}x${Math.round(R(b).height)}`);
    const s = R(sec);
    return { compH: Math.round(c.height * 10) / 10, compW: Math.round(c.width), compTop: Math.round(c.top - s.top), secH: Math.round(s.height), plates, busy: busy.length, anims, retry };
}

const browser = await firefox.launch({ executablePath: `${process.env.HOME}/.cache/ms-playwright/firefox-1538/firefox/firefox` });
for (const theme of themeArg.split(','))
    for (const width of widthArg.split(',').map(Number)) {
        let lastPart = null;
        let page = null;
        for (const spec of SPECS) {
            if (only.length && !only.includes(`${spec[0]}:${spec[1]}`)) continue;
            if (lastPart !== spec[0]) {
                await page?.close();
                page = await browser.newPage({ viewport: { width, height: 900 } });
                await page.goto(`http://127.0.0.1:${port}/research/kpadopt56-${spec[0]}/demo.html?theme=${theme}`);
                await page.waitForTimeout(1000);
                lastPart = spec[0];
            }
            const rows = {};
            for (const v of WANT) {
                const r = await page.evaluate(`(${press.toString()})(${JSON.stringify(spec)}, ${JSON.stringify(v)})`).catch((e) => ({ error: String(e).slice(0, 80) }));
                if (r) {
                    rows[v] = r;
                    if (shots && !r.error) {
                        const el = await page.$(`[data-review-item="${spec[1]}"] ${spec[2]}`);
                        await el?.screenshot({ path: `${shots}/${theme}-${width}-${spec[1]}-${v}.png` }).catch(() => {});
                    }
                }
            }
            // back to ready for the next section
            await page.evaluate(`(${press.toString()})(${JSON.stringify(spec)}, 'ready')`).catch(() => {});
            console.log(JSON.stringify({ theme, width, part: spec[0], item: spec[1], rows }));
        }
        await page?.close();
    }
await browser.close();
