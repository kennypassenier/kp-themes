// @ts-nocheck: scratch audit tooling, not shipped
// Text-against-edge audit (Firefox). For every visible text node, the distance from its glyph box to the visible
// edge of the nearest ancestor that paints its own edge (background, border, outline, clip-path), per side.
//   node research/pastel-applied/_audit/edges.mjs <theme|all> [--pages a,b] [--no-demo] [--json out.json] [--limit 10]
// Flags text closer than 4 px to the edge of a control/row/chip, 8 px to a plate (clip-path or a box >= 48x120).
// Only the sides the text can touch are judged: a side counts when the text box is within the plate on that axis.
// EXCLUSIONS (intended flush layouts), all explicit in EXCLUDE below:
//   - a box that is itself a full-bleed wash of the page (html/body), and anything with the 1px sr-only clip
//   - table cells' own edges are not plates: a cell is judged as a cell (4 px) against its own cell background only
//   - a progressbar / meter / skeleton / spinner (text there is a label drawn on a bar by design)
//   - [data-kp-flush] and .kp-sr-only / visually hidden text, hidden/inert/closed content
//   - text whose box is clipped away by an overflow ancestor (not on screen); text wider than its box (truncation, not an edge)
//   - flush by design: a diff line (.kp-diff__line) and a key figure (.kp-kpi__value) are set edge to edge
//   - a box whose only paint is a background image (layered brackets, washes) is judged on left and right only
//   - a box painted by borders alone is judged only on the sides that carry a border
//   - a bare link (a:not([class])) painted by an underline image alone
//   - the catalogue's own review chrome (.cat-review-bar, .cat-feedback, .cat-judge, .cat-nav, .cat-toc): a tool, not a theme part
//   - an inline box (code, link, mark): only its left and right are judged, per fragment when it wraps; a link whose only paint is an underline image is not a plate
import process from 'node:process';
import { writeFileSync, readdirSync, readFileSync } from 'node:fs';
import { firefox } from '@playwright/test';
import { serve, ROOT } from './lib.mjs';

