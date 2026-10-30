export type UsualModel = import('./types.js').UsualModel;
/** @typedef {import('./types.js').UsualModel} UsualModel */
/** @type {WeakMap<Element, UsualModel>} */
export declare const models: WeakMap<Element, UsualModel>;
/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tag @param {string} [className] @param {string} [text]
 * @returns {HTMLElementTagNameMap[K]}
 */
export declare const make: <K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string) => HTMLElementTagNameMap[K];
/** @param {UsualModel} m @param {string} name @param {string} [fallback] */
export declare const attr: (m: UsualModel, name: string, fallback?: string) => string | undefined;
/** @param {number} n @param {number} lo @param {number} hi */
export declare const clamp: (n: number, lo: number, hi: number) => number;
/** The real options of the list, not the rows this module adds. @param {HTMLElement} list */
export declare const realOptions: (list: HTMLElement) => HTMLElement[];
/** @param {UsualModel} m */
export declare function readItems(m: UsualModel): void;
/** The pinned choices: "Nothing to log", "Not sure". @param {UsualModel} m @returns {{ value: string, label: string }[]} */
export declare function readPinned(m: UsualModel): {
    value: string;
    label: string;
}[];
/** The band's values, in the band's order, only those the list has. @param {UsualModel} m @returns {string[]} */
export declare function bandValues(m: UsualModel): string[];
/** Whether the full list is folded behind "Show all N" right now. @param {UsualModel} m */
export declare function folded(m: UsualModel): boolean;
/** Whether the list can fold at all. @param {UsualModel} m */
export declare function canFold(m: UsualModel): boolean;
/** @param {UsualModel} m @param {string} text */
export declare function say(m: UsualModel, text: string): void;
