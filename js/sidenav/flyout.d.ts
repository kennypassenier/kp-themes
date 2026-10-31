import { SidenavTip } from './tip.js';
export declare class SidenavFlyout extends SidenavTip {
    /** The pointer's rest or grace per group. @type {Map<Element, number>} */
    flyTimers: Map<Element, number>;
    /** The pointer's rest before a peek widens the rail. */
    peekTimer: number;
    /** Whether the pointer is over the panel. */
    pointerIn: boolean;
    /** Counts the peek changes, so a late narrowing does not undo a later widening. */
    peekTurn: number;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    /** @param {Element} category @param {{ focusFirst?: boolean }} [options] */
    flyOut(category: Element, { focusFirst }?: {
        focusFirst?: boolean;
    }): void;
    /** @param {Element} category @param {{ refocus?: boolean }} [options] */
    flyIn(category: Element, { refocus }?: {
        refocus?: boolean;
    }): void;
    /** Make the groups float out in the collapsed rail, and fold in place again outside it. */
    syncRail(): void;
    /** @param {Element} category @param {HTMLElement} submenu */
    floatGroup(category: Element, submenu: HTMLElement): void;
    /** @param {Element} category @param {HTMLElement} submenu */
    foldGroup(category: Element, submenu: HTMLElement): void;
    /** @param {PointerEvent} event */
    onFlyOver(event: PointerEvent): void;
    /** @param {PointerEvent} event */
    onFlyOut(event: PointerEvent): void;
    /** @param {FocusEvent} event */
    onFlyFocusOut(event: FocusEvent): void;
    /**
     * Widen (`open`) or narrow the rail. Narrowing, the rail is `leaving` until its width transition is over, then the attribute
     * goes: the words stay while the width closes, as they came at once when it opened.
     * @param {boolean} value
     */
    setPeek(value: boolean): void;
    /** Whether the rail widens on hover and focus: asked for, and collapsed. */
    peeks(): boolean;
    onPeekEnter(): void;
    onPeekLeave(): void;
    onPeekFocusIn(): void;
    /** @param {FocusEvent} event */
    onPeekFocusOut(event: FocusEvent): void;
    /** Stop the peek's, the tip's and the groups' timers. */
    stopTimers(): void;
}
