import { SidenavNarrow } from './narrow.js';
export declare class SidenavResizer extends SidenavNarrow {
    /** The handle, on a resizable panel. @type {HTMLElement | null} */
    grip: HTMLElement | null;
    /** Whether the width on the panel was written here, so the detach takes it away. */
    wroteWidth: boolean;
    /** The panel's width with the pointer where the handle is held, so the handle does not jump. */
    gripOffset: number;
    /** The panel's own transition, put back when the handle is let go. */
    heldTransition: string;
    /** The pointer holding the handle. @type {number | null} */
    held: number | null;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    /** Make the handle on a panel that asks for one, start it at a painted width, and wire it. */
    setupResizer(): void;
    /** A limit the panel names, in pixels; a length that does not resolve is the fallback. @param {string} name @param {string} fallback */
    limit(name: string, fallback: string): number;
    minWidth(): number;
    maxWidth(): number;
    /** Whether the panel's growing side is to the right on screen. */
    startsAtLeft(): boolean;
    /** @param {number} px */
    clampWidth(px: number): number;
    sayWidth(): void;
    /** @param {number} px @param {boolean} [save] */
    setWidth(px: number, save?: boolean): number;
    /** @param {PointerEvent} event */
    pointerWidth(event: PointerEvent): number;
    /** @param {PointerEvent} event */
    onGripDown(event: PointerEvent): void;
    /** @param {PointerEvent} event */
    onGripMove(event: PointerEvent): void;
    /** @param {PointerEvent} event */
    onGripUp(event: PointerEvent): void;
    /** @param {KeyboardEvent} event */
    onGripKey(event: KeyboardEvent): void;
    /** A double press gives the width back to the stylesheet's own. */
    onGripReset(): void;
    /** Take the handle away, with the width written here. */
    undoGrip(): void;
    /** Give the panel its own transition back when the handle was held at the detach. */
    undoHeld(): void;
}
