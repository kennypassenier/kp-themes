/** What each mark was last drawn from, so a mark drawn by setIdmark() is not drawn a second time by attachIdmarks(). @type {WeakMap<Element, { base: string, slot: number }>} */
export declare const DRAWN: WeakMap<Element, {
    base: string;
    slot: number;
}>;
/** What a mark is drawn from, apart from its palette slot. @param {Element} el */
export declare const baseKey: (el: Element) => string;
/**
 * Fill a mark from a name: its colour, letters, pattern and glyph. Call it
 * again with a new name; an empty name gives the quiet plate.
 * @param {HTMLElement} el a `.kp-idmark`
 * @param {string} name
 * @param {{ slot?: number, hue?: 'palette' | 'free', title?: boolean }} [options]
 *   `slot` a palette slot from idmarkColours(); `hue` defaults to the element's
 *   `data-kp-idmark-hue` ('free') else 'palette'; `title` (default true) puts
 *   the name in the element's title for a pointer
 */
export declare function setIdmark(el: HTMLElement, name: string, { slot, hue, title }?: {
    slot?: number;
    hue?: 'palette' | 'free';
    title?: boolean;
}): void;
