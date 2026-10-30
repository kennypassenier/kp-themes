export type WeekModel = import('./types.js').WeekModel;
/**
 * From here on, what comes later in this agenda arrives the theme's way (js/motion.js: the register's own arrival, one
 * after the other): the items that end a loading state, a new item of a live update, the days of the next range. A
 * pill that is still there keeps its node, so a refresh with the same items moves nothing. Asked by an agenda that can
 * load (its first loading state) or move (its week buttons); one that only ever shows what it was given stays still.
 * @param {WeekModel} c
 */
export declare function watchArrivals(c: WeekModel): void;
/** Build the chrome once; the days are filled by paint(). @param {WeekModel} c */
export declare function build(c: WeekModel): void;
/** (Re)build the day columns for the range; keeps the pills by id. @param {WeekModel} c */
export declare function buildDays(c: WeekModel): void;
