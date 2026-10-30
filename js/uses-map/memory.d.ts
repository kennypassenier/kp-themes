export type UsesMemory = {
    pin: string | null;
    lit: string | null;
    stop: string | null;
    off: (() => void) | null;
};
/** One matrix's memory: the pinned node, the lit one, the tab stop and the undo of its wiring. @typedef {{ pin: string | null, lit: string | null, stop: string | null, off: (() => void) | null }} UsesMemory */
/** @type {WeakMap<Element, UsesMemory>} */
export declare const MEMORY: WeakMap<Element, UsesMemory>;
/** The storage key of a matrix, or null when it keeps nothing. @param {Element} el */
export declare const rememberKey: (el: Element) => string | null;
/** The view a matrix remembers on this device, or null. @param {Element} el @returns {'grid' | 'lines' | null} */
export declare function rememberedView(el: Element): 'grid' | 'lines' | null;
/** Remember the view a matrix shows. @param {Element} el @param {'grid' | 'lines'} view */
export declare function rememberView(el: Element, view: 'grid' | 'lines'): void;
/** The memory of a matrix, made (and the stored pin read) on its first draw. @param {Element} el @returns {UsesMemory} */
export declare function memoryOf(el: Element): UsesMemory;
/** Keep (or clear) the pinned node on this device. @param {Element} el @param {string | null} key */
export declare function storePin(el: Element, key: string | null): void;
