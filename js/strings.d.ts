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
    formRequired: string;
    formInvalid: string;
    formSummaryOne: string;
    formSummaryMany: (n: number) => string;
    fieldFallbackName: string;
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
     * The horizontal dimension label once measured (blueprint) [S48]
     */
    measureWidth: (px: number) => string;
    /**
     * The vertical dimension label once measured (blueprint) [S48]
     */
    measureHeight: (px: number) => string;
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
 * @property {string} formRequired
 * @property {string} formInvalid
 * @property {string} formSummaryOne
 * @property {(n: number) => string} formSummaryMany
 * @property {string} fieldFallbackName
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
 * @property {(px: number) => string} measureWidth  The horizontal dimension label once measured (blueprint) [S48]
 * @property {(px: number) => string} measureHeight  The vertical dimension label once measured (blueprint) [S48]
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
