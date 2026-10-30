export type GanttModel = import('./constants.js').GanttModel;
export type GanttRunState = import('./constants.js').GanttRunState;
/** @typedef {import('./constants.js').GanttModel} GanttModel */
/** @typedef {import('./constants.js').GanttRunState} GanttRunState */
/**
 * The seconds a range word names: `90m`, `6h`, `24h`, `7d`. NaN when it names nothing.
 * @param {string} word
 * @returns {number}
 */
export declare function rangeSeconds(word: string): number;
/**
 * The step an axis of `span` seconds and `room` px uses: the smallest of
 * GANTT_STEPS that leaves a label at least `gap` px of its own.
 * @param {number} span
 * @param {number} room
 * @param {number} [gap]
 * @returns {number}
 */
export declare function axisStep(span: number, room: number, gap?: number): number;
/**
 * Give every run a row of its lane: the row it had when it is still free,
 * else the first free one. A run that is not ended (`e` null) is in the way
 * until the end of time, so a growing run never lands on a later one.
 *
 * @param {{ id: string, s: number, e: number | null }[]} runs in any order, seconds
 * @param {Map<string, number>} [before] the rows the runs had
 * @param {number} [pad] the seconds two runs keep between them
 * @param {{ s: number, e: number }[]} [fixed] stretches of the first row that are taken (the marks of a lane's points, as
 *   wide as they are drawn): a run keeps the same gap from them as from another run [hlthree-1019 gantt-points]
 * @returns {{ rows: Map<string, number>, count: number }}
 */
export declare function packRows(runs: {
    id: string;
    s: number;
    e: number | null;
}[], before?: Map<string, number>, pad?: number, fixed?: {
    s: number;
    e: number;
}[]): {
    rows: Map<string, number>;
    count: number;
};
/** The wall-clock offset of `zone` from UTC at `ms`, in seconds. @param {number} ms @param {string} zone */
export declare function zoneOffset(ms: number, zone: string): number;
/** @param {GanttModel} c @param {number} seconds */
export declare function duration(c: GanttModel, seconds: number): string;
/** The clock time of a moment in the zone: `14:32`. @param {GanttModel} c @param {number} ms */
export declare function clock(c: GanttModel, ms: number): string;
/** The day and time of a moment: `17/10 14:32`. @param {GanttModel} c @param {number} ms */
export declare function stamp(c: GanttModel, ms: number): string;
/** @param {GanttModel} c @param {GanttRunState} state */
export declare const stateWord: (c: GanttModel, state: GanttRunState) => string;
/** The seconds, relative to the base, of a moment. @param {GanttModel} c @param {number} ms */
export declare const rel: (c: GanttModel, ms: number) => number;
