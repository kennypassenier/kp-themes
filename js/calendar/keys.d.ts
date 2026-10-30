/**
 * The day a key moves the focus to from `iso`, or null for a key the grid does not take. Arrows move a day or a week, Home and End go
 * to the week's ends, Page Up and Page Down change the month (with Shift, the year).
 * @param {string} key @param {boolean} shift @param {string} iso `YYYY-MM-DD` @param {number} firstDay
 * @returns {string | null}
 */
export declare function targetDay(key: string, shift: boolean, iso: string, firstDay: number): string | null;
