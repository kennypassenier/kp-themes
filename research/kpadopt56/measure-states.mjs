// Beside measure-overflow.mjs (a measuring script, not a test): in Firefox, for each part page, theme and width, every
// section that has state buttons (Ready, Loading, Empty, Failed ...): press each state and print the section height and the
// outermost component whose height moved, ready against state, so a state that does not fill the footprint of Ready
// (or shifts the page) shows as a number.
//
// Run (a static server on the repository root first):
//   node research/kpadopt56/measure-states.mjs <port> <themes> <widths> [part ...]
import { createRequire } from 'node:module';

const require = createRequire('/home/kenny/Projects/kp-themes/node_modules/');
const { firefox } = require('playwright-core');
const [port, themeArg, widthArg, ...only] = process.argv.slice(2);
if (!port || !themeArg || !widthArg) {
    console.error('usage: node research/kpadopt56/measure-states.mjs <port> <themes> <widths> [part ...]');
    process.exit(2);
}
const PARTS = ['schedule', 'choose', 'fields', 'updates', 'confirm', 'lists', 'status', 'calm', 'charts', 'media', 'people'].filter((p) => !only.length || only.includes(p));
const STATE = /^data-(?!kp-|review).*(state|last|req|gstate)$|^data-(k[a-z0-9]*)-(md|ops|con|av|uses|gal|pk|th|cal|quote|focus|today|n|dep|ack|version|trace|entity|claim|time|auto|rating|slider|sentence|usual|intent|dated|runs)-state$/;

const browser = await firefox.launch();
for (const theme of themeArg.split(',')) {
    for (const width of widthArg.split(',').map(Number)) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
        for (const part of PARTS) {
            await page.goto(`http://127.0.0.1:${port}/research/kpadopt56-${part}/demo.html?theme=${theme}`);
            await page.waitForTimeout(500);
            const sections = await page.evaluate(() => [...document.querySelectorAll('[data-review-item]')].map((s) => s.dataset.reviewItem));
            for (const id of sections) {
                const buttons = await page.evaluate((sid) => {
                    const s = document.querySelector(`[data-review-item="${sid}"]`);
                    const out = [];
                    for (const b of s.querySelectorAll('button[aria-pressed]')) {
                        const a = [...b.attributes].find((x) => /^data-.*(state|last|req|gstate|card)$/.test(x.name) && !x.name.startsWith('data-kp-') && /^(ready|empty|loading|error|states)$/.test(x.value));
                        if (a) out.push({ attr: a.name, value: a.value, text: b.textContent.trim() });
                    }
                    return out;
                }, id);
                if (!buttons.length) continue;
                const rows = [];
                for (const b of buttons) {
                    const m = await page.evaluate(
                        async ({ sid, attr, value }) => {
                            const s = document.querySelector(`[data-review-item="${sid}"]`);
                            s.scrollIntoView({ block: 'start' });
                            s.querySelector(`button[${attr}="${value}"]`).click();
                            await new Promise((r) => setTimeout(r, 800));
                            const sr = s.getBoundingClientRect();
                            const skip = (e) => e.closest('[data-review-controls], button, .k5-expected, .kt-expected, [class$="-expected"], [hidden]');
                            const isKp = (e) => [...e.classList].some((c) => c.startsWith('kp-'));
                            const roots = [...s.querySelectorAll('*')].filter((e) => isKp(e) && !skip(e) && !(e.parentElement && e.parentElement.closest('[class*="kp-"]') && s.contains(e.parentElement.closest('[class*="kp-"]'))));
                            return {
                                section: Math.round(sr.height * 10) / 10,
                                roots: roots.map((e) => ({ n: e.tagName.toLowerCase() + '.' + [...e.classList].find((c) => c.startsWith('kp-')), h: Math.round(e.getBoundingClientRect().height * 10) / 10, w: Math.round(e.getBoundingClientRect().width), html: e.innerHTML.length + ':' + (e.textContent || '').trim().slice(0, 40) })),
                            };
                        },
                        { sid: id, attr: b.attr, value: b.value },
                    );
                    rows.push({ ...b, ...m });
                }
                const ready = rows.find((r) => r.value === 'ready' || r.value === 'states') || rows[0];
                console.log(`${theme} ${width} ${part}/${id}: section ${rows.map((r) => `${r.value}=${r.section}`).join(' ')}`);
                // the driven component: the first outermost kp part whose content differs from Ready in any state
                const driven = ready.roots.findIndex((_, i) => rows.some((r) => r !== ready && r.roots[i] && r.roots[i].html !== ready.roots[i].html));
                if (driven < 0) console.log('    (no driven component found)');
                else for (const r of rows) console.log(`    ${r.value.padEnd(8)} ${r.roots[driven].n} h=${r.roots[driven].h} w=${r.roots[driven].w}${r === ready ? '' : r.roots[driven].h === ready.roots[driven].h ? '' : ` (${(r.roots[driven].h - ready.roots[driven].h).toFixed(1)})`}`);
                if (driven >= 0) for (const r of rows) console.log(`ROW\t${theme}\t${width}\t${part}/${id}\t${r.value}\t${r.roots[driven].h}\t${ready.roots[driven].h}\t${r.section}\t${ready.section}`);
            }
        }
        await page.close();
    }
}
await browser.close();
