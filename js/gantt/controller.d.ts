import { GanttInput } from './input.js';
/** One timeline: its model sits in the `gantts` registry the setters read; the last plot width sits on the instance. */
export declare class GanttControl extends GanttInput {
    /** The plot width last laid out, so a resize that keeps it does nothing. */
    lastWidth: number;
    /** @param {HTMLElement} host @param {import('./constants.js').GanttOptions} [options] */
    constructor(host: HTMLElement, options?: import('./constants.js').GanttOptions);
    connect(): void;
    /** The toolbar, the legend and the hint changed: draw them again. */
    redrawChrome(): void;
    /** A web font that arrives after the first measure changes every width: the labels are measured again. */
    watchFonts(): void;
    /** Another plot width packs the rows and measures the lanes again. */
    watchWidth(): void;
    /** The plot changed size: pack, measure and tick again when its width moved. */
    onWidth(): void;
    /** A press on a point, a bar or a toolbar button. @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
    /** @param {MouseEvent} event */
    sourceOf(event: MouseEvent): "keyboard" | "pointer";
    /** Open a point mark; a mark with a count opens with every point it stands for. @param {HTMLButtonElement} bar @param {MouseEvent} event */
    openPoint(bar: HTMLButtonElement, event: MouseEvent): void;
    /** @param {HTMLButtonElement} bar @param {MouseEvent} event */
    openRun(bar: HTMLButtonElement, event: MouseEvent): void;
    /** Live, a day stop, Clear or Zoom. @param {HTMLButtonElement} button */
    onButton(button: HTMLButtonElement): void;
    /** A day stop selects its day, or lifts the selection when it was the one pressed. @param {HTMLButtonElement} button */
    pressDay(button: HTMLButtonElement): void;
    /** The range control chose a window length, or "all" to fit everything. @param {Event} event */
    onRange(event: Event): void;
}
