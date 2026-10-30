/** @typedef {import('./types.js').WeekModel} WeekModel */
export type WeekModel = import('./types.js').WeekModel;
/**
 * In rows (below 40rem) a day is as tall as its items, so a week that loads again would fold every day shut and open
 * it again when the items come. Instead each day keeps the height it had while the week loads, and lets go of it only
 * once the items that end the load have arrived, so the same items move nothing; a first load starts from the days'
 * own height, as a data table's first load starts from its skeleton rows. In columns the days have a fixed height.
 * @param {WeekModel} c
 */
export declare function holdRows(c: WeekModel): void;
/**
 * Lays the busy layer over the days' columns (in rows, over the items' column), measured from the columns themselves:
 * the day heads and the hour axis stay readable beside it, as the data table's header stays above its layer.
 * @param {WeekModel} c
 */
export declare function placeBusy(c: WeekModel): void;
