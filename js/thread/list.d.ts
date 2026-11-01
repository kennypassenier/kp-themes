/**
 * The list: a divider per day (when asked), then each run of messages.
 * @param {HTMLElement} host
 * @param {{ spec: import('../thread.js').ThreadSpec, expanded: Set<string> }} state
 * @param {ReturnType<typeof import('./options.js').threadOptions>} options @param {string} locale
 */
export declare function threadList(host: HTMLElement, { spec, expanded }: {
    spec: import('../thread.js').ThreadSpec;
    expanded: Set<string>;
}, options: ReturnType<typeof import('./options.js').threadOptions>, locale: string): HTMLElement;
