// Which themes a theme-parameterised sweep runs on [scope-103].
//
// Fourteen declarations loop over all 22 themes, which turns 804 written
// tests into 1593. Kenny, 2026-09-16, the test-suite form, test-scope
// "Thema's als laag": a sweep whose fault would be the same in every theme
// runs at the building and commit levels on three — formal (the default,
// which most fixtures and every catalogue page wear), dark (a dark scheme,
// so `color-scheme` and the dark half of every token are exercised) and
// cyberpunk (the heaviest register) — and at the release level on all 22.
// No assertion is removed: the release level still measures every theme.
//
// A spec asks for the list rather than hard-coding it. `gates/run-tags.mjs`
// sets KP_SWEEP_THEMES per level; with the variable unset the list is every
// theme, so a bare `npx playwright test` still runs everything, and so does
// any run this file knows nothing about.
//
// NOT every theme loop is a sweep in this sense. Four are left at 22 on
// purpose, because each has a per-theme fault behind it and narrowing them
// would throw the evidence away:
//
//   tests/focus-visible.spec.mjs:136  fix-38
//   tests/registers.spec.mjs:91       fix-12
//   tests/reflow.spec.mjs:168         brutalism fails in firefox only
//   tests/overflow.spec.mjs:76        sepia and solstice fail in chromium only
//
// Before narrowing a loop, ask whether its faults have ever been one
// theme's. If they have, it stays whole.

import { readFileSync } from 'node:fs';
import process from 'node:process';

/** Every theme there is, in the order the registry declares them. */
export const ALL_THEMES = /** @type {string[]} */ (JSON.parse(readFileSync(new URL('../../themes/order.json', import.meta.url), 'utf8')));

/** The three a narrowed sweep runs on: the default, a dark one, the heaviest register. */
export const NARROW_THEMES = ['formal', 'dark', 'cyberpunk'];

/**
 * The names a theme sweep runs on at this level.
 *
 * @returns {string[]} every theme unless KP_SWEEP_THEMES names a subset
 */
export function sweepThemes() {
    const named = (process.env.KP_SWEEP_THEMES ?? '').trim();
    if (!named) return [...ALL_THEMES];
    const wanted = named
        .split(',')
        .map((n) => n.trim())
        .filter(Boolean);
    const unknown = wanted.filter((n) => !ALL_THEMES.includes(n));
    // A typo must not silently shrink a sweep to nothing.
    if (unknown.length) throw new Error(`KP_SWEEP_THEMES names no such theme: ${unknown.join(', ')}`);
    return ALL_THEMES.filter((n) => wanted.includes(n));
}

/**
 * The same list as records, for a spec that loops over `THEMES` from
 * `js/theme-registry.js` and needs `label` or `dark`.
 *
 * @template {{ name: string }} T @param {readonly T[]} records @returns {T[]}
 */
export function sweepThemeRecords(records) {
    const names = new Set(sweepThemes());
    return records.filter((r) => names.has(r.name));
}
