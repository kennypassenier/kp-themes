export type SequencerItem = import('./units.js').SequencerItem;
/** @typedef {import('./units.js').SequencerItem} SequencerItem */
/**
 * A row of its lane for every item: the first where nothing in the way. Items that do not overlap all take row 0.
 * @param {readonly SequencerItem[]} items @param {readonly string[]} laneIds
 * @returns {{ rows: Map<string, number>, counts: Map<string, number> }}
 */
export declare function sequencerRows(items: readonly SequencerItem[], laneIds: readonly string[]): {
    rows: Map<string, number>;
    counts: Map<string, number>;
};
/** The end of the last item, 0 when there is none. @param {readonly SequencerItem[]} items */
export declare function sequencerTotalOf(items: readonly SequencerItem[]): number;
/**
 * The window that holds a plan: the longest of `minSpan` and the plan with some room, rounded up to a whole step.
 * @param {number} total @param {number} minSpan @param {number} step
 */
export declare function sequencerWindow(total: number, minSpan: number, step: number): number;
/**
 * The axis ticks of a window `span` long (in the unit) drawn `room` px wide: the step (in the unit) and the values.
 * @param {number} span @param {number} room @param {number} unitSeconds @param {number} [gap] the px a label needs
 * @returns {{ step: number, values: number[] }}
 */
export declare function sequencerTicks(span: number, room: number, unitSeconds: number, gap?: number): {
    step: number;
    values: number[];
};
/** A zoom kept inside the limits, to the hundredth. @param {number} zoom */
export declare function sequencerClampZoom(zoom: number): number;
