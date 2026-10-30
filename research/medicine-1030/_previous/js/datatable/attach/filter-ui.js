// The filter panel: its columns, pills, add menu, editor and choice lists.
import { ADD_FILTER, CHECK_CLASS, FILTERS, FILTER_TOGGLE, PILLS } from '../selectors.js';
import { attachDatePickers } from '../../datepicker.js';
import { splitList } from '../filter.js';
import { collator } from '../../locale.js';
import { compareByOrder } from '../sort.js';
import { getStrings } from '../../strings.js';
/** @typedef {import('../events.js').FilterKind} FilterKind */
/** @typedef {import('./context.js').TableContext} TableContext */

/**
 * What the the filter panel: its columns, pills, add menu, editor and choice lists part adds to the table's context.
 *
 * @typedef {{
 *     addButton: HTMLButtonElement | null;
 *     addMenu: HTMLElement | null;
 *     addMode: boolean;
 *     addPop: HTMLElement | null;
 *     choiceValues: (at: number) => string[];
 *     datePickerFor: (input: HTMLInputElement) => HTMLElement;
 *     fillChoices: (set: Element, at: number, ticked: string[]) => void;
 *     filterColumns: number[];
 *     filterEditor: HTMLFormElement | null;
 *     panel: HTMLElement | null;
 *     pills: HTMLElement | null;
 *     toggle: HTMLButtonElement | null;
 * }} FilterUiFields
 */

/**
 * The filter panel: its columns, pills, add menu, editor and choice lists.
 *
 * @param {TableContext} c
 */
