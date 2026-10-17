export type Strings = {
    alertSuccess: string;
    alertWarning: string;
    alertInfo: string;
    alertError: string;
    /**
     * The word a screen reader hears before a critical problem on the attention band (setAttention) [scope-143]
     */
    attentionCritical: string;
    /**
     * The same, before a warning [scope-143]
     */
    attentionWarning: string;
    /**
     * The same, before an information [scope-143]
     */
    attentionInfo: string;
    /**
     * A ticking freshness line, "updated 12 s ago" (js/freshness.js) [scope-143]
     */
    agoText: (verb: string, duration: string) => string;
    /**
     * The same line with no moment yet, "not updated yet" [scope-143]
     */
    agoNever: (verb: string) => string;
    /**
     * A duration's seconds part, "12 s" [scope-143]
     */
    agoSeconds: (n: number) => string;
    /**
     * Its minutes part, "2 min" [scope-143]
     */
    agoMinutes: (n: number) => string;
    /**
     * Its hours part, "3 h" [scope-143]
     */
    agoHours: (n: number) => string;
    /**
     * Its days part, "1 day", "2 days" [scope-143]
     */
    agoDays: (n: number) => string;
    /**
     * The verb a freshness line uses when its element names none [scope-143]
     */
    agoVerb: string;
    /**
     * What a freshness line with `data-kp-ago-announce="state"` announces once it turns stale [scope-143]
     */
    agoStale: (text: string) => string;
    /**
     * What it announces once it is fresh again [scope-143]
     */
    agoFresh: (text: string) => string;
    /**
     * The console warning for a ticking line inside a live region [scope-143]
     */
    agoInLiveRegion: string;
    /**
     * A step list's waiting step, as a screen reader hears it (js/steplist.js)
     */
    stepPending: string;
    /**
     * The step being run
     */
    stepRunning: string;
    /**
     * A finished step
     */
    stepDone: string;
    /**
     * A step that failed
     */
    stepFailed: string;
    /**
     * A step that was left out
     */
    stepSkipped: string;
    /**
     * The step a journey stands at now, neither running nor done (`data-state="current"`) [kpadopt4]
     */
    stepCurrent: string;
    /**
     * What the list's status region says when a step changes, "Pull the images: running"
     */
    stepAnnounce: (title: string, state: string) => string;
    /**
     * A status row that is fine, as a screen reader hears it (js/statusrow.js)
     */
    statusOk: string;
    /**
     * A status row still being read
     */
    statusLoading: string;
    /**
     * A status row that failed
     */
    statusFailed: string;
    /**
     * A status row with nothing to show
     */
    statusEmpty: string;
    /**
     * A status row that passes with a reservation, `data-state="warn"` [kpadopt4-rows]
     */
    statusWarn: string;
    /**
     * What a loading card's busy card says under its spinner (js/card-state.js) [kpadopt4-rows]
     */
    cardLoading: string;
    /**
     * An empty card's note when the page gives no title [kpadopt4-rows]
     */
    cardEmpty: string;
    /**
     * A failed card's note when the page gives no title [kpadopt4-rows]
     */
    cardFailed: string;
    /**
     * The Try again button of a failed card [kpadopt4-rows]
     */
    cardRetry: string;
    /**
     * The Retry button of a failed status row
     */
    statusRetry: string;
    /**
     * That button's accessible name, "Retry vault"
     */
    statusRetryLabel: (label: string) => string;
    /**
     * What the list's status region says when a row changes, "vault: failed, The host did not answer"
     */
    statusAnnounce: (label: string, state: string, detail: string) => string;
    /**
     * What it says when more than three rows change in one tick, "12 updated, 2 failed"
     */
    statusAnnounceMany: (count: number, failed: number) => string;
    /**
     * The "only" button's text on a facet row (js/facets.js)
     */
    facetOnly: string;
    /**
     * That button's accessible name, "Show only Host"
     */
    facetOnlyLabel: (label: string) => string;
    /**
     * The "Everything" row's text when the group gives none
     */
    facetAll: string;
    /**
     * What a facet group's status region says after "only", "Showing only Host"
     */
    facetShowingOnly: (label: string) => string;
    /**
     * What it says after "Everything"
     */
    facetShowingAll: string;
    /**
     * The glyph of an identity mark with no name (js/idmark.js) [kpadopt4-data]
     */
    idmarkUnknown: string;
    /**
     * The legend row of a share bar's free rest (js/stackbar.js)
     */
    stackbarRest: string;
    /**
     * The legend row the parts too small to draw are merged into
     */
    stackbarOther: string;
    /**
     * One part, as a screen reader and the hover card read it
     */
    stackbarPart: (label: string, value: string, percent: string) => string;
    /**
     * The free row when the parts add up to more than the whole
     */
    stackbarOver: (value: string) => string;
    /**
     * The bar's accessible name: every part in order
     */
    stackbarLabel: (parts: string[]) => string;
    /**
     * A share bar being read
     */
    stackbarLoading: string;
    /**
     * A share bar with nothing read yet
     */
    stackbarEmpty: string;
    /**
     * A share bar that could not be read
     */
    stackbarError: string;
    /**
     * The Retry button of a failed share bar
     */
    stackbarRetry: string;
    /**
     * What the busy card over a bullet list says (js/bullets.js)
     */
    bulletsLoading: string;
    /**
     * A bullet list with no rows, when the page gives no reason
     */
    bulletsEmpty: string;
    /**
     * A bullet list that could not be read, when the page gives no sentence
     */
    bulletsError: string;
    /**
     * The Retry button of a failed bullet list
     */
    bulletsRetry: string;
    /**
     * A row with nothing to measure, for a screen reader
     */
    bulletsUnknown: string;
    /**
     * A row's meter as a screen reader reads it
     */
    bulletsValueText: (figure: string, threshold: string) => string;
    /**
     * A code block's accessible name when it has no title (js/code.js)
     */
    codeLabel: string;
    /**
     * The code block's Wrap toggle
     */
    codeWrap: string;
    /**
     * The JSON view laid out with indents
     */
    codePretty: string;
    /**
     * The JSON view as it came
     */
    codeRaw: string;
    /**
     * The accessible name of the Pretty / Raw choice
     */
    codeFormat: string;
    /**
     * The button under a folded block
     */
    codeShowAll: (lines: number) => string;
    /**
     * The same button once the block is open
     */
    codeShowLess: string;
    /**
     * The block's line count beside its title
     */
    codeLines: (lines: number) => string;
    /**
     * A block with nothing in it
     */
    codeEmpty: string;
    /**
     * A block whose content is not text
     */
    codeBinary: (size: string) => string;
    /**
     * The foot of a block that holds only the start
     */
    codeTruncated: (shown: string, total: string) => string;
    /**
     * What the busy card over a block says
     */
    codeLoading: string;
    /**
     * A block that could not be read, when the page gives no sentence
     */
    codeError: string;
    /**
     * Announced after a copy, naming the block
     */
    codeCopiedAnnouncement: (title: string) => string;
    /**
     * The accessible name of a transfer's bar when it has no file name (js/transfer.js) [kpadopt5-transfer]
     */
    transferBar: string;
    /**
     * The reading of a transfer with a known size, "1.2 GB of 4.1 GB" [kpadopt5-transfer]
     */
    transferOf: (done: string, total: string) => string;
    /**
     * The reading of a transfer of unknown size, "1.2 GB so far" [kpadopt5-transfer]
     */
    transferSoFar: (done: string) => string;
    /**
     * The time left while the speed is not steady yet [kpadopt5-transfer]
     */
    transferEstimating: string;
    /**
     * The time left, "about 3 min left" [kpadopt5-transfer]
     */
    transferLeft: (duration: string) => string;
    /**
     * A transfer that moved no byte for a while, "stalled for 12 s" [kpadopt5-transfer]
     */
    transferStalled: (duration: string) => string;
    /**
     * A finished transfer's average speed, "avg 21 MB/s" [kpadopt5-transfer]
     */
    transferAverage: (rate: string) => string;
    /**
     * A finished transfer's duration, "in 3 min 12 s" [kpadopt5-transfer]
     */
    transferTook: (duration: string) => string;
    /**
     * The first words of a failed transfer's note [kpadopt5-transfer]
     */
    transferFailed: string;
    /**
     * The Retry button of a failed transfer [kpadopt5-transfer]
     */
    transferRetry: string;
    /**
     * What a screen reader hears at 25, 50, 75 and 100 % [kpadopt5-transfer]
     */
    transferAnnounce: (name: string, percent: number) => string;
    /**
     * The banner's first line when the connection is gone (js/connection.js) [kpadopt5-connection]
     */
    connOffline: string;
    /**
     * What is true meanwhile and what happens next [kpadopt5-connection]
     */
    connOfflineWhy: string;
    /**
     * The first line while a try is under way [kpadopt5-connection]
     */
    connReconnecting: string;
    /**
     * Its second line on the first try [kpadopt5-connection]
     */
    connReconnectingWhy: string;
    /**
     * Its second line from the second try, "Attempt 2" [kpadopt5-connection]
     */
    connAttempt: (n: number) => string;
    /**
     * The time to the next automatic try, "next try in 8 s" [kpadopt5-connection]
     */
    connNextTry: (duration: string) => string;
    /**
     * The exact count of changes waiting, "3 changes waiting" [kpadopt5-connection]
     */
    connPending: (n: number) => string;
    /**
     * The first line when the connection is back [kpadopt5-connection]
     */
    connBack: string;
    /**
     * Its second line with nothing waiting [kpadopt5-connection]
     */
    connBackWhy: string;
    /**
     * Its second line with changes waiting, "Sending 3 changes" [kpadopt5-connection]
     */
    connBackSending: (n: number) => string;
    /**
     * The first line when the server refuses while the browser is online [kpadopt5-connection]
     */
    connRefused: string;
    /**
     * Its second line when the app gives none [kpadopt5-connection]
     */
    connRefusedWhy: string;
    /**
     * The Retry now button [kpadopt5-connection]
     */
    connRetry: string;
    /**
     * A refresh choice, "Every 30 s" (js/auto-refresh.js) [kpadopt5-auto-refresh]
     */
    refreshEvery: (duration: string) => string;
    /**
     * The choice that stops the refreshing [kpadopt5-auto-refresh]
     */
    refreshPaused: string;
    /**
     * The entry that lets a person type any number of seconds [kpadopt5-auto-refresh]
     */
    refreshOther: string;
    /**
     * The accessible name of the refresh chooser [kpadopt5-auto-refresh]
     */
    refreshLabel: string;
    /**
     * The button that refreshes at once [kpadopt5-auto-refresh]
     */
    refreshNow: string;
    /**
     * The freshness line's words while the app reads [kpadopt5-auto-refresh]
     */
    refreshUpdating: string;
    /**
     * The note after a failed refresh, "Last refresh failed, retrying in 30 s" [kpadopt5-auto-refresh]
     */
    refreshFailed: (next: string) => string;
    /**
     * The button that retries a failed refresh at once [kpadopt5-auto-refresh]
     */
    refreshRetryNow: string;
    /**
     * The label of the field for any number of seconds [kpadopt5-auto-refresh]
     */
    refreshCustomLabel: string;
    /**
     * The button that sets that number [kpadopt5-auto-refresh]
     */
    refreshApply: string;
    /**
     * What a number that is not a whole number of seconds says [kpadopt5-auto-refresh]
     */
    refreshInvalid: string;
    /**
     * The detail pane's plate while nothing is picked (js/master-detail.js) [kpadopt5-master-detail]
     */
    paneEmpty: string;
    /**
     * The Back button at the top of a folded detail pane [kpadopt5-master-detail]
     */
    paneBack: string;
    /**
     * What the busy card over the detail pane says [kpadopt5-master-detail]
     */
    paneLoading: string;
    /**
     * The errored detail's first line, when the page gives none [kpadopt5-master-detail]
     */
    paneErrorTitle: string;
    /**
     * Its sentence, when the page gives none [kpadopt5-master-detail]
     */
    paneErrorText: string;
    /**
     * The Retry button of an errored detail [kpadopt5-master-detail]
     */
    paneRetry: string;
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
     * The accessible name of a mega-menu button in the bar that holds no words of its own [scope-48]
     */
    navDisclosure: string;
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
     * The name of the resize handle on a resizable side navigation
     */
    resizeSidebar: string;
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
    /**
     * The visible word on the command palette's trigger in the bar [scope-48]
     */
    paletteTrigger: string;
    /**
     * The hotkey as that trigger prints it: ⌘K on a Mac, Ctrl K elsewhere [scope-48]
     */
    paletteHotkey: (key: string, mac: boolean) => string;
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
    /**
     * The month title's name: it opens the twelve months [scope-89]
     */
    chooseMonth: (title: string) => string;
    /**
     * The year title's name: it opens twelve years [scope-89]
     */
    chooseYear: (year: number) => string;
    previousYear: string;
    nextYear: string;
    /**
     * Twelve years back, in the year grid
     */
    previousYears: string;
    /**
     * Twelve years on, in the year grid
     */
    nextYears: string;
    /**
     * The month grid's name, and what is said when it opens
     */
    monthGrid: (year: number) => string;
    /**
     * The year grid's name, and what is said when it opens
     */
    yearGrid: (from: number, to: number) => string;
    /**
     * The year grid's title
     */
    yearRange: (from: number, to: number) => string;
    weekdays: string[];
    months: string[];
    /**
     * The month grid's cells, where a full name does not fit [scope-89]
     */
    monthsShort: string[];
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
    /**
     * A secret field's name when the page gives none (js/patterns.js, `.kp-secret`) [kpadopt4]
     */
    secretLabel: string;
    /**
     * The button that shows a secret
     */
    secretReveal: string;
    /**
     * The same button while the secret is shown
     */
    secretHide: string;
    /**
     * The button of a secret shown only while it is held (`data-kp-secret-reveal-on="hold"`)
     */
    secretHold: string;
    /**
     * The button that copies a secret without showing it
     */
    secretCopy: string;
    /**
     * The words beside the spinner while a secret is fetched
     */
    secretReading: string;
    /**
     * The reveal button's words after a secret could not be read
     */
    secretRetry: string;
    /**
     * The countdown under a shown secret, "Hides in 28 s"
     */
    secretHidesIn: (seconds: number) => string;
    /**
     * The countdown's words while the reader selects or holds the focus in the value
     */
    secretPaused: string;
    /**
     * The line under a shown secret that hides only when asked (`data-kp-secret-ttl="0"`)
     */
    secretStaysShown: string;
    /**
     * What a screen reader hears when a secret is shown, "Shown. Hides in 30 s."
     */
    secretShown: (seconds: number) => string;
    /**
     * What it hears when the secret is hidden again
     */
    secretHidden: string;
    /**
     * The line under a secret that could not be read
     */
    secretFailed: (reason: string) => string;
    /**
     * The reason when a secret has no value, loader or listener to read it from
     */
    secretNoSource: string;
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
    /**
     * The heading over what still uses the thing a confirmation would remove, "Still in use by 2" (`data-kp-confirm-dependents`) [kpadopt4]
     */
    confirmDependents: (count: number) => string;
    /**
     * What a confirmation that may not go ahead says when the page gives no sentence (`data-kp-confirm-blocked`) [kpadopt4]
     */
    confirmBlocked: string;
    /**
     * The one button of a confirmation that may not go ahead [kpadopt4]
     */
    confirmClose: string;
    /**
     * The button that closes an alarm that must be acknowledged, when the caller names none [scope-94]
     */
    alarmAction: string;
    /**
     * The button that stops an alarm's countdown and keeps it open [scope-94]
     */
    alarmKeepOpen: string;
    /**
     * The key hint beside the acknowledge button; hidden from a screen reader [scope-94]
     */
    alarmHint: string;
    /**
     * The whole seconds left under the countdown bar; hidden from a screen reader [scope-94]
     */
    alarmCountdown: (seconds: number) => string;
    /**
     * Said once when an alarm that closes by itself opens [scope-94]
     */
    alarmClosesBy: (seconds: number) => string;
    /**
     * Said when an alarm that must be acknowledged opens [scope-94]
     */
    alarmPressTo: (action: string) => string;
    /**
     * Said when Keep open stopped the countdown [scope-94]
     */
    alarmKeptOpen: (action: string) => string;
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
     * The neutral boot line of an arrival, for a theme that performs one and has no words of its own in `arrivalWordsByTheme` or `arrivalLinesByTheme` [SW2, scope-84]
     */
    arrivalLine: string;
    /**
     * A theme's own words for the counting boot, keyed by theme [scope-84]: its line, the word before the percentage, and the word that closes it. A word the entry leaves out is the neutral one.
     */
    arrivalWordsByTheme: Record<string, {
        line?: string;
        progress?: string;
        ready?: string;
    }>;
    /**
     * The lines a theme's own boot shows instead of that one line, in order, keyed by theme [S49, A11]. A `{count}` in a line is replaced by a number counting up to `--kp-arrival-count` (640 by default), which is how retro's memory test reads.
     */
    arrivalLinesByTheme: Record<string, string[]>;
    /**
     * The neutral word before the percentage on that line
     */
    arrivalProgress: string;
    /**
     * The neutral word that closes the boot line
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
    /**
     * A time chart's plot, for a screen reader: what it is and its keys [scope-143]
     */
    chartPlot: (label: string) => string;
    /**
     * A chart's 24-hour spark line, for a screen reader [scope-143]
     */
    chartSpark: (label: string) => string;
    /**
     * The name of a chart's legend [scope-143]
     */
    chartSources: (label: string) => string;
    /**
     * A legend button's title: what hovering and clicking it do [scope-143]
     */
    chartSource: (label: string) => string;
    /**
     * The legend's way back to every source [scope-143]
     */
    chartShowAll: string;
    /**
     * Its title [scope-143]
     */
    chartShowAllTitle: string;
    /**
     * The hint under a legend, for a pointer [scope-143]
     */
    chartHintPointer: string;
    /**
     * The same hint, for a finger [scope-143]
     */
    chartHintTouch: string;
    /**
     * The word in a pinned tooltip's head [scope-143]
     */
    chartPinned: string;
    /**
     * The pinned tooltip's ✕, named [scope-143]
     */
    chartRelease: string;
    /**
     * The tooltip's foot: what the ▲/▼ column is [scope-143]
     */
    chartChange: string;
    /**
     * An event's link in a pinned tooltip [scope-143]
     */
    chartOpen: string;
    /**
     * An event marker's title [scope-143]
     */
    chartMark: (label: string, time: string) => string;
    /**
     * The zoom chip, before its Reset, from its two ends; used only when a consumer overrides it and not `chartZoomedSpan` [scope-143]
     */
    chartZoomed: (from: string, to: string) => string;
    /**
     * The zoom chip, before its Reset: `span` is the zoom as the chart's `range` time style prints it [scope-143]
     */
    chartZoomedSpan: (span: string) => string;
    /**
     * The zoom chip's button [scope-143]
     */
    chartReset: string;
    /**
     * Its title [scope-143]
     */
    chartResetTitle: string;
    /**
     * A rise, as the readout says it [scope-143]
     */
    chartUp: string;
    /**
     * A fall, as the readout says it [scope-143]
     */
    chartDown: string;
    /**
     * No change, as the readout says it [scope-143]
     */
    chartSame: string;
    /**
     * A spark line's value when no time is under the crosshair [scope-143]
     */
    chartNow: string;
    /**
     * A time chart with no readings in its window, in the plot at its height [scope-143]
     */
    chartEmpty: string;
    /**
     * Under a chart whose every source has one reading (with `onePointNote`) [scope-143]
     */
    chartOnePoint: string;
    /**
     * A loading chart (`data-kp-chart-loading`), for a screen reader [scope-143]
     */
    chartLoading: string;
    /**
     * A pinned tooltip's head once a live update moved the window past the pin [scope-143]
     */
    chartPinnedOutside: string;
    /**
     * A menu button's menu while its entries load: one disabled entry (js/menu-button.js) [scope-143]
     */
    menuLoading: string;
    /**
     * The title of a menu button with no entries, which stays and does nothing (`data-kp-menu-empty="disable"`) [scope-143]
     */
    menuEmpty: string;
    /**
     * The word on the button a folding bar puts its overflowing links behind (`data-kp-nav-fold`, js/nav-fold.js) [kpadopt-nav]
     */
    navMore: string;
    /**
     * The name of that button's menu, for a screen reader [kpadopt-nav]
     */
    navMoreMenu: string;
    /**
     * Said after the button's name when a link behind it carries a counter [kpadopt-nav]
     */
    navMoreAlert: string;
    /**
     * Under a folded link that cannot be followed now (`aria-disabled`, `disabled`), as its reason [kpadopt-nav]
     */
    navMoreUnavailable: string;
    /**
     * The tour card's button to the next step (js/tour.js) [scope-143]
     */
    tourNext: string;
    /**
     * Its title [scope-143]
     */
    tourNextTitle: string;
    /**
     * The tour card's button to the step before [scope-143]
     */
    tourBack: string;
    /**
     * Its title [scope-143]
     */
    tourBackTitle: string;
    /**
     * The next button on the last step, which ends the tour [scope-143]
     */
    tourDone: string;
    /**
     * Its title [scope-143]
     */
    tourDoneTitle: string;
    /**
     * The tour card's button that ends the tour at once [scope-143]
     */
    tourSkip: string;
    /**
     * Its title [scope-143]
     */
    tourSkipTitle: string;
    /**
     * The tour card's count, "1 of 5"; `of` counts only the steps whose part is on the page [scope-143]
     */
    tourCount: (n: number, of: number) => string;
    /**
     * A key figure's trend axis: the word after the first point's clock when it is today ("07:00 today") [scope-143]
     */
    chartToday: string;
    /**
     * The same when it is yesterday ("14:40 yesterday") [scope-143]
     */
    chartYesterday: string;
    /**
     * A key figure's trend, for a screen reader: its keys [scope-143]
     */
    chartTrendKeys: string;
    /**
     * A meter's share, in the words a screen reader hears, when the page names it nothing else ("62% used") [scope-143]
     */
    meterUsed: string;
    /**
     * A meter with no share, for a screen reader [scope-143]
     */
    meterNotMeasured: string;
    /**
     * A loading meter, for a screen reader [scope-143]
     */
    meterMeasuring: string;
    /**
     * The calendar's busy text when the page gives none (`Loading…`)
     */
    loading?: string;
    /**
     * The word a busy picture spells on screen, deciphered letter by letter (cyberpunk's skeletons, busy bars and meters); `setStrings()` hands it to the stylesheet [scope-143]
     */
    loadingWord: string;
    /**
     * The name of a month heatmap's row of month buttons (js/calendar.js) [scope-143]
     */
    calendarNav: string;
    /**
     * A month heatmap's button to the month before; its name and title are `previousMonth` [scope-143]
     */
    calendarPrev: string;
    /**
     * Its button to the month after; its name and title are `nextMonth` [scope-143]
     */
    calendarNext: string;
    /**
     * Its button back to today's month, with today picked [scope-143]
     */
    calendarToday: string;
    /**
     * That button's title [scope-143]
     */
    calendarTodayTitle: string;
    /**
     * A day's name and title: the date (dd/mm/yyyy) and what the page says about it [scope-143]
     */
    calendarDay: (date: string, label: string) => string;
    /**
     * What a day still to come is, when the page says nothing about it [scope-143]
     */
    calendarFuture: string;
    /**
     * What every day is while the calendar loads [scope-143]
     */
    calendarLoading: string;
    /**
     * What a past day is when the page says nothing about it [scope-143]
     */
    calendarUnknown: string;
    /**
     * The name of a week agenda when the page gives none (js/week.js)
     */
    weekGroup: string;
    /**
     * The week agenda's button to the week before
     */
    weekPrev: string;
    /**
     * Its button to the week after
     */
    weekNext: string;
    /**
     * Its button back to the current week; also the word under today's date
     */
    weekToday: string;
    /**
     * The now-line's name
     */
    weekNow: string;
    /**
     * The now-line's name with the time, "now, 14:32"
     */
    weekNowAt: (time: string) => string;
    /**
     * The overflow pill's text, "+3"
     */
    weekMore: (n: number) => string;
    /**
     * The overflow pill's name, "3 more runs on Tue 17/10"
     */
    weekMoreLabel: (n: number, day: string) => string;
    /**
     * What a next run is called in a pill's name
     */
    weekNextRun: string;
    /**
     * What a switched-off item is called in a pill's name
     */
    weekOff: string;
    /**
     * What a skipped item is called in a pill's name
     */
    weekSkipped: string;
    /**
     * What a reference item (the host's own round) is called in a pill's name
     */
    weekReference: string;
    /**
     * The sentence of a week with nothing in it
     */
    weekEmpty: string;
    /**
     * The sentence of a week being read
     */
    weekLoading: string;
    /**
     * The name of a run timeline when the page gives none (js/gantt.js)
     */
    ganttGroup: string;
    /**
     * The name of the range buttons
     */
    ganttRange: string;
    /**
     * A range button's title, "Show the last 6 hours"
     */
    ganttRangeTitle: (label: string) => string;
    /**
     * The now-line's name
     */
    ganttNow: string;
    /**
     * The selected range's chip label
     */
    ganttSelection: string;
    /**
     * The button that lifts the selected range
     */
    ganttClear: string;
    /**
     * Its title
     */
    ganttClearTitle: string;
    /**
     * The chip's text, "Selected 14:00 to 16:30"
     */
    ganttSelected: (from: string, to: string) => string;
    /**
     * The sentence of a timeline with no run in the window
     */
    ganttEmpty: string;
    /**
     * The sentence of a timeline being read
     */
    ganttLoading: string;
    /**
     * A queued run's state word
     */
    ganttQueued: string;
    /**
     * A running run's state word
     */
    ganttRunning: string;
    /**
     * A finished run's state word
     */
    ganttOk: string;
    /**
     * A failed run's state word
     */
    ganttFailed: string;
    /**
     * What the timeline's status region says when a run changes state, "Backup: failed"
     */
    ganttAnnounce: (label: string, state: string) => string;
    /**
     * A bar's name, "Backup, 02:00 to 02:14, failed"
     */
    ganttBar: (label: string, when: string, state: string) => string;
    /**
     * The button that makes the window follow now
     */
    ganttLive: string;
    /**
     * Its title
     */
    ganttLiveTitle: string;
    /**
     * The button that makes the selected range the window
     */
    ganttZoom: string;
    /**
     * Its title
     */
    ganttZoomTitle: string;
    /**
     * A length of time as a person reads it, "14 min", "1 h 5 min", "45 s"
     */
    ganttDuration: (seconds: number) => string;
    /**
     * The one-line hint under the timeline on how to read and use it
     */
    ganttHint: string;
    /**
     * The range button that fits the window to everything on the timeline (`all` in `data-kp-gantt-ranges`) [kpadopt4]
     */
    ganttAll: string;
    /**
     * Its title
     */
    ganttAllTitle: string;
    /**
     * A point event's name, "Applied, 02/10/2026" [kpadopt4]
     */
    ganttPoint: (label: string, when: string) => string;
    /**
     * The word after a planned point's name, still to come
     */
    ganttPlanned: string;
    /**
     * The name of marks too close to tell apart, "3 events: Applied, Mail, Call"
     */
    ganttCluster: (count: number, labels: string) => string;
    /**
     * The count on such a mark, "+2"
     */
    ganttClusterMore: (more: number) => string;
    /**
     * The hint under a timeline of point events
     */
    ganttPointsHint: string;
    /**
     * The words on a pipeline's loading card (js/pipeline.js) [kpadopt4]
     */
    pipelineLoading: string;
    /**
     * The sentence over a pipeline with no cards, when the page gives none
     */
    pipelineEmpty: string;
    /**
     * The sentence over a pipeline that could not be read
     */
    pipelineFailed: (reason: string) => string;
    /**
     * Its Try again button
     */
    pipelineRetry: string;
    /**
     * The word in a lane with no cards
     */
    pipelineNone: string;
    /**
     * The button under a lane's first cards, "+4 more"
     */
    pipelineMore: (more: number) => string;
    /**
     * The same button while the lane shows every card
     */
    pipelineLess: string;
    /**
     * A lane's share of all cards, "25 % of all"
     */
    pipelineShare: (percent: number) => string;
    /**
     * The uptime strip's busy card and its summary while the history is read (js/uptime.js) [kpadopt4-ideas]
     */
    uptimeLoading: string;
    /**
     * Its summary when no period has data yet [kpadopt4-ideas]
     */
    uptimeEmpty: string;
    /**
     * Its summary when the history could not be read and the page gave no sentence [kpadopt4-ideas]
     */
    uptimeError: string;
    /**
     * The window's share up, from "99.4" to "99.4%" [kpadopt4-ideas]
     */
    uptimePercent: (percent: string) => string;
    /**
     * The window's incident count, exact: "1 incident", "12 incidents" [kpadopt4-ideas]
     */
    uptimeIncidents: (n: number) => string;
    /**
     * The summary as one sentence, for a screen reader [kpadopt4-ideas]
     */
    uptimeSummary: (percent: string, incidents: number) => string;
    /**
     * The strip's name: its title and its summary [kpadopt4-ideas]
     */
    uptimeTrack: (label: string, summary: string) => string;
    /**
     * A period's state as a word: up, degraded, down, no data [kpadopt4-ideas]
     */
    uptimeStateWord: (state: string) => string;
    /**
     * A cell's name and hover card: its period, its state and its figures [kpadopt4-ideas]
     */
    uptimeCell: (label: string, state: string, percent: string | null, incidents: number | null) => string;
    /**
     * Under a strip too narrow for every cell: "55 of 90 shown" [kpadopt4-ideas]
     */
    uptimeShown: (shown: number, total: number) => string;
    /**
     * A period's figures in its quick info: "99.4% up · 1 incident" [kpadopt4 r2]
     */
    uptimeInfoFigures: (percent: string | null, incidents: number | null) => string;
    /**
     * The link in a period's quick info to the period's own page: "Open 14/10/2026" [kpadopt4 r2]
     */
    uptimeOpen: (label: string) => string;
    /**
     * The typed confirmation's label; the name is set in as code where this sentence puts it (js/components.js) [kpadopt4-ideas]
     */
    typeConfirmLabel: (name: string) => string;
    /**
     * Its rule when capitals count [kpadopt4-ideas]
     */
    typeConfirmRuleExact: string;
    /**
     * Its rule when capitals do not count (`data-kp-confirm-case="any"`) [kpadopt4-ideas]
     */
    typeConfirmRuleAnyCase: string;
    /**
     * The badge once the typed name matches [kpadopt4-ideas]
     */
    typeConfirmMatched: string;
    /**
     * The line while what is typed does not match yet [kpadopt4-ideas]
     */
    typeConfirmMismatch: string;
    /**
     * The heading over what the action will delete [kpadopt4-ideas]
     */
    typeConfirmLoses: string;
    /**
     * A command block's terminal by its key: WSL, PowerShell, cmd, Garuda, bash; another key as written (js/command.js) [kpadopt4-ideas]
     */
    commandShell: (shell: string) => string;
    /**
     * The badge of a Windows command that needs a terminal opened as administrator [kpadopt4-ideas]
     */
    commandAdmin: string;
    /**
     * Its tooltip [kpadopt4-ideas]
     */
    commandAdminTitle: string;
    /**
     * The badge of a Linux command that runs with root rights [kpadopt4-ideas]
     */
    commandSudo: string;
    /**
     * Its tooltip [kpadopt4-ideas]
     */
    commandSudoTitle: string;
    /**
     * The note under a command that says where it runs [kpadopt4-ideas]
     */
    commandRunsOn: (where: string) => string;
    /**
     * A timer's Start button (js/countdown.js, js/timer-disc.js) [kpadopt4-ideas]
     */
    timerStart: string;
    /**
     * The same button while it runs [kpadopt4-ideas]
     */
    timerPause: string;
    /**
     * The same button while it is paused [kpadopt4-ideas]
     */
    timerResume: string;
    /**
     * A timer's Reset button [kpadopt4-ideas]
     */
    timerReset: string;
    /**
     * The countdown's button that adds time: "+1 min" [kpadopt4-ideas]
     */
    timerAddMinute: (seconds: number) => string;
    /**
     * Its tooltip: "Add 1 min" [kpadopt4-ideas]
     */
    timerAddMinuteTitle: (seconds: number) => string;
    /**
     * The line under a paused timer, and what a screen reader hears [kpadopt4-ideas]
     */
    timerPaused: string;
    /**
     * The line under a timer whose time is up [kpadopt4-ideas]
     */
    timerEnded: string;
    /**
     * What a screen reader hears when a named timer ends [kpadopt4-ideas]
     */
    timerEndedNamed: (name: string) => string;
    /**
     * What a screen reader hears when a timer starts [kpadopt4-ideas]
     */
    timerStarted: string;
    /**
     * What a screen reader hears when it goes on after a pause [kpadopt4-ideas]
     */
    timerResumed: string;
    /**
     * The countdown's time left for a screen reader: "25 min left" [kpadopt4-ideas]
     */
    timerLeft: (duration: string) => string;
    /**
     * A timer's length in words: "25 min", "1 h 30 min", "45 s" [kpadopt4-ideas]
     */
    timerDuration: (seconds: number) => string;
    /**
     * The visual timer's face for a screen reader: "12 min left of 25 min" [kpadopt4-ideas]
     */
    timerDiscLeft: (left: string, total: string) => string;
    /**
     * The time left on the face in its last minute [kpadopt4-ideas]
     */
    timerUnderMinute: string;
    /**
     * The still line under the disc: "Focus · 25 min" [kpadopt4-ideas]
     */
    timerDiscCaption: (name: string, duration: string) => string;
    /**
     * The range picker's preset group, for a screen reader (js/range.js) [kpadopt4-ideas]
     */
    rangePresets: string;
    /**
     * A preset in words: "Last 24 hours" [kpadopt4-ideas]
     */
    rangePresetName: (key: string) => string;
    /**
     * A preset on its segment: "24h" [kpadopt4-ideas]
     */
    rangePresetShort: (key: string) => string;
    /**
     * The button that opens the custom range [kpadopt4-ideas]
     */
    rangeCustom: string;
    /**
     * The custom panel's title [kpadopt4-ideas]
     */
    rangeCustomTitle: string;
    /**
     * A custom window's name in the line under the picker [kpadopt4-ideas]
     */
    rangeCustomName: string;
    /**
     * The start's label [kpadopt4-ideas]
     */
    rangeFrom: string;
    /**
     * The end's label [kpadopt4-ideas]
     */
    rangeTo: string;
    /**
     * A date field's name: "From, date (dd/mm/yyyy)" [kpadopt4-ideas]
     */
    rangeDateLabel: (bound: string) => string;
    /**
     * A time field's name [kpadopt4-ideas]
     */
    rangeTimeLabel: (bound: string) => string;
    /**
     * The time field's placeholder [kpadopt4-ideas]
     */
    rangeTimeHint: string;
    /**
     * The custom panel's Apply [kpadopt4-ideas]
     */
    rangeApply: string;
    /**
     * The custom panel's Cancel [kpadopt4-ideas]
     */
    rangeCancel: string;
    /**
     * The line under the picker: "Last 24 hours · 15/10/2026 14:05 – 16/10/2026 14:05" [kpadopt4-ideas]
     */
    rangeLabel: (name: string, from: string, to: string) => string;
    /**
     * A date that is not a whole dd/mm/yyyy [kpadopt4-ideas]
     */
    rangeErrorDate: (bound: string) => string;
    /**
     * A time that is not a time of day [kpadopt4-ideas]
     */
    rangeErrorTime: (bound: string) => string;
    /**
     * A window whose end does not come after its start [kpadopt4-ideas]
     */
    rangeErrorOrder: string;
    /**
     * A window that ends in the future [kpadopt4-ideas]
     */
    rangeErrorFuture: string;
    /**
     * A window longer than the picker allows [kpadopt4-ideas]
     */
    rangeErrorSpan: (days: number) => string;
    /**
     * The compare slider's label on the before side (js/compare.js) [kpadopt4-ideas]
     */
    compareBefore: string;
    /**
     * Its label on the after side [kpadopt4-ideas]
     */
    compareAfter: string;
    /**
     * The divider's name for a screen reader [kpadopt4-ideas]
     */
    compareSlider: (before: string, after: string) => string;
    /**
     * Where the divider stands: "40% Before, 60% After" [kpadopt4-ideas]
     */
    compareValue: (percent: number, before: string, after: string) => string;
    /**
     * A pane whose image could not be loaded [kpadopt4-ideas]
     */
    compareFailed: string;
    /**
     * The Retry button of a pane whose image could not be loaded [kpadopt4 r2]
     */
    compareRetry: string;
    /**
     * What the busy card over a compare slider says while its images load [kpadopt4 r2]
     */
    compareLoading: string;
    /**
     * The network graph's way back to every node and every kind of link (js/graph.js) [scope-143]
     */
    graphShowAll: string;
    /**
     * Its title [scope-143]
     */
    graphShowAllTitle: string;
    /**
     * The hint under the graph, and the second half of its picture's accessible name: what a pointer, a click and the keys do [scope-143]
     */
    graphHint: string;
    /**
     * The name of the list of kinds of link over the graph [scope-143]
     */
    graphKinds: string;
    /**
     * A loading graph's sentence when the page gives none (`setGraphState(el, 'loading')`) [scope-143]
     */
    graphLoading: string;
    /**
     * The picture's name when the graph has no `aria-label` [scope-143]
     */
    graphUnnamed: string;
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
     * The console warning when two elements of one component ask to be remembered under the same name
     */
    rememberClash: (name: string, component: string) => string;
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
    /**
     * A three-way filter chip that must be in, as a screen reader hears it after the chip's name (js/segmented.js, `data-kp-segmented="tri"`) [kpadopt4]
     */
    triInclude: string;
    /**
     * A chip that must not be in [kpadopt4]
     */
    triExclude: string;
    /**
     * A chip that may or may not be in [kpadopt4]
     */
    triAny: string;
    /**
     * What a three-way group says after a press, "Chicken: required" [kpadopt4]
     */
    triAnnounce: (label: string, state: string) => string;
    /**
     * The line under a three-way group while nothing is chosen [kpadopt4]
     */
    triHint: string;
    /**
     * The same line once something is chosen [kpadopt4]
     */
    triSummary: (include: string[], exclude: string[]) => string;
    /**
     * What a three-way group says after Clear all [kpadopt4]
     */
    triCleared: string;
    /**
     * The minus button's name, "Portions, less" (js/quantity.js) [kpadopt4]
     */
    quantityLess: (label: string) => string;
    /**
     * The plus button's name, "Portions, more" [kpadopt4]
     */
    quantityMore: (label: string) => string;
    /**
     * The value with its unit, as a screen reader hears it, "6 portions" [kpadopt4]
     */
    quantityValue: (value: string, unit: string) => string;
    /**
     * A checklist group's count beside its heading, "4 of 9" (js/checklist.js) [kpadopt4]
     */
    checklistCount: (done: number, total: number) => string;
    /**
     * The whole list's count in its bar, "4 of 9 done" [kpadopt4]
     */
    checklistSummary: (done: number, total: number) => string;
    /**
     * The bar's button that ticks every item [kpadopt4]
     */
    checklistCheckAll: string;
    /**
     * The bar's button that takes the tick off every item [cook-1017]
     */
    checklistUncheckAll: string;
    /**
     * The bar's button that takes the ticked items away [kpadopt4]
     */
    checklistClear: string;
    /**
     * The button that brings them back [kpadopt4]
     */
    checklistUndo: string;
    /**
     * The bar's line after a clear, "3 cleared" [kpadopt4]
     */
    checklistCleared: (n: number) => string;
    /**
     * Said after Undo [kpadopt4]
     */
    checklistRestored: (n: number) => string;
    /**
     * An empty checklist [kpadopt4]
     */
    checklistEmpty: string;
    /**
     * The words under a loading checklist's spinner [kpadopt4]
     */
    checklistLoading: string;
    /**
     * A checklist that could not be read, when the page gives no message [kpadopt4]
     */
    checklistFailed: string;
    /**
     * Said when an item is ticked [kpadopt4]
     */
    checklistDone: (label: string) => string;
    /**
     * Said when an item is ticked with the keyboard and sank [kpadopt4]
     */
    checklistDoneMoved: (label: string) => string;
    /**
     * Said when an item is unticked [kpadopt4]
     */
    checklistOpen: (label: string) => string;
    /**
     * A kitchen timer's state word while it runs (js/timer.js) [kpadopt4]
     */
    timerRunning: string;
    /**
     * Its state word once it has ended [kpadopt4]
     */
    timerDoneWord: string;
    /**
     * The large line on an ended timer, its notification and its alert, "Rice is done" [kpadopt4]
     */
    timerDone: (name: string) => string;
    /**
     * What a timer says aloud when it ends and the list speaks, "Rice is done" [cook-1017]
     */
    timerSpoken: (name: string) => string;
    /**
     * The button on an ended timer that stops it and takes it away [kpadopt4]
     */
    timerStopRing: string;
    /**
     * That button's accessible name [kpadopt4]
     */
    timerAddMinuteTo: (name: string) => string;
    /**
     * The remove button's accessible name and tooltip [kpadopt4]
     */
    timerRemove: (name: string) => string;
    /**
     * A list with no timer [kpadopt4]
     */
    timerEmpty: string;
    /**
     * Said once when a timer has a minute left [kpadopt4]
     */
    timerLastMinute: (name: string) => string;
    /**
     * Said when a kitchen timer starts, with its name and its clock [kpadopt4]
     */
    timerStartedNamed: (name: string, clock: string) => string;
    /**
     * Said when a starter is pressed while its timer runs [kpadopt4]
     */
    timerAlready: (name: string) => string;
    /**
     * The count over a step shown on its own, "Step 3 of 8" (js/focus-steps.js) [kpadopt4]
     */
    focusCount: (n: number, total: number) => string;
    /**
     * The button that goes on to the next step [kpadopt4]
     */
    focusNext: string;
    /**
     * The button that goes back a step [kpadopt4]
     */
    focusPrevious: string;
    /**
     * The next button on the last step [kpadopt4]
     */
    focusDone: string;
    /**
     * The heading over what a step needs [kpadopt4]
     */
    focusNeeds: string;
    /**
     * A step's timer button, "Start a timer · 10 min" [kpadopt4]
     */
    focusTimer: (duration: string) => string;
    /**
     * The button that reads the step aloud [kpadopt4]
     */
    focusReadAloud: string;
    /**
     * The same button while it reads [kpadopt4]
     */
    focusStopReading: string;
    /**
     * The screen line while the screen is kept on [kpadopt4]
     */
    focusWakeOn: string;
    /**
     * The screen line when it is not [kpadopt4]
     */
    focusWakeOff: string;
    /**
     * The screen line in a browser that cannot keep it on [kpadopt4]
     */
    focusWakeUnsupported: string;
    /**
     * A view with no steps [kpadopt4]
     */
    focusEmpty: string;
    /**
     * The words under its spinner while the steps load [kpadopt4]
     */
    focusLoading: string;
    /**
     * Steps that could not be read, when the page gives no message [kpadopt4]
     */
    focusFailed: string;
    /**
     * The button in the middle of a wheel that picks (js/wheel.js) [kpadopt4]
     */
    wheelSpin: string;
    /**
     * The same button once the wheel has chosen [kpadopt4]
     */
    wheelSpinAgain: string;
    /**
     * The line under a wheel that has not spun yet [kpadopt4]
     */
    wheelIdle: string;
    /**
     * The line over the outcome, "The wheel chose" [kpadopt4]
     */
    wheelChose: string;
    /**
     * The line while it turns [kpadopt4]
     */
    wheelSpinning: string;
    /**
     * The line over the outcome when there was only one choice [kpadopt4]
     */
    wheelOnlyOne: string;
    /**
     * A wheel with no choices, when the page gives no sentence [kpadopt4]
     */
    wheelEmpty: string;
    /**
     * The words under its spinner while the choices load [kpadopt4]
     */
    wheelLoading: string;
    /**
     * Choices that could not be read, when the page gives no message [kpadopt4]
     */
    wheelFailed: string;
};
/**
 * @typedef {object} Strings
 * @property {string} alertSuccess
 * @property {string} alertWarning
 * @property {string} alertInfo
 * @property {string} alertError
 * @property {string} attentionCritical  The word a screen reader hears before a critical problem on the attention band (setAttention) [scope-143]
 * @property {string} attentionWarning  The same, before a warning [scope-143]
 * @property {string} attentionInfo  The same, before an information [scope-143]
 * @property {(verb: string, duration: string) => string} agoText  A ticking freshness line, "updated 12 s ago" (js/freshness.js) [scope-143]
 * @property {(verb: string) => string} agoNever  The same line with no moment yet, "not updated yet" [scope-143]
 * @property {(n: number) => string} agoSeconds  A duration's seconds part, "12 s" [scope-143]
 * @property {(n: number) => string} agoMinutes  Its minutes part, "2 min" [scope-143]
 * @property {(n: number) => string} agoHours  Its hours part, "3 h" [scope-143]
 * @property {(n: number) => string} agoDays  Its days part, "1 day", "2 days" [scope-143]
 * @property {string} agoVerb  The verb a freshness line uses when its element names none [scope-143]
 * @property {(text: string) => string} agoStale  What a freshness line with `data-kp-ago-announce="state"` announces once it turns stale [scope-143]
 * @property {(text: string) => string} agoFresh  What it announces once it is fresh again [scope-143]
 * @property {string} agoInLiveRegion  The console warning for a ticking line inside a live region [scope-143]
 * @property {string} stepPending  A step list's waiting step, as a screen reader hears it (js/steplist.js)
 * @property {string} stepRunning  The step being run
 * @property {string} stepDone  A finished step
 * @property {string} stepFailed  A step that failed
 * @property {string} stepSkipped  A step that was left out
 * @property {string} stepCurrent  The step a journey stands at now, neither running nor done (`data-state="current"`) [kpadopt4]
 * @property {(title: string, state: string) => string} stepAnnounce  What the list's status region says when a step changes, "Pull the images: running"
 * @property {string} statusOk  A status row that is fine, as a screen reader hears it (js/statusrow.js)
 * @property {string} statusLoading  A status row still being read
 * @property {string} statusFailed  A status row that failed
 * @property {string} statusEmpty  A status row with nothing to show
 * @property {string} statusWarn  A status row that passes with a reservation, `data-state="warn"` [kpadopt4-rows]
 * @property {string} cardLoading  What a loading card's busy card says under its spinner (js/card-state.js) [kpadopt4-rows]
 * @property {string} cardEmpty  An empty card's note when the page gives no title [kpadopt4-rows]
 * @property {string} cardFailed  A failed card's note when the page gives no title [kpadopt4-rows]
 * @property {string} cardRetry  The Try again button of a failed card [kpadopt4-rows]
 * @property {string} statusRetry  The Retry button of a failed status row
 * @property {(label: string) => string} statusRetryLabel  That button's accessible name, "Retry vault"
 * @property {(label: string, state: string, detail: string) => string} statusAnnounce  What the list's status region says when a row changes, "vault: failed, The host did not answer"
 * @property {(count: number, failed: number) => string} statusAnnounceMany  What it says when more than three rows change in one tick, "12 updated, 2 failed"
 * @property {string} facetOnly  The "only" button's text on a facet row (js/facets.js)
 * @property {(label: string) => string} facetOnlyLabel  That button's accessible name, "Show only Host"
 * @property {string} facetAll  The "Everything" row's text when the group gives none
 * @property {(label: string) => string} facetShowingOnly  What a facet group's status region says after "only", "Showing only Host"
 * @property {string} facetShowingAll  What it says after "Everything"
 * @property {string} idmarkUnknown  The glyph of an identity mark with no name (js/idmark.js) [kpadopt4-data]
 * @property {string} stackbarRest  The legend row of a share bar's free rest (js/stackbar.js)
 * @property {string} stackbarOther  The legend row the parts too small to draw are merged into
 * @property {(label: string, value: string, percent: string) => string} stackbarPart  One part, as a screen reader and the hover card read it
 * @property {(value: string) => string} stackbarOver  The free row when the parts add up to more than the whole
 * @property {(parts: string[]) => string} stackbarLabel  The bar's accessible name: every part in order
 * @property {string} stackbarLoading  A share bar being read
 * @property {string} stackbarEmpty  A share bar with nothing read yet
 * @property {string} stackbarError  A share bar that could not be read
 * @property {string} stackbarRetry  The Retry button of a failed share bar
 * @property {string} bulletsLoading  What the busy card over a bullet list says (js/bullets.js)
 * @property {string} bulletsEmpty  A bullet list with no rows, when the page gives no reason
 * @property {string} bulletsError  A bullet list that could not be read, when the page gives no sentence
 * @property {string} bulletsRetry  The Retry button of a failed bullet list
 * @property {string} bulletsUnknown  A row with nothing to measure, for a screen reader
 * @property {(figure: string, threshold: string) => string} bulletsValueText  A row's meter as a screen reader reads it
 * @property {string} codeLabel  A code block's accessible name when it has no title (js/code.js)
 * @property {string} codeWrap  The code block's Wrap toggle
 * @property {string} codePretty  The JSON view laid out with indents
 * @property {string} codeRaw  The JSON view as it came
 * @property {string} codeFormat  The accessible name of the Pretty / Raw choice
 * @property {(lines: number) => string} codeShowAll  The button under a folded block
 * @property {string} codeShowLess  The same button once the block is open
 * @property {(lines: number) => string} codeLines  The block's line count beside its title
 * @property {string} codeEmpty  A block with nothing in it
 * @property {(size: string) => string} codeBinary  A block whose content is not text
 * @property {(shown: string, total: string) => string} codeTruncated  The foot of a block that holds only the start
 * @property {string} codeLoading  What the busy card over a block says
 * @property {string} codeError  A block that could not be read, when the page gives no sentence
 * @property {(title: string) => string} codeCopiedAnnouncement  Announced after a copy, naming the block
 * @property {string} transferBar  The accessible name of a transfer's bar when it has no file name (js/transfer.js) [kpadopt5-transfer]
 * @property {(done: string, total: string) => string} transferOf  The reading of a transfer with a known size, "1.2 GB of 4.1 GB" [kpadopt5-transfer]
 * @property {(done: string) => string} transferSoFar  The reading of a transfer of unknown size, "1.2 GB so far" [kpadopt5-transfer]
 * @property {string} transferEstimating  The time left while the speed is not steady yet [kpadopt5-transfer]
 * @property {(duration: string) => string} transferLeft  The time left, "about 3 min left" [kpadopt5-transfer]
 * @property {(duration: string) => string} transferStalled  A transfer that moved no byte for a while, "stalled for 12 s" [kpadopt5-transfer]
 * @property {(rate: string) => string} transferAverage  A finished transfer's average speed, "avg 21 MB/s" [kpadopt5-transfer]
 * @property {(duration: string) => string} transferTook  A finished transfer's duration, "in 3 min 12 s" [kpadopt5-transfer]
 * @property {string} transferFailed  The first words of a failed transfer's note [kpadopt5-transfer]
 * @property {string} transferRetry  The Retry button of a failed transfer [kpadopt5-transfer]
 * @property {(name: string, percent: number) => string} transferAnnounce  What a screen reader hears at 25, 50, 75 and 100 % [kpadopt5-transfer]
 * @property {string} connOffline  The banner's first line when the connection is gone (js/connection.js) [kpadopt5-connection]
 * @property {string} connOfflineWhy  What is true meanwhile and what happens next [kpadopt5-connection]
 * @property {string} connReconnecting  The first line while a try is under way [kpadopt5-connection]
 * @property {string} connReconnectingWhy  Its second line on the first try [kpadopt5-connection]
 * @property {(n: number) => string} connAttempt  Its second line from the second try, "Attempt 2" [kpadopt5-connection]
 * @property {(duration: string) => string} connNextTry  The time to the next automatic try, "next try in 8 s" [kpadopt5-connection]
 * @property {(n: number) => string} connPending  The exact count of changes waiting, "3 changes waiting" [kpadopt5-connection]
 * @property {string} connBack  The first line when the connection is back [kpadopt5-connection]
 * @property {string} connBackWhy  Its second line with nothing waiting [kpadopt5-connection]
 * @property {(n: number) => string} connBackSending  Its second line with changes waiting, "Sending 3 changes" [kpadopt5-connection]
 * @property {string} connRefused  The first line when the server refuses while the browser is online [kpadopt5-connection]
 * @property {string} connRefusedWhy  Its second line when the app gives none [kpadopt5-connection]
 * @property {string} connRetry  The Retry now button [kpadopt5-connection]
 * @property {(duration: string) => string} refreshEvery  A refresh choice, "Every 30 s" (js/auto-refresh.js) [kpadopt5-auto-refresh]
 * @property {string} refreshPaused  The choice that stops the refreshing [kpadopt5-auto-refresh]
 * @property {string} refreshOther  The entry that lets a person type any number of seconds [kpadopt5-auto-refresh]
 * @property {string} refreshLabel  The accessible name of the refresh chooser [kpadopt5-auto-refresh]
 * @property {string} refreshNow  The button that refreshes at once [kpadopt5-auto-refresh]
 * @property {string} refreshUpdating  The freshness line's words while the app reads [kpadopt5-auto-refresh]
 * @property {(next: string) => string} refreshFailed  The note after a failed refresh, "Last refresh failed, retrying in 30 s" [kpadopt5-auto-refresh]
 * @property {string} refreshRetryNow  The button that retries a failed refresh at once [kpadopt5-auto-refresh]
 * @property {string} refreshCustomLabel  The label of the field for any number of seconds [kpadopt5-auto-refresh]
 * @property {string} refreshApply  The button that sets that number [kpadopt5-auto-refresh]
 * @property {string} refreshInvalid  What a number that is not a whole number of seconds says [kpadopt5-auto-refresh]
 * @property {string} paneEmpty  The detail pane's plate while nothing is picked (js/master-detail.js) [kpadopt5-master-detail]
 * @property {string} paneBack  The Back button at the top of a folded detail pane [kpadopt5-master-detail]
 * @property {string} paneLoading  What the busy card over the detail pane says [kpadopt5-master-detail]
 * @property {string} paneErrorTitle  The errored detail's first line, when the page gives none [kpadopt5-master-detail]
 * @property {string} paneErrorText  Its sentence, when the page gives none [kpadopt5-master-detail]
 * @property {string} paneRetry  The Retry button of an errored detail [kpadopt5-master-detail]
 * @property {string} busy
 * @property {string} close
 * @property {string} menu          The accessible name of a collapsed navigation's toggle
 * @property {string} closeMenu     The same toggle once the navigation is open
 * @property {string} navDisclosure  The accessible name of a mega-menu button in the bar that holds no words of its own [scope-48]
 * @property {string} sidebar       The accessible name of a hidden side navigation's toggle
 * @property {string} closeSidebar  The same toggle once that side navigation is open
 * @property {string} collapseRail  The accessible name of an empty slim-rail toggle while the rail is expanded
 * @property {string} expandRail    The same toggle while the rail is collapsed to its icons
 * @property {string} resizeSidebar The name of the resize handle on a resizable side navigation
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
 * @property {string} paletteTrigger  The visible word on the command palette's trigger in the bar [scope-48]
 * @property {(key: string, mac: boolean) => string} paletteHotkey  The hotkey as that trigger prints it: ⌘K on a Mac, Ctrl K elsewhere [scope-48]
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
 * @property {(title: string) => string} chooseMonth  The month title's name: it opens the twelve months [scope-89]
 * @property {(year: number) => string} chooseYear    The year title's name: it opens twelve years [scope-89]
 * @property {string} previousYear
 * @property {string} nextYear
 * @property {string} previousYears  Twelve years back, in the year grid
 * @property {string} nextYears      Twelve years on, in the year grid
 * @property {(year: number) => string} monthGrid           The month grid's name, and what is said when it opens
 * @property {(from: number, to: number) => string} yearGrid The year grid's name, and what is said when it opens
 * @property {(from: number, to: number) => string} yearRange The year grid's title
 * @property {string[]} weekdays
 * @property {string[]} months
 * @property {string[]} monthsShort  The month grid's cells, where a full name does not fit [scope-89]
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
 * @property {string} secretLabel  A secret field's name when the page gives none (js/patterns.js, `.kp-secret`) [kpadopt4]
 * @property {string} secretReveal  The button that shows a secret
 * @property {string} secretHide  The same button while the secret is shown
 * @property {string} secretHold  The button of a secret shown only while it is held (`data-kp-secret-reveal-on="hold"`)
 * @property {string} secretCopy  The button that copies a secret without showing it
 * @property {string} secretReading  The words beside the spinner while a secret is fetched
 * @property {string} secretRetry  The reveal button's words after a secret could not be read
 * @property {(seconds: number) => string} secretHidesIn  The countdown under a shown secret, "Hides in 28 s"
 * @property {string} secretPaused  The countdown's words while the reader selects or holds the focus in the value
 * @property {string} secretStaysShown  The line under a shown secret that hides only when asked (`data-kp-secret-ttl="0"`)
 * @property {(seconds: number) => string} secretShown  What a screen reader hears when a secret is shown, "Shown. Hides in 30 s."
 * @property {string} secretHidden  What it hears when the secret is hidden again
 * @property {(reason: string) => string} secretFailed  The line under a secret that could not be read
 * @property {string} secretNoSource  The reason when a secret has no value, loader or listener to read it from
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
 * @property {(count: number) => string} confirmDependents  The heading over what still uses the thing a confirmation would remove, "Still in use by 2" (`data-kp-confirm-dependents`) [kpadopt4]
 * @property {string} confirmBlocked  What a confirmation that may not go ahead says when the page gives no sentence (`data-kp-confirm-blocked`) [kpadopt4]
 * @property {string} confirmClose  The one button of a confirmation that may not go ahead [kpadopt4]
 * @property {string} alarmAction  The button that closes an alarm that must be acknowledged, when the caller names none [scope-94]
 * @property {string} alarmKeepOpen  The button that stops an alarm's countdown and keeps it open [scope-94]
 * @property {string} alarmHint  The key hint beside the acknowledge button; hidden from a screen reader [scope-94]
 * @property {(seconds: number) => string} alarmCountdown  The whole seconds left under the countdown bar; hidden from a screen reader [scope-94]
 * @property {(seconds: number) => string} alarmClosesBy  Said once when an alarm that closes by itself opens [scope-94]
 * @property {(action: string) => string} alarmPressTo  Said when an alarm that must be acknowledged opens [scope-94]
 * @property {(action: string) => string} alarmKeptOpen  Said when Keep open stopped the countdown [scope-94]
 * @property {string} save
 * @property {string} mainNavigation
 * @property {string} skipToContent
 * @property {string} diagnosticsEffects  The diagnostics row that lists unknown hook values [AR44]
 * @property {string} diagnosticsEffectsNone
 * @property {string} classified  The stamp a register may print on an emphasis reveal (the dossier) [AR35]
 * @property {string} arrivalLine  The neutral boot line of an arrival, for a theme that performs one and has no words of its own in `arrivalWordsByTheme` or `arrivalLinesByTheme` [SW2, scope-84]
 * @property {Record<string, { line?: string, progress?: string, ready?: string }>} arrivalWordsByTheme  A theme's own words for the counting boot, keyed by theme [scope-84]: its line, the word before the percentage, and the word that closes it. A word the entry leaves out is the neutral one.
 * @property {Record<string, string[]>} arrivalLinesByTheme  The lines a theme's own boot shows instead of that one line, in order, keyed by theme [S49, A11]. A `{count}` in a line is replaced by a number counting up to `--kp-arrival-count` (640 by default), which is how retro's memory test reads.
 * @property {string} arrivalProgress  The neutral word before the percentage on that line
 * @property {string} arrivalReady  The neutral word that closes the boot line
 * @property {string} arrivalSkip  The button that ends the arrival at once
 * @property {string} measureLoading  A live dimension label before the first measurement lands (blueprint) [S48]
 * @property {(w: number, h: number) => string} measureBox  The size of the box the measurement frame holds (blueprint) [scope-18]
 * @property {(label: string) => string} chartPlot  A time chart's plot, for a screen reader: what it is and its keys [scope-143]
 * @property {(label: string) => string} chartSpark  A chart's 24-hour spark line, for a screen reader [scope-143]
 * @property {(label: string) => string} chartSources  The name of a chart's legend [scope-143]
 * @property {(label: string) => string} chartSource  A legend button's title: what hovering and clicking it do [scope-143]
 * @property {string} chartShowAll  The legend's way back to every source [scope-143]
 * @property {string} chartShowAllTitle  Its title [scope-143]
 * @property {string} chartHintPointer  The hint under a legend, for a pointer [scope-143]
 * @property {string} chartHintTouch  The same hint, for a finger [scope-143]
 * @property {string} chartPinned  The word in a pinned tooltip's head [scope-143]
 * @property {string} chartRelease  The pinned tooltip's ✕, named [scope-143]
 * @property {string} chartChange  The tooltip's foot: what the ▲/▼ column is [scope-143]
 * @property {string} chartOpen  An event's link in a pinned tooltip [scope-143]
 * @property {(label: string, time: string) => string} chartMark  An event marker's title [scope-143]
 * @property {(from: string, to: string) => string} chartZoomed  The zoom chip, before its Reset, from its two ends; used only when a consumer overrides it and not `chartZoomedSpan` [scope-143]
 * @property {(span: string) => string} chartZoomedSpan  The zoom chip, before its Reset: `span` is the zoom as the chart's `range` time style prints it [scope-143]
 * @property {string} chartReset  The zoom chip's button [scope-143]
 * @property {string} chartResetTitle  Its title [scope-143]
 * @property {string} chartUp  A rise, as the readout says it [scope-143]
 * @property {string} chartDown  A fall, as the readout says it [scope-143]
 * @property {string} chartSame  No change, as the readout says it [scope-143]
 * @property {string} chartNow  A spark line's value when no time is under the crosshair [scope-143]
 * @property {string} chartEmpty  A time chart with no readings in its window, in the plot at its height [scope-143]
 * @property {string} chartOnePoint  Under a chart whose every source has one reading (with `onePointNote`) [scope-143]
 * @property {string} chartLoading  A loading chart (`data-kp-chart-loading`), for a screen reader [scope-143]
 * @property {string} chartPinnedOutside  A pinned tooltip's head once a live update moved the window past the pin [scope-143]
 * @property {string} menuLoading  A menu button's menu while its entries load: one disabled entry (js/menu-button.js) [scope-143]
 * @property {string} menuEmpty  The title of a menu button with no entries, which stays and does nothing (`data-kp-menu-empty="disable"`) [scope-143]
 * @property {string} navMore  The word on the button a folding bar puts its overflowing links behind (`data-kp-nav-fold`, js/nav-fold.js) [kpadopt-nav]
 * @property {string} navMoreMenu  The name of that button's menu, for a screen reader [kpadopt-nav]
 * @property {string} navMoreAlert  Said after the button's name when a link behind it carries a counter [kpadopt-nav]
 * @property {string} navMoreUnavailable  Under a folded link that cannot be followed now (`aria-disabled`, `disabled`), as its reason [kpadopt-nav]
 * @property {string} tourNext  The tour card's button to the next step (js/tour.js) [scope-143]
 * @property {string} tourNextTitle  Its title [scope-143]
 * @property {string} tourBack  The tour card's button to the step before [scope-143]
 * @property {string} tourBackTitle  Its title [scope-143]
 * @property {string} tourDone  The next button on the last step, which ends the tour [scope-143]
 * @property {string} tourDoneTitle  Its title [scope-143]
 * @property {string} tourSkip  The tour card's button that ends the tour at once [scope-143]
 * @property {string} tourSkipTitle  Its title [scope-143]
 * @property {(n: number, of: number) => string} tourCount  The tour card's count, "1 of 5"; `of` counts only the steps whose part is on the page [scope-143]
 * @property {string} chartToday  A key figure's trend axis: the word after the first point's clock when it is today ("07:00 today") [scope-143]
 * @property {string} chartYesterday  The same when it is yesterday ("14:40 yesterday") [scope-143]
 * @property {string} chartTrendKeys  A key figure's trend, for a screen reader: its keys [scope-143]
 * @property {string} meterUsed  A meter's share, in the words a screen reader hears, when the page names it nothing else ("62% used") [scope-143]
 * @property {string} meterNotMeasured  A meter with no share, for a screen reader [scope-143]
 * @property {string} meterMeasuring  A loading meter, for a screen reader [scope-143]
 * @property {string} [loading]  The calendar's busy text when the page gives none (`Loading…`)
 * @property {string} loadingWord  The word a busy picture spells on screen, deciphered letter by letter (cyberpunk's skeletons, busy bars and meters); `setStrings()` hands it to the stylesheet [scope-143]
 * @property {string} calendarNav  The name of a month heatmap's row of month buttons (js/calendar.js) [scope-143]
 * @property {string} calendarPrev  A month heatmap's button to the month before; its name and title are `previousMonth` [scope-143]
 * @property {string} calendarNext  Its button to the month after; its name and title are `nextMonth` [scope-143]
 * @property {string} calendarToday  Its button back to today's month, with today picked [scope-143]
 * @property {string} calendarTodayTitle  That button's title [scope-143]
 * @property {(date: string, label: string) => string} calendarDay  A day's name and title: the date (dd/mm/yyyy) and what the page says about it [scope-143]
 * @property {string} calendarFuture  What a day still to come is, when the page says nothing about it [scope-143]
 * @property {string} calendarLoading  What every day is while the calendar loads [scope-143]
 * @property {string} calendarUnknown  What a past day is when the page says nothing about it [scope-143]
 * @property {string} weekGroup  The name of a week agenda when the page gives none (js/week.js)
 * @property {string} weekPrev  The week agenda's button to the week before
 * @property {string} weekNext  Its button to the week after
 * @property {string} weekToday  Its button back to the current week; also the word under today's date
 * @property {string} weekNow  The now-line's name
 * @property {(time: string) => string} weekNowAt  The now-line's name with the time, "now, 14:32"
 * @property {(n: number) => string} weekMore  The overflow pill's text, "+3"
 * @property {(n: number, day: string) => string} weekMoreLabel  The overflow pill's name, "3 more runs on Tue 17/10"
 * @property {string} weekNextRun  What a next run is called in a pill's name
 * @property {string} weekOff  What a switched-off item is called in a pill's name
 * @property {string} weekSkipped  What a skipped item is called in a pill's name
 * @property {string} weekReference  What a reference item (the host's own round) is called in a pill's name
 * @property {string} weekEmpty  The sentence of a week with nothing in it
 * @property {string} weekLoading  The sentence of a week being read
 * @property {string} ganttGroup  The name of a run timeline when the page gives none (js/gantt.js)
 * @property {string} ganttRange  The name of the range buttons
 * @property {(label: string) => string} ganttRangeTitle  A range button's title, "Show the last 6 hours"
 * @property {string} ganttNow  The now-line's name
 * @property {string} ganttSelection  The selected range's chip label
 * @property {string} ganttClear  The button that lifts the selected range
 * @property {string} ganttClearTitle  Its title
 * @property {(from: string, to: string) => string} ganttSelected  The chip's text, "Selected 14:00 to 16:30"
 * @property {string} ganttEmpty  The sentence of a timeline with no run in the window
 * @property {string} ganttLoading  The sentence of a timeline being read
 * @property {string} ganttQueued  A queued run's state word
 * @property {string} ganttRunning  A running run's state word
 * @property {string} ganttOk  A finished run's state word
 * @property {string} ganttFailed  A failed run's state word
 * @property {(label: string, state: string) => string} ganttAnnounce  What the timeline's status region says when a run changes state, "Backup: failed"
 * @property {(label: string, when: string, state: string) => string} ganttBar  A bar's name, "Backup, 02:00 to 02:14, failed"
 * @property {string} ganttLive  The button that makes the window follow now
 * @property {string} ganttLiveTitle  Its title
 * @property {string} ganttZoom  The button that makes the selected range the window
 * @property {string} ganttZoomTitle  Its title
 * @property {(seconds: number) => string} ganttDuration  A length of time as a person reads it, "14 min", "1 h 5 min", "45 s"
 * @property {string} ganttHint  The one-line hint under the timeline on how to read and use it
 * @property {string} ganttAll  The range button that fits the window to everything on the timeline (`all` in `data-kp-gantt-ranges`) [kpadopt4]
 * @property {string} ganttAllTitle  Its title
 * @property {(label: string, when: string) => string} ganttPoint  A point event's name, "Applied, 02/10/2026" [kpadopt4]
 * @property {string} ganttPlanned  The word after a planned point's name, still to come
 * @property {(count: number, labels: string) => string} ganttCluster  The name of marks too close to tell apart, "3 events: Applied, Mail, Call"
 * @property {(more: number) => string} ganttClusterMore  The count on such a mark, "+2"
 * @property {string} ganttPointsHint  The hint under a timeline of point events
 * @property {string} pipelineLoading  The words on a pipeline's loading card (js/pipeline.js) [kpadopt4]
 * @property {string} pipelineEmpty  The sentence over a pipeline with no cards, when the page gives none
 * @property {(reason: string) => string} pipelineFailed  The sentence over a pipeline that could not be read
 * @property {string} pipelineRetry  Its Try again button
 * @property {string} pipelineNone  The word in a lane with no cards
 * @property {(more: number) => string} pipelineMore  The button under a lane's first cards, "+4 more"
 * @property {string} pipelineLess  The same button while the lane shows every card
 * @property {(percent: number) => string} pipelineShare  A lane's share of all cards, "25 % of all"
 * @property {string} uptimeLoading  The uptime strip's busy card and its summary while the history is read (js/uptime.js) [kpadopt4-ideas]
 * @property {string} uptimeEmpty  Its summary when no period has data yet [kpadopt4-ideas]
 * @property {string} uptimeError  Its summary when the history could not be read and the page gave no sentence [kpadopt4-ideas]
 * @property {(percent: string) => string} uptimePercent  The window's share up, from "99.4" to "99.4%" [kpadopt4-ideas]
 * @property {(n: number) => string} uptimeIncidents  The window's incident count, exact: "1 incident", "12 incidents" [kpadopt4-ideas]
 * @property {(percent: string, incidents: number) => string} uptimeSummary  The summary as one sentence, for a screen reader [kpadopt4-ideas]
 * @property {(label: string, summary: string) => string} uptimeTrack  The strip's name: its title and its summary [kpadopt4-ideas]
 * @property {(state: string) => string} uptimeStateWord  A period's state as a word: up, degraded, down, no data [kpadopt4-ideas]
 * @property {(label: string, state: string, percent: string | null, incidents: number | null) => string} uptimeCell  A cell's name and hover card: its period, its state and its figures [kpadopt4-ideas]
 * @property {(shown: number, total: number) => string} uptimeShown  Under a strip too narrow for every cell: "55 of 90 shown" [kpadopt4-ideas]
 * @property {(percent: string | null, incidents: number | null) => string} uptimeInfoFigures  A period's figures in its quick info: "99.4% up · 1 incident" [kpadopt4 r2]
 * @property {(label: string) => string} uptimeOpen  The link in a period's quick info to the period's own page: "Open 14/10/2026" [kpadopt4 r2]
 * @property {(name: string) => string} typeConfirmLabel  The typed confirmation's label; the name is set in as code where this sentence puts it (js/components.js) [kpadopt4-ideas]
 * @property {string} typeConfirmRuleExact  Its rule when capitals count [kpadopt4-ideas]
 * @property {string} typeConfirmRuleAnyCase  Its rule when capitals do not count (`data-kp-confirm-case="any"`) [kpadopt4-ideas]
 * @property {string} typeConfirmMatched  The badge once the typed name matches [kpadopt4-ideas]
 * @property {string} typeConfirmMismatch  The line while what is typed does not match yet [kpadopt4-ideas]
 * @property {string} typeConfirmLoses  The heading over what the action will delete [kpadopt4-ideas]
 * @property {(shell: string) => string} commandShell  A command block's terminal by its key: WSL, PowerShell, cmd, Garuda, bash; another key as written (js/command.js) [kpadopt4-ideas]
 * @property {string} commandAdmin  The badge of a Windows command that needs a terminal opened as administrator [kpadopt4-ideas]
 * @property {string} commandAdminTitle  Its tooltip [kpadopt4-ideas]
 * @property {string} commandSudo  The badge of a Linux command that runs with root rights [kpadopt4-ideas]
 * @property {string} commandSudoTitle  Its tooltip [kpadopt4-ideas]
 * @property {(where: string) => string} commandRunsOn  The note under a command that says where it runs [kpadopt4-ideas]
 * @property {string} timerStart  A timer's Start button (js/countdown.js, js/timer-disc.js) [kpadopt4-ideas]
 * @property {string} timerPause  The same button while it runs [kpadopt4-ideas]
 * @property {string} timerResume  The same button while it is paused [kpadopt4-ideas]
 * @property {string} timerReset  A timer's Reset button [kpadopt4-ideas]
 * @property {(seconds: number) => string} timerAddMinute  The countdown's button that adds time: "+1 min" [kpadopt4-ideas]
 * @property {(seconds: number) => string} timerAddMinuteTitle  Its tooltip: "Add 1 min" [kpadopt4-ideas]
 * @property {string} timerPaused  The line under a paused timer, and what a screen reader hears [kpadopt4-ideas]
 * @property {string} timerEnded  The line under a timer whose time is up [kpadopt4-ideas]
 * @property {(name: string) => string} timerEndedNamed  What a screen reader hears when a named timer ends [kpadopt4-ideas]
 * @property {string} timerStarted  What a screen reader hears when a timer starts [kpadopt4-ideas]
 * @property {string} timerResumed  What a screen reader hears when it goes on after a pause [kpadopt4-ideas]
 * @property {(duration: string) => string} timerLeft  The countdown's time left for a screen reader: "25 min left" [kpadopt4-ideas]
 * @property {(seconds: number) => string} timerDuration  A timer's length in words: "25 min", "1 h 30 min", "45 s" [kpadopt4-ideas]
 * @property {(left: string, total: string) => string} timerDiscLeft  The visual timer's face for a screen reader: "12 min left of 25 min" [kpadopt4-ideas]
 * @property {string} timerUnderMinute  The time left on the face in its last minute [kpadopt4-ideas]
 * @property {(name: string, duration: string) => string} timerDiscCaption  The still line under the disc: "Focus · 25 min" [kpadopt4-ideas]
 * @property {string} rangePresets  The range picker's preset group, for a screen reader (js/range.js) [kpadopt4-ideas]
 * @property {(key: string) => string} rangePresetName  A preset in words: "Last 24 hours" [kpadopt4-ideas]
 * @property {(key: string) => string} rangePresetShort  A preset on its segment: "24h" [kpadopt4-ideas]
 * @property {string} rangeCustom  The button that opens the custom range [kpadopt4-ideas]
 * @property {string} rangeCustomTitle  The custom panel's title [kpadopt4-ideas]
 * @property {string} rangeCustomName  A custom window's name in the line under the picker [kpadopt4-ideas]
 * @property {string} rangeFrom  The start's label [kpadopt4-ideas]
 * @property {string} rangeTo  The end's label [kpadopt4-ideas]
 * @property {(bound: string) => string} rangeDateLabel  A date field's name: "From, date (dd/mm/yyyy)" [kpadopt4-ideas]
 * @property {(bound: string) => string} rangeTimeLabel  A time field's name [kpadopt4-ideas]
 * @property {string} rangeTimeHint  The time field's placeholder [kpadopt4-ideas]
 * @property {string} rangeApply  The custom panel's Apply [kpadopt4-ideas]
 * @property {string} rangeCancel  The custom panel's Cancel [kpadopt4-ideas]
 * @property {(name: string, from: string, to: string) => string} rangeLabel  The line under the picker: "Last 24 hours · 15/10/2026 14:05 – 16/10/2026 14:05" [kpadopt4-ideas]
 * @property {(bound: string) => string} rangeErrorDate  A date that is not a whole dd/mm/yyyy [kpadopt4-ideas]
 * @property {(bound: string) => string} rangeErrorTime  A time that is not a time of day [kpadopt4-ideas]
 * @property {string} rangeErrorOrder  A window whose end does not come after its start [kpadopt4-ideas]
 * @property {string} rangeErrorFuture  A window that ends in the future [kpadopt4-ideas]
 * @property {(days: number) => string} rangeErrorSpan  A window longer than the picker allows [kpadopt4-ideas]
 * @property {string} compareBefore  The compare slider's label on the before side (js/compare.js) [kpadopt4-ideas]
 * @property {string} compareAfter  Its label on the after side [kpadopt4-ideas]
 * @property {(before: string, after: string) => string} compareSlider  The divider's name for a screen reader [kpadopt4-ideas]
 * @property {(percent: number, before: string, after: string) => string} compareValue  Where the divider stands: "40% Before, 60% After" [kpadopt4-ideas]
 * @property {string} compareFailed  A pane whose image could not be loaded [kpadopt4-ideas]
 * @property {string} compareRetry  The Retry button of a pane whose image could not be loaded [kpadopt4 r2]
 * @property {string} compareLoading  What the busy card over a compare slider says while its images load [kpadopt4 r2]
 * @property {string} graphShowAll  The network graph's way back to every node and every kind of link (js/graph.js) [scope-143]
 * @property {string} graphShowAllTitle  Its title [scope-143]
 * @property {string} graphHint  The hint under the graph, and the second half of its picture's accessible name: what a pointer, a click and the keys do [scope-143]
 * @property {string} graphKinds  The name of the list of kinds of link over the graph [scope-143]
 * @property {string} graphLoading  A loading graph's sentence when the page gives none (`setGraphState(el, 'loading')`) [scope-143]
 * @property {string} graphUnnamed  The picture's name when the graph has no `aria-label` [scope-143]

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
 * @property {(name: string, component: string) => string} rememberClash  The console warning when two elements of one component ask to be remembered under the same name
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
 * @property {string} triInclude  A three-way filter chip that must be in, as a screen reader hears it after the chip's name (js/segmented.js, `data-kp-segmented="tri"`) [kpadopt4]
 * @property {string} triExclude  A chip that must not be in [kpadopt4]
 * @property {string} triAny  A chip that may or may not be in [kpadopt4]
 * @property {(label: string, state: string) => string} triAnnounce  What a three-way group says after a press, "Chicken: required" [kpadopt4]
 * @property {string} triHint  The line under a three-way group while nothing is chosen [kpadopt4]
 * @property {(include: string[], exclude: string[]) => string} triSummary  The same line once something is chosen [kpadopt4]
 * @property {string} triCleared  What a three-way group says after Clear all [kpadopt4]
 * @property {(label: string) => string} quantityLess  The minus button's name, "Portions, less" (js/quantity.js) [kpadopt4]
 * @property {(label: string) => string} quantityMore  The plus button's name, "Portions, more" [kpadopt4]
 * @property {(value: string, unit: string) => string} quantityValue  The value with its unit, as a screen reader hears it, "6 portions" [kpadopt4]
 * @property {(done: number, total: number) => string} checklistCount  A checklist group's count beside its heading, "4 of 9" (js/checklist.js) [kpadopt4]
 * @property {(done: number, total: number) => string} checklistSummary  The whole list's count in its bar, "4 of 9 done" [kpadopt4]
 * @property {string} checklistCheckAll  The bar's button that ticks every item [kpadopt4]
 * @property {string} checklistUncheckAll  The bar's button that takes the tick off every item [cook-1017]
 * @property {string} checklistClear  The bar's button that takes the ticked items away [kpadopt4]
 * @property {string} checklistUndo  The button that brings them back [kpadopt4]
 * @property {(n: number) => string} checklistCleared  The bar's line after a clear, "3 cleared" [kpadopt4]
 * @property {(n: number) => string} checklistRestored  Said after Undo [kpadopt4]
 * @property {string} checklistEmpty  An empty checklist [kpadopt4]
 * @property {string} checklistLoading  The words under a loading checklist's spinner [kpadopt4]
 * @property {string} checklistFailed  A checklist that could not be read, when the page gives no message [kpadopt4]
 * @property {(label: string) => string} checklistDone  Said when an item is ticked [kpadopt4]
 * @property {(label: string) => string} checklistDoneMoved  Said when an item is ticked with the keyboard and sank [kpadopt4]
 * @property {(label: string) => string} checklistOpen  Said when an item is unticked [kpadopt4]
 * @property {string} timerRunning  A kitchen timer's state word while it runs (js/timer.js) [kpadopt4]
 * @property {string} timerDoneWord  Its state word once it has ended [kpadopt4]
 * @property {(name: string) => string} timerDone  The large line on an ended timer, its notification and its alert, "Rice is done" [kpadopt4]
 * @property {(name: string) => string} timerSpoken  What a timer says aloud when it ends and the list speaks, "Rice is done" [cook-1017]
 * @property {string} timerStopRing  The button on an ended timer that stops it and takes it away [kpadopt4]
 * @property {(name: string) => string} timerAddMinuteTo  That button's accessible name [kpadopt4]
 * @property {(name: string) => string} timerRemove  The remove button's accessible name and tooltip [kpadopt4]
 * @property {string} timerEmpty  A list with no timer [kpadopt4]
 * @property {(name: string) => string} timerLastMinute  Said once when a timer has a minute left [kpadopt4]
 * @property {(name: string, clock: string) => string} timerStartedNamed  Said when a kitchen timer starts, with its name and its clock [kpadopt4]
 * @property {(name: string) => string} timerAlready  Said when a starter is pressed while its timer runs [kpadopt4]
 * @property {(n: number, total: number) => string} focusCount  The count over a step shown on its own, "Step 3 of 8" (js/focus-steps.js) [kpadopt4]
 * @property {string} focusNext  The button that goes on to the next step [kpadopt4]
 * @property {string} focusPrevious  The button that goes back a step [kpadopt4]
 * @property {string} focusDone  The next button on the last step [kpadopt4]
 * @property {string} focusNeeds  The heading over what a step needs [kpadopt4]
 * @property {(duration: string) => string} focusTimer  A step's timer button, "Start a timer · 10 min" [kpadopt4]
 * @property {string} focusReadAloud  The button that reads the step aloud [kpadopt4]
 * @property {string} focusStopReading  The same button while it reads [kpadopt4]
 * @property {string} focusWakeOn  The screen line while the screen is kept on [kpadopt4]
 * @property {string} focusWakeOff  The screen line when it is not [kpadopt4]
 * @property {string} focusWakeUnsupported  The screen line in a browser that cannot keep it on [kpadopt4]
 * @property {string} focusEmpty  A view with no steps [kpadopt4]
 * @property {string} focusLoading  The words under its spinner while the steps load [kpadopt4]
 * @property {string} focusFailed  Steps that could not be read, when the page gives no message [kpadopt4]
 * @property {string} wheelSpin  The button in the middle of a wheel that picks (js/wheel.js) [kpadopt4]
 * @property {string} wheelSpinAgain  The same button once the wheel has chosen [kpadopt4]
 * @property {string} wheelIdle  The line under a wheel that has not spun yet [kpadopt4]
 * @property {string} wheelChose  The line over the outcome, "The wheel chose" [kpadopt4]
 * @property {string} wheelSpinning  The line while it turns [kpadopt4]
 * @property {string} wheelOnlyOne  The line over the outcome when there was only one choice [kpadopt4]
 * @property {string} wheelEmpty  A wheel with no choices, when the page gives no sentence [kpadopt4]
 * @property {string} wheelLoading  The words under its spinner while the choices load [kpadopt4]
 * @property {string} wheelFailed  Choices that could not be read, when the page gives no message [kpadopt4]
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
/**
 * The words the stylesheets draw themselves, as custom properties
 * [scope-143]. A keyframe cannot read this module, so the word a busy
 * picture spells reaches it as `--kp-loading-word-0` to `-7`: the eight
 * ticks of cyberpunk's decipher, from all noise to the whole word. The
 * register keeps the English as each property's fallback, so a page that
 * never calls `setStrings()` draws what it always drew.
 *
 * @param {Strings} [strings] the strings to draw from, the current ones by default
 * @returns {Record<string, string>} property name to a CSS string value
 */
export declare function stringProperties(strings?: Strings): Record<string, string>;
/**
 * Write `stringProperties()` onto an element, so every stylesheet under it
 * draws the consumer's words. `setStrings()` does this on the document
 * root; call it yourself for a subtree that speaks another language.
 *
 * @param {HTMLElement} root
 * @param {Strings} [strings]
 */
export declare function applyStringProperties(root: HTMLElement, strings?: Strings): void;
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
