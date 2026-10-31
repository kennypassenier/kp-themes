export type GanttModel = import('./constants.js').GanttModel;
export type GanttOptions = import('./constants.js').GanttOptions;
/**
 * The model of a timeline not drawn yet: every part points at the element until build() lays the real ones.
 * @param {HTMLElement} el
 * @param {GanttOptions} options
 * @returns {GanttModel}
 */
export declare function newModel(el: HTMLElement, options: GanttOptions): GanttModel;
/** A new window: lanes may need fewer rows again, the axis starts over. @param {GanttModel} c */
export declare function freshWindow(c: GanttModel): void;
/** @param {GanttModel} c @param {boolean} live */
export declare function setLive(c: GanttModel, live: boolean): void;
