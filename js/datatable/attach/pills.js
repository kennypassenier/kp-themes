// The filter pills, the add menu and the filter editor.
import { getStrings } from '../../strings.js';
import { filterPillLabel, filterPills, readFilterBounds } from '../filter.js';
import { CHECK_CLASS } from '../selectors.js';
import { attachDatePickers, datePicker } from '../../datepicker.js';
/** @typedef {import('../events.js').FilterKind} FilterKind */
/** @typedef {import('../events.js').FilterValue} FilterValue */
/** @typedef {import('../../strings/types.js').Strings} Strings */
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * What the the filter pills, the add menu and the filter editor part adds to the table's context.
 *
 * @typedef {{
 *     closeFilterEditor: (focus?: boolean) => void;
 *     onAddMenuClick: (event: MouseEvent) => void;
 *     onAddMenuKey: (event: KeyboardEvent) => void;
 *     onAddToggle: (event: Event) => void;
 *     onEditorClick: (event: MouseEvent) => void;
 *     onEditorKeydown: (event: KeyboardEvent) => void;
 *     onEditorSubmit: (event: SubmitEvent) => void;
 *     onPillsClick: (event: MouseEvent) => void;
 *     openFilterEditor: (at: number, returnTo: number | null) => void;
 *     renderPills: () => void;
 * }} PillsFields
 */

/**
 * The filter pills, the add menu and the filter editor.
 *
 * @param {TableContext} c
 */
