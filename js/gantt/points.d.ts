export type GanttLane = import('./constants.js').GanttLane;
export type GanttLaneModel = import('./constants.js').GanttLaneModel;
export type GanttModel = import('./constants.js').GanttModel;
export type GanttPoint = import('./constants.js').GanttPoint;
/** @typedef {import('./constants.js').GanttLane} GanttLane */
/** @typedef {import('./constants.js').GanttLaneModel} GanttLaneModel */
/** @typedef {import('./constants.js').GanttModel} GanttModel */
/** @typedef {import('./constants.js').GanttPoint} GanttPoint */
/**
 * A lane's name: a link when the lane has `href`, and a second line when it has `sub` [kpadopt4].
 * @param {GanttModel} c @param {HTMLElement} label @param {GanttLane} lane
 */
export declare function fillLaneLabel(c: GanttModel, label: HTMLElement, lane: GanttLane): void;
/** The points as marks in their lanes, by id, in time order [kpadopt4]. @param {GanttModel} c @param {GanttLaneModel[]} lanes */
export declare function paintPoints(c: GanttModel, lanes: GanttLaneModel[]): void;
/**
 * Marks closer than the eye can tell apart become one mark with a count, whose name and card name them all [kpadopt4].
 * Measured against the plot's width, so it follows a resize and a new window.
 * @param {GanttModel} c
 */
export declare function clusterPoints(c: GanttModel): void;
