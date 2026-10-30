/** An inline SVG drawn from the numbers in its attribute. */
export declare const SPARK = "svg[data-kp-spark]";
/** A KPI tile that turns a filter on this page on or off. */
export declare const KPI_TOGGLE = "button.kp-kpi--toggle";
/** Fired on the tile, bubbling, after it was pressed: `detail.pressed`. */
export declare const KPI_TOGGLE_EVENT = "kp-kpi-toggle";
/** A used-of-total bar: anywhere, or at the bottom of a key figure. */
export declare const METER = ".kp-meter, .kp-kpi__meter";
/** A strip whose column count comes from a list of allowed counts. */
export declare const KPI_STRIP = ".kp-kpis[data-kp-kpis-columns]";
/** A tile's label in a strip with columns: one line, never wrapped and never cut [fix-99, fix-101]. */
export declare const TILE_LABEL = ":scope > .kp-kpi:not([hidden]) > .kp-kpi__label";
/** The sparkline's box and the room its line keeps from the box's edge. */
export declare const SPARK_BOX: {
    width: number;
    height: number;
    pad: number;
};
/** The SVG namespace. */
export declare const SVG_NS = "http://www.w3.org/2000/svg";
/** The least width of a tile, its gap, and the allowed counts when the strip names none. */
export declare const STRIP_DEFAULTS: {
    minTilePx: number;
    gapPx: number;
    allowed: string;
};
/** The font size a length in rem or em falls back to, in px. */
export declare const FALLBACK_FONT_PX = 16;
/** How far past its tile's edge a label may reach before it counts as cut, in px (sub-pixel rounding). */
export declare const LABEL_SLACK_PX = 0.5;
/** A full meter in per cent. */
export declare const FULL_PERCENT = 100;
