/** Dispatched on the offending element, bubbling, with the Violation as detail. */
export declare const VIOLATION_EVENT = "kp-contract-violation";
export type Rule = 'DI10' | 'DI4';
export type Violation = {
    rule: Rule;
    element: Element;
    message: string;
};
/** @typedef {'DI10' | 'DI4'} Rule */
/** @typedef {{ rule: Rule, element: Element, message: string }} Violation */
/**
 * How long the `inline` variant stays armed.
 *
 * DI10's evidence, which is not the folklore: "undo beats confirmation"
 * has no controlled study behind it, while confirmations carrying a small
 * obstacle still worked for 44-74% of users after some twenty exposures,
 * against 20% or less for purely visual ones. Arm-then-act was that
 * obstacle until 4.0.0; it is now the `inline` variant, and the default
 * is the dialog TH107 asks for.
 *
 * Configurable rather than hard-coded, because it is an operational knob:
 * a dashboard whose users delete all day wants a longer window than a
 * settings page. Per element too, as `data-kp-confirm-ms`.
 */
export declare const CONFIRM_WINDOW_MS = 4000;
/** The two confirmation obstacles: the dialog TH107 asks for, and the arm-then-act 3.x shipped. */
export declare const CONFIRM_MODES: readonly ['dialog', 'inline'];
/** Marks a button whose confirmation another channel already owns [AR29]. */
export declare const CONFIRM_OWNED = "[data-kp-confirm-owner]";
/**
 * Open the modal confirmation for `button`, and call `onAccept` if it is
 * taken [TH107, T14, AR28].
 *
 * A native `<dialog>` shown with `showModal()`: the browser does the
 * focus trap, the Escape close and the focus return, which this package
 * already relies on twice. Escape and Cancel do nothing at all.
 *
 * **Written here rather than imported from `js/overlays.js`, on purpose.**
 * chassis-rs bakes six of this package's JavaScript modules into a Rust
 * binary, and the import closure of those six is exactly those six —
 * `js/overlays.js` is not among them. One import edge makes
 * `/static/kp/overlays.js` a 404, the module graph fail, and their whole
 * `chassis.js` die: the theme picker, the contract enforcer, the
 * confirmations and the skip links with it. `gates/check-closure.mjs`
 * holds that closure at six.
 *
 * @param {HTMLElement} button the control the confirmation belongs to
 * @param {{ phrase?: string, strings?: Partial<import('./strings.js').Strings>, onAccept?: () => void, onCancel?: () => void, className?: string, initialFocus?: 'cancel' | 'accept' }} [options]
 * @returns {HTMLDialogElement} the dialog, so a consumer can reach the state this set [KT6]
 */
export declare function openConfirmation(button: HTMLElement, { phrase, strings, onAccept, onCancel, className, initialFocus }?: {
    phrase?: string;
    strings?: Partial<import('./strings.js').Strings>;
    onAccept?: () => void;
    onCancel?: () => void;
    className?: string;
    initialFocus?: 'cancel' | 'accept';
}): HTMLDialogElement;
/** Markup the consumer excludes from enforcement: `data-kp-contract-ignore`. */
export declare const EXEMPT = "[data-kp-contract-ignore]";
/**
 * @param {ParentNode} root
 * @param {{ rules?: Rule[], exempt?: string }} [options]
 * @returns {Violation[]}
 */
export declare function findViolations(root?: ParentNode, { rules, exempt }?: {
    rules?: Rule[];
    exempt?: string;
}): Violation[];
/**
 * Report the violations and disarm what they point at.
 *
 * Idempotent: calling it again first restores everything it changed
 * before and then looks afresh, so markup completed after the first
 * pass comes back to life. Returns a detach that restores without
 * re-evaluating. The list is also available on the return value, so a
 * test asserts on it rather than on console output.
 *
 * @param {ParentNode} root
 * @param {{ disable?: boolean, rules?: Rule[], exempt?: string, log?: ((message: string, element: Element) => void) | null }} [options]
 * @returns {(() => void) & { violations: Violation[] }}
 */
export declare function enforceContracts(root?: ParentNode, { disable, rules, exempt, log }?: {
    disable?: boolean;
    rules?: Rule[];
    exempt?: string;
    log?: ((message: string, element: Element) => void) | null;
}): (() => void) & {
    violations: Violation[];
};
/**
 * Give every destructive button that asked for a confirmation its
 * obstacle [TH107, DI10, AR27, AR29].
 *
 * Default `dialog`: the click is swallowed, a modal `<dialog>` opens
 * carrying the attribute's phrase, Escape and Cancel do nothing, and
 * Confirm re-fires the click behind the one-shot lock above, so the
 * consumer's own handler runs exactly once. `inline` is the arm-then-act
 * of 3.x, kept as a variant rather than deleted; `data-kp-confirm-mode`
 * chooses per element.
 *
 * @param {ParentNode} root
 * @param {{ mode?: 'dialog' | 'inline', windowMs?: number, disarmOnBlur?: boolean, strings?: Partial<import('./strings.js').Strings>, ownedBy?: string, dialogClassName?: string }} [options]
 * @returns {() => void} detach
 */
export declare function attachConfirmations(root?: ParentNode, { mode, windowMs, disarmOnBlur, strings, ownedBy, dialogClassName }?: {
    mode?: 'dialog' | 'inline';
    windowMs?: number;
    disarmOnBlur?: boolean;
    strings?: Partial<import('./strings.js').Strings>;
    ownedBy?: string;
    dialogClassName?: string;
}): () => void;
/**
 * Move focus to the target of a skip link, adding `tabindex="-1"` if the
 * target cannot take focus on its own [KT6].
 *
 * JobTracker found the half a skip link needs and nothing here provided:
 * without a focusable target the browser scrolls and the next Tab goes
 * back into the menu, so the link has done nothing for the person it
 * exists for. Returns whether a target was found and focused.
 *
 * @param {string} href `#main`, or any same-page hash
 * @param {Document | Element} [root]
 * @returns {boolean}
 */
export declare function skipTo(href: string, root?: Document | Element): boolean;
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
 * @param {{ strings?: Partial<import('./strings.js').Strings>, ownedBy?: string }} [options]
 * @returns {() => void} detach
 */
export declare function attachNavToggles(root?: ParentNode, { strings, ownedBy }?: {
    strings?: Partial<import('./strings.js').Strings>;
    ownedBy?: string;
}): () => void;
/**
 * Make every `.kp-skip-link` (or `[data-kp-skip]`) move focus, not only
 * the scroll position.
 *
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export declare function attachSkipLinks(root?: ParentNode): () => void;
