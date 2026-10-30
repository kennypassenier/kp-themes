/** @typedef {import('./types.js').PaletteHandle} PaletteHandle */
export type PaletteHandle = import('./types.js').PaletteHandle;
/** @type {WeakMap<Element, PaletteHandle>} */
export declare const handles: WeakMap<Element, PaletteHandle>;
/** The handle for an attached palette or sheet. @param {Element} element */
export declare function palette(element: Element): import("./types.js").PaletteHandle | null;