export function installPills(c) {
    const {
        addMode,
        choiceValues,
        clearButton,
        datePickerFor,
        filterColumns,
        filterKinds,
        filters,
        id,
        labelOf,
        locale,
        make,
        pillsList,
        removeGlyph,
    } = c;

    const renderPills = () => {
        if (c.pills === null) return;
        const s = getStrings();
        const list = pillsList;
        list.textContent = '';
        list.setAttribute('aria-label', s.tableActiveFilters);
        if (addMode) {
            renderAddPills(s);
            return;
        }
        clearButton.textContent = s.tableClearFilters;
        let count = 0;
        for (const at of filterColumns) {
            const kind = /** @type {FilterKind} */ (filterKinds[at]);
            for (const pill of filterPills(kind, labelOf(at), filters.get(at), s, locale)) {
                count += 1;
                const item = make('li', 'kp-tag');
                const remove = /** @type {HTMLButtonElement} */ (make('button', 'kp-tag__remove'));
                remove.type = 'button';
                remove.setAttribute('aria-label', s.tableRemoveFilter(pill.label));
                remove.textContent = removeGlyph;
                remove.addEventListener('click', () => {
                    c.setFilter(at, pill.without ?? null);
                    const next = /** @type {HTMLElement | null} */ (c.pills?.querySelector('.kp-tag__remove') ?? null);
                    (next ?? c.toggle)?.focus();
                });
                item.append(pill.label, remove);
                list.append(item);
            }
        }
        c.pills.hidden = count === 0;
        if (c.toggle !== null) c.toggle.textContent = s.tableFilters(count);
    };
    c.renderPills = renderPills;
    // ── The add-filter mode (#filter-add) ──────────────────────────
    /** The column whose editor is open. @type {number | null} */
    let editingFilter = null;
    /** The pill the focus returns to when the editor closes; null for the add button. @type {number | null} */
    let editorReturn = null;
    let detachEditorPickers = () => {};
    /** One pill per filter, in the order the filters were added. @param {import('../../strings.js').Strings} s */
    const renderAddPills = (s) => {
        if (c.pills === null) return;
        let count = 0;
        for (const [at, value] of filters) {
            const kind = filterKinds[at];
            if (!kind) continue;
            const label = filterPillLabel(kind, labelOf(at), value, s, locale);
            if (label === null) continue;
            count += 1;
            const item = make('li', 'kp-tag');
            const edit = /** @type {HTMLButtonElement} */ (make('button', 'kp-datatable__pill-edit'));
            edit.type = 'button';
            edit.dataset.kpFilterPill = String(at);
            edit.setAttribute('aria-label', s.tableEditFilter(label));
            edit.setAttribute('aria-expanded', String(editingFilter === at));
            if (c.filterEditor !== null) edit.setAttribute('aria-controls', c.filterEditor.id);
            edit.textContent = label;
            const remove = /** @type {HTMLButtonElement} */ (make('button', 'kp-tag__remove'));
            remove.type = 'button';
            remove.dataset.kpFilterUnpill = String(at);
            remove.setAttribute('aria-label', s.tableRemoveFilter(label));
            remove.textContent = removeGlyph;
            item.append(edit, remove);
            pillsList.append(item);
        }
        c.pills.hidden = count === 0;
        clearButton.textContent = s.tableFilterClearAll;
        clearButton.hidden = count < 2;
        if (c.addButton !== null) c.addButton.textContent = s.tableAddFilter(count);
        renderAddMenu(s);
    };
    /** The menu of filterable columns; a filtered one is marked, and choosing it edits its filter. @param {import('../../strings.js').Strings} s */
    const renderAddMenu = (s) => {
        if (c.addMenu === null) return;
        const focused = /** @type {HTMLElement | null} */ (c.addMenu.querySelector(':focus'))?.dataset.kpFilterColumn;
        c.addMenu.setAttribute('aria-label', s.tableAddFilterMenu);
        c.addMenu.textContent = '';
        for (const at of filterColumns) {
            const on = filters.has(at);
            const item = make('li');
            const button = /** @type {HTMLButtonElement} */ (make('button', 'kp-menu__item kp-datatable__add-item'));
            button.type = 'button';
            button.dataset.kpFilterColumn = String(at);
            button.setAttribute('aria-label', on ? s.tableAddFilterItemActive(labelOf(at)) : s.tableAddFilterItem(labelOf(at)));
            button.append(labelOf(at));
            if (on) {
                button.dataset.kpFilterMarked = '';
                const mark = make('span', 'kp-badge');
                mark.setAttribute('aria-hidden', 'true');
                mark.textContent = s.tableFilterMarked;
                button.append(' ', mark);
            }
            item.append(button);
            c.addMenu.append(item);
            if (focused === String(at)) button.focus();
        }
    };
    /** @param {number} at @param {number | null} returnTo the pill the focus goes back to, or null for the add button */
    const openFilterEditor = (at, returnTo) => {
        const kind = filterKinds[at];
        if (c.filterEditor === null || !kind) return;
        closeFilterEditor(false);
        const s = getStrings();
        const form = c.filterEditor;
        const label = labelOf(at);
        const current = filters.get(at);
        const range = /** @type {{ from?: string, to?: string } | undefined} */ (Array.isArray(current) ? undefined : current);
        editingFilter = at;
        editorReturn = returnTo;
        form.setAttribute('aria-label', s.tableFilterEditor(label));
        form.dataset.kpFilterColumn = String(at);
        const title = make('p', 'kp-datatable__filter-editor-title');
        title.textContent = label;
        form.append(title);
        if (kind === 'choice') {
            const set = make('fieldset', 'kp-fieldset');
            const legend = make('legend', 'kp-sr-only');
            legend.textContent = s.tableFilterChoicesLegend(label);
            const choices = make('div', 'kp-datatable__filter-editor-choices');
            for (const value of choiceValues(at)) {
                const option = make('label', 'kp-field__option');
                const box = /** @type {HTMLInputElement} */ (make('input', CHECK_CLASS));
                box.type = 'checkbox';
                box.name = 'values';
                box.value = value;
                box.checked = Array.isArray(current) && current.includes(value);
                option.append(box, ` ${value}`);
                choices.append(option);
            }
            set.append(legend, choices);
            form.append(set);
        } else {
            const pair = make('div', 'kp-datatable__filter-editor-pair');
            for (const bound of /** @type {const} */ (['from', 'to'])) {
                const input = /** @type {HTMLInputElement} */ (make('input', 'kp-field__input'));
                input.id = `${id}-filter-editor-${bound}`;
                input.dataset.kpFilterBound = bound;
                input.autocomplete = 'off';
                input.setAttribute('aria-describedby', `${id}-filter-editor-error`);
                const text = /** @type {HTMLLabelElement} */ (make('label', 'kp-field__label'));
                text.htmlFor = input.id;
                text.textContent = s.tableFilterBound(kind, bound, label);
                if (kind === 'range') {
                    input.type = 'text';
                    input.inputMode = 'decimal';
                    input.value = range?.[bound] ?? '';
                    const field = make('div', 'kp-field');
                    field.append(text, input);
                    pair.append(field);
                } else {
                    // The package's date picker, the label on the row above its field.
                    const picker = datePickerFor(input);
                    picker.prepend(text);
                    pair.append(picker);
                }
            }
            form.append(pair);
        }
        const error = make('p', 'kp-field__error');
        error.id = `${id}-filter-editor-error`;
        error.dataset.kpFilterError = '';
        error.setAttribute('role', 'alert');
        error.hidden = true;
        const actions = make('div', 'kp-datatable__filter-editor-actions');
        const apply = /** @type {HTMLButtonElement} */ (make('button', 'kp-button kp-button--primary kp-button--sm'));
        apply.type = 'submit';
        apply.textContent = s.tableFilterApply;
        const cancel = /** @type {HTMLButtonElement} */ (make('button', 'kp-button kp-button--ghost kp-button--sm'));
        cancel.type = 'button';
        cancel.dataset.kpFilterCancel = '';
        cancel.textContent = s.tableFilterCancel;
        actions.append(apply, cancel);
        form.append(error, actions);
        form.hidden = false;
        if (kind === 'date') {
            detachEditorPickers = attachDatePickers(form);
            for (const bound of /** @type {const} */ (['from', 'to'])) {
                const wanted = range?.[bound] ?? '';
                const picker = form.querySelector(`[data-kp-filter-bound="${bound}"]`)?.closest('[data-kp-datepicker]');
                if (wanted !== '' && picker) datePicker(picker)?.set(wanted);
            }
        }
        renderPills();
        /** @type {HTMLElement | null} */ (form.querySelector('input'))?.focus();
    };
    c.openFilterEditor = openFilterEditor;
    /** @param {boolean} [focus] hand the focus back to the pill, or to the add button */
    const closeFilterEditor = (focus = true) => {
        if (editingFilter === null || c.filterEditor === null) return;
        detachEditorPickers();
        detachEditorPickers = () => {};
        const back = editorReturn;
        editingFilter = null;
        editorReturn = null;
        c.filterEditor.hidden = true;
        c.filterEditor.textContent = '';
        delete c.filterEditor.dataset.kpFilterColumn;
        c.filterEditor.removeAttribute('aria-label');
        renderPills();
        if (!focus) return;
        const pill = back === null ? null : /** @type {HTMLElement | null} */ (c.pills?.querySelector(`[data-kp-filter-pill="${back}"]`) ?? null);
        (pill ?? c.addButton)?.focus();
    };
    c.closeFilterEditor = closeFilterEditor;
    /** @param {SubmitEvent} event */
    const onEditorSubmit = (event) => {
        event.preventDefault();
        const at = editingFilter;
        const form = c.filterEditor;
        if (at === null || form === null) return;
        const kind = filterKinds[at];
        const s = getStrings();
        /** @type {FilterValue | null} */
        let next = null;
        if (kind === 'choice') {
            const values = [...form.querySelectorAll('input[name="values"]:checked')].map((box) => /** @type {HTMLInputElement} */ (box).value);
            next = values.length > 0 ? values : null;
        } else if (kind === 'range' || kind === 'date') {
            const read = (/** @type {'from' | 'to'} */ bound) => {
                const input = /** @type {HTMLInputElement} */ (form.querySelector(`[data-kp-filter-bound="${bound}"]`));
                return {
                    text: input.value,
                    iso: input.dataset.kpDateValue,
                    label: bound === 'from' ? s.tableFilterFrom(labelOf(at)) : s.tableFilterTo(labelOf(at)),
                };
            };
            const result = readFilterBounds(kind, { from: read('from'), to: read('to') }, s, locale);
            for (const input of form.querySelectorAll('[data-kp-filter-bound]')) input.removeAttribute('aria-invalid');
            if (result.error !== undefined) {
                const error = /** @type {HTMLElement} */ (form.querySelector('[data-kp-filter-error]'));
                error.textContent = result.error;
                error.hidden = false;
                const field = /** @type {HTMLElement} */ (form.querySelector(`[data-kp-filter-bound="${result.bound}"]`));
                field.setAttribute('aria-invalid', 'true');
                field.focus();
                return;
            }
            next = result.value;
        }
        // A filter just applied returns the focus to its own pill.
        if (next !== null) editorReturn = at;
        c.setFilter(at, next);
        closeFilterEditor(true);
    };
    c.onEditorSubmit = onEditorSubmit;
    /** @param {MouseEvent} event */
    const onEditorClick = (event) => {
        if (/** @type {HTMLElement} */ (event.target).closest('[data-kp-filter-cancel]') !== null) closeFilterEditor(true);
    };
    c.onEditorClick = onEditorClick;
    /** @param {KeyboardEvent} event */
    const onEditorKeydown = (event) => {
        const target = /** @type {HTMLElement} */ (event.target);
        // Escape inside an open calendar closes the calendar, not the editor.
        if (event.key !== 'Escape' || event.defaultPrevented || target.closest('[data-kp-date-panel]') !== null) return;
        if (target.getAttribute('aria-expanded') === 'true') return;
        event.preventDefault();
        closeFilterEditor(true);
    };
    c.onEditorKeydown = onEditorKeydown;
    /** @param {MouseEvent} event */
    const onAddMenuClick = (event) => {
        const button = /** @type {HTMLElement | null} */ (/** @type {HTMLElement} */ (event.target).closest('[data-kp-filter-column]'));
        if (button === null) return;
        const at = Number(button.dataset.kpFilterColumn);
        if (c.addPop?.matches(':popover-open')) c.addPop.hidePopover();
        openFilterEditor(at, filters.has(at) ? at : null);
    };
    c.onAddMenuClick = onAddMenuClick;
    /** @param {KeyboardEvent} event */
    const onAddMenuKey = (event) => {
        if (c.addMenu === null) return;
        const items = /** @type {HTMLElement[]} */ ([...c.addMenu.querySelectorAll('.kp-menu__item')]);
        const at = items.indexOf(/** @type {HTMLElement} */ (document.activeElement));
        /** @type {Record<string, number>} */
        const moves = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: items.length - 1 };
        const to = moves[event.key];
        if (to === undefined || items.length === 0) return;
        event.preventDefault();
        items[(to + items.length) % items.length]?.focus();
    };
    c.onAddMenuKey = onAddMenuKey;
    /** @param {Event} event */
    const onAddToggle = (event) => {
        const open = /** @type {ToggleEvent} */ (event).newState === 'open';
        c.addButton?.setAttribute('aria-expanded', String(open));
        if (!open) return;
        renderAddMenu(getStrings());
        /** @type {HTMLElement | null} */ (c.addMenu?.querySelector('.kp-menu__item') ?? null)?.focus();
    };
    c.onAddToggle = onAddToggle;
    /** @param {MouseEvent} event */
    const onPillsClick = (event) => {
        if (!addMode) return;
        const target = /** @type {HTMLElement} */ (event.target);
        const edit = /** @type {HTMLElement | null} */ (target.closest('[data-kp-filter-pill]'));
        if (edit !== null) {
            const at = Number(edit.dataset.kpFilterPill);
            if (editingFilter === at) closeFilterEditor(true);
            else openFilterEditor(at, at);
            return;
        }
        const remove = /** @type {HTMLElement | null} */ (target.closest('[data-kp-filter-unpill]'));
        if (remove === null) return;
        const at = Number(remove.dataset.kpFilterUnpill);
        if (editingFilter === at) closeFilterEditor(false);
        c.setFilter(at, null);
        /** @type {HTMLElement | null} */ (c.pills?.querySelector('.kp-tag__remove') ?? c.addButton)?.focus();
    };
    c.onPillsClick = onPillsClick;
}
