export type Matcher = import('./types.js').Matcher;
/** @typedef {import('./types.js').Matcher} Matcher */
/** Whether this is a Mac, where the modifier is ⌘ rather than Ctrl. */
export declare function isMac(): boolean;
/** @type {Record<string, Matcher>} */
export declare const MATCHERS: Record<string, Matcher>;
/**
 * Is this keystroke the palette's? ⌘+key on a Mac, Ctrl+key everywhere
 * else. Checked rather than assumed: a page that binds Ctrl+K on a Mac
 * steals nothing, but a page that binds ⌘K on Windows binds nothing at
 * all.
 *
 * @param {KeyboardEvent} event
 * @param {string} key
 */
export declare function isHotkey(event: KeyboardEvent, key: string): boolean;
/**
 * Is the event coming from somewhere that a bare `?` means a question
 * mark rather than a shortcut?
 *
 * @param {EventTarget | null} target
 * @param {string} typingSelector
 */
export declare function isTyping(target: EventTarget | null, typingSelector: string): boolean;
