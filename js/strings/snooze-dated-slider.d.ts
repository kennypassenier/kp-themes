export type SnoozeDatedSliderStrings = {
    /**
     * The snooze picker's button while nothing is snoozed (js/snooze.js) [kpadopt5-time]
     */
    snoozeTrigger: string;
    /**
     * The same button while a snooze is in force [kpadopt5-time]
     */
    snoozeChange: string;
    /**
     * The chip row's name for a screen reader [kpadopt5-time]
     */
    snoozeChoicesLabel: string;
    /**
     * A length as a choice: "In 4 hours" [kpadopt5-time]
     */
    snoozeIn: (key: string) => string;
    /**
     * "This evening 18:00" [kpadopt5-time]
     */
    snoozeTonight: (time: string) => string;
    /**
     * "Tomorrow 09:00" [kpadopt5-time]
     */
    snoozeTomorrow: (time: string) => string;
    /**
     * "Monday 09:00" [kpadopt5-time]
     */
    snoozeMonday: (time: string) => string;
    /**
     * "Next week 09:00" [kpadopt5-time]
     */
    snoozeNextWeek: (time: string) => string;
    /**
     * The last custom moment, offered at the top [kpadopt5-time]
     */
    snoozeLast: string;
    /**
     * The choice that opens the date and time panel [kpadopt5-time]
     */
    snoozePick: string;
    /**
     * What stands under that choice [kpadopt5-time]
     */
    snoozePickHint: string;
    /**
     * The panel's title [kpadopt5-time]
     */
    snoozePickTitle: string;
    /**
     * The panel's date field name [kpadopt5-time]
     */
    snoozeDateLabel: string;
    /**
     * The panel's time field name [kpadopt5-time]
     */
    snoozeTimeLabel: string;
    /**
     * The panel's confirm button [kpadopt5-time]
     */
    snoozeApply: string;
    /**
     * The panel's cancel button [kpadopt5-time]
     */
    snoozeCancel: string;
    /**
     * The line while snoozed: "Snoozed until Mon 20/10/2026 09:00 · in 2 days" [kpadopt5-time]
     */
    snoozeUntil: (moment: string) => string;
    /**
     * The line while nothing is snoozed [kpadopt5-time]
     */
    snoozeNone: string;
    /**
     * The button that ends a snooze [kpadopt5-time]
     */
    snoozeEnd: string;
    /**
     * Why the choices are off while the page saves [kpadopt5-time]
     */
    snoozeSaving: string;
    /**
     * A date that is not a whole dd/mm/yyyy [kpadopt5-time]
     */
    snoozeErrorDate: string;
    /**
     * A time that is not a time of day [kpadopt5-time]
     */
    snoozeErrorTime: string;
    /**
     * A moment that has passed [kpadopt5-time]
     */
    snoozeErrorPast: string;
    /**
     * A moment past the longest a reminder may be put off [kpadopt5-time]
     */
    snoozeErrorMax: (days: number) => string;
    /**
     * A dated option picker's name when the page gives none (js/dated-options.js) [kpadopt5-time]
     */
    datedGroup: string;
    /**
     * The badge on the newest option [kpadopt5-time]
     */
    datedLatest: string;
    /**
     * An option made under a minute ago [kpadopt5-time]
     */
    datedJustNow: string;
    /**
     * How long ago an option was made: "3 days ago" [kpadopt5-time]
     */
    datedAgo: (distance: string) => string;
    /**
     * The search field's placeholder, for a long list [kpadopt5-time]
     */
    datedSearch: string;
    /**
     * What the status region says when an option is chosen [kpadopt5-time]
     */
    datedChosen: (name: string) => string;
    /**
     * An empty picker's sentence when the page gives none [kpadopt5-time]
     */
    datedEmpty: string;
    /**
     * A failed picker's first line [kpadopt5-time]
     */
    datedFailed: string;
    /**
     * The failed picker's button [kpadopt5-time]
     */
    datedRetry: string;
    /**
     * What the busy card says while the options load [kpadopt5-time]
     */
    datedLoading: string;
    /**
     * What a sentence's summary says for a field with nothing in it: "(At)" (js/sentence.js) [kpadopt5-time]
     */
    sentenceEmpty: (label: string) => string;
    /**
     * The line under a sentence that names the field that is wrong: "At: Type a time of day." [kpadopt5-time]
     */
    sentenceWhy: (field: string, why: string) => string;
    /**
     * The name of a control that has none and no words before it [kpadopt5-time]
     */
    sentenceField: string;
    /**
     * A slider's name when the page gives none (js/slider.js) [kpadopt5-time]
     */
    sliderGroup: string;
    /**
     * The lower thumb's and box's name: "Temperature, minimum" [kpadopt5-time]
     */
    sliderMin: (label: string) => string;
    /**
     * The upper thumb's and box's name: "Temperature, maximum" [kpadopt5-time]
     */
    sliderMax: (label: string) => string;
    /**
     * The value box's name: "Temperature, value" [kpadopt5-time]
     */
    sliderValue: (label: string) => string;
    /**
     * The line under a slider for a typed value that is not a number in range [kpadopt5-time]
     */
    sliderInvalid: (min: string, max: string, unit: string) => string;
    /**
     * The line for a typed value that would bring the two thumbs too close [kpadopt5-time]
     */
    sliderGap: (gap: string, unit: string) => string;
    /**
     * The counter of a growing text box: "1 204 characters" (js/autosize.js) [kpadopt6-media]
     */
    autosizeChars: (n: number, text: string) => string;
    /**
     * Its line count: "12 lines" [kpadopt6-media]
     */
    autosizeLines: (n: number, text: string) => string;
    /**
     * Both counts in one line [kpadopt6-media]
     */
    autosizeBoth: (chars: number, charsText: string, lines: number, linesText: string) => string;
    /**
     * A count against the limit: "1 204 of 4 000 characters" [kpadopt6-media]
     */
    autosizeOf: (text: string, maxText: string) => string;
    /**
     * Said politely when the limit is reached [kpadopt6-media]
     */
    autosizeFull: (maxText: string) => string;
    /**
     * Said politely when 90 % of the limit is used [kpadopt6-media]
     */
    autosizeNear: (charsText: string, maxText: string) => string;
    /**
     * The sheet's words for Ctrl+Enter submitting the form [kpadopt6-media]
     */
    autosizeSubmit: string;
    /**
     * The sheet's heading for that key [kpadopt6-media]
     */
    autosizeGroup: string;
    /**
     * The busy card's words while a box waits for its text [kpadopt6-media]
     */
    autosizeLoading: string;
    /**
     * The line under a box whose text could not be saved, when the page gives none [kpadopt6-media]
     */
    autosizeFailed: string;
    /**
     * The accessible name of a link mark: "Copy link to Dead letter 4f2a" (js/anchors.js) [kpadopt6-media]
     */
    anchorCopyLink: (name: string) => string;
    /**
     * The word on the mark after a copy [kpadopt6-media]
     */
    anchorCopied: string;
    /**
     * The word on the mark when the clipboard refused [kpadopt6-media]
     */
    anchorFailed: string;
    /**
     * Said politely after a copy [kpadopt6-media]
     */
    anchorCopiedAnnounce: (name: string) => string;
    /**
     * Said politely when the clipboard refused [kpadopt6-media]
     */
    anchorFailedAnnounce: string;
    /**
     * The notice for an address that points at nothing here any more [kpadopt6-media]
     */
    anchorMissing: string;
    /**
     * The notice's button that clears the address [kpadopt6-media]
     */
    anchorShowAll: string;
    /**
     * The sheet's words for y then l on a row [kpadopt6-media]
     */
    anchorKeyCopy: string;
    /**
     * The sheet's heading for the anchor keys [kpadopt6-media]
     */
    anchorKeyGroup: string;
    /**
     * What a list that is still loading prints instead of a blank sheet (js/print.js) [kpadopt6-media]
     */
    printLoading: string;
    /**
     * The foot of a printed sheet: "Printed 17/10/2026 14:05" [kpadopt6-media]
     */
    printStamp: (moment: string) => string;
};
/**
 * @typedef {object} SnoozeDatedSliderStrings
 * @property {string} snoozeTrigger  The snooze picker's button while nothing is snoozed (js/snooze.js) [kpadopt5-time]
 * @property {string} snoozeChange  The same button while a snooze is in force [kpadopt5-time]
 * @property {string} snoozeChoicesLabel  The chip row's name for a screen reader [kpadopt5-time]
 * @property {(key: string) => string} snoozeIn  A length as a choice: "In 4 hours" [kpadopt5-time]
 * @property {(time: string) => string} snoozeTonight  "This evening 18:00" [kpadopt5-time]
 * @property {(time: string) => string} snoozeTomorrow  "Tomorrow 09:00" [kpadopt5-time]
 * @property {(time: string) => string} snoozeMonday  "Monday 09:00" [kpadopt5-time]
 * @property {(time: string) => string} snoozeNextWeek  "Next week 09:00" [kpadopt5-time]
 * @property {string} snoozeLast  The last custom moment, offered at the top [kpadopt5-time]
 * @property {string} snoozePick  The choice that opens the date and time panel [kpadopt5-time]
 * @property {string} snoozePickHint  What stands under that choice [kpadopt5-time]
 * @property {string} snoozePickTitle  The panel's title [kpadopt5-time]
 * @property {string} snoozeDateLabel  The panel's date field name [kpadopt5-time]
 * @property {string} snoozeTimeLabel  The panel's time field name [kpadopt5-time]
 * @property {string} snoozeApply  The panel's confirm button [kpadopt5-time]
 * @property {string} snoozeCancel  The panel's cancel button [kpadopt5-time]
 * @property {(moment: string) => string} snoozeUntil  The line while snoozed: "Snoozed until Mon 20/10/2026 09:00 · in 2 days" [kpadopt5-time]
 * @property {string} snoozeNone  The line while nothing is snoozed [kpadopt5-time]
 * @property {string} snoozeEnd  The button that ends a snooze [kpadopt5-time]
 * @property {string} snoozeSaving  Why the choices are off while the page saves [kpadopt5-time]
 * @property {string} snoozeErrorDate  A date that is not a whole dd/mm/yyyy [kpadopt5-time]
 * @property {string} snoozeErrorTime  A time that is not a time of day [kpadopt5-time]
 * @property {string} snoozeErrorPast  A moment that has passed [kpadopt5-time]
 * @property {(days: number) => string} snoozeErrorMax  A moment past the longest a reminder may be put off [kpadopt5-time]
 * @property {string} datedGroup  A dated option picker's name when the page gives none (js/dated-options.js) [kpadopt5-time]
 * @property {string} datedLatest  The badge on the newest option [kpadopt5-time]
 * @property {string} datedJustNow  An option made under a minute ago [kpadopt5-time]
 * @property {(distance: string) => string} datedAgo  How long ago an option was made: "3 days ago" [kpadopt5-time]
 * @property {string} datedSearch  The search field's placeholder, for a long list [kpadopt5-time]
 * @property {(name: string) => string} datedChosen  What the status region says when an option is chosen [kpadopt5-time]
 * @property {string} datedEmpty  An empty picker's sentence when the page gives none [kpadopt5-time]
 * @property {string} datedFailed  A failed picker's first line [kpadopt5-time]
 * @property {string} datedRetry  The failed picker's button [kpadopt5-time]
 * @property {string} datedLoading  What the busy card says while the options load [kpadopt5-time]
 * @property {(label: string) => string} sentenceEmpty  What a sentence's summary says for a field with nothing in it: "(At)" (js/sentence.js) [kpadopt5-time]
 * @property {(field: string, why: string) => string} sentenceWhy  The line under a sentence that names the field that is wrong: "At: Type a time of day." [kpadopt5-time]
 * @property {string} sentenceField  The name of a control that has none and no words before it [kpadopt5-time]
 * @property {string} sliderGroup  A slider's name when the page gives none (js/slider.js) [kpadopt5-time]
 * @property {(label: string) => string} sliderMin  The lower thumb's and box's name: "Temperature, minimum" [kpadopt5-time]
 * @property {(label: string) => string} sliderMax  The upper thumb's and box's name: "Temperature, maximum" [kpadopt5-time]
 * @property {(label: string) => string} sliderValue  The value box's name: "Temperature, value" [kpadopt5-time]
 * @property {(min: string, max: string, unit: string) => string} sliderInvalid  The line under a slider for a typed value that is not a number in range [kpadopt5-time]
 * @property {(gap: string, unit: string) => string} sliderGap  The line for a typed value that would bring the two thumbs too close [kpadopt5-time]
 * @property {(n: number, text: string) => string} autosizeChars  The counter of a growing text box: "1 204 characters" (js/autosize.js) [kpadopt6-media]
 * @property {(n: number, text: string) => string} autosizeLines  Its line count: "12 lines" [kpadopt6-media]
 * @property {(chars: number, charsText: string, lines: number, linesText: string) => string} autosizeBoth  Both counts in one line [kpadopt6-media]
 * @property {(text: string, maxText: string) => string} autosizeOf  A count against the limit: "1 204 of 4 000 characters" [kpadopt6-media]
 * @property {(maxText: string) => string} autosizeFull  Said politely when the limit is reached [kpadopt6-media]
 * @property {(charsText: string, maxText: string) => string} autosizeNear  Said politely when 90 % of the limit is used [kpadopt6-media]
 * @property {string} autosizeSubmit  The sheet's words for Ctrl+Enter submitting the form [kpadopt6-media]
 * @property {string} autosizeGroup  The sheet's heading for that key [kpadopt6-media]
 * @property {string} autosizeLoading  The busy card's words while a box waits for its text [kpadopt6-media]
 * @property {string} autosizeFailed  The line under a box whose text could not be saved, when the page gives none [kpadopt6-media]
 * @property {(name: string) => string} anchorCopyLink  The accessible name of a link mark: "Copy link to Dead letter 4f2a" (js/anchors.js) [kpadopt6-media]
 * @property {string} anchorCopied  The word on the mark after a copy [kpadopt6-media]
 * @property {string} anchorFailed  The word on the mark when the clipboard refused [kpadopt6-media]
 * @property {(name: string) => string} anchorCopiedAnnounce  Said politely after a copy [kpadopt6-media]
 * @property {string} anchorFailedAnnounce  Said politely when the clipboard refused [kpadopt6-media]
 * @property {string} anchorMissing  The notice for an address that points at nothing here any more [kpadopt6-media]
 * @property {string} anchorShowAll  The notice's button that clears the address [kpadopt6-media]
 * @property {string} anchorKeyCopy  The sheet's words for y then l on a row [kpadopt6-media]
 * @property {string} anchorKeyGroup  The sheet's heading for the anchor keys [kpadopt6-media]
 * @property {string} printLoading  What a list that is still loading prints instead of a blank sheet (js/print.js) [kpadopt6-media]
 * @property {(moment: string) => string} printStamp  The foot of a printed sheet: "Printed 17/10/2026 14:05" [kpadopt6-media]
 */
/** @type {SnoozeDatedSliderStrings} */
export declare const SNOOZE_DATED_SLIDER_STRINGS: SnoozeDatedSliderStrings;
