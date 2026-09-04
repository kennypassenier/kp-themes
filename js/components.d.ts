/** Dispatched on the offending element, bubbling, with the Violation as detail. */
export declare const VIOLATION_EVENT = "kp-contract-violation";
/** Dispatched on a destructive button when its first click armed it. */
export declare const ARM_EVENT = "kp-confirm-arm";
/** Dispatched when an armed button disarms without acting: timeout, blur, or detach. */
export declare const DISARM_EVENT = "kp-confirm-disarm";
export type Rule = 'DI10' | 'DI4';
export type Violation = {
    rule: Rule;
    element: Element;
    message: string;
};
/** @typedef {'DI10' | 'DI4'} Rule */
/** @typedef {{ rule: Rule, element: Element, message: string }} Violation */
/**
 * The confirmation obstacle.
 *
 * DI10's evidence, which is not the folklore: "undo beats confirmation"
 * has no controlled study behind it, while confirmations carrying a small
 * obstacle still worked for 44-74% of users after some twenty exposures,
 * against 20% or less for purely visual ones. So the first click does not
 * act — it arms, changes the label to the phrase the consumer chose, and
 * disarms itself again after a few seconds if nothing follows.
 *
 * Configurable rather than hard-coded, because it is an operational knob:
 * a dashboard whose users delete all day wants a longer window than a
 * settings page. Per element too, as `data-kp-confirm-ms`.
 */
export declare const CONFIRM_WINDOW_MS = 4000;
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
 * Arm-then-act on every destructive button that asked for a confirmation.
 *
 * @param {ParentNode} root
 * @param {{ windowMs?: number, disarmOnBlur?: boolean }} [options]
 * @returns {() => void} detach
 */
export declare function attachConfirmations(root?: ParentNode, { windowMs, disarmOnBlur }?: {
    windowMs?: number;
    disarmOnBlur?: boolean;
}): () => void;
