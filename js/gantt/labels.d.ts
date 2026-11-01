export type GanttLaneModel = import('./constants.js').GanttLaneModel;
export type GanttModel = import('./constants.js').GanttModel;
/**
 * How wide a bar's label wants to be on one line: its text in its own font, the bar's padding and, on a failed bar, the cross.
 * Measured once per text and font (a label hidden by its narrow bar can be measured too), and again only when either changes.
 * @param {GanttModel} c @param {HTMLElement} bar
 */
export declare function labelWidth(c: GanttModel, bar: HTMLElement): number;
/** The air, in px, between a mark's button and the bar it stands beside, or the label beside a mark. */
export declare const MARK_GAP_PX = 2;
/** The least gap, in px, between two runs of one row of a lane. */
export declare const RUN_GAP_PX = 3;
/**
 * The label that stands outside a bar: a sibling of the bar in its lane (a bar clips what is inside it, and a theme may cut its
 * corners), placed by the same custom properties as the bar, so it moves with the window as the bar does.
 * @param {GanttModel} c @param {GanttLaneModel} lane @param {HTMLElement} bar @param {'after' | 'before' | 'below' | ''} side @param {number} room px
 * @param {number} [shift] px the label stands clear of a mark that is beside the bar, away from the bar
 * @param {number} [row] the row the label stands on, when not its bar's (a fitted label on its own line under the bar)
 */
export declare function setOutside(c: GanttModel, lane: GanttLaneModel, bar: HTMLElement, side: 'after' | 'before' | 'below' | '', room: number, shift?: number, row?: number): void;
/** The outside labels of bars that are gone or out of the window go with them. @param {GanttModel} c */
export declare function dropOutside(c: GanttModel): void;
/**
 * A label that does not fit its bar stands outside it [gaps-time-1019]: after the bar when the room before the next bar or mark
 * of its row (or the plot's end) holds it, else before the bar, else it is not drawn: a label is never cut (the house rule has no
 * ellipsis), and the bar's name and card carry the words. A label stands clear of a mark beside its bar. The rows are walked in
 * time order and the room a label took is not offered to the next bar, so two labels never meet.
 * @param {GanttModel} c
 */
export declare function placeLabels(c: GanttModel): void;
