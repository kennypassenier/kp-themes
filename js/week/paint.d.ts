export type WeekItem = import('./types.js').WeekItem;
export type WeekModel = import('./types.js').WeekModel;
/** Everything the week shows, from the model. @param {WeekModel} c */
export declare function paint(c: WeekModel): void;
/** Place the pills of every column, fold what does not fit. @param {WeekModel} c */
export declare function layout(c: WeekModel): void;
/** The now-line and the past marks. @param {WeekModel} c */
export declare function tick(c: WeekModel): void;
