// Measures, in Firefox, every text of a demo's components against its neighbours AND against the edge of the plate it
// stands on: Kenny's rule that text never touches an edge or a neighbour (2026-10-16 and again 2026-10-17: "ik had toch
// gezegd dat ik nooit text wil die tegen de rand plakt zonder marge tussen die elementen?"). The measures of earlier
// rounds compared text with text only, so text against its own plate's edge went through (correction text-edge-1017).
//
// It is a measuring script, not a test: it runs before a round is put on the Agenda, by the helper that built it and by
// Claude before the push, and prints one line per text closer than 4 px. Exit code 1 when anything is found.
//
// Since align-grid-1019 it also runs measure-align.mjs's measurement on every section (Kenny, 2026-10-19 06:43: "Gebruik
// het grid en align deftig verticaal!"): columns of sibling rows on one edge, every cell of a row on its label's line,
// buttons side by side on one line, a button group on the tracks of the rows above. Its lines start with "align".
//
// Since states-check-1019 it also runs measure-states.mjs on the page (Kenny, 2026-10-19 11:25: the project threads built
// tables without the busy card and lists, graphs, cards and forms without the standard loading, empty and failed plates):
// every kp data component is in a state the package drew, no hand-made "Loading…" / "No data" / spinner stands in for one,
// and each one driven into loading, empty and failed through the package covers its footprint. Its lines start with "states".
//
// Text and marks inside a closed <details> are not on screen, and text clipped by a scrolling box (a log that follows its tail,
// also one the page wraps around the component) is skipped, on either axis [hltools-1019, homelab 81 and 83]. Its states pass holds
// the page's live streams during the driven half (measure-states.mjs; --live-streams opts out).
//
// Run (a static server on the repository root first):
//   node research/_review/measure-gaps.mjs <port> <research/topic/demo.html> [themes=formal,dark] [widths=1280,390]
// An app behind a login, or one serving its own copy of kp-themes (cli-context.mjs; the options also work on
// measure-states.mjs and measure-align.mjs):
//   KP_LOGIN_USER=… KP_LOGIN_PASS=… node research/_review/measure-gaps.mjs --url https://host/app/page [themes] [widths] \
//     --login-form /login,username,password,'button[type=submit]' --storage-state ~/.cache/x/state.json \
//     --assets-from /static/kp=$HOME/Projects/kp-themes --ignore-https-errors
//   --url <page url> (replaces <port> <page>) · --cookie name=value (repeatable) · --login-form url,userField,passField,submit
//   (credentials from KP_LOGIN_USER/KP_LOGIN_PASS or --login-env USERVAR,PASSVAR, never argv) · --storage-state <file>
//   (reuse/save a login) · --assets-from <prefix>=<dir> (repeatable) · --ignore-https-errors
import { ALIGN_TOLERANCE, measureAlign, measureAlignOpened } from './measure-align.mjs';
import { measureStatesAt } from './measure-states.mjs';
import { launch, locate, OPTIONS_USAGE, parseArgs } from './cli-context.mjs';

const { positional, opts } = parseArgs(process.argv.slice(2));
const where = locate(positional, opts);
const [themeArg = 'formal,dark', widthArg = '1280,390'] = where.rest;
if (!where.page) {
    console.error(`usage: node research/_review/measure-gaps.mjs <port> <research/topic/demo.html> [themes] [widths] ${OPTIONS_USAGE}`);
    process.exit(2);
}
const MIN = 4;

/**
 * In the page: every component text closer than MIN to a neighbour or its plate's edge.
 * @param {[number, string]} args min, and the id of the one section to measure
 */
