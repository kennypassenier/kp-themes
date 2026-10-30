/** @param {Document} doc @param {string} className @param {string} [tag] */
export declare const make: (doc: Document, className: string, tag?: string) => HTMLElement;
/** A button of the list: its type, the action it fires, its look and its words. @param {Document} doc @param {string} look @param {string} act @param {string} text */
export declare const actionButton: (doc: Document, look: string, act: string, text: string) => HTMLElement;
/** @param {Document} doc @param {import('./constants.js').PasskeyKind} kind */
export declare function glyph(doc: Document, kind: import('./constants.js').PasskeyKind): SVGSVGElement;
/** The row of `key` under `el`. @param {HTMLElement} el @param {string | null | undefined} key */
export declare const rowOf: (el: HTMLElement, key: string | null | undefined) => Element | undefined;
/** The control of row `key` that fires `act`. @param {HTMLElement} el @param {string} key @param {string} act */
export declare const actionOf: (el: HTMLElement, key: string, act: string) => HTMLElement | null | undefined;
