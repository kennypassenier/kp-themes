export type ConsoleStrings = {
    /**
     * The pill's word for a block, singular and plural (js/console.js) [kpadopt6]
     */
    consoleUnit: string;
    /**
     * The body's name for a screen reader (js/console.js) [kpadopt6]
     */
    consoleOutputLabel: string;
    /**
     * The prompt's name when the console has none (js/console.js) [kpadopt6]
     */
    consoleCommand: string;
    /**
     * The failed plate's heading and the reason the prompt is off then (js/console.js) [kpadopt6]
     */
    consoleHostFailed: string;
    /**
     * The failed plate's sentence (js/console.js) [kpadopt6]
     */
    consoleHostFailedText: string;
    /**
     * Why the prompt is off when the page gives no reason (js/console.js) [kpadopt6]
     */
    consoleOff: string;
    /**
     * Why the prompt is off while the context list loads (js/console.js) [kpadopt6]
     */
    consoleContextLoadingWhy: string;
    /**
     * The Run button (js/console.js) [kpadopt6]
     */
    consoleRun: string;
    /**
     * The Run button after a line the app wants confirmed (js/console.js) [kpadopt6]
     */
    consoleRunAnyway: string;
    /**
     * The line under the prompt when the page gives none (js/console.js) [kpadopt6]
     */
    consoleHint: string;
    /**
     * The context select's label when the page gives none (js/console.js) [kpadopt6]
     */
    consoleContext: string;
    /**
     * The select while its options load (js/console.js) [kpadopt6]
     */
    consoleContextLoading: string;
    /**
     * A block before the app answered (js/console.js) [kpadopt6]
     */
    consoleSending: string;
    /**
     * A queued block (js/console.js) [kpadopt6]
     */
    consoleQueued: string;
    /**
     * A running block with its timer off (js/console.js) [kpadopt6]
     */
    consoleRunning: string;
    /**
     * A running block's status with its elapsed time (js/console.js) [kpadopt6]
     */
    consoleRunningFor: (time: string) => string;
    /**
     * A finished block's exit code (js/console.js) [kpadopt6]
     */
    consoleExit: (code: number) => string;
    /**
     * The word beside exit 0 (js/console.js) [kpadopt6]
     */
    consoleDone: string;
    /**
     * The word beside a non-zero exit (js/console.js) [kpadopt6]
     */
    consoleFailed: string;
    /**
     * A block the app refused (js/console.js) [kpadopt6]
     */
    consoleRefused: string;
    /**
     * A block that was stopped (js/console.js) [kpadopt6]
     */
    consoleCancelled: string;
    /**
     * A block whose connection dropped (js/console.js) [kpadopt6]
     */
    consoleLost: string;
    /**
     * The block's button that copies its command (js/console.js) [kpadopt6]
     */
    consoleCopyCommand: string;
    /**
     * The block's button that copies its output (js/console.js) [kpadopt6]
     */
    consoleCopyOutput: string;
    /**
     * The block's button that runs its command again (js/console.js) [kpadopt6]
     */
    consoleAgain: string;
    /**
     * The lost block's button that runs it again to see (js/console.js) [kpadopt6]
     */
    consoleRecheck: string;
    /**
     * The running block's button that stops it (js/console.js) [kpadopt6]
     */
    consoleCancel: string;
    /**
     * The block's button that folds it (js/console.js) [kpadopt6]
     */
    consoleCollapse: string;
    /**
     * The block's button that opens it again (js/console.js) [kpadopt6]
     */
    consoleExpand: string;
    /**
     * A copy button's result word (js/console.js) [kpadopt6]
     */
    consoleCopied: string;
    /**
     * A copy button's refusal word (js/console.js) [kpadopt6]
     */
    consoleNotCopied: string;
    /**
     * A lost block's what (js/console.js) [kpadopt6]
     */
    consoleLostWhat: string;
    /**
     * A lost block's what now (js/console.js) [kpadopt6]
     */
    consoleLostNow: string;
    /**
     * A refusal's what when the app gave none (js/console.js) [kpadopt6]
     */
    consoleRefusedWhat: string;
    /**
     * A finished block with nothing written (js/console.js) [kpadopt6]
     */
    consoleNoOutput: string;
    /**
     * The output block's title (js/console.js) [kpadopt6]
     */
    consoleOutput: string;
    /**
     * A running block that has written nothing yet (js/console.js) [kpadopt6]
     */
    consoleWaitingOutput: string;
    /**
     * The failed plate's button (js/console.js) [kpadopt6]
     */
    consoleRetry: string;
    /**
     * The words under the busy card while the console loads (js/console.js) [kpadopt6]
     */
    consoleLoading: string;
    /**
     * The line that stands for blocks folded away (js/console.js) [kpadopt6]
     */
    consoleEarlier: (n: number) => string;
    /**
     * The empty plate's heading (js/console.js) [kpadopt6]
     */
    consoleEmptyTitle: string;
    /**
     * Its sentence (js/console.js) [kpadopt6]
     */
    consoleEmptyText: string;
    /**
     * Said when the last command succeeded (js/console.js) [kpadopt6]
     */
    consoleFinishedOk: (code: number) => string;
    /**
     * Said when the last command failed (js/console.js) [kpadopt6]
     */
    consoleFinishedFailed: (code: number) => string;
    /**
     * Said when the last command was refused (js/console.js) [kpadopt6]
     */
    consoleFinishedRefused: string;
    /**
     * Said when a line needs a second press (js/console.js) [kpadopt6]
     */
    consoleConfirmSaid: (command: string) => string;
    /**
     * The toast and the line after Clear (js/console.js) [kpadopt6]
     */
    consoleCleared: string;
    /**
     * The completion list's name (js/console.js) [kpadopt6]
     */
    consoleCompletions: string;
    /**
     * Said after Tab found several (js/console.js) [kpadopt6]
     */
    consoleMatches: (n: number) => string;
    /**
     * The shortcut sheet's line for Ctrl L (js/console.js) [kpadopt6]
     */
    consoleKeyClear: string;
    /**
     * The sheet's heading (js/console.js) [kpadopt6]
     */
    consoleKeyGroup: string;
    /**
     * The sheet's line for the focus key (js/console.js) [kpadopt6]
     */
    consoleKeyFocus: string;
    /**
     * Why the focus key does nothing now (js/console.js) [kpadopt6]
     */
    consoleKeyFocusReason: string;
    /**
     * The button that unfolds a long link under the code (js/qr.js) [kpadopt6]
     */
    qrShowAllChars: (n: number) => string;
    /**
     * The button that folds it again (js/qr.js) [kpadopt6]
     */
    qrShowLess: string;
};
/**
 * @typedef {object} ConsoleStrings
 * @property {string} consoleUnit  The pill's word for a block, singular and plural (js/console.js) [kpadopt6]
 * @property {string} consoleOutputLabel  The body's name for a screen reader (js/console.js) [kpadopt6]
 * @property {string} consoleCommand  The prompt's name when the console has none (js/console.js) [kpadopt6]
 * @property {string} consoleHostFailed  The failed plate's heading and the reason the prompt is off then (js/console.js) [kpadopt6]
 * @property {string} consoleHostFailedText  The failed plate's sentence (js/console.js) [kpadopt6]
 * @property {string} consoleOff  Why the prompt is off when the page gives no reason (js/console.js) [kpadopt6]
 * @property {string} consoleContextLoadingWhy  Why the prompt is off while the context list loads (js/console.js) [kpadopt6]
 * @property {string} consoleRun  The Run button (js/console.js) [kpadopt6]
 * @property {string} consoleRunAnyway  The Run button after a line the app wants confirmed (js/console.js) [kpadopt6]
 * @property {string} consoleHint  The line under the prompt when the page gives none (js/console.js) [kpadopt6]
 * @property {string} consoleContext  The context select's label when the page gives none (js/console.js) [kpadopt6]
 * @property {string} consoleContextLoading  The select while its options load (js/console.js) [kpadopt6]
 * @property {string} consoleSending  A block before the app answered (js/console.js) [kpadopt6]
 * @property {string} consoleQueued  A queued block (js/console.js) [kpadopt6]
 * @property {string} consoleRunning  A running block with its timer off (js/console.js) [kpadopt6]
 * @property {(time: string) => string} consoleRunningFor  A running block's status with its elapsed time (js/console.js) [kpadopt6]
 * @property {(code: number) => string} consoleExit  A finished block's exit code (js/console.js) [kpadopt6]
 * @property {string} consoleDone  The word beside exit 0 (js/console.js) [kpadopt6]
 * @property {string} consoleFailed  The word beside a non-zero exit (js/console.js) [kpadopt6]
 * @property {string} consoleRefused  A block the app refused (js/console.js) [kpadopt6]
 * @property {string} consoleCancelled  A block that was stopped (js/console.js) [kpadopt6]
 * @property {string} consoleLost  A block whose connection dropped (js/console.js) [kpadopt6]
 * @property {string} consoleCopyCommand  The block's button that copies its command (js/console.js) [kpadopt6]
 * @property {string} consoleCopyOutput  The block's button that copies its output (js/console.js) [kpadopt6]
 * @property {string} consoleAgain  The block's button that runs its command again (js/console.js) [kpadopt6]
 * @property {string} consoleRecheck  The lost block's button that runs it again to see (js/console.js) [kpadopt6]
 * @property {string} consoleCancel  The running block's button that stops it (js/console.js) [kpadopt6]
 * @property {string} consoleCollapse  The block's button that folds it (js/console.js) [kpadopt6]
 * @property {string} consoleExpand  The block's button that opens it again (js/console.js) [kpadopt6]
 * @property {string} consoleCopied  A copy button's result word (js/console.js) [kpadopt6]
 * @property {string} consoleNotCopied  A copy button's refusal word (js/console.js) [kpadopt6]
 * @property {string} consoleLostWhat  A lost block's what (js/console.js) [kpadopt6]
 * @property {string} consoleLostNow  A lost block's what now (js/console.js) [kpadopt6]
 * @property {string} consoleRefusedWhat  A refusal's what when the app gave none (js/console.js) [kpadopt6]
 * @property {string} consoleNoOutput  A finished block with nothing written (js/console.js) [kpadopt6]
 * @property {string} consoleOutput  The output block's title (js/console.js) [kpadopt6]
 * @property {string} consoleWaitingOutput  A running block that has written nothing yet (js/console.js) [kpadopt6]
 * @property {string} consoleRetry  The failed plate's button (js/console.js) [kpadopt6]
 * @property {string} consoleLoading  The words under the busy card while the console loads (js/console.js) [kpadopt6]
 * @property {(n: number) => string} consoleEarlier  The line that stands for blocks folded away (js/console.js) [kpadopt6]
 * @property {string} consoleEmptyTitle  The empty plate's heading (js/console.js) [kpadopt6]
 * @property {string} consoleEmptyText  Its sentence (js/console.js) [kpadopt6]
 * @property {(code: number) => string} consoleFinishedOk  Said when the last command succeeded (js/console.js) [kpadopt6]
 * @property {(code: number) => string} consoleFinishedFailed  Said when the last command failed (js/console.js) [kpadopt6]
 * @property {string} consoleFinishedRefused  Said when the last command was refused (js/console.js) [kpadopt6]
 * @property {(command: string) => string} consoleConfirmSaid  Said when a line needs a second press (js/console.js) [kpadopt6]
 * @property {string} consoleCleared  The toast and the line after Clear (js/console.js) [kpadopt6]
 * @property {string} consoleCompletions  The completion list's name (js/console.js) [kpadopt6]
 * @property {(n: number) => string} consoleMatches  Said after Tab found several (js/console.js) [kpadopt6]
 * @property {string} consoleKeyClear  The shortcut sheet's line for Ctrl L (js/console.js) [kpadopt6]
 * @property {string} consoleKeyGroup  The sheet's heading (js/console.js) [kpadopt6]
 * @property {string} consoleKeyFocus  The sheet's line for the focus key (js/console.js) [kpadopt6]
 * @property {string} consoleKeyFocusReason  Why the focus key does nothing now (js/console.js) [kpadopt6]
 * @property {(n: number) => string} qrShowAllChars  The button that unfolds a long link under the code (js/qr.js) [kpadopt6]
 * @property {string} qrShowLess  The button that folds it again (js/qr.js) [kpadopt6]
 */
/** @type {ConsoleStrings} */
export declare const CONSOLE_STRINGS: ConsoleStrings;
