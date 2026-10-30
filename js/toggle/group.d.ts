export type PressedState = 'true' | 'false' | 'mixed';
/** @typedef {'true' | 'false' | 'mixed'} PressedState */
/** A button this module drives. */
export declare const TOGGLE = "[data-kp-toggle]";
/** Fired on the button before its state changes, cancelable: `{ button, pressed, previous, group, pressedKeys, wait(promise) }`. */
export declare const TOGGLE_EVENT = "kp-toggle";
/** Fired on the button after its state changed, or was rolled back: `{ button, pressed, group, pressedKeys, source }`. */
export declare const TOGGLE_CHANGED_EVENT = "kp-toggle-changed";
/** The looks a toggle may have. */
export declare const TOGGLE_LOOKS: readonly ['button', 'chip', 'icon'];
/** How a group lets its members be on together. */
export declare const TOGGLE_MODES: readonly ['multi', 'single', 'single-or-none'];
/** How long a refusal's word stays on the button, in ms (the flash button's value). */
export declare const TOGGLE_REFUSED_MS = 3000;
/** @param {Element} el @returns {PressedState} */
export declare const stateOf: (el: Element) => PressedState;
/** The key a member has in `pressedKeys`. @param {HTMLElement} el */
export declare const toggleKey: (el: HTMLElement) => string;
/**
 * The group a toggle belongs to: its members, its mode and its container.
 * @param {HTMLElement} button
 * @returns {{ name: string, members: HTMLElement[], mode: 'multi' | 'single' | 'single-or-none', container: HTMLElement | null, all: HTMLElement | null } | null}
 */
export declare function toggleGroup(button: HTMLElement): {
    name: string;
    members: HTMLElement[];
    mode: 'multi' | 'single' | 'single-or-none';
    container: HTMLElement | null;
    all: HTMLElement | null;
} | null;
/**
 * The keys of every member that is on, the "All" member left out.
 * @param {HTMLElement} anyMember
 * @returns {string[]}
 */
export declare function togglePressedKeys(anyMember: HTMLElement): string[];
/** @param {string} name @param {string} what */
export declare const storeKey: (name: string, what: string) => string;
/** @param {string} key */
export declare const readStore: (key: string) => any;
/** @param {string} key @param {unknown} value */
export declare const writeStore: (key: string, value: unknown) => void;
/** @param {Document} doc @param {string} className @param {string} [tag] */
export declare const made: (doc: Document, className: string, tag?: string) => HTMLElement;
/**
 * What a press on `member` would make of its group: one toggle flips; a single group keeps exactly one on, a single-or-none
 * group at most one; pressing All (or a Clear) turns the rest off; the All member is on exactly when nothing else is.
 * @param {HTMLElement} member @param {boolean} forceClear
 * @returns {Map<HTMLElement, PressedState>}
 */
export declare function planFor(member: HTMLElement, forceClear: boolean): Map<HTMLElement, PressedState>;
/** The All member follows the plan: on exactly when no other member will be. @param {NonNullable<ReturnType<typeof toggleGroup>>} g @param {Map<HTMLElement, PressedState>} plan */
export declare function withAll(g: NonNullable<ReturnType<typeof toggleGroup>>, plan: Map<HTMLElement, PressedState>): Map<HTMLElement, PressedState>;
/** Put the members to the states a plan says. @param {Map<HTMLElement, PressedState>} plan */
export declare function applyPlan(plan: Map<HTMLElement, PressedState>): void;
