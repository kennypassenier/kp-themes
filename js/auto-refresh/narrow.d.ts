/** Written on the control while its bar is narrow; the stylesheet lays the two rows on it. */
export declare const NARROW_ATTRIBUTE = "data-kp-refresh-narrow";
/** The control's own width under which the bar is narrow [rem]. */
export declare const NARROW_AT_REM = 30;
/**
 * Is the bar narrow? Only a control without its own line, outside a form grid; `always` and `never` decide by hand, `auto` by
 * the control's width against 30rem. Pure.
 * @param {{ lineOff: boolean, inFormGrid: boolean, stack: string, width: number, rem: number }} state
 */
export declare function narrowFor({ lineOff, inFormGrid, stack, width, rem }: {
    lineOff: boolean;
    inFormGrid: boolean;
    stack: string;
    width: number;
    rem: number;
}): boolean;
/** Is the bar narrow at the control's width now? @param {HTMLElement} el */
export declare function isNarrow(el: HTMLElement): boolean;
/**
 * How far to scroll a track so an item stands in its middle: the item's offset from the track's start, less half the room
 * left beside it. The browser clamps the result at both ends. Pure.
 * @param {number} trackLeft @param {number} trackWidth @param {number} itemLeft @param {number} itemWidth
 */
export declare const centreBy: (trackLeft: number, trackWidth: number, itemLeft: number, itemWidth: number) => number;
/** The caption on the narrow bar's first row, drawn once and shown only while narrow without a title or label of the page's own. */
export declare function buildCaption(/** @type {Document} */ doc: Document): HTMLElement;
/**
 * Bring the chosen segment into the middle of a scrolling chooser, without moving the page: only the track's own scroll is set.
 * @param {HTMLElement | null} track the segmented control
 */
export declare function showChosen(track: HTMLElement | null): void;
