import { HoverCardShow } from './show.js';
export declare class HoverCardTouch extends HoverCardShow {
    /** Whether a tap on this anchor is the anchor's own (a link, a button, a field). @param {HTMLElement} anchor */
    isControl(anchor: HTMLElement): boolean;
    /** What a tap on this anchor does: `tap` opens the card, `off` leaves the anchor alone. @param {HTMLElement} anchor */
    touchMode(anchor: HTMLElement): "off" | "tap";
    /** A tap outside the card and its anchor closes it, before the tap does anything else. @param {PointerEvent} event */
    onTouchDown(event: PointerEvent): void;
    /** A tap on an anchor opens the card, or closes it when it is the open one. @param {MouseEvent} event */
    onTap(event: MouseEvent): void;
}
