/**
 * Lay one list's or table's button boxes on shared columns.
 *
 * A list (`.kp-action-list`) is a CSS subgrid, so the browser sizes the
 * columns; this only names each button's column and the list's count, and
 * only when a button carries a role (by position the stylesheet needs no
 * help). A table cannot be a subgrid: there each role's widest button is
 * measured and the widths are written on the table.
 * @param {Element} list
 */
export declare function fitActionColumns(list: Element): void;
