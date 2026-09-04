export type Strings = {
    alertSuccess: string;
    alertWarning: string;
    alertInfo: string;
    alertError: string;
    busy: string;
    close: string;
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
    weekdays: string[];
    months: string[];
    dayLabel: (day: number, month: string, year: number) => string;
    uploadZone: string;
    uploadTooLarge: (size: string) => string;
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
    save: string;
    mainNavigation: string;
    skipToContent: string;
    breadcrumb: string;
    pagination: string;
    themePicker: string;
    themeSaveFailed: string;
    themeSaveRefused: string;
    contractDestructive: string;
    contractSemantic: string;
    themeGroupLight: string;
    themeGroupDark: string;
};
/**
 * @typedef {object} Strings
 * @property {string} alertSuccess
 * @property {string} alertWarning
 * @property {string} alertInfo
 * @property {string} alertError
 * @property {string} busy
 * @property {string} close
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
 * @property {string[]} weekdays
 * @property {string[]} months
 * @property {(day: number, month: string, year: number) => string} dayLabel
 * @property {string} uploadZone
 * @property {(size: string) => string} uploadTooLarge
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
 * @property {string} save
 * @property {string} mainNavigation
 * @property {string} skipToContent
 * @property {string} breadcrumb
 * @property {string} pagination
 * @property {string} themePicker
 * @property {string} themeSaveFailed
 * @property {string} themeSaveRefused
 * @property {string} contractDestructive
 * @property {string} contractSemantic
 * @property {string} themeGroupLight
 * @property {string} themeGroupDark
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
 * Dutch, kept as an export rather than as the default.
 *
 * Three consumers — kyu, almanac and kp-soft — were reading Dutch until
 * 2.0.0 and would otherwise have had to write it out again. One line
 * restores what they had:
 *
 *   setStrings(STRINGS_NL);
 *
 * @type {Strings}
 */
export declare const STRINGS_NL: Strings;
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
