export type GanttBar = import('./constants.js').GanttBar;
export type GanttModel = import('./constants.js').GanttModel;
/** The words of a bar's name and card. @param {GanttModel} c @param {GanttBar} b */
export declare function wordsOf(c: GanttModel, b: GanttBar): {
    name: string;
    card: string;
};
/** Build the chrome once. @param {GanttModel} c */
export declare function build(c: GanttModel): void;
/** Move the window (custom properties only); tick labels follow when the set changes. @param {GanttModel} c */
export declare function frame(c: GanttModel): {
    from: number;
    end: number;
    now: number;
};
