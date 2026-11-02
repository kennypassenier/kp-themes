export type Placed = import('./constants.js').Placed;
export type DaylineItem = import('./constants.js').DaylineItem;
export type Strings = import('../strings.js').Strings;
/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {Document} doc @param {K} tag @param {string} className @param {string} [text]
 * @returns {HTMLElementTagNameMap[K]}
 */
export declare const make: <K extends keyof HTMLElementTagNameMap>(doc: Document, tag: K, className: string, text?: string) => HTMLElementTagNameMap[K];
/** The parts of one day timeline, built once. @param {Document} doc */
export declare function buildFrame(doc: Document): {
    allDay: HTMLDivElement;
    allDayName: HTMLParagraphElement;
    allDayList: HTMLUListElement;
    grid: HTMLDivElement;
    scroll: HTMLDivElement;
    plate: HTMLDivElement;
    frame: HTMLDivElement;
    now: HTMLDivElement;
    nowLabel: HTMLSpanElement;
    drop: HTMLDivElement;
    status: HTMLSpanElement;
};
/** The hour labels and the ruled lines behind the blocks. @param {Document} doc @param {{ startHour: number, hours: number, perHour: number }} g */
export declare function hourParts(doc: Document, { startHour, hours, perHour }: {
    startHour: number;
    hours: number;
    perHour: number;
}): HTMLSpanElement[];
/** Put a tone on a block or a plate: the status palette by name, a categorical colour by number. @param {HTMLElement} el @param {string | number | undefined} tone */
export declare function paintTone(el: HTMLElement, tone: string | number | undefined): void;
/** `09:00–09:30`, the item's real start and end. @param {Placed} p @param {number} startHour */
export declare const spanOf: (p: Placed, startHour: number) => string;
/** What a screen reader hears for a block. @param {Placed} p @param {number} startHour @param {Strings} s */
export declare function blockName(p: Placed, startHour: number, s: Strings): string;
/** One block: the handle (none for a read-only item, its column kept) and the body with the time and the label. @param {Document} doc @param {Placed} p @param {number} startHour @param {Strings} s */
export declare function buildBlock(doc: Document, p: Placed, startHour: number, s: Strings): HTMLElement;
/** Stand a block on its rows and in its lane. @param {HTMLElement} block @param {Placed} p */
export declare function placeBlock(block: HTMLElement, p: Placed): void;
/** The all-day strip's plates. @param {Document} doc @param {readonly DaylineItem[]} items @param {Strings} s */
export declare function allDayItems(doc: Document, items: readonly DaylineItem[], s: Strings): HTMLLIElement[];
/** The now line's place, as a share of the day, and its words; hidden outside the day. @param {HTMLElement} line @param {HTMLElement} label @param {number | null} minute @param {number} total @param {number} clock @param {Strings} s */
export declare function placeNow(line: HTMLElement, label: HTMLElement, minute: number | null, total: number, clock: number, s: Strings): void;
