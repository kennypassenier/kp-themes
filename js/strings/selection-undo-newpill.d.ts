export type SelectionUndoNewpillStrings = {
    /**
     * The accessible name of a selection bar (js/selection-bar.js) [kpadopt5]
     */
    selectionLabel: string;
    /**
     * The bar's count, "3 selected" [kpadopt5]
     */
    selectionCount: (n: number) => string;
    /**
     * The bar's button that ticks nothing: it says what it does [kpadopt5]
     */
    selectionClear: string;
    /**
     * Its tooltip, naming the key [kpadopt5]
     */
    selectionClearTitle: string;
    /**
     * The names line when not every name fits, "+4 more" with the exact number [kpadopt5]
     */
    selectionMore: (n: number) => string;
    /**
     * The same button once the whole list is open [kpadopt5]
     */
    selectionFewer: string;
    /**
     * The phone's button that opens the bar's actions [kpadopt5]
     */
    selectionActions: string;
    /**
     * The offer beyond what is shown, "Select all 312 that match" [kpadopt5]
     */
    selectionMatching: (total: number) => string;
    /**
     * The bar's line once every match is selected [kpadopt5]
     */
    selectionMatchingOn: (total: number) => string;
    /**
     * The button that takes the offer back, "Select only the 40 shown" [kpadopt5]
     */
    selectionOnlyShown: (n: number) => string;
    /**
     * Said when a bar action starts, "Backing up 3…" is the page's own words; this is the fallback [kpadopt5]
     */
    selectionBusy: (words: string) => string;
    /**
     * How far a running bar action is, "3 of 7 done" (js/selection-bar.js setSelectionProgress) [wish-1120]
     */
    selectionProgress: (done: number, total: number) => string;
    /**
     * The bar's line after an action some rows refused, "2 done, 1 refused" [kpadopt5]
     */
    selectionResult: (done: number, refused: number) => string;
    /**
     * Said when selected rows are gone after a refresh [kpadopt5]
     */
    selectionDropped: (n: number) => string;
    /**
     * The reason an action is off for some rows, "2 of 3 can be updated" with the page's verb after it [kpadopt5]
     */
    selectionCan: (can: number, total: number) => string;
    /**
     * Said when the selection is cleared [kpadopt5]
     */
    selectionCleared: string;
    /**
     * The Undo button of an undo toast (js/undo-toast.js) [kpadopt5]
     */
    undoToastUndo: string;
    /**
     * Its tooltip, naming the key [kpadopt5]
     */
    undoToastKeyTitle: (key: string) => string;
    /**
     * Said once when the toast opens, "Deleted. Undo available for 6 seconds" [kpadopt5]
     */
    undoToastAnnounce: (text: string, seconds: number) => string;
    /**
     * The text clock, "5 s" [kpadopt5]
     */
    undoToastClock: (seconds: number) => string;
    /**
     * The toast's line after an undo [kpadopt5]
     */
    undoToastRestored: string;
    /**
     * The toast's line while the commit is on its way [kpadopt5]
     */
    undoToastSaving: string;
    /**
     * The toast's line when the commit failed, "Not done: why" [kpadopt5]
     */
    undoToastFailed: (why: string) => string;
    /**
     * The accessible name of the toast's close button [kpadopt5]
     */
    undoToastDismiss: string;
    /**
     * The word for one new row on a live list (js/newpill.js) [kpadopt5]
     */
    newpillUnitOne: string;
    /**
     * The word for several [kpadopt5]
     */
    newpillUnitMany: string;
    /**
     * The pill, "12 new lines" [kpadopt5]
     */
    newpillNew: (n: number, unit: string) => string;
    /**
     * The pill's second half on a list that grows at the end [kpadopt5]
     */
    newpillBackTail: string;
    /**
     * The pill's second half on a list that grows at the top [kpadopt5]
     */
    newpillBackHead: string;
    /**
     * Said at most every ten seconds while the list is read elsewhere [kpadopt5]
     */
    newpillAnnounce: (n: number, unit: string) => string;
    /**
     * The toolbar button that stops following [kpadopt5]
     */
    newpillPause: string;
    /**
     * The toolbar button that follows again, shown while paused [kpadopt5]
     */
    newpillResume: string;
    /**
     * The divider at the first unseen row, "New since 14:32" [kpadopt5]
     */
    newpillSince: (time: string) => string;
    /**
     * Said when following is paused [kpadopt5]
     */
    newpillPausedNote: string;
    /**
     * Said when following resumes [kpadopt5]
     */
    newpillFollowing: string;
    /**
     * A payload cell with nothing in it (js/code.js, cell) [kpadopt5]
     */
    payloadEmpty: string;
    /**
     * A payload cell that holds binary data, "binary, 2.1 kB" [kpadopt5]
     */
    payloadBinary: (size: string) => string;
    /**
     * The button that opens a long payload in a dialog [kpadopt5]
     */
    payloadOpen: string;
    /**
     * The link that downloads a binary payload when the page gives a URL [kpadopt5]
     */
    payloadDownload: string;
    /**
     * The cell's fold button, "Show all 40 lines" [kpadopt5]
     */
    payloadShowAll: (lines: number) => string;
    /**
     * The cell's copy button: it copies the whole value, folded or not [kpadopt5]
     */
    payloadCopyFull: string;
    /**
     * The quiet line under a valid object, "Valid JSON · 3 keys" [kpadopt5]
     */
    jsonValidKeys: (n: number) => string;
    /**
     * The same for a list [kpadopt5]
     */
    jsonValidItems: (n: number) => string;
    /**
     * The same for a bare value [kpadopt5]
     */
    jsonValidValue: string;
    /**
     * The error line, "Line 3, column 12: expected ','" [kpadopt5]
     */
    jsonInvalid: (line: number, column: number, why: string) => string;
    /**
     * The error line when the place is not known [kpadopt5]
     */
    jsonInvalidPlain: (why: string) => string;
    /**
     * The line under text that is not JSON where plain text is allowed [kpadopt5]
     */
    jsonPlainText: string;
    /**
     * The line under an empty field [kpadopt5]
     */
    jsonEmpty: string;
    /**
     * The Format button [kpadopt5]
     */
    jsonFormat: string;
    /**
     * The Minify button [kpadopt5]
     */
    jsonMinify: string;
    /**
     * The Wrap toggle [kpadopt5]
     */
    jsonWrap: string;
    /**
     * The Copy button [kpadopt5]
     */
    jsonCopy: string;
    /**
     * The help line under the field: how to leave it with the keyboard [kpadopt5]
     */
    jsonTabHint: string;
    /**
     * The quiet-hours control's name and its switch (js/quiet-hours.js) [wish-1120]
     */
    quietLabel: string;
    /**
     * The quiet window's start [wish-1120]
     */
    quietFrom: string;
    /**
     * The quiet window's end [wish-1120]
     */
    quietTo: string;
    /**
     * The days the quiet window applies on [wish-1120]
     */
    quietDays: string;
    /**
     * The ticks that let a severity break the quiet [wish-1120]
     */
    quietThroughLabel: string;
    /**
     * The severity words of the quiet-hours ticks [wish-1120]
     */
    quietCritical: string;
    /**
     * Severity word [wish-1120]
     */
    quietWarning: string;
    /**
     * Severity word [wish-1120]
     */
    quietInfo: string;
    /**
     * Severity word [wish-1120]
     */
    quietOk: string;
    /**
     * The line when quiet hours are off [wish-1120]
     */
    quietOff: string;
    /**
     * The problem when the window starts and ends at the same time [wish-1120]
     */
    quietSame: string;
    /**
     * The window in words, "Quiet from 22:00 to 07:00 : Every weekday." [wish-1120]
     */
    quietWhen: (from: string, to: string, days: string) => string;
    /**
     * What still comes through, "Critical still comes through." or "Critical and Warning still come through." [wish-1120]
     */
    quietThrough: (names: string, count: number) => string;
    /**
     * The line when nothing comes through the quiet [wish-1120]
     */
    quietNothing: string;
};
/**
 * @typedef {object} SelectionUndoNewpillStrings
 * @property {string} selectionLabel  The accessible name of a selection bar (js/selection-bar.js) [kpadopt5]
 * @property {(n: number) => string} selectionCount  The bar's count, "3 selected" [kpadopt5]
 * @property {string} selectionClear  The bar's button that ticks nothing: it says what it does [kpadopt5]
 * @property {string} selectionClearTitle  Its tooltip, naming the key [kpadopt5]
 * @property {(n: number) => string} selectionMore  The names line when not every name fits, "+4 more" with the exact number [kpadopt5]
 * @property {string} selectionFewer  The same button once the whole list is open [kpadopt5]
 * @property {string} selectionActions  The phone's button that opens the bar's actions [kpadopt5]
 * @property {(total: number) => string} selectionMatching  The offer beyond what is shown, "Select all 312 that match" [kpadopt5]
 * @property {(total: number) => string} selectionMatchingOn  The bar's line once every match is selected [kpadopt5]
 * @property {(n: number) => string} selectionOnlyShown  The button that takes the offer back, "Select only the 40 shown" [kpadopt5]
 * @property {(words: string) => string} selectionBusy  Said when a bar action starts, "Backing up 3…" is the page's own words; this is the fallback [kpadopt5]
 * @property {(done: number, total: number) => string} selectionProgress  How far a running bar action is, "3 of 7 done" (js/selection-bar.js setSelectionProgress) [wish-1120]
 * @property {(done: number, refused: number) => string} selectionResult  The bar's line after an action some rows refused, "2 done, 1 refused" [kpadopt5]
 * @property {(n: number) => string} selectionDropped  Said when selected rows are gone after a refresh [kpadopt5]
 * @property {(can: number, total: number) => string} selectionCan  The reason an action is off for some rows, "2 of 3 can be updated" with the page's verb after it [kpadopt5]
 * @property {string} selectionCleared  Said when the selection is cleared [kpadopt5]
 * @property {string} undoToastUndo  The Undo button of an undo toast (js/undo-toast.js) [kpadopt5]
 * @property {(key: string) => string} undoToastKeyTitle  Its tooltip, naming the key [kpadopt5]
 * @property {(text: string, seconds: number) => string} undoToastAnnounce  Said once when the toast opens, "Deleted. Undo available for 6 seconds" [kpadopt5]
 * @property {(seconds: number) => string} undoToastClock  The text clock, "5 s" [kpadopt5]
 * @property {string} undoToastRestored  The toast's line after an undo [kpadopt5]
 * @property {string} undoToastSaving  The toast's line while the commit is on its way [kpadopt5]
 * @property {(why: string) => string} undoToastFailed  The toast's line when the commit failed, "Not done: why" [kpadopt5]
 * @property {string} undoToastDismiss  The accessible name of the toast's close button [kpadopt5]
 * @property {string} newpillUnitOne  The word for one new row on a live list (js/newpill.js) [kpadopt5]
 * @property {string} newpillUnitMany  The word for several [kpadopt5]
 * @property {(n: number, unit: string) => string} newpillNew  The pill, "12 new lines" [kpadopt5]
 * @property {string} newpillBackTail  The pill's second half on a list that grows at the end [kpadopt5]
 * @property {string} newpillBackHead  The pill's second half on a list that grows at the top [kpadopt5]
 * @property {(n: number, unit: string) => string} newpillAnnounce  Said at most every ten seconds while the list is read elsewhere [kpadopt5]
 * @property {string} newpillPause  The toolbar button that stops following [kpadopt5]
 * @property {string} newpillResume  The toolbar button that follows again, shown while paused [kpadopt5]
 * @property {(time: string) => string} newpillSince  The divider at the first unseen row, "New since 14:32" [kpadopt5]
 * @property {string} newpillPausedNote  Said when following is paused [kpadopt5]
 * @property {string} newpillFollowing  Said when following resumes [kpadopt5]
 * @property {string} payloadEmpty  A payload cell with nothing in it (js/code.js, cell) [kpadopt5]
 * @property {(size: string) => string} payloadBinary  A payload cell that holds binary data, "binary, 2.1 kB" [kpadopt5]
 * @property {string} payloadOpen  The button that opens a long payload in a dialog [kpadopt5]
 * @property {string} payloadDownload  The link that downloads a binary payload when the page gives a URL [kpadopt5]
 * @property {(lines: number) => string} payloadShowAll  The cell's fold button, "Show all 40 lines" [kpadopt5]
 * @property {string} payloadCopyFull  The cell's copy button: it copies the whole value, folded or not [kpadopt5]
 * @property {(n: number) => string} jsonValidKeys  The quiet line under a valid object, "Valid JSON · 3 keys" [kpadopt5]
 * @property {(n: number) => string} jsonValidItems  The same for a list [kpadopt5]
 * @property {string} jsonValidValue  The same for a bare value [kpadopt5]
 * @property {(line: number, column: number, why: string) => string} jsonInvalid  The error line, "Line 3, column 12: expected ','" [kpadopt5]
 * @property {(why: string) => string} jsonInvalidPlain  The error line when the place is not known [kpadopt5]
 * @property {string} jsonPlainText  The line under text that is not JSON where plain text is allowed [kpadopt5]
 * @property {string} jsonEmpty  The line under an empty field [kpadopt5]
 * @property {string} jsonFormat  The Format button [kpadopt5]
 * @property {string} jsonMinify  The Minify button [kpadopt5]
 * @property {string} jsonWrap  The Wrap toggle [kpadopt5]
 * @property {string} jsonCopy  The Copy button [kpadopt5]
 * @property {string} jsonTabHint  The help line under the field: how to leave it with the keyboard [kpadopt5]
 * @property {string} quietLabel  The quiet-hours control's name and its switch (js/quiet-hours.js) [wish-1120]
 * @property {string} quietFrom  The quiet window's start [wish-1120]
 * @property {string} quietTo  The quiet window's end [wish-1120]
 * @property {string} quietDays  The days the quiet window applies on [wish-1120]
 * @property {string} quietThroughLabel  The ticks that let a severity break the quiet [wish-1120]
 * @property {string} quietCritical  The severity words of the quiet-hours ticks [wish-1120]
 * @property {string} quietWarning  Severity word [wish-1120]
 * @property {string} quietInfo  Severity word [wish-1120]
 * @property {string} quietOk  Severity word [wish-1120]
 * @property {string} quietOff  The line when quiet hours are off [wish-1120]
 * @property {string} quietSame  The problem when the window starts and ends at the same time [wish-1120]
 * @property {(from: string, to: string, days: string) => string} quietWhen  The window in words, "Quiet from 22:00 to 07:00 : Every weekday." [wish-1120]
 * @property {(names: string, count: number) => string} quietThrough  What still comes through, "Critical still comes through." or "Critical and Warning still come through." [wish-1120]
 * @property {string} quietNothing  The line when nothing comes through the quiet [wish-1120]
 */
/** @type {SelectionUndoNewpillStrings} */
export declare const SELECTION_UNDO_NEWPILL_STRINGS: SelectionUndoNewpillStrings;
