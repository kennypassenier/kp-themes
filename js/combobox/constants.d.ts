export declare const COMBOBOX = "[data-kp-combobox]";
export declare const INPUT = "input[role=\"combobox\"]";
export declare const LIST = "[role=\"listbox\"]";
export declare const STATUS = "[data-kp-combobox-status]";
export declare const TAGS = "[data-kp-tag-list]";
export declare const EMPTY = "[data-kp-combobox-empty]";
/** Announced when the list changes; the words come from the dictionary [KT5]. */
export declare const RESULTS_TEXT: (n: number) => string;
/**
 * The event a consumer listens for. A contract value [TH26]: the detail
 * carries `{ value, label, values, action }` — the value just chosen or
 * removed, its label, every value held (one for a combobox, the whole
 * set for a tag input), and which of 'add' | 'remove' | 'set' it was.
 */
export declare const CHANGE_EVENT = "kp-combobox-change";
/** Fired when the list opens or closes: `{ open }`. */
export declare const OPEN_EVENT = "kp-combobox-open";
