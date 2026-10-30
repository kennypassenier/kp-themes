export type PasskeysThreadChartStrings = {
    /**
     * What the busy card over the sign-in methods says (js/passkeys.js) [kpadopt5-people]
     */
    passkeysLoading: string;
    /**
     * The sign-in methods list's name for a screen reader
     */
    passkeysListLabel: string;
    /**
     * The empty sign-in methods list
     */
    passkeysEmptyTitle: string;
    /**
     * Its sentence, what a passkey is for
     */
    passkeysEmptyText: string;
    /**
     * The Register button of the empty list
     */
    passkeysRegister: string;
    /**
     * A sign-in methods list that could not be read, when the page gives no sentence
     */
    passkeysError: string;
    /**
     * The Retry button of a failed list
     */
    passkeysRetry: string;
    /**
     * The word for a kind of way in: passkey, magic link, password, token
     */
    passkeysKind: (kind: string) => string;
    /**
     * When a way was added, "Added 12/10/2026"
     */
    passkeysAdded: (date: string) => string;
    /**
     * The verb of the last-used line, "Last used" (then "3 days ago")
     */
    passkeysLastUsedVerb: string;
    /**
     * A way that was never used
     */
    passkeysNeverUsed: string;
    /**
     * The badge on the way this session signed in with
     */
    passkeysCurrent: string;
    /**
     * Its tooltip
     */
    passkeysCurrentTitle: string;
    /**
     * The badge on a way unused for long, "Unused for 120 days"
     */
    passkeysUnused: (days: number) => string;
    /**
     * Its tooltip: a candidate to remove
     */
    passkeysUnusedTitle: string;
    /**
     * The Rename button
     */
    passkeysRename: string;
    /**
     * Rename, as a screen reader hears it with the way's name
     */
    passkeysRenameOf: (label: string) => string;
    /**
     * The name field's label while renaming
     */
    passkeysRenameLabel: string;
    /**
     * Save a new name
     */
    passkeysSave: string;
    /**
     * Leave renaming
     */
    passkeysCancel: string;
    /**
     * The line under a name left empty
     */
    passkeysNameRequired: string;
    /**
     * Announced after a rename
     */
    passkeysRenamed: (label: string) => string;
    /**
     * A rename the server refused, with its reason
     */
    passkeysRenameRefused: (why: string) => string;
    /**
     * The Remove button
     */
    passkeysRemove: string;
    /**
     * The Remove button while it works
     */
    passkeysRemoving: string;
    /**
     * Remove, as a screen reader hears it with the way's name
     */
    passkeysRemoveOf: (label: string) => string;
    /**
     * The confirmation's question, "Remove Work laptop?"
     */
    passkeysRemoveTitle: (label: string) => string;
    /**
     * The first line of what a removal loses
     */
    passkeysLosesWay: (label: string) => string;
    /**
     * What removing the only way in loses
     */
    passkeysLosesLast: string;
    /**
     * What removing the way in use loses
     */
    passkeysLosesCurrent: string;
    /**
     * Announced after a removal
     */
    passkeysRemoved: (label: string) => string;
    /**
     * A removal the server refused, "Not removed: why"
     */
    passkeysRefused: (why: string) => string;
    /**
     * The reason when a refusal gave none
     */
    passkeysRefusedFallback: string;
    /**
     * The reason Remove is off on the only way in, and what to do first
     */
    passkeysLastWay: string;
    /**
     * The short note in the place of Remove on the only way in (the `note` look)
     */
    passkeysOnlyWay: string;
    /**
     * The warning on the only way in when removing it is allowed
     */
    passkeysLastWayWarn: string;
    /**
     * The warning heading when the page is not secure
     */
    passkeysInsecureTitle: string;
    /**
     * What to do about it
     */
    passkeysInsecureText: string;
    /**
     * What the busy card over a conversation says (js/thread.js) [kpadopt5-people]
     */
    threadLoading: string;
    /**
     * The conversation's name for a screen reader
     */
    threadLabel: string;
    /**
     * The empty conversation
     */
    threadEmptyTitle: string;
    /**
     * Its sentence
     */
    threadEmptyText: string;
    /**
     * The Add button of the empty conversation
     */
    threadAdd: string;
    /**
     * A conversation that could not be read, when the page gives no sentence
     */
    threadError: string;
    /**
     * The Retry button of a failed conversation, and of a message not sent
     */
    threadRetry: string;
    /**
     * The sender of an outgoing message with no name
     */
    threadYou: string;
    /**
     * The sender of an incoming message with no name
     */
    threadUnknownSender: string;
    /**
     * A message's label, "From Acme HR, 13/10/2026 14:02"
     */
    threadBubbleLabel: (sender: string, moment: string) => string;
    /**
     * A day divider, "Monday 13/10/2026"
     */
    threadDay: (weekday: string, date: string) => string;
    /**
     * The attachments list's name, "2 attachments"
     */
    threadAttachments: (count: number) => string;
    /**
     * The button under a folded message, "Show all 48 lines"
     */
    threadShowAll: (lines: number) => string;
    /**
     * The same button when the message is whole
     */
    threadShowLess: string;
    /**
     * The Copy text button of a message
     */
    threadCopy: string;
    /**
     * Copy, as a screen reader hears it with the sender
     */
    threadCopyOf: (sender: string) => string;
    /**
     * The Copy button when the clipboard refused
     */
    threadCopyFailed: string;
    /**
     * The line on a message being sent
     */
    threadSending: string;
    /**
     * The line on a message that was not sent, "Not sent: why"
     */
    threadNotSent: (why: string) => string;
    /**
     * The reason when none was given
     */
    threadNotSentFallback: string;
    /**
     * The Jump to newest button
     */
    threadJump: string;
    /**
     * The words in front of a median's value, "median" (js/chart.js) [kpadopt5-people]
     */
    chartMedian: string;
    /**
     * The sentence over a chart with too few readings, "3 of 7 days needed before a trend means something"
     */
    chartFew: (have: number, need: number, unit: string) => string;
    /**
     * What the readings are called in it when the page names none
     */
    chartFewUnit: string;
    /**
     * The key above a chart's plot, for a screen reader
     */
    chartAnnotationKey: string;
    /**
     * The key's word for an event that has a tone and no kind
     */
    chartKindTone: (tone: string) => string;
    /**
     * The key's note on a ringed run
     */
    chartRunsKey: string;
    /**
     * The tooltip of a band, "Maintenance, from … to …"
     */
    chartMarkBand: (label: string, from: string, until: string) => string;
    /**
     * The time of a band in the tooltip, "14:00 to 15:30"
     */
    chartBandWhen: (from: string, until: string) => string;
    /**
     * The arrow for events before the window, "2 events before this window"
     */
    chartEdgeBefore: (count: number) => string;
    /**
     * The arrow for events after the window
     */
    chartEdgeAfter: (count: number) => string;
    /**
     * A key item's tooltip, "Show or hide update events"
     */
    chartKindOn: (kind: string) => string;
};
/**
 * @typedef {object} PasskeysThreadChartStrings
 * @property {string} passkeysLoading  What the busy card over the sign-in methods says (js/passkeys.js) [kpadopt5-people]
 * @property {string} passkeysListLabel  The sign-in methods list's name for a screen reader
 * @property {string} passkeysEmptyTitle  The empty sign-in methods list
 * @property {string} passkeysEmptyText  Its sentence, what a passkey is for
 * @property {string} passkeysRegister  The Register button of the empty list
 * @property {string} passkeysError  A sign-in methods list that could not be read, when the page gives no sentence
 * @property {string} passkeysRetry  The Retry button of a failed list
 * @property {(kind: string) => string} passkeysKind  The word for a kind of way in: passkey, magic link, password, token
 * @property {(date: string) => string} passkeysAdded  When a way was added, "Added 12/10/2026"
 * @property {string} passkeysLastUsedVerb  The verb of the last-used line, "Last used" (then "3 days ago")
 * @property {string} passkeysNeverUsed  A way that was never used
 * @property {string} passkeysCurrent  The badge on the way this session signed in with
 * @property {string} passkeysCurrentTitle  Its tooltip
 * @property {(days: number) => string} passkeysUnused  The badge on a way unused for long, "Unused for 120 days"
 * @property {string} passkeysUnusedTitle  Its tooltip: a candidate to remove
 * @property {string} passkeysRename  The Rename button
 * @property {(label: string) => string} passkeysRenameOf  Rename, as a screen reader hears it with the way's name
 * @property {string} passkeysRenameLabel  The name field's label while renaming
 * @property {string} passkeysSave  Save a new name
 * @property {string} passkeysCancel  Leave renaming
 * @property {string} passkeysNameRequired  The line under a name left empty
 * @property {(label: string) => string} passkeysRenamed  Announced after a rename
 * @property {(why: string) => string} passkeysRenameRefused  A rename the server refused, with its reason
 * @property {string} passkeysRemove  The Remove button
 * @property {string} passkeysRemoving  The Remove button while it works
 * @property {(label: string) => string} passkeysRemoveOf  Remove, as a screen reader hears it with the way's name
 * @property {(label: string) => string} passkeysRemoveTitle  The confirmation's question, "Remove Work laptop?"
 * @property {(label: string) => string} passkeysLosesWay  The first line of what a removal loses
 * @property {string} passkeysLosesLast  What removing the only way in loses
 * @property {string} passkeysLosesCurrent  What removing the way in use loses
 * @property {(label: string) => string} passkeysRemoved  Announced after a removal
 * @property {(why: string) => string} passkeysRefused  A removal the server refused, "Not removed: why"
 * @property {string} passkeysRefusedFallback  The reason when a refusal gave none
 * @property {string} passkeysLastWay  The reason Remove is off on the only way in, and what to do first
 * @property {string} passkeysOnlyWay  The short note in the place of Remove on the only way in (the `note` look)
 * @property {string} passkeysLastWayWarn  The warning on the only way in when removing it is allowed
 * @property {string} passkeysInsecureTitle  The warning heading when the page is not secure
 * @property {string} passkeysInsecureText  What to do about it
 * @property {string} threadLoading  What the busy card over a conversation says (js/thread.js) [kpadopt5-people]
 * @property {string} threadLabel  The conversation's name for a screen reader
 * @property {string} threadEmptyTitle  The empty conversation
 * @property {string} threadEmptyText  Its sentence
 * @property {string} threadAdd  The Add button of the empty conversation
 * @property {string} threadError  A conversation that could not be read, when the page gives no sentence
 * @property {string} threadRetry  The Retry button of a failed conversation, and of a message not sent
 * @property {string} threadYou  The sender of an outgoing message with no name
 * @property {string} threadUnknownSender  The sender of an incoming message with no name
 * @property {(sender: string, moment: string) => string} threadBubbleLabel  A message's label, "From Acme HR, 13/10/2026 14:02"
 * @property {(weekday: string, date: string) => string} threadDay  A day divider, "Monday 13/10/2026"
 * @property {(count: number) => string} threadAttachments  The attachments list's name, "2 attachments"
 * @property {(lines: number) => string} threadShowAll  The button under a folded message, "Show all 48 lines"
 * @property {string} threadShowLess  The same button when the message is whole
 * @property {string} threadCopy  The Copy text button of a message
 * @property {(sender: string) => string} threadCopyOf  Copy, as a screen reader hears it with the sender
 * @property {string} threadCopyFailed  The Copy button when the clipboard refused
 * @property {string} threadSending  The line on a message being sent
 * @property {(why: string) => string} threadNotSent  The line on a message that was not sent, "Not sent: why"
 * @property {string} threadNotSentFallback  The reason when none was given
 * @property {string} threadJump  The Jump to newest button
 * @property {string} chartMedian  The words in front of a median's value, "median" (js/chart.js) [kpadopt5-people]
 * @property {(have: number, need: number, unit: string) => string} chartFew  The sentence over a chart with too few readings, "3 of 7 days needed before a trend means something"
 * @property {string} chartFewUnit  What the readings are called in it when the page names none
 * @property {string} chartAnnotationKey  The key above a chart's plot, for a screen reader
 * @property {(tone: string) => string} chartKindTone  The key's word for an event that has a tone and no kind
 * @property {string} chartRunsKey  The key's note on a ringed run
 * @property {(label: string, from: string, until: string) => string} chartMarkBand  The tooltip of a band, "Maintenance, from … to …"
 * @property {(from: string, until: string) => string} chartBandWhen  The time of a band in the tooltip, "14:00 to 15:30"
 * @property {(count: number) => string} chartEdgeBefore  The arrow for events before the window, "2 events before this window"
 * @property {(count: number) => string} chartEdgeAfter  The arrow for events after the window
 * @property {(kind: string) => string} chartKindOn  A key item's tooltip, "Show or hide update events"
 */
/** @type {PasskeysThreadChartStrings} */
export declare const PASSKEYS_THREAD_CHART_STRINGS: PasskeysThreadChartStrings;
