// The scroll boundary [TH114, AR33].
//
// Six assertions, three regions, two halves each. The half that was
// assumed and the half that is true:
//
//   an absolutely positioned child of a scroll region is CLIPPED, and
//   a popover is NOT.
//
// The draft of TH114 would have told consumers that a popover belongs
// outside a scroll area because nothing escapes one. The
// `architecture-critic` measured the opposite and AR33 wrote it down: a
// popover lives in the top layer, where no ancestor's overflow applies.
// The boundary is `position: absolute`, not "a popover" — and this
// package ships `popover` itself (AR15), so the draft's sentence would
// have steered consumers away from the one construction that works.
//
// Why the regions clip at all: each of the three declares `overflow-x:
// auto` and nothing else about overflow, and `overflow-y` then computes
// to `auto` rather than `visible` — a box that scrolls in one axis is a
// clip in both.
//
// The measurement is a hit test, not a rectangle. `getBoundingClientRect`
// reports where a clipped element WOULD be, so a rect comparison would
// score both halves as escaping. Each test first checks the geometry —
// the probe hangs below the region's bottom edge, which is the
// precondition both halves share — and then asks
// `document.elementFromPoint` at the probe's own centre whether the probe
// is the thing that is actually there.
//
// The two probes in a region carry identical declarations and differ in
// one attribute, `popover`, so what separates the results is the top
// layer and nothing else. The fixture writes no `overflow`, no `contain`
// and no `clip-path`: the clip under test is the package's [KT3,
// rule 7e].
//
// DRILLS (KT3), run 2026-09-07 in Chromium 151 and Firefox 153. Three of
// the six assert that the PACKAGE applies something and were driven red;
// three assert a browser behaviour no declaration here supplies, and are
// recorded below as the finding rather than as a gap.
//
//   DRILLABLE — clipped, `.kp-table-wrap`: the `overflow-x: auto` line
//       deleted from `.kp-table-wrap` (css/components.css:708). Red in
//       both browsers, "hit at the probe's own centre:
//       div[table-wrap-absolute]". The popover case in the same region
//       stayed green in the same run.
//   DRILLABLE — clipped, `.kp-diff`: the line deleted from BOTH `.kp-diff`
//       (css/components.css:1979) and `pre` (css/_rules.css:459, then
//       `npm run generate`). Red in both browsers. Deleting only the first
//       leaves it GREEN, and that is the finding rather than a weak drill:
//       `.kp-diff` is itself a `<pre>` in every shape this package draws
//       (showcase/specimens.mjs:387, site/components/diff.html:119), so the
//       element rule clips it with the component rule gone.
//   DRILLABLE — clipped, the `<pre>` rule: the line deleted from `pre`
//       (css/_rules.css:459). Red in both browsers for this region only;
//       `.kp-diff` stayed green, which is the same fact from the other
//       side.
//
//   NOT DRILLABLE — the three "a popover is not clipped" cases. They rest
//       on the top layer, which is the browser's and not this package's;
//       there is no declaration to remove. The attempt was made rather
//       than assumed: with all three `overflow-x: auto` lines deleted at
//       once, the three clipped cases went red in both browsers and these
//       three stayed GREEN — six failed, six passed. A popover that was
//       never clipped is still not clipped once the clip is gone.
//
// All removals restored; the suite green again over all six.

import { test, expect } from '@playwright/test';

const URL = '/tests/fixtures/scroll-boundary.html';

/**
 * The three scroll regions, named as a consumer meets them.
 *
 * `.kp-diff` is a `<pre>`, so it carries the element rule as well as its
 * own; the drill note above says what that costs.
 */
const REGIONS = [
    { name: 'table-wrap', label: '.kp-table-wrap' },
    { name: 'diff', label: '.kp-diff' },
    { name: 'pre', label: 'the <pre> rule' },
];

