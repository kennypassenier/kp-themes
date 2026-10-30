import { ContentsCore } from './core.js';
export type ContentsItem = import('./core.js').ContentsItem;
/** @typedef {import('./core.js').ContentsItem} ContentsItem */
export declare class ContentsRead extends ContentsCore {
    /** The entries the page gave, each with the section it names. @param {ContentsItem[]} given @returns {{ item: ContentsItem, target: HTMLElement }[]} */
    readGiven(given: ContentsItem[]): {
        item: ContentsItem;
        target: HTMLElement;
    }[];
    /** The headings that count: in the scope, not in the list, shown, with words. @returns {HTMLElement[]} */
    headings(): HTMLElement[];
    /** Give a heading an id from its words, one that no element has yet. @param {HTMLElement} target @param {Set<string>} used */
    ensureHeadingId(target: HTMLElement, used: Set<string>): void;
    /** The entries now: the items the page gave, else the headings, nested by their level. @returns {{ item: ContentsItem, target: HTMLElement }[]} */
    read(): {
        item: ContentsItem;
        target: HTMLElement;
    }[];
}
