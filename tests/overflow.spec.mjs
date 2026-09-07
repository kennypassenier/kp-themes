// The overflow and rhythm gate [TH99, AR26].
//
// Runs over every example page, in both channels, in both browsers, at
// the three widths in gates/config.json. Three separate faults, reported
// separately, because "the page looks wrong" is not something anybody can
// act on:
//
//   (a) page-scroll   — the document scrolls sideways (SC 1.4.10 is gone)
//   (b) overflow      — an element is wider than the box that holds it,
//                       or its own content is wider than the element
//   (c) rhythm        — two consecutive blocks touch, with no vertical
//                       space between them. This is the fault the whole
//                       round started from: a field and a button that
//                       met because nothing supplied a gap.
//
// AR26: the number of pages this expects comes from the descriptor list,
// not from globbing the directory the generator just wrote — a glob would
// always find exactly what was written and always pass.
//
// The three drills, run 2026-09-06, each on its own check (KT3). The
// three faults are switchable for exactly this reason: a page broken
// badly enough to scroll sideways trips all three at once, and a drill
// that cannot say WHICH check fired has demonstrated nothing.
//
//   (a) page-scroll — `min-inline-size: 900px` added to `.kp-page` in
//       css/layout.css. Red on 20 of the 21 tests with only page-scroll
//       enabled: "document: scrollWidth 932 against clientWidth 320" and
//       954 against 768. Removed again: green.
//   (b) overflow — `overflow-x: auto` removed from `.kp-table-wrap` in
//       css/components.css. Red on list-with-form in both channels with
//       only overflow enabled: "table.kp-table inside div.kp-table-wrap:
//       wider than its container by 616px" at 320, 190px at 768.
//       Restored: green.
//   (c) rhythm — `gap` removed from `.kp-stack` in css/layout.css. Red on
//       12 of the 21 tests with only rhythm enabled, naming the pairs
//       that came to touch: "div.kp-field above div.kp-field in
//       form.kp-stack: 0.0px between them, under 2". Restored: green.
//
// Two attempts at (a) stayed GREEN and are recorded because they are the
// finding, not the failure. Removing `overflow-wrap: anywhere` from
// `.kp-code-block` did not scroll any page: css/_rules.css:459 already
// gives every `pre` its own `overflow-x: auto`, so a long key scrolls
// inside the block — the package was already right about the case that
// drill was aimed at. And parking `.kp-skip-link` at
// `inset-inline-start: 150%` did not scroll the page either: an
// absolutely positioned box sitting above the viewport contributes no
// rightward scroll in Chromium.

import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { EXAMPLES } from '../showcase/examples.mjs';

/** @type {{overflow: {viewportWidths: number[], minBlockGap: number}}} */
const CONFIG = JSON.parse(readFileSync(new URL('../gates/config.json', import.meta.url), 'utf8'));
const WIDTHS = CONFIG.overflow.viewportWidths;
const MIN_GAP = CONFIG.overflow.minBlockGap;

/**
 * The containers whose children are the page's own blocks.
 *
 * Not every element with two children: a card's header and its body
 * touch on purpose, and a table row's cells are not blocks. The rhythm
 * rule is about what a page AUTHOR stacks — which is what the chassis kit
 * got wrong — so it is measured on the layout containers a page author
 * composes with, and nowhere else. A component's internals are that
 * component's business.
 */
const BLOCK_CONTAINERS = 'main, article, form, .kp-page, .kp-stack, .kp-section, .kp-prose';

/**
 * Audit one rendered document. Returns a flat list of findings, each
 * naming its fault so a red run says which of the three it is.
 *
 * The three faults are switchable, and that is not decoration: each one
 * has to be shown able to fail ON ITS OWN, and a page broken badly enough
 * to scroll sideways usually trips all three at once. The gate always
 * runs all three; a drill runs one.
 *
 * @param {import('@playwright/test').Page} page
 * @param {{minGap: number, containers: string, faults?: string[]}} options
 * @returns {Promise<Array<{fault: string, where: string, detail: string}>>}
 */
