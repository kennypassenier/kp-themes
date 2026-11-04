import { Controller } from '../controller.js';
/**
 * The size watch of one group over the one observer all groups share. One observer delivers every changed group in one callback,
 * so their plates are placed together; an observer per group delivered them one by one, each write forcing the next read to lay
 * the page out again. Has the `observe` and `disconnect` of a ResizeObserver, so the controller can own it.
 */
declare class GroupSizes {
    /** @type {Set<Element>} */
    watching: Set<Element>;
    constructor();
    /** @param {Element} element @param {HTMLElement} group */
    watch(element: Element, group: HTMLElement): void;
    disconnect(): void;
}
/** Wires one group. Idempotent: `refresh()` brings the group in line again whenever a page touches it. */
export declare class SegmentedGroup extends Controller {
    /** Watches the group and its items for a change of size. @type {GroupSizes | null} */
    sizes: GroupSizes | null;
    /** The value of `data-kp-segmented` last seen, to know what the mode was before a change. */
    mode: string;
    /** @param {HTMLElement} host the group */
    constructor(host: HTMLElement);
    connect(): void;
    /**
     * Give the items their type and roles, let the size watcher see them, and paint the state.
     * @param {boolean} [together] the plate and the tracks wait for the other groups of the pass, which `connect()` asks
     */
    refresh(together?: boolean): void;
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
export {};
