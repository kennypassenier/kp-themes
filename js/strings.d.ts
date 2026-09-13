export type Strings = {
    alertSuccess: string;
    alertWarning: string;
    alertInfo: string;
    alertError: string;
    busy: string;
    close: string;
    /**
     * The accessible name of a collapsed navigation's toggle
     */
    menu: string;
    /**
     * The same toggle once the navigation is open
     */
    closeMenu: string;
    /**
     * The accessible name of a hidden side navigation's toggle
     */
    sidebar: string;
    /**
     * The same toggle once that side navigation is open
     */
    closeSidebar: string;
    /**
     * The accessible name of an empty slim-rail toggle while the rail is expanded
     */
    collapseRail: string;
    /**
     * The same toggle while the rail is collapsed to its icons
     */
    expandRail: string;
    /**
     * The control that returns the reader to the top of the page
     */
    backToTop: string;
    previous: string;
    next: string;
    finish: string;
    back: string;
    removeNamed: (name: string) => string;
    noResults: string;
    oneResult: string;
    manyResults: (n: number) => string;
    noCommands: string;
    oneCommand: string;
    manyCommands: (n: number) => string;
    commandPlaceholder: string;
    commandsLabel: string;
    shortcutsLabel: string;
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
     * The way out of the no-match state
     */
    tableClearSearch: string;
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
    formRequired: string;
    formInvalid: string;
    formSummaryOne: string;
    formSummaryMany: (n: number) => string;
    fieldFallbackName: string;
    /**
     * The word beside a switch that is on [gap-11]
     */
    switchOn: string;
    /**
     * The word beside a switch that is off [gap-11]
     */
    switchOff: string;
    calendarOpen: string;
    calendarButton: string;
    dateFormatHint: string;
    previousMonth: string;
    nextMonth: string;
    monthTitle: (month: string, year: number) => string;
    weekdays: string[];
    months: string[];
    dayLabel: (day: number, month: string, year: number) => string;
    uploadZone: string;
    uploadTooLarge: (size: string) => string;
    uploadTooMany: (max: number) => string;
    uploadTotalTooLarge: (max: string) => string;
    uploadWrongType: (accept: string) => string;
    uploadProgress: (name: string) => string;
    wizardStep: (at: number, of: number) => string;
    copy: string;
    copied: string;
    copyBlocked: string;
    copiedAnnouncement: (value: string) => string;
    copyBlockedAnnouncement: string;
    undo: string;
    deleted: string;
    splitLabel: string;
    reorderHandle: (name: string) => string;
    reorderMoved: (name: string, at: number, of: number) => string;
    tileFallbackName: string;
    tileLabel: (name: string, column: number, row: number, w: number, h: number) => string;
    contrastMissing: (token: string) => string;
    contrastReport: (ratio: string, token: string, verdict: string) => string;
    colourHue: string;
    colourSaturation: string;
    colourLightness: string;
    contrastPasses: string;
    contrastFails: string;
    confirm: string;
    confirmAccept: string;
    confirmCancel: string;
    confirmDescription: string;
    save: string;
    mainNavigation: string;
    skipToContent: string;
    /**
     * The diagnostics row that lists unknown hook values [AR44]
     */
    diagnosticsEffects: string;
    diagnosticsEffectsNone: string;
    /**
     * The stamp a register may print on an emphasis reveal (the dossier) [AR35]
     */
    classified: string;
    /**
     * The boot line of an arrival a theme performs (synthwave's CRT) [SW2]
     */
    arrivalLine: string;
    /**
     * The lines a theme's own boot shows instead of that one line, in order, keyed by theme [S49, A11]. A `{count}` in a line is replaced by a number counting up to `--kp-arrival-count` (640 by default), which is how retro's memory test reads.
     */
    arrivalLinesByTheme: Record<string, string[]>;
    /**
     * The word before the percentage on that line
     */
    arrivalProgress: string;
    /**
     * The word that closes the boot line
     */
    arrivalReady: string;
    /**
     * The button that ends the arrival at once
     */
    arrivalSkip: string;
    /**
     * A live dimension label before the first measurement lands (blueprint) [S48]
     */
    measureLoading: string;
    /**
     * The size of the box the measurement frame holds (blueprint) [scope-18]
     */
    measureBox: (w: number, h: number) => string;
    breadcrumb: string;
    pagination: string;
    themePicker: string;
    themeSaveFailed: string;
    themeSaveRefused: string;
    contractDestructive: string;
    contractSemantic: string;
    themeGroupLight: string;
    themeGroupDark: string;
    themeUnknown: (requested: string, applied: string) => string;
    /**
     * The console error when a lazily loaded register did not arrive; the theme stays what it was [scope-50]
     */
    registerLoadFailed: (theme: string, href: string) => string;
    diagnosticsHeading: string;
    diagnosticsStylesheet: string;
    diagnosticsScript: string;
    diagnosticsVersion: string;
    diagnosticsThemes: string;
    diagnosticsVerdict: string;
    diagnosticsMatch: string;
    diagnosticsStylesheetBehind: (stylesheet: string, script: string) => string;
    diagnosticsScriptBehind: (stylesheet: string, script: string) => string;
    diagnosticsThemesDiffer: (version: string) => string;
    diagnosticsNoVersion: string;
    diagnosticsOnlyInStylesheet: (names: string) => string;
    diagnosticsOnlyInScript: (names: string) => string;
    diagnosticsUnknownVersion: string;
};
/**
 * @typedef {object} Strings
 * @property {string} alertSuccess
 * @property {string} alertWarning
 * @property {string} alertInfo
 * @property {string} alertError
 * @property {string} busy
 * @property {string} close
 * @property {string} menu          The accessible name of a collapsed navigation's toggle
 * @property {string} closeMenu     The same toggle once the navigation is open
 * @property {string} sidebar       The accessible name of a hidden side navigation's toggle
 * @property {string} closeSidebar  The same toggle once that side navigation is open
 * @property {string} collapseRail  The accessible name of an empty slim-rail toggle while the rail is expanded
 * @property {string} expandRail    The same toggle while the rail is collapsed to its icons
 * @property {string} backToTop    The control that returns the reader to the top of the page
 * @property {string} previous
 * @property {string} next
 * @property {string} finish
 * @property {string} back
 * @property {(name: string) => string} removeNamed
 * @property {string} noResults
 * @property {string} oneResult
 * @property {(n: number) => string} manyResults
 * @property {string} noCommands
 * @property {string} oneCommand
 * @property {(n: number) => string} manyCommands
 * @property {string} commandPlaceholder
 * @property {string} commandsLabel
 * @property {string} shortcutsLabel
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
 * @property {string} tableClearSearch      The way out of the no-match state
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
 * @property {string} tableColumns          The column menu's button
 * @property {string} tableColumnsLabel     The column menu's name
 * @property {(column: string) => string} tableColumnLocked  A column that cannot be hidden, in the menu
 * @property {string} tableShowAllColumns
 * @property {(shown: number, total: number) => string} tableColumnsShown
 * @property {string} tableDetailsColumn    The expansion column's header, read by a screen reader only
 * @property {(key: string) => string} tableRowDetails  A row's expand button
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
 * @property {string} formRequired
 * @property {string} formInvalid
 * @property {string} formSummaryOne
 * @property {(n: number) => string} formSummaryMany
 * @property {string} fieldFallbackName
 * @property {string} switchOn   The word beside a switch that is on [gap-11]
 * @property {string} switchOff  The word beside a switch that is off [gap-11]
 * @property {string} calendarOpen
 * @property {string} calendarButton
 * @property {string} dateFormatHint
 * @property {string} previousMonth
 * @property {string} nextMonth
 * @property {(month: string, year: number) => string} monthTitle
 * @property {string[]} weekdays
 * @property {string[]} months
 * @property {(day: number, month: string, year: number) => string} dayLabel
 * @property {string} uploadZone
 * @property {(size: string) => string} uploadTooLarge
 * @property {(max: number) => string} uploadTooMany
 * @property {(max: string) => string} uploadTotalTooLarge
 * @property {(accept: string) => string} uploadWrongType
 * @property {(name: string) => string} uploadProgress
 * @property {(at: number, of: number) => string} wizardStep
 * @property {string} copy
 * @property {string} copied
 * @property {string} copyBlocked
 * @property {(value: string) => string} copiedAnnouncement
 * @property {string} copyBlockedAnnouncement
 * @property {string} undo
 * @property {string} deleted
 * @property {string} splitLabel
 * @property {(name: string) => string} reorderHandle
 * @property {(name: string, at: number, of: number) => string} reorderMoved
 * @property {string} tileFallbackName
 * @property {(name: string, column: number, row: number, w: number, h: number) => string} tileLabel
 * @property {(token: string) => string} contrastMissing
 * @property {(ratio: string, token: string, verdict: string) => string} contrastReport
 * @property {string} colourHue
 * @property {string} colourSaturation
 * @property {string} colourLightness
 * @property {string} contrastPasses
 * @property {string} contrastFails
 * @property {string} confirm
 * @property {string} confirmAccept
 * @property {string} confirmCancel
 * @property {string} confirmDescription
 * @property {string} save
 * @property {string} mainNavigation
 * @property {string} skipToContent
 * @property {string} diagnosticsEffects  The diagnostics row that lists unknown hook values [AR44]
 * @property {string} diagnosticsEffectsNone
 * @property {string} classified  The stamp a register may print on an emphasis reveal (the dossier) [AR35]
 * @property {string} arrivalLine  The boot line of an arrival a theme performs (synthwave's CRT) [SW2]
 * @property {Record<string, string[]>} arrivalLinesByTheme  The lines a theme's own boot shows instead of that one line, in order, keyed by theme [S49, A11]. A `{count}` in a line is replaced by a number counting up to `--kp-arrival-count` (640 by default), which is how retro's memory test reads.
 * @property {string} arrivalProgress  The word before the percentage on that line
 * @property {string} arrivalReady  The word that closes the boot line
 * @property {string} arrivalSkip  The button that ends the arrival at once
 * @property {string} measureLoading  A live dimension label before the first measurement lands (blueprint) [S48]
 * @property {(w: number, h: number) => string} measureBox  The size of the box the measurement frame holds (blueprint) [scope-18]

 * @property {string} breadcrumb
 * @property {string} pagination
 * @property {string} themePicker
 * @property {string} themeSaveFailed
 * @property {string} themeSaveRefused
 * @property {string} contractDestructive
 * @property {string} contractSemantic
 * @property {string} themeGroupLight
 * @property {string} themeGroupDark
 * @property {(requested: string, applied: string) => string} themeUnknown
 * @property {(theme: string, href: string) => string} registerLoadFailed  The console error when a lazily loaded register did not arrive; the theme stays what it was [scope-50]
 * @property {string} diagnosticsHeading
 * @property {string} diagnosticsStylesheet
 * @property {string} diagnosticsScript
 * @property {string} diagnosticsVersion
 * @property {string} diagnosticsThemes
 * @property {string} diagnosticsVerdict
 * @property {string} diagnosticsMatch
 * @property {(stylesheet: string, script: string) => string} diagnosticsStylesheetBehind
 * @property {(stylesheet: string, script: string) => string} diagnosticsScriptBehind
 * @property {(version: string) => string} diagnosticsThemesDiffer
 * @property {string} diagnosticsNoVersion
 * @property {(names: string) => string} diagnosticsOnlyInStylesheet
 * @property {(names: string) => string} diagnosticsOnlyInScript
 * @property {string} diagnosticsUnknownVersion
 */
/**
 * The defaults. English, by Kenny's decision of 2026-09-04 — the package
 * has to speak something, and English is the language a consumer is least
 * likely to have to replace.
 *
 * @type {Strings}
 */
export declare const DEFAULT_STRINGS: Strings;
/**
 * Replace some or all of the strings, for the framework-free channel and
 * for anything that reads them outside React.
 *
 * Merged rather than replaced: a consumer that wants one word does not
 * have to restate the other seventy, and a key added in a later version
 * keeps working instead of becoming `undefined` on their page.
 *
 * @param {Partial<Strings>} next
 * @returns {Strings} the merged result
 */
export declare function setStrings(next: Partial<Strings>): Strings;
/** @returns {Strings} the strings as they stand */
export declare function getStrings(): Strings;
/**
 * The strings a component should use: the global ones, with anything the
 * caller passed layered on top.
 *
 * @param {Partial<Strings>} [overrides]
 * @returns {Strings}
 */
export declare function resolveStrings(overrides?: Partial<Strings>): Strings;
