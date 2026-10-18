// Beside measure-gaps.mjs (a measuring script, not a test): in Firefox, for each part page, theme and width, every section
// whose content runs past its own right edge (the section scrolls sideways, or a package part sticks out of it), the part
// that sticks out furthest named with the pixels; and every package part whose VISIBLE text is squeezed or that is
// invisible (opacity under 0.05). Faults the text-gap measure cannot see.
//
// Squeeze rule (only rendered text counts, never textContent):
//   1. Visible text = text nodes with a character that is not a space, whose element is rendered: not display:none, not
//      visibility:hidden, not inside [hidden], [aria-hidden="true"], [inert] or .kp-sr-only, and with a box over 1 px.
//      Each text node belongs to its nearest kp- part, so a fault is named once, on that part. A part needs 2+ visible
//      characters to be judged (7+ for the invisible check, as before).
//   2. A part is squeezed only when its visible text really suffers, never by a pixel floor:
//        wraps  - the text breaks over more lines than it does released from its squeeze (flex: none on it and up to three wrappers, width: fit-content,
//                 no max-width) AND the break is a fault: a word cut in two, or a line left holding 1-2 characters
//                 ("+" over "2"). Ordinary word wrapping of a label in a narrow column is not a fault; or
//        spills - a text-node range runs past the right edge of the box that holds it (unless that box, or a part above
//                 it, clips on purpose: an ellipsis or a scroller; inline and table boxes are skipped).
//   A short chip that still fits on one line (a "1 kg" chip, a "12.1" tag), hidden or screen-reader text and an empty
//   wrapper are therefore never reported just for being small.
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
        // A part whose visible text is squeezed (wraps more than unconstrained, or spills) or that is invisible.
        const seen = new Set();
        const rendered = (n) => {
            const e = n.parentElement;
            if (!e || e.closest('[hidden], [aria-hidden="true"], [inert], [data-review-controls]')) return false;
            if (!e.checkVisibility({ visibilityProperty: true, contentVisibilityAuto: true })) return false;
            const r = e.getBoundingClientRect();
            return r.width > 1 && r.height > 1;
        };
        const rects = (n) => {
            const g = document.createRange();
            g.selectNodeContents(n);
            return [...g.getClientRects()].filter((q) => q.width > 0);
        };
        const lineCount = (n) => new Set(rects(n).map((q) => Math.round(q.top / 3))).size;
        // The squeeze signature inside one text node: a line left holding 1-2 characters ("+" over "2"), or a word cut in two.
        const brokenAt = (n) => {
            const g = document.createRange();
            const perLine = new Map();
            const lineText = new Map();
            let cut = false;
            let prevTop = null;
            for (let i = 0; i < n.data.length; i++) {
                const ch = n.data[i];
                if (/\s/.test(ch)) {
                    prevTop = null;
                    continue;
                }
                g.setStart(n, i);
                g.setEnd(n, i + 1);
                const q = g.getClientRects()[0];
                if (!q) continue;
                const top = Math.round(q.top / 3);
                perLine.set(top, (perLine.get(top) ?? 0) + 1);
                lineText.set(top, (lineText.get(top) ?? '') + ch);
                // A break inside one word is a fault, except after a hyphen that joins two pieces ("Vandenbroucke-Lemmens",
                // "immich-machine-learning") or a slash: those are where a name may wrap. A dash run ("--service") is no joint.
                if (prevTop !== null && top !== prevTop) {
                    const before = n.data[i - 1];
                    const joint = (before === '-' && /[\p{L}\p{N}]/u.test(n.data[i - 2] ?? '') && /[\p{L}\p{N}]/u.test(ch)) || before === '/';
                    if (!joint) cut = true;
                }
                prevTop = top;
            }
            if (perLine.size < 2) return '';
            if (cut) return 'a word is cut in two';
            // A whole two-letter word on a line ("Bo") is ordinary wrapping, a stray "+" or "2" is not.
            if ([...lineText.values()].some((t) => t.length <= 2 && !/^\p{L}{2}$/u.test(t))) return 'a line is left holding 1-2 characters';
            return '';
        };
        const owners = new Map();
        const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
            if (!n.data.trim() || !rendered(n)) continue;
            const el = n.parentElement.closest('[class*="kp-"]');
            if (!el || !section.contains(el) || el.closest('.kp-sr-only')) continue;
            if (!owners.has(el)) owners.set(el, []);
            owners.get(el).push(n);
        }
        // A box that clips on purpose (an ellipsis, a scroller) is not a squeeze when its text runs on.
        const clipsOnPurpose = (from, stop) => {
            for (let a = from; a && a !== stop.parentElement; a = a.parentElement) {
                const c = getComputedStyle(a);
                if (c.textOverflow === 'ellipsis' || ['auto', 'scroll', 'hidden'].includes(c.overflowX)) return true;
            }
            return false;
        };
        for (const [el, nodes] of owners) {
            const visible = nodes.map((n) => n.data.trim().replace(/\s+/g, ' ')).join(' ');
            if (visible.length < 2) continue;
            let invisible = false;
            for (let a = el; a && a !== section.parentElement; a = a.parentElement) if (Number(getComputedStyle(a).opacity) < 0.05) invisible = true;
            const r = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            const name = `${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]}`;
            let kind = invisible && visible.length >= 7 ? 'is invisible' : '';
            if (!kind && !invisible) {
                // wraps: the text breaks over more lines than it does released from its squeeze, and the extra break is a fault.
                let wraps = '';
                const lines = nodes.reduce((m, n) => m + lineCount(n), 0);
                if (cs.display !== 'inline' && lines > nodes.length) {
                    const fault = nodes.map(brokenAt).find(Boolean);
                    if (fault) {
                        // Release the part and up to three wrappers above it (a flex wrapper may be the one that is squeezed).
                        const chain = [el, ...[1, 2, 3].map((i) => [...Array(i)].reduce((a) => a?.parentElement, el))].filter((a) => a && a !== section);
                        const saved = chain.map((a) => a.getAttribute('style'));
                        for (const a of chain) a.style.cssText += ';flex:none;min-width:0';
                        el.style.cssText += ';width:fit-content;max-width:none';
                        const free = nodes.reduce((m, n) => m + lineCount(n), 0);
                        chain.forEach((a, i) => (saved[i] === null ? a.removeAttribute('style') : a.setAttribute('style', saved[i])));
                        if (lines > free) wraps = `wraps over ${lines} lines where ${free} fit when unsqueezed, ${fault} (${r.width.toFixed(0)}px wide)`;
                    }
                }
                // spills: a text-node range is wider than the box that holds it.
                let spills = '';
                for (const n of nodes) {
                    const p = n.parentElement;
                    const pc = getComputedStyle(p);
                    if (pc.display === 'inline' || pc.display.startsWith('table') || clipsOnPurpose(p, el)) continue;
                    const pr = p.getBoundingClientRect();
                    const right = pr.right - parseFloat(pc.paddingRight) - parseFloat(pc.borderRightWidth);
                    const widest = Math.max(...rects(n).map((q) => q.right));
                    if (widest > right + 1.5) {
                        spills = `text spills ${(widest - right).toFixed(0)}px out of its ${pr.width.toFixed(0)}px box`;
                        break;
                    }
                }
                kind = wraps || spills;
            }
            if (kind && !seen.has(name + kind)) {
                seen.add(name + kind);
                out.push(`${section.getAttribute('data-review-item')}: ${name} "${visible.slice(0, 24)}" ${kind}`);
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
