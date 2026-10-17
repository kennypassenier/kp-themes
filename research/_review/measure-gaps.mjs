// Measures, in Firefox, every text of a demo's components against its neighbours AND against the edge of the plate it
// stands on: Kenny's rule that text never touches an edge or a neighbour (2026-10-16 and again 2026-10-17: "ik had toch
// gezegd dat ik nooit text wil die tegen de rand plakt zonder marge tussen die elementen?"). The measures of earlier
// rounds compared text with text only, so text against its own plate's edge went through (correction text-edge-1017).
//
// It is a measuring script, not a test: it runs before a round is put on the Agenda, by the helper that built it and by
// Claude before the push, and prints one line per text closer than 4 px. Exit code 1 when anything is found.
//
// Run (a static server on the repository root first):
//   node research/_review/measure-gaps.mjs <port> <research/topic/demo.html> [themes=formal,dark] [widths=1280,390]
import { createRequire } from 'node:module';

const require = createRequire('/home/kenny/Projects/kp-themes/node_modules/');
const { firefox } = require('playwright-core');
const [port, path, themeArg = 'formal,dark', widthArg = '1280,390'] = process.argv.slice(2);
if (!port || !path) {
    console.error('usage: node research/_review/measure-gaps.mjs <port> <research/topic/demo.html> [themes] [widths]');
    process.exit(2);
}
const MIN = 4;

/** In the page: every component text closer than MIN to a neighbour or its plate's edge. @param {number} min */
function measure(min) {
    const res = [];
    const visible = (/** @type {DOMRect} */ r) => r.width > 0.5 && r.height > 0.5;
    for (const section of document.querySelectorAll('[data-review-item]')) {
        const id = section.getAttribute('data-review-item');
        // The package's parts only: the demo's prose, readouts and Expected blocks are not the component.
        const scope = [...section.querySelectorAll('[class^="kp-"], [class*=" kp-"]')]
            .filter((el) => !el.closest('.cat-judge, [data-review-controls], .rv-block-tools'))
            .filter((el) => !el.parentElement?.closest('[class^="kp-"], [class*=" kp-"]'));
        const texts = [];
        const boxes = [];
        for (const s of scope) {
            const walk = document.createTreeWalker(s, NodeFilter.SHOW_TEXT);
            for (let n; (n = walk.nextNode());) {
                if (!n.textContent?.trim()) continue;
                const el = /** @type {HTMLElement} */ (n.parentElement);
                if (getComputedStyle(el).visibility === 'hidden' || el.closest('[hidden], .kp-sr-only, [aria-hidden="true"]')) continue;
                const range = document.createRange();
                range.selectNodeContents(n);
                // A text cut off by an ancestor that clips (an ellipsis) is measured up to the clip.
                let clip = null;
                for (let a = el; a && a !== s.parentElement; a = a.parentElement) {
                    if (getComputedStyle(a).overflowX === 'visible') continue;
                    const ar = a.getBoundingClientRect();
                    clip = clip ? { left: Math.max(clip.left, ar.left), right: Math.min(clip.right, ar.right) } : { left: ar.left, right: ar.right };
                }
                for (const raw of [...range.getClientRects()].filter(visible)) {
                    const rect = clip
                        ? new DOMRect(
                              Math.max(raw.left, clip.left),
                              raw.top,
                              Math.max(0, Math.min(raw.right, clip.right) - Math.max(raw.left, clip.left)),
                              raw.height,
                          )
                        : raw;
                    if (visible(rect)) texts.push({ el, rect, t: n.textContent.trim().slice(0, 28) });
                }
            }
            for (const el of s.querySelectorAll('*')) {
                const r = el.getBoundingClientRect();
                if (!visible(r)) continue;
                const cs = getComputedStyle(el);
                if (cs.visibility === 'hidden') continue;
                const marky =
                    !el.textContent?.trim() && (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.borderLeftWidth !== '0px' || el.tagName === 'svg');
                if (marky) boxes.push({ el, r, text: '' });
            }
        }
        for (const t of texts) {
            for (const b of [...boxes, ...texts.filter((o) => o.el !== t.el).map((o) => ({ el: o.el, r: o.rect, text: o.t }))]) {
                if (b.el.contains(t.el) || t.el.contains(b.el)) continue;
                if (b.r.width > t.rect.width * 3 && b.r.height > t.rect.height * 2) continue;
                const v = Math.min(t.rect.bottom, b.r.bottom) - Math.max(t.rect.top, b.r.top);
                if (v < Math.min(t.rect.height, b.r.height) * 0.5) continue;
                const gap = b.r.left >= t.rect.right ? b.r.left - t.rect.right : t.rect.left >= b.r.right ? t.rect.left - b.r.right : -1;
                if (gap < min - 0.05)
                    res.push(
                        `${id}: "${t.t}" ${gap < 0 ? 'overlaps' : `${gap.toFixed(1)}px from`} ${b.text ? `"${b.text}"` : b.el.tagName.toLowerCase()}`,
                    );
            }
            // The edge of the plate the text stands on: the nearest ancestor with a ground or a border.
            let p = t.el;
            while (p && p !== section) {
                const cs = getComputedStyle(p);
                if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || parseFloat(cs.borderLeftWidth) > 0 || parseFloat(cs.borderTopWidth) > 0) break;
                p = /** @type {HTMLElement} */ (p.parentElement);
            }
            if (!p || p === section || p === t.el || p.matches('table, .kp-datatable, .kp-table-wrap')) continue;
            const pr = p.getBoundingClientRect();
            const cs = getComputedStyle(p);
            const l = t.rect.left - (pr.left + parseFloat(cs.borderLeftWidth));
            const r = pr.right - parseFloat(cs.borderRightWidth) - t.rect.right;
            const top = t.rect.top - (pr.top + parseFloat(cs.borderTopWidth));
            const bottom = pr.bottom - parseFloat(cs.borderBottomWidth) - t.rect.bottom;
            // Side edges: a line of text sits on its plate's padding left and right; above and below, line height and a
            // badge's own small padding are the design.
            const edge = Math.min(l, r);
            void top;
            void bottom;
            if (edge < min - 0.05 && pr.width > t.rect.width + 1)
                res.push(`${id}: "${t.t}" ${edge.toFixed(1)}px from the edge of ${p.tagName.toLowerCase()}.${String(p.className).split(' ')[0]}`);
        }
    }
    return [...new Set(res)];
}

const browser = await firefox.launch({ executablePath: `${process.env.HOME}/.cache/ms-playwright/firefox-1538/firefox/firefox` });
let found = 0;
for (const width of widthArg.split(',').map(Number))
    for (const theme of themeArg.split(',')) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        await page.goto(`http://127.0.0.1:${port}/${path}?theme=${theme}`);
        await page.waitForTimeout(1500);
        const out = await page.evaluate(measure, MIN);
        found += out.length;
        console.log(`${theme} ${width}: ${out.length ? `${out.length} text(s) closer than ${MIN}px` : 'clear'}`);
        for (const line of out) console.log(`  ${line}`);
        await page.close();
    }
await browser.close();
process.exit(found ? 1 : 0);
