/** An add row: a `form[data-kp-form]` that adds one line. */
export declare const ADD_ROW = "[data-kp-addrow]";
/** The id of the data table whose columns the fields stand under (none: a line in a form grid). */
export declare const ADD_ROW_FOR = "data-kp-addrow-for";
/** On a field's cell: the column it stands under, by id (`data-kp-field`, else its words) or number. */
export declare const ADD_ROW_COLUMN = "data-kp-addrow-column";
/** On the row: the column the Add button stands under (default: the last column that holds no field, else a track of its own). */
export declare const ADD_ROW_SUBMIT_COLUMN = "data-kp-addrow-submit-column";
/** On the row, `show`: the field labels stay shown over their fields when the row is not stacked (default: for screen readers only). */
export declare const ADD_ROW_LABELS = "data-kp-addrow-labels";
/** On the row: the name of the field whose value names the line in the "Added x" announcement (default: the first filled value). */
export declare const ADD_ROW_NAME = "data-kp-addrow-name";
/** On the row, `submit`: a plain Enter on a closed select adds the line instead of opening the list (default: it opens the list). */
export declare const ADD_ROW_ENTER = "data-kp-addrow-enter";
/** The value of `data-kp-addrow-enter` that adds the line. */
export declare const ENTER_SUBMIT = "submit";
/** Written on the row while its fields stand under each other (the table shows cards, or the row is narrower than the fold). */
export declare const STACKED = "data-kp-addrow-stacked";
/** The width of its own under which a line in a form grid stacks; a table's row stacks with the table's cards. */
export declare const FOLD_AT_REM = 30;
/** The cell that holds a field. */
export declare const CELL = ".kp-addrow__cell";
/** The cell that holds the Add button. */
export declare const SUBMIT_CELL = ".kp-addrow__submit";
/** The line under the row that says why the page refused the new line. */
export declare const REFUSAL = "[data-kp-addrow-refusal]";
/** Fired, cancelable, on the row when a valid line is added: `{ values, data, waitUntil(promise) }`. */
export declare const ADD_EVENT = "kp-addrow-add";
/** Fired on the row once the line was added and the fields were emptied: `{ values }`. */
export declare const ADDED_EVENT = "kp-addrow-added";
