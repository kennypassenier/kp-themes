/** Fired on the nav when its toggle opens or closes it: `{ open }`. */
export declare const NAV_TOGGLE_EVENT = "kp-nav-toggle";
/** The mark the React NavBar puts on a toggle it wires itself [AR29]. */
export declare const NAV_OWNED = "[data-kp-nav-owner]";
/**
 * Wire the toggle a narrow navigation collapses into [scope-10, stage 1.3].
 *
 * Opt-in by the button being there: a nav without one keeps the behaviour
 * it had, which is what makes this additive for every page already built.
 * The CSS decides when the bar is narrow enough to collapse; this decides
 * nothing about width at all, so the two cannot disagree.
 *
 * Every state it sets has a way out [KT6]: the toggle itself, Escape while
 * the focus is inside the nav, a click outside it, and the `kp-nav-toggle`
 * event for a consumer who wants to persist or veto nothing but observe.
 * `detach` removes what attach stamped.
 *
 * @param {ParentNode} root
 * @param {{ strings?: Partial<import('../strings.js').Strings>, ownedBy?: string }} [options]
 * @returns {() => void} detach
 */
export declare function attachNavToggles(root?: ParentNode, { strings, ownedBy }?: {
    strings?: Partial<import('../strings.js').Strings>;
    ownedBy?: string;
}): () => void;
