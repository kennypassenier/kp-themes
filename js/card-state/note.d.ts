export type CardStateOptions = import('../card-state.js').CardStateOptions;
/**
 * Write the empty or error note, unless the page drew its own.
 * @param {HTMLElement} note
 * @param {'empty' | 'error'} state
 * @param {CardStateOptions} options
 */
export declare function buildNote(note: HTMLElement, state: 'empty' | 'error', options: CardStateOptions): void;
