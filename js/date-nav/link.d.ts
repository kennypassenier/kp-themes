export type DateNavRange = import('./constants.js').DateNavRange;
/** @typedef {import('./constants.js').DateNavRange} DateNavRange */
/**
 * Move the target the navigation names, if any, to the range it shows now.
 * @param {HTMLElement} nav @param {DateNavRange} range @param {boolean} announce whether a person moved it (the target's own event fires)
 */
export declare function driveTarget(nav: HTMLElement, range: DateNavRange, announce: boolean): void;
