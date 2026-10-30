export type TableHeatStrings = {
    tableSearch: string;
    tableSearchLabel: string;
    tableSelectAll: string;
    tableSelectRow: (key: string) => string;
    tableEmpty: string;
    tableRows: (n: number) => string;
    tableRowsFiltered: (shown: number, total: number) => string;
    tablePage: (at: number, of: number) => string;
    tableRegion: string;
    /**
     * The name of the "In" choice beside the search box
     */
    tableSearchScope: string;
    /**
     * The "In" choice's first option
     */
    tableSearchAllColumns: string;
    /**
     * The filter panel's toggle, with the number of active filters
     */
    tableFilters: (active: number) => string;
    /**
     * The filter panel's group name
     */
    tableFiltersLabel: string;
    /**
     * The list of removable filter pills
     */
    tableActiveFilters: string;
    /**
     * A choice filter's pill
     */
    tableFilterValue: (column: string, value: string) => string;
    /**
     * A range or date filter's pill; an open end is `tableFilterOpenEnd`
     */
    tableFilterRange: (column: string, from: string, to: string) => string;
    /**
     * The open end of a range in its pill
     */
    tableFilterOpenEnd: string;
    /**
     * The lower bound's accessible name
     */
    tableFilterFrom: (column: string) => string;
    /**
     * The upper bound's accessible name
     */
    tableFilterTo: (column: string) => string;
    /**
     * A pill's remove button
     */
    tableRemoveFilter: (label: string) => string;
    tableClearFilters: string;
    /**
     * The word before the filters that are on, in a list toolbar's active row (js/toolbar.js) [kpadopt-controls]
     */
    toolbarShowingOnly: string;
    /**
     * The toolbar's button that turns every filter off [kpadopt-controls]
     */
    toolbarClearAll: string;
    /**
     * The accessible name of a line of keyboard shortcuts (js/keys.js) [kpadopt-controls]
     */
    keysLabel: string;
    /**
     * What a heat grid's or matrix's cell says while its value is being read (js/heat.js) [kpadopt2-grids]
     */
    heatLoading: string;
    /**
     * A heat grid or matrix with no rows [kpadopt2-grids]
     */
    heatEmpty: string;
    /**
     * A heat grid or matrix that could not be read [kpadopt2-grids]
     */
    heatFailed: string;
    /**
     * The less end of a heat legend's value ramp (js/heat.js, setHeatLegend) [gap-tab-count]
     */
    heatLegendLess: string;
    /**
     * The more end of the ramp [gap-tab-count]
     */
    heatLegendMore: string;
    /**
     * The name of a heat grid's legend for a screen reader [gap-tab-count]
     */
    heatLegendLabel: string;
    /**
     * The heat legend's key line: the arrow keys [gap-tab-count]
     */
    heatKeysMove: string;
    /**
     * Enter or Space on a cell: pick the column [gap-tab-count]
     */
    heatKeysPick: string;
    /**
     * Escape: drop the picked column [gap-tab-count]
     */
    heatKeysDrop: string;
    /**
     * Page Up and Page Down: show earlier or later columns [gap-tab-count]
     */
    heatKeysPage: string;
    /**
     * The name of a heat grid's Earlier / Today / Later bar for a screen reader (js/heat.js) [wish-1120]
     */
    heatPagerLabel: string;
    /**
     * The paging bar's button to the page before [wish-1120]
     */
    heatEarlier: string;
    /**
     * The paging bar's button back to the present [wish-1120]
     */
    heatToday: string;
    /**
     * The paging bar's button to the page after [wish-1120]
     */
    heatLater: string;
    /**
     * A matrix cell that pairs a row with itself, for a screen reader [kpadopt2-grids]
     */
    matrixSelf: string;
    /**
     * A matrix cell with no answer, for a screen reader [kpadopt2-grids]
     */
    matrixUnknown: string;
    /**
     * The way out of the no-match state
     */
    tableClearSearch: string;
    /**
     * The "+ Add filter" button of a table in the add-filter mode, with the number of active filters
     */
    tableAddFilter: (active: number) => string;
    /**
     * The name of its menu of filterable columns
     */
    tableAddFilterMenu: string;
    /**
     * A column in that menu, not filtered yet
     */
    tableAddFilterItem: (column: string) => string;
    /**
     * A column in that menu that is filtered already: choosing it edits that filter
     */
    tableAddFilterItemActive: (column: string) => string;
    /**
     * The mark beside a filtered column in the menu
     */
    tableFilterMarked: string;
    /**
     * The editor's accessible name
     */
    tableFilterEditor: (column: string) => string;
    /**
     * The editor's list of choices, for a screen reader
     */
    tableFilterChoicesLegend: (column: string) => string;
    /**
     * A bound's visible label in the editor
     */
    tableFilterBound: (kind: 'range' | 'date', bound: 'from' | 'to', column: string) => string;
    /**
     * A choice filter's one pill in the add-filter mode
     */
    tableFilterChoicePill: (column: string, values: string[]) => string;
    /**
     * A range or date filter's pill in the add-filter mode; an open end is left out
     */
    tableFilterSpanPill: (column: string, from: string, to: string, kind: 'range' | 'date') => string;
    /**
     * A pill's own button, which reopens its editor
     */
    tableEditFilter: (label: string) => string;
    tableFilterApply: string;
    tableFilterCancel: string;
    /**
     * The add-filter mode's way out of every filter, shown from two pills
     */
    tableFilterClearAll: string;
    /**
     * A number bound that is not a number
     */
    tableFilterNotNumber: (label: string, value: string) => string;
    /**
     * A date bound the picker cannot read
     */
    tableFilterNotDate: (label: string, value: string) => string;
    /**
     * A range whose lower bound is above its upper
     */
    tableFilterBackwards: (from: string, to: string) => string;
    tableDensity: string;
    tableDensityComfortable: string;
    tableDensityCompact: string;
    tableRowsPerPage: string;
    /**
     * The status line: "Showing 1–25 of 60"
     */
    tableShowing: (from: number, to: number, count: number, total: number) => string;
    /**
     * The action bar's count
     */
    tableSelected: (n: number) => string;
    tableClearSelection: string;
    /**
     * The card layout's sort control
     */
    tableSortBy: string;
    /**
     * Its first option
     */
    tableSortNone: string;
    tableSortAscending: string;
    tableSortDescending: string;
    tableFailed: string;
    tableRetry: string;
    /**
     * One key of a multi-column sort in words; `kind` is text, number, date or order
     */
    tableSortKey: (column: string, direction: 'ascending' | 'descending', kind: string) => string;
    /**
     * The multi-sort summary, from the keys in order
     */
    tableSortedBy: (keys: string[]) => string;
    tableNotSorted: string;
    tableSortReset: string;
    tableBusyElapsed: (seconds: number) => string;
    /**
     * The column menu's button
     */
    tableColumns: string;
    /**
     * The column menu's name
     */
    tableColumnsLabel: string;
    /**
     * A column that cannot be hidden, in the menu
     */
    tableColumnLocked: (column: string) => string;
    tableShowAllColumns: string;
    tableColumnsShown: (shown: number, total: number) => string;
    /**
     * The expansion column's header, read by a screen reader only
     */
    tableDetailsColumn: string;
    /**
     * A row's expand button
     */
    tableRowDetails: (key: string) => string;
    /**
     * The name of the data table's column of drag handles for a screen reader [wish-1120]
     */
    tableReorderColumn: string;
    /**
     * A row's drag handle: "Move media", with Alt+Up and Alt+Down named in the aria-keyshortcuts [wish-1120]
     */
    tableReorderRow: (name: string) => string;
    /**
     * Why the handles are off while the table is sorted, filtered or searched [wish-1120]
     */
    tableReorderOff: string;
    /**
     * A group row's fold button: the group's name and how many of its rows match [J2]
     */
    tableGroupRows: (group: string, count: number) => string;
    /**
     * An editable cell's button
     */
    tableEdit: (column: string, key: string, value: string) => string;
    /**
     * The editor's accessible name
     */
    tableEditField: (column: string, key: string) => string;
    /**
     * Said when an editor opens
     */
    tableEditing: (column: string, key: string) => string;
    tableEdited: (key: string, column: string, before: string, after: string) => string;
    tableEditUndone: (key: string, column: string, value: string) => string;
    tableEditCancelled: string;
    tableEditRequired: string;
    /**
     * A rejected edit with no message of its own
     */
    tableEditInvalid: string;
    /**
     * The keyboard grid's line before the first cell is focused
     */
    tableGridStart: string;
    /**
     * Row 0 is the header row
     */
    tableGridPosition: (row: number, rows: number, column: string, text: string) => string;
};
/**
 * @typedef {object} TableHeatStrings
 * @property {string} tableSearch
 * @property {string} tableSearchLabel
 * @property {string} tableSelectAll
 * @property {(key: string) => string} tableSelectRow
 * @property {string} tableEmpty
 * @property {(n: number) => string} tableRows
 * @property {(shown: number, total: number) => string} tableRowsFiltered
 * @property {(at: number, of: number) => string} tablePage
 * @property {string} tableRegion
 * @property {string} tableSearchScope      The name of the "In" choice beside the search box
 * @property {string} tableSearchAllColumns The "In" choice's first option
 * @property {(active: number) => string} tableFilters  The filter panel's toggle, with the number of active filters
 * @property {string} tableFiltersLabel     The filter panel's group name
 * @property {string} tableActiveFilters    The list of removable filter pills
 * @property {(column: string, value: string) => string} tableFilterValue  A choice filter's pill
 * @property {(column: string, from: string, to: string) => string} tableFilterRange  A range or date filter's pill; an open end is `tableFilterOpenEnd`
 * @property {string} tableFilterOpenEnd    The open end of a range in its pill
 * @property {(column: string) => string} tableFilterFrom  The lower bound's accessible name
 * @property {(column: string) => string} tableFilterTo    The upper bound's accessible name
 * @property {(label: string) => string} tableRemoveFilter  A pill's remove button
 * @property {string} tableClearFilters
 * @property {string} toolbarShowingOnly  The word before the filters that are on, in a list toolbar's active row (js/toolbar.js) [kpadopt-controls]
 * @property {string} toolbarClearAll       The toolbar's button that turns every filter off [kpadopt-controls]
 * @property {string} keysLabel            The accessible name of a line of keyboard shortcuts (js/keys.js) [kpadopt-controls]
 * @property {string} heatLoading           What a heat grid's or matrix's cell says while its value is being read (js/heat.js) [kpadopt2-grids]
 * @property {string} heatEmpty             A heat grid or matrix with no rows [kpadopt2-grids]
 * @property {string} heatFailed            A heat grid or matrix that could not be read [kpadopt2-grids]
 * @property {string} heatLegendLess        The less end of a heat legend's value ramp (js/heat.js, setHeatLegend) [gap-tab-count]
 * @property {string} heatLegendMore        The more end of the ramp [gap-tab-count]
 * @property {string} heatLegendLabel       The name of a heat grid's legend for a screen reader [gap-tab-count]
 * @property {string} heatKeysMove          The heat legend's key line: the arrow keys [gap-tab-count]
 * @property {string} heatKeysPick          Enter or Space on a cell: pick the column [gap-tab-count]
 * @property {string} heatKeysDrop          Escape: drop the picked column [gap-tab-count]
 * @property {string} heatKeysPage          Page Up and Page Down: show earlier or later columns [gap-tab-count]
 * @property {string} heatPagerLabel  The name of a heat grid's Earlier / Today / Later bar for a screen reader (js/heat.js) [wish-1120]
 * @property {string} heatEarlier  The paging bar's button to the page before [wish-1120]
 * @property {string} heatToday  The paging bar's button back to the present [wish-1120]
 * @property {string} heatLater  The paging bar's button to the page after [wish-1120]
 * @property {string} matrixSelf            A matrix cell that pairs a row with itself, for a screen reader [kpadopt2-grids]
 * @property {string} matrixUnknown         A matrix cell with no answer, for a screen reader [kpadopt2-grids]
 * @property {string} tableClearSearch      The way out of the no-match state
 * @property {(active: number) => string} tableAddFilter  The "+ Add filter" button of a table in the add-filter mode, with the number of active filters
 * @property {string} tableAddFilterMenu    The name of its menu of filterable columns
 * @property {(column: string) => string} tableAddFilterItem  A column in that menu, not filtered yet
 * @property {(column: string) => string} tableAddFilterItemActive  A column in that menu that is filtered already: choosing it edits that filter
 * @property {string} tableFilterMarked     The mark beside a filtered column in the menu
 * @property {(column: string) => string} tableFilterEditor  The editor's accessible name
 * @property {(column: string) => string} tableFilterChoicesLegend  The editor's list of choices, for a screen reader
 * @property {(kind: 'range' | 'date', bound: 'from' | 'to', column: string) => string} tableFilterBound  A bound's visible label in the editor
 * @property {(column: string, values: string[]) => string} tableFilterChoicePill  A choice filter's one pill in the add-filter mode
 * @property {(column: string, from: string, to: string, kind: 'range' | 'date') => string} tableFilterSpanPill  A range or date filter's pill in the add-filter mode; an open end is left out
 * @property {(label: string) => string} tableEditFilter  A pill's own button, which reopens its editor
 * @property {string} tableFilterApply
 * @property {string} tableFilterCancel
 * @property {string} tableFilterClearAll   The add-filter mode's way out of every filter, shown from two pills
 * @property {(label: string, value: string) => string} tableFilterNotNumber  A number bound that is not a number
 * @property {(label: string, value: string) => string} tableFilterNotDate  A date bound the picker cannot read
 * @property {(from: string, to: string) => string} tableFilterBackwards  A range whose lower bound is above its upper
 * @property {string} tableDensity
 * @property {string} tableDensityComfortable
 * @property {string} tableDensityCompact
 * @property {string} tableRowsPerPage
 * @property {(from: number, to: number, count: number, total: number) => string} tableShowing  The status line: "Showing 1–25 of 60"
 * @property {(n: number) => string} tableSelected  The action bar's count
 * @property {string} tableClearSelection
 * @property {string} tableSortBy           The card layout's sort control
 * @property {string} tableSortNone         Its first option
 * @property {string} tableSortAscending
 * @property {string} tableSortDescending
 * @property {string} tableFailed
 * @property {string} tableRetry
 * @property {(column: string, direction: 'ascending' | 'descending', kind: string) => string} tableSortKey  One key of a multi-column sort in words; `kind` is text, number, date or order
 * @property {(keys: string[]) => string} tableSortedBy  The multi-sort summary, from the keys in order
 * @property {string} tableNotSorted
 * @property {string} tableSortReset
 * @property {(seconds: number) => string} tableBusyElapsed
 * @property {string} tableColumns          The column menu's button
 * @property {string} tableColumnsLabel     The column menu's name
 * @property {(column: string) => string} tableColumnLocked  A column that cannot be hidden, in the menu
 * @property {string} tableShowAllColumns
 * @property {(shown: number, total: number) => string} tableColumnsShown
 * @property {string} tableDetailsColumn    The expansion column's header, read by a screen reader only
 * @property {(key: string) => string} tableRowDetails  A row's expand button
 * @property {string} tableReorderColumn  The name of the data table's column of drag handles for a screen reader [wish-1120]
 * @property {(name: string) => string} tableReorderRow  A row's drag handle: "Move media", with Alt+Up and Alt+Down named in the aria-keyshortcuts [wish-1120]
 * @property {string} tableReorderOff  Why the handles are off while the table is sorted, filtered or searched [wish-1120]
 * @property {(group: string, count: number) => string} tableGroupRows  A group row's fold button: the group's name and how many of its rows match [J2]
 * @property {(column: string, key: string, value: string) => string} tableEdit  An editable cell's button
 * @property {(column: string, key: string) => string} tableEditField  The editor's accessible name
 * @property {(column: string, key: string) => string} tableEditing  Said when an editor opens
 * @property {(key: string, column: string, before: string, after: string) => string} tableEdited
 * @property {(key: string, column: string, value: string) => string} tableEditUndone
 * @property {string} tableEditCancelled
 * @property {string} tableEditRequired
 * @property {string} tableEditInvalid     A rejected edit with no message of its own
 * @property {string} tableGridStart        The keyboard grid's line before the first cell is focused
 * @property {(row: number, rows: number, column: string, text: string) => string} tableGridPosition  Row 0 is the header row
 */
/** @type {TableHeatStrings} */
export declare const TABLE_HEAT_STRINGS: TableHeatStrings;
