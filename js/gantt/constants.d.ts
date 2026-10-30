/** A run timeline: `section.kp-gantt[data-kp-gantt]`. */
export declare const GANTT = "[data-kp-gantt]";
/** Fired on the timeline, bubbling, when a bar was opened: `detail` `{ id, run, source: 'pointer' | 'keyboard' }`. */
export declare const GANTT_OPEN_EVENT = "kp-gantt-open";
/** Fired on the timeline, bubbling, when a range was selected or lifted: `detail` `{ from, to, source }` (epoch ms; null when lifted). */
export declare const GANTT_SELECT_EVENT = "kp-gantt-select";
/** Fired on the timeline, bubbling, when the window moved by a person: `detail` `{ from, to, span, live }` (epoch ms, span in s). */
export declare const GANTT_WINDOW_EVENT = "kp-gantt-window";
/** How often a live window moves, in ms. */
export declare const GANTT_TICK_MS = 1000;
/** Fired on the timeline, bubbling, when the Retry of its failed state is pressed [state-plates-1019]. */
export declare const GANTT_RETRY_EVENT = "kp-gantt-retry";
/** The steps an axis chooses from, in seconds. */
export declare const GANTT_STEPS: readonly number[];
/** A week step and longer starts on a Monday: 1970-01-05, in seconds [kpadopt4]. */
export declare const MONDAY = 345600;
/** Point marks closer than this, in px, are one mark with a count [kpadopt4]. */
export declare const CLUSTER_PX = 14;
/** The room a count plate takes after its mark, in px [kpadopt4]. */
export declare const CLUSTER_PLATE_PX = 24;
export type GanttRunState = 'queued' | 'running' | 'ok' | 'failed' | 'planned';
export type GanttRun = {
    /**
     * what the page calls the run; reported by `kp-gantt-open`
     */
    id: string;
    /**
     * the lane's id
     */
    lane: string;
    /**
     * what the run is, one line
     */
    label: string;
    /**
     * epoch ms or an ISO string; for a queued run, the moment it was queued; for a planned run, when it is to begin
     */
    start: number | string;
    /**
     * when it ended, or for a planned run when it is to end; ignored for a queued or running run
     */
    end?: number | string | null;
    state: GanttRunState;
    /**
     * more words for the hover card
     */
    detail?: string;
    /**
     * a running run's planned end (epoch ms or an ISO string): the time it still has is drawn after now [wish-1028]
     */
    plannedEnd?: number | string | null;
    /**
     * a finished run's colour, `--chart-1` … `--chart-5`, in place of the success colour [kpadopt3]
     */
    series?: 1 | 2 | 3 | 4 | 5;
};
export type GanttLane = {
    id: string;
    label: string;
    href?: string;
    sub?: string;
};
export type GanttPoint = {
    /**
     * what the page calls the moment; reported by `kp-gantt-open`
     */
    id: string;
    /**
     * the lane's id
     */
    lane: string;
    /**
     * epoch ms or an ISO string; a date alone (`2026-10-02`) reads as that day
     */
    at: number | string;
    /**
     * the kind's key, named in the legend by setGanttKinds
     */
    kind: string;
    /**
     * what happened, one line
     */
    label: string;
    /**
     * more words for the hover card
     */
    detail?: string;
    /**
     * still to come: a hollow mark
     */
    planned?: boolean;
};
export type GanttShape = 'dot' | 'diamond' | 'square' | 'triangle' | 'ring';
export type GanttKind = {
    kind: string;
    label: string;
    shape?: GanttShape;
    series?: 1 | 2 | 3 | 4 | 5;
    tone?: 'success' | 'warning' | 'destructive' | 'info' | 'muted';
};
export type GanttZone = {
    id?: string;
    lane?: string;
    from: number | string;
    to: number | string;
    label: string;
    tone?: 'warning' | 'info' | 'muted';
};
export type GanttLegendEntry = {
    series: 1 | 2 | 3 | 4 | 5;
    label: string;
};
export type GanttState = 'loading' | 'ready' | 'empty' | 'error';
export type Strings = import('../strings.js').Strings;
export type GanttDecorateInfo = {
    kind: 'bar' | 'live' | 'zoom' | 'clear';
    host: HTMLElement;
    key?: string;
    id?: string;
};
export type GanttOptions = {
    /**
     * the IANA zone of the axis labels; else `data-kp-time-zone`, else `Europe/Brussels`
     */
    timeZone?: string;
    /**
     * the clock, `Date.now` by default
     */
    now?: () => number;
    /**
     * any of the dictionary's words, for these timelines only
     */
    strings?: Partial<Strings>;
    decorate?: (part: HTMLElement, info: GanttDecorateInfo) => void;
};
export type GanttBar = {
    run: GanttRun;
    s: number;
    e: number | null;
    bar: HTMLButtonElement;
    row: number;
};
export type GanttLaneModel = {
    lane: GanttLane;
    label: HTMLElement;
    track: HTMLElement;
    bars: GanttBar[];
    points: HTMLButtonElement[];
    rows: number;
};
export type GanttModel = {
    el: HTMLElement;
    zone: string;
    now: () => number;
    strings: Strings;
    decorate?: GanttOptions['decorate'];
    base: number;
    span: number;
    live: boolean;
    to: number;
    runs: GanttRun[];
    lanesGiven: GanttLane[];
    lanes: GanttLaneModel[];
    bars: Map<string, HTMLButtonElement>;
    states: Map<string, GanttRunState>;
    state: GanttState;
    active: string | null;
    selected: {
        from: number;
        to: number;
    } | null;
    body: HTMLElement;
    scroll: HTMLElement;
    axis: HTMLElement;
    plot: HTMLElement;
    lines: HTMLElement;
    nowLine: HTMLElement;
    brushBox: HTMLElement;
    selectBox: HTMLElement;
    stateLine: HTMLElement;
    plate: HTMLElement;
    plateKey: string;
    plateText: string;
    plateArt: Node | string | null;
    announcer: HTMLElement;
    ranges: HTMLElement;
    liveButton: HTMLButtonElement;
    selection: HTMLElement;
    selectionText: HTMLElement;
    ticks: Map<number, {
        label: HTMLElement;
        line: HTMLElement;
    }>;
    legend: HTMLElement;
    days: boolean;
    dayStop: string | null;
    points: GanttPoint[];
    pointEls: Map<string, HTMLButtonElement>;
    kinds: GanttKind[];
    zones: GanttZone[];
    fit: boolean;
    line: boolean;
    ghosts: HTMLElement[];
    held: number | null;
    busy: import('../busy-card.js').BusyCard | null;
    leaving: Promise<void> | null;
    drawn: boolean;
    timer: number;
    observer: ResizeObserver | null;
    drag: {
        a: number;
        b: number;
    } | null;
    dragMoved: boolean;
    tickKey: string;
    labels: Map<HTMLElement, {
        key: string;
        width: number;
    }>;
    outside: Map<HTMLElement, HTMLElement>;
};
/**
 * @typedef {'queued' | 'running' | 'ok' | 'failed' | 'planned'} GanttRunState
 * @typedef {object} GanttRun
 * @property {string} id what the page calls the run; reported by `kp-gantt-open`
 * @property {string} lane the lane's id
 * @property {string} label what the run is, one line
 * @property {number | string} start epoch ms or an ISO string; for a queued run, the moment it was queued; for a planned run, when it is to begin
 * @property {number | string | null} [end] when it ended, or for a planned run when it is to end; ignored for a queued or running run
 * @property {GanttRunState} state
 * @property {string} [detail] more words for the hover card
 * @property {number | string | null} [plannedEnd] a running run's planned end (epoch ms or an ISO string): the time it still has is drawn after now [wish-1028]
 * @property {1 | 2 | 3 | 4 | 5} [series] a finished run's colour, `--chart-1` … `--chart-5`, in place of the success colour [kpadopt3]
 * @typedef {{ id: string, label: string, href?: string, sub?: string }} GanttLane
 * @typedef {object} GanttPoint
 * @property {string} id what the page calls the moment; reported by `kp-gantt-open`
 * @property {string} lane the lane's id
 * @property {number | string} at epoch ms or an ISO string; a date alone (`2026-10-02`) reads as that day
 * @property {string} kind the kind's key, named in the legend by setGanttKinds
 * @property {string} label what happened, one line
 * @property {string} [detail] more words for the hover card
 * @property {boolean} [planned] still to come: a hollow mark
 * @typedef {'dot' | 'diamond' | 'square' | 'triangle' | 'ring'} GanttShape
 * @typedef {{ kind: string, label: string, shape?: GanttShape, series?: 1 | 2 | 3 | 4 | 5, tone?: 'success' | 'warning' | 'destructive' | 'info' | 'muted' }} GanttKind
 * @typedef {{ id?: string, lane?: string, from: number | string, to: number | string, label: string, tone?: 'warning' | 'info' | 'muted' }} GanttZone
 * @typedef {{ series: 1 | 2 | 3 | 4 | 5, label: string }} GanttLegendEntry
 * @typedef {'loading' | 'ready' | 'empty' | 'error'} GanttState
 * @typedef {import('../strings.js').Strings} Strings
 *
 * @typedef {{ kind: 'bar' | 'live' | 'zoom' | 'clear', host: HTMLElement, key?: string, id?: string }} GanttDecorateInfo
 * @typedef {object} GanttOptions
 * @property {string} [timeZone] the IANA zone of the axis labels; else `data-kp-time-zone`, else `Europe/Brussels`
 * @property {() => number} [now] the clock, `Date.now` by default
 * @property {Partial<Strings>} [strings] any of the dictionary's words, for these timelines only
 * @property {(part: HTMLElement, info: GanttDecorateInfo) => void} [decorate]
 *
 * @typedef {{ run: GanttRun, s: number, e: number | null, bar: HTMLButtonElement, row: number }} GanttBar
 * @typedef {{ lane: GanttLane, label: HTMLElement, track: HTMLElement, bars: GanttBar[], points: HTMLButtonElement[], rows: number }} GanttLaneModel
 * @typedef {{ el: HTMLElement, zone: string, now: () => number, strings: Strings, decorate?: GanttOptions['decorate'],
 *   base: number, span: number, live: boolean, to: number, runs: GanttRun[], lanesGiven: GanttLane[], lanes: GanttLaneModel[],
 *   bars: Map<string, HTMLButtonElement>, states: Map<string, GanttRunState>, state: GanttState, active: string | null,
 *   selected: { from: number, to: number } | null, body: HTMLElement, scroll: HTMLElement, axis: HTMLElement,
 *   plot: HTMLElement, lines: HTMLElement, nowLine: HTMLElement, brushBox: HTMLElement, selectBox: HTMLElement,
 *   stateLine: HTMLElement, plate: HTMLElement, plateKey: string, plateText: string, plateArt: Node | string | null, announcer: HTMLElement, ranges: HTMLElement, liveButton: HTMLButtonElement,
 *   selection: HTMLElement, selectionText: HTMLElement, ticks: Map<number, { label: HTMLElement, line: HTMLElement }>,
 *   legend: HTMLElement, days: boolean, dayStop: string | null,
 *   points: GanttPoint[], pointEls: Map<string, HTMLButtonElement>, kinds: GanttKind[], zones: GanttZone[], fit: boolean, line: boolean,
 *   ghosts: HTMLElement[], held: number | null, busy: import('../busy-card.js').BusyCard | null, leaving: Promise<void> | null, drawn: boolean, timer: number, observer: ResizeObserver | null, drag: { a: number, b: number } | null, dragMoved: boolean, tickKey: string, labels: Map<HTMLElement, { key: string, width: number }>, outside: Map<HTMLElement, HTMLElement> }} GanttModel
 */
/** The timelines whose own sideways scroll has been put at the live end once [wish-1028]. @type {WeakSet<Element>} */
export declare const OPENED: WeakSet<Element>;
/** @type {WeakMap<Element, GanttModel>} */
export declare const gantts: WeakMap<Element, GanttModel>;
/** Two digits. @param {number} n */
export declare const two: (n: number) => string;
/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {Document} doc
 * @param {K} tag
 * @param {string} [className]
 * @param {string} [text]
 * @returns {HTMLElementTagNameMap[K]}
 */
export declare const make: <K extends keyof HTMLElementTagNameMap>(doc: Document, tag: K, className?: string, text?: string) => HTMLElementTagNameMap[K];
/** @param {number | string} when @returns {number} */
export declare const toMs: (when: number | string) => number;
/** @param {Element} host @returns {string | undefined} */
export declare const keyOf: (host: Element) => string | undefined;
