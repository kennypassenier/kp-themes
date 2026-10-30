export type LazyRegisterOptions = import('../lazy-register.js').LazyRegisterOptions;
/**
 * Make sure `theme`'s register is in the document, and resolve when it has
 * loaded. A link already there — the no-flash snippet's, a hand-written
 * one, an earlier call's — is reused, so a register is fetched once. A
 * failed load is forgotten and its link removed, so the next call tries
 * again.
 *
 * @param {string} theme
 * @param {LazyRegisterOptions} [options]
 * @returns {Promise<HTMLLinkElement>}
 */
export declare function ensureRegister(theme: string, { pattern, doc }?: LazyRegisterOptions): Promise<HTMLLinkElement>;
