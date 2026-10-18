// Beside measure-gaps.mjs (a measuring script, not a test): in Firefox, for each part page, theme and width, every section
// whose content runs past its own right edge (the section scrolls sideways, or a package part sticks out of it), the part
// that sticks out furthest named with the pixels; and every package part that carries text but is squeezed to a sliver
// (narrower than 40 px or lower than 10 px) or is invisible (opacity under 0.05). Faults the text-gap measure cannot see.
//
// Run (a static server on the repository root first):
//   node research/kpadopt56/measure-overflow.mjs <port> <themes> <widths> [part ...]
import { createRequire } from 'node:module';

const require = createRequire('/home/kenny/Projects/kp-themes/node_modules/');
const { firefox } = require('playwright-core');
const [port, themeArg, widthArg, ...only] = process.argv.slice(2);
if (!port || !themeArg || !widthArg) {
    console.error('usage: node research/kpadopt56/measure-overflow.mjs <port> <themes> <widths> [part ...]');
    process.exit(2);
}
const PARTS = ['schedule', 'choose', 'fields', 'updates', 'confirm', 'lists', 'status', 'calm', 'charts', 'media', 'people'].filter((p) => !only.length || only.includes(p));

/** In the page: per section, the part that sticks out past the section's right edge by more than 1 px. */
function measure() {
    const out = [];
    for (const section of document.querySelectorAll('[data-review-item]')) {
        const box = section.getBoundingClientRect();
        let worst = null;
        for (const el of section.querySelectorAll('[class*="kp-"]')) {
            if (el.closest('[hidden], .kp-sr-only, [aria-hidden="true"], [data-review-controls]')) continue;
            const r = el.getBoundingClientRect();
            if (r.width < 1 || r.height < 1) continue;
            // A part inside a scroller that is meant to scroll (a table wrap, a code box) may run on.
            let scrolls = false;
            for (let a = el.parentElement; a && a !== section; a = a.parentElement) {
                const o = getComputedStyle(a).overflowX;
                if (o === 'auto' || o === 'scroll' || o === 'hidden' || o === 'clip') {
                    scrolls = true;
                    break;
                }
            }
            if (scrolls) continue;
            const over = r.right - box.right;
            if (over > 1 && (!worst || over > worst.over)) worst = { over, el: `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}` };
        }
        // A part with text that is squeezed to a sliver or invisible.
        const seen = new Set();
        for (const el of section.querySelectorAll('[class*="kp-"]')) {
            if (el.closest('[hidden], .kp-sr-only, [aria-hidden="true"], [data-review-controls], [inert]')) continue;
            const text = (el.textContent ?? '').trim();
            if (text.length < 7) continue;
            const r = el.getBoundingClientRect();
            if (r.width === 0 && r.height === 0) continue;
            let invisible = false;
            for (let a = el; a && a !== section.parentElement; a = a.parentElement) if (Number(getComputedStyle(a).opacity) < 0.05) invisible = true;
            const name = `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`;
            const kind = invisible ? 'is invisible' : r.width < 40 ? `is squeezed to ${r.width.toFixed(0)}px wide` : r.height < 10 ? `is squeezed to ${r.height.toFixed(0)}px high` : '';
            if (kind && !seen.has(name + kind)) {
                seen.add(name + kind);
                out.push(`${section.getAttribute('data-review-item')}: ${name} "${text.slice(0, 24)}" ${kind}`);
            }
        }
        const wide = section.scrollWidth - section.clientWidth;
        if (worst || wide > 1) out.push(`${section.getAttribute('data-review-item')}: ${worst ? `${worst.el} sticks out ${worst.over.toFixed(0)}px` : ''}${wide > 1 ? ` (section scrolls sideways by ${wide}px)` : ''}`.trim());
    }
    return out;
}

const browser = await firefox.launch({ executablePath: `${process.env.HOME}/.cache/ms-playwright/firefox-1538/firefox/firefox` });
let found = 0;
for (const part of PARTS)
    for (const width of widthArg.split(',').map(Number))
        for (const theme of themeArg.split(',')) {
            const page = await browser.newPage({ viewport: { width, height: 900 } });
            const response = await page.goto(`http://127.0.0.1:${port}/research/kpadopt56-${part}/demo.html?theme=${theme}`);
            if (!response || !response.ok()) {
                console.error(`part ${part} answered ${response ? response.status() : 'nothing'}`);
                process.exit(2);
            }
            await page.waitForTimeout(1500);
            const out = await page.evaluate(measure);
            found += out.length;
            console.log(`${part} ${theme} ${width}: ${out.length ? `${out.length} section(s) overflow` : 'clear'}`);
            for (const line of out) console.log(`  ${line}`);
            await page.close();
        }
await browser.close();
process.exit(found ? 1 : 0);
