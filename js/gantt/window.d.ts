export type GanttBar = import('./constants.js').GanttBar;
export type GanttLaneModel = import('./constants.js').GanttLaneModel;
export type GanttModel = import('./constants.js').GanttModel;
export type GanttRun = import('./constants.js').GanttRun;
/** @typedef {import('./constants.js').GanttBar} GanttBar */
/** @typedef {import('./constants.js').GanttLaneModel} GanttLaneModel */
/** @typedef {import('./constants.js').GanttModel} GanttModel */
/** @typedef {import('./constants.js').GanttRun} GanttRun */
/**
 * Fit the window to everything the timeline holds and now [kpadopt4]: a margin of a twentieth on each side, at least an hour.
 * @param {GanttModel} c
 */
export declare function fitWindow(c: GanttModel): void;
/** The window now: its edges in relative seconds. @param {GanttModel} c */
export declare function windowOf(c: GanttModel): {
    from: number;
    end: number;
    now: number;
};
/**
 * Where a running run's planned remainder ends, in seconds from the base, or null: it needs state `running`, a `plannedEnd` that
 * reads as a time, and the option on [wish-1028].
 * @param {GanttModel} c @param {GanttRun} run
 */
export declare function restEnd(c: GanttModel, run: GanttRun): number | null;
/** The planned-remainder stretch of a running bar. @type {WeakMap<HTMLElement, HTMLElement>} */
export declare const RESTS: WeakMap<HTMLElement, HTMLElement>;
/**
 * Draw (or take away) the remainder a running bar still has: a stretch from now to the planned end, in its lane, on the bar's row.
 * @param {GanttModel} c @param {GanttLaneModel} lane @param {GanttBar} b
 */
export declare function syncRest(c: GanttModel, lane: GanttLaneModel, b: GanttBar): void;
