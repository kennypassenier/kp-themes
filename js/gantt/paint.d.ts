export type GanttBar = import('./constants.js').GanttBar;
export type GanttLane = import('./constants.js').GanttLane;
export type GanttLaneModel = import('./constants.js').GanttLaneModel;
export type GanttModel = import('./constants.js').GanttModel;
/** @typedef {import('./constants.js').GanttBar} GanttBar */
/** @typedef {import('./constants.js').GanttLane} GanttLane */
/** @typedef {import('./constants.js').GanttLaneModel} GanttLaneModel */
/** @typedef {import('./constants.js').GanttModel} GanttModel */
/** Everything the timeline shows, from the model. @param {GanttModel} c */
export declare function paint(c: GanttModel): void;
/**
 * The scrolling viewport keeps the height it first had with data: a start that needs more rows than the lanes reserved scrolls
 * inside the frame instead of moving the page. A change the person asks for (range, Live, Zoom) or the page's own `loading`
 * releases it. @param {GanttModel} c
 */
export declare function holdHeight(c: GanttModel): void;
