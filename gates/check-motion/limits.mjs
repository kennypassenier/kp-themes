// WCAG 2.3.1 flash limits and the shortest theme duration, the constants the flash arithmetic is rated against.

import { readFileSync } from 'node:fs';

/**
 * WCAG 2.2 SC 2.3.1 Three Flashes or Below Threshold, Level A. Standards
 * constants, pinned with their reason: no more than three opposing
 * relative-luminance changes of 10% or more per second. (The area escape —
 * a flash smaller than roughly 341 x 256 CSS px is exempt — is deliberately
 * not used here. These effects cover the page.)
 */
export const MAX_FLASHES_PER_SECOND = 3;

export const LUMINANCE_STEP = 0.1;

/**
 * The shortest --fx-duration any theme declares. An animation whose
 * duration is a calc() over that token is bounded by this, so the gate
 * measures the worst case rather than giving up.
 */
// A theme that declares 0ms runs no motion at all (the removed High contrast theme did, since
// 2026-09-05), so it cannot flash: the bound is the shortest duration a
// theme that moves declares. At 0 every computed duration read as Infinity
// flashes, which is what the compliance table published once it was
// regenerated on 2026-10-04 (it had not been since report:di5 started
// refusing, which stops `generate:all` before the table).
export const SHORTEST_THEME_DURATION_MS = Math.min(
    ...[...readFileSync(new URL('../../css/themes.css', import.meta.url), 'utf8').matchAll(/--fx-duration:\s*([\d.]+)ms/g)]
        .map((m) => Number(m[1]))
        .filter((ms) => ms > 0),
);
