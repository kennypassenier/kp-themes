// Row selection: focus memory, announcements and the select-all.
import { GROUP_ROW, GROUP_TOGGLE, ROW_TOGGLE, SELECT_ROW } from '../selectors.js';
import { SELECT_EVENT } from '../events.js';
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * The row toggle or group toggle that holds the focus, by key, so a
 * refresh after the consumer replaced its row can give the focus to
 * the new row's toggle [R-LIVE].
 * @typedef {{ element: HTMLElement, selector: string, key: string | null, group: string | null }} FocusMemo
 */
/**
 * What the row selection: focus memory, announcements and the select-all part adds to the table's context.
 *
 * @typedef {{
 *     focusMemo: FocusMemo | null;
 *     onBodyChange: (event: Event) => void;
 *     onBodyFocusIn: (event: FocusEvent) => void;
 *     onBodyFocusOut: (event: FocusEvent) => void;
 *     onClearSelection: () => void;
 *     onSelectAll: () => void;
 *     select: (keys: readonly string[]) => void;
 *     toggleMemo: (element: HTMLElement) => FocusMemo | null;
 * }} SelectionFields
 */

/**
 * Row selection: focus memory, announcements and the select-all.
 *
 * @param {TableContext} c
 */
export function installSelection(c) {
    const { keyOf, selectAll, selectedRows, serverMode, serverSelection, syncActions, syncSelectAll, wrap } = c;

    /** @param {HTMLElement} element @returns {FocusMemo | null} */
    const toggleMemo = (element) => {
        const selector = element.matches(ROW_TOGGLE) ? ROW_TOGGLE : element.matches(GROUP_TOGGLE) ? GROUP_TOGGLE : null;
        const row = /** @type {HTMLTableRowElement | null} */ (element.closest('tr'));
        if (selector === null || row === null) return null;
        const isGroup = row.matches(GROUP_ROW);
        return { element, selector, key: isGroup ? null : keyOf(row), group: isGroup ? (row.dataset.kpRowGroup ?? null) : null };
    };
    c.toggleMemo = toggleMemo;
    /** @type {FocusMemo | null} */
    c.focusMemo = null;
    /** @param {FocusEvent} event */
    const onBodyFocusIn = (event) => {
        c.focusMemo = event.target instanceof HTMLElement ? toggleMemo(event.target) : null;
    };
    c.onBodyFocusIn = onBodyFocusIn;
    /** Focus that moved on, while the toggle is still in the page, is the reader's choice: forget it. @param {FocusEvent} event */
    const onBodyFocusOut = (event) => {
        if (c.focusMemo !== null && event.target === c.focusMemo.element && c.focusMemo.element.isConnected) c.focusMemo = null;
    };
    c.onBodyFocusOut = onBodyFocusOut;
    const announceSelection = () => {
        const rows = selectedRows();
        const keys = rows.map(keyOf);
        wrap.dispatchEvent(new CustomEvent(SELECT_EVENT, { bubbles: true, detail: { keys, rows } }));
    };
    /** @param {Event} event */
    const onBodyChange = (event) => {
        const target = /** @type {HTMLElement} */ (event.target);
        if (!target.matches(SELECT_ROW)) return;
        if (serverMode) {
            const row = target.closest('tr');
            if (row !== null) {
                if (/** @type {HTMLInputElement} */ (target).checked) serverSelection.add(keyOf(row));
                else serverSelection.delete(keyOf(row));
            }
        }
        syncSelectAll();
        syncActions();
        announceSelection();
    };
    c.onBodyChange = onBodyChange;
    const onSelectAll = () => {
        if (selectAll === null) return;
        // The page, and only the page [gap-13]: ticking rows on pages
        // nobody has looked at is how a bulk action reaches rows its
        // user never saw.
        for (const row of c.pageRows) {
            const box = /** @type {HTMLInputElement | null} */ (row.querySelector(SELECT_ROW));
            if (box !== null) box.checked = selectAll.checked;
            if (serverMode) {
                if (selectAll.checked) serverSelection.add(keyOf(row));
                else serverSelection.delete(keyOf(row));
            }
        }
        selectAll.indeterminate = false;
        syncActions();
        announceSelection();
    };
    c.onSelectAll = onSelectAll;
    /** @param {readonly string[]} keys */
    const select = (keys) => {
        const want = new Set(keys);
        if (serverMode) {
            serverSelection.clear();
            for (const key of keys) serverSelection.add(key);
        }
        for (const row of c.all) {
            const box = /** @type {HTMLInputElement | null} */ (row.querySelector(SELECT_ROW));
            if (box !== null) box.checked = want.has(keyOf(row));
        }
        syncSelectAll();
        syncActions();
        announceSelection();
    };
    c.select = select;
    const onClearSelection = () => select([]);
    c.onClearSelection = onClearSelection;
}
