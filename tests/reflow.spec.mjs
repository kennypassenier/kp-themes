// Every theme, at a phone's width [G12, TH99, SC 1.4.10].
//
// The gap this closes: nothing in this package had ever been measured at
// 320 or 768px with a REGISTER loaded. tests/overflow.spec.mjs walks the
// eleven example pages, and the concept page it loads carries no theme, so
// it renders in formal; every tests/register-*.spec.mjs renders at
// 1280x900. So cyberpunk's notched corners, the razor tear between the
// sections, blueprint's dimension lines (which write a pixel width into an
// inline style) and the running band under the strip had between them not
// one measurement at a width a phone actually has.
//
// This suite walks the twenty-five concept pages — the only pages that
// wear a theme — in both channels, at the two narrow widths, and runs the
// same audit tests/overflow.spec.mjs runs (tests/audit.mjs, so the two
// suites cannot drift on what a fault is):
//
//   (a) page-scroll — the document scrolls sideways. That is SC 1.4.10
//       gone at the width the criterion is written about.
//   (b) overflow    — an element wider than the box that holds it, or its
//       own content wider than itself. A scroll region is exempt.
//   (c) rhythm      — two stacked blocks touching, under the gap floor in
//       gates/config.json.
//
// What it deliberately does NOT do: change a register. Every register is
// an approved concept demo, and S49 says a test which finds that a demo
// must change produces a FINDING for Kenny, never a silent correction. So
// the suite splits the three faults by who they belong to:
//
//   (a) and (c) belong to the package, and are held strictly for every
//       theme, both channels, both widths. Measured 2026-09-08: no theme
//       scrolls the document sideways at 320 or 768, and no pair of blocks
//       touches. SC 1.4.10 holds across all twenty-five.
//   (b) belongs to the theme. Thirteen registers have an element wider
//       than the box that holds it — between 1 and 19px, in a mark, a
//       stamped card, a spec swatch, a skewed button. Every one is
//       recorded in tests/reflow-findings.json with the pixels both
//       engines measured, and the suite goes red on an overflow that file
//       does not already name. One direction only, and that file says why.
//
// The three choices this suite makes, and why:
//
//   the widths — 320 and 768, the two narrow entries of
//   `overflow.viewportWidths`. 1280 is the width every register suite
//   already renders at; the unmeasured end is the narrow one, and each
//   width added costs the whole sweep again.
//
//   both browsers — kept, and the measurement is the argument: the two
//   engines disagree about ten of the forty-seven recorded entries, and
//   about three whole themes — brutalism overflows in firefox only, sepia
//   and solstice in chromium only. A sweep run in one browser would have
//   been evidence about that browser, which is standing rule 35, and it
//   would have missed a theme either way. It is affordable
//   because each theme is ONE test that loops the four combinations inside
//   itself — 25 tests per browser, not 100 — and the whole sweep costs
//   about 19s in chromium and 32s in firefox on this machine.
//
//   one page per theme — the concept page. It is the only page that wears
//   a theme, and it is the page the register was approved on, so it
//   carries every part a register styles.
//
// Drills [KT3], run 2026-09-08 in chromium, each restored afterwards. Each
// was aimed at the running band, because the band is the part of the page
// this suite is the first thing in the package to see under a theme:
//
//   (a) page-scroll — `min-inline-size: 900px` added to `.kp-marquee` in
//       css/components.css. Red on all 25 themes: "[page-scroll] document:
//       scrollWidth 908 against clientWidth 320", and 908 against 768.
//   (b) overflow — `max-inline-size: 20px` on `[data-kp-marquee-run] >
//       span` in css/components.css, so an item's own content spills out
//       of it while the band's `overflow: hidden` keeps the page still.
//       Red on all 25 themes on the unrecorded branch: "an overflow
//       tests/reflow-findings.json does not name — [overflow] span:
//       content 45 wide in a box of 20".
//   (c) rhythm — `gap` removed from `.kp-stack` in css/layout.css. Red on
//       18 of the 25, naming the pairs that came to touch: "[rhythm]
//       p.kp-side-note above div.kp-autogrid in section.kp-section.kp-stack:
//       0.0px between them, under 2". The seven that stayed green are the
//       registers that space that stack themselves.

import { expect, test } from '@playwright/test';
import { THEMES } from '../js/theme-registry.js';
import { CONCEPT_COPY, DEFAULT_COPY_THEME } from '../showcase/concept-copy.mjs';
import { BLOCK_CONTAINERS, audit, report } from './audit.mjs';
import { readFileSync } from 'node:fs';

/** @type {{overflow: {viewportWidths: number[], minBlockGap: number}}} */
const CONFIG = JSON.parse(readFileSync(new URL('../gates/config.json', import.meta.url), 'utf8'));

/**
 * The element-level overflows the registers already produce, measured and
 * recorded rather than corrected [S49]. tests/reflow-findings.json says
 * why in full.
 *
 * @type {{themes: Record<string, Array<{where: string, chromium: string | null, firefox: string | null}>>}}
 */
const FINDINGS = JSON.parse(readFileSync(new URL('./reflow-findings.json', import.meta.url), 'utf8'));