const audit = (page, { faults = ['page-scroll', 'overflow', 'rhythm'], ...rest }) =>
    page.evaluate(
        ({ minGap, containers, faults }) => {
            const on = new Set(faults);
            /** @type {Array<{fault: string, where: string, detail: string}>} */
            const found = [];

            /** @param {Element} el */
            const name = (el) => {
                const classes = typeof el.className === 'string' && el.className.trim() ? `.${el.className.trim().split(/\s+/).join('.')}` : '';
                return `${el.tagName.toLowerCase()}${classes}`;
            };

            /** @param {Element} el */
            const scrolls = (el) => {
                const overflow = getComputedStyle(el).overflowX;
                return overflow === 'auto' || overflow === 'scroll' || overflow === 'hidden';
            };

            /** @param {Element} el */
            const laidOut = (el) => {
                const style = getComputedStyle(el);
                if (style.display === 'none' || style.visibility === 'hidden') return false;
                if (style.position === 'fixed' || style.position === 'absolute') return false;
                const rect = el.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0;
            };

            // (a) The document itself must not scroll sideways.
            const doc = document.documentElement;
            if (on.has('page-scroll') && doc.scrollWidth > doc.clientWidth + 1) {
                found.push({
                    fault: 'page-scroll',
                    where: 'document',
                    detail: `scrollWidth ${doc.scrollWidth} against clientWidth ${doc.clientWidth}`,
                });
            }

            // (b) Nothing wider than the box that holds it, and nothing whose
            //     own content spills out of it. A scroll region is exempt in
            //     both directions: that is what it is for.
            for (const el of on.has('overflow') ? document.body.querySelectorAll('*') : []) {
                if (['SCRIPT', 'STYLE', 'TEMPLATE', 'BR', 'HEAD'].includes(el.tagName)) continue;
                if (el.closest('[popover], dialog')) continue;
                if (!laidOut(el)) continue;

                const parent = el.parentElement;
                if (parent && parent !== document.documentElement && !scrolls(parent)) {
                    const rect = el.getBoundingClientRect();
                    const box = parent.getBoundingClientRect();
                    const over = Math.max(rect.right - box.right, box.left - rect.left);
                    if (over > 1) {
                        found.push({
                            fault: 'overflow',
                            where: `${name(el)} inside ${name(parent)}`,
                            detail: `wider than its container by ${Math.round(over)}px`,
                        });
                    }
                }
                if (!scrolls(el) && el.scrollWidth > el.clientWidth + 1 && el.clientWidth > 0) {
                    found.push({
                        fault: 'overflow',
                        where: name(el),
                        detail: `content ${el.scrollWidth} wide in a box of ${el.clientWidth}`,
                    });
                }
            }

            // (c) Two consecutive blocks may not touch.
            for (const container of on.has('rhythm') ? document.querySelectorAll(containers) : []) {
                const children = [...container.children].filter(
                    (child) => !['SCRIPT', 'STYLE', 'TEMPLATE'].includes(child.tagName) && laidOut(child),
                );
                for (let i = 1; i < children.length; i++) {
                    const above = children[i - 1].getBoundingClientRect();
                    const below = children[i].getBoundingClientRect();
                    // Only a stacked pair: two controls side by side in a row
                    // overlap vertically and are not a rhythm question.
                    if (below.top < above.bottom - 0.5) continue;
                    const gap = below.top - above.bottom;
                    if (gap < minGap) {
                        found.push({
                            fault: 'rhythm',
                            where: `${name(children[i - 1])} above ${name(children[i])} in ${name(container)}`,
                            detail: `${gap.toFixed(1)}px between them, under ${minGap}`,
                        });
                    }
                }
            }

            return found;
        },
        { ...rest, faults },
    );

/** @param {Array<{fault: string, where: string, detail: string}>} found */
const report = (found) => found.map((f) => `  [${f.fault}] ${f.where}: ${f.detail}`).join('\n');

test.describe('the overflow and rhythm gate', () => {
    test('it runs over the ten pages TH98 names, from the descriptor list [AR26]', () => {
        // Ten pages TH98 names, plus the concept demo that joined at round
        // six's C0 [TH126]. C0's CI went red on this line — the browser
        // job, after the gates job was green — and the push chain read the
        // wrong signal and moved main anyway (R6-Q5).
        expect(EXAMPLES.length).toBe(11);
        expect(WIDTHS).toEqual([320, 768, 1280]);
    });

    for (const example of EXAMPLES) {
        for (const [channel, url] of [
            ['framework-free', `/examples/${example.id}.html`],
            ['React', `/tests/fixtures/examples.html?example=${example.id}`],
        ]) {
            test(`${example.id} holds at 320, 768 and 1280, ${channel} [TH99]`, async ({ page }) => {
                /** @type {string[]} */
                const problems = [];
                for (const width of WIDTHS) {
                    await page.setViewportSize({ width, height: 900 });
                    await page.goto(url);
                    // The layout settles before it is measured: a font
                    // swapping in after the measurement would make this
                    // flaky rather than wrong.
                    await page.waitForLoadState('load');
                    const found = await audit(page, { minGap: MIN_GAP, containers: BLOCK_CONTAINERS });
                    if (found.length > 0) problems.push(`at ${width}px:\n${report(found)}`);
                }
                expect(problems.join('\n'), problems.join('\n')).toBe('');
            });
        }
    }
});
