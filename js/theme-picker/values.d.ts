export declare const PICKER = "[data-kp-theme-picker]";
export declare const OPTION = "[data-kp-theme]";
export declare const STATUS = "[data-kp-theme-status]";
/** Dispatched on the picker, bubbling, when a person chose a theme here: `{ theme, stored }`. */
export declare const PICK_EVENT = "kp-theme-pick";
/** Dispatched on the picker, bubbling, when a theme is previewed or the preview ends: `{ theme }`, `{ theme: null }` at the end. */
export declare const PREVIEW_EVENT = "kp-theme-preview";
/** How long a preview waits before it goes back, in ms: crossing the gap between two buttons is not a leave. */
export declare const PREVIEW_LEAVE_MS = 90;
