/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tag @param {string} [className] @param {string} [text]
 * @returns {HTMLElementTagNameMap[K]}
 */
export declare const make: <K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string) => HTMLElementTagNameMap[K];
/**
 * Build the rating into `el`: nothing is wired here.
 * @param {HTMLElement} el @param {number} max
 */
export declare function buildRating(el: HTMLElement, max: number): {
    row: HTMLDivElement;
    stars: HTMLSpanElement[];
    caption: HTMLSpanElement;
    actions: HTMLSpanElement;
    clear: HTMLButtonElement;
    save: HTMLButtonElement;
    drop: HTMLButtonElement;
    reason: HTMLSpanElement;
    flash: HTMLSpanElement;
    live: HTMLSpanElement;
    failure: HTMLSpanElement;
    failureText: HTMLSpanElement;
    retry: HTMLButtonElement;
    foot: HTMLSpanElement;
    field: (HTMLInputElement & {
        type: string;
        name: string;
    }) | null;
};
