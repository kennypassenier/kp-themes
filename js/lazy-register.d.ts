export { REGISTER_ATTRIBUTE, REGISTER_PATTERN, REGISTER_LOAD_EVENT, REGISTER_ERROR_EVENT } from './lazy-register/values.js';
export { registerHref, registerLink, registersPresent, registerLoaded } from './lazy-register/links.js';
export { ensureRegister } from './lazy-register/ensure.js';
export type LazyRegisterOptions = {
    /**
     * where a register is served from, with `{theme}` in it (default REGISTER_PATTERN)
     */
    pattern?: string;
    /**
     * the document to insert into (default: the current one)
     */
    doc?: Document;
};
/**
 * @typedef {object} LazyRegisterOptions
 * @property {string} [pattern] where a register is served from, with `{theme}` in it (default REGISTER_PATTERN)
 * @property {Document} [doc] the document to insert into (default: the current one)
 */
/**
 * Keep the document's registers in step with its theme.
 *
 * @param {{ pattern?: string, hold?: boolean, prune?: boolean, root?: Element }} [options]
 *   pattern: where a register is served from, with `{theme}` in it (default REGISTER_PATTERN) —
 *     the same value the no-flash snippet was given;
 *   hold: keep a change back until its register has loaded (default true). Off, the root flips at
 *     once and wears the new tokens without their register until the file lands;
 *   prune: remove the previous theme's register after a change (default false: kept, so that
 *     switching back fetches nothing);
 *   root: the element that wears the theme (default: theme-core's root).
 * @returns {() => void} detach: stop following theme changes and drop a held change; links already inserted stay
 */
export declare function attachLazyRegisters(options?: {
    pattern?: string;
    hold?: boolean;
    prune?: boolean;
    root?: Element;
}): () => void;