const args = process.argv.slice(2);
const flag = (n, d) => {
    const i = args.indexOf(`--${n}`);
    return i === -1 ? d : (args[i + 1] ?? true);
};
const themeArg = args[0] && !args[0].startsWith('--') ? args[0] : 'pastel';
const THEMES = readdirSync(`${ROOT}/themes`, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
const themes = themeArg === 'all' ? THEMES : [themeArg];
const only = String(flag('pages', '')).split(',').filter(Boolean);
const limit = Number(flag('limit', 10));
const SKIP = new Set(['compare', 'index', 'round', 'changed', 'intros']);
const pages = readdirSync(`${ROOT}/catalogue`)
    .filter((f) => f.endsWith('.html'))
    .map((f) => f.replace('.html', ''))
    .filter((p) => !SKIP.has(p) && (only.length === 0 || only.includes(p)));
const targets = pages.map((p) => ({ name: p, url: `/catalogue/${p}.html` }));
if (!args.includes('--no-demo')) targets.push({ name: 'applied-demo', url: '/research/pastel-applied/demo.html' });

function inPage() {
    const EXCLUDE =
        '.kp-diff__line, .kp-kpi__value, .kp-sr-only, [data-kp-flush], .kp-progressbar, .kp-meter, .kp-skeleton, .kp-spinner, [role=progressbar], [role=meter]';
    const out = [];
    const alpha = (c) => {
        const m = c.match(/rgba?\(([^)]+)\)|color\(([^)]+)\)/);
        if (!m) return 0;
        const s = (m[1] ?? m[2]).split(/[ ,/]+/).filter(Boolean);
        const a = s.length > 3 ? parseFloat(s[s.length - 1]) : 1;
        return Number.isNaN(a) ? 1 : a;
    };
    const paints = (cs) => {
        if (alpha(cs.backgroundColor) > 0.04) return 'background';
        if (cs.backgroundImage !== 'none') return 'background';
        for (const s of ['Top', 'Right', 'Bottom', 'Left'])
            if (parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none' && alpha(cs[`border${s}Color`]) > 0.04) return 'border';
        if (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) return 'outline';
        if (cs.clipPath !== 'none') return 'clip-path';
        return null;
    };
    const hasFill = (cs) => alpha(cs.backgroundColor) > 0.04 || cs.backgroundImage !== 'none' || cs.clipPath !== 'none';
    const borderSides = (cs) => {
        const o = {};
        for (const s of ['Top', 'Right', 'Bottom', 'Left'])
            o[s.toLowerCase()] = parseFloat(cs[`border${s}Width`]) > 0 && cs[`border${s}Style`] !== 'none' && alpha(cs[`border${s}Color`]) > 0.04;
        return o;
    };
    const clipped = (el, r) => {
        for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
            const cs = getComputedStyle(p);
            if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') {
                const b = p.getBoundingClientRect();
                if (r.right <= b.left + 0.5 || r.left >= b.right - 0.5 || r.bottom <= b.top + 0.5 || r.top >= b.bottom - 0.5) return true;
            }
        }
        return false;
    };
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const text = n.textContent.replace(/\s+/g, ' ').trim();
        if (!text) continue;
        const el = n.parentElement;
        if (!el || el.closest('script,style,noscript,template,[hidden],[inert],svg,option,datalist,details:not([open]) > :not(summary)')) continue;
        if (
            el.closest('[data-kp-reveal=rule]') ||
            el.closest(EXCLUDE + ', .cat-review-bar, .cat-feedback, .cat-judge, .cat-nav, .cat-sidebar, .cat-toc')
        )
            continue;
        if (!el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue;
        range.selectNodeContents(n);
        const rects = [...range.getClientRects()].filter((q) => q.width > 0.5 && q.height > 0.5);
        if (!rects.length) continue;
        const t = {
            left: Math.min(...rects.map((q) => q.left)),
            right: Math.max(...rects.map((q) => q.right)),
            top: Math.min(...rects.map((q) => q.top)),
            bottom: Math.max(...rects.map((q) => q.bottom)),
        };
        if (t.right < 0 || t.bottom < 0) continue;
        if (clipped(el, t)) continue;
        // nearest painting ancestor
        let box = null;
        let kind = null;
        for (let p = el; p && p !== document.body && p !== document.documentElement; p = p.parentElement) {
            const cs = getComputedStyle(p);
            kind = paints(cs);
            if (kind) {
                const b = p.getBoundingClientRect();
                if (b.width < 2 || b.height < 2) continue; // sr-only / 1px
                if (cs.position === 'fixed' && b.width >= innerWidth - 2 && b.height >= innerHeight - 2) continue; // backdrop wash
                box = { p, b, cs };
                break;
            }
        }
        if (!box) continue;
        const { b, cs, p } = box;
        if (p.matches('a:not([class])') && kind === 'background' && alpha(cs.backgroundColor) <= 0.04) continue; // a bare link's paint is its underline image
        const inline = cs.display === 'inline';
        if (inline && kind === 'background' && alpha(cs.backgroundColor) <= 0.04) continue;
        if (p.matches('td, th') && kind === 'background' && alpha(cs.backgroundColor) <= 0.04) continue;
        const plate = cs.clipPath !== 'none' ? Math.min(b.width, b.height) >= 40 : b.height >= 48 && b.width >= 120;
        const min = plate ? 8 : 4;
        const d = { left: t.left - b.left, right: b.right - t.right, top: t.top - b.top, bottom: b.bottom - t.bottom };
        if (inline) {
            // a wrapped inline box is one fragment per line: its padding sits at the first fragment's start and the last one's end
            const fr = [...p.getClientRects()];
            const first = rects.reduce((m, q) => (q.top < m.top - 1 || (Math.abs(q.top - m.top) <= 1 && q.left < m.left) ? q : m), rects[0]);
            const last = rects.reduce((m, q) => (q.top > m.top + 1 || (Math.abs(q.top - m.top) <= 1 && q.right > m.right) ? q : m), rects[0]);
            d.left = first.left - fr[0].left;
            d.right = fr[fr.length - 1].right - last.right;
        }
        const bad = [];
        // the text is judged on a side only when the box is not purely a vertical/horizontal rule
        for (const side of ['left', 'right', 'top', 'bottom']) {
            // vertical sides use the font's ascent+descent rect, taller than the glyphs: judged at half (2 px control, 4 px plate)
            const need = side === 'top' || side === 'bottom' ? (plate ? 4 : 2) : min;
            // a box painted by a background image alone (layered brackets, grids, washes) has its vertical edge in the layer sizes, not the box: judged left/right only
            if ((side === 'top' || side === 'bottom') && alpha(cs.backgroundColor) <= 0.04 && cs.clipPath === 'none' && !borderSides(cs)[side])
                continue;
            if (!hasFill(cs) && kind === 'border' && !borderSides(cs)[side]) continue;
            if (inline && (side === 'top' || side === 'bottom')) continue;
            if (d[side] < -1) continue;
            if (d[side] < need - 0.25) bad.push(`${side} ${d[side].toFixed(1)}`);
        }
        if (!bad.length) continue;
        const sel = (e) =>
            `${e.localName}${e.classList.length ? '.' + [...e.classList].slice(0, 2).join('.') : ''}${e.getAttribute('role') ? `[role=${e.getAttribute('role')}]` : ''}`;
        out.push({
            text: text.slice(0, 40),
            box: sel(p),
            geo: JSON.stringify({ t: [t.left, t.right].map(Math.round), b: [b.left, b.right].map(Math.round), disp: cs.display }),
            tag: sel(el),
            kind: plate ? `plate/${kind}` : kind,
            sides: bad.join(', '),
            min,
            paint: `${cs.backgroundColor} ${cs.backgroundImage.slice(0, 50)} pad=${cs.padding}`,
        });
    }
    return out;
}

