export type HeadlineRun = import('./headline-run.js').HeadlineRun;
/** @typedef {import('./headline-run.js').HeadlineRun} HeadlineRun */
/** How long past a keyframe's own duration a routine waits for its end before it finishes by the clock [ms]. */
export declare const END_GRACE_MS = 50;
/**
 * The synthwave headline [SW2]: the text stays whole; one tracking wipe crosses it, then one shine. The register animates the
 * classes; without an animation the classes come off by the table's durations, so nothing waits on an event that never comes.
 * @param {HeadlineRun} run
 */
export declare function tracking(run: HeadlineRun): void;
/**
 * The academia headline [lift row 10]: the words are never touched — no noise, no split into words. A rule beneath the
 * heading grows in once it enters the viewport, the exact mechanism `rule()` already performs, generalised to h1 because the
 * approved demo drives both off one IntersectionObserver and one class ("The Reading Room", 2026-09-08). The register paints
 * the draw; this only watches and flips the class.
 * @param {HeadlineRun} run
 */
export declare function draw(run: HeadlineRun): void;
/**
 * The formal headline [S49, LIFT_PLAN row 16]: whole and untouched — this theme does not glitch or type, it commits. Nothing
 * here manipulates a character; the class the register reads (STATE.deciphered, same completion marker every routine sets) is
 * held off by one frame past the next, the same two-`requestAnimationFrame` technique the approved demo used itself, so the
 * browser paints the hidden state before a plain CSS transition (fade, rise) carries it to rest.
 * @param {HeadlineRun} run
 */
export declare function arrive(run: HeadlineRun): void;
/**
 * The Sepia headline (theme removed 2026-10-08) [S48, LIFT_PLAN row 9]: no per-word stagger — the whole line is one CSS
 * transition, a faint ghost of the ink colour settling to the full one, because this theme (anatomy.md) is "unhurried on
 * purpose". `settling` is transient like `dissolving`/`typing`: added, then removed once the transition has run, so a quiet
 * theme or reduced motion — which skip straight to `rest(true)` and never add it — render the plain, already-settled headline
 * rather than a permanent ghost. A transition, not a keyframe animation (the removed sepia register carried no `@keyframes`
 * for it, so it has no TIMINGS row).
 * @param {HeadlineRun} run
 */
export declare function ink(run: HeadlineRun): void;
