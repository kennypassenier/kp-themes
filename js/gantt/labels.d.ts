export type GanttLaneModel = import('./constants.js').GanttLaneModel;
export type GanttModel = import('./constants.js').GanttModel;
/** The air, in px, between a mark's button and the bar it stands beside, or the label beside a mark. */
export declare const MARK_GAP_PX = 2;
/** The least gap, in px, between two runs of one row of a lane. */
export declare const RUN_GAP_PX = 3;
/**
 * A label that does not fit its bar stands outside it [gaps-time-1019]: after the bar when the room before the next bar or mark
 * of its row (or the plot's end) holds it, else before the bar, else it is not drawn: a label is never cut (the house rule has no
 * ellipsis), and the bar's name and card carry the words. A label stands clear of a mark beside its bar. The rows are walked in
 * time order and the room a label took is not offered to the next bar, so two labels never meet.
 * @param {GanttModel} c
 */
export declare function placeLabels(c: GanttModel): void;
