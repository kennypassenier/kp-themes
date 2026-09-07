// The overflow floor, one shared rule for five components [TH113, AR32].
//
// `.kp-button`, `.kp-badge`, `.kp-tag` and `.kp-health` each held a single
// unbroken 44-character value at its full width and pushed the document
// sideways. Measured at 360px before the rule existed: 607, 485, 483 and
// 581px. `.kp-copyable` had already grown its own copy of the answer in
// 3.2.0; AR32 says the five share one rule rather than keeping five.
//
// `.kp-icon-button` is deliberately not here: it has a fixed size, and a
// fixed size is the answer to this question rather than a case of it.
//
// Both channels render the same class names from the same stylesheet, so
// the bar is both BROWSERS rather than both channels: the rule is CSS and
// there is nothing a React render could do differently. The one class the
// React channel builds by hand is `.kp-tag`, from components/combobox.jsx,
// and it is the same string.
//
// Drill [KT3]: the shared `.kp-button, .kp-badge, .kp-tag, .kp-health,
// .kp-copyable` rule removed from css/components.css — all ten tests red,
// both browsers, five components. `.kp-copyable` going red with the other
// four is the evidence that it joined the rule rather than kept its own:
// before the rule was written it was the one of the five already green.

import { expect, test } from '@playwright/test';

const FIXTURE = '/tests/fixtures/narrow.html';

/** The two narrow widths TH113 names. 320 is the SC 1.4.10 reflow floor. */
const WIDTHS = [320, 360];

/** The five components AR32 puts on one rule, by their `data-case`. */
const CASES = ['button', 'badge', 'tag', 'health', 'copyable'];

test.describe('the overflow floor', () => {
    for (const name of CASES) {
        test(`.kp-${name === 'button' ? 'button' : name} holds the page at 320 and 360 [TH113, AR32]`, async ({ page }) => {
            /** @type {string[]} */
            const problems = [];
            for (const width of WIDTHS) {
                await page.setViewportSize({ width, height: 800 });
                await page.goto(FIXTURE);
                await page.waitForLoadState('load');
                // Only this component is left on the page, so a red result
                // names one component rather than the whole fixture.
                await page.evaluate((keep) => {
                    for (const el of document.querySelectorAll('[data-case]')) {
                        if (/** @type {HTMLElement} */ (el).dataset.case !== keep) el.remove();
                    }
                }, name);
                const found = await page.evaluate((id) => {
                    const doc = document.documentElement;
                    const el = /** @type {HTMLElement} */ (document.querySelector(`[data-test="${id}"]`));
                    return {
                        scrollWidth: doc.scrollWidth,
                        clientWidth: doc.clientWidth,
                        width: el.getBoundingClientRect().width,
                    };
                }, name);
                if (found.scrollWidth > found.clientWidth + 1) {
                    problems.push(`at ${width}px the document scrolls: ${found.scrollWidth} against ${found.clientWidth}`);
                }
                if (found.width > found.clientWidth + 1) {
                    problems.push(`at ${width}px the element measures ${Math.round(found.width)} in a viewport of ${found.clientWidth}`);
                }
            }
            expect(problems.join('\n'), problems.join('\n')).toBe('');
        });
    }
});
