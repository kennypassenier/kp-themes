/**
 * The step waits: what for, how long, and the button to the track that can go on.
 * @param {HTMLElement} root @param {HTMLElement} holder @param {import('./constants.js').FocusState} state
 * @param {ReturnType<typeof import('./blockers.js').blockersOf>} blocks @param {ReturnType<typeof import('./tracks.js').timerStates>} timers @param {number} index
 */
export declare function waitBlock(root: HTMLElement, holder: HTMLElement, state: import('./constants.js').FocusState, blocks: ReturnType<typeof import('./blockers.js').blockersOf>, timers: ReturnType<typeof import('./tracks.js').timerStates>, index: number): void;
/** The ingredients a step needs, as a labelled list. @param {NonNullable<import('./constants.js').FocusStep['ingredients']>} ingredients */
export declare function needsList(ingredients: NonNullable<import('./constants.js').FocusStep['ingredients']>): HTMLElement;
/** The start button of a step's timer. @param {HTMLElement} root @param {import('./constants.js').FocusState} state @param {NonNullable<import('./constants.js').FocusStep['timer']>} timer @param {boolean} blocked @param {number} index @param {number} total */
export declare function timerButton(root: HTMLElement, state: import('./constants.js').FocusState, timer: NonNullable<import('./constants.js').FocusStep['timer']>, blocked: boolean, index: number, total: number): HTMLButtonElement;
