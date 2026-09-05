// Date picker, framework-free [TH43].
//
// The classic place where keyboard access dies. Two rules decide whether
// this is usable, and both are about not trapping anyone in the grid:
//
//   1. **Typing always works.** The text input is the control; the
//      calendar is an aid. Someone who knows the date types it and never
//      opens the grid, and someone using a screen reader is not forced
//      through 31 buttons to say "the fourth".
//   2. **The grid is a real grid.** Arrows move by day, PageUp/PageDown
//      by month, Home/End to the ends of the week, and exactly one day is
//      in the tab order at a time.
//
//   <div class="kp-datepicker" data-kp-datepicker data-kp-min="2026-01-01" data-kp-disabled-days="0,6">
//     <label class="kp-field__label" for="from">From</label>
//     <input class="kp-field__input" id="from" type="text" inputmode="numeric" data-kp-date-input />
//     <button type="button" data-kp-date-open aria-label="Open the calendar">📅</button>
//     <div class="kp-datepicker__panel" data-kp-date-panel hidden></div>
//   </div>
//
// The panel is built here rather than written by the server, and that is
// the one place this package departs from "the server writes the markup":
// a month grid is derived from a date, so writing it by hand would mean
// writing twelve of them and keeping them in step.
//
// ISO in the value attribute, the locale on screen. A consumer reads
// `input.dataset.kpDateValue` and gets `2026-09-04` whatever the display
// format is, because parsing a localised string on the server is how off-
// by-one-day bugs are born.
//
// Since 3.0.0 [KT6, D5]: the display format, the parsing order and the
// first day of the week come from the locale — the nearest `lang`, the
// browser's, or `data-kp-locale` — instead of being Dutch; the first
// version also set the placeholder hint from a string that nothing
// formatted by, so changing it made the hint lie. A minimum, a maximum
// and disabled weekdays exist; the date is settable through the handle;
// the day cells can be decorated; and the panel's glyphs are attributes.

import { getStrings } from './strings.js';
import { datePattern, formatDate, parseDate as parseLocale, resolveLocale, weekStartsOn } from './locale.js';

const PICKER = '[data-kp-datepicker]';

/** Fired when a date is chosen, typed or set. A contract value [TH26]: `{ iso, date, source }`. */
export const DATE_EVENT = 'kp-date-change';
/** Fired when the panel opens or closes: `{ open }`. */
export const OPEN_EVENT = 'kp-date-open';
/** Fired when the visible month changes: `{ year, month }` (month 0-11). */
export const MONTH_EVENT = 'kp-date-month';

