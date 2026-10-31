import { PlotDraw } from './draw.js';
export type ChartPoint = import('../words.js').ChartPoint;
export declare class PlotPointer extends PlotDraw {
    /** The plot's pointer, keyboard and focus listeners. */
    wirePointer(): void;
    /** The time under the pointer, on the last drawing. @param {PointerEvent} e */
    timeAt(e: PointerEvent): number | null;
    /** A press on an event's mark pins it; anywhere else it starts a brush. @param {PointerEvent} e */
    onDown(e: PointerEvent): void;
    /** @param {PointerEvent} e */
    onPointer(e: PointerEvent): void;
    /** A drag zooms to its span; a click pins the time under it, or takes the pin near it away. @param {PointerEvent} e */
    onUp(e: PointerEvent): void;
    /** Arrows, Home and End walk the readings; Enter pins; Escape lets go of the pin, the selection, then the zoom. @param {KeyboardEvent} e */
    onKey(e: KeyboardEvent): void;
    /** Pin or unpin; nothing under the crosshair yet pins the newest point. @param {KeyboardEvent} e @param {ChartPoint[]} pts */
    keyPin(e: KeyboardEvent, pts: ChartPoint[]): void;
    /** @param {KeyboardEvent} e */
    keyLetGo(e: KeyboardEvent): void;
    /** Move the crosshair to reading `k`, within the window on view (a zoom keeps the crosshair inside it). @param {ChartPoint[]} pts @param {number} k */
    keyMove(pts: ChartPoint[], k: number): void;
    onFocus(): void;
    /** Into the pinned tooltip (its ✕, an event's link) the reading stays. @param {FocusEvent} e */
    onBlur(e: FocusEvent): void;
}
