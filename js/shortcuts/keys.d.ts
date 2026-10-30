export type Step = import('../shortcuts.js').Step;
/**
 * Read "g s" or "Mod K" into steps.
 * @param {string} keys
 * @returns {Step[]}
 */
export declare function parseShortcutKeys(keys: string): Step[];
/** The steps in one comparable string. @param {Step[]} steps */
export declare const normal: (steps: Step[]) => string;
/** The keys as the sheet spells them. @param {string} keys */
export declare function displayShortcutKeys(keys: string): string;
/**
 * Does this event press this step?
 * @param {Step} step @param {KeyboardEvent} event
 */
export declare function matches(step: Step, event: KeyboardEvent): boolean;
/** The keys that are never a shortcut's own: composing, repeating, dead keys and the modifiers alone. @param {KeyboardEvent} event */
export declare function ignoredKey(event: KeyboardEvent): boolean;
