import { Controller } from '../controller.js';
/** Wires one group. Idempotent: `refresh()` brings the group in line again whenever a page touches it. */
export declare class SegmentedGroup extends Controller {
    /** Watches the group and its items for a change of size. @type {ResizeObserver | null} */
    sizes: ResizeObserver | null;
    /** The value of `data-kp-segmented` last seen, to know what the mode was before a change. */
    mode: string;
    /** @param {HTMLElement} host the group */
    constructor(host: HTMLElement);
    connect(): void;
    /** Give the items their type and roles, let the size watcher see them, and paint the state. */
    refresh(): void;
    /**
     * `data-kp-segmented` changed from `was` to something else: the roles and the state attributes are written the way the new
     * mode reads them, and the values that were on stay on (a single group keeps the first of several).
     * @param {string} was
     */
    switchMode(was: string): void;
}
/**
 * Give a group the roles and states its markup left out, and watch its size.
 * Idempotent; called by attach and, for a group added later, by its first use.
 * @param {Element} group
 */
export declare function enhance(group: Element): void;
