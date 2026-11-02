/** A chip's menu: a menu button that stands in the group right after its chip. */
export declare const CHIP_MENU = "[data-kp-segmented] > .kp-segmented__menu";
/** A menu entry that turns the chip into a field to rename it. */
export declare const RENAME_ENTRY = "[data-kp-segmented-rename]";
/** Written on the chip while it is a field. */
export declare const RENAMING = "data-kp-segmented-renaming";
/** Fired, cancelable, on the group when a chip is renamed: `{ value, label, previous, item, waitUntil(promise) }`. */
export declare const RENAME_EVENT = "kp-segmented-rename";
