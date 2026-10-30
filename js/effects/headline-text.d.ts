export type HeadlineRun = import('./headline-run.js').HeadlineRun;
/** @typedef {import('./headline-run.js').HeadlineRun} HeadlineRun */
/** The routines that put every word in its own span, the register animating them one after another by `--kp-i`. */
export declare const WORD_ROUTINES: string[];
/**
 * A word routine [PH2, BR2, S48 Shade (dark) and dark]: every word in its own span with its index, the register animates
 * them one after another by `--kp-i`; the element ends as its own text. The keyframe is `kp-<routine>` and its row in TIMINGS
 * says how long one word takes; the stagger is the theme's knob.
 * @param {HeadlineRun} run
 */
export declare function words(run: HeadlineRun): void;
/**
 * The terminal headline [TM2]: typed one glyph at a time at the decipher rate, a block caret riding the last one; the caret
 * leaves with the last glyph and the element rests as its text.
 * @param {HeadlineRun} run
 */
export declare function typeOut(run: HeadlineRun): void;
/**
 * The default headline: every glyph starts as noise and settles into its letter at the decipher rate, then one slice burst.
 * @param {HeadlineRun} run
 */
export declare function decipher(run: HeadlineRun): void;