/**
 * Measure one probe: where it sits, and whether it is the element a click
 * at its own centre would reach.
 *
 * The region is scrolled to the top of the viewport first. Without that
 * the third region's probe lands past the bottom of a 720px viewport,
 * `elementFromPoint` returns null, and "the probe is not there" passes for
 * the wrong reason — so `inViewport` is asserted by every case.
 *
 * The popover is then moved to the exact viewport rectangle its
 * absolutely positioned twin occupies. It has to be, and that is itself
 * part of what AR33 is about: a top-layer element's `position: absolute`
 * resolves against the INITIAL containing block, not against its DOM
 * parent — measured `inset-block-start: 100%` giving `top: 720px` in a
 * 720px viewport, in both browsers. The two probes therefore cover the
 * same pixels, and the only thing that differs is the top layer.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} region the `data-region` value
 * @param {'absolute' | 'popover'} kind
 * @returns {Promise<{regionBottom: number, top: number, bottom: number, inViewport: boolean, escapes: boolean, hit: string}>}
 */
async function measure(page, region, kind) {
    return page.evaluate(
        ([regionName, probeKind]) => {
            const box = /** @type {HTMLElement} */ (document.querySelector(`[data-region="${regionName}"]`));
            const twin = /** @type {HTMLElement} */ (document.querySelector(`[data-test="${regionName}-absolute"]`));
            const probe = /** @type {HTMLElement} */ (document.querySelector(`[data-test="${regionName}-${probeKind}"]`));
            box.scrollIntoView({ block: 'start' });
            if (probeKind === 'popover') {
                const target = twin.getBoundingClientRect();
                // Document coordinates, not viewport ones: the initial
                // containing block has its origin at the top of the
                // DOCUMENT, so a scrolled page needs the offset added back.
                probe.style.insetBlockStart = `${target.top + window.scrollY}px`;
                probe.style.insetInlineStart = `${target.left + window.scrollX}px`;
                probe.showPopover();
            }
            const boxRect = box.getBoundingClientRect();
            const rect = probe.getBoundingClientRect();
            const x = Math.round(rect.left + rect.width / 2);
            const y = Math.round(rect.top + rect.height / 2);
            const hit = document.elementFromPoint(x, y);
            return {
                regionBottom: boxRect.bottom,
                top: rect.top,
                bottom: rect.bottom,
                inViewport: x >= 0 && y >= 0 && x < window.innerWidth && y < window.innerHeight,
                escapes: hit === probe,
                hit: hit ? `${hit.tagName.toLowerCase()}${hit.getAttribute('data-test') ? `[${hit.getAttribute('data-test')}]` : ''}` : 'null',
            };
        },
        [region, kind],
    );
}

for (const region of REGIONS) {
    test(`${region.label}: an absolutely positioned child is clipped [TH114]`, async ({ page }) => {
        await page.goto(URL);
        const probe = await measure(page, region.name, 'absolute');

        // The precondition both halves share: the probe is laid out past
        // the region's bottom edge. Without this the case would pass on a
        // probe that never left the box.
        expect(probe.top, 'the probe is laid out below the region').toBeGreaterThanOrEqual(probe.regionBottom - 1);
        expect(probe.inViewport, 'the point probed is inside the viewport').toBe(true);

        // Drill: see the header. The declaration removed is `overflow-x:
        // auto` on this region — and, for `.kp-diff`, on `pre` as well.
        expect(probe.escapes, `hit at the probe's own centre: ${probe.hit}`).toBe(false);
    });

    test(`${region.label}: a popover is not clipped [TH114, AR33]`, async ({ page }) => {
        await page.goto(URL);
        const probe = await measure(page, region.name, 'popover');

        expect(probe.top, 'the probe is laid out below the region').toBeGreaterThanOrEqual(probe.regionBottom - 1);
        expect(probe.inViewport, 'the point probed is inside the viewport').toBe(true);

        // Not drillable: no declaration in this package makes a popover
        // escape, so there is none to remove. See the header for the
        // attempt that stayed green.
        expect(probe.escapes, `hit at the probe's own centre: ${probe.hit}`).toBe(true);
    });
}
