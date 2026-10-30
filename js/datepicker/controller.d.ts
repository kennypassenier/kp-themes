import { Controller } from '../controller.js';
import { PanelOpening } from './opening.js';
import { DateViews } from './views.js';
/** The parts a picker is made of, or null when its markup lacks one. @param {HTMLElement} picker */
export declare function partsOf(picker: HTMLElement): {
    input: HTMLInputElement;
    open: HTMLButtonElement;
    panel: HTMLElement;
} | null;
/** A date picker. */
export declare class DatePickerController extends Controller {
    picker: HTMLElement;
    input: HTMLInputElement;
    open: HTMLButtonElement;
    panel: HTMLElement;
    settings: {
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
    /** The day the panel is on and that has the focus in the day grid. */
    cursor: Date;
    /** Says which grid opened. One element kept across redraws: a live region created together with its text is one a screen reader may never read. */
    live: HTMLSpanElement;
    views: DateViews;
    opening: PanelOpening;
    /** What the markup held before the picker touched it, for the way back out. */
    /** @type {{ placeholder: string, value: string | undefined, expanded: string | null, panelHidden: boolean | 'until-found' }} */
    before: {
        placeholder: string;
        value: string | undefined;
        expanded: string | null;
        panelHidden: boolean | 'until-found';
    };
    /** @type {import('./constants.js').DatePickerHandle | null} */
    handle: import('./constants.js').DatePickerHandle | null;
    /**
     * @param {HTMLElement} host the picker
     * @param {import('./constants.js').DatePickerOptions} [options]
     */
    constructor(host: HTMLElement, options?: import('./constants.js').DatePickerOptions);
    connect(): void;
    /** Put back what the picker changed on its markup. */
    restore(): void;
    /** The date in the field, or null when it is empty or not a date. */
    read(): Date | null;
    /** Whether a day may not be chosen: outside the range, on a disabled weekday, or refused by the page. @param {Date} date */
    disabled(date: Date): boolean;
    draw(): void;
    show(): void;
    hide(): void;
    /** @param {Date | null} date @param {'typed' | 'chosen' | 'set'} source */
    commit(date: Date | null, source: 'typed' | 'chosen' | 'set'): void;
    /** @param {Date} date */
    choose(date: Date): void;
    /**
     * A typed date that reads as a date is written the way the field shows a date
     * (13-09-2026 becomes 13/09/2026), once the person leaves the field or opens the
     * calendar; never while they type, and never a text that is not a date [scope-143].
     */
    tidy(): void;
    onFocusOut(): void;
    /** @returns {import('./constants.js').DatePickerHandle} */
    makeHandle(): import('./constants.js').DatePickerHandle;
}
