/** A list toolbar. */
export declare const TOOLBAR = "[data-kp-toolbar]";
/** Fired on the toolbar when a tag's cross is pressed; `{ id, label }`. */
export declare const TOOLBAR_REMOVE_EVENT = "kp-toolbar-remove";
/** Fired on the toolbar when Clear all is pressed. */
export declare const TOOLBAR_CLEAR_EVENT = "kp-toolbar-clear";
export declare const SEARCH = ".kp-toolbar__input";
export declare const ACTIVE = ".kp-toolbar__active";
export declare const LIST = ".kp-toolbar__active-list";
export declare const CLEAR = "[data-kp-toolbar-clear]";
export declare const REMOVE = ".kp-toolbar__active .kp-tag__remove";
/** On the toolbar: the key that focuses its search from anywhere that is not a field (a key spec, js/key-spec.js; `none` for no key). */
export declare const TOOLBAR_KEY_ATTRIBUTE = "data-kp-toolbar-key";
/** The key that focuses the search when the toolbar names none: no key, a page opts in with `/`. */
export declare const TOOLBAR_KEY = "none";
