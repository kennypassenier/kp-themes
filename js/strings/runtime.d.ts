export type Strings = import('./types.js').Strings;
export type DictionarySource = Partial<Strings> | (() => Promise<Partial<Strings>>);
/**
 * Replace some or all of the strings, for the framework-free channel and
 * for anything that reads them outside React.
 *
 * Merged rather than replaced: a consumer that wants one word does not
 * have to restate the other seventy, and a key added in a later version
 * keeps working instead of becoming `undefined` on their page.
 *
 * @param {Partial<Strings>} next
 * @returns {Strings} the merged result
 */
export declare function setStrings(next: Partial<Strings>): Strings;
/**
 * Register a dictionary for a language [habits-1101]. Its words sit between
 * the English and the app's own `setStrings()`; a key it leaves out stays
 * English. The source is the words, or a function that loads them, so a
 * page that never speaks the language never downloads them.
 *
 * @param {string} tag a language tag, `nl` (matches `nl`, `nl-BE`, `nl-NL`) or a whole one
 * @param {DictionarySource} source
 * @returns {Promise<void>} settles once the strings follow the page again
 */
export declare function registerDictionary(tag: string, source: DictionarySource): Promise<void>;
/**
 * Choose the language yourself, over the root's `data-kp-lang` and `lang`;
 * `null` hands the choice back to the root.
 *
 * @param {string | null} tag
 * @returns {Promise<void>} settles once the strings speak it
 */
export declare function setLanguage(tag: string | null): Promise<void>;
/** @returns {string} the language the strings speak now, a registered tag or `en` */
export declare function getLanguage(): string;
/** @returns {Promise<void>} settles once the strings speak the language the page asks for */
export declare function languageReady(): Promise<void>;
/**
 * The words the stylesheets draw themselves, as custom properties
 * [scope-143]. A keyframe cannot read this module, so the word a busy
 * picture spells reaches it as `--kp-loading-word-0` to `-7`: the eight
 * ticks of cyberpunk's decipher, from all noise to the whole word. The
 * register keeps the English as each property's fallback, so a page that
 * never calls `setStrings()` draws what it always drew.
 *
 * @param {Strings} [strings] the strings to draw from, the current ones by default
 * @returns {Record<string, string>} property name to a CSS string value
 */
export declare function stringProperties(strings?: Strings): Record<string, string>;
/**
 * Write `stringProperties()` onto an element, so every stylesheet under it
 * draws the consumer's words. `setStrings()` does this on the document
 * root; call it yourself for a subtree that speaks another language.
 *
 * @param {HTMLElement} root
 * @param {Strings} [strings]
 */
export declare function applyStringProperties(root: HTMLElement, strings?: Strings): void;
/** @returns {Partial<Strings>} the dictionary of the language in use, without the app's own words; empty for English [habits-1101] */
export declare function getLanguageDictionary(): Partial<Strings>;
/** @returns {Strings} the strings as they stand */
export declare function getStrings(): Strings;
/**
 * The strings a component should use: the global ones, with anything the
 * caller passed layered on top.
 *
 * @param {Partial<Strings>} [overrides]
 * @returns {Strings}
 */
export declare function resolveStrings(overrides?: Partial<Strings>): Strings;
