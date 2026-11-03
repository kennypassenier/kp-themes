// A second kp runtime on one page refuses to boot [dupe-1103].
//
// Almanac (2026-11-03) loaded the full bundle and the chunked dist/js/auto.js on one page and Firefox froze before
// DOMContentLoaded. The first runtime claims a global marker; the second logs one error and boots nothing.
//
// tests/fixtures/dupe-boot.html loads both on purpose. components.html is the legitimate shape: a loose /js/auto.js
// beside a separate React esbuild bundle that imports parts but does not boot.

import { expect, test } from '@playwright/test';

test.describe('one kp runtime per page', { tag: ['@component:bundle', '@sweep'] }, () => {
    test('the full bundle with the chunked entry: DOMContentLoaded fires, one error, one copy works', async ({ page }) => {
        const errors = [];
        page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
        await page.goto('/tests/fixtures/dupe-boot.html');
        await page.waitForFunction(() => document.readyState !== 'loading');
        const refusals = errors.filter((text) => text.includes('a second copy of the runtime'));
        expect(refusals).toHaveLength(1);
        expect(refusals[0]).toContain('dist/kp-themes.min.js');
        expect(refusals[0]).toContain('dist/js/');
        expect(refusals[0]).toContain('load either dist/kp-themes.min.js or dist/js/auto.js, not both');
        expect(errors).toHaveLength(1);
    });

    test('a loose auto.js beside a React bundle that does not boot is not refused', async ({ page }) => {
        const errors = [];
        page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
        await page.goto('/tests/fixtures/components.html');
        await page.waitForFunction(() => document.documentElement.hasAttribute('data-kp-auto-ready'));
        expect(errors.filter((text) => text.includes('a second copy of the runtime'))).toEqual([]);
    });
});
