export type AgoContext = import('../freshness.js').AgoContext;
export type AgoState = import('../freshness.js').AgoState;
/** @typedef {import('../freshness.js').AgoContext} AgoContext */
/** @typedef {import('../freshness.js').AgoState} AgoState */
/** Every ticking line on the page, with the context it ticks in. @type {Map<HTMLElement, AgoContext>} */
export declare const live: Map<HTMLElement, AgoContext>;
/** What each line last painted. @type {WeakMap<HTMLElement, AgoState>} */
export declare const states: WeakMap<HTMLElement, AgoState>;
/** Reserved widths already measured, by text and face: one read serves every line that shares them. @type {Map<string, number>} */
export declare const widths: Map<string, number>;
/** The values the parts of this module change. */
export declare const engine: {
    /** The one timer for the whole page. @type {ReturnType<typeof setInterval> | null} */
    timer: ReturnType<typeof setInterval> | null;
    /** Whether the live-region warning has been given. */
    warned: boolean;
    /** How many attaches listen for the tab being hidden and shown. */
    listening: number;
};
