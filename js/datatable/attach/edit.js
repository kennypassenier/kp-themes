// In-cell editing: open, commit, undo and the app's say.
import { getStrings } from '../../strings.js';
import {
    CLEAR,
    CLEAR_SELECTION,
    COLLAPSE_ALL,
    DETAIL,
    EDIT_CELL,
    EDIT_VALUE,
    EXPAND_ALL,
    GROUP_ROW,
    GROUP_TOGGLE,
    RETRY,
    ROW_CONTROLS,
    ROW_TOGGLE,
    SORT_RESET,
} from '../selectors.js';
import { splitList } from '../filter.js';
import { attachSelect, drawsSelect } from '../../combobox.js';
import { attachDatePickers, datePicker } from '../../datepicker.js';
import { EDIT_EVENT } from '../events.js';
/** @typedef {import('../events.js').EditDetail} EditDetail */
/** @typedef {import('../events.js').EditKind} EditKind */
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * @typedef {{ row: HTMLTableRowElement, column: number, kind: EditKind, button: HTMLButtonElement, holder: HTMLElement,
 *   control: HTMLInputElement | HTMLSelectElement, error: HTMLElement, previous: string, detach: () => void, busy: boolean }} Editing
 */
/**
 * What the in-cell editing: open, commit, undo and the app's say part adds to the table's context.
 *
 * @typedef {{
 *     closeEditor: () => void;
 *     commitEdit: (save: boolean) => Promise<boolean>;
 *     editing: Editing | null;
 *     onEditorFocusOut: (event: FocusEvent) => void;
 *     onEditorKey: (event: KeyboardEvent) => void;
 *     onEditorKeyCapture: (event: KeyboardEvent) => void;
 *     onWrapClick: (event: MouseEvent) => void;
 *     openEditor: (row: HTMLTableRowElement, column: number) => Promise<void>;
 * }} EditFields
 */

/**
 * In-cell editing: open, commit, undo and the app's say.
 *
 * @param {TableContext} c
 */
