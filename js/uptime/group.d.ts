/**
 * The box that holds a group of strips, if this strip belongs to one: the nearest `[data-kp-uptime-group]` (`off` opts a strip
 * out), else the parent that holds two or more strips of its own, which is then marked `data-kp-uptime-group="auto"`. Strips of
 * a group that load together are covered by ONE busy card over the group, not by one card each [state-plates-1019].
 * @param {HTMLElement} el
 * @returns {Element | null}
 */
export declare function groupHost(el: HTMLElement): Element | null;
/**
 * A loading strip joins its group's busy card, opening it when it is the first, and covers the strips that load now.
 * @param {HTMLElement} el @param {Element} host @param {string} words @param {boolean} first
 * @returns {import('../busy-card.js').BusyCard}
 */
export declare function joinGroupCard(el: HTMLElement, host: Element, words: string, first: boolean): import('../busy-card.js').BusyCard;
/**
 * A strip leaves its group's loading: true when it was the last, so the shared card must close before it is drawn.
 * @param {HTMLElement} el
 * @returns {{ last: boolean, card: import('../busy-card.js').BusyCard, host: Element } | null} null for a strip with no group card
 */
export declare function leaveGroupCard(el: HTMLElement): {
    last: boolean;
    card: import('../busy-card.js').BusyCard;
    host: Element;
} | null;
/** Whether a press on a cell opens its quick info. @param {HTMLElement} el */
export declare const infoMode: (el: HTMLElement) => boolean;
