// The hidden attribute beats every display rule in the package [KT13].
//
// Correction KT13 (2026-09-08): `.kp-stack`'s `display: flex` beat the
// `hidden` attribute on the compare page — every theme section was
// visible at once — and the test read the attribute, not the paint. The
// base layer now carries `[hidden] { display: none !important }`, and
// this test reads what the browser draws.
//
// Drill [KT3]: with the rule removed from css/_rules.css and themes.css
// regenerated, the stacked element paints (display "flex", height > 0)
// and the test goes red in both browsers; restored. Performed 2026-09-08.

import { expect, test } from '@playwright/test';

const CLASSES = ['kp-stack', 'kp-row', 'kp-autogrid', 'kp-button', 'kp-card', 'kp-nav'];

test('an element with hidden and a package display class does not paint', async ({ page }) => {
    await page.goto('/examples/concept.html?theme=formal');
    await expect(page.locator('[data-kp-surface="app"]').first()).toBeVisible();
    const painted = await page.evaluate((classes) => {
        const out = [];
        for (const cls of classes) {
            const el = document.createElement(cls === 'kp-button' ? 'button' : 'div');
            el.className = cls;
            el.hidden = true;
            el.textContent = 'probe';
            document.body.append(el);
            const style = getComputedStyle(el);
            const box = el.getBoundingClientRect();
            if (style.display !== 'none' || box.height > 0) out.push(`${cls}: display ${style.display}, height ${box.height}`);
            el.remove();
        }
        return out;
    }, CLASSES);
    expect(painted, 'a hidden element painted').toEqual([]);
});
