export type Arriving = import('./turns.js').Arriving;
/** @typedef {import('./turns.js').Arriving} Arriving */
/**
 * The reverse arrivals playing now, each with the way to stop it, so a
 * leave that comes during one starts from the element as it stands.
 * @type {WeakMap<HTMLElement, () => void>}
 */
export declare const entering: WeakMap<HTMLElement, () => void>;
/**
 * The animation an element (or one of its pseudo-elements) wears, every
 * part a leave may turn around.
 * @param {Element} el @param {string | null} [pseudo]
 * @returns {string}
 */
export declare const animationSignature: (el: Element, pseudo?: string | null) => string;
/**
 * The animations `el`'s pseudo-elements wear now. A pseudo-element
 * whose animation is the same with and without `[data-kp-leaving]` (a
 * toast's rule drawn in at rest, and the register gives the leave nothing
 * else for it) is part of the entrance, not of the exit: the leave plays it
 * backwards and the arrival forwards, so the two stay each other's mirror
 * (research/PACKAGE_FINDINGS.md, 2026-10-07: on the leave such a part did
 * not move, or jumped, because a CSS animation whose name does not change is
 * not restarted).
 * @param {Element} el
 * @returns {Record<string, string>}
 */
export declare const pseudoNames: (el: Element) => Record<string, string>;
/**
 * Whether `el` takes no space where it stands (placed absolutely or fixed,
 * or raised into the top layer): a fold of its space would show nothing but
 * a wait, with the element already gone or not yet there (a combobox list
 * unfolded nothing for 466 ms before its opening, blueprint).
 * @param {Element} el @param {CSSStyleDeclaration} style
 */
export declare const floats: (el: Element, style: CSSStyleDeclaration) => boolean;
/** @param {PlaybackDirection | undefined} direction @returns {PlaybackDirection} */
export declare const flipped: (direction: PlaybackDirection | undefined) => PlaybackDirection;
/**
 * The CSS animations that make up the exit `actor` plays: its own and those
 * on its pseudo-elements and, where the register keeps the lines of a part
 * (`--kp-lines: keep`, see keepsLines()), those of every line inside it that
 * ends, each on its own element with its own wait. A line that never ends (a
 * spinner, a caret) is no exit.
 * @param {HTMLElement} actor
 * @param {boolean} lines
 * @returns {CSSAnimation[]}
 */
export declare function exitsOf(actor: HTMLElement, lines: boolean): CSSAnimation[];
/**
 * Let `el` arrive as its leave played backwards [research/open-reverse;
 * Kenny's pick, every theme since 2026-10-05]: the
 * timeline leaveOne() would play for it in its theme (the register's exit
 * on `[data-kp-leaving]`, pseudo-elements included, and the fold of its
 * space a third of the way in, or after it, or under a stand-in), turned
 * around, so frame t of the arrival is frame (T - t) of the leave. Every
 * duration, delay and curve is the theme's, read as leaveOne() reads it.
 *
 * @param {HTMLElement} el
 * @returns {boolean} false when it has no leave to turn around (a table row,
 *   which a leave does not fold; a register with no exit of its own): the
 *   caller plays the theme's arrival instead
 */
export declare function arriveAsReversedLeave(el: HTMLElement): boolean;
