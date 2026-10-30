// Tabs: selecting, revealing, the overflow and the attach.
import { leave, leavesState } from '../motion.js';
import { TABS_OVERFLOW, TAB_CHANGE_EVENT } from './constants.js';

/**
 * Select a tab in an attached tab list from outside — for a "next" button,
 * a URL hash, or a restored view.
 *
 * @param {Element} list the `[role="tablist"]`
 * @param {number | string} which an index, or a tab's id
 */
export function selectTab(list, which) {
    const handle = handles.get(list);
    if (handle === undefined) return;
    const tabs = handle.tabs();
    const index = typeof which === 'number' ? which : tabs.findIndex((t) => t.id === which);
    if (index >= 0 && index < tabs.length) handle.select(index, { focus: false });
}

/** @type {WeakMap<Element, { tabs: () => HTMLElement[], select: (index: number, options?: { focus?: boolean }) => void }>} */
const handles = new WeakMap();

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
export function revealTab(list, tab) {
    if (tab === undefined || list.scrollWidth <= list.clientWidth) return;
    const row = list.getBoundingClientRect();
    const box = tab.getBoundingClientRect();
    if (box.left < row.left) list.scrollLeft -= row.left - box.left;
    else if (box.right > row.right) list.scrollLeft += box.right - row.right;
}

/**
 * Keep `data-kp-tabs-overflow` on a tab row exactly while its tabs are
 * wider than the row [gap-12]. The stylesheet scrolls only such a row, so a
 * row that fits keeps every pixel a register draws past its edge.
 *
 * @param {HTMLElement} list the `[role="tablist"]`
 * @param {() => Element | undefined} selected the tab to keep in view when the row starts to scroll
 * @returns {() => void} stop, which also takes the attribute away
 */
