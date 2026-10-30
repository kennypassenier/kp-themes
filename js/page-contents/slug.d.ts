/** The id a heading's words make: lower case, letters and digits joined by hyphens. @param {string} text */
export declare function contentsSlug(text: string): string;
/**
 * Which entry is current: the first section (in page order) whose top has passed the offset line and whose bottom has not; with none,
 * the last one passed; and the last entry at the foot of the page. Pure.
 * @param {readonly { top: number, bottom: number }[]} boxes the sections' boxes, in page order, relative to the window
 * @param {number} offset the line, px from the top of the window
 * @param {boolean} atEnd the page is scrolled to its foot
 * @returns {number} the index, -1 for none
 */
export declare function currentSection(boxes: readonly {
    top: number;
    bottom: number;
}[], offset: number, atEnd: boolean): number;
