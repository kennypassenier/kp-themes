export type AckHandle = import('../ack-gate.js').AckHandle;
/** @typedef {import('../ack-gate.js').AckHandle} AckHandle */
/** The handle of every attached gate. @type {WeakMap<Element, AckHandle>} */
export declare const HANDLES: WeakMap<Element, AckHandle>;
/** @param {Element} gate @returns {HTMLElement[]} */
export declare const targetsOf: (gate: Element) => HTMLElement[];
/** The gates that guard the same control as `gate`, itself included. @param {Element} gate @returns {HTMLElement[]} */
export declare const siblingsOf: (gate: Element) => HTMLElement[];
/** Whether a gate holds the control back: unticked and in play. @param {HTMLElement} gate */
export declare const open: (gate: HTMLElement) => boolean;
