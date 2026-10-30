import { UptimeInfo } from './info.js';
export type UptimeSpec = import('./types.js').UptimeSpec;
export declare class UptimeControl extends UptimeInfo {
    /** The animation frame of the next fit. */
    frame: number;
    /** The width the last fit was for; -1 before the first. */
    width: number;
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    /** Fit again when the strip's width changes, at most once per frame. */
    watchWidth(): void;
    /** A strip that is laid out again (its fonts arrived, it was shown) keeps its latest period in view. */
    watchTrack(): void;
    /** The busy card goes with the strip; the group's card goes with its last strip. */
    leaveCard(): void;
    /** Remember whether the reader scrolled away from the latest period. @param {Event} event */
    onScroll(event: Event): void;
    /** The cell an event happened in, if it is one of this strip's pressable cells outside the quick info. @param {Event} event @returns {HTMLElement | null} */
    cellOf(event: Event): HTMLElement | null;
    /** The index a key or arrow leads to, or -1 for a key that moves nothing. @param {string} key @param {number} at @param {number} count */
    static target(key: string, at: number, count: number): number;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
    /** A press anywhere but the quick info and the strip's cells closes it. @param {PointerEvent} event */
    onOutside(event: PointerEvent): void;
    /** Tabbing out of the strip and its quick info closes it. @param {FocusEvent} event */
    onFocusOut(event: FocusEvent): void;
}
