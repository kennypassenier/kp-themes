export type Entry = import('../shortcuts.js').Entry;
export type Shortcut = import('../shortcuts.js').Shortcut;
export type EngineOptions = import('../shortcuts.js').EngineOptions;
export type Step = import('../shortcuts.js').Step;
export type ShortcutBoard = import('./board.js').ShortcutBoard;
/**
 * Register a list of shortcuts under a scope.
 *
 * @param {ShortcutBoard} board
 * @param {string | Element} scope a name (the page's keys) or an element (keys that live while it is on screen)
 * @param {readonly Shortcut[]} list
 * @param {EngineOptions} [options] overrides the page's defaults for this list
 * @returns {() => void} unregister
 */
export declare function registerOn(board: ShortcutBoard, scope: string | Element, list: readonly Shortcut[], options?: EngineOptions): () => void;
