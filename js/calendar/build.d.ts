export type Strings = import('../strings.js').Strings;
/**
 * Build the calendar into `el`: nothing is wired here.
 * @param {HTMLElement} el @param {Strings} s @param {string} locale @param {number} firstDay
 */
export declare function buildCalendar(el: HTMLElement, s: Strings, locale: string, firstDay: number): {
    prev: HTMLButtonElement;
    next: HTMLButtonElement;
    todayButton: HTMLButtonElement;
    title: HTMLHeadingElement;
    stateLine: HTMLParagraphElement;
    grid: HTMLTableElement;
    body: HTMLTableSectionElement;
    cells: {
        td: HTMLTableCellElement;
        button: HTMLButtonElement;
        num: HTMLElement;
        count: HTMLElement;
        pad: HTMLElement;
    }[];
    legend: HTMLUListElement;
    busyText: HTMLSpanElement;
};
