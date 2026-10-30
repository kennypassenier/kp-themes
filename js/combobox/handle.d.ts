/** @typedef {import('./types.js').ComboboxHandle} ComboboxHandle */
export type ComboboxHandle = import('./types.js').ComboboxHandle;
/** @type {WeakMap<Element, ComboboxHandle>} */
export declare const handles: WeakMap<Element, ComboboxHandle>;
/** The handle for an attached combobox. @param {Element} element */
export declare function combobox(element: Element): import("./types.js").ComboboxHandle | null;
/** @type {WeakMap<Element, import('./types.js').SelectHandle>} */
export declare const selectHandles: WeakMap<Element, import('./types.js').SelectHandle>;
