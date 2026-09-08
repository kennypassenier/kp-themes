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
// The audit itself lives in tests/audit.mjs, because tests/reflow.spec.mjs
// measures the same three faults on the per-theme concept pages.
import { BLOCK_CONTAINERS, audit, report } from './audit.mjs';

/** @type {{overflow: {viewportWidths: number[], minBlockGap: number}}} */
const CONFIG = JSON.parse(readFileSync(new URL('../gates/config.json', import.meta.url), 'utf8'));
const WIDTHS = CONFIG.overflow.viewportWidths;
const MIN_GAP = CONFIG.overflow.minBlockGap;

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
                    // And every animation is finished first: the cyberpunk navbar
                    // strip slides in over 520ms, and a transformed box mid-flight
                    // extends the scrollable area — measured once as a 1280px
                    // overflow in chromium that three reruns did not reproduce
                    // (rule 8a: a flake is named, then removed).
                    // A loop cannot be finished (the terminal register's sweep,
                    // brutalism's marquee, forest's drift): a finite animation is
                    // finished, an infinite one is left where it is — it moves a
                    // pattern or a band and never the layout.
                    await page.evaluate(() => {
                        for (const animation of document.getAnimations()) {
                            if (animation.effect?.getTiming().iterations !== Infinity) animation.finish();
                        }
                    });
                    const found = await audit(page, { minGap: MIN_GAP, containers: BLOCK_CONTAINERS });
                    if (found.length > 0) problems.push(`at ${width}px:\n${report(found)}`);
                }
                expect(problems.join('\n'), problems.join('\n')).toBe('');
            });
        }
    }
});
