/**
 * Resolve a picker's settings: each attribute on the picker wins over the option the page passed, and each option has a default.
 * @param {HTMLElement} picker
 * @param {import('./constants.js').DatePickerOptions} options
 */
export declare function readSettings(picker: HTMLElement, options: import('./constants.js').DatePickerOptions): {
    locale: string;
    numeric: 'rule52' | 'locale';
    firstDay: number;
    min: Date | null;
    max: Date | null;
    disabledDays: number[];
    closes: boolean;
    refocus: boolean;
    isDateDisabled: ((date: Date) => boolean) | undefined;
    renderDay: ((button: HTMLButtonElement, date: Date) => void) | undefined;
    previousGlyph: string;
    nextGlyph: string;
};
