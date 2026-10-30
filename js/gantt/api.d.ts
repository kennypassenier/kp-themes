export type GanttKind = import('./constants.js').GanttKind;
export type GanttLane = import('./constants.js').GanttLane;
export type GanttLegendEntry = import('./constants.js').GanttLegendEntry;
export type GanttPoint = import('./constants.js').GanttPoint;
export type GanttRun = import('./constants.js').GanttRun;
export type GanttState = import('./constants.js').GanttState;
export type GanttZone = import('./constants.js').GanttZone;
/** @typedef {import('./constants.js').GanttKind} GanttKind */
/** @typedef {import('./constants.js').GanttLane} GanttLane */
/** @typedef {import('./constants.js').GanttLegendEntry} GanttLegendEntry */
/** @typedef {import('./constants.js').GanttPoint} GanttPoint */
/** @typedef {import('./constants.js').GanttRun} GanttRun */
/** @typedef {import('./constants.js').GanttState} GanttState */
/** @typedef {import('./constants.js').GanttZone} GanttZone */
/**
 * The runs and the lanes. Repaints in place, by id: a bar that is still there
 * keeps its node, its focus and its row, so a live update never moves a
 * reader. A timeline that was loading is ready from here on. `lanes` may be
 * left out: a run's `lane` is then its own label, in the order first seen.
 * @param {Element} el
 * @param {GanttRun[]} runs
 * @param {GanttLane[]} [lanes]
 */
export declare function setGanttRuns(el: Element, runs: GanttRun[], lanes?: GanttLane[]): void;
/**
 * The timeline as a whole: `loading` (ghost lanes at their final size),
 * `ready`, `empty` or `error`. An empty or failed timeline is the package's state plate over the whole plot (`words` its
 * heading, `text` its sentence, `art` a picture over the heading), an error with a Retry that fires `kp-gantt-retry`
 * [state-plates-1019].
 * @param {Element} el
 * @param {GanttState} state
 * @param {string} [words]
 * @param {{ text?: string, art?: Node | string | null }} [plate]
 */
export declare function setGanttState(el: Element, state: GanttState, words?: string, { text, art }?: {
    text?: string;
    art?: Node | string | null;
}): void;
/**
 * Set the window; no event, the page asked. `span` in seconds; `live: false`
 * with `to` (epoch ms) holds the window there.
 * @param {Element} el
 * @param {{ span?: number, live?: boolean, to?: number }} window
 */
export declare function setGanttWindow(el: Element, window: {
    span?: number;
    live?: boolean;
    to?: number;
}): void;
/**
 * Show a selected range (epoch ms) or none (null); no event, the page asked.
 * @param {Element} el
 * @param {{ from: number, to: number } | null} selection
 */
export declare function setGanttSelection(el: Element, selection: {
    from: number;
    to: number;
} | null): void;
/**
 * Name the series of the runs in the legend, after the states [kpadopt3]: a swatch in the series' colour and its words per
 * entry, in the order given; none takes them away again. The states stay as they are.
 * @param {Element} el
 * @param {GanttLegendEntry[]} entries
 */
export declare function setGanttLegend(el: Element, entries: GanttLegendEntry[]): void;
/**
 * The moments on the timeline [kpadopt4]: each point a mark in its lane, in the colour and shape of its kind. Repaints in
 * place, by id, as setGanttRuns does; a timeline that was loading is ready from here on. `lanes` may be left out, as there.
 * @param {Element} el
 * @param {GanttPoint[]} points
 * @param {GanttLane[]} [lanes]
 */
export declare function setGanttPoints(el: Element, points: GanttPoint[], lanes?: GanttLane[]): void;
/**
 * The kinds of the points, named in the legend in the order given [kpadopt4]: `shape` (`dot` by default, `diamond`,
 * `square`, `triangle`, `ring`) and a colour, `series` 1 to 5 (`--chart-N`) or `tone`. A timeline with points and no runs
 * leaves the run states out of its legend.
 * @param {Element} el
 * @param {GanttKind[]} kinds
 */
export declare function setGanttKinds(el: Element, kinds: GanttKind[]): void;
/**
 * The stretches under the marks [kpadopt4]: with `lane`, a thin band in that lane (waiting since the last contact); without,
 * a band behind every lane (the days a follow-up is due), named in the legend. `tone` `warning` (default), `info`, `muted`.
 * @param {Element} el
 * @param {GanttZone[]} zones
 */
export declare function setGanttZones(el: Element, zones: GanttZone[]): void;
