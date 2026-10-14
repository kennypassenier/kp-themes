// research/sidenav-minor: the no-change proof for the six new side navigation
// options. Loads the previous approved demo's app pages (research/sidenav-edge)
// in every theme, in Firefox, in both motion preferences, shut and open, and
// writes every computed property of the parts that matter (plus the sidenav's
// own custom properties) to one JSON file. Run it before the first change and
// after the last, then `node baseline.mjs diff a.json b.json`: the diff must be
// empty, because no option is set on those pages.
//
//   python3 -m http.server 8761 --bind 127.0.0.1      # from the repository root
//   node research/sidenav-minor/baseline.mjs capture out.json [--base http://127.0.0.1:8761] [--phone]
//   node research/sidenav-minor/baseline.mjs diff before.json after.json
//
// Not a test: no gate runs it.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import process from 'node:process';
import { firefox } from 'playwright';

const THEMES = ['blueprint', 'brutalism', 'cyberpunk', 'dark', 'deco', 'forest', 'formal', 'grotesk', 'light', 'nostromo', 'pastel', 'phantom', 'solstice', 'synthwave', 'terminal', 'titanium'];
const PAGES = ['push', 'gutter', 'over', 'rail', 'peek'];
const PARTS = {
    panel: '.kp-sidenav',
    header: '.kp-sidenav__header',
    title: '.kp-sidenav__title',
    scroll: '.kp-sidenav__scroll',
    list: '.kp-sidenav__list',
    link: '.kp-sidenav__link',
    current: '.kp-sidenav__link[aria-current="page"]',
    icon: '.kp-sidenav__icon',
    label: '.kp-sidenav__label',
    badge: '.kp-sidenav__badge',
    divider: '.kp-sidenav__divider',
    category: '.kp-sidenav__category-toggle',
    footer: '.kp-sidenav__footer',
    launcher: '.kp-sidenav__launcher',
    tab: '.kp-sidenav__tab',
    main: '.se-main',
    card: '.se-main .kp-card',
};
const VARS = ['--kp-sidenav-away', '--kp-sidenav-w', '--kp-sidenav-ease-back', '--kp-sidenav-shift-duration'];

const args = process.argv.slice(2);
const [command] = args;

if (command === 'diff') {
    const a = JSON.parse(readFileSync(args[1], 'utf8'));
    const b = JSON.parse(readFileSync(args[2], 'utf8'));
    let differences = 0;
    let compared = 0;
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
        const x = a[key] ?? {};
        const y = b[key] ?? {};
        for (const prop of new Set([...Object.keys(x), ...Object.keys(y)])) {
            compared += 1;
            if (x[prop] !== y[prop]) {
                differences += 1;
                if (differences <= 40) console.log(`DIFF ${key} ${prop}: ${x[prop]} -> ${y[prop]}`);
            }
        }
    }
    console.log(`compared ${compared} values in ${Object.keys(a).length} captures, ${differences} differences`);
    process.exit(differences === 0 ? 0 : 1);
}

if (command !== 'capture') {
    console.error('usage: capture <out.json> [--base url] | diff <a.json> <b.json>');
    process.exit(2);
}

const out = args[1];
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'http://127.0.0.1:8761';
const phone = args.includes('--phone');
const browser = await firefox.launch();
/** @type {Record<string, Record<string, string>>} */
const result = {};
let loads = 0;

for (const motion of ['reduce', 'no-preference']) {
    const context = await browser.newContext({ viewport: { width: phone ? 390 : 1280, height: phone ? 760 : 800 }, reducedMotion: motion });
    for (const theme of THEMES) {
        for (const page of PAGES) {
            const tab = await context.newPage();
            await tab.goto(`${base}/research/sidenav-edge/${page}.html?theme=${theme}`, { waitUntil: 'load' });
            await tab.waitForFunction((t) => document.documentElement.getAttribute('data-theme') === t, theme, { timeout: 8000 });
            await tab.evaluate(() => document.fonts.ready);
            await tab.waitForTimeout(motion === 'reduce' ? 250 : 400);
            loads += 1;
            for (const state of ['first', 'toggled']) {
                if (state === 'toggled') {
                    const toggle = tab.locator('[data-kp-sidenav-toggle]').first();
                    if ((await toggle.count()) > 0 && (await toggle.isVisible())) await toggle.click();
                    await tab.waitForTimeout(motion === 'reduce' ? 250 : 2200);
                }
                const dump = await tab.evaluate(
                    ({ parts, vars }) => {
                        /** @type {Record<string, string>} */
                        const flat = {};
                        for (const [name, selector] of Object.entries(parts)) {
                            const el = document.querySelector(selector);
                            if (!el) {
                                flat[`${name}`] = 'absent';
                                continue;
                            }
                            const style = getComputedStyle(el);
                            for (let i = 0; i < style.length; i += 1) {
                                const prop = style[i];
                                flat[`${name}|${prop}`] = style.getPropertyValue(prop);
                            }
                            for (const v of vars) flat[`${name}|${v}`] = style.getPropertyValue(v).trim();
                            const box = el.getBoundingClientRect();
                            flat[`${name}|rect`] = [box.x, box.y, box.width, box.height].map((n) => n.toFixed(2)).join(',');
                            flat[`${name}|inert`] = String(el.inert);
                        }
                        const nav = document.querySelector('.kp-sidenav');
                        flat['nav|attrs'] = nav ? [...nav.attributes].map((a) => `${a.name}=${a.value}`).sort().join(' ') : '';
                        flat['scroll|sideways'] = String(document.documentElement.scrollWidth > document.documentElement.clientWidth);
                        return flat;
                    },
                    { parts: PARTS, vars: VARS },
                );
                result[`${motion}|${theme}|${page}|${state}`] = dump;
            }
            await tab.close();
        }
    }
    await context.close();
}
await browser.close();
writeFileSync(out, JSON.stringify(result));
const hash = createHash('sha256').update(JSON.stringify(result)).digest('hex').slice(0, 16);
console.log(`captured ${Object.keys(result).length} states from ${loads} loads; sha256 ${hash}`);