export function watchTabOverflow(list, selected) {
    const measure = () => {
        const over = list.scrollWidth > list.clientWidth + 1;
        if (over === list.hasAttribute(TABS_OVERFLOW)) return;
        list.toggleAttribute(TABS_OVERFLOW, over);
        if (over) revealTab(list, selected());
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return () => list.removeAttribute(TABS_OVERFLOW);
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    for (const tab of list.children) observer.observe(tab);
    return () => {
        observer.disconnect();
        list.removeAttribute(TABS_OVERFLOW);
    };
}

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
export function attachTabs(root = document, { activation = 'automatic', loop = true } = {}) {
    /** @type {(() => void)[]} */
    const cleanups = [];

    for (const el of root.querySelectorAll('[role="tablist"]')) {
        const list = /** @type {HTMLElement} */ (el);
        if (list.dataset.kpTabsAttached !== undefined) continue;
        const tabs = () => [.../** @type {NodeListOf<HTMLElement>} */ (list.querySelectorAll('[role="tab"]'))];
        if (tabs().length === 0) continue;
        list.dataset.kpTabsAttached = '';

        const manual = (list.dataset.kpActivation ?? activation) === 'manual';
        const wraps = list.dataset.kpLoop === undefined ? loop : list.dataset.kpLoop !== 'false';
        const vertical = list.getAttribute('aria-orientation') === 'vertical';

        /** What attach changed, so detach can put it back. */
        const before = tabs().map((tab) => ({
            tab,
            tabIndex: tab.getAttribute('tabindex'),
            selected: tab.getAttribute('aria-selected'),
            panel: document.getElementById(tab.getAttribute('aria-controls') ?? ''),
            hidden: document.getElementById(tab.getAttribute('aria-controls') ?? '')?.hidden ?? false,
        }));

        /** The panels on their way out, and the switch that sent them. */
        /** @type {Map<HTMLElement, Promise<void>>} */
        const leaving = new Map();
        let turn = 0;
        /** @param {number} index @param {{ focus?: boolean }} [options] */
        const select = (index, { focus = true } = {}) => {
            const all = tabs();
            const previous = all.findIndex((t) => t.getAttribute('aria-selected') === 'true');
            /** @type {HTMLElement | null} */
            let shown = null;
            /** @type {Promise<void>[]} */
            const going = [];
            all.forEach((tab, i) => {
                const selected = i === index;
                tab.setAttribute('aria-selected', String(selected));
                tab.tabIndex = selected ? 0 : -1;
                const panel = document.getElementById(tab.getAttribute('aria-controls') ?? '');
                if (!panel) return;
                if (selected) shown = panel;
                else if (leaving.has(panel)) going.push(/** @type {Promise<void>} */ (leaving.get(panel)));
                else if (!panel.hidden) {
                    // The outgoing panel leaves the theme's way, its space
                    // folding shut, and the new one arrives once it is gone
                    // (as a leave turned around): so a switch is one panel's
                    // exit followed by the other's entrance, never a jump.
                    const gone = leave(panel, { hide: true }).finally(() => leaving.delete(panel));
                    leaving.set(panel, gone);
                    going.push(gone);
                }
            });
            const mine = ++turn;
            const show = /** @type {HTMLElement | null} */ (shown);
            if (show) {
                // Still on its way out: it comes back once its leave is over.
                const back = leaving.get(show);
                if (back) going.push(back);
                if (going.length === 0) show.hidden = false;
                // A theme that lets states leave first (leavesState()) lets
                // the new panel grow while the old one withers, one picture
                // in one time, instead of one after the other.
                else if (!back && leavesState(show)) {
                    // Marked for the arrival that follows: a theme that folds in
                    // whole ticks (`--kp-swap-fold-ease`) shifts the new panel's
                    // fold one tick against the old one's, so the two always add
                    // up to the one panel and the box does not move.
                    show.setAttribute('data-kp-tabs-swapping', '');
                    setTimeout(() => show.removeAttribute('data-kp-tabs-swapping'), 400);
                    show.hidden = false;
                } else {
                    if (!back) show.hidden = true;
                    void Promise.all(going).then(() => {
                        if (turn === mine) show.hidden = false;
                    });
                }
            }
            // Guarded because a caller computes this index. Found by
            // JobTracker's stricter typecheck (KT4): with
            // noUncheckedIndexedAccess an out-of-range index is a type
            // error here, and in a browser it is a thrown TypeError that
            // stops the key handler.
            if (focus) all[index]?.focus();
            revealTab(list, all[index]);
            if (previous !== index) {
                const tab = all[index];
                list.dispatchEvent(
                    new CustomEvent(TAB_CHANGE_EVENT, {
                        bubbles: true,
                        detail: { index, tab, panel: document.getElementById(tab?.getAttribute('aria-controls') ?? ''), previous },
                    }),
                );
            }
        };

        /** Manual activation moves focus without selecting. @param {number} index */
        const roam = (index) => {
            const all = tabs();
            all.forEach((tab, i) => {
                tab.tabIndex = i === index ? 0 : -1;
            });
            all[index]?.focus();
        };

        /** @param {KeyboardEvent} e */
        const onKey = (e) => {
            const all = tabs();
            const current = all.indexOf(/** @type {HTMLElement} */ (document.activeElement));
            if (current === -1) return;
            const next = vertical ? 'ArrowDown' : 'ArrowRight';
            const prev = vertical ? 'ArrowUp' : 'ArrowLeft';
            if (manual && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                select(current);
                return;
            }
            const move = { [next]: 1, [prev]: -1, Home: -current, End: all.length - 1 - current }[e.key];
            if (move === undefined) return;
            e.preventDefault();
            let target = current + move;
            if (wraps) target = (target + all.length) % all.length;
            else target = Math.max(0, Math.min(all.length - 1, target));
            if (manual) roam(target);
            else select(target);
        };

        /** @param {Event} e */
        const onClick = (e) => {
            const tab = /** @type {HTMLElement} */ (e.target).closest('[role="tab"]');
            if (tab) select(tabs().indexOf(/** @type {HTMLElement} */ (tab)));
        };

        // The initial state comes from the markup, so a page that renders
        // the second tab selected keeps it after this runs.
        const initial = Math.max(
            0,
            tabs().findIndex((t) => t.getAttribute('aria-selected') === 'true'),
        );
        tabs().forEach((tab, i) => {
            tab.tabIndex = i === initial ? 0 : -1;
        });
        const stopWatching = watchTabOverflow(list, () => tabs().find((t) => t.getAttribute('aria-selected') === 'true'));
        revealTab(list, tabs()[initial]);

        list.addEventListener('keydown', onKey);
        list.addEventListener('click', onClick);
        handles.set(list, { tabs, select });
        cleanups.push(() => {
            list.removeEventListener('keydown', onKey);
            list.removeEventListener('click', onClick);
            stopWatching();
            handles.delete(list);
            delete list.dataset.kpTabsAttached;
            for (const b of before) {
                if (b.tabIndex === null) b.tab.removeAttribute('tabindex');
                else b.tab.setAttribute('tabindex', b.tabIndex);
                if (b.selected === null) b.tab.removeAttribute('aria-selected');
                else b.tab.setAttribute('aria-selected', b.selected);
                if (b.panel) b.panel.hidden = b.hidden;
            }
        });
    }

    return () => {
        for (const c of cleanups) c();
    };
}
