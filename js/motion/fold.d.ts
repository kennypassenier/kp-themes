/**
 * Settles once the CSS animations on `el` are `share` of the way through,
 * or when `done` settles, whichever is first.
 * @param {HTMLElement} el @param {number} share @param {Promise<unknown>} done @param {boolean} [lines] the lines of the part count (exitsOf())
 * @returns {Promise<unknown>}
 */
export declare function partway(el: HTMLElement, share: number, done: Promise<unknown>, lines?: boolean): Promise<unknown>;
/**
 * The gap inTurnGap() gives a leave of a row of `count`, in ms on its
 * exit's clock, when it is shorter than the one partway() would wait for;
 * else null. The same reading arrive() takes for its `lag`.
 * @param {HTMLElement} el @param {number} share @param {number} lasts @param {number} count @param {boolean} [lines] as partway()
 * @returns {number | null}
 */
export declare function cappedGap(el: HTMLElement, share: number, lasts: number, count: number, lines?: boolean): number | null;
/**
 * Settles once every CSS animation on `el` has run `ms` on its own clock (or
 * is over), or when `done` does.
 * @param {HTMLElement} el @param {number} ms @param {Promise<unknown>} done @param {boolean} [lines] as partway()
 */
export declare function atTime(el: HTMLElement, ms: number, done: Promise<unknown>, lines?: boolean): Promise<any>;
/**
 * Settles when the CSS animations running on `el` have played out, at
 * whatever rate they play (a slowed-down review plays them at a quarter);
 * with none running, after `fallback` ms.
 * @param {HTMLElement} el @param {number} fallback @param {boolean} [lines] as partway()
 * @returns {Promise<unknown>}
 */
export declare function playedOut(el: HTMLElement, fallback: number, lines?: boolean): Promise<unknown>;
/**
 * The arrival `el` would play, as an animation name, duration and curve:
 * the register's own `[data-kp-arriving]`, else the theme's toast entrance.
 * @param {HTMLElement} el
 * @returns {{ name: string, duration: number, ease: string } | null}
 */
export declare function arrivalOf(el: HTMLElement): {
    name: string;
    duration: number;
    ease: string;
} | null;
/**
 * How a leave's fold of space is timed, read off the leaving element: its
 * length as a multiple of the longer of the exit and the size glide
 * (`--kp-leave-fold-grow`, 1.25 unless a theme says otherwise) and, with no
 * `--kp-leave-fold: after`, where it starts as a share of the exit
 * (`--kp-leave-fold-start`, a third unless a theme says otherwise; forest
 * sets 1 and 0, so its space closes as long as, and with, its leave).
 * @param {CSSStyleDeclaration} style the element's style while it carries `data-kp-leaving`
 * @returns {{ grow: number, start: (lasts: number) => number }}
 */
export declare function foldTiming(style: CSSStyleDeclaration): {
    grow: number;
    start: (lasts: number) => number;
};
/**
 * The curve a leave's fold of space runs on: the theme's entrance curve,
 * unless the theme says `--kp-leave-fold-ease` (cyberpunk folds in whole
 * ticks, not in the entrance's single step).
 * @param {CSSStyleDeclaration} style the element's style while it carries `data-kp-leaving`
 * @param {string} ease the entrance's curve
 * @returns {string}
 */
export declare function foldCurve(style: CSSStyleDeclaration, ease: string): string;
/**
 * The space `el` takes, and nothing, as a leave folds it: in a row (a flex
 * row, an inline chip) its width, sideways; anywhere else its height, from
 * below; margins and paddings to 0, and the flex gap towards a neighbour
 * swallowed by a negative margin.
 * @param {HTMLElement} el @param {CSSStyleDeclaration} style its style while it carries `data-kp-leaving`
 * @returns {[Record<string, string>, Record<string, string>]}
 */
export declare function foldFrames(el: HTMLElement, style: CSSStyleDeclaration): [Record<string, string>, Record<string, string>];
/**
 * Whether folding the width of `el` to nothing would re-wrap the row it
 * sits in. Folding sideways moves the neighbours up with the closing
 * space; in a wrapping row that puts a neighbour on another line half way,
 * so the row (and the page under it) is a line shorter or taller for the
 * length of the fold and jumps to its real height when the fold ends (a
 * filter tag arriving in the toolbar's "Showing only" row at 390 px: 28 px
 * while it grew, 62 px after; Kenny, kpadopt-controls, 2026-10-16). Read by
 * laying the end of the fold out for one read and comparing the heights of
 * the ancestors; a fold that re-wraps is not played: the neighbours take
 * their place at once and the box around them glides.
 * @param {HTMLElement} el @param {Record<string, string>} from @param {Record<string, string>} to
 * @returns {boolean}
 */
export declare function foldReflows(el: HTMLElement, from: Record<string, string>, to: Record<string, string>): boolean;
