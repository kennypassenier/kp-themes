export declare const PALETTE = "[data-kp-palette]";
export declare const SHEET = "[data-kp-shortcuts]";
export declare const INPUT = "input[role=\"combobox\"]";
export declare const LIST = "[role=\"listbox\"]";
export declare const STATUS = "[role=\"status\"]";
export declare const GROUP = "[data-kp-group]";
/** The attribute that opens a palette or a sheet on a press [gap-12]. */
export declare const OPENER = "[data-kp-palette-open]";
/** An empty `<kbd>` inside an opener that the module fills with the hotkey [scope-48]. */
export declare const KEYS_SLOT = "[data-kp-palette-keys]";
/** Fired on the palette when a command is chosen, cancelable. A contract value [TH26]: `{ value, option, href }`. */
export declare const RUN_EVENT = "kp-palette-run";
/** Fired on the palette or the sheet when it opens or closes: `{ open }`. */
export declare const OPEN_EVENT = "kp-palette-open";
/** @param {number} n */
export declare const RESULTS_TEXT: (n: number) => string;
