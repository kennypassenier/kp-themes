/**
 * Before a grid is written: a grid that leaves its loading state lets its card leave first, and the data is drawn once
 * the card has gone (nothing under a card on its way out; a later spec replaces the waiting one). A grid that loads
 * again while its card is leaving takes the leaving card out at once: one card at a time.
 * @param {HTMLElement} el @param {any} spec @param {boolean} loading @param {(el: HTMLElement, spec: any) => void} draw
 * @returns {boolean} true when the spec waits for the card
 */
export declare function waitForCard(el: HTMLElement, spec: any, loading: boolean, draw: (el: HTMLElement, spec: any) => void): boolean;
/**
 * After a grid is written: a loading grid holds the data table's busy card, centred over its cells (the axis, the
 * headers and the labels stay beside it), and keeps the one it had; a grid that is not loading holds none.
 * @param {HTMLElement} el the box the card is placed in @param {boolean} loading @param {string} words
 * @param {import('../busy-card.js').BusyCardOptions['area']} area @param {string} className
 */
export declare function syncCard(el: HTMLElement, loading: boolean, words: string, area: import('../busy-card.js').BusyCardOptions['area'], className: string): void;
/** The plate a heat grid shows for an empty or failed state, and what it was drawn from. @type {WeakMap<Element, { note: HTMLElement, state: string, title: string, text: string | undefined, art: unknown }>} */
export declare const PLATES: WeakMap<Element, {
    note: HTMLElement;
    state: string;
    title: string;
    text: string | undefined;
    art: unknown;
}>;
/** A grid is drawn once its first render has been painted. @param {Element} el */
export declare function markDrawn(el: Element): void;
/** Take every child of `el` out but its busy card, and put `nodes` in before it. @param {HTMLElement} el @param {Node[]} nodes */
export declare function replaceKeepingCard(el: HTMLElement, nodes: Node[]): void;
