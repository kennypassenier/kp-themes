/** The words that switch a shortcut off. */
export declare const KEY_NONE = "none";
export type KeyChord = {
    mod: boolean;
    alt: boolean;
    shift: boolean;
    key: string;
    cap: string;
};
export type KeySpec = readonly KeyChord[];
/**
 * Read a key spec; null or an off word gives the empty spec.
 * @param {string | false | null | undefined | readonly string[]} spec
 * @returns {KeySpec}
 */
export declare function parseKeySpec(spec: string | false | null | undefined | readonly string[]): KeySpec;
/**
 * The key an element, a JS option and a default give, in that order of weight: the option, then the attribute, then the default.
 * @param {Element | null} host @param {string} attribute @param {string | false | readonly string[] | undefined} option @param {string | false | readonly string[]} fallback
 * @returns {KeySpec}
 */
export declare function resolveKeySpec(host: Element | null, attribute: string, option: string | false | readonly string[] | undefined, fallback: string | false | readonly string[]): KeySpec;
/**
 * Does this keydown press one of the spec's keys? A modifier the spec does not name must be up.
 * @param {KeyboardEvent} event @param {KeySpec} spec @param {{ anyShift?: boolean }} [how]
 */
export declare function matchesKeySpec(event: KeyboardEvent, spec: KeySpec, how?: {
    anyShift?: boolean;
}): boolean;
/** The first key of a spec as the caps of a `setKeys` pair (`['Mod', 'A']`, `'j'`), or null when it is off. @param {KeySpec} spec @returns {string | readonly string[] | null} */
export declare function keyCaps(spec: KeySpec): string | readonly string[] | null;
/** The spec with Shift held as well (the "undo" twin of a key, as Ctrl+Shift+A is of Ctrl+A). @param {KeySpec} spec @returns {KeySpec} */
export declare const withShift: (spec: KeySpec) => KeySpec;
/**
 * The first key of a spec in the shortcut engine's own spelling ("Shift C", "Mod K"), for `registerShortcuts`; null when the spec is off.
 * @param {KeySpec} spec
 * @returns {string | null}
 */
export declare function engineKeys(spec: KeySpec): string | null;
/** The first key of a spec as a person reads it, `Ctrl+B` or `⌘+B`; empty when it is off. @param {KeySpec} spec */
export declare function keyLabel(spec: KeySpec): string;
/** The first key of a spec for `aria-keyshortcuts` (`Control+B`, `Meta+B`); empty when it is off. @param {KeySpec} spec */
export declare function ariaKeyShortcut(spec: KeySpec): string;
/** A key spec as a person reads it (⌘ or Ctrl, ⌥ or Alt). @param {string} key `Mod+Z`, `Alt+Z` */
export declare const keyName: (key: string) => string;
/** Whether a value is written as a key spec (`Mod+K`, `+ or =`) rather than in the older spellings (`k`, `Mod K`, `mod-enter`). @param {string} text */
export declare const isKeySpecText: (text: string) => boolean;
/**
 * The keys for the shortcut engine (js/shortcuts.js) from an option, an attribute and a default. A key spec is converted; a value
 * in the engine's own spelling (`:`, `Mod K`, `g s`), which pages used before key specs, is passed through unchanged.
 * @param {Element | null} host @param {string} attribute @param {string | false | undefined} option @param {string | false} fallback
 * @returns {string | null} null when the shortcut is off
 */
export declare function resolveEngineKeys(host: Element | null, attribute: string, option: string | false | undefined, fallback: string | false): string | null;
/** The engine's spelling of keys (`Mod e`, `g s`) for `aria-keyshortcuts` (`Control+e`, `g s`). @param {string} keys */
export declare function ariaFromEngineKeys(keys: string): string;
