/** The fields built so far, by root; a root is built once, by the first thing that needs it. @type {WeakMap<Element, import('./field.js').TimeField>} */
export declare const FIELDS: WeakMap<Element, import('./field.js').TimeField>;
/** The next field number, for ids. */
export declare const nextFieldNumber: () => number;
