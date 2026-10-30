/** The handle for an attached picker. @param {Element} element */
export declare function datePicker(element: Element): import("./constants.js").DatePickerHandle | null;
/**
 * @param {ParentNode} root
 * @param {import('./constants.js').DatePickerOptions} [options]
 *   Defaults; per picker: `data-kp-locale`, `data-kp-date-format` (`rule52`, the default: dd/mm/yyyy whatever the locale; `locale`: the locale's own numeric order), `data-kp-week-starts-on`, `data-kp-min`, `data-kp-max` (ISO), `data-kp-disabled-days` (0-6, comma-separated), `data-kp-close-on-select="false"`, `data-kp-previous-glyph`, `data-kp-next-glyph`.
 * @returns {(() => void) & { handles: import('./constants.js').DatePickerHandle[] }} detach
 */
export declare function attachDatePickers(root?: ParentNode, options?: import('./constants.js').DatePickerOptions): (() => void) & {
    handles: import('./constants.js').DatePickerHandle[];
};
