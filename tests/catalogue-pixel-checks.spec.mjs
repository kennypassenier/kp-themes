// A pair the pixel comparison brought back is answered by the next verdict
// [scope-138]. Kenny, 2026-09-29: approving `table--datatable` in dark in the
// review dialog kept it open, and the dialog cycled between it and the
// multi-sort table. The fresh approval repeated the register's verdict and
// hash, so the register's entry counted, and the pixel check reopened it
// again. What holds now: a verdict this browser gave since the pixel run
// answers it, and a check only applies to the approval it compared from.
// That verdict is the browser's until recorded, so the prompt carries its
// verdict line (Kenny, same day: "er staat niks meer open?" while the
// register still had 47 pairs open).
//
// Red run first, on 15f2a94b in firefox: the stored approval read "changed".

import { expect, test } from '@playwright/test';

const KEY = 'table--datatable';
const THEME = 'dark';

async function readState(page, { registerCommit }) {
    await page.route('**/catalogue/verdicts.json', async (route) => {
        const { HASH_VERSION } = await import('../catalogue/block-hash.js');
        const entry = { verdict: 'approved', hash: 'h1', commit: registerCommit, given: '2026-09-28' };
        await route.fulfill({ json: { hashVersion: HASH_VERSION, verdicts: { [KEY]: { [THEME]: { firefox: entry, chromium: entry } } } } });
    });
    await page.route('**/catalogue/pixel-checks.json', async (route) => {
        const check = { state: 'reopened', from: 'c0ffee' };
        await route.fulfill({
            json: { commit: 'head', checked: '2026-09-29T07:51:00.000Z', checks: { [KEY]: { [THEME]: { firefox: check, chromium: check } } } },
        });
    });
    await page.goto('/tests/fixtures/blank.html');
    return page.evaluate(
        async ({ key, theme }) => {
            localStorage.clear();
            const j = await import('/catalogue/judgements.js');
            await j.registerReady;
            const before = j.stateOf(key, theme, 'h1');
            j.storeVerdict(key, theme, 'approved', 'h1');
            return { before, after: j.stateOf(key, theme, 'h1'), source: j.verdictOf(key, theme)?.source };
        },
        { key: KEY, theme: THEME },
    );
}

test('an approval given after the pixel run closes the pair it reopened [scope-138]', { tag: ['@component:catalogue'] }, async ({ page }) => {
    expect(await readState(page, { registerCommit: 'c0ffee' })).toEqual({ before: 'changed', after: 'approved', source: 'browser' });
});

test('a pixel check does not reopen a verdict recorded since it [scope-138]', { tag: ['@component:catalogue'] }, async ({ page }) => {
    expect((await readState(page, { registerCommit: 'later' })).before).toBe('approved');
});
