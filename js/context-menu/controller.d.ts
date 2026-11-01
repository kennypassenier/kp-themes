import { Controller } from '../controller.js';
export type MenuGroup = import('../menu-button.js').MenuGroup;
export type ContextGroups = MenuGroup[] | ((el: HTMLElement) => MenuGroup[]);
/** @typedef {import('../menu-button.js').MenuGroup} MenuGroup */
/** @typedef {MenuGroup[] | ((el: HTMLElement) => MenuGroup[])} ContextGroups */
/** The entries a page gave each element with setContextMenu(). @type {WeakMap<Element, ContextGroups>} */
export declare const given: WeakMap<Element, ContextGroups>;
/**
 * What an element's menu shows, and the menu button it borrows them from (`inner`, or the id of a menu button), if any.
 * @param {HTMLElement} el
 * @returns {{ groups: MenuGroup[], source: HTMLElement | null }}
 */
export declare function menuFor(el: HTMLElement): {
    groups: MenuGroup[];
    source: HTMLElement | null;
};
export declare class ContextMenuRoot extends Controller {
    /** A long press on its way. @type {ReturnType<typeof setTimeout> | null} */
    hold: ReturnType<typeof setTimeout> | null;
    pressAt: {
        x: number;
        y: number;
    };
    /** Whether the last press opened the menu, so the click its release makes is not a pick or an outside click. */
    pressOpened: boolean;
    /** When a key last opened a menu, to tell the key's own `contextmenu` echo from a new request. */
    keyAt: number;
    /** @param {HTMLElement} root @param {Record<string, unknown>} [options] */
    constructor(root: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** The element with a context menu an event is about, unless it happened in the open menu. @param {Event} event */
    elementOf(event: Event): HTMLElement | null;
    /**
     * Open the element's menu at a point; nothing when it has no entries (the browser's own menu then stays).
     * @param {HTMLElement} el @param {number} x @param {number} y @param {'pointer' | 'touch' | 'keyboard'} how
     * @returns {boolean} whether it opened
     */
    openAt(el: HTMLElement, x: number, y: number, how: 'pointer' | 'touch' | 'keyboard'): boolean;
    /** A right click (Shift keeps the browser's own menu), or the key's echo. @param {MouseEvent} event */
    onContext(event: MouseEvent): void;
    /** Shift+F10 or the context-menu key: the menu hangs from the focused element's start edge. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** Whether a long press on this element may open its menu: `data-kp-context-press`, by default off inside row picking. @param {HTMLElement} el */
    static pressAllowed(el: HTMLElement): boolean;
    /** A finger or a pen held still for LONG_PRESS_MS opens the menu where it is. @param {PointerEvent} event */
    onPressStart(event: PointerEvent): void;
    /** @param {PointerEvent} event */
    onPressMove(event: PointerEvent): void;
    cancelPress(): void;
    /** The click the finger's release makes after a long press opened the menu is no click at all. @param {Event} event */
    swallowRelease(event: Event): void;
}
