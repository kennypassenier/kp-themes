export type FormDateCopyStrings = {
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
     * Said when a secret field emptied the clipboard again after its Copy (js/patterns.js) [wish-1120]
     */
    secretClipboardCleared: string;
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
    /**
     * The secret input's button that pastes the clipboard into the box [wish-1028]
     */
    secretPaste: string;
    /**
     * What a screen reader hears after Paste, "Pasted, 24 characters" [wish-1028]
     */
    secretPasted: (count: number) => string;
    /**
     * The line under a secret input when the browser refused to let the page read the clipboard [wish-1028]
     */
    secretPasteBlocked: string;
    /**
     * The line under an empty secret input, "Typing is hidden" [wish-1028]
     */
    secretInputHint: string;
    /**
     * The line under a secret input that holds something, "24 characters, hidden" [wish-1028]
     */
    secretInputCount: (count: number) => string;
};
/**
 * @typedef {object} FormDateCopyStrings
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
 * @property {string} secretClipboardCleared  Said when a secret field emptied the clipboard again after its Copy (js/patterns.js) [wish-1120]
 * @property {string} secretReading  The words beside the spinner while a secret is fetched
 * @property {string} secretRetry  The reveal button's words after a secret could not be read
 * @property {(seconds: number) => string} secretHidesIn  The countdown under a shown secret, "Hides in 28 s"
 * @property {string} secretPaused  The countdown's words while the reader selects or holds the focus in the value
 * @property {string} secretStaysShown  The line under a shown secret that hides only when asked (`data-kp-secret-ttl="0"`)
 * @property {(seconds: number) => string} secretShown  What a screen reader hears when a secret is shown, "Shown. Hides in 30 s."
 * @property {string} secretHidden  What it hears when the secret is hidden again
 * @property {(reason: string) => string} secretFailed  The line under a secret that could not be read
 * @property {string} secretNoSource  The reason when a secret has no value, loader or listener to read it from
 * @property {string} secretPaste  The secret input's button that pastes the clipboard into the box [wish-1028]
 * @property {(count: number) => string} secretPasted  What a screen reader hears after Paste, "Pasted, 24 characters" [wish-1028]
 * @property {string} secretPasteBlocked  The line under a secret input when the browser refused to let the page read the clipboard [wish-1028]
 * @property {string} secretInputHint  The line under an empty secret input, "Typing is hidden" [wish-1028]
 * @property {(count: number) => string} secretInputCount  The line under a secret input that holds something, "24 characters, hidden" [wish-1028]
 */
/** @type {FormDateCopyStrings} */
export declare const FORM_DATE_COPY_STRINGS: FormDateCopyStrings;
