export { NL_KEPT_ENGLISH } from './strings/nl/kept-english.js';
export type Strings = import('./strings/types.js').Strings;
/** @typedef {import('./strings/types.js').Strings} Strings */
/**
 * Every Dutch word kp writes itself, frozen. Partial: a key added in English later stays English here until it is
 * translated.
 *
 * @type {Readonly<Partial<Strings>>}
 */
export declare const NL_STRINGS: Readonly<Partial<Strings>>;
