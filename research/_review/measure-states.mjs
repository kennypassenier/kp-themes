// Puts every [data-review-item] section of a demo into every state its [data-review-controls] buttons offer, opens every
// menu, popover and combobox it has, and runs measure-gaps.mjs' text check in each state; it also flags action buttons
// of one kind that do not share one x position across the rows they stand in. Correction states-1017 (Kenny, 2026-10-17
// 22:09): the round-1 faults (an unreadable menu, a reason one letter per line, log columns over each other, "Mark
// unread" left-aligned by flow) slipped through because only the default state of each section was measured.
//
// A measuring script, not a test. Start a static server from THIS worktree first and confirm its cwd.
//   node research/_review/measure-states.mjs <port> <research/topic/demo.html> [themes=formal] [widths=1280,390]
// Exit 2 on a non-200 page, 1 on any finding, 0 when clear.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire('/home/kenny/Projects/kp-themes/node_modules/');
const { firefox } = require('playwright-core');
const [port, path, themeArg = 'formal', widthArg = '1280,390'] = process.argv.slice(2);
if (!port || !path) {
    console.error('usage: node research/_review/measure-states.mjs <port> <research/topic/demo.html> [themes] [widths]');
    process.exit(2);
}
const MIN = 4;

// The text-gap measure is measure-gaps.mjs' own function, taken from its source so the two never drift apart.
const gapsSource = readFileSync(new URL('./measure-gaps.mjs', import.meta.url), 'utf8');
const start = gapsSource.indexOf('function measure(min) {');
const end = gapsSource.indexOf('\n}\n', start) + 2;
const measureSource = gapsSource.slice(start, end);

/** In the page: the text check of one section, plus one-letter-per-line and edge findings. @param {{ src: string, id: string, min: number }} a */
function inSection({ src, id, min, openIndex }) {
    const measure = new Function(`${src}; return measure;`)();
    const section = document.querySelector(`[data-review-item="${id}"]`);
    // An opened menu or popover is raised over the section on purpose: measure it alone, against its own plate.
    const hidden = [];
    if (openIndex !== undefined) {
        const panels = [
            ...document.querySelectorAll(
                '[popover]:popover-open, [role="menu"], [role="listbox"], [role="dialog"], [role="tooltip"], [class*="__panel"], [class*="__menu"], [class*="__popup"]',
            ),
        ].filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
        });
        const panel = panels.find((el) => section?.contains(el)) ?? panels[0];
        if (panel)
            for (const el of section?.querySelectorAll('*') ?? [])
                if (!panel.contains(el) && !el.contains(panel) && el instanceof HTMLElement) {
                    hidden.push([el, el.style.visibility]);
                    el.style.visibility = 'hidden';
                }
    }
    const out = measure(min).filter((/** @type {string} */ l) => l.startsWith(`${id}: `));
    for (const [el, v] of hidden) el.style.visibility = v;
    // A text broken one letter per line: a block of text wider than a letter that is taller than 6 lines of its own size.
    for (const el of section?.querySelectorAll('p, span, li, label, dd, dt, small, div') ?? []) {
        if (el.children.length) continue;
        const text = el.textContent?.trim() ?? '';
        const r = el.getBoundingClientRect();
        if (text.length < 8 || !r.width || el.closest('[hidden], .kp-sr-only')) continue;
        const cs = getComputedStyle(el);
        const lines = r.height / (parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.3);
        if (lines >= 3 && text.length / Math.round(lines) < 7)
            out.push(`${id}: "${text.slice(0, 28)}" breaks into ${Math.round(lines)} lines in ${Math.round(r.width)}px`);
    }
    return out;
}

