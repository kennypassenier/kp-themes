// Smoke test of the part pages' wiring, in Firefox (a measuring script, not a test): loads each part, then presses every
// button the demos added to a section (the state and option buttons, `data-k<demo>-...`) once, and prints every page error
// and console error it saw, per section, and each button whose press changed nothing in its section (an unwired button). It finds a section whose script was left unwired when a later round dropped it.
//
// Run (a static server on the repository root first):
//   node research/kpadopt56/check-wiring.mjs <port> [theme=dark] [part ...]
import { createRequire } from 'node:module';

const require = createRequire('/home/kenny/Projects/kp-themes/node_modules/');
const { firefox } = require('playwright-core');
const [port, theme = 'dark', ...only] = process.argv.slice(2);
if (!port) {
    console.error('usage: node research/kpadopt56/check-wiring.mjs <port> [theme] [part ...]');
    process.exit(2);
}
const PARTS = ['schedule', 'choose', 'fields', 'updates', 'confirm', 'lists', 'status', 'calm', 'charts', 'media', 'people'].filter((p) => !only.length || only.includes(p));
const browser = await firefox.launch({ executablePath: `${process.env.HOME}/.cache/ms-playwright/firefox-1538/firefox/firefox` });
let found = 0;
for (const part of PARTS) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    /** @type {string[]} */
    let errors = [];
    page.on('pageerror', (e) => errors.push(`page error: ${e.message}`));
    page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text().slice(0, 200)}`));
    await page.goto(`http://127.0.0.1:${port}/research/kpadopt56-${part}/demo.html?theme=${theme}`);
    await page.waitForTimeout(3000);
    const lines = [];
    if (errors.length) lines.push(`  on load: ${[...new Set(errors)].join(' | ')}`);
    const sections = await page.$$eval('[data-review-item]', (els) => els.map((e) => e.getAttribute('data-review-item')));
    for (const id of sections) {
        errors = [];
        const handles = await page.evaluateHandle((item) => {
            const root = document.querySelector(`[data-review-item="${item}"]`);
            return [...(root?.querySelectorAll('button') ?? [])].filter((b) =>
                [...b.attributes].some((a) => /^data-k(b|p5|t|5|o|c|s|m|v)-/.test(a.name)),
            );
        }, id);
        const count = await handles.evaluate((list) => list.length);
        /** @type {string[]} */
        const idle = [];
        for (let i = 0; i < count; i += 1) {
            const button = await handles.evaluateHandle((list, at) => list[at], i);
            const el = button.asElement();
            if (!el || !(await el.isVisible())) continue;
            await el.scrollIntoViewIfNeeded().catch(() => {});
            const before = await page.$eval(`[data-review-item="${id}"]`, (section) => section.outerHTML);
            const pressedBefore = await el.getAttribute('aria-pressed');
            const label = ((await el.textContent()) ?? '').replace(/\s+/g, ' ').trim().slice(0, 30);
            await el.click({ timeout: 2000, force: true }).catch(() => {});
            await page.waitForTimeout(250);
            const after = await page.$eval(`[data-review-item="${id}"]`, (section) => section.outerHTML);
            if (before === after && pressedBefore !== 'true') idle.push(`"${label}"`);
        }
        if (idle.length) lines.push(`  ${id}: pressing ${idle.join(', ')} changed nothing in the section`);
        if (errors.length) lines.push(`  ${id} (${count} buttons pressed): ${[...new Set(errors)].join(' | ')}`);
    }
    console.log(`${part} (${theme}): ${lines.length ? `${lines.length} section(s) with errors` : 'no errors'}`);
    for (const line of lines) console.log(line);
    found += lines.length;
    await page.close();
}
await browser.close();
process.exit(found ? 1 : 0);
