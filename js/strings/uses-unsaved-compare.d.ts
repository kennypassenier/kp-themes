export type UsesUnsavedCompareStrings = {
    /**
     * A uses map's name when the page gives none (js/uses-map.js) [kpadopt6-media]
     */
    usesLabel: string;
    /**
     * The sources column's name [kpadopt6-media]
     */
    usesSources: string;
    /**
     * The users column's name [kpadopt6-media]
     */
    usesUsers: string;
    /**
     * The failed map's heading [kpadopt6-media]
     */
    usesFailed: string;
    /**
     * Its sentence [kpadopt6-media]
     */
    usesFailedText: string;
    /**
     * The empty map's heading [kpadopt6-media]
     */
    usesEmpty: string;
    /**
     * Its sentence [kpadopt6-media]
     */
    usesEmptyText: string;
    /**
     * The failed map's Retry [kpadopt6-media]
     */
    usesRetry: string;
    /**
     * The Retry of every failed data area drawn with the state plate (heat, matrix, timeline, week, graph, table) [state-plates-1019]
     */
    stateRetry: string;
    /**
     * The sentence under a failed data area's heading when the page gives none [state-plates-1019]
     */
    stateFailedText: string;
    /**
     * The empty network's heading when the page gives no words [state-plates-1019]
     */
    graphEmpty: string;
    /**
     * The failed network's heading when the page gives no words [state-plates-1019]
     */
    graphFailed: string;
    /**
     * The busy card's words while the map loads [kpadopt6-media]
     */
    usesLoading: string;
    /**
     * What a source nothing uses says [kpadopt6-media]
     */
    usesNotUsed: string;
    /**
     * The exact number of uses on a source: "Used by 2" [kpadopt6-media]
     */
    usesCount: (n: number) => string;
    /**
     * The name of a node's link [kpadopt6-media]
     */
    usesOpen: (label: string) => string;
    /**
     * A source in words: "CV Developer NL, used by 2: Deloitte, Takto" [kpadopt6-media]
     */
    usesNodeSource: (label: string, n: number, names: string) => string;
    /**
     * A source nothing uses, in words [kpadopt6-media]
     */
    usesNodeUnused: (label: string) => string;
    /**
     * A user in words: "Deloitte, uses: CV Developer NL" [kpadopt6-media]
     */
    usesNodeUser: (label: string, names: string) => string;
    /**
     * A user that uses nothing, in words [kpadopt6-media]
     */
    usesNodeNothing: (label: string) => string;
    /**
     * The unsaved-changes bar's name for a screen reader (js/unsaved.js) [kpadopt5-time]
     */
    unsavedGroup: string;
    /**
     * The line while nothing is changed [kpadopt5-time]
     */
    unsavedNone: string;
    /**
     * The chip: "2 changes" [kpadopt5-time]
     */
    unsavedCount: (n: number) => string;
    /**
     * The Save button with its count: "Save 2 changes" [kpadopt5-time]
     */
    unsavedSave: (n: number) => string;
    /**
     * The Save button while nothing is changed [kpadopt5-time]
     */
    unsavedSaveNone: string;
    /**
     * The Discard button [kpadopt5-time]
     */
    unsavedDiscard: string;
    /**
     * The menu that holds Discard on a narrow bar [kpadopt5-time]
     */
    unsavedMore: string;
    /**
     * Its Discard entry [kpadopt5-time]
     */
    unsavedDiscardChanges: string;
    /**
     * What it does [kpadopt5-time]
     */
    unsavedDiscardHint: string;
    /**
     * Its entry that opens the list [kpadopt5-time]
     */
    unsavedShowChanges: string;
    /**
     * What it does [kpadopt5-time]
     */
    unsavedShowHint: string;
    /**
     * Why Save and Discard are off while nothing is changed [kpadopt5-time]
     */
    unsavedNothingToSave: string;
    /**
     * Why they are off while saving [kpadopt5-time]
     */
    unsavedSavingNow: string;
    /**
     * The list of changes' name [kpadopt5-time]
     */
    unsavedListTitle: string;
    /**
     * The button that takes you to the first changed row [kpadopt5-time]
     */
    unsavedGoFirst: string;
    /**
     * A change's name as a link to its row [kpadopt5-time]
     */
    unsavedGoTo: (key: string) => string;
    /**
     * A change's own revert button [kpadopt5-time]
     */
    unsavedRevert: string;
    /**
     * That button's accessible name [kpadopt5-time]
     */
    unsavedRevertOne: (key: string) => string;
    /**
     * A change whose row has no name [kpadopt5-time]
     */
    unsavedUnnamed: string;
    /**
     * A secret's value in the list [kpadopt5-time]
     */
    unsavedSecret: string;
    /**
     * A switch that is on, in the list [kpadopt5-time]
     */
    unsavedOn: string;
    /**
     * A switch that is off, in the list [kpadopt5-time]
     */
    unsavedOff: string;
    /**
     * An empty value, in the list [kpadopt5-time]
     */
    unsavedEmpty: string;
    /**
     * What the toast says after Discard: "Dropped 2 changes" [kpadopt5-time]
     */
    unsavedDropped: (n: number) => string;
    /**
     * Its Undo button [kpadopt5-time]
     */
    unsavedUndo: string;
    /**
     * What is said after Undo [kpadopt5-time]
     */
    unsavedRestoredUndo: (n: number) => string;
    /**
     * The toast when kept changes come back after a reload [kpadopt5-time]
     */
    unsavedRestored: (n: number) => string;
    /**
     * What is said when every change was saved [kpadopt5-time]
     */
    unsavedSavedAll: (n: number) => string;
    /**
     * The alert's first line when some were refused: "1 saved, 1 refused" [kpadopt5-time]
     */
    unsavedPartly: (saved: number, refused: number) => string;
    /**
     * The alert's first line when none was saved [kpadopt5-time]
     */
    unsavedRefused: (n: number) => string;
    /**
     * One refused change and its reason [kpadopt5-time]
     */
    unsavedWhy: (key: string, why: string) => string;
    /**
     * The alert's close [kpadopt5-time]
     */
    unsavedDismiss: string;
    /**
     * The question on following a link with unsaved changes [kpadopt5-time]
     */
    unsavedLeaveTitle: string;
    /**
     * Its sentence [kpadopt5-time]
     */
    unsavedLeaveText: (n: number) => string;
    /**
     * Its leave button [kpadopt5-time]
     */
    unsavedLeaveAccept: string;
    /**
     * Its stay button [kpadopt5-time]
     */
    unsavedLeaveStay: string;
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
     * The polite announcement when calm mode is switched on (js/calm.js) [kpadopt5]
     */
    calmOn: string;
    /**
     * The same, when it is switched off [kpadopt5]
     */
    calmOff: string;
    /**
     * The reason the calm switch is disabled while the system itself asks for less motion [kpadopt5]
     */
    calmSystem: string;
    /**
     * The shortcut sheet's empty state, when no shortcut is registered (js/shortcuts.js) [kpadopt5]
     */
    shortcutsEmptyTitle: string;
    /**
     * Its second line [kpadopt5]
     */
    shortcutsEmptyText: string;
    /**
     * The sheet's fixed row for the command palette key [kpadopt5]
     */
    shortcutsPalette: string;
    /**
     * The sheet's fixed row for the key that opens the sheet [kpadopt5]
     */
    shortcutsSheet: string;
    /**
     * What a screen reader hears while a chord waits for its second key [kpadopt5]
     */
    shortcutsPending: string;
    /**
     * The short line after a chord that does nothing, "No shortcut on g x" [kpadopt5]
     */
    shortcutsUnknown: (keys: string) => string;
    /**
     * The warning for a key that needs AltGr on an AZERTY keyboard [kpadopt5]
     */
    shortcutsAltGr: (keys: string, suggestion: string) => string;
    /**
     * The sheet's note on a shortcut that is not available right now [kpadopt5]
     */
    shortcutsUnavailable: string;
    /**
     * The button that opens a collapsed lede (js/lede.js) [kpadopt5]
     */
    ledeMore: string;
    /**
     * The button that folds it again [kpadopt5]
     */
    ledeLess: string;
    /**
     * The link at the end of a lede that carries `data-kp-lede-link` [kpadopt5]
     */
    ledeLearnMore: string;
};
/**
 * @typedef {object} UsesUnsavedCompareStrings
 * @property {string} usesLabel  A uses map's name when the page gives none (js/uses-map.js) [kpadopt6-media]
 * @property {string} usesSources  The sources column's name [kpadopt6-media]
 * @property {string} usesUsers  The users column's name [kpadopt6-media]
 * @property {string} usesFailed  The failed map's heading [kpadopt6-media]
 * @property {string} usesFailedText  Its sentence [kpadopt6-media]
 * @property {string} usesEmpty  The empty map's heading [kpadopt6-media]
 * @property {string} usesEmptyText  Its sentence [kpadopt6-media]
 * @property {string} usesRetry  The failed map's Retry [kpadopt6-media]
 * @property {string} stateRetry  The Retry of every failed data area drawn with the state plate (heat, matrix, timeline, week, graph, table) [state-plates-1019]
 * @property {string} stateFailedText  The sentence under a failed data area's heading when the page gives none [state-plates-1019]
 * @property {string} graphEmpty  The empty network's heading when the page gives no words [state-plates-1019]
 * @property {string} graphFailed  The failed network's heading when the page gives no words [state-plates-1019]
 * @property {string} usesLoading  The busy card's words while the map loads [kpadopt6-media]
 * @property {string} usesNotUsed  What a source nothing uses says [kpadopt6-media]
 * @property {(n: number) => string} usesCount  The exact number of uses on a source: "Used by 2" [kpadopt6-media]
 * @property {(label: string) => string} usesOpen  The name of a node's link [kpadopt6-media]
 * @property {(label: string, n: number, names: string) => string} usesNodeSource  A source in words: "CV Developer NL, used by 2: Deloitte, Takto" [kpadopt6-media]
 * @property {(label: string) => string} usesNodeUnused  A source nothing uses, in words [kpadopt6-media]
 * @property {(label: string, names: string) => string} usesNodeUser  A user in words: "Deloitte, uses: CV Developer NL" [kpadopt6-media]
 * @property {(label: string) => string} usesNodeNothing  A user that uses nothing, in words [kpadopt6-media]
 * @property {string} unsavedGroup  The unsaved-changes bar's name for a screen reader (js/unsaved.js) [kpadopt5-time]
 * @property {string} unsavedNone  The line while nothing is changed [kpadopt5-time]
 * @property {(n: number) => string} unsavedCount  The chip: "2 changes" [kpadopt5-time]
 * @property {(n: number) => string} unsavedSave  The Save button with its count: "Save 2 changes" [kpadopt5-time]
 * @property {string} unsavedSaveNone  The Save button while nothing is changed [kpadopt5-time]
 * @property {string} unsavedDiscard  The Discard button [kpadopt5-time]
 * @property {string} unsavedMore  The menu that holds Discard on a narrow bar [kpadopt5-time]
 * @property {string} unsavedDiscardChanges  Its Discard entry [kpadopt5-time]
 * @property {string} unsavedDiscardHint  What it does [kpadopt5-time]
 * @property {string} unsavedShowChanges  Its entry that opens the list [kpadopt5-time]
 * @property {string} unsavedShowHint  What it does [kpadopt5-time]
 * @property {string} unsavedNothingToSave  Why Save and Discard are off while nothing is changed [kpadopt5-time]
 * @property {string} unsavedSavingNow  Why they are off while saving [kpadopt5-time]
 * @property {string} unsavedListTitle  The list of changes' name [kpadopt5-time]
 * @property {string} unsavedGoFirst  The button that takes you to the first changed row [kpadopt5-time]
 * @property {(key: string) => string} unsavedGoTo  A change's name as a link to its row [kpadopt5-time]
 * @property {string} unsavedRevert  A change's own revert button [kpadopt5-time]
 * @property {(key: string) => string} unsavedRevertOne  That button's accessible name [kpadopt5-time]
 * @property {string} unsavedUnnamed  A change whose row has no name [kpadopt5-time]
 * @property {string} unsavedSecret  A secret's value in the list [kpadopt5-time]
 * @property {string} unsavedOn  A switch that is on, in the list [kpadopt5-time]
 * @property {string} unsavedOff  A switch that is off, in the list [kpadopt5-time]
 * @property {string} unsavedEmpty  An empty value, in the list [kpadopt5-time]
 * @property {(n: number) => string} unsavedDropped  What the toast says after Discard: "Dropped 2 changes" [kpadopt5-time]
 * @property {string} unsavedUndo  Its Undo button [kpadopt5-time]
 * @property {(n: number) => string} unsavedRestoredUndo  What is said after Undo [kpadopt5-time]
 * @property {(n: number) => string} unsavedRestored  The toast when kept changes come back after a reload [kpadopt5-time]
 * @property {(n: number) => string} unsavedSavedAll  What is said when every change was saved [kpadopt5-time]
 * @property {(saved: number, refused: number) => string} unsavedPartly  The alert's first line when some were refused: "1 saved, 1 refused" [kpadopt5-time]
 * @property {(n: number) => string} unsavedRefused  The alert's first line when none was saved [kpadopt5-time]
 * @property {(key: string, why: string) => string} unsavedWhy  One refused change and its reason [kpadopt5-time]
 * @property {string} unsavedDismiss  The alert's close [kpadopt5-time]
 * @property {string} unsavedLeaveTitle  The question on following a link with unsaved changes [kpadopt5-time]
 * @property {(n: number) => string} unsavedLeaveText  Its sentence [kpadopt5-time]
 * @property {string} unsavedLeaveAccept  Its leave button [kpadopt5-time]
 * @property {string} unsavedLeaveStay  Its stay button [kpadopt5-time]
 * @property {string} compareBefore  The compare slider's label on the before side (js/compare.js) [kpadopt4-ideas]
 * @property {string} compareAfter  Its label on the after side [kpadopt4-ideas]
 * @property {(before: string, after: string) => string} compareSlider  The divider's name for a screen reader [kpadopt4-ideas]
 * @property {(percent: number, before: string, after: string) => string} compareValue  Where the divider stands: "40% Before, 60% After" [kpadopt4-ideas]
 * @property {string} compareFailed  A pane whose image could not be loaded [kpadopt4-ideas]
 * @property {string} compareRetry  The Retry button of a pane whose image could not be loaded [kpadopt4 r2]
 * @property {string} compareLoading  What the busy card over a compare slider says while its images load [kpadopt4 r2]
 * @property {string} calmOn  The polite announcement when calm mode is switched on (js/calm.js) [kpadopt5]
 * @property {string} calmOff  The same, when it is switched off [kpadopt5]
 * @property {string} calmSystem  The reason the calm switch is disabled while the system itself asks for less motion [kpadopt5]
 * @property {string} shortcutsEmptyTitle  The shortcut sheet's empty state, when no shortcut is registered (js/shortcuts.js) [kpadopt5]
 * @property {string} shortcutsEmptyText  Its second line [kpadopt5]
 * @property {string} shortcutsPalette  The sheet's fixed row for the command palette key [kpadopt5]
 * @property {string} shortcutsSheet  The sheet's fixed row for the key that opens the sheet [kpadopt5]
 * @property {string} shortcutsPending  What a screen reader hears while a chord waits for its second key [kpadopt5]
 * @property {(keys: string) => string} shortcutsUnknown  The short line after a chord that does nothing, "No shortcut on g x" [kpadopt5]
 * @property {(keys: string, suggestion: string) => string} shortcutsAltGr  The warning for a key that needs AltGr on an AZERTY keyboard [kpadopt5]
 * @property {string} shortcutsUnavailable  The sheet's note on a shortcut that is not available right now [kpadopt5]
 * @property {string} ledeMore  The button that opens a collapsed lede (js/lede.js) [kpadopt5]
 * @property {string} ledeLess  The button that folds it again [kpadopt5]
 * @property {string} ledeLearnMore  The link at the end of a lede that carries `data-kp-lede-link` [kpadopt5]
 */
/** @type {UsesUnsavedCompareStrings} */
export declare const USES_UNSAVED_COMPARE_STRINGS: UsesUnsavedCompareStrings;