/**
 * An element name without its state classes.
 *
 * `is-deciphered`, `is-dissolving`, `is-registering`: a headline caught
 * mid-reveal wears whichever one its routine is in, and which one that is
 * differs between the engines and between two runs. The AR20 comparison
 * in tests/examples.spec.mjs drops them for the same reason.
 *
 * @param {string} where
 */
const stable = (where) =>
    where
        .split(' ')
        .map((token) =>
            token
                .split('.')
                .filter((part) => !part.startsWith('is-'))
                .join('.'),
        )
        .join(' ');

/** The two narrow widths, taken from the same list the wide suite reads. */
const WIDTHS = CONFIG.overflow.viewportWidths.filter((/** @type {number} */ width) => width < 1280);
const MIN_GAP = CONFIG.overflow.minBlockGap;

/**
 * Where each theme's concept page lives, per channel.
 *
 * A theme with an approved demo has its own file and wears the theme from
 * the markup; the two that do not (cyberpunk, whose words are the default,
 * and synthwave, which has no entry) are reached through the query
 * parameter the page opts in to [AR42]. The React channel takes the theme
 * the way a consumer's page does — from the stored value, applied by the
 * head snippet before the stylesheet — and the words through `?copy=`.
 *
 * @param {string} theme
 */
const urls = (theme) => ({
    'framework-free':
        theme in CONCEPT_COPY && theme !== DEFAULT_COPY_THEME ? `/examples/concept-${theme}.html` : `/examples/concept.html?theme=${theme}`,
    React: `/tests/fixtures/examples.html?example=concept&copy=${theme}`,
});

test.describe('every theme at a phone width [G12]', () => {
    test('the sweep covers every theme at both narrow widths [AR26]', () => {
        expect(THEMES.length).toBe(25);
        expect(WIDTHS).toEqual([320, 768]);
    });

    // Drill [KT3]: a 'not-a-theme' entry added to the file — red,
    // "not-a-theme is not a theme". Removed again: green.
    test('the findings file names only themes this package has [AR26]', () => {
        const names = new Set(THEMES.map((theme) => theme.name));
        for (const theme of Object.keys(FINDINGS.themes)) expect(names.has(theme), `${theme} is not a theme`).toBe(true);
        expect(Object.keys(FINDINGS.themes).length).toBe(13);
    });

    for (const theme of THEMES) {
        test(`${theme.name} holds at 320 and 768, both channels [G12, TH99]`, async ({ page }) => {
            // A storage this refuses leaves the page in the default theme,
            // and the assertion below then says so rather than passing.
            await page.addInitScript((name) => {
                try {
                    localStorage.setItem('theme', name);
                } catch {
                    /* the assertion on data-theme is the check */
                }
            }, theme.name);

            const recorded = new Set((FINDINGS.themes[theme.name] ?? []).map((entry) => entry.where));
            /** The two faults no theme is allowed: the document scrolling, and blocks that touch. */
            const hard = [];
            /** An element wider than its box: recorded per theme, and red when it is not. */
            const unrecorded = [];
            /** What this run actually measured, so a green run still says what it saw. */
            const seen = [];

            for (const [channel, url] of Object.entries(urls(theme.name))) {
                for (const width of WIDTHS) {
                    await page.setViewportSize({ width, height: 900 });
                    await page.goto(url);
                    await page.waitForLoadState('load');
                    // The page must actually be wearing the theme, or this
                    // measures the default one and reports it green.
                    await expect(page.locator('html')).toHaveAttribute('data-theme', theme.name);
                    // Every finite animation finished, every infinite one
                    // left where it is — the same rule the wide suite uses:
                    // a box mid-flight extends the scrollable area, and a
                    // loop (the band, the terminal sweep) never can finish.
                    await page.evaluate(() => {
                        for (const animation of document.getAnimations()) {
                            if (animation.effect?.getTiming().iterations !== Infinity) animation.finish();
                        }
                    });
                    const found = await audit(page, { minGap: MIN_GAP, containers: BLOCK_CONTAINERS });
                    const at = `at ${width}px (${channel})`;
                    const theseHard = found.filter((entry) => entry.fault !== 'overflow');
                    if (theseHard.length > 0) hard.push(`${at}:\n${report(theseHard)}`);
                    for (const entry of found) {
                        if (entry.fault !== 'overflow') continue;
                        seen.push(`${at}: ${entry.where} — ${entry.detail}`);
                        if (!recorded.has(stable(entry.where))) unrecorded.push(`${at}:\n${report([entry])}`);
                    }
                }
            }

            // The measurement stands in the report whether or not the test
            // is red: a finding nobody can read is not a finding.
            if (seen.length > 0) test.info().annotations.push({ type: 'overflow', description: seen.join('\n') });

            // (a) and (c): SC 1.4.10 and the gap floor, for every theme.
            expect(hard.join('\n'), `${theme.name} — the page itself does not hold\n${hard.join('\n')}`).toBe('');
            // (b): an element wider than its box, and this one is not on
            // the record. Kenny decides what happens to it [S49]; the test
            // only refuses to let it arrive unnoticed.
            expect(unrecorded.join('\n'), `${theme.name} — an overflow tests/reflow-findings.json does not name\n${unrecorded.join('\n')}`).toBe('');
        });
    }
});
