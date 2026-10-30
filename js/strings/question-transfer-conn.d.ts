export type QuestionTransferConnStrings = {
    /**
     * The default first answer (js/question-card.js) [kpadopt5-question-card]
     */
    questionAllow: string;
    /**
     * The default second answer [kpadopt5-question-card]
     */
    questionStop: string;
    /**
     * The accessible name of the region that holds the open questions [kpadopt5-question-card]
     */
    questionsLabel: string;
    /**
     * How long a question still waits, "Waits 1 min 12 s more" [kpadopt5-question-card]
     */
    questionLeft: (duration: string) => string;
    /**
     * The time line when the time ran out [kpadopt5-question-card]
     */
    questionTimeUp: string;
    /**
     * What happens at zero, "If nobody answers: Stop." [kpadopt5-question-card]
     */
    questionDefault: (label: string) => string;
    /**
     * Announced once when the time gets short [kpadopt5-question-card]
     */
    questionUrgent: (duration: string) => string;
    /**
     * The outcome of a question nobody answered, when there is no default answer [kpadopt5-question-card]
     */
    questionNobody: string;
    /**
     * The outcome when the default answer applied [kpadopt5-question-card]
     */
    questionNobodyDefault: (label: string) => string;
    /**
     * The outcome of an answer that has no sentence of its own [kpadopt5-question-card]
     */
    questionAnswered: (label: string) => string;
    /**
     * The note when the app could not send the answer, "Not sent: why. Nothing changed; answer again." [kpadopt5-question-card]
     */
    questionRefused: (why: string) => string;
    /**
     * The button that takes a finished card away [kpadopt5-question-card]
     */
    questionDismiss: string;
    /**
     * The tab title's prefix while questions wait, "(1) waiting" [kpadopt5-question-card]
     */
    questionWaiting: (count: number) => string;
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
     * The time column of a transfer whose total size is not known, beside "1.2 GB so far" [kpadopt5-r3]
     */
    transferSizeUnknown: string;
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
     * Said after a link in rendered notes that opens in a new tab (js/markdown.js) [wish-1120]
     */
    markdownNewTab: string;
    /**
     * The line after release notes that were cut for length [wish-1120]
     */
    markdownCut: string;
    /**
     * A job line's step position, "Step 3 of 35" (js/job-line.js) [wish-1120]
     */
    jobLineStep: (step: number, steps: number) => string;
    /**
     * A job line's bytes with the unit said once, done "1.2" and total "4 GB" make "1.2 of 4 GB" [wish-1120]
     */
    jobLineBytes: (done: string, total: string) => string;
    /**
     * What joins the parts of a job line [wish-1120]
     */
    jobLineSeparator: string;
    /**
     * A job line before anything was reported [wish-1120]
     */
    jobLineIdle: string;
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
     * The note after a failed refresh while paused, when nothing retries by itself, "Last refresh failed." [live-options-1019]
     */
    refreshFailedPaused: string;
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
};
/**
 * @typedef {object} QuestionTransferConnStrings
 * @property {string} questionAllow  The default first answer (js/question-card.js) [kpadopt5-question-card]
 * @property {string} questionStop  The default second answer [kpadopt5-question-card]
 * @property {string} questionsLabel  The accessible name of the region that holds the open questions [kpadopt5-question-card]
 * @property {(duration: string) => string} questionLeft  How long a question still waits, "Waits 1 min 12 s more" [kpadopt5-question-card]
 * @property {string} questionTimeUp  The time line when the time ran out [kpadopt5-question-card]
 * @property {(label: string) => string} questionDefault  What happens at zero, "If nobody answers: Stop." [kpadopt5-question-card]
 * @property {(duration: string) => string} questionUrgent  Announced once when the time gets short [kpadopt5-question-card]
 * @property {string} questionNobody  The outcome of a question nobody answered, when there is no default answer [kpadopt5-question-card]
 * @property {(label: string) => string} questionNobodyDefault  The outcome when the default answer applied [kpadopt5-question-card]
 * @property {(label: string) => string} questionAnswered  The outcome of an answer that has no sentence of its own [kpadopt5-question-card]
 * @property {(why: string) => string} questionRefused  The note when the app could not send the answer, "Not sent: why. Nothing changed; answer again." [kpadopt5-question-card]
 * @property {string} questionDismiss  The button that takes a finished card away [kpadopt5-question-card]
 * @property {(count: number) => string} questionWaiting  The tab title's prefix while questions wait, "(1) waiting" [kpadopt5-question-card]
 * @property {string} transferBar  The accessible name of a transfer's bar when it has no file name (js/transfer.js) [kpadopt5-transfer]
 * @property {(done: string, total: string) => string} transferOf  The reading of a transfer with a known size, "1.2 GB of 4.1 GB" [kpadopt5-transfer]
 * @property {(done: string) => string} transferSoFar  The reading of a transfer of unknown size, "1.2 GB so far" [kpadopt5-transfer]
 * @property {string} transferSizeUnknown  The time column of a transfer whose total size is not known, beside "1.2 GB so far" [kpadopt5-r3]
 * @property {string} transferEstimating  The time left while the speed is not steady yet [kpadopt5-transfer]
 * @property {(duration: string) => string} transferLeft  The time left, "about 3 min left" [kpadopt5-transfer]
 * @property {(duration: string) => string} transferStalled  A transfer that moved no byte for a while, "stalled for 12 s" [kpadopt5-transfer]
 * @property {(rate: string) => string} transferAverage  A finished transfer's average speed, "avg 21 MB/s" [kpadopt5-transfer]
 * @property {(duration: string) => string} transferTook  A finished transfer's duration, "in 3 min 12 s" [kpadopt5-transfer]
 * @property {string} transferFailed  The first words of a failed transfer's note [kpadopt5-transfer]
 * @property {string} transferRetry  The Retry button of a failed transfer [kpadopt5-transfer]
 * @property {(name: string, percent: number) => string} transferAnnounce  What a screen reader hears at 25, 50, 75 and 100 % [kpadopt5-transfer]
 * @property {string} markdownNewTab  Said after a link in rendered notes that opens in a new tab (js/markdown.js) [wish-1120]
 * @property {string} markdownCut  The line after release notes that were cut for length [wish-1120]
 * @property {(step: number, steps: number) => string} jobLineStep  A job line's step position, "Step 3 of 35" (js/job-line.js) [wish-1120]
 * @property {(done: string, total: string) => string} jobLineBytes  A job line's bytes with the unit said once, done "1.2" and total "4 GB" make "1.2 of 4 GB" [wish-1120]
 * @property {string} jobLineSeparator  What joins the parts of a job line [wish-1120]
 * @property {string} jobLineIdle  A job line before anything was reported [wish-1120]
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
 * @property {string} refreshFailedPaused  The note after a failed refresh while paused, when nothing retries by itself, "Last refresh failed." [live-options-1019]
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
 */
/** @type {QuestionTransferConnStrings} */
export declare const QUESTION_TRANSFER_CONN_STRINGS: QuestionTransferConnStrings;