export function installFilterUi(c) {
    const { add, choiceText, decoratePart, ensureTopBar, filterKinds, filterMode, headers, id, labelOf, locale, make, orders, s0, undo, wrap } = c;
    c.choiceValues = choiceValues;
    c.fillChoices = fillChoices;
    c.datePickerFor = datePickerFor;

    // ── Filters, declared on the headers ───────────────────────────
    const filterColumns = filterKinds.flatMap((kind, at) => (kind === null ? [] : [at]));
    c.filterColumns = filterColumns;
    /** @type {HTMLElement | null} */
    c.panel = null;
    /** @type {HTMLButtonElement | null} */
    c.toggle = null;
    /** @type {HTMLElement | null} */
    c.pills = null;
    const addMode = (wrap.dataset.kpFilterMode ?? filterMode) === 'add';
    c.addMode = addMode;
    /** `data-kp-filter-ui="none"`: the filters work, the page draws them [datatable-r5-1019, O22]. */
    const bareFilters = wrap.dataset.kpFilterUi === 'none';
    /** The add-filter mode's button, its menu, the list in the menu and the editor [#filter-add]. */
    /** @type {HTMLButtonElement | null} */
    c.addButton = null;
    /** @type {HTMLElement | null} */
    c.addPop = null;
    /** @type {HTMLElement | null} */
    c.addMenu = null;
    /** @type {HTMLFormElement | null} */
    c.filterEditor = null;
    if (filterColumns.length > 0 && addMode && !bareFilters) {
        const s = s0;
        const popId = `${id}-add-filter`;
        c.addButton = /** @type {HTMLButtonElement | null} */ (wrap.querySelector(ADD_FILTER));
        if (c.addButton === null) {
            c.addButton = /** @type {HTMLButtonElement} */ (add(make('button', 'kp-button kp-datatable__add-filter')));
            c.addButton.type = 'button';
            c.addButton.dataset.kpDatatableAddFilter = '';
            ensureTopBar().append(c.addButton);
        } else {
            const node = c.addButton;
            const was = ['aria-haspopup', 'aria-expanded', 'aria-controls', 'popovertarget'].map((name) => [name, node.getAttribute(name)]);
            const text = node.textContent;
            undo.push(() => {
                for (const [name, value] of was) {
                    if (value === null || value === undefined) node.removeAttribute(/** @type {string} */ (name));
                    else node.setAttribute(/** @type {string} */ (name), value);
                }
                node.style.removeProperty('anchor-name');
                node.textContent = text;
            });
        }
        decoratePart(c.addButton, { kind: 'add-filter', label: s.tableAddFilter(0) });
        c.addButton.setAttribute('aria-haspopup', 'true');
        c.addButton.setAttribute('aria-expanded', 'false');
        c.addButton.setAttribute('aria-controls', popId);
        c.addButton.setAttribute('popovertarget', popId);
        // Under its button, as the column menu is placed.
        c.addButton.style.setProperty('anchor-name', `--${popId}`);
        c.addPop = add(make('div', 'kp-popover kp-datatable__add-menu'));
        c.addPop.id = popId;
        c.addPop.setAttribute('popover', 'auto');
        c.addPop.dataset.kpDatatableAddMenu = '';
        c.addPop.style.setProperty('position-anchor', `--${popId}`);
        c.addMenu = make('ul', 'kp-menu');
        c.addMenu.setAttribute('aria-label', s.tableAddFilterMenu);
        c.addPop.append(c.addMenu);
        c.addButton.after(c.addPop);
        // The editor's frame is the package's own, not a .kp-card or a
        // .kp-popover: both carry a clip-path in some registers, which cut
        // off the calendar a date bound opens (measured on the mock,
        // 2026-09-13). The calendar itself goes to the top layer.
        c.filterEditor = /** @type {HTMLFormElement} */ (add(make('form', 'kp-datatable__filter-editor')));
        c.filterEditor.id = `${id}-filter-editor`;
        c.filterEditor.dataset.kpDatatableFilterEditor = '';
        c.filterEditor.noValidate = true;
        c.filterEditor.hidden = true;
        wrap.insertBefore(c.filterEditor, c.tableBlock);
    }
    if (filterColumns.length > 0 && !addMode && !bareFilters) {
        c.panel = /** @type {HTMLElement | null} */ (wrap.querySelector(FILTERS));
        if (c.panel === null) {
            c.panel = add(make('div', 'kp-datatable__filters'));
            c.panel.dataset.kpDatatableFilters = '';
            c.panel.hidden = wrap.dataset.kpFiltersOpen === undefined;
            wrap.insertBefore(c.panel, c.tableBlock);
        }
        if (c.panel.id === '') {
            c.panel.id = `${id}-filters`;
            const node = c.panel;
            undo.push(() => node.removeAttribute('id'));
        }
        c.panel.setAttribute('role', 'group');
        c.panel.setAttribute('aria-label', s0.tableFiltersLabel);
        for (const at of filterColumns) {
            const kind = /** @type {FilterKind} */ (filterKinds[at]);
            const label = labelOf(at);
            const set = add(make('fieldset', 'kp-fieldset kp-datatable__filter'));
            set.dataset.kpFilterColumn = String(at);
            const legend = make('legend', 'kp-field__label');
            legend.textContent = label;
            set.append(legend);
            if (kind === 'choice') fillChoices(set, at, []);
            else {
                const range = make('div', 'kp-datatable__range');
                for (const bound of ['from', 'to']) {
                    const input = /** @type {HTMLInputElement} */ (make('input', 'kp-field__input'));
                    input.dataset.kpFilterBound = bound;
                    input.setAttribute('aria-label', bound === 'from' ? s0.tableFilterFrom(label) : s0.tableFilterTo(label));
                    if (kind === 'range') {
                        input.type = 'number';
                        range.append(input);
                        continue;
                    }
                    // A date bound is the package's own date picker, not a
                    // bare date input, so it wears every theme's picker
                    // (scope-58, Kenny's second nostromo pass). The picker
                    // holds ISO in data-kp-date-value whatever the field shows.
                    input.id = `${id}-filter-${at}-${bound}`;
                    range.append(datePickerFor(input));
                }
                set.append(range);
                if (kind === 'date') {
                    const detachPickers = attachDatePickers(range);
                    undo.push(detachPickers);
                }
            }
            c.panel.append(set);
        }

        c.toggle = /** @type {HTMLButtonElement | null} */ (wrap.querySelector(FILTER_TOGGLE));
        if (c.toggle === null) {
            c.toggle = /** @type {HTMLButtonElement} */ (add(make('button', 'kp-button kp-button--ghost kp-datatable__filter-toggle')));
            c.toggle.type = 'button';
            c.toggle.dataset.kpDatatableFilterToggle = '';
            if (c.topBar !== null) c.topBar.append(c.toggle);
            else wrap.insertBefore(c.toggle, c.panel);
        }
        c.toggle.setAttribute('aria-controls', c.panel.id);
        c.toggle.setAttribute('aria-expanded', String(!c.panel.hidden));
    }
    if (filterColumns.length > 0 && !bareFilters) {
        c.pills = /** @type {HTMLElement | null} */ (wrap.querySelector(PILLS));
        if (c.pills === null) {
            c.pills = add(make('div', 'kp-datatable__pills'));
            c.pills.dataset.kpDatatablePills = '';
            wrap.insertBefore(c.pills, c.tableBlock);
        }
    }
    /**
     * A choice filter's values: the header's `data-kp-filter-options`, else
     * every value the rows hold, in the column's declared order or the
     * locale's. The add-filter editor asks when it opens and the filter
     * panel asks again on refresh(), so rows written after the attach are
     * in both.
     *
     * @param {number} at
     */
    function choiceValues(at) {
        const declared = splitList(headers[at]?.dataset.kpFilterOptions);
        if (declared.length > 0) return declared;
        const values = [...new Set(c.all.map((row) => choiceText(row, at)).filter((v) => v !== ''))];
        const order = orders[at];
        return values.sort((a, b) => (order ? compareByOrder(order, a, b, collator(locale).compare) : collator(locale).compare(a, b)));
    }
    /**
     * Put a panel fieldset's boxes in step with the choice values: one box
     * per value the rows hold now, ticked where `ticked` has it, and a
     * ticked value no row holds any more stays, so it can still be
     * unticked. Nothing is rebuilt while the list already matches, so a
     * focused box keeps its focus.
     *
     * @param {Element} set @param {number} at @param {string[]} ticked
     */
    function fillChoices(set, at, ticked) {
        const values = [...choiceValues(at)];
        for (const value of ticked) if (!values.includes(value)) values.push(value);
        const boxes = /** @type {HTMLInputElement[]} */ ([...set.querySelectorAll('input[type="checkbox"]')]);
        if (boxes.length === values.length && boxes.every((box, i) => box.value === values[i])) return;
        for (const box of boxes) box.closest('.kp-field__option')?.remove();
        for (const value of values) {
            const option = make('label', 'kp-field__option');
            const box = /** @type {HTMLInputElement} */ (make('input', CHECK_CLASS));
            box.type = 'checkbox';
            box.value = value;
            box.checked = ticked.includes(value);
            option.append(box, ` ${value}`);
            set.append(option);
        }
    }
    /**
     * The package's date picker around a text field: the markup the
     * standalone picker has, class for class and string for string — a
     * plain button with the glyph, named by aria-label and title
     * [Kenny's note of 2026-09-13 — it was a ghost button reading
     * "Calendar"]. The caller attaches it.
     *
     * @param {HTMLInputElement} input
     */
    function datePickerFor(input) {
        const picker = make('div', 'kp-datepicker');
        picker.dataset.kpDatepicker = '';
        picker.dataset.kpLocale = locale;
        input.type = 'text';
        input.inputMode = 'numeric';
        input.dataset.kpDateInput = '';
        const s = getStrings();
        const opener = /** @type {HTMLButtonElement} */ (make('button', 'kp-button'));
        opener.type = 'button';
        opener.dataset.kpDateOpen = '';
        opener.setAttribute('aria-label', s.calendarOpen);
        opener.title = s.calendarOpen;
        const glyph = make('span');
        glyph.setAttribute('aria-hidden', 'true');
        glyph.textContent = s.calendarButton;
        opener.append(glyph);
        const datePanel = make('div', 'kp-datepicker__panel');
        datePanel.dataset.kpDatePanel = '';
        datePanel.hidden = true;
        picker.append(input, opener, datePanel);
        return picker;
    }
}
