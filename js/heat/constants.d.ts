/** A heat grid. */
export declare const HEAT = "[data-kp-heat]";
/** A matrix. */
export declare const MATRIX = "[data-kp-matrix]";
/** Fired on a heat grid when a column is picked or dropped. */
export declare const HEAT_PICK_EVENT = "kp-heat-pick";
/** Fired on a heat grid when a row label is pressed. */
export declare const HEAT_ROW_EVENT = "kp-heat-row";
/** Fired on a heat grid on Page Up and Page Down. */
export declare const HEAT_PAGE_EVENT = "kp-heat-page";
/** Fired on a matrix when a cell is pinned. */
export declare const MATRIX_PICK_EVENT = "kp-matrix-pick";
/** Fired on a heat grid, bubbling, when the Retry of its failed state is pressed [state-plates-1019]. */
export declare const HEAT_RETRY_EVENT = "kp-heat-retry";
/** Fired on a matrix (either view), bubbling, when the Retry of its failed state is pressed [state-plates-1019]. */
export declare const MATRIX_RETRY_EVENT = "kp-matrix-retry";
/** Fired on a matrix when the lit headers change. */
export declare const MATRIX_LIGHT_EVENT = "kp-matrix-light";
/** The tones a cell may carry. */
export declare const TONES: string[];
export declare const HEAT_CELL = ".kp-heat__cell[data-c]:not(.kp-skeleton)";
export declare const MATRIX_CELL = ".kp-matrix__cell[data-c]:not([data-kp-inert])";
export declare const GLYPHS: Readonly<{
    ok: "✓";
    warn: "!";
    bad: "×";
    muted: "–";
    none: "–";
}>;
