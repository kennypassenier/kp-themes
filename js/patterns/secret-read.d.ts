export type SecretLoad = import('./types.js').SecretLoad;
export type Strings = import('../strings.js').Strings;
/** @typedef {import('./types.js').SecretLoad} SecretLoad */
/** @typedef {import('../strings.js').Strings} Strings */
/**
 * The value, asked of the page: a `kp-secret-request` it answers (preventDefault, then respond or fail), else the `load` option,
 * else `data-kp-secret-value`. The first answer counts.
 * @param {HTMLElement} field
 * @param {'reveal' | 'copy'} purpose
 * @param {SecretLoad | undefined} load
 * @param {Strings} s
 * @returns {Promise<string>}
 */
export declare function readSecret(field: HTMLElement, purpose: 'reveal' | 'copy', load: SecretLoad | undefined, s: Strings): Promise<string>;
/** The words for why a read failed. @param {unknown} error @param {Strings} s */
export declare const reasonOf: (error: unknown, s: Strings) => string;
