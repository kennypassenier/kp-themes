export type DiffRatingStrings = {
    /**
     * The diff view's accessible name when it has none (js/diff.js) [gap-diff-view]
     */
    diffLabel: string;
    /**
     * The bar's count of files: "3 files changed" (js/diff.js) [gap-diff-view]
     */
    diffSummary: (files: number) => string;
    /**
     * The button that opens every file (js/diff.js) [gap-diff-view]
     */
    diffExpandAll: string;
    /**
     * The button that closes every file (js/diff.js) [gap-diff-view]
     */
    diffCollapseAll: string;
    /**
     * Why Expand all is off: every file is already open (js/diff.js) [gap-diff-view]
     */
    diffAllOpen: string;
    /**
     * Why Collapse all is off: every file is already closed (js/diff.js) [gap-diff-view]
     */
    diffAllClosed: string;
    /**
     * The badge of a new file (js/diff.js) [gap-diff-view]
     */
    diffStatusAdded: string;
    /**
     * The badge of a deleted file (js/diff.js) [gap-diff-view]
     */
    diffStatusRemoved: string;
    /**
     * The badge of a changed file (js/diff.js) [gap-diff-view]
     */
    diffStatusModified: string;
    /**
     * The badge of a moved file (js/diff.js) [gap-diff-view]
     */
    diffStatusRenamed: string;
    /**
     * The badge of a file that is not text (js/diff.js) [gap-diff-view]
     */
    diffStatusBinary: string;
    /**
     * A renamed file's path for a screen reader: "renamed from old/path" (js/diff.js) [gap-diff-view]
     */
    diffRenamedFrom: (from: string) => string;
    /**
     * The +N count for a screen reader: "3 lines added" (js/diff.js) [gap-diff-view]
     */
    diffAddedCount: (n: number) => string;
    /**
     * The -M count for a screen reader: "1 line removed" (js/diff.js) [gap-diff-view]
     */
    diffRemovedCount: (n: number) => string;
    /**
     * The folded context row: "12 unchanged lines" (js/diff.js) [gap-diff-view]
     */
    diffUnchanged: (n: number) => string;
    /**
     * That row's accessible name: "Show 12 unchanged lines" (js/diff.js) [gap-diff-view]
     */
    diffUnchangedName: (n: number) => string;
    /**
     * The same row once opened: "Hide 12 unchanged lines" (js/diff.js) [gap-diff-view]
     */
    diffUnchangedHide: (n: number) => string;
    /**
     * Said politely after a fold opened: "12 unchanged lines shown" (js/diff.js) [gap-diff-view]
     */
    diffUnchangedShown: (n: number) => string;
    /**
     * Said politely after a fold closed: "12 unchanged lines hidden" (js/diff.js) [gap-diff-view]
     */
    diffUnchangedHidden: (n: number) => string;
    /**
     * The row that shows the lines past the file's limit: "Show the other 1240 lines" (js/diff.js) [gap-diff-view]
     */
    diffShowMore: (n: number) => string;
    /**
     * The heading of a file that is not text (js/diff.js) [gap-diff-view]
     */
    diffBinaryTitle: string;
    /**
     * Its sentence (js/diff.js) [gap-diff-view]
     */
    diffBinaryText: string;
    /**
     * A file with no line changes (a rename or a mode change) (js/diff.js) [gap-diff-view]
     */
    diffNoLines: string;
    /**
     * A file's body name: "Changes in stacks/media/compose.yml" (js/diff.js) [gap-diff-view]
     */
    diffChangesIn: (path: string) => string;
    /**
     * The Copy path button (js/diff.js) [gap-diff-view]
     */
    diffCopyPath: string;
    /**
     * Its result word (js/diff.js) [gap-diff-view]
     */
    diffCopied: string;
    /**
     * Its refusal word (js/diff.js) [gap-diff-view]
     */
    diffCopyFailed: string;
    /**
     * The words under the busy card while the changes are read (js/diff.js) [gap-diff-view]
     */
    diffLoading: string;
    /**
     * Said politely when the changes are drawn (js/diff.js) [gap-diff-view]
     */
    diffReady: (files: number, added: number, removed: number) => string;
    /**
     * The empty plate's heading (js/diff.js) [gap-diff-view]
     */
    diffEmptyTitle: string;
    /**
     * Its sentence (js/diff.js) [gap-diff-view]
     */
    diffEmptyText: string;
    /**
     * Its sentence when one name was compared: "compose.yml is the same on both sides." (js/diff.js) [gap-diff-view]
     */
    diffEmptySame: (name: string) => string;
    /**
     * Its sentence when two names were compared (js/diff.js) [gap-diff-view]
     */
    diffEmptyBetween: (from: string, to: string) => string;
    /**
     * The failed plate's heading (js/diff.js) [gap-diff-view]
     */
    diffFailedTitle: string;
    /**
     * Its sentence (js/diff.js) [gap-diff-view]
     */
    diffFailedText: string;
    /**
     * The failed plate's button (js/diff.js) [gap-diff-view]
     */
    diffRetry: string;
    /**
     * The star row's name for a screen reader: "Rating for Lasagne" (js/rating.js) [kpadopt6]
     */
    ratingGroupName: (item: string) => string;
    /**
     * The same when the row names no item [kpadopt6]
     */
    ratingGroupNameBare: string;
    /**
     * One star's name: "4 of 5" [kpadopt6]
     */
    ratingStarName: (n: number, max: number) => string;
    /**
     * The same with its word: "4 of 5, Good" [kpadopt6]
     */
    ratingStarNameLabel: (n: number, max: number, label: string) => string;
    /**
     * A display row's name: "Rated 4 of 5" [kpadopt6]
     */
    ratingRated: (value: number, max: number) => string;
    /**
     * The same with how many people rated: "Rated 4.5 of 5 by 12 people" [kpadopt6]
     */
    ratingRatedCount: (value: number, max: number, count: number) => string;
    /**
     * The line, and the name, of a row nobody has rated: "Not rated yet" [kpadopt6]
     */
    ratingUnrated: string;
    /**
     * The caption of an input row with no rating: "Tap a star" [kpadopt6]
     */
    ratingTap: string;
    /**
     * The small button that removes the rating [kpadopt6]
     */
    ratingClear: string;
    /**
     * That button's accessible name: "Clear the rating for Lasagne" [kpadopt6]
     */
    ratingClearName: (item: string) => string;
    /**
     * The caption of a rated row without words per level: "4 of 5" [kpadopt6]
     */
    ratingOutOf: (value: number, max: number) => string;
    /**
     * An aggregated score: "4.5 (12)" [kpadopt6]
     */
    ratingAverage: (value: number, count: number) => string;
    /**
     * What is said when the rating changes: "Lasagne: 4 of 5" [kpadopt6]
     */
    ratingAnnounce: (item: string, value: number, max: number) => string;
    /**
     * What is said when the rating is removed: "Lasagne: rating removed" [kpadopt6]
     */
    ratingAnnounceCleared: (item: string) => string;
    /**
     * The undo toast's line: "Lasagne: 4 stars" [kpadopt6]
     */
    ratingToast: (item: string, value: number) => string;
    /**
     * The undo toast's line after Clear [kpadopt6]
     */
    ratingToastCleared: (item: string) => string;
    /**
     * The row's name while the saved value is read [kpadopt6]
     */
    ratingLoading: string;
    /**
     * The words that replace the stars when the value could not be read [kpadopt6]
     */
    ratingFailedRead: string;
    /**
     * Its button [kpadopt6]
     */
    ratingRetry: string;
    /**
     * The line under the row when a save was refused: "Could not save the rating for Lasagne" [kpadopt6]
     */
    ratingSaveFailed: (item: string) => string;
    /**
     * The row's description while a save is on its way [kpadopt6]
     */
    ratingSaving: string;
    /**
     * The button that saves a pending rating (commit confirm) [kpadopt6]
     */
    ratingConfirm: string;
    /**
     * The button that drops a pending rating [kpadopt6]
     */
    ratingCancel: string;
    /**
     * The line over those two buttons: "4 of 5, not saved yet" [kpadopt6]
     */
    ratingPending: (value: number, max: number) => string;
    /**
     * What a screen reader hears on a row that cannot be changed by this person [kpadopt6]
     */
    ratingReadonly: string;
};
/**
 * @typedef {object} DiffRatingStrings
 * @property {string} diffLabel  The diff view's accessible name when it has none (js/diff.js) [gap-diff-view]
 * @property {(files: number) => string} diffSummary  The bar's count of files: "3 files changed" (js/diff.js) [gap-diff-view]
 * @property {string} diffExpandAll  The button that opens every file (js/diff.js) [gap-diff-view]
 * @property {string} diffCollapseAll  The button that closes every file (js/diff.js) [gap-diff-view]
 * @property {string} diffAllOpen  Why Expand all is off: every file is already open (js/diff.js) [gap-diff-view]
 * @property {string} diffAllClosed  Why Collapse all is off: every file is already closed (js/diff.js) [gap-diff-view]
 * @property {string} diffStatusAdded  The badge of a new file (js/diff.js) [gap-diff-view]
 * @property {string} diffStatusRemoved  The badge of a deleted file (js/diff.js) [gap-diff-view]
 * @property {string} diffStatusModified  The badge of a changed file (js/diff.js) [gap-diff-view]
 * @property {string} diffStatusRenamed  The badge of a moved file (js/diff.js) [gap-diff-view]
 * @property {string} diffStatusBinary  The badge of a file that is not text (js/diff.js) [gap-diff-view]
 * @property {(from: string) => string} diffRenamedFrom  A renamed file's path for a screen reader: "renamed from old/path" (js/diff.js) [gap-diff-view]
 * @property {(n: number) => string} diffAddedCount  The +N count for a screen reader: "3 lines added" (js/diff.js) [gap-diff-view]
 * @property {(n: number) => string} diffRemovedCount  The -M count for a screen reader: "1 line removed" (js/diff.js) [gap-diff-view]
 * @property {(n: number) => string} diffUnchanged  The folded context row: "12 unchanged lines" (js/diff.js) [gap-diff-view]
 * @property {(n: number) => string} diffUnchangedName  That row's accessible name: "Show 12 unchanged lines" (js/diff.js) [gap-diff-view]
 * @property {(n: number) => string} diffUnchangedHide  The same row once opened: "Hide 12 unchanged lines" (js/diff.js) [gap-diff-view]
 * @property {(n: number) => string} diffUnchangedShown  Said politely after a fold opened: "12 unchanged lines shown" (js/diff.js) [gap-diff-view]
 * @property {(n: number) => string} diffUnchangedHidden  Said politely after a fold closed: "12 unchanged lines hidden" (js/diff.js) [gap-diff-view]
 * @property {(n: number) => string} diffShowMore  The row that shows the lines past the file's limit: "Show the other 1240 lines" (js/diff.js) [gap-diff-view]
 * @property {string} diffBinaryTitle  The heading of a file that is not text (js/diff.js) [gap-diff-view]
 * @property {string} diffBinaryText  Its sentence (js/diff.js) [gap-diff-view]
 * @property {string} diffNoLines  A file with no line changes (a rename or a mode change) (js/diff.js) [gap-diff-view]
 * @property {(path: string) => string} diffChangesIn  A file's body name: "Changes in stacks/media/compose.yml" (js/diff.js) [gap-diff-view]
 * @property {string} diffCopyPath  The Copy path button (js/diff.js) [gap-diff-view]
 * @property {string} diffCopied  Its result word (js/diff.js) [gap-diff-view]
 * @property {string} diffCopyFailed  Its refusal word (js/diff.js) [gap-diff-view]
 * @property {string} diffLoading  The words under the busy card while the changes are read (js/diff.js) [gap-diff-view]
 * @property {(files: number, added: number, removed: number) => string} diffReady  Said politely when the changes are drawn (js/diff.js) [gap-diff-view]
 * @property {string} diffEmptyTitle  The empty plate's heading (js/diff.js) [gap-diff-view]
 * @property {string} diffEmptyText  Its sentence (js/diff.js) [gap-diff-view]
 * @property {(name: string) => string} diffEmptySame  Its sentence when one name was compared: "compose.yml is the same on both sides." (js/diff.js) [gap-diff-view]
 * @property {(from: string, to: string) => string} diffEmptyBetween  Its sentence when two names were compared (js/diff.js) [gap-diff-view]
 * @property {string} diffFailedTitle  The failed plate's heading (js/diff.js) [gap-diff-view]
 * @property {string} diffFailedText  Its sentence (js/diff.js) [gap-diff-view]
 * @property {string} diffRetry  The failed plate's button (js/diff.js) [gap-diff-view]
 * @property {(item: string) => string} ratingGroupName  The star row's name for a screen reader: "Rating for Lasagne" (js/rating.js) [kpadopt6]
 * @property {string} ratingGroupNameBare  The same when the row names no item [kpadopt6]
 * @property {(n: number, max: number) => string} ratingStarName  One star's name: "4 of 5" [kpadopt6]
 * @property {(n: number, max: number, label: string) => string} ratingStarNameLabel  The same with its word: "4 of 5, Good" [kpadopt6]
 * @property {(value: number, max: number) => string} ratingRated  A display row's name: "Rated 4 of 5" [kpadopt6]
 * @property {(value: number, max: number, count: number) => string} ratingRatedCount  The same with how many people rated: "Rated 4.5 of 5 by 12 people" [kpadopt6]
 * @property {string} ratingUnrated  The line, and the name, of a row nobody has rated: "Not rated yet" [kpadopt6]
 * @property {string} ratingTap  The caption of an input row with no rating: "Tap a star" [kpadopt6]
 * @property {string} ratingClear  The small button that removes the rating [kpadopt6]
 * @property {(item: string) => string} ratingClearName  That button's accessible name: "Clear the rating for Lasagne" [kpadopt6]
 * @property {(value: number, max: number) => string} ratingOutOf  The caption of a rated row without words per level: "4 of 5" [kpadopt6]
 * @property {(value: number, count: number) => string} ratingAverage  An aggregated score: "4.5 (12)" [kpadopt6]
 * @property {(item: string, value: number, max: number) => string} ratingAnnounce  What is said when the rating changes: "Lasagne: 4 of 5" [kpadopt6]
 * @property {(item: string) => string} ratingAnnounceCleared  What is said when the rating is removed: "Lasagne: rating removed" [kpadopt6]
 * @property {(item: string, value: number) => string} ratingToast  The undo toast's line: "Lasagne: 4 stars" [kpadopt6]
 * @property {(item: string) => string} ratingToastCleared  The undo toast's line after Clear [kpadopt6]
 * @property {string} ratingLoading  The row's name while the saved value is read [kpadopt6]
 * @property {string} ratingFailedRead  The words that replace the stars when the value could not be read [kpadopt6]
 * @property {string} ratingRetry  Its button [kpadopt6]
 * @property {(item: string) => string} ratingSaveFailed  The line under the row when a save was refused: "Could not save the rating for Lasagne" [kpadopt6]
 * @property {string} ratingSaving  The row's description while a save is on its way [kpadopt6]
 * @property {string} ratingConfirm  The button that saves a pending rating (commit confirm) [kpadopt6]
 * @property {string} ratingCancel  The button that drops a pending rating [kpadopt6]
 * @property {(value: number, max: number) => string} ratingPending  The line over those two buttons: "4 of 5, not saved yet" [kpadopt6]
 * @property {string} ratingReadonly  What a screen reader hears on a row that cannot be changed by this person [kpadopt6]
 */
/** @type {DiffRatingStrings} */
export declare const DIFF_RATING_STRINGS: DiffRatingStrings;
