export { HOVERCARD_ATTRIBUTE, HOVERCARD_CARD, HOVERCARD_EVENT } from './hovercard/values.js';
export type HoverCardContent = string | Node | readonly Node[] | null | undefined | false;
export type HoverCardOptions = {
    /**
     * What an anchor is. Default `[data-kp-hovercard]`; per call.
     */
    selector?: string;
    /**
     * Runs when the card is about to open or to move to another anchor; the words for this anchor right now.
     */
    fill?: (anchor: HTMLElement, card: HTMLElement) => HoverCardContent;
    /**
     * Pointer only; keyboard focus opens at once. Default 300. Per anchor `data-kp-open-delay`.
     */
    openDelayMs?: number;
    /**
     * Default 100. Per anchor `data-kp-close-delay`.
     */
    closeDelayMs?: number;
    /**
     * Default true. Per anchor `data-kp-close-on-escape="false"`.
     */
    closeOnEscape?: boolean;
    /**
     * A tap opens and closes the card. Default true; per anchor `data-kp-touch="off" | "tap"`.
     */
    touch?: boolean;
    /**
     * A class added to the card, for a page's own measure (it lives in <body>).
     */
    cardClass?: string;
};
export type HoverCardHandle = (() => void) & {
    card: HTMLElement;
    open: (anchor: HTMLElement) => void;
    hide: () => void;
    refresh: () => void;
    anchor: () => HTMLElement | null;
};
/** @typedef {string | Node | readonly Node[] | null | undefined | false} HoverCardContent */
/**
 * @typedef {object} HoverCardOptions
 * @property {string} [selector]       What an anchor is. Default `[data-kp-hovercard]`; per call.
 * @property {(anchor: HTMLElement, card: HTMLElement) => HoverCardContent} [fill]
 *   Runs when the card is about to open or to move to another anchor; the words for this anchor right now.
 * @property {number} [openDelayMs]    Pointer only; keyboard focus opens at once. Default 300. Per anchor `data-kp-open-delay`.
 * @property {number} [closeDelayMs]   Default 100. Per anchor `data-kp-close-delay`.
 * @property {boolean} [closeOnEscape] Default true. Per anchor `data-kp-close-on-escape="false"`.
 * @property {boolean} [touch]           A tap opens and closes the card. Default true; per anchor `data-kp-touch="off" | "tap"`.
 * @property {string} [cardClass]      A class added to the card, for a page's own measure (it lives in <body>).
 */
/**
 * @typedef {(() => void) & { card: HTMLElement, open: (anchor: HTMLElement) => void, hide: () => void, refresh: () => void, anchor: () => HTMLElement | null }} HoverCardHandle
 * `card` is the shared node, `open(anchor)` opens it for an anchor at once, `hide()` closes it now, `refresh()` fills it
 * again for the open anchor (data that changed under the pointer),
 * `anchor()` is the anchor it is open for.
 */
/**
 * Attach the page's hover card to `root`.
 *
 * @param {Document | Element} [root]
 * @param {HoverCardOptions} [options]
 * @returns {HoverCardHandle} detach, with the handle's members on it
 */
export declare function attachHoverCards(root?: Document | Element, options?: HoverCardOptions): HoverCardHandle;
