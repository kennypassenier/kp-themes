export type GanttModel = import('./constants.js').GanttModel;
/** @typedef {import('./constants.js').GanttModel} GanttModel */
/**
 * While the timeline loads, the data table's own loading card stands centred over its lanes (Kenny, 2026-10-16:
 * "zoals bij een table waar het icoon in het midden van de matrix staat en lijkt te laden"): js/busy-card.js, the
 * layer and panel js/datatable.js drawOverlay() builds, so every theme dresses it as it dresses its busy table. The
 * toolbar, the axis and the lane names stay readable beside it; the frame keeps its height (the ghost lanes, or the
 * lanes it had). It arrives the theme's way, except on the first render, and leaves as the busy table's layer leaves;
 * the runs are drawn once it has gone. The sentence is still read out (`role="status"`), no longer drawn.
 * @param {GanttModel} c
 */
export declare function drawBusy(c: GanttModel): void;
/** Ghost lanes while loading with no lanes yet. @param {GanttModel} c */
export declare function paintGhosts(c: GanttModel): void;
