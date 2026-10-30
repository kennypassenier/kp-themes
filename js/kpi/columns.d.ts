/**
 * How many columns a strip of `n` tiles takes at `width`: the first allowed
 * count whose tiles are at least `minTilePx` wide; then, if that leaves one
 * tile alone on the last row, the next smaller allowed count (two or more)
 * that does not; failing that the count stays and the last tile spans its
 * row. `all` in the list is `n`.
 * @param {number} n
 * @param {number} width the strip's inner width, px
 * @param {{ allowed?: (number | 'all')[] | string, minTilePx?: number, gapPx?: number }} [options]
 * @returns {{ columns: number, spanLast: boolean }}
 */
export declare function kpiColumns(n: number, width: number, { allowed, minTilePx, gapPx }?: {
    allowed?: (number | 'all')[] | string;
    minTilePx?: number;
    gapPx?: number;
}): {
    columns: number;
    spanLast: boolean;
};
/**
 * Put one strip on its column count now: kpiColumns() over its shown
 * tiles, its inner width (or `width`), `--kp-kpi-min` (9rem) and its column
 * gap; writes `--kp-kpis-columns` and `data-kp-kpis-span-last`. A tile's
 * label is one line and never cut, so while one does not fit its tile the
 * strip takes its next smaller allowed count: the tile grows to its label,
 * and every tile in the row with it [fix-99]. The count thus respects the
 * widest label as well as `--kp-kpi-min`, at desk width and in a phone
 * pane alike [fix-101].
 * @param {HTMLElement} strip
 * @param {number} [width] px; else measured
 */
export declare function fitKpiStrip(strip: HTMLElement, width?: number): void;
