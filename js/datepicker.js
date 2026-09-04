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
//   <div class="kp-datepicker" data-kp-datepicker>
//     <label class="kp-field__label" for="van">Van</label>
//     <input class="kp-field__input" id="van" type="text" inputmode="numeric"
//            placeholder="dd-mm-jjjj" data-kp-date-input />
//     <button type="button" data-kp-date-open aria-label="Kalender openen">📅</button>
//     <div class="kp-datepicker__panel" data-kp-date-panel hidden></div>
//   </div>
//
// The panel is built here rather than written by the server, and that is
// the one place this package departs from "the server writes the markup":
// a month grid is derived from a date, so writing it by hand would mean
// writing twelve of them and keeping them in step.
//
// ISO in the value attribute, Dutch on screen. A consumer reads
// `input.dataset.kpDateValue` and gets `2026-09-04` whatever the display
// format is, because parsing a localised string on the server is how off-
// by-one-day bugs are born.

const PICKER = '[data-kp-datepicker]';

/** Fired when a date is chosen or typed. A contract value [TH26]: the detail carries the ISO date. */
export const DATE_EVENT = 'kp-date-change';

const DAYS = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];
const MONTHS = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

/** @param {Date} date */
export function toISO(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
}

/** @param {Date} date */
export function toDutch(date) {
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
}

/**
 * Read what someone typed. Accepts `4-9-2026`, `04-09-2026` and
 * `2026-09-04`, because insisting on one shape is how a date field earns
 * its reputation.
 *
 * @param {string} text
 * @returns {Date | null}
 */
export function parseDate(text) {
    const trimmed = text.trim();
    if (trimmed === '') return null;
    const iso = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    const dutch = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
    const parts = iso ? [Number(iso[1]), Number(iso[2]), Number(iso[3])] : dutch ? [Number(dutch[3]), Number(dutch[2]), Number(dutch[1])] : null;
    if (parts === null) return null;
    const [year, month, day] = parts;
    const date = new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
    // Round-trip check: 31-02 parses as 3 March without it, which is a
    // silent wrong answer rather than an error.
    if (date.getFullYear() !== year || date.getMonth() !== (month ?? 1) - 1 || date.getDate() !== day) return null;
    return date;
}

/**
 * @param {ParentNode} root
 * @returns {() => void} detach
 */
