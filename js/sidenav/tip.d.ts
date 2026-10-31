import { SidenavSlim } from './slim.js';
export declare class SidenavTip extends SidenavSlim {
    /** @type {HTMLElement | null} */
    tip: HTMLElement | null;
    /** The item the tip shows, or is about to show. @type {Element | null} */
    tipFor: Element | null;
    /** The pointer's rest before the tip shows. */
    tipTimer: number;
    /** Whether the tip is playing its going. */
    tipGoing: boolean;
    /** The submenus floated out of the rail, and whether the `popover` attribute was added here. @type {Map<HTMLElement, { added: boolean }>} */
    floated: Map<HTMLElement, {
        added: boolean;
    }>;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    /**
     * Place a box that floats beside the rail, in the top layer: beside the item, on the far side of the panel, turned to the near
     * side when the window has no room there, and kept inside the window.
     *
     * @param {HTMLElement} box
     * @param {Element} item
     * @param {'start' | 'centre'} align
     */
    floatBeside(box: HTMLElement, item: Element, align: 'start' | 'centre'): void;
    /** Show a popover, once more a task later when Firefox refuses during another one's hide. @param {HTMLElement} box @param {() => void} then */
    show(box: HTMLElement, then: () => void): void;
    /** The items a tip names: links, and the group headings while the groups do not float out. */
    tipItems(): ".kp-sidenav__link" | ".kp-sidenav__link, .kp-sidenav__category-toggle";
    hideTip(): void;
    /** @param {Element} item */
    showTip(item: Element): void;
    /** @param {PointerEvent} event */
    onTipOver(event: PointerEvent): void;
    /** @param {PointerEvent} event */
    onTipOut(event: PointerEvent): void;
    /** @param {FocusEvent} event */
    onTipFocus(event: FocusEvent): void;
    /** Take the tip away for good. */
    dropTip(): void;
    /** @param {Element} category */
    submenuOf(category: Element): HTMLElement | null;
    /** @param {Element} category */
    toggleOf(category: Element): HTMLElement | null;
}
