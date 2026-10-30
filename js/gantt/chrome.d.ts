export type GanttLaneModel = import('./constants.js').GanttLaneModel;
export type GanttModel = import('./constants.js').GanttModel;
/** @typedef {import('./constants.js').GanttLaneModel} GanttLaneModel */
/** @typedef {import('./constants.js').GanttModel} GanttModel */
/**
 * The stretches under the marks [kpadopt4]: a lane's own as a thin band in its track, the whole plot's as a band behind
 * every lane, named in the legend. Drawn again on every paint; they hold no focus.
 * @param {GanttModel} c @param {GanttLaneModel[]} lanes
 */
export declare function paintZones(c: GanttModel, lanes: GanttLaneModel[]): void;
/**
 * The legend's states and the legend as a whole: the states go when there are no runs [kpadopt4], when the timeline asks for none
 * (`data-kp-gantt-legend="off"`) and, for `planned`, when no run is planned; a legend with nothing left is not drawn [gaps-time-1019].
 * @param {GanttModel} c
 */
export declare function syncLegend(c: GanttModel): void;
/**
 * The toolbar, the legend and the hint as the options ask [gaps-time-1019]; drawn again when an option changes.
 * @param {GanttModel} c
 */
export declare function paintChrome(c: GanttModel): void;
/** The kinds and the plot's stretches in the legend, after the states; the states go when there are no runs [kpadopt4]. @param {GanttModel} c */
export declare function paintKinds(c: GanttModel): void;