/** In the page: buttons of one kind whose x differs from row to row. @param {string} id */
function columns(id) {
    const section = document.querySelector(`[data-review-item="${id}"]`);
    const out = [];
    const kind = (/** @type {Element} */ b) =>
        (b.getAttribute('data-action') ?? b.textContent ?? '')
            .trim()
            .toLowerCase()
            .replace(/\bun(?=read)/g, '')
            .replace(/\d+/g, '#');
    const rowOf = (/** @type {Element} */ b) => b.closest('li, tr, [role="row"], [role="listitem"], [class*="__row"], [class*="-row"]');
    const groups = new Map();
    for (const b of section?.querySelectorAll('button, a.kp-button') ?? []) {
        if (b.closest('[data-review-controls], .cat-judge, .rv-block-tools, [hidden]')) continue;
        const row = rowOf(b);
        const r = b.getBoundingClientRect();
        if (!row || !r.width) continue;
        const label = kind(b);
        if (!label || label.length > 30) continue;
        const key = `${row.parentElement ? [...document.querySelectorAll('*')].indexOf(row.parentElement) : 0}|${label}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push({ row, x: r.left, w: r.width, label });
    }
    for (const list of groups.values()) {
        const rows = new Set(list.map((g) => g.row));
        if (rows.size < 2) continue;
        const rights = list.map((g) => Math.round(g.x + g.w));
        const lefts = list.map((g) => Math.round(g.x));
        if (new Set(lefts).size > 1 && new Set(rights).size > 1)
            out.push(`${id}: "${list[0].label}" stands at ${[...new Set(lefts)].join(' / ')}px in ${rows.size} rows (not one column)`);
    }
    return out;
}

const browser = await firefox.launch({ executablePath: `${process.env.HOME}/.cache/ms-playwright/firefox-1538/firefox/firefox` });
let found = 0;
const total = {};
for (const width of widthArg.split(',').map(Number))
    for (const theme of themeArg.split(',')) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        const response = await page.goto(`http://127.0.0.1:${port}/${path}?theme=${theme}`);
        if (!response || !response.ok()) {
            console.error(`${path} answered ${response ? response.status() : 'nothing'} on port ${port}; is this worktree's server on that port?`);
            process.exit(2);
        }
        await page.waitForTimeout(1500);
        const ids = await page.evaluate(() => [...document.querySelectorAll('[data-review-item]')].map((s) => s.getAttribute('data-review-item')));
        let states = 0;
        const findings = [];
        /** @param {string} id @param {string} label */
        const check = async (id, label, open = false) => {
            await page.waitForTimeout(250);
            states++;
            const lines = [
                ...(await page.evaluate(inSection, { src: measureSource, id, min: MIN, openIndex: open ? 1 : undefined })),
                ...(await page.evaluate(columns, id)),
            ];
            for (const l of new Set(lines)) findings.push(`  [${label}] ${l}`);
        };
        for (const id of ids) {
            const section = page.locator(`[data-review-item="${id}"]`).first();
            await section.scrollIntoViewIfNeeded();
            await check(id, 'default');
            // Every button of every control group, in turn.
            const groups = await section.locator('[data-review-controls] [role="group"]').count();
            for (let g = 0; g < groups; g++) {
                const buttons = section.locator('[data-review-controls] [role="group"]').nth(g).locator('button');
                for (let b = 0, n = await buttons.count(); b < n; b++) {
                    const button = buttons.nth(b);
                    const name = ((await button.textContent()) ?? '').trim().slice(0, 24);
                    if (!(await button.isVisible()) || (await button.isDisabled())) continue;
                    await button.click({ timeout: 3000 }).catch(() => {});
                    await check(id, `state ${g + 1}:${name}`);
                }
            }
            // The section's own state selectors (segmented items, radios, tabs, switches), each pressed in turn.
            const selectors = section.locator(
                ':is(.kp-segmented__item, [role="radio"], [role="tab"], [role="switch"], input[type="radio"]):not([data-review-controls] *):not(.cat-judge *):not(.rv-block-tools *)',
            );
            for (let o = 0, n = await selectors.count(); o < n; o++) {
                const el = selectors.nth(o);
                if (!(await el.isVisible()) || (await el.isDisabled().catch(() => false))) continue;
                const name = ((await el.textContent()) ?? (await el.getAttribute('aria-label')) ?? '').trim().slice(0, 24);
                await el.scrollIntoViewIfNeeded().catch(() => {});
                await el.click({ timeout: 3000, force: true }).catch(() => {});
                await check(id, `select ${o + 1}:${name}`);
            }
            // Every opener inside the section (controls and the review kit excluded): open, measure, close.
            const openers = section.locator(
                ':is([aria-haspopup]:not([aria-haspopup="false"]), [role="combobox"], [aria-expanded="false"], summary, [popovertarget]):not([data-review-controls] *):not(.cat-judge *):not(.rv-block-tools *)',
            );
            const count = await openers.count();
            for (let o = 0; o < count; o++) {
                const opener = openers.nth(o);
                if (!(await opener.isVisible()) || (await opener.isDisabled().catch(() => false))) continue;
                const name = ((await opener.textContent()) ?? '').trim().slice(0, 24);
                await opener.scrollIntoViewIfNeeded().catch(() => {});
                await opener.click({ timeout: 3000 }).catch(() => {});
                await check(id, `open ${o + 1}:${name}`, true);
                await page.keyboard.press('Escape');
            }
        }
        found += findings.length;
        total[`${theme} ${width}`] = states;
        console.log(`${theme} ${width}: ${states} states in ${ids.length} sections, ${findings.length ? `${findings.length} finding(s)` : 'clear'}`);
        for (const line of findings) console.log(line);
        await page.close();
    }
await browser.close();
process.exit(found ? 1 : 0);
