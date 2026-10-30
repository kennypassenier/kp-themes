export type GanttModel = import('./constants.js').GanttModel;
/** @typedef {import('./constants.js').GanttModel} GanttModel */
/** Axis ticks for the window. @param {GanttModel} c @param {{ from: number, end: number }} w */
export declare function syncTicks(c: GanttModel, w: {
    from: number;
    end: number;
}): void;
/** The moments a day of the zone starts and ends, epoch ms. @param {GanttModel} c @param {string} day */
export declare function dayBounds(c: GanttModel, day: string): {
    from: number;
    to: number;
};
/** The day buttons: pressed while their day is the selection, one tab stop among them. @param {GanttModel} c */
export declare function syncDays(c: GanttModel): void;
/**
 * A tick label that would run past the axis's end edge (the newest hour entering the window) stands on the other
 * side of its rule, ending at it, so no label is ever cut by the edge.
 * @param {GanttModel} c @param {{ from: number, end: number }} w
 */
export declare function edgeTicks(c: GanttModel, w: {
    from: number;
    end: number;
}): void;
