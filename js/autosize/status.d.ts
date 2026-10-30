/** Take the busy card's frame away again. @param {import('./controller.js').AutosizeController} c */
export declare function unframe(c: import('./controller.js').AutosizeController): void;
/**
 * Put a box in a state.
 * @param {import('./controller.js').AutosizeController} c
 * @param {'ready' | 'loading' | 'error'} next
 * @param {string} [message]
 */
export declare function applyState(c: import('./controller.js').AutosizeController, next: 'ready' | 'loading' | 'error', message?: string): void;
