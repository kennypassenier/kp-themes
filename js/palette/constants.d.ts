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
/** On the palette: the key that opens it, `Mod` for Ctrl or Command (a key spec, js/key-spec.js, or the older single letter, which means `Mod` and that letter; `none` for no key). */
export declare const PALETTE_KEY_ATTRIBUTE = "data-kp-hotkey";
/** The key that opens a palette when it names none. */
export declare const PALETTE_KEY = "Mod+K";
/** On the shortcut sheet: the key that opens it (a key spec, js/key-spec.js; `none` for no key). */
export declare const SHEET_KEY_ATTRIBUTE = "data-kp-hotkey";
/** The key that opens a shortcut sheet when it names none. */
export declare const SHEET_KEY = "?";
