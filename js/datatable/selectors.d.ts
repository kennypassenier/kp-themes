export declare const TABLE = "[data-kp-datatable]";
export declare const SEARCH = "[data-kp-datatable-search]";
export declare const SCOPE = "[data-kp-datatable-scope]";
export declare const DENSITY = "[data-kp-datatable-density]";
export declare const STATUS = "[data-kp-datatable-status]";
export declare const PAGER = "[data-kp-datatable-pager]";
export declare const EMPTY = "[data-kp-datatable-empty]";
export declare const CLEAR = "[data-kp-datatable-clear]";
export declare const LOADING = "[data-kp-datatable-loading]";
export declare const FAILED = "[data-kp-datatable-failed]";
export declare const RETRY = "[data-kp-datatable-retry]";
export declare const ACTIONS = "[data-kp-datatable-actions]";
export declare const SELECTED_COUNT = "[data-kp-datatable-selected-count]";
export declare const CLEAR_SELECTION = "[data-kp-datatable-clear-selection]";
export declare const FILTERS = "[data-kp-datatable-filters]";
export declare const FILTER_TOGGLE = "[data-kp-datatable-filter-toggle]";
export declare const PILLS = "[data-kp-datatable-pills]";
export declare const ADD_FILTER = "[data-kp-datatable-add-filter]";
export declare const CARD_SORT = "[data-kp-datatable-card-sort]";
export declare const SELECT_ALL = "[data-kp-select-all]";
export declare const SELECT_ROW = "[data-kp-select-row]";
export declare const SORT_SUMMARY = "[data-kp-datatable-sort-summary]";
export declare const SORT_RESET = "[data-kp-datatable-sort-reset]";
export declare const EXPAND_ALL = "[data-kp-datatable-expand-all]";
export declare const COLLAPSE_ALL = "[data-kp-datatable-collapse-all]";
export declare const EXPAND_COLUMN = "[data-kp-expand-column]";
export declare const REORDER_COLUMN = "[data-kp-reorder-column]";
export declare const REORDER_HANDLE = "[data-kp-reorder-handle]";
export declare const ROW_TOGGLE = "[data-kp-row-toggle]";
/** A heading row that folds the rows of its group [J2]. */
export declare const GROUP_ROW = "[data-kp-row-group]";
export declare const GROUP_TOGGLE = "[data-kp-group-toggle]";
/** A slot in a group row that the table writes the group's matched row count into. */
export declare const GROUP_COUNT = "[data-kp-group-count]";
/** What in a row answers a click itself, so the click does not also open the row. */
export declare const ROW_CONTROLS = "a[href], button, input, select, textarea, label, summary, details, [contenteditable=\"\"], [contenteditable=\"true\"], [role=\"button\"], [role=\"link\"], [role=\"checkbox\"], [role=\"switch\"], [role=\"menuitem\"], [tabindex]:not([tabindex=\"-1\"])";
/** A detail row, directly after the row it belongs to. */
export declare const DETAIL = "[data-kp-row-detail]";
/**
 * A row the page holds out of the table for a while (an Undo window): `<tr data-kp-row-hidden>`. The table does not count
 * it, page it, search it or show it, and never un-hides it; the page takes the attribute off to give it back
 * [b3b4-1019; kyu gap 28].
 */
export declare const HELD_ROW = "[data-kp-row-hidden]";
export declare const EDIT_CELL = "[data-kp-edit-cell]";
export declare const EDIT_VALUE = "[data-kp-edit-value]";
export declare const EDITOR_WRAP = "[data-kp-datatable-editor-wrap]";
export declare const SKELETON_ROW = "[data-kp-skeleton-row]";
/** The package's own checkbox [gap-13]: every register already answers it. */
export declare const CHECK_CLASS = "kp-field__check";
