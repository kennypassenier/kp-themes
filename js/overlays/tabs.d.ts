/**
 * Select a tab in an attached tab list from outside — for a "next" button,
 * a URL hash, or a restored view.
 *
 * @param {Element} list the `[role="tablist"]`
 * @param {number | string} which an index, or a tab's id
 */
export declare function selectTab(list: Element, which: number | string): void;
/**
 * Scroll a tab row, and only the row, until `tab` is inside it [gap-12].
 *
 * A row longer than its box scrolls (css/components.css), and a selected
 * tab scrolled out of sight is a selection nobody can see. Not
 * `scrollIntoView`: that scrolls every ancestor too, and a tab changed from
 * a "next" button would pull the whole page to the row.
 *
 * @param {Element} list the `[role="tablist"]`
 * @param {Element | undefined} tab
 */
export declare function revealTab(list: Element, tab: Element | undefined): void;
/**
 * Keep `data-kp-tabs-overflow` on a tab row exactly while its tabs are
 * wider than the row [gap-12]. The stylesheet scrolls only such a row, so a
 * row that fits keeps every pixel a register draws past its edge.
 *
 * @param {HTMLElement} list the `[role="tablist"]`
 * @param {() => Element | undefined} selected the tab to keep in view when the row starts to scroll
 * @returns {() => void} stop, which also takes the attribute away
 */
export declare function watchTabOverflow(list: HTMLElement, selected: () => Element | undefined): () => void;
/**
 * Tabs: one stop in the tab order, arrows to move between them.
 *
 * This is the ARIA authoring practice, and it is genuinely not free: a
 * tab list where every tab is a tab stop makes a keyboard user press Tab
 * seven times to leave a row of tabs.
 *
 * Options, each also readable from the list's own attributes so a
 * server-written page needs no JavaScript to set them:
 *   - `aria-orientation="vertical"` → Up/Down move instead of Left/Right
 *   - `data-kp-activation="manual"` → arrows move focus only; Enter or
 *     Space selects. The other half of the ARIA practice, for a panel
 *     that is expensive to show.
 *   - `data-kp-loop="false"` → no wrap-around at the ends
 *
 * @param {ParentNode} root
 * @param {{ activation?: 'automatic' | 'manual', loop?: boolean }} [options] defaults for lists that say nothing
 * @returns {() => void} detach
 */
export declare function attachTabs(root?: ParentNode, { activation, loop }?: {
    activation?: 'automatic' | 'manual';
    loop?: boolean;
}): () => void;