function measure([min, only]) {
    const res = [];
    const visible = (/** @type {DOMRect} */ r) => r.width > 0.5 && r.height > 0.5;
    // Content of a closed <details> (a "How to change this" fold) is not on screen, whatever the box tree still holds of it;
    // its <summary> is [hltools-1019, homelab 83].
    const inClosedFold = (/** @type {Element} */ el) => {
        for (let a = /** @type {Element | null} */ (el), via = null; a; via = a, a = a.parentElement)
            if (a.tagName === 'DETAILS' && !(/** @type {HTMLDetailsElement} */ (a).open) && !(via && via.tagName === 'SUMMARY')) return true;
        return false;
    };
    for (const section of document.querySelectorAll('[data-review-item]')) {
        if (section.getAttribute('data-review-item') !== only) continue;
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
                if (getComputedStyle(el).visibility === 'hidden' || el.closest('[hidden], .kp-sr-only, [aria-hidden="true"]') || inClosedFold(el)) continue;
                const range = document.createRange();
                range.selectNodeContents(n);
                // A text cut off by an ancestor that clips (an ellipsis) is measured up to the clip.
                let clip = null;
                // The chain runs up to the section, not only to the component: a scrolling box the page wraps around the component
                // (a log that follows its tail) clips the text too, on either axis [hltools-1019, homelab 81, 83].
                for (let a = el; a && a !== section.parentElement; a = a.parentElement) {
                    if (getComputedStyle(a).overflowX === 'visible' && getComputedStyle(a).overflowY === 'visible') continue;
                    const ar = a.getBoundingClientRect();
                    clip = clip
                        ? {
                              left: Math.max(clip.left, ar.left),
                              right: Math.min(clip.right, ar.right),
                              top: Math.max(clip.top, ar.top),
                              bottom: Math.min(clip.bottom, ar.bottom),
                          }
                        : { left: ar.left, right: ar.right, top: ar.top, bottom: ar.bottom };
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
                    // A line the clip cuts away altogether (a folded quote's hidden lines) is not on screen.
                    if (clip && (raw.bottom <= clip.top + 0.5 || raw.top >= clip.bottom - 0.5)) continue;
                    // A cell a kept (sticky) column of its row passes under is covered there: the opaque ground of the kept cell hides
                    // its words, so they are not on screen (data-kp-fixed-end, datatable-r5-1019).
                    const cell = el.closest('td, th');
                    const covered =
                        cell !== null &&
                        getComputedStyle(cell).position !== 'sticky' &&
                        [...(cell.parentElement?.children ?? [])].some((other) => {
                            if (other === cell || getComputedStyle(other).position !== 'sticky') return false;
                            const o = other.getBoundingClientRect();
                            return Math.min(rect.right, o.right) - Math.max(rect.left, o.left) > 0.5;
                        });
                    if (visible(rect) && !covered) texts.push({ el, rect, t: n.textContent.trim().slice(0, 28) });
                }
            }
            for (const el of s.querySelectorAll('*')) {
                const r = el.getBoundingClientRect();
                if (!visible(r)) continue;
                const cs = getComputedStyle(el);
                if (cs.visibility === 'hidden' || inClosedFold(el)) continue;
                // A mark scrolled out of a scrolling list (a log that follows its tail) is not on screen.
                let away = false;
                for (let a = el.parentElement; a && a !== section.parentElement && !away; a = a.parentElement) {
                    if (getComputedStyle(a).overflowY === 'visible') continue;
                    const ar = a.getBoundingClientRect();
                    away = r.bottom <= ar.top + 0.5 || r.top >= ar.bottom - 0.5;
                }
                if (away) continue;
                // A gantt's time rule is a gridline drawn under every bar and under the legend of a scrolled frame; a bar stands on an
                // opaque ground over it, so a text above it is not crossed by it (this measure sees boxes, not stacking) [r3r5-1019].
                if (el.classList.contains('kp-gantt__rule')) continue;
                const marky =
                    !el.textContent?.trim() && (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.borderLeftWidth !== '0px' || el.tagName === 'svg');
                if (marky) boxes.push({ el, r, text: '' });
            }
        }
        // A bar fixed to the viewport (a phone's tab bar) floats over the page as it scrolls; content under it at one scroll
        // position is not an overlap, so a fixed part is only compared with parts in the same fixed layer (chassis-rs at 390).
        const fixedOf = (/** @type {Element} */ el) => {
            for (let a = /** @type {Element | null} */ (el); a; a = a.parentElement) if (getComputedStyle(a).position === 'fixed') return a;
            return null;
        };
        for (const t of texts) {
            for (const b of [...boxes, ...texts.filter((o) => o.el !== t.el).map((o) => ({ el: o.el, r: o.rect, text: o.t }))]) {
                if (b.el.contains(t.el) || t.el.contains(b.el)) continue;
                if (fixedOf(t.el) !== fixedOf(b.el)) continue;
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
            // A scrolling track fades the side that has more segments out of sight (data-kp-segmented-more, a mask on the
            // track): a label there dissolves into the edge, so only the side with nothing beyond it is held to the rule
            // [t56-scrolledge-1018].
            const more = (p.getAttribute('data-kp-segmented-more') || '').split(' ');
            const faded = getComputedStyle(p).maskImage !== 'none' && getComputedStyle(p).maskImage !== '';
            const rtl = getComputedStyle(p).direction === 'rtl';
            const leftMore = faded && more.includes(rtl ? 'end' : 'start');
            const rightMore = faded && more.includes(rtl ? 'start' : 'end');
            const edge = Math.min(leftMore ? Infinity : l, rightMore ? Infinity : r);
            void top;
            void bottom;
            if (edge < min - 0.05 && pr.width > t.rect.width + 1)
                res.push(`${id}: "${t.t}" ${edge.toFixed(1)}px from the edge of ${p.tagName.toLowerCase()}.${String(p.className).split(' ')[0]}`);
        }
    }
    return [...new Set(res)];
}

