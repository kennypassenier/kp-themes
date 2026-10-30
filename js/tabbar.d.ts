export { TABBAR, TABBAR_HEIGHT_PROPERTY, setTabbarBadge, setTabbarCurrent, setTabbarBusy } from './tabbar/badge.js';
export { TAB, TAB_COUNT_TONES, TAB_COUNT_EVENT, drawTabCount, setTabCount } from './tabbar/count.js';
export { attachTabCounts } from './tabbar/count-watch.js';
export type TabCountTone = 'neutral' | 'info' | 'success' | 'warning' | 'error';
/** @typedef {'neutral' | 'info' | 'success' | 'warning' | 'error'} TabCountTone */
/**
 * Wire every tab bar under `root`. Idempotent.
 *
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachTabbars(root?: ParentNode): () => void;
