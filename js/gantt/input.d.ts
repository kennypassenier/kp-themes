import { Controller } from '../controller.js';
export type GanttOptions = import('./constants.js').GanttOptions;
/**
 * The bar or point mark an event happened on.
 * @param {Event} event
 * @returns {HTMLButtonElement | null}
 */
export declare const barOf: (event: Event) => HTMLButtonElement | null;
/** The base of a timeline's controller: the model it draws and the keyboard and pointer input on it. */
export declare class GanttInput extends Controller {
    /** The timeline's model, the registry entry every part reads. */
    c: import("./constants.js").GanttModel;
    /** @param {HTMLElement} host @param {GanttOptions} [options] */
    constructor(host: HTMLElement, options?: GanttOptions);
    /** Arrows, Home and End move between day stops or between bars. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** @param {KeyboardEvent} event @param {HTMLButtonElement} dayButton */
    onDayKey(event: KeyboardEvent, dayButton: HTMLButtonElement): void;
    /**
     * The bar a key moves to from `bar`: along its lane, or to the nearest start in the lane above or below.
     * @param {HTMLButtonElement} bar @param {string} key
     * @returns {HTMLElement | undefined}
     */
    barFrom(bar: HTMLButtonElement, key: string): HTMLElement | undefined;
    /** @param {PointerEvent} event */
    plotX(event: PointerEvent): number;
    /** @param {number} x @returns {number} epoch ms */
    timeAt(x: number): number;
    /** @param {PointerEvent} event */
    onDown(event: PointerEvent): void;
    /** @param {PointerEvent} event */
    onMove(event: PointerEvent): void;
    /** @param {boolean} commit whether the drag selects its range (a pointerup) or is dropped (a pointercancel) */
    endDrag(commit: boolean): void;
}