const browser = await launch(new URL(where.page).origin, opts);
let found = 0;
for (const width of widthArg.split(',').map(Number))
    for (const theme of themeArg.split(',')) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        const response = await page.goto(where.urlFor(theme));
        // A missing page must never read as clear: another server on the same port once answered 404 [port-1017].
        if (!response || !response.ok()) {
            console.error(`${where.label} answered ${response ? response.status() : 'nothing'}; is this worktree's server on that port?`);
            process.exit(2);
        }
        await page.waitForTimeout(1500);
        // One section at a time, scrolled to the top of the window: a raised list (a combobox opened at load) is placed against
        // the window, so measured while its field is far below the fold it lands over unrelated text and the reading changes
        // with the scroll position and the timing [t56-gapscroll-1018].
        const ids = await page.evaluate(() =>
            [...document.querySelectorAll('[data-review-item]')].map((s) => String(s.getAttribute('data-review-item'))),
        );
        /** @type {string[]} */
        let out = [];
        /** @type {string[]} */
        let align = [];
        for (const id of ids) {
            await page.evaluate(
                (i) => document.querySelector(`[data-review-item="${i}"]`)?.scrollIntoView({ block: 'start', behavior: 'instant' }),
                id,
            );
            await page.waitForTimeout(250);
            out = out.concat(await page.evaluate(measure, /** @type {[number, string]} */ ([MIN, id])));
            align = align.concat(await measureAlignOpened(page, id));
        }
        await page.close();
        const states = await measureStatesAt(browser, where.urlFor(theme), { width, liveStreams: opts.liveStreams });
        found += out.length + align.length + states.length;
        const said = [
            out.length ? `${out.length} text(s) closer than ${MIN}px` : '',
            align.length ? `${align.length} alignment fault(s)` : '',
            states.length ? `${states.length} state fault(s)` : '',
        ].filter(Boolean);
        console.log(`${theme} ${width}: ${said.length ? said.join(', ') : 'clear'}`);
        for (const line of out) console.log(`  ${line}`);
        for (const line of align) console.log(`  align ${line}`);
        for (const line of states) console.log(`  states ${line}`);
    }
await browser.close();
process.exit(found ? 1 : 0);
