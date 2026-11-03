export type Matcher = import('./types.js').Matcher;
/** @typedef {import('./types.js').Matcher} Matcher */
/** Whether this is a Mac, where the modifier is ⌘ rather than Ctrl. */
export declare function isMac(): boolean;
/** @type {Record<string, Matcher>} */
export declare const MATCHERS: Record<string, Matcher>;
/**
 * The palette's key as a key spec: the attribute on the dialog, else the page's default, else no key. The older spelling, one
 * letter (`k`), still means `Mod` and that letter: ⌘ on a Mac, Ctrl everywhere else, checked rather than assumed (a page that binds
 * Ctrl+K on a Mac steals nothing, but a page that binds ⌘K on Windows binds nothing at all).
 *
 * @param {Element} dialog
 * @param {string | null | undefined} fallback
 * @returns {import('../key-spec.js').KeySpec}
 */
export declare function paletteKeySpec(dialog: Element, fallback: string | null | undefined): import('../key-spec.js').KeySpec;
/**
 * Is this keystroke the palette's? Shift is not looked at, as it never was.
 * @param {KeyboardEvent} event
 * @param {import('../key-spec.js').KeySpec} spec
 */
export declare const isHotkey: (event: KeyboardEvent, spec: import('../key-spec.js').KeySpec) => boolean;
/**
 * Is the event coming from somewhere that a bare `?` means a question
 * mark rather than a shortcut?
 *
 * @param {EventTarget | null} target
 * @param {string} typingSelector
 */
export declare function isTyping(target: EventTarget | null, typingSelector: string): boolean;
