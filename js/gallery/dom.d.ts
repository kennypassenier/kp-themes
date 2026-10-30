/** @param {Element} el @param {string} name @param {string} fallback */
export declare const attr: (el: Element, name: string, fallback: string) => string;
/** @param {Document} doc @param {string} tag @param {string} cls */
export declare const make: (doc: Document, tag: string, cls: string) => HTMLElement;
/** A picture address that asks again (past a cached failure). @param {string} url */
export declare const again: (url: string) => string;
