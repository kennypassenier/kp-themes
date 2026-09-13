// A link to a catalogue block lands on that block [2026-09-14].
//
// Kenny: "je kan toch altijd links geven als je naar iets refereert. Vaak kan
// een anchorlink zelfs zodat het extra duidelijk is. Zie dat de catalogus dit
// ondersteunt." A judged block leaves the page, so an anchor to one used to
// point at nothing. It now stays and is scrolled to.
//
// Uses the committed register: button--variants is approved in formal for the
// firefox engine there.

import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

const REGISTER = JSON.parse(readFileSync(new URL('../catalogue/verdicts.json', import.meta.url), 'utf8'));
const judged = REGISTER.verdicts['button--variants']?.formal?.firefox;

for (const [page, id] of [
    ['/catalogue/button.html', 'variants'],
    ['/catalogue/index.html', 'button--variants'],
]) {
    test(`an anchor to a judged block shows it and scrolls to it — ${page}#${id}`, async ({ page: tab, browserName }) => {
        test.skip(browserName !== 'firefox' || !judged, 'the register holds this verdict for firefox only');
        await tab.goto('/catalogue/index.html');
        await tab.evaluate(() => localStorage.setItem('theme', 'formal'));
        await tab.goto(`${page}#${id}`);
        const block = tab.locator(`[id="${id}"]`);
        await expect(block).toHaveAttribute('data-cat-state', 'approved', { timeout: 30000 });
        // While a reading runs every block is shown; only once other judged
        // blocks are hidden again has the page decided what leaves it.
        await expect.poll(() => tab.locator('.cat-block[hidden]').count(), { timeout: 30000 }).toBeGreaterThan(0);
        await expect(block).not.toHaveAttribute('hidden', '');
        await expect(block).toBeVisible();
        await expect.poll(() => block.evaluate((el) => Math.round(el.getBoundingClientRect().top)), { timeout: 10000 }).toBeLessThan(200);
    });
}
