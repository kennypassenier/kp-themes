export type Memory = import('../remember.js').Memory;
export type Remembered = import('../remember.js').Remembered;
export type RememberConfig = import('../remember.js').RememberConfig;
/** @typedef {import('../remember.js').Memory} Memory */
/** @typedef {import('../remember.js').Remembered} Remembered */
/** @typedef {import('../remember.js').RememberConfig} RememberConfig */
/** The attribute an author writes to ask for a memory. A contract value [TH26]. */
export declare const REMEMBER_ATTRIBUTE = "data-kp-remember";
/** Fired on the element that was refused a memory because its name was taken: `{ name, component, other }`. */
export declare const REMEMBER_CLASH_EVENT = "kp-remember-clash";
/** The first segment of every key this package writes. */
export declare const REMEMBER_PREFIX = "kp-remember";
/** The document-wide defaults, settable once by a consumer. */
export declare const config: {
    prefix: string;
    storage: Storage | null | undefined;
};
/**
 * Set the defaults once: the first key segment, and where the values go.
 * `storage: null` turns the whole mechanism off without touching a
 * component — the way out KT6 asks for.
 *
 * @param {RememberConfig} next
 */
export declare function configureRemember(next: RememberConfig): void;
/**
 * localStorage where there is one, null where reaching it throws.
 *
 * @param {Storage | null | undefined} given what this call was handed
 * @returns {Storage | null}
 */
export declare function storage(given: Storage | null | undefined): Storage | null;
/**
 * The older spelling each component accepts, so markup written before this
 * file existed keeps its memory. The name is the same; the key it composes
 * is the one above.
 *
 * @type {Partial<Record<Remembered, string>>}
 */
export declare const ALIASES: Partial<Record<Remembered, string>>;
/**
 * The name an element gave itself, or null when it asked for nothing.
 *
 * @param {Element} element
 * @param {Remembered} component
 * @returns {string | null}
 */
export declare function rememberedName(element: Element, component: Remembered): string | null;
/**
 * Drop every claim. For a test, and for a consumer who tears a page down
 * and builds it again inside one document [KT6].
 */
export declare function forgetClaims(): void;
/**
 * The memory for one element, or null when it asked for none — and null
 * too when another element of the same component already answers to that
 * name, because two of them sharing one key is the fault the name prevents.
 *
 * @param {Element} element
 * @param {Remembered} component
 * @param {{ storage?: Storage | null }} [options] where the values go, for this element alone
 * @returns {Memory | null}
 */
export declare function memoryFor(element: Element, component: Remembered, { storage: given }?: {
    storage?: Storage | null;
}): Memory | null;
/**
 * Forget the stored state of every element of `component` whose name starts
 * with `prefix` and is not in `names`: a page whose groups come and go
 * (named `apps-<group>`) prunes the groups that no longer exist, so its
 * memory does not grow without end.
 *
 * @param {Remembered} component
 * @param {string} prefix
 * @param {Iterable<string>} names the names still in use
 * @param {{ storage?: Storage | null }} [options]
 * @returns {number} how many stored values were removed
 */
export declare function forgetRememberedExcept(component: Remembered, prefix: string, names: Iterable<string>, { storage: given }?: {
    storage?: Storage | null;
}): number;
