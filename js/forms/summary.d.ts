/**
 * One line per group, not per radio button: four radios in one
 * group are one thing somebody forgot to answer.
 * @param {HTMLElement[]} list
 */
export declare function dedupe(list: HTMLElement[]): HTMLElement[];
/**
 * Write the summary of the invalid fields into its element.
 * @param {HTMLElement} summary
 * @param {HTMLElement[]} bad
 * @param {{ summaryHeading: string, summaryHeadingClass: string }} look
 */
export declare function writeSummary(summary: HTMLElement, bad: HTMLElement[], { summaryHeading, summaryHeadingClass }: {
    summaryHeading: string;
    summaryHeadingClass: string;
}): void;
