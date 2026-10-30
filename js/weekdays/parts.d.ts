export type WeekdaysOptions = ReturnType<typeof import('./options.js').readWeekdaysOptions>;
export type Strings = ReturnType<typeof import('../strings.js').getStrings>;
/** @typedef {ReturnType<typeof import('./options.js').readWeekdaysOptions>} WeekdaysOptions */
/** @typedef {ReturnType<typeof import('../strings.js').getStrings>} Strings */
/**
 * The chips: the package's multi chip group, one chip per day.
 * @param {Document} doc @param {WeekdaysOptions} o @param {string} label
 */
export declare function buildChips(doc: Document, o: WeekdaysOptions, label: string): HTMLDivElement;
/**
 * The chip items: the days 1 to 31 and "Last", or the seven days from the week's first.
 * @param {WeekdaysOptions} o @param {Strings} s
 * @returns {import('../segmented.js').SegmentedItem[]}
 */
export declare function chipItems(o: WeekdaysOptions, s: Strings): import('../segmented.js').SegmentedItem[];
/**
 * The line in words, the error under the chips and the reason it is off.
 * @param {HTMLElement} el @param {WeekdaysOptions} o @param {string} id
 */
export declare function buildLines(el: HTMLElement, o: WeekdaysOptions, id: string): {
    summary: HTMLParagraphElement;
    why: HTMLParagraphElement;
    reason: HTMLParagraphElement;
};
/**
 * The quick picks: one press for the common sets.
 * @param {Document} doc @param {WeekdaysOptions} o @param {Strings} s
 */
export declare function buildQuick(doc: Document, o: WeekdaysOptions, s: Strings): {
    quick: HTMLDivElement;
    buttons: Map<string, HTMLButtonElement>;
};
