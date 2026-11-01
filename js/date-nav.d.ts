export { DATE_NAV, DATE_NAV_EVENT, DATE_NAV_MODES } from './date-nav/constants.js';
/**
 * Wire every date navigation under `root`. Idempotent.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachDateNavs(root?: ParentNode): () => void;
/**
 * Show a day without firing the event (the page asked); the target follows.
 * @param {Element} nav @param {string} day `YYYY-MM-DD`
 */
export declare function setDateNav(nav: Element, day: string): void;
/**
 * The range a wired navigation shows, or null.
 * @param {Element} nav
 * @returns {import('./date-nav/constants.js').DateNavRange | null}
 */
export declare function getDateNav(nav: Element): import('./date-nav/constants.js').DateNavRange | null;
