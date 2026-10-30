export type GanttModel = import('./constants.js').GanttModel;
/** @typedef {import('./constants.js').GanttModel} GanttModel */
/** Hide a bar wholly outside the window (it takes no tab stop). @param {GanttModel} c */
export declare function visible(c: GanttModel): void;
/** Words that grow with the clock: a running bar's name and card. @param {GanttModel} c @param {number} nowMs */
export declare function refresh(c: GanttModel, nowMs: number): void;
/** The bars a person can reach, per lane, in time order. @param {GanttModel} c */
export declare function reachableLanes(c: GanttModel): HTMLButtonElement[][];
/** One tab stop: the active bar. @param {GanttModel} c */
export declare function syncTabStops(c: GanttModel): void;
/** @param {GanttModel} c @param {HTMLElement} to */
export declare function focusBar(c: GanttModel, to: HTMLElement): void;
/** @param {GanttModel} c */
export declare function paintSelection(c: GanttModel): void;
/** @param {GanttModel} c @param {'range' | 'zoom' | 'live'} why */
export declare function announceWindow(c: GanttModel, why: 'range' | 'zoom' | 'live'): void;
/** One second of the clock. @param {GanttModel} c */
export declare function tick(c: GanttModel): void;
