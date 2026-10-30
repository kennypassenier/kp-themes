// Where the code version is written, what the loader attaches, and which inputs do not count.

// The loader's own table: every module it attaches, and the selector it acts
// through [scope-136]. Read here rather than restated, so the hash and the page
// cannot drift apart; `js/auto.js` imports cleanly outside a browser.
import { NEEDS } from '../../js/auto.js';

/** `js/<name>.js` for each need, with the selector that brings it in. */
export const ATTACHED_BY_SELECTOR = new Map(NEEDS.map((need) => [`js/${need.name}.js`, need.when]));

export const root = new URL('../../', import.meta.url);

export const CODE_VERSION = 'catalogue/code-version.json';

/**
 * The loader and what it attaches through: when a module arrives, not what a
 * block is [scope-116, scope-117]. tests/auto-lazy.spec.mjs holds both.
 */
export const NOT_A_BLOCK_INPUT = new Set(['js/auto.js', 'js/as-of.js']);

/**
 * Blocks whose component is drawn somewhere their markup does not show: a
 * theme intro plays in a frame, from effects.js, and its block carries only
 * the frame and the controls. The marker attribute names the component.
 */
export const MARKERS = { 'data-cat-intro': ['page-effects'] };