/** @param {Date} date */
export function toISO(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * A date as a locale writes it. `toDutch` remains for the consumers that
 * imported it in 1.x; it is `formatDate(date, 'nl-NL')`.
 *
 * @param {Date} date
 * @param {string} [locale]
 */
export function formatLocalDate(date, locale) {
    return formatDate(date, locale);
}
/** @deprecated since 3.0.0 — `formatLocalDate(date, 'nl-NL')`. @param {Date} date */
export function toDutch(date) {
    return formatDate(date, 'nl-NL');
}

/**
 * Read what someone typed: ISO always, and the locale's own order for
 * the numeric form. "31-02-2026" is refused rather than rounded to 3
 * March, in every locale.
 *
 * @param {string} text
 * @param {string} [locale]
 * @returns {Date | null}
 */
export function parseDate(text, locale) {
    if (text.trim() === '') return null;
    return parseLocale(text, locale);
}

/**
 * @typedef {object} DatePickerHandle
 * @property {HTMLElement} element
 * @property {() => Date | null} get
 * @property {(date: Date | string | null) => void} set a Date, an ISO string, or null to clear
 * @property {() => void} open
 * @property {() => void} close
 */

/** @type {WeakMap<Element, DatePickerHandle>} */
const handles = new WeakMap();
/** The handle for an attached picker. @param {Element} element */
export function datePicker(element) {
    return handles.get(element) ?? null;
}

/**
 * @param {ParentNode} root
 * @param {{ locale?: string, weekStartsOn?: number, closeOnSelect?: boolean, refocus?: boolean, isDateDisabled?: (date: Date) => boolean, renderDay?: (button: HTMLButtonElement, date: Date) => void, previousGlyph?: string, nextGlyph?: string }} [options]
 *   Defaults; per picker: `data-kp-locale`, `data-kp-week-starts-on`, `data-kp-min`, `data-kp-max` (ISO), `data-kp-disabled-days` (0-6, comma-separated), `data-kp-close-on-select="false"`, `data-kp-previous-glyph`, `data-kp-next-glyph`.
 * @returns {(() => void) & { handles: DatePickerHandle[] }} detach
 */
export function attachDatePickers(
    root = document,
    {
        locale: localeOption,
        weekStartsOn: weekOption,
        closeOnSelect = true,
        refocus = true,
        isDateDisabled,
        renderDay,
        previousGlyph = '‹',
        nextGlyph = '›',
    } = {},
) {
    /** @type {(() => void)[]} */
    const cleanups = [];
    /** @type {DatePickerHandle[]} */
    const created = [];

    for (const element of root.querySelectorAll(PICKER)) {
        const picker = /** @type {HTMLElement} */ (element);
        if (picker.dataset.kpDatepickerAttached !== undefined) continue;
        const input = /** @type {HTMLInputElement | null} */ (picker.querySelector('[data-kp-date-input]'));
        const open = /** @type {HTMLButtonElement | null} */ (picker.querySelector('[data-kp-date-open]'));
        const panel = /** @type {HTMLElement | null} */ (picker.querySelector('[data-kp-date-panel]'));
        if (input === null || open === null || panel === null) continue;
        picker.dataset.kpDatepickerAttached = '';

        const locale = resolveLocale(picker.dataset.kpLocale ?? localeOption, picker);
        const firstDay = weekStartsOn(locale, picker.dataset.kpWeekStartsOn === undefined ? weekOption : Number(picker.dataset.kpWeekStartsOn));
        const min = picker.dataset.kpMin ? parseLocale(picker.dataset.kpMin, locale) : null;
        const max = picker.dataset.kpMax ? parseLocale(picker.dataset.kpMax, locale) : null;
        const disabledDays = (picker.dataset.kpDisabledDays ?? '')
            .split(',')
            .map((d) => Number.parseInt(d, 10))
            .filter((d) => !Number.isNaN(d));
        const closes = picker.dataset.kpCloseOnSelect === undefined ? closeOnSelect : picker.dataset.kpCloseOnSelect !== 'false';
        const before = {
            placeholder: input.placeholder,
            value: input.dataset.kpDateValue,
            expanded: open.getAttribute('aria-expanded'),
            panelHidden: panel.hidden,
        };

        // The hint follows the locale, so it cannot lie about the format.
        if (input.placeholder === '') input.placeholder = datePattern(locale).hint;

        /** @param {Date} date */
        const disabled = (date) => {
            if (min !== null && date < min) return true;
            if (max !== null && date > max) return true;
            if (disabledDays.includes(date.getDay())) return true;
            return isDateDisabled?.(date) ?? false;
        };
        const read = () => parseDate(input.value, locale);
        let cursor = read() ?? new Date();

        const draw = () => {
            const year = cursor.getFullYear();
            const month = cursor.getMonth();
            const first = new Date(year, month, 1);
            const lead = (first.getDay() - firstDay + 7) % 7;
            const days = new Date(year, month + 1, 0).getDate();
            const chosen = read();
            const s = getStrings();

            panel.textContent = '';
            const head = document.createElement('div');
            head.className = 'kp-datepicker__head';
            const back = document.createElement('button');
            back.type = 'button';
            back.className = 'kp-button kp-button--ghost';
            back.setAttribute('aria-label', s.previousMonth);
            back.textContent = picker.dataset.kpPreviousGlyph ?? previousGlyph;
            back.addEventListener('click', () => {
                cursor = new Date(year, month - 1, 1);
                draw();
                picker.dispatchEvent(
                    new CustomEvent(MONTH_EVENT, { bubbles: true, detail: { year: cursor.getFullYear(), month: cursor.getMonth() } }),
                );
            });
            const title = document.createElement('span');
            title.className = 'kp-datepicker__title';
            title.id = `${input.id || 'kp-date'}-title`;
            title.textContent = s.monthTitle(s.months[month] ?? '', year);
            const next = document.createElement('button');
            next.type = 'button';
            next.className = 'kp-button kp-button--ghost';
            next.setAttribute('aria-label', s.nextMonth);
            next.textContent = picker.dataset.kpNextGlyph ?? nextGlyph;
            next.addEventListener('click', () => {
                cursor = new Date(year, month + 1, 1);
                draw();
                picker.dispatchEvent(
                    new CustomEvent(MONTH_EVENT, { bubbles: true, detail: { year: cursor.getFullYear(), month: cursor.getMonth() } }),
                );
            });
            head.append(back, title, next);

            const grid = document.createElement('div');
            grid.className = 'kp-datepicker__grid';
            grid.setAttribute('role', 'grid');
            grid.setAttribute('aria-labelledby', title.id);
            // The weekday headings rotate with the first day: Sunday first
            // for a locale that starts there, Monday for one that does not.
            for (let i = 0; i < 7; i += 1) {
                const day = s.weekdays[(firstDay + i) % 7] ?? '';
                const cell = document.createElement('span');
                cell.className = 'kp-datepicker__weekday';
                cell.setAttribute('role', 'columnheader');
                cell.setAttribute('aria-label', day);
                cell.textContent = day;
                grid.append(cell);
            }
            for (let i = 0; i < lead; i += 1) {
                const blank = document.createElement('span');
                blank.className = 'kp-datepicker__blank';
                grid.append(blank);
            }
            for (let day = 1; day <= days; day += 1) {
                const date = new Date(year, month, day);
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'kp-datepicker__day';
                button.dataset.kpDay = toISO(date);
                button.setAttribute('role', 'gridcell');
                // The full date as the name: "4" alone tells a screen
                // reader nothing about which month it is in.
                button.setAttribute('aria-label', s.dayLabel(day, s.months[month] ?? '', year));
                button.textContent = String(day);
                const isChosen = chosen !== null && toISO(chosen) === toISO(date);
                button.setAttribute('aria-selected', String(isChosen));
                if (disabled(date)) {
                    // Disabled, and said so, rather than absent: a gap in
                    // the grid reads as a broken calendar.
                    button.setAttribute('aria-disabled', 'true');
                    button.dataset.kpDisabled = '';
                }
                // Exactly one day in the tab order, so Tab leaves the grid
                // instead of walking 31 buttons.
                button.tabIndex = day === cursor.getDate() ? 0 : -1;
                renderDay?.(button, date);
                grid.append(button);
            }
            panel.append(head, grid);
        };

        /** @param {boolean} next */
        const setOpen = (next) => {
            if (panel.hidden === !next) return;
            if (next) {
                cursor = read() ?? new Date();
                draw();
            }
            panel.hidden = !next;
            open.setAttribute('aria-expanded', String(next));
            if (next) /** @type {HTMLElement | null} */ (panel.querySelector('[tabindex="0"]'))?.focus();
            picker.dispatchEvent(new CustomEvent(OPEN_EVENT, { bubbles: true, detail: { open: next } }));
        };
        const show = () => setOpen(true);
        const hide = () => setOpen(false);

        /** @param {Date | null} date @param {'typed' | 'chosen' | 'set'} source */
        const commit = (date, source) => {
            if (date === null) {
                delete input.dataset.kpDateValue;
                if (source !== 'typed') input.value = '';
            } else {
                if (source !== 'typed') input.value = formatDate(date, locale);
                input.dataset.kpDateValue = toISO(date);
            }
            picker.dispatchEvent(new CustomEvent(DATE_EVENT, { bubbles: true, detail: { iso: date === null ? null : toISO(date), date, source } }));
        };
        /** @param {Date} date */
        const choose = (date) => {
            if (disabled(date)) return;
            commit(date, 'chosen');
            if (closes) hide();
            if (refocus) input.focus();
        };

        const onOpen = () => (panel.hidden ? show() : hide());

        /** Typing is the primary path, so it updates the value on its own. */
        const onInput = () => commit(read(), 'typed');

        /** @param {KeyboardEvent} event */
        const onPanelKey = (event) => {
            const day = /** @type {HTMLElement | null} */ (/** @type {HTMLElement} */ (event.target).closest('[data-kp-day]'));
            if (day === null) {
                if (event.key === 'Escape') {
                    hide();
                    open.focus();
                }
                return;
            }
            const current = new Date(`${day.dataset.kpDay}T00:00:00`);
            const y = current.getFullYear();
            const m = current.getMonth();
            const d = current.getDate();
            const offset = (current.getDay() - firstDay + 7) % 7;
            /** @type {Record<string, Date>} */
            const moves = {
                ArrowRight: new Date(y, m, d + 1),
                ArrowLeft: new Date(y, m, d - 1),
                ArrowDown: new Date(y, m, d + 7),
                ArrowUp: new Date(y, m, d - 7),
                PageDown: new Date(y, m + 1, d),
                PageUp: new Date(y, m - 1, d),
                Home: new Date(y, m, d - offset),
                End: new Date(y, m, d + (6 - offset)),
            };
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                choose(current);
                return;
            }
            if (event.key === 'Escape') {
                event.preventDefault();
                hide();
                open.focus();
                return;
            }
            const moved = moves[event.key];
            if (moved === undefined) return;
            event.preventDefault();
            const monthChanged = moved.getMonth() !== cursor.getMonth() || moved.getFullYear() !== cursor.getFullYear();
            cursor = moved;
            draw();
            if (monthChanged)
                picker.dispatchEvent(
                    new CustomEvent(MONTH_EVENT, { bubbles: true, detail: { year: cursor.getFullYear(), month: cursor.getMonth() } }),
                );
            /** @type {HTMLElement | null} */ (panel.querySelector(`[data-kp-day="${toISO(moved)}"]`))?.focus();
        };

        /** @param {MouseEvent} event */
        const onPanelClick = (event) => {
            const day = /** @type {HTMLElement | null} */ (/** @type {HTMLElement} */ (event.target).closest('[data-kp-day]'));
            if (day === null) return;
            choose(new Date(`${day.dataset.kpDay}T00:00:00`));
        };

        const onFocusOut = () => {
            setTimeout(() => {
                if (!picker.contains(document.activeElement)) hide();
            }, 0);
        };

        open.setAttribute('aria-expanded', 'false');
        open.addEventListener('click', onOpen);
        input.addEventListener('input', onInput);
        panel.addEventListener('keydown', onPanelKey);
        panel.addEventListener('click', onPanelClick);
        picker.addEventListener('focusout', onFocusOut);
        // The value attribute reflects what is in the field, silently.
        const initial = read();
        if (initial !== null) input.dataset.kpDateValue = toISO(initial);

        /** @type {DatePickerHandle} */
        const handle = {
            element: picker,
            get: read,
            set: (date) => {
                const parsed = date === null ? null : typeof date === 'string' ? parseLocale(date, locale) : date;
                commit(parsed, 'set');
                if (parsed !== null) cursor = parsed;
                if (!panel.hidden) draw();
            },
            open: show,
            close: hide,
        };
        handles.set(picker, handle);
        created.push(handle);

        cleanups.push(() => {
            open.removeEventListener('click', onOpen);
            input.removeEventListener('input', onInput);
            panel.removeEventListener('keydown', onPanelKey);
            panel.removeEventListener('click', onPanelClick);
            picker.removeEventListener('focusout', onFocusOut);
            panel.textContent = '';
            panel.hidden = before.panelHidden;
            input.placeholder = before.placeholder;
            if (before.value === undefined) delete input.dataset.kpDateValue;
            else input.dataset.kpDateValue = before.value;
            if (before.expanded === null) open.removeAttribute('aria-expanded');
            else open.setAttribute('aria-expanded', before.expanded);
            handles.delete(picker);
            delete picker.dataset.kpDatepickerAttached;
        });
    }

    const detach = () => {
        for (const c of cleanups) c();
    };
    return Object.assign(detach, { handles: created });
}
