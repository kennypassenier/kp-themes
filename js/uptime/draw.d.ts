export type UptimeSpec = import('./types.js').UptimeSpec;
/** @typedef {import('./types.js').UptimeSpec} UptimeSpec */
/**
 * Draw a strip, or let its busy card leave first when it stops loading.
 * @param {HTMLElement} el
 * @param {UptimeSpec} spec
 */
export declare function setUptime(el: HTMLElement, spec: UptimeSpec): void;
