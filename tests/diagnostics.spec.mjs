// The diagnostics page judges a pair it was handed [TH97, S29, AR25].
//
// The point of this page is a verdict, and a verdict that has only ever
// seen a matching pair has never been read. So three of the five tests
// below feed it a deliberately mismatched pair — an older stylesheet, a
// newer stylesheet, and two halves that agree about the version and
// disagree about the themes — and read what it says about each.
//
// The mismatch is fed by overriding the custom properties on `:root`,
// which is the real read path: the page goes on reading the live
// stylesheet through getComputedStyle exactly as it does on a consumer's
// site. The alternative — passing a hand-made object to `diagnose()` —
// is measured too, in gates/gates.test.mjs, but it would prove nothing
// about whether the stylesheet declares anything at all.

import { test, expect } from '@playwright/test';
import { THEMES, VERSION } from '../js/theme-registry.js';

const PAGE = '/showcase/diagnostics.html';
const NAMES = THEMES.map((t) => t.name).join(' ');

/**
 * Override what the stylesheet says about itself, then draw the page
 * again from the live document.
 *
 * @param {import('@playwright/test').Page} page
 * @param {{version?: string, names?: string}} pretend
 */
async function redraw(page, pretend = {}) {
    return page.evaluate(async (fake) => {
        if (fake.version !== undefined || fake.names !== undefined) {
            const style = document.createElement('style');
            const lines = [];
            if (fake.version !== undefined) lines.push(`--kp-themes-version: '${fake.version}';`);
            if (fake.names !== undefined) lines.push(`--kp-themes-names: '${fake.names}';`);
            style.textContent = `:root { ${lines.join(' ')} }`;
            document.head.append(style);
        }
        const module = await import('/js/diagnostics.js');
        const report = module.renderDiagnostics(document.getElementById('kp-diagnostics'));
        /** @param {string} key @param {string} side */
        const cell = (key, side) => document.querySelector(`[data-kp-diagnostic="${key}"] [data-kp-side="${side}"]`)?.textContent ?? '';
        const verdictElement = document.querySelector('[data-kp-diagnostic="verdict"]');
        return {
            status: report.status,
            drawnStatus: verdictElement?.getAttribute('data-kp-status') ?? '',
            verdict: verdictElement?.textContent ?? '',
            stylesheetVersion: cell('version', 'stylesheet'),
            scriptVersion: cell('version', 'script'),
            stylesheetThemes: cell('themes', 'stylesheet'),
            scriptThemes: cell('themes', 'script'),
            detail: [...document.querySelectorAll('[data-kp-diagnostic="detail"] li')].map((li) => li.textContent ?? ''),
        };
    }, pretend);
}

test('the page names both versions and both theme lists [TH97]', async ({ page }) => {
    await page.goto(PAGE);
    const seen = await redraw(page);

    // The stylesheet's half comes off `:root` — the package applying its
    // own declaration, which is the assertion the drills below attack.
    //
    // Drill [KT3], performed 2026-09-06: with the line
    // `--kp-themes-version: '${version}';` removed from identity() in
    // gates/generate-themes.mjs and the stylesheet regenerated, this test
    // reads "not declared" in the stylesheet column and the verdict turns
    // `no-version`. Restored and green.
    expect(seen.stylesheetVersion).toBe(VERSION);
    expect(seen.scriptVersion).toBe(VERSION);
    // Drill [KT3], performed 2026-09-06: with the line
    // `--kp-themes-names: '${ORDER.join(' ')}';` removed from identity()
    // instead, the stylesheet column is empty, the twenty-four names are
    // reported as "only the JavaScript has" and the verdict turns
    // `themes-differ`. Restored and green.
    expect(seen.stylesheetThemes).toBe(NAMES);
    expect(seen.scriptThemes).toBe(NAMES);

    expect(seen.status).toBe('match');
    expect(seen.drawnStatus).toBe('match');
    expect(seen.detail).toEqual([]);
});

test('a stylesheet older than the JavaScript is named as the one behind [TH97, AR25]', async ({ page }) => {
    await page.goto(PAGE);
    // The shape almanac actually had: an old stylesheet knowing a subset.
    const seen = await redraw(page, { version: '1.0.0', names: 'formal light dark' });

    expect(seen.status).toBe('stylesheet-behind');
    expect(seen.verdict).toContain('1.0.0');
    expect(seen.verdict).toContain(VERSION);
    expect(seen.verdict.toLowerCase()).toContain('stylesheet');
    // And it says which themes the mismatch costs.
    expect(seen.detail.join(' ')).toContain('cyberpunk');
});

test('a JavaScript older than the stylesheet is named as the one behind [TH97, AR25]', async ({ page }) => {
    await page.goto(PAGE);
    const seen = await redraw(page, { version: '99.0.0', names: `${NAMES} lavender` });

    expect(seen.status).toBe('script-behind');
    expect(seen.verdict).toContain('99.0.0');
    expect(seen.verdict).toContain(VERSION);
    expect(seen.detail.join(' ')).toContain('lavender');
});

test('one version, two theme lists, is a hand-edited file [TH97]', async ({ page }) => {
    await page.goto(PAGE);
    const seen = await redraw(page, { version: VERSION, names: 'formal light dark' });

    expect(seen.status).toBe('themes-differ');
    expect(seen.verdict).toContain(VERSION);
    expect(seen.detail.join(' ')).toContain('cyberpunk');
});

test('the page speaks the consumer’s dictionary, not its own words [TH97, KT5]', async ({ page }) => {
    await page.goto(PAGE);
    const drawn = await page.evaluate(async () => {
        const strings = await import('/js/strings.js');
        strings.setStrings({ diagnosticsVersion: 'Versie', diagnosticsMatch: 'Alles klopt.' });
        const module = await import('/js/diagnostics.js');
        module.renderDiagnostics(document.getElementById('kp-diagnostics'));
        return {
            label: document.querySelector('[data-kp-diagnostic="version"] th')?.textContent ?? '',
            verdict: document.querySelector('[data-kp-diagnostic="verdict"]')?.textContent ?? '',
        };
    });
    expect(drawn.label).toBe('Versie');
    expect(drawn.verdict).toBe('Alles klopt.');
});