export function attachDatePickers(root = document) {
    /** @type {(() => void)[]} */
    const cleanups = [];

    for (const element of root.querySelectorAll(PICKER)) {
        const picker = /** @type {HTMLElement} */ (element);
        if (picker.dataset.kpDatepickerAttached !== undefined) continue;
        const input = /** @type {HTMLInputElement | null} */ (picker.querySelector('[data-kp-date-input]'));
        const open = /** @type {HTMLButtonElement | null} */ (picker.querySelector('[data-kp-date-open]'));
        const panel = /** @type {HTMLElement | null} */ (picker.querySelector('[data-kp-date-panel]'));
        if (input === null || open === null || panel === null) continue;
        picker.dataset.kpDatepickerAttached = '';

        let cursor = parseDate(input.value) ?? new Date();

        const draw = () => {
            const year = cursor.getFullYear();
            const month = cursor.getMonth();
            const first = new Date(year, month, 1);
            // Monday-first, which is what a Dutch calendar looks like.
            const lead = (first.getDay() + 6) % 7;
            const days = new Date(year, month + 1, 0).getDate();
            const chosen = parseDate(input.value);

            panel.textContent = '';
            const head = document.createElement('div');
            head.className = 'kp-datepicker__head';
            const back = document.createElement('button');
            back.type = 'button';
            back.className = 'kp-button kp-button--ghost';
            back.setAttribute('aria-label', 'Vorige maand');
            back.textContent = '‹';
            back.addEventListener('click', () => {
                cursor = new Date(year, month - 1, 1);
                draw();
            });
            const title = document.createElement('span');
            title.className = 'kp-datepicker__title';
            title.id = `${input.id || 'kp-date'}-title`;
            title.textContent = `${MONTHS[month]} ${year}`;
            const next = document.createElement('button');
            next.type = 'button';
            next.className = 'kp-button kp-button--ghost';
            next.setAttribute('aria-label', 'Volgende maand');
            next.textContent = '›';
            next.addEventListener('click', () => {
                cursor = new Date(year, month + 1, 1);
                draw();
            });
            head.append(back, title, next);

            const grid = document.createElement('div');
            grid.className = 'kp-datepicker__grid';
            grid.setAttribute('role', 'grid');
            grid.setAttribute('aria-labelledby', title.id);
            for (const day of DAYS) {
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
                button.setAttribute('aria-label', `${day} ${MONTHS[month]} ${year}`);
                button.textContent = String(day);
                const isChosen = chosen !== null && toISO(chosen) === toISO(date);
                button.setAttribute('aria-selected', String(isChosen));
                // Exactly one day in the tab order, so Tab leaves the grid
                // instead of walking 31 buttons.
                button.tabIndex = day === cursor.getDate() ? 0 : -1;
                grid.append(button);
            }
            panel.append(head, grid);
        };

        const show = () => {
            cursor = parseDate(input.value) ?? new Date();
            draw();
            panel.hidden = false;
            open.setAttribute('aria-expanded', 'true');
            /** @type {HTMLElement | null} */ (panel.querySelector('[tabindex="0"]'))?.focus();
        };

        const hide = () => {
            panel.hidden = true;
            open.setAttribute('aria-expanded', 'false');
        };

        /** @param {Date} date */
        const choose = (date) => {
            input.value = toDutch(date);
            input.dataset.kpDateValue = toISO(date);
            picker.dispatchEvent(new CustomEvent(DATE_EVENT, { bubbles: true, detail: { iso: toISO(date) } }));
            hide();
            input.focus();
        };

        const onOpen = () => (panel.hidden ? show() : hide());

        /** Typing is the primary path, so it updates the value on its own. */
        const onInput = () => {
            const date = parseDate(input.value);
            if (date === null) {
                delete input.dataset.kpDateValue;
                return;
            }
            input.dataset.kpDateValue = toISO(date);
            picker.dispatchEvent(new CustomEvent(DATE_EVENT, { bubbles: true, detail: { iso: toISO(date) } }));
        };

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
            /** @type {Date | null} */
            let moved = null;
            switch (event.key) {
                case 'ArrowRight':
                    moved = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1);
                    break;
                case 'ArrowLeft':
                    moved = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 1);
                    break;
                case 'ArrowDown':
                    moved = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 7);
                    break;
                case 'ArrowUp':
                    moved = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 7);
                    break;
                case 'PageDown':
                    moved = new Date(current.getFullYear(), current.getMonth() + 1, current.getDate());
                    break;
                case 'PageUp':
                    moved = new Date(current.getFullYear(), current.getMonth() - 1, current.getDate());
                    break;
                case 'Home':
                    moved = new Date(current.getFullYear(), current.getMonth(), current.getDate() - ((current.getDay() + 6) % 7));
                    break;
                case 'End':
                    moved = new Date(current.getFullYear(), current.getMonth(), current.getDate() + (6 - ((current.getDay() + 6) % 7)));
                    break;
                case 'Enter':
                case ' ':
                    event.preventDefault();
                    choose(current);
                    return;
                case 'Escape':
                    event.preventDefault();
                    hide();
                    open.focus();
                    return;
                default:
                    return;
            }
            event.preventDefault();
            cursor = moved;
            draw();
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
        onInput();

        cleanups.push(() => {
            open.removeEventListener('click', onOpen);
            input.removeEventListener('input', onInput);
            panel.removeEventListener('keydown', onPanelKey);
            panel.removeEventListener('click', onPanelClick);
            picker.removeEventListener('focusout', onFocusOut);
            delete picker.dataset.kpDatepickerAttached;
        });
    }

    return () => {
        for (const c of cleanups) c();
    };
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => attachDatePickers());
    else attachDatePickers();
}
