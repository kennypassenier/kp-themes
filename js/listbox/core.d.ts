import { Controller } from '../controller.js';
export type ListboxOptions = import('./values.js').ListboxOptions;
/** @typedef {import('./values.js').ListboxOptions} ListboxOptions */
export declare class ListboxCore extends Controller {
    /** The options with their defaults. */
    o: {
        input: HTMLElement;
        list: HTMLElement;
        onChoose?: (index: number, option: HTMLElement) => void;
        onDismiss?: () => void;
        onHighlight?: (index: number, option: HTMLElement | null) => void;
        idPrefix?: string;
        loop: boolean;
        optionSelector: string;
        disabledSelector: string;
        hoverHighlights: boolean;
        scrollIntoView: boolean | ScrollIntoViewOptions;
        activeClass: string;
        typeahead: boolean;
        typeaheadMs: number;
        dismissOnEscape: boolean;
        events: boolean;
    };
    list: HTMLElement;
    input: HTMLElement;
    /** The highlighted index, or -1. */
    index: number;
    /** What this controller stamped, so destroy can take it back. @type {Set<HTMLElement>} */
    stampedIds: Set<HTMLElement>;
    /** @type {Set<HTMLElement>} */
    stampedSelected: Set<HTMLElement>;
    /** The letters typed so far, and the timer that forgets them. */
    buffer: string;
    bufferTimer: number;
    /**
     * @param {HTMLElement} list the element with role="listbox"
     * @param {Record<string, unknown>} options a ListboxOptions
     */
    constructor(list: HTMLElement, options: Record<string, unknown>);
    /**
     * Whether an option is shown: neither it nor a group between it and the
     * list is `hidden`. The list's own `hidden` does not count, because the
     * arrow keys may move the highlight in a list that is about to open.
     *
     * @param {HTMLElement} option
     */
    shown(option: HTMLElement): boolean;
    /**
     * The options as they stand right now: the ones a person can see and
     * choose. A filtered-out option used to count, so after typing the first
     * ArrowDown highlighted an option nobody could see and the highlight
     * walked through every hidden one before it reached the list [note 2 of
     * Kenny's second nostromo pass, 2026-09-13].
     *
     * @returns {HTMLElement[]}
     */
    visibleOptions(): HTMLElement[];
    /**
     * Give every option an id, because `aria-activedescendant` refers to
     * one and an option without an id cannot be pointed at. Generated
     * rather than demanded from the consumer: an id collision between two
     * pickers on one page is the kind of bug nobody looks for.
     */
    identify(): void;
    /**
     * Mark one option current or not. Two carriers, as everywhere in this package: the attribute for assistive technology and for
     * tests, the class for CSS. @param {HTMLElement} option @param {boolean} current
     */
    mark(option: HTMLElement, current: boolean): void;
    /** Dispatch one of the list's events for the option at the current index. @param {string} type @param {HTMLElement | null} option */
    emit(type: string, option: HTMLElement | null): void;
    /** Add a typed letter to the typeahead word; the word is forgotten after a pause. @param {string} letter */
    typed(letter: string): void;
    /** @param {number} next */
    highlight(next: number): void;
    clear(): void;
    /** @param {number} step */
    move(step: number): void;
    /** Choose the highlighted option, as Enter would. @returns {boolean} whether there was one */
    choose(): boolean;
}
