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
/** Fired on a typed confirmation block whenever what is typed starts or stops matching: `{ matched, value, name }`. */
export declare const TYPE_CONFIRM_EVENT = "kp-type-confirm";
/** A typed confirmation block a page puts in its own dialog or form. */
export declare const TYPE_CONFIRM = "[data-kp-type-confirm]";
/**
 * Whether `typed` is the name [kpadopt4-ideas]. Spaces at the start and the
 * end never count (a name pasted with a trailing space is the name); capitals
 * count unless `anyCase`. Nothing else is forgiven: the point is that the
 * reader looked at the name.
 * @param {string} typed @param {string} name @param {{ anyCase?: boolean }} [options]
 */
export declare function typeConfirmMatches(typed: string, name: string, { anyCase }?: {
    anyCase?: boolean;
}): boolean;
/**
 * The typed confirmation [kpadopt4-ideas; Kenny, 2026-10-16]: what will be
 * lost, the field the name is typed into, the rule it is matched by and a
 * line that says whether it matches, in one block that keeps its height
 * while the reader types. `onChange(matched)` runs whenever the answer turns.
 * Used by openConfirmation() for `data-kp-confirm-type`, and by
 * attachTypeConfirms() for a block a page puts in its own dialog.
 *
 * `id` is the typed field's own id (a page whose steps address it by a stable name, `act-confirm`); the label points at it and the rule
 * and status lines take `<id>-rule` and `<id>-status`. Without it the id is generated (`kp-type-confirm-N-input`). `fieldName` is the
 * field's `name` for a form. (`name` stays what has to be typed.) [wish-1120, homelab 123]
 *
 * @param {Document} doc
 * @param {{ name: string, id?: string, fieldName?: string, anyCase?: boolean, loses?: Node | readonly string[] | null, strings?: Partial<import('../strings.js').Strings>, onChange?: (matched: boolean, value: string) => void, block?: HTMLElement }} options
 * @returns {{ block: HTMLElement, input: HTMLInputElement, matched: () => boolean }}
 */
export declare function buildTypeConfirm(doc: Document, { name, id: fieldId, fieldName, anyCase, loses, strings, onChange, block: given }: {
    name: string;
    id?: string;
    fieldName?: string;
    anyCase?: boolean;
    loses?: Node | readonly string[] | null;
    strings?: Partial<import('../strings.js').Strings>;
    onChange?: (matched: boolean, value: string) => void;
    block?: HTMLElement;
}): {
    block: HTMLElement;
    input: HTMLInputElement;
    matched: () => boolean;
};
