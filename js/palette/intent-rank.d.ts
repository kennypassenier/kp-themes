export type IntentMode = import('./intent-dom.js').IntentMode;
export type IntentFilter = import('./intent-filter.js').IntentFilter;
export type Ranked = {
    option: HTMLElement;
    base: number;
    score: number;
    inContext: boolean;
    featured: boolean;
    recency: number;
    at: number;
};
/**
 * Score every command; under a failed list only the static ones stay, and with nothing typed a start set (featured, in
 * context, recent) shows alone when there is one.
 * @param {IntentFilter} f @param {HTMLElement[]} options @param {string[]} want @param {IntentMode} mode
 */
export declare function rankCommands(f: IntentFilter, options: HTMLElement[], want: string[], mode: IntentMode): {
    items: Ranked[];
    startSet: boolean;
};
/**
 * The best answer first in its own group; the order of the markup when nothing is typed and nothing is recent. The sections:
 * the consumer's order (`data-kp-group-order`), else the markup's.
 * @param {IntentFilter} f @param {Ranked[]} items @param {string[]} want
 */
export declare function orderCommands(f: IntentFilter, items: Ranked[], want: string[]): void;
