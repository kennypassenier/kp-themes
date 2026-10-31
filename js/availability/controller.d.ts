import { Controller } from '../controller.js';
export type AvailabilityAnswer = import('./types.js').AvailabilityAnswer;
/** One availability grid; its answers stay in the STATE registry the setters read before attach. */
export declare class AvailabilityControl extends Controller {
    /** A row being painted by a drag. @type {{ person: string, first: HTMLElement, answer: AvailabilityAnswer | null, keys: Set<string>, pointer: number } | null} */
    drag: {
        person: string;
        first: HTMLElement;
        answer: AvailabilityAnswer | null;
        keys: Set<string>;
        pointer: number;
    } | null;
    /** Whether the click that ends a painted stroke is swallowed. */
    suppress: boolean;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
    /**
     * Retry (or Add on the empty plate), the unit switch and Choose.
     * @param {Element} target
     * @returns {boolean} whether the press was one of them
     */
    plateClick(target: Element): boolean;
    /**
     * An answer in the menu, or a column head that picks its column.
     * @param {Element} target
     * @returns {boolean} whether the press was one of them
     */
    pickClick(target: Element): boolean;
    /** A mouse or pen press on an editable cell may start painting its row. @param {PointerEvent} event */
    onDown(event: PointerEvent): void;
    /** The stroke takes in every editable cell of its row it passes. @param {PointerEvent} event */
    onMove(event: PointerEvent): void;
    /** A stroke over two cells or more answers them all; the click that follows it is swallowed. */
    onUp(): void;
    /** The grid's sideways scroll is remembered. @param {Event} event */
    onScroll(event: Event): void;
}
