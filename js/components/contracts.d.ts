export type Rule = import('./type-confirm.js').Rule;
export type Violation = import('./type-confirm.js').Violation;
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
 * @param {{ mode?: 'dialog' | 'inline', windowMs?: number, disarmOnBlur?: boolean, strings?: Partial<import('../strings.js').Strings>, ownedBy?: string, dialogClassName?: string }} [options]
 * @returns {() => void} detach
 */
export declare function attachConfirmations(root?: ParentNode, { mode, windowMs, disarmOnBlur, strings, ownedBy, dialogClassName }?: {
    mode?: 'dialog' | 'inline';
    windowMs?: number;
    disarmOnBlur?: boolean;
    strings?: Partial<import('../strings.js').Strings>;
    ownedBy?: string;
    dialogClassName?: string;
}): () => void;
