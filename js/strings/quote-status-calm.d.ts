export type QuoteStatusCalmStrings = {
    /**
     * Who wrote a quote when the card does not say: "You" (js/quote.js) [kpadopt6]
     */
    quoteBy: string;
    /**
     * The line under a quote: "You, Tuesday 14/10/2026" [kpadopt6]
     */
    quoteCaption: (by: string, when: string) => string;
    /**
     * A date with its weekday: "Tuesday 14/10/2026" [kpadopt6]
     */
    quoteDay: (weekday: string, date: string) => string;
    /**
     * How long ago, in words: "3 days ago", "today" [kpadopt6]
     */
    quoteRelative: (days: number) => string;
    /**
     * The date and how long ago together: "Tuesday 14/10/2026 (3 days ago)" [kpadopt6]
     */
    quoteBoth: (date: string, relative: string) => string;
    /**
     * The button that stops a quote from coming back [kpadopt6]
     */
    quoteHide: string;
    /**
     * The undo toast's line after a hide: "Hidden" [kpadopt6]
     */
    quoteHideDone: string;
    /**
     * What a hide that is being saved says on its button [kpadopt6]
     */
    quoteHiding: string;
    /**
     * The button that copies the words [kpadopt6]
     */
    quoteCopy: string;
    /**
     * The same button for a moment after the copy [kpadopt6]
     */
    quoteCopied: string;
    /**
     * What is said when the clipboard refused [kpadopt6]
     */
    quoteCopyFailed: string;
    /**
     * The button that unfolds a long quote [kpadopt6]
     */
    quoteShowAll: string;
    /**
     * The same button once it is open [kpadopt6]
     */
    quoteShowLess: string;
    /**
     * A list's button that shows every quote: "Show all 7" [kpadopt6]
     */
    quoteShowAllN: (n: number) => string;
    /**
     * The same button once the list is open [kpadopt6]
     */
    quoteShowFewer: string;
    /**
     * The link to the day the words were written [kpadopt6]
     */
    quoteOpen: string;
    /**
     * The words under the loading card [kpadopt6]
     */
    quoteLoading: string;
    /**
     * The empty card's title [kpadopt6]
     */
    quoteEmptyTitle: string;
    /**
     * The empty card's sentence [kpadopt6]
     */
    quoteEmptyText: string;
    /**
     * The failed card's title [kpadopt6]
     */
    quoteFailedTitle: string;
    /**
     * The failed card's sentence [kpadopt6]
     */
    quoteFailedText: string;
    /**
     * The failed card's button [kpadopt6]
     */
    quoteRetry: string;
    /**
     * A list of quotes' name for a screen reader [kpadopt6]
     */
    quoteListName: string;
    /**
     * What is said when a quote is hidden [kpadopt6]
     */
    quoteAnnounceHidden: string;
    /**
     * A row in the calm vocabulary that is still open (js/statusrow.js, `data-kp-status-vocab="calm"`) [kpadopt6]
     */
    statusOpen: string;
    /**
     * A calm row that is done [kpadopt6]
     */
    statusDone: string;
    /**
     * A calm row that is paused [kpadopt6]
     */
    statusPaused: string;
    /**
     * A calm row nothing is known about: never shown as done [kpadopt6]
     */
    statusUnknown: string;
    /**
     * A paused row's line: "Paused since 03/10/2026" [kpadopt6]
     */
    statusSinceDate: (date: string) => string;
    /**
     * The same as a length: "Paused for 3 weeks" [kpadopt6]
     */
    statusSinceFor: (duration: string) => string;
    /**
     * The same with both: "Paused since 03/10/2026 (2 weeks)" [kpadopt6]
     */
    statusSinceBoth: (date: string, duration: string) => string;
    /**
     * A length of days in words: "5 days", "3 weeks", "4 months" [kpadopt6]
     */
    statusDuration: (days: number) => string;
    /**
     * The button that takes a paused row up again [kpadopt6]
     */
    statusResume: string;
    /**
     * That button's accessible name: "Resume Beweging" [kpadopt6]
     */
    statusResumeLabel: (label: string) => string;
    /**
     * The optional button that pauses a row [kpadopt6]
     */
    statusPause: string;
    /**
     * That button's accessible name [kpadopt6]
     */
    statusPauseLabel: (label: string) => string;
    /**
     * What is said and toasted after a resume: "Beweging resumed" [kpadopt6]
     */
    statusResumed: (label: string) => string;
    /**
     * What is said and toasted after a pause: "Beweging paused" [kpadopt6]
     */
    statusPausedNow: (label: string) => string;
    /**
     * The line that gathers long-paused rows: "3 paused for more than 30 days" [kpadopt6]
     */
    statusFoldLine: (n: number, days: number) => string;
    /**
     * The empty today card's title [kpadopt6]
     */
    statusTodayEmptyTitle: string;
    /**
     * Its second sentence: nothing is waiting [kpadopt6]
     */
    statusTodayEmptyText: string;
    /**
     * The failed today card's title [kpadopt6]
     */
    statusTodayFailedTitle: string;
    /**
     * Its sentence: the fault is the system's [kpadopt6]
     */
    statusTodayFailedText: string;
    /**
     * The words under the loading card [kpadopt6]
     */
    statusTodayLoading: string;
    /**
     * The failed card's button [kpadopt6]
     */
    statusTodayRetry: string;
    /**
     * A day with something logged, in words: "logged" (js/calm-tones.js, `data-kp-tones="calm"`) [kpadopt6]
     */
    calmLogged: string;
    /**
     * A day with nothing logged, in words: "nothing logged", never "missed" [kpadopt6]
     */
    calmQuiet: string;
    /**
     * A day inside a pause: "paused" [kpadopt6]
     */
    calmPaused: string;
    /**
     * The legend's word for a logged day [kpadopt6]
     */
    calmLegendLogged: string;
    /**
     * The legend's word for a quiet day [kpadopt6]
     */
    calmLegendQuiet: string;
    /**
     * The legend's word for a paused day [kpadopt6]
     */
    calmLegendPaused: string;
    /**
     * The plate over a month with nothing logged: "Nothing logged this month" [kpadopt6]
     */
    calmEmptyTitle: string;
    /**
     * Its second sentence [kpadopt6]
     */
    calmEmptyText: string;
    /**
     * The plate over a calendar that could not be read [kpadopt6]
     */
    calmFailedTitle: string;
    /**
     * Its sentence: the fault is the system's [kpadopt6]
     */
    calmFailedText: string;
    /**
     * Its button [kpadopt6]
     */
    calmRetry: string;
    /**
     * The words of the optional caption slot under the grid: trends over the days that were logged [kpadopt6]
     */
    calmTrendCaption: string;
    /**
     * A calm uptime strip's summary: "21 of 30 days logged", with no incident count and no share down [kpadopt6]
     */
    calmSummary: (logged: number, total: number) => string;
};
/**
 * @typedef {object} QuoteStatusCalmStrings
 * @property {string} quoteBy  Who wrote a quote when the card does not say: "You" (js/quote.js) [kpadopt6]
 * @property {(by: string, when: string) => string} quoteCaption  The line under a quote: "You, Tuesday 14/10/2026" [kpadopt6]
 * @property {(weekday: string, date: string) => string} quoteDay  A date with its weekday: "Tuesday 14/10/2026" [kpadopt6]
 * @property {(days: number) => string} quoteRelative  How long ago, in words: "3 days ago", "today" [kpadopt6]
 * @property {(date: string, relative: string) => string} quoteBoth  The date and how long ago together: "Tuesday 14/10/2026 (3 days ago)" [kpadopt6]
 * @property {string} quoteHide  The button that stops a quote from coming back [kpadopt6]
 * @property {string} quoteHideDone  The undo toast's line after a hide: "Hidden" [kpadopt6]
 * @property {string} quoteHiding  What a hide that is being saved says on its button [kpadopt6]
 * @property {string} quoteCopy  The button that copies the words [kpadopt6]
 * @property {string} quoteCopied  The same button for a moment after the copy [kpadopt6]
 * @property {string} quoteCopyFailed  What is said when the clipboard refused [kpadopt6]
 * @property {string} quoteShowAll  The button that unfolds a long quote [kpadopt6]
 * @property {string} quoteShowLess  The same button once it is open [kpadopt6]
 * @property {(n: number) => string} quoteShowAllN  A list's button that shows every quote: "Show all 7" [kpadopt6]
 * @property {string} quoteShowFewer  The same button once the list is open [kpadopt6]
 * @property {string} quoteOpen  The link to the day the words were written [kpadopt6]
 * @property {string} quoteLoading  The words under the loading card [kpadopt6]
 * @property {string} quoteEmptyTitle  The empty card's title [kpadopt6]
 * @property {string} quoteEmptyText  The empty card's sentence [kpadopt6]
 * @property {string} quoteFailedTitle  The failed card's title [kpadopt6]
 * @property {string} quoteFailedText  The failed card's sentence [kpadopt6]
 * @property {string} quoteRetry  The failed card's button [kpadopt6]
 * @property {string} quoteListName  A list of quotes' name for a screen reader [kpadopt6]
 * @property {string} quoteAnnounceHidden  What is said when a quote is hidden [kpadopt6]
 * @property {string} statusOpen  A row in the calm vocabulary that is still open (js/statusrow.js, `data-kp-status-vocab="calm"`) [kpadopt6]
 * @property {string} statusDone  A calm row that is done [kpadopt6]
 * @property {string} statusPaused  A calm row that is paused [kpadopt6]
 * @property {string} statusUnknown  A calm row nothing is known about: never shown as done [kpadopt6]
 * @property {(date: string) => string} statusSinceDate  A paused row's line: "Paused since 03/10/2026" [kpadopt6]
 * @property {(duration: string) => string} statusSinceFor  The same as a length: "Paused for 3 weeks" [kpadopt6]
 * @property {(date: string, duration: string) => string} statusSinceBoth  The same with both: "Paused since 03/10/2026 (2 weeks)" [kpadopt6]
 * @property {(days: number) => string} statusDuration  A length of days in words: "5 days", "3 weeks", "4 months" [kpadopt6]
 * @property {string} statusResume  The button that takes a paused row up again [kpadopt6]
 * @property {(label: string) => string} statusResumeLabel  That button's accessible name: "Resume Beweging" [kpadopt6]
 * @property {string} statusPause  The optional button that pauses a row [kpadopt6]
 * @property {(label: string) => string} statusPauseLabel  That button's accessible name [kpadopt6]
 * @property {(label: string) => string} statusResumed  What is said and toasted after a resume: "Beweging resumed" [kpadopt6]
 * @property {(label: string) => string} statusPausedNow  What is said and toasted after a pause: "Beweging paused" [kpadopt6]
 * @property {(n: number, days: number) => string} statusFoldLine  The line that gathers long-paused rows: "3 paused for more than 30 days" [kpadopt6]
 * @property {string} statusTodayEmptyTitle  The empty today card's title [kpadopt6]
 * @property {string} statusTodayEmptyText  Its second sentence: nothing is waiting [kpadopt6]
 * @property {string} statusTodayFailedTitle  The failed today card's title [kpadopt6]
 * @property {string} statusTodayFailedText  Its sentence: the fault is the system's [kpadopt6]
 * @property {string} statusTodayLoading  The words under the loading card [kpadopt6]
 * @property {string} statusTodayRetry  The failed card's button [kpadopt6]
 * @property {string} calmLogged  A day with something logged, in words: "logged" (js/calm-tones.js, `data-kp-tones="calm"`) [kpadopt6]
 * @property {string} calmQuiet  A day with nothing logged, in words: "nothing logged", never "missed" [kpadopt6]
 * @property {string} calmPaused  A day inside a pause: "paused" [kpadopt6]
 * @property {string} calmLegendLogged  The legend's word for a logged day [kpadopt6]
 * @property {string} calmLegendQuiet  The legend's word for a quiet day [kpadopt6]
 * @property {string} calmLegendPaused  The legend's word for a paused day [kpadopt6]
 * @property {string} calmEmptyTitle  The plate over a month with nothing logged: "Nothing logged this month" [kpadopt6]
 * @property {string} calmEmptyText  Its second sentence [kpadopt6]
 * @property {string} calmFailedTitle  The plate over a calendar that could not be read [kpadopt6]
 * @property {string} calmFailedText  Its sentence: the fault is the system's [kpadopt6]
 * @property {string} calmRetry  Its button [kpadopt6]
 * @property {string} calmTrendCaption  The words of the optional caption slot under the grid: trends over the days that were logged [kpadopt6]
 * @property {(logged: number, total: number) => string} calmSummary  A calm uptime strip's summary: "21 of 30 days logged", with no incident count and no share down [kpadopt6]
 */
/** @type {QuoteStatusCalmStrings} */
export declare const QUOTE_STATUS_CALM_STRINGS: QuoteStatusCalmStrings;
