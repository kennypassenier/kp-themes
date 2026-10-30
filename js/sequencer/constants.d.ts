/** The editable sequencers. */
export declare const SEQUENCER = "[data-kp-sequencer]";
/** Fired after an edit is dropped: `detail` `{ items, changed, source, total }`. */
export declare const SEQUENCER_CHANGE_EVENT = "kp-sequencer-change";
/** Fired when the selected item changes: `detail` `{ id }` (null when none). */
export declare const SEQUENCER_SELECT_EVENT = "kp-sequencer-select";
/** Fired when an edit was refused: `detail` `{ id, reason, blocker }`. */
export declare const SEQUENCER_REFUSE_EVENT = "kp-sequencer-refuse";
/** Fired when the Retry of the failed plate is pressed. */
export declare const SEQUENCER_RETRY_EVENT = "kp-sequencer-retry";
/** What one unit is, in seconds. */
export declare const SEQUENCER_UNITS: Readonly<{
    second: 1;
    minute: 60;
    hour: 3600;
    day: 86400;
    week: 604800;
}>;
/** The overlap rules. */
export declare const SEQUENCER_OVERLAPS: readonly string[];
/** The zoom limits. */
export declare const SEQUENCER_ZOOM_MIN = 0.5;
export declare const SEQUENCER_ZOOM_MAX = 16;
/** The steps an axis chooses from, in seconds. */
export declare const TICK_STEPS: number[];
export declare const EPS = 1e-9;
/** How far, in px, an edge pulls a dragged edge to it. */
export declare const REACH_PX = 8;
/** How far, in px, a pointer moves before a press is a drag. */
export declare const DRAG_PX = 4;
/** The room, as a share of the plan, the window keeps after the last item. */
export declare const HEADROOM = 0.2;
