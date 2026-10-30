export type UsualLogviewerStrings = {
    /**
     * The label over the full list under the band [kpadopt6]
     */
    usualAll: string;
    /**
     * The status line of a picker with a band: "5 usual, 33 more" [kpadopt6]
     */
    usualStatus: (usual: number, more: number) => string;
    /**
     * The row that unfolds the full list: "Show all 38", the exact number [kpadopt6]
     */
    usualShowAll: (n: number) => string;
    /**
     * The same row once the list is open [kpadopt6]
     */
    usualShowFewer: string;
    /**
     * The row that adds what was typed: "Add 'hoofdpjn' as new" [kpadopt6]
     */
    usualAdd: (label: string) => string;
    /**
     * A close name offered for what was typed: "Did you mean Hoofdpijn?" [kpadopt6]
     */
    usualDidYouMean: (name: string) => string;
    /**
     * The plate over a search that matches nothing [kpadopt6]
     */
    usualNoMatchTitle: string;
    /**
     * Its sentence when a name can be added [kpadopt6]
     */
    usualNoMatchText: string;
    /**
     * Its sentence when nothing can be added [kpadopt6]
     */
    usualNoMatchTextFixed: string;
    /**
     * What is said when typed text named an item already in the list: "Hoofdpijn was already in the list, selected" [kpadopt6]
     */
    usualSelectedExisting: (label: string) => string;
    /**
     * What is said after an add: "Hoofdpijn added" [kpadopt6]
     */
    usualAdded: (label: string) => string;
    /**
     * The undo toast's line after an add: "Added 'Neksteun'" [kpadopt6]
     */
    usualAddedToast: (label: string) => string;
    /**
     * The plate of a picker with no items at all [kpadopt6]
     */
    usualEmptyTitle: string;
    /**
     * Its sentence when a name can be added [kpadopt6]
     */
    usualEmptyText: string;
    /**
     * Its sentence when nobody can add here [kpadopt6]
     */
    usualEmptyTextFixed: string;
    /**
     * Its button [kpadopt6]
     */
    usualAddButton: string;
    /**
     * The plate of a list that could not be read [kpadopt6]
     */
    usualFailedTitle: string;
    /**
     * Its sentence [kpadopt6]
     */
    usualFailedText: string;
    /**
     * Its button [kpadopt6]
     */
    usualRetry: string;
    /**
     * The words under the loading card of a picker [kpadopt6]
     */
    usualLoading: string;
    /**
     * The check's button that says a usual choice did not happen today [kpadopt6]
     */
    usualNotToday: string;
    /**
     * Kept for consumers: a not-today button's accessible name, "Hoofdpijn: not today" [kpadopt6]
     */
    usualNotTodayName: (label: string) => string;
    /**
     * What is said when it is set: "Hoofdpijn: not today" [kpadopt6]
     */
    usualNotTodayAnnounce: (label: string) => string;
    /**
     * The word a screen reader hears after a chip that is not today [kpadopt6]
     */
    usualNotTodayMark: string;
    /**
     * The `?` sheet's words for Alt U: "Jump to the usual choices" [kpadopt6]
     */
    usualJump: string;
    /**
     * The list's line, and what is said, when a name typed is already picked: "Headache is already picked" [kpadopt6]
     */
    usualAlreadyPicked: (label: string) => string;
    /**
     * What is said when the check's "Had it" picks a choice: "Headache: had it" [kpadopt6]
     */
    usualPicked: (label: string) => string;
    /**
     * What is said when Enter took the closest name: "Fatigu: took Fatigue" [kpadopt6]
     */
    usualTookClosest: (typed: string, label: string) => string;
    /**
     * What is said when Enter lit the first "Did you mean" row: "Did you mean Fatigue? Enter picks it" [kpadopt6]
     */
    usualAsk: (label: string) => string;
    /**
     * The line under the field after an add: "Added 'Neksteun' as new" [kpadopt6]
     */
    usualAddedNote: (label: string) => string;
    /**
     * Its button [kpadopt6]
     */
    usualUndo: string;
    /**
     * That button's accessible name: "Undo adding Neksteun" [kpadopt6]
     */
    usualUndoName: (label: string) => string;
    /**
     * What is said after that Undo: "Neksteun taken out again" [kpadopt6]
     */
    usualAddUndone: (label: string) => string;
    /**
     * The heading over the check of the usual choices [kpadopt6]
     */
    usualCheckTitle: string;
    /**
     * The line under it in the rows look: what Not today means [kpadopt6]
     */
    usualCheckWhat: string;
    /**
     * The line under it in the chips look: what a press does and what Not today means [kpadopt6]
     */
    usualCheckWhatChips: string;
    /**
     * The check's button that says the choice happened today (it picks it) [kpadopt6]
     */
    usualHadIt: string;
    /**
     * The word a screen reader hears after a chip that is had it [kpadopt6]
     */
    usualHadItWord: string;
    /**
     * What is said when an answer is taken back: "Headache: not answered" [kpadopt6]
     */
    usualUnanswered: (label: string) => string;
    /**
     * The word a screen reader hears after a chip with no answer [kpadopt6]
     */
    usualUnansweredWord: string;
    /**
     * The pill's word for a log line, singular and plural (js/logviewer.js) [gap-log-viewer]
     */
    logviewerUnit: string;
    /**
     * The viewer's name for a screen reader when the page gives none (js/logviewer.js) [gap-log-viewer]
     */
    logviewerLabel: string;
    /**
     * The scrolling list's name for a screen reader (js/logviewer.js) [gap-log-viewer]
     */
    logviewerLogLabel: string;
    /**
     * The search box's label (js/logviewer.js) [gap-log-viewer]
     */
    logviewerSearch: string;
    /**
     * The search box's placeholder (js/logviewer.js) [gap-log-viewer]
     */
    logviewerSearchHint: string;
    /**
     * The count when nothing matches (js/logviewer.js) [gap-log-viewer]
     */
    logviewerSearchNone: string;
    /**
     * The count while the box is empty (js/logviewer.js) [gap-log-viewer]
     */
    logviewerSearchIdle: string;
    /**
     * The count when there are matches and none is current (js/logviewer.js) [gap-log-viewer]
     */
    logviewerMatches: (n: number) => string;
    /**
     * The count with the current match (js/logviewer.js) [gap-log-viewer]
     */
    logviewerMatchAt: (at: number, n: number) => string;
    /**
     * The button that goes to the match before (js/logviewer.js) [gap-log-viewer]
     */
    logviewerPrevious: string;
    /**
     * The button that goes to the next match (js/logviewer.js) [gap-log-viewer]
     */
    logviewerNext: string;
    /**
     * The toggle that hides lines without a match (js/logviewer.js) [gap-log-viewer]
     */
    logviewerOnly: string;
    /**
     * The toggle that wraps long lines (js/logviewer.js) [gap-log-viewer]
     */
    logviewerWrap: string;
    /**
     * The time column control's name (js/logviewer.js) [gap-log-viewer]
     */
    logviewerTimeLabel: string;
    /**
     * Its first choice, the time of day (js/logviewer.js) [gap-log-viewer]
     */
    logviewerTimeShort: string;
    /**
     * Its second choice, date and time (js/logviewer.js) [gap-log-viewer]
     */
    logviewerTimeFull: string;
    /**
     * Its third choice, no time column (js/logviewer.js) [gap-log-viewer]
     */
    logviewerTimeOff: string;
    /**
     * The level select's label (js/logviewer.js) [gap-log-viewer]
     */
    logviewerLevel: string;
    /**
     * Its first entry, every level (js/logviewer.js) [gap-log-viewer]
     */
    logviewerLevelAll: string;
    /**
     * Its other entries: 'info', 'warning' or 'error' and above (js/logviewer.js) [gap-log-viewer]
     */
    logviewerLevelFrom: (level: 'info' | 'warning' | 'error') => string;
    /**
     * The copy button (js/logviewer.js) [gap-log-viewer]
     */
    logviewerCopy: string;
    /**
     * The copy button's result word (js/logviewer.js) [gap-log-viewer]
     */
    logviewerCopied: string;
    /**
     * The copy button's refusal word (js/logviewer.js) [gap-log-viewer]
     */
    logviewerNotCopied: string;
    /**
     * The download button (js/logviewer.js) [gap-log-viewer]
     */
    logviewerDownload: string;
    /**
     * Why copy and download are off when no line is shown (js/logviewer.js) [gap-log-viewer]
     */
    logviewerNothing: string;
    /**
     * The foot's count of lines shown (js/logviewer.js) [gap-log-viewer]
     */
    logviewerCount: (shown: number, total: number) => string;
    /**
     * The foot's note about lines pushed out by the cap (js/logviewer.js) [gap-log-viewer]
     */
    logviewerDropped: (n: number, max: number) => string;
    /**
     * The words under the busy card while the lines are read (js/logviewer.js) [gap-log-viewer]
     */
    logviewerLoading: string;
    /**
     * The empty plate's heading (js/logviewer.js) [gap-log-viewer]
     */
    logviewerEmptyTitle: string;
    /**
     * Its sentence (js/logviewer.js) [gap-log-viewer]
     */
    logviewerEmptyText: string;
    /**
     * The plate's heading when a search or level hides every line (js/logviewer.js) [gap-log-viewer]
     */
    logviewerNoMatchTitle: string;
    /**
     * Its sentence (js/logviewer.js) [gap-log-viewer]
     */
    logviewerNoMatchText: string;
    /**
     * Its button that takes the search and the level away (js/logviewer.js) [gap-log-viewer]
     */
    logviewerClear: string;
    /**
     * The failed plate's heading (js/logviewer.js) [gap-log-viewer]
     */
    logviewerFailed: string;
    /**
     * Its sentence (js/logviewer.js) [gap-log-viewer]
     */
    logviewerFailedText: string;
    /**
     * Its button (js/logviewer.js) [gap-log-viewer]
     */
    logviewerRetry: string;
    /**
     * The shortcut sheet's line for the search key (js/logviewer.js) [gap-log-viewer]
     */
    logviewerKeySearch: string;
    /**
     * The sheet's heading (js/logviewer.js) [gap-log-viewer]
     */
    logviewerKeyGroup: string;
};
/**
 * @typedef {object} UsualLogviewerStrings
 * @property {string} usualAll  The label over the full list under the band [kpadopt6]
 * @property {(usual: number, more: number) => string} usualStatus  The status line of a picker with a band: "5 usual, 33 more" [kpadopt6]
 * @property {(n: number) => string} usualShowAll  The row that unfolds the full list: "Show all 38", the exact number [kpadopt6]
 * @property {string} usualShowFewer  The same row once the list is open [kpadopt6]
 * @property {(label: string) => string} usualAdd  The row that adds what was typed: "Add 'hoofdpjn' as new" [kpadopt6]
 * @property {(name: string) => string} usualDidYouMean  A close name offered for what was typed: "Did you mean Hoofdpijn?" [kpadopt6]
 * @property {string} usualNoMatchTitle  The plate over a search that matches nothing [kpadopt6]
 * @property {string} usualNoMatchText  Its sentence when a name can be added [kpadopt6]
 * @property {string} usualNoMatchTextFixed  Its sentence when nothing can be added [kpadopt6]
 * @property {(label: string) => string} usualSelectedExisting  What is said when typed text named an item already in the list: "Hoofdpijn was already in the list, selected" [kpadopt6]
 * @property {(label: string) => string} usualAdded  What is said after an add: "Hoofdpijn added" [kpadopt6]
 * @property {(label: string) => string} usualAddedToast  The undo toast's line after an add: "Added 'Neksteun'" [kpadopt6]
 * @property {string} usualEmptyTitle  The plate of a picker with no items at all [kpadopt6]
 * @property {string} usualEmptyText  Its sentence when a name can be added [kpadopt6]
 * @property {string} usualEmptyTextFixed  Its sentence when nobody can add here [kpadopt6]
 * @property {string} usualAddButton  Its button [kpadopt6]
 * @property {string} usualFailedTitle  The plate of a list that could not be read [kpadopt6]
 * @property {string} usualFailedText  Its sentence [kpadopt6]
 * @property {string} usualRetry  Its button [kpadopt6]
 * @property {string} usualLoading  The words under the loading card of a picker [kpadopt6]
 * @property {string} usualNotToday  The check's button that says a usual choice did not happen today [kpadopt6]
 * @property {(label: string) => string} usualNotTodayName  Kept for consumers: a not-today button's accessible name, "Hoofdpijn: not today" [kpadopt6]
 * @property {(label: string) => string} usualNotTodayAnnounce  What is said when it is set: "Hoofdpijn: not today" [kpadopt6]
 * @property {string} usualNotTodayMark  The word a screen reader hears after a chip that is not today [kpadopt6]
 * @property {string} usualJump  The `?` sheet's words for Alt U: "Jump to the usual choices" [kpadopt6]
 * @property {(label: string) => string} usualAlreadyPicked  The list's line, and what is said, when a name typed is already picked: "Headache is already picked" [kpadopt6]
 * @property {(label: string) => string} usualPicked  What is said when the check's "Had it" picks a choice: "Headache: had it" [kpadopt6]
 * @property {(typed: string, label: string) => string} usualTookClosest  What is said when Enter took the closest name: "Fatigu: took Fatigue" [kpadopt6]
 * @property {(label: string) => string} usualAsk  What is said when Enter lit the first "Did you mean" row: "Did you mean Fatigue? Enter picks it" [kpadopt6]
 * @property {(label: string) => string} usualAddedNote  The line under the field after an add: "Added 'Neksteun' as new" [kpadopt6]
 * @property {string} usualUndo  Its button [kpadopt6]
 * @property {(label: string) => string} usualUndoName  That button's accessible name: "Undo adding Neksteun" [kpadopt6]
 * @property {(label: string) => string} usualAddUndone  What is said after that Undo: "Neksteun taken out again" [kpadopt6]
 * @property {string} usualCheckTitle  The heading over the check of the usual choices [kpadopt6]
 * @property {string} usualCheckWhat  The line under it in the rows look: what Not today means [kpadopt6]
 * @property {string} usualCheckWhatChips  The line under it in the chips look: what a press does and what Not today means [kpadopt6]
 * @property {string} usualHadIt  The check's button that says the choice happened today (it picks it) [kpadopt6]
 * @property {string} usualHadItWord  The word a screen reader hears after a chip that is had it [kpadopt6]
 * @property {(label: string) => string} usualUnanswered  What is said when an answer is taken back: "Headache: not answered" [kpadopt6]
 * @property {string} usualUnansweredWord  The word a screen reader hears after a chip with no answer [kpadopt6]
 * @property {string} logviewerUnit  The pill's word for a log line, singular and plural (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerLabel  The viewer's name for a screen reader when the page gives none (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerLogLabel  The scrolling list's name for a screen reader (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerSearch  The search box's label (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerSearchHint  The search box's placeholder (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerSearchNone  The count when nothing matches (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerSearchIdle  The count while the box is empty (js/logviewer.js) [gap-log-viewer]
 * @property {(n: number) => string} logviewerMatches  The count when there are matches and none is current (js/logviewer.js) [gap-log-viewer]
 * @property {(at: number, n: number) => string} logviewerMatchAt  The count with the current match (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerPrevious  The button that goes to the match before (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerNext  The button that goes to the next match (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerOnly  The toggle that hides lines without a match (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerWrap  The toggle that wraps long lines (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerTimeLabel  The time column control's name (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerTimeShort  Its first choice, the time of day (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerTimeFull  Its second choice, date and time (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerTimeOff  Its third choice, no time column (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerLevel  The level select's label (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerLevelAll  Its first entry, every level (js/logviewer.js) [gap-log-viewer]
 * @property {(level: 'info' | 'warning' | 'error') => string} logviewerLevelFrom  Its other entries: 'info', 'warning' or 'error' and above (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerCopy  The copy button (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerCopied  The copy button's result word (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerNotCopied  The copy button's refusal word (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerDownload  The download button (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerNothing  Why copy and download are off when no line is shown (js/logviewer.js) [gap-log-viewer]
 * @property {(shown: number, total: number) => string} logviewerCount  The foot's count of lines shown (js/logviewer.js) [gap-log-viewer]
 * @property {(n: number, max: number) => string} logviewerDropped  The foot's note about lines pushed out by the cap (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerLoading  The words under the busy card while the lines are read (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerEmptyTitle  The empty plate's heading (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerEmptyText  Its sentence (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerNoMatchTitle  The plate's heading when a search or level hides every line (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerNoMatchText  Its sentence (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerClear  Its button that takes the search and the level away (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerFailed  The failed plate's heading (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerFailedText  Its sentence (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerRetry  Its button (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerKeySearch  The shortcut sheet's line for the search key (js/logviewer.js) [gap-log-viewer]
 * @property {string} logviewerKeyGroup  The sheet's heading (js/logviewer.js) [gap-log-viewer]
 */
/** @type {UsualLogviewerStrings} */
export declare const USUAL_LOGVIEWER_STRINGS: UsualLogviewerStrings;
