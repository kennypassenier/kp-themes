export type AvailabilityQrTimeStrings = {
    /**
     * A proposed period's length under its dates (js/availability.js) [kpadopt6]
     */
    availabilityDaysLong: (n: number) => string;
    /**
     * The answer yes, in a cell's name, the legend and the list (js/availability.js) [kpadopt6]
     */
    availabilityYes: string;
    /**
     * The answer maybe (js/availability.js) [kpadopt6]
     */
    availabilityMaybe: string;
    /**
     * The answer no (js/availability.js) [kpadopt6]
     */
    availabilityNo: string;
    /**
     * A cell nobody filled (js/availability.js) [kpadopt6]
     */
    availabilityNone: string;
    /**
     * The line over a grid nobody has answered (js/availability.js) [kpadopt6]
     */
    availabilityNobodyAnswered: string;
    /**
     * One column's exact count (js/availability.js) [kpadopt6]
     */
    availabilityCount: (yes: number, total: number) => string;
    /**
     * The line over the grid (js/availability.js) [kpadopt6]
     */
    availabilityAnswered: (n: number, total: number) => string;
    /**
     * The best column in words (js/availability.js) [kpadopt6]
     */
    availabilityBestLine: (labels: string, count: string) => string;
    /**
     * The button on the best column (js/availability.js) [kpadopt6]
     */
    availabilityChoose: string;
    /**
     * The organiser's switch between periods and days (js/availability.js) [kpadopt6]
     */
    availabilityUnitLabel: string;
    /**
     * Its first choice (js/availability.js) [kpadopt6]
     */
    availabilityByPeriod: string;
    /**
     * Its second choice (js/availability.js) [kpadopt6]
     */
    availabilityByDay: string;
    /**
     * The failed plate's heading (js/availability.js) [kpadopt6]
     */
    availabilityFailedTitle: string;
    /**
     * Its sentence (js/availability.js) [kpadopt6]
     */
    availabilityFailedText: string;
    /**
     * The empty plate's heading (js/availability.js) [kpadopt6]
     */
    availabilityEmptyTitle: string;
    /**
     * Its sentence (js/availability.js) [kpadopt6]
     */
    availabilityEmptyText: string;
    /**
     * The failed plate's button (js/availability.js) [kpadopt6]
     */
    availabilityRetry: string;
    /**
     * The grid's name when the page gives none (js/availability.js) [kpadopt6]
     */
    availabilityGroup: string;
    /**
     * The summary row's name (js/availability.js) [kpadopt6]
     */
    availabilitySummaryLabel: string;
    /**
     * Your own row's name (js/availability.js) [kpadopt6]
     */
    availabilityYou: (name: string) => string;
    /**
     * The legend's word for the best column (js/availability.js) [kpadopt6]
     */
    availabilityBestWord: string;
    /**
     * A cell's name for a screen reader (js/availability.js) [kpadopt6]
     */
    availabilityCell: (name: string, column: string, answer: string) => string;
    /**
     * The line when a change was refused (js/availability.js) [kpadopt6]
     */
    availabilityNotSaved: (label: string) => string;
    /**
     * Said when a column becomes complete (js/availability.js) [kpadopt6]
     */
    availabilityEveryone: (label: string) => string;
    /**
     * Said after a stroke (js/availability.js) [kpadopt6]
     */
    availabilityYourAnswers: (yes: number, maybe: number, no: number) => string;
    /**
     * The toast after a stroke (js/availability.js) [kpadopt6]
     */
    availabilityStroke: (n: number) => string;
    /**
     * Said after one cell changed (js/availability.js) [kpadopt6]
     */
    availabilityCellSaid: (name: string, label: string, word: string) => string;
    /**
     * The menu entry that empties a cell (js/availability.js) [kpadopt6]
     */
    availabilityClear: string;
    /**
     * The shortcut sheet's line for y (js/availability.js) [kpadopt6]
     */
    availabilityKeyYes: string;
    /**
     * The line for m (js/availability.js) [kpadopt6]
     */
    availabilityKeyMaybe: string;
    /**
     * The line for n (js/availability.js) [kpadopt6]
     */
    availabilityKeyNo: string;
    /**
     * The line for Backspace (js/availability.js) [kpadopt6]
     */
    availabilityKeyClear: string;
    /**
     * The sheet's heading (js/availability.js) [kpadopt6]
     */
    availabilityKeyGroup: string;
    /**
     * Why those keys do nothing now (js/availability.js) [kpadopt6]
     */
    availabilityKeyReason: string;
    /**
     * Why every cell is inert when the page gives no reason (js/availability.js) [kpadopt6]
     */
    availabilityDisabled: string;
    /**
     * The code's accessible name (js/qr.js) [kpadopt6]
     */
    qrLabel: string;
    /**
     * Said once, politely, when the code is drawn (js/qr.js) [kpadopt6]
     */
    qrReady: string;
    /**
     * The failed plate's heading (js/qr.js) [kpadopt6]
     */
    qrTooLongTitle: string;
    /**
     * Its sentence (js/qr.js) [kpadopt6]
     */
    qrTooLongText: string;
    /**
     * The empty plate's heading (js/qr.js) [kpadopt6]
     */
    qrEmptyTitle: string;
    /**
     * Its sentence (js/qr.js) [kpadopt6]
     */
    qrEmptyText: string;
    /**
     * The plate of a link whose time ran out (js/qr.js) [kpadopt6]
     */
    qrExpired: string;
    /**
     * Its sentence (js/qr.js) [kpadopt6]
     */
    qrExpiredText: string;
    /**
     * The cover of a code that waits to be shown (js/qr.js) [kpadopt6]
     */
    qrHidden: string;
    /**
     * The cover's button (js/qr.js) [kpadopt6]
     */
    qrShow: string;
    /**
     * The button that covers a shown code again (js/qr.js) [kpadopt6]
     */
    qrHide: string;
    /**
     * The words under the busy card while the link is made (js/qr.js) [kpadopt6]
     */
    qrLoading: string;
    /**
     * The Copy button (js/qr.js) [kpadopt6]
     */
    qrCopy: string;
    /**
     * Its result word (js/qr.js) [kpadopt6]
     */
    qrCopied: string;
    /**
     * Its refusal word (js/qr.js) [kpadopt6]
     */
    qrCopyFailed: string;
    /**
     * Why Copy is off without a link (js/qr.js) [kpadopt6]
     */
    qrNoLink: string;
    /**
     * Why Copy is off while the code is not ready (js/qr.js) [kpadopt6]
     */
    qrCopyOff: string;
    /**
     * The download button for a picture (js/qr.js) [kpadopt6]
     */
    qrDownloadPng: string;
    /**
     * The download button for a vector file (js/qr.js) [kpadopt6]
     */
    qrDownloadSvg: string;
    /**
     * The warning under a long link (js/qr.js) [kpadopt6]
     */
    qrDense: (bytes: number) => string;
    /**
     * The failed plate's button (js/qr.js) [kpadopt6]
     */
    qrRetry: string;
    /**
     * The shortcut sheet's line for Shift C (js/qr.js) [kpadopt6]
     */
    qrKey: string;
    /**
     * The sheet's heading (js/qr.js) [kpadopt6]
     */
    qrKeyGroup: string;
    /**
     * Why the key does nothing now (js/qr.js) [kpadopt6]
     */
    qrKeyReason: string;
    /**
     * The button that opens the list of times, and the sheet's title when the field has no name (js/timefield.js) [kpadopt6]
     */
    timeChoose: string;
    /**
     * The line under an empty required field (js/timefield.js) [kpadopt6]
     */
    timeRequired: string;
    /**
     * The line under a text that is not a time (js/timefield.js) [kpadopt6]
     */
    timeInvalid: string;
    /**
     * The line under a time outside the window (js/timefield.js) [kpadopt6]
     */
    timeOutside: (min: string, max: string) => string;
    /**
     * The polite line after a 12 hour time was pasted (js/timefield.js) [kpadopt6]
     */
    timeConverted: (value: string) => string;
    /**
     * What is said after the value changed (js/timefield.js) [kpadopt6]
     */
    timeSaid: (value: string) => string;
    /**
     * The name of the group of preset chips (js/timefield.js) [kpadopt6]
     */
    timePresets: string;
    /**
     * The compact plate when presets failed (js/timefield.js) [kpadopt6]
     */
    timePresetsFailed: string;
    /**
     * Its button (js/timefield.js) [kpadopt6]
     */
    timeRetry: string;
    /**
     * The list's name for a screen reader (js/timefield.js) [kpadopt6]
     */
    timeList: string;
    /**
     * The list's entry that clears the field (js/timefield.js) [kpadopt6]
     */
    timeNone: string;
    /**
     * The note on the list's entry for the current time (js/timefield.js) [kpadopt6]
     */
    timeNow: string;
    /**
     * The mark on a time close to a busy moment (js/timefield.js) [kpadopt6]
     */
    timeNear: (busy: string) => string;
    /**
     * The quiet line that says whose clock the time is (js/timefield.js) [kpadopt6]
     */
    timeZoneNote: (zone: string) => string;
    /**
     * Said when stepping up went past midnight (js/timefield.js) [kpadopt6]
     */
    timeWrappedNext: (value: string) => string;
    /**
     * Said when stepping down went past midnight (js/timefield.js) [kpadopt6]
     */
    timeWrappedPrevious: (value: string) => string;
};
/**
 * @typedef {object} AvailabilityQrTimeStrings
 * @property {(n: number) => string} availabilityDaysLong  A proposed period's length under its dates (js/availability.js) [kpadopt6]
 * @property {string} availabilityYes  The answer yes, in a cell's name, the legend and the list (js/availability.js) [kpadopt6]
 * @property {string} availabilityMaybe  The answer maybe (js/availability.js) [kpadopt6]
 * @property {string} availabilityNo  The answer no (js/availability.js) [kpadopt6]
 * @property {string} availabilityNone  A cell nobody filled (js/availability.js) [kpadopt6]
 * @property {string} availabilityNobodyAnswered  The line over a grid nobody has answered (js/availability.js) [kpadopt6]
 * @property {(yes: number, total: number) => string} availabilityCount  One column's exact count (js/availability.js) [kpadopt6]
 * @property {(n: number, total: number) => string} availabilityAnswered  The line over the grid (js/availability.js) [kpadopt6]
 * @property {(labels: string, count: string) => string} availabilityBestLine  The best column in words (js/availability.js) [kpadopt6]
 * @property {string} availabilityChoose  The button on the best column (js/availability.js) [kpadopt6]
 * @property {string} availabilityUnitLabel  The organiser's switch between periods and days (js/availability.js) [kpadopt6]
 * @property {string} availabilityByPeriod  Its first choice (js/availability.js) [kpadopt6]
 * @property {string} availabilityByDay  Its second choice (js/availability.js) [kpadopt6]
 * @property {string} availabilityFailedTitle  The failed plate's heading (js/availability.js) [kpadopt6]
 * @property {string} availabilityFailedText  Its sentence (js/availability.js) [kpadopt6]
 * @property {string} availabilityEmptyTitle  The empty plate's heading (js/availability.js) [kpadopt6]
 * @property {string} availabilityEmptyText  Its sentence (js/availability.js) [kpadopt6]
 * @property {string} availabilityRetry  The failed plate's button (js/availability.js) [kpadopt6]
 * @property {string} availabilityGroup  The grid's name when the page gives none (js/availability.js) [kpadopt6]
 * @property {string} availabilitySummaryLabel  The summary row's name (js/availability.js) [kpadopt6]
 * @property {(name: string) => string} availabilityYou  Your own row's name (js/availability.js) [kpadopt6]
 * @property {string} availabilityBestWord  The legend's word for the best column (js/availability.js) [kpadopt6]
 * @property {(name: string, column: string, answer: string) => string} availabilityCell  A cell's name for a screen reader (js/availability.js) [kpadopt6]
 * @property {(label: string) => string} availabilityNotSaved  The line when a change was refused (js/availability.js) [kpadopt6]
 * @property {(label: string) => string} availabilityEveryone  Said when a column becomes complete (js/availability.js) [kpadopt6]
 * @property {(yes: number, maybe: number, no: number) => string} availabilityYourAnswers  Said after a stroke (js/availability.js) [kpadopt6]
 * @property {(n: number) => string} availabilityStroke  The toast after a stroke (js/availability.js) [kpadopt6]
 * @property {(name: string, label: string, word: string) => string} availabilityCellSaid  Said after one cell changed (js/availability.js) [kpadopt6]
 * @property {string} availabilityClear  The menu entry that empties a cell (js/availability.js) [kpadopt6]
 * @property {string} availabilityKeyYes  The shortcut sheet's line for y (js/availability.js) [kpadopt6]
 * @property {string} availabilityKeyMaybe  The line for m (js/availability.js) [kpadopt6]
 * @property {string} availabilityKeyNo  The line for n (js/availability.js) [kpadopt6]
 * @property {string} availabilityKeyClear  The line for Backspace (js/availability.js) [kpadopt6]
 * @property {string} availabilityKeyGroup  The sheet's heading (js/availability.js) [kpadopt6]
 * @property {string} availabilityKeyReason  Why those keys do nothing now (js/availability.js) [kpadopt6]
 * @property {string} availabilityDisabled  Why every cell is inert when the page gives no reason (js/availability.js) [kpadopt6]
 * @property {string} qrLabel  The code's accessible name (js/qr.js) [kpadopt6]
 * @property {string} qrReady  Said once, politely, when the code is drawn (js/qr.js) [kpadopt6]
 * @property {string} qrTooLongTitle  The failed plate's heading (js/qr.js) [kpadopt6]
 * @property {string} qrTooLongText  Its sentence (js/qr.js) [kpadopt6]
 * @property {string} qrEmptyTitle  The empty plate's heading (js/qr.js) [kpadopt6]
 * @property {string} qrEmptyText  Its sentence (js/qr.js) [kpadopt6]
 * @property {string} qrExpired  The plate of a link whose time ran out (js/qr.js) [kpadopt6]
 * @property {string} qrExpiredText  Its sentence (js/qr.js) [kpadopt6]
 * @property {string} qrHidden  The cover of a code that waits to be shown (js/qr.js) [kpadopt6]
 * @property {string} qrShow  The cover's button (js/qr.js) [kpadopt6]
 * @property {string} qrHide  The button that covers a shown code again (js/qr.js) [kpadopt6]
 * @property {string} qrLoading  The words under the busy card while the link is made (js/qr.js) [kpadopt6]
 * @property {string} qrCopy  The Copy button (js/qr.js) [kpadopt6]
 * @property {string} qrCopied  Its result word (js/qr.js) [kpadopt6]
 * @property {string} qrCopyFailed  Its refusal word (js/qr.js) [kpadopt6]
 * @property {string} qrNoLink  Why Copy is off without a link (js/qr.js) [kpadopt6]
 * @property {string} qrCopyOff  Why Copy is off while the code is not ready (js/qr.js) [kpadopt6]
 * @property {string} qrDownloadPng  The download button for a picture (js/qr.js) [kpadopt6]
 * @property {string} qrDownloadSvg  The download button for a vector file (js/qr.js) [kpadopt6]
 * @property {(bytes: number) => string} qrDense  The warning under a long link (js/qr.js) [kpadopt6]
 * @property {string} qrRetry  The failed plate's button (js/qr.js) [kpadopt6]
 * @property {string} qrKey  The shortcut sheet's line for Shift C (js/qr.js) [kpadopt6]
 * @property {string} qrKeyGroup  The sheet's heading (js/qr.js) [kpadopt6]
 * @property {string} qrKeyReason  Why the key does nothing now (js/qr.js) [kpadopt6]
 * @property {string} timeChoose  The button that opens the list of times, and the sheet's title when the field has no name (js/timefield.js) [kpadopt6]
 * @property {string} timeRequired  The line under an empty required field (js/timefield.js) [kpadopt6]
 * @property {string} timeInvalid  The line under a text that is not a time (js/timefield.js) [kpadopt6]
 * @property {(min: string, max: string) => string} timeOutside  The line under a time outside the window (js/timefield.js) [kpadopt6]
 * @property {(value: string) => string} timeConverted  The polite line after a 12 hour time was pasted (js/timefield.js) [kpadopt6]
 * @property {(value: string) => string} timeSaid  What is said after the value changed (js/timefield.js) [kpadopt6]
 * @property {string} timePresets  The name of the group of preset chips (js/timefield.js) [kpadopt6]
 * @property {string} timePresetsFailed  The compact plate when presets failed (js/timefield.js) [kpadopt6]
 * @property {string} timeRetry  Its button (js/timefield.js) [kpadopt6]
 * @property {string} timeList  The list's name for a screen reader (js/timefield.js) [kpadopt6]
 * @property {string} timeNone  The list's entry that clears the field (js/timefield.js) [kpadopt6]
 * @property {string} timeNow  The note on the list's entry for the current time (js/timefield.js) [kpadopt6]
 * @property {(busy: string) => string} timeNear  The mark on a time close to a busy moment (js/timefield.js) [kpadopt6]
 * @property {(zone: string) => string} timeZoneNote  The quiet line that says whose clock the time is (js/timefield.js) [kpadopt6]
 * @property {(value: string) => string} timeWrappedNext  Said when stepping up went past midnight (js/timefield.js) [kpadopt6]
 * @property {(value: string) => string} timeWrappedPrevious  Said when stepping down went past midnight (js/timefield.js) [kpadopt6]
 */
/** @type {AvailabilityQrTimeStrings} */
export declare const AVAILABILITY_QR_TIME_STRINGS: AvailabilityQrTimeStrings;
