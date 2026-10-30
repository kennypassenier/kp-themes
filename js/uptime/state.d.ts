/** @typedef {import('./types.js').UptimeSpec} UptimeSpec */
export type UptimeSpec = import('./types.js').UptimeSpec;
/** What each strip was last given. @type {WeakMap<HTMLElement, UptimeSpec>} */
export declare const SPECS: WeakMap<HTMLElement, UptimeSpec>;
/** The busy card over a loading strip. @type {WeakMap<HTMLElement, import('../busy-card.js').BusyCard>} */
export declare const CARDS: WeakMap<HTMLElement, import('../busy-card.js').BusyCard>;
/** A card on its way out and the spec that waits for it. @type {WeakMap<HTMLElement, { card: import('../busy-card.js').BusyCard, spec: UptimeSpec }>} */
export declare const WAITING: WeakMap<HTMLElement, {
    card: import('../busy-card.js').BusyCard;
    spec: UptimeSpec;
}>;
/** The one busy card of a group of strips, and the strips of the group that are loading now [state-plates-1019]. @type {WeakMap<Element, { card: import('../busy-card.js').BusyCard, loading: Set<HTMLElement>, closing: boolean }>} */
export declare const GROUPS: WeakMap<Element, {
    card: import('../busy-card.js').BusyCard;
    loading: Set<HTMLElement>;
    closing: boolean;
}>;
/** The group host a loading strip shares its card with. @type {WeakMap<HTMLElement, Element>} */
export declare const GROUP_OF: WeakMap<HTMLElement, Element>;
/** Scrolling strips the reader scrolled away from the latest period. @type {WeakSet<HTMLElement>} */
export declare const UNPINNED: WeakSet<HTMLElement>;
/** Strips drawn before: a card on the first render is the page, not news. @type {WeakSet<HTMLElement>} */
export declare const DRAWN: WeakSet<HTMLElement>;
/** The open quick info of a strip, and how to shut it at once (a redraw). @type {WeakMap<HTMLElement, () => void>} */
export declare const INFO: WeakMap<HTMLElement, () => void>;
/** The mutable values the parts of this module share. */
export declare const uptimeState: {
    /** Ids for the quick-info panels. */
    infoMade: number;
};
