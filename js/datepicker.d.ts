/** Fired when a date is chosen, typed or set. A contract value [TH26]: `{ iso, date, source }`. */
export declare const DATE_EVENT = "kp-date-change";
/** Fired when the panel opens or closes: `{ open }`. */
export declare const OPEN_EVENT = "kp-date-open";
/** Fired when the visible month changes: `{ year, month }` (month 0-11). */
export declare const MONTH_EVENT = "kp-date-month";
/** @param {Date} date */
export declare function toISO(date: Date): string;
/**
 * A date as a locale writes it. `toDutch` remains for the consumers that
 * imported it in 1.x; it is `formatDate(date, 'nl-NL')`.
 *
 * @param {Date} date
 * @param {string} [locale]
 */
export declare function formatLocalDate(date: Date, locale?: string): string;
/** @deprecated since 3.0.0 — `formatLocalDate(date, 'nl-NL')`. @param {Date} date */
export declare function toDutch(date: Date): string;
/**
 * Read what someone typed: ISO always, and the locale's own order for
 * the numeric form. "31-02-2026" is refused rather than rounded to 3
 * March, in every locale.
 *
 * @param {string} text
 * @param {string} [locale]
 * @returns {Date | null}
 */
export declare function parseDate(text: string, locale?: string): Date | null;
export type DatePickerHandle = {
    element: HTMLElement;
    get: () => Date | null;
    /**
     * a Date, an ISO string, or null to clear
     */
    set: (date: Date | string | null) => void;
    open: () => void;
    close: () => void;
};
/** The handle for an attached picker. @param {Element} element */
export declare function datePicker(element: Element): DatePickerHandle | null;
/**
 * @param {ParentNode} root
 * @param {{ locale?: string, weekStartsOn?: number, closeOnSelect?: boolean, refocus?: boolean, isDateDisabled?: (date: Date) => boolean, renderDay?: (button: HTMLButtonElement, date: Date) => void, previousGlyph?: string, nextGlyph?: string }} [options]
 *   Defaults; per picker: `data-kp-locale`, `data-kp-week-starts-on`, `data-kp-min`, `data-kp-max` (ISO), `data-kp-disabled-days` (0-6, comma-separated), `data-kp-close-on-select="false"`, `data-kp-previous-glyph`, `data-kp-next-glyph`.
 * @returns {(() => void) & { handles: DatePickerHandle[] }} detach
 */
export declare function attachDatePickers(root?: ParentNode, { locale: localeOption, weekStartsOn: weekOption, closeOnSelect, refocus, isDateDisabled, renderDay, previousGlyph, nextGlyph, }?: {
    locale?: string;
    weekStartsOn?: number;
    closeOnSelect?: boolean;
    refocus?: boolean;
    isDateDisabled?: (date: Date) => boolean;
    renderDay?: (button: HTMLButtonElement, date: Date) => void;
    previousGlyph?: string;
    nextGlyph?: string;
}): (() => void) & {
    handles: DatePickerHandle[];
};
