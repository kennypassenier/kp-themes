/**
 * Scroll the nearest scrollable ancestor of `el` so `el` is visible, and
 * nothing above it: the window and any outer scroller stay where they are.
 * Unlike `Element.scrollIntoView`, which always propagates to every
 * ancestor, this sets `scrollTop` on one container only.
 *
 * @param {Element} el
 * @param {'nearest' | 'start' | 'center' | 'end'} [block]
 */
export declare function scrollWithin(el: Element, block?: 'nearest' | 'start' | 'center' | 'end'): void;
