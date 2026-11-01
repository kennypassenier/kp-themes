export type GanttBar = import('./constants.js').GanttBar;
export type GanttModel = import('./constants.js').GanttModel;
export type Span = {
    l: number;
    r: number;
};
export type Side = 'inside' | 'after' | 'before' | 'below';
export type Placed = {
    side: Side;
    at: number;
    row: number;
    inset: number;
};
/** The timeline fits its width. @param {GanttModel} c */
export declare const isFit: (c: GanttModel) => boolean;
/**
 * Pack one lane's bars into rows for the fitted timeline and remember where each label goes. The lane's point marks (`marks`, seconds)
 * hold their stretch of the first row, as in packRows.
 * @param {GanttModel} c @param {GanttBar[]} bars in time order @param {{ s: number, e: number }[]} marks @param {number} minBar px
 * @returns {{ rows: Map<string, number>, count: number }}
 */
export declare function packFit(c: GanttModel, bars: GanttBar[], marks: {
    s: number;
    e: number;
}[], minBar: number): {
    rows: Map<string, number>;
    count: number;
};
/** Put every label where the last paint placed it. @param {GanttModel} c */
export declare function placeFitLabels(c: GanttModel): void;