const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await firefox.launch();
const result = {};
for (const theme of themes) {
    result[theme] = [];
    for (const tg of targets) {
        const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
        await context.addInitScript((th) => {
            try {
                localStorage.setItem('theme', th);
            } catch {}
        }, theme);
        const page = await context.newPage();
        await page.goto(base + tg.url, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        await page.evaluate((th) => {
            document.documentElement.setAttribute('data-theme', th);
            for (const el of document.querySelectorAll('.cat-block[hidden], .cat-component[hidden], .cat-section[hidden], .cat-group[hidden]'))
                el.removeAttribute('hidden');
        }, theme);
        if (args.includes('--tree-before') && theme !== 'forest')
            await page.addStyleTag({
                content:
                    "[data-theme] .kp-tree [role='treeitem'] { padding-inline-start: calc(var(--kp-tree-depth, 0) * var(--kp-tree-indent, 1rem)) !important }",
            });
        await page.waitForTimeout(400);
        const found = await page.evaluate(inPage);
        for (const f of found) result[theme].push({ page: tg.name, ...f });
        await context.close();
    }
    // collapse repeats of the same (box, text, sides) across pages
    const seen = new Set();
    result[theme] = result[theme].filter((f) => {
        const k = `${f.page}|${f.box}|${f.text}|${f.sides}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
    });
    console.log(`${theme}: ${result[theme].length} findings`);
    for (const f of result[theme].slice(0, limit))
        console.log(`  ${f.page}  "${f.text}"  in ${f.box} (${f.kind})  ${f.sides}${args.includes('--paint') ? '  ' + f.paint + ' ' + f.geo : ''}`);
}
await browser.close();
server.close();
const jsonOut = flag('json', null);
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(result, null, 1));