export function installEdit(c) {
    const {
        actions,
        body,
        cellText,
        commitSorts,
        datePickerFor,
        editKinds,
        expandKeys,
        expandable,
        expanded,
        folded,
        groups,
        headers,
        id,
        keyOf,
        labelOf,
        labelRow,
        make,
        onClear,
        onClearSelection,
        onEdit,
        onRetry,
        setExpanded,
        setFolded,
        wrap,
    } = c;

    // ── Inline edit (#inline-edit) ─────────────────────────────────

    /** @type {Editing | null} */
    c.editing = null;
    /** @type {{ row: HTMLTableRowElement, column: number, before: string, after: string } | null} */
    let lastEdit = null;
    /** Whether the drawn list of the select being edited was open when a key went down. */
    let listWasOpen = false;
    /** @param {string} text @param {{ undo?: boolean }} [options] */
    const logEdit = (text, { undo: withUndo = false } = {}) => {
        if (c.editLog === null) return;
        c.editLog.textContent = text;
        if (!withUndo) return;
        const button = /** @type {HTMLButtonElement} */ (make('button', 'kp-button kp-button--ghost kp-button--sm'));
        button.type = 'button';
        button.dataset.kpDatatableUndo = '';
        button.textContent = getStrings().undo;
        c.editLog.append(' ', button);
    };
    /** Write a saved value into its cell, into the badge or the element that held the text. @param {HTMLTableCellElement} cell @param {string} value */
    const writeCell = (cell, value) => {
        const holder = /** @type {HTMLElement} */ (cell.querySelector(EDIT_VALUE) ?? cell);
        const only = holder.children.length === 1 && holder.children[0]?.children.length === 0 ? holder.children[0] : null;
        if (only !== null && (holder.textContent ?? '').trim() === (only.textContent ?? '').trim()) only.textContent = value;
        else holder.textContent = value;
    };
    const closeEditor = () => {
        if (c.editing === null) return;
        const current = c.editing;
        c.editing = null;
        current.detach();
        current.holder.remove();
        current.button.hidden = false;
        c.grid?.sync();
    };
    c.closeEditor = closeEditor;
    /** @param {HTMLTableRowElement} row @param {number} column */
    const openEditor = async (row, column) => {
        if (c.editing !== null && !(await commitEdit(true))) return;
        const kind = editKinds[column];
        const cell = row.cells[column];
        const button = /** @type {HTMLButtonElement | null} */ (cell?.querySelector(EDIT_CELL) ?? null);
        if (kind === null || kind === undefined || cell === undefined || button === null) return;
        const s = getStrings();
        const header = headers[column];
        const key = keyOf(row);
        const previous = cellText(row, column);
        const holder = make('div', 'kp-datatable__editor');
        holder.dataset.kpDatatableEditorWrap = '';
        holder.setAttribute('data-density', 'compact');
        const errorId = `${id}-edit-error`;
        const error = make('p', 'kp-field__error');
        error.id = errorId;
        error.hidden = true;
        /** @type {HTMLInputElement | HTMLSelectElement} */
        let control;
        /** @type {() => void} */
        let detachControl = () => {};
        if (kind === 'select') {
            const select = /** @type {HTMLSelectElement} */ (make('select', 'kp-field__input'));
            const declared = splitList(header?.dataset.kpEditOptions);
            const values = declared.length > 0 ? declared : [...new Set(c.all.map((r) => cellText(r, column)).filter((v) => v !== ''))];
            if (!values.includes(previous)) values.unshift(previous);
            for (const value of values) {
                const option = /** @type {HTMLOptionElement} */ (make('option'));
                option.value = value;
                option.textContent = value;
                select.append(option);
            }
            select.value = previous;
            control = select;
            holder.append(select);
        } else {
            const input = /** @type {HTMLInputElement} */ (make('input', 'kp-field__input'));
            input.value = kind === 'date' ? '' : previous;
            if (kind === 'number') {
                input.type = 'number';
                if (header?.dataset.kpEditMin !== undefined) input.min = header.dataset.kpEditMin;
                if (header?.dataset.kpEditMax !== undefined) input.max = header.dataset.kpEditMax;
            } else if (kind === 'text') input.type = 'text';
            control = input;
            if (kind === 'date') {
                input.id = `${id}-edit-date`;
                holder.append(datePickerFor(input));
            } else holder.append(input);
        }
        control.dataset.kpDatatableEditor = '';
        control.setAttribute('aria-label', s.tableEditField(labelOf(column), key));
        control.setAttribute('aria-describedby', errorId);
        if (header?.dataset.kpEditRequired !== undefined) control.setAttribute('aria-required', 'true');
        holder.append(error);
        button.hidden = true;
        cell.append(holder);
        if (kind === 'select' && drawsSelect(control)) detachControl = attachSelect(/** @type {HTMLSelectElement} */ (control));
        if (kind === 'date') {
            const detachPickers = attachDatePickers(holder);
            const picker = holder.querySelector('[data-kp-datepicker]');
            const handle = picker === null ? null : datePicker(picker);
            if (previous !== '') handle?.set(previous);
            detachControl = detachPickers;
        }
        c.editing = { row, column, kind, button, holder, control, error, previous, detach: detachControl, busy: false };
        control.focus();
        if (control instanceof HTMLInputElement && kind !== 'date') control.select();
        logEdit(s.tableEditing(labelOf(column), key));
    };
    c.openEditor = openEditor;
    /** @param {string} message */
    const refuse = (message) => {
        if (c.editing === null) return;
        c.editing.error.textContent = message;
        c.editing.error.hidden = false;
        c.editing.control.setAttribute('aria-invalid', 'true');
        c.editing.control.focus();
    };
    /**
     * Tell the app about a change and wait for its answer: null when it
     * accepts, the message when it refuses.
     *
     * @param {HTMLTableRowElement} row @param {number} column @param {string} value @param {string} previous @param {boolean} isUndo
     * @returns {Promise<string | null>}
     */
    const askApp = async (row, column, value, previous, isUndo) => {
        const s = getStrings();
        /** @type {string | null} */
        let refused = null;
        /** @type {Promise<unknown>[]} */
        const waits = [];
        /** @type {EditDetail} */
        const detail = {
            key: keyOf(row),
            row,
            cell: /** @type {HTMLTableCellElement} */ (row.cells[column]),
            column,
            label: labelOf(column),
            value,
            previous,
            undo: isUndo,
            reject: (message) => {
                refused = message ?? s.tableEditInvalid;
            },
            waitUntil: (promise) => {
                waits.push(promise);
            },
        };
        const event = new CustomEvent(EDIT_EVENT, { bubbles: true, cancelable: true, detail });
        wrap.dispatchEvent(event);
        if (event.defaultPrevented && refused === null) refused = s.tableEditInvalid;
        if (onEdit !== undefined) waits.push(Promise.resolve().then(() => onEdit(detail)));
        if (refused === null && waits.length > 0) {
            try {
                for (const answer of await Promise.all(waits)) {
                    if (typeof answer === 'string') refused = answer;
                    else if (answer === false) refused = s.tableEditInvalid;
                }
            } catch (error) {
                refused = error instanceof Error && error.message !== '' ? error.message : s.tableEditInvalid;
            }
        }
        return refused;
    };
    /** @param {boolean} save @returns {Promise<boolean>} whether the editor closed */
    const commitEdit = async (save) => {
        const current = c.editing;
        if (current === null) return true;
        if (current.busy) return false;
        const s = getStrings();
        const { row, column, kind, button, control, previous } = current;
        const key = keyOf(row);
        if (!save) {
            closeEditor();
            logEdit(s.tableEditCancelled);
            button.focus();
            return true;
        }
        const value =
            kind === 'date' ? (control.dataset.kpDateValue ?? (control.value.trim() === '' ? '' : control.value.trim())) : control.value.trim();
        if (value === '' && headers[column]?.dataset.kpEditRequired !== undefined) {
            refuse(s.tableEditRequired);
            return false;
        }
        if (kind === 'number' && value !== '' && Number.isNaN(Number(value))) {
            refuse(s.tableEditInvalid);
            return false;
        }
        if (value === previous) {
            closeEditor();
            button.focus();
            return true;
        }
        current.busy = true;
        const refused = await askApp(row, column, value, previous, false);
        current.busy = false;
        if (c.editing !== current) return true;
        if (refused !== null) {
            refuse(refused);
            return false;
        }
        const cell = /** @type {HTMLTableCellElement} */ (row.cells[column]);
        writeCell(cell, value);
        closeEditor();
        lastEdit = { row, column, before: previous, after: value };
        labelRow(row);
        logEdit(s.tableEdited(key, labelOf(column), previous, value), { undo: true });
        button.focus();
        return true;
    };
    c.commitEdit = commitEdit;
    const undoEdit = async () => {
        const last = lastEdit;
        if (last === null) return;
        const s = getStrings();
        const refused = await askApp(last.row, last.column, last.before, last.after, true);
        if (refused !== null) {
            logEdit(refused);
            return;
        }
        lastEdit = null;
        writeCell(/** @type {HTMLTableCellElement} */ (last.row.cells[last.column]), last.before);
        labelRow(last.row);
        logEdit(s.tableEditUndone(keyOf(last.row), labelOf(last.column), last.before));
        /** @type {HTMLElement | null} */ (last.row.cells[last.column]?.querySelector(EDIT_CELL) ?? null)?.focus();
    };
    /** @param {KeyboardEvent} event */
    const onEditorKeyCapture = (event) => {
        const target = /** @type {HTMLElement} */ (event.target);
        if (target.matches('select[data-kp-datatable-editor]')) listWasOpen = target.getAttribute('aria-expanded') === 'true';
    };
    c.onEditorKeyCapture = onEditorKeyCapture;
    /** @param {KeyboardEvent} event */
    const onEditorKey = (event) => {
        const target = /** @type {HTMLElement} */ (event.target);
        if (c.editing === null || !target.matches('[data-kp-datatable-editor]')) return;
        const isSelect = target instanceof HTMLSelectElement;
        if (event.key === 'Enter') {
            event.preventDefault();
            // Enter on a closed drawn list only opened it; Enter on an open
            // list took the highlighted option, and that is the save.
            if (!isSelect || listWasOpen || !drawsSelect(target)) void commitEdit(true);
        } else if (event.key === 'Escape') {
            const panelOpen = c.editing.holder.querySelector('[data-kp-date-panel]:not([hidden])') !== null;
            if ((isSelect && listWasOpen) || panelOpen) return;
            event.preventDefault();
            void commitEdit(false);
        }
    };
    c.onEditorKey = onEditorKey;
    /** Saving on blur, after the click that caused it has been handled. @param {FocusEvent} event */
    const onEditorFocusOut = (event) => {
        if (c.editing === null || !c.editing.holder.contains(/** @type {Node} */ (event.target))) return;
        const current = c.editing;
        setTimeout(() => {
            if (c.editing !== current || current.busy) return;
            if (current.holder.contains(document.activeElement)) return;
            void commitEdit(true);
        }, 0);
    };
    c.onEditorFocusOut = onEditorFocusOut;
    /** @param {MouseEvent} event */
    const onWrapClick = (event) => {
        const target = /** @type {HTMLElement} */ (event.target);
        if (target.closest(CLEAR_SELECTION) !== null && actions?.contains(target)) onClearSelection();
        if (target.closest(CLEAR) !== null && c.empty?.contains(target)) onClear();
        if (target.closest(RETRY) !== null && c.failedSlot?.contains(target)) onRetry();
        if (target.closest(SORT_RESET) !== null) commitSorts(c.initialSorts.map((key) => ({ ...key })));
        if (target.closest(EXPAND_ALL) !== null)
            expandKeys([...new Set([...expanded, ...c.pageRows.filter((row) => row.querySelector(ROW_TOGGLE) !== null).map(keyOf)])]);
        if (target.closest(COLLAPSE_ALL) !== null) expandKeys([]);
        if (target.closest('[data-kp-datatable-undo]') !== null && c.editLog?.contains(target)) void undoEdit();
        const groupRow = /** @type {HTMLTableRowElement | null} */ (target.closest(GROUP_ROW));
        if (groupRow !== null && groupRow.parentElement === body && groups.get(groupRow.dataset.kpRowGroup ?? '') === groupRow) {
            // A group row folds from its toggle, or from a click anywhere
            // in it that is not on a control of its own or a selection [J2].
            const groupToggle = target.closest(GROUP_TOGGLE);
            const interactive = target.closest(ROW_CONTROLS);
            const control = interactive !== null && !interactive.matches('td, th, tr') ? interactive : null;
            const selecting = (window.getSelection?.()?.toString() ?? '') !== '';
            if (groupToggle !== null || ((control === null || !groupRow.contains(control)) && !selecting)) {
                const key = groupRow.dataset.kpRowGroup ?? '';
                setFolded(key, !folded.has(key));
                if (groupToggle !== null) /** @type {HTMLElement | null} */ (groupRow.querySelector(GROUP_TOGGLE))?.focus();
            }
        }
        const rowToggle = /** @type {HTMLElement | null} */ (target.closest(ROW_TOGGLE));
        if (rowToggle !== null && body.contains(rowToggle)) {
            const row = /** @type {HTMLTableRowElement} */ (rowToggle.closest('tr'));
            setExpanded(row, !expanded.has(keyOf(row)));
            /** @type {HTMLElement | null} */ (row.querySelector(ROW_TOGGLE))?.focus();
        } else if (expandable && body.contains(target)) {
            // A click anywhere in an expandable row opens or closes it, as
            // its toggle does (Kenny, 2026-10-02: "als we ergens in die rij
            // klikken, niet enkel op dat icoon"); not one on a control in
            // the row, which does its own thing, and not one that ends a
            // text selection.
            const row = /** @type {HTMLTableRowElement | null} */ (target.closest('tr'));
            // A cell or row the keyboard grid made focusable is not a
            // control of its own.
            const interactive = target.closest(ROW_CONTROLS);
            const control = interactive !== null && !interactive.matches('td, th, tr') ? interactive : null;
            const selecting = (window.getSelection?.()?.toString() ?? '') !== '';
            if (
                row !== null &&
                row.parentElement === body &&
                !row.matches(DETAIL) &&
                !row.matches(GROUP_ROW) &&
                row.querySelector(ROW_TOGGLE) !== null &&
                (control === null || !row.contains(control)) &&
                !selecting
            ) {
                setExpanded(row, !expanded.has(keyOf(row)));
            }
        }
        const editButton = /** @type {HTMLElement | null} */ (target.closest(EDIT_CELL));
        if (editButton !== null && body.contains(editButton)) {
            const cell = /** @type {HTMLTableCellElement} */ (editButton.closest('td, th'));
            void openEditor(/** @type {HTMLTableRowElement} */ (cell.parentElement), cell.cellIndex);
        }
    };
    c.onWrapClick = onWrapClick;
}
