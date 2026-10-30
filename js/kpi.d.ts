export { SPARK, KPI_TOGGLE, KPI_TOGGLE_EVENT, METER, KPI_STRIP } from './kpi/values.js';
export { sparkPaths, drawSparkline } from './kpi/spark.js';
export { meterParts, meterText, setMeter } from './kpi/meter.js';
export { kpiColumns, fitKpiStrip } from './kpi/columns.js';
export type Meter = {
    /**
     * the share, 0 up (1 is full; above 1 the bar is full and says so); null is not measured
     */
    value?: number | null;
    /**
     * a tick at this share (a target, a limit, what is booked), 0 up; null is none
     */
    mark?: number | null;
    /**
     * the fill's colour (`success` good, `neutral` quiet); a tone on the tile around it does the same
     */
    tone?: 'success' | 'neutral' | 'warning' | 'destructive' | null;
    /**
     * what the share is, in the words a screen reader hears ("full"); `meterUsed` unless given
     */
    label?: string;
    /**
     * what the mark is ("the target level")
     */
    markLabel?: string;
    /**
     * the track pulses at its height, with no fill and no mark
     */
    loading?: boolean;
};
/**
 * @typedef {object} Meter
 * @property {number | null} [value] the share, 0 up (1 is full; above 1 the bar is full and says so); null is not measured
 * @property {number | null} [mark] a tick at this share (a target, a limit, what is booked), 0 up; null is none
 * @property {'success' | 'neutral' | 'warning' | 'destructive' | null} [tone] the fill's colour (`success` good, `neutral` quiet); a tone on the tile around it does the same
 * @property {string} [label] what the share is, in the words a screen reader hears ("full"); `meterUsed` unless given
 * @property {string} [markLabel] what the mark is ("the target level")
 * @property {boolean} [loading] the track pulses at its height, with no fill and no mark
 */
/**
 * Draw every `svg[data-kp-spark="12 14 13 …"]` under `root`, and redraw one
 * whenever its numbers change.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachSparklines(root?: ParentNode): () => void;
/**
 * Wire every KPI toggle under `root`: a click flips `aria-pressed` and fires
 * `kp-kpi-toggle`; the page does the filtering. A tile marked
 * `data-kp-kpi-owned` is left to the page (a framework that keeps the
 * pressed state itself).
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachKpiToggles(root?: ParentNode): () => void;
/**
 * Keep every `.kp-kpis[data-kp-kpis-columns="all 3 2 1"]` under `root` on an
 * allowed column count, by the strip's own width (not the window's), with no
 * tile alone on a row; and again when tiles come, go or hide, and for a
 * strip added later. Before this runs a strip keeps the package's auto-fit.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachKpiStrips(root?: ParentNode): () => void;
