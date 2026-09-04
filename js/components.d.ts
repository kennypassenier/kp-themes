declare const VIOLATION_EVENT = "kp-contract-violation";
export type Violation = {
    rule: string;
    element: Element;
    message: string;
};
/** @typedef {{ rule: string, element: Element, message: string }} Violation */
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
 * settings page.
 */
export declare const CONFIRM_WINDOW_MS = 4000;
/**
 * @param {ParentNode} root
 * @returns {Violation[]}
 */
export declare function findViolations(root?: ParentNode): Violation[];
/**
 * Report the violations and disarm what they point at. Returns them, so a
 * test can assert on the list rather than on console output.
 *
 * @param {ParentNode} root
 * @returns {Violation[]}
 */
export declare function enforceContracts(root?: ParentNode): Violation[];
/**
 * Arm-then-act on every destructive button that asked for a confirmation.
 *
 * @param {ParentNode} root
 * @param {{ windowMs?: number }} [options]
 * @returns {() => void} detach
 */
export declare function attachConfirmations(root?: ParentNode, { windowMs }?: {
    windowMs?: number;
}): () => void;
export { VIOLATION_EVENT };
