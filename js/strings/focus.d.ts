export type FocusStrings = {
    /**
     * The count over a question: "Question 3 of 7" (js/focus-steps.js, answer mode) [kpadopt6]
     */
    focusQuestionCount: (n: number, total: number) => string;
    /**
     * What a screen reader hears after an answer: "Answered Matig. Question 4 of 7" [kpadopt6]
     */
    focusAnswered: (label: string, n: number, total: number) => string;
    /**
     * The button that repeats yesterday's answer: "Same as yesterday: Matig" [kpadopt6]
     */
    focusSameYesterday: (label: string) => string;
    /**
     * The button that takes the usual answer: "Same as usual: Goed" [kpadopt6]
     */
    focusSameUsual: (label: string) => string;
    /**
     * The button that passes a question: "Not today" [kpadopt6]
     */
    focusSkip: string;
    /**
     * What a skipped question reads as in the summary [kpadopt6]
     */
    focusSkipped: string;
    /**
     * The next button on the last question when a summary follows [kpadopt6]
     */
    focusReview: string;
    /**
     * The summary screen's name [kpadopt6]
     */
    focusSummaryTitle: string;
    /**
     * The line under a question that takes several answers [kpadopt6]
     */
    focusMultiHint: string;
    /**
     * The name of the box of a written answer [kpadopt6]
     */
    focusTextLabel: string;
    /**
     * The word a chosen answer carries for a screen reader besides the mark [kpadopt6]
     */
    focusPickedMark: string;
    /**
     * The question when a check-in was left half way: "Continue where you stopped?" [kpadopt6]
     */
    focusResumeAsk: string;
    /**
     * Its yes [kpadopt6]
     */
    focusResumeContinue: string;
    /**
     * Its start over [kpadopt6]
     */
    focusResumeRestart: string;
    /**
     * What is said when answers are put back: "Back at question 4" [kpadopt6]
     */
    focusResumed: (n: number) => string;
    /**
     * The plate of a day with no questions [kpadopt6]
     */
    focusAnswerEmptyTitle: string;
    /**
     * Its sentence: nothing is waiting [kpadopt6]
     */
    focusAnswerEmptyText: string;
    /**
     * The plate of questions that could not be read [kpadopt6]
     */
    focusAnswerFailedTitle: string;
    /**
     * Its sentence [kpadopt6]
     */
    focusAnswerFailedText: string;
    /**
     * Its button [kpadopt6]
     */
    focusRetry: string;
    /**
     * The plate when the finished answers could not be saved [kpadopt6]
     */
    focusSaveFailedTitle: string;
    /**
     * Its sentence: nothing is lost [kpadopt6]
     */
    focusSaveFailedText: string;
    /**
     * Its button: "Try again" [kpadopt6]
     */
    focusSaveRetry: string;
    /**
     * The words under the loading card of the questions [kpadopt6]
     */
    focusAnswerLoading: string;
    /**
     * The plate of a recipe with no steps (js/focus-steps.js, read mode) [focus-tracks-1019]
     */
    focusReadEmptyTitle: string;
    /**
     * The plate of steps that could not be loaded [focus-tracks-1019]
     */
    focusReadFailedTitle: string;
    /**
     * Its sentence when the page gave no message [focus-tracks-1019]
     */
    focusReadFailedText: string;
    /**
     * The name of the lane of steps that belong to no track: "Together" [focus-tracks-1019]
     */
    focusTrackShared: string;
    /**
     * The heading over the lanes: "Tracks" [focus-tracks-1019]
     */
    focusTracksTitle: string;
    /**
     * The line under the lanes saying how to switch [focus-tracks-1019]
     */
    focusTracksHint: string;
    /**
     * The lanes' total: "5 of 9 steps done" [focus-tracks-1019]
     */
    focusTracksDone: (n: number, total: number) => string;
    /**
     * The count over a step on a track: "Pasta: step 2 of 4" [focus-tracks-1019]
     */
    focusTrackCount: (track: string, n: number, total: number) => string;
    /**
     * A step with no title, by place: "Pasta, step 2" [focus-tracks-1019]
     */
    focusTrackStepName: (track: string, n: number) => string;
    /**
     * A lane's place on its track: "Step 2 of 4" [focus-tracks-1019]
     */
    focusLaneStep: (n: number, total: number) => string;
    /**
     * A lane's state word for the track you are on [focus-tracks-1019]
     */
    focusLaneHere: string;
    /**
     * A lane's state word for a track that can go on [focus-tracks-1019]
     */
    focusLaneReady: string;
    /**
     * A lane's state word while its timer runs: "Water running" [focus-tracks-1019]
     */
    focusLaneRunning: (timer: string) => string;
    /**
     * A lane's state word while its timer is paused [focus-tracks-1019]
     */
    focusLanePaused: (timer: string) => string;
    /**
     * A lane's state word while it waits: "Waiting for Sauce" [focus-tracks-1019]
     */
    focusLaneWaiting: (names: string) => string;
    /**
     * A lane's state word when its timer has ended: "Time is up" [focus-tracks-1019]
     */
    focusLaneRinging: string;
    /**
     * A lane's state word when its track is done [focus-tracks-1019]
     */
    focusLaneFinished: string;
    /**
     * The name of the band over the step that lists the tracks asking for you [focus-tracks-1019]
     */
    focusTrackBand: string;
    /**
     * The band's line when a step timer ended: "Water is done (Pasta)" [focus-tracks-1019]
     */
    focusTrackTimerDone: (timer: string, track: string) => string;
    /**
     * The band's line when a waiting track can go on: "Pasta can go on" [focus-tracks-1019]
     */
    focusTrackReadyTitle: (track: string) => string;
    /**
     * Its sentence: "Next: Add the spaghetti" [focus-tracks-1019]
     */
    focusTrackNextUp: (step: string) => string;
    /**
     * Its sentence when the track has no step left [focus-tracks-1019]
     */
    focusTrackNothingLeft: (track: string) => string;
    /**
     * The button that goes to a track: "Go to Pasta" [focus-tracks-1019]
     */
    focusTrackGo: (track: string) => string;
    /**
     * The band's button for the track you are on [focus-tracks-1019]
     */
    focusTrackGotIt: string;
    /**
     * The title of a step that waits: "Waiting for Boil the water" [focus-tracks-1019]
     */
    focusTrackWaitTitle: (what: string) => string;
    /**
     * What a step waits for, with the time left: "07:12 left" [focus-tracks-1019]
     */
    focusTrackWaitLeft: (clock: string) => string;
    /**
     * What a step waits for, with no clock: "not done yet" [focus-tracks-1019]
     */
    focusTrackWaitOpen: string;
    /**
     * The plate of a track with no step left: "Pasta is done" [focus-tracks-1019]
     */
    focusTrackFinishedTitle: (track: string) => string;
    /**
     * Its sentence [focus-tracks-1019]
     */
    focusTrackFinishedText: string;
    /**
     * Its sentence when another track can go on: "Sauce is ready for you" [focus-tracks-1019]
     */
    focusTrackFinishedNext: (next: string) => string;
    /**
     * The next button on the last step of a track: "Finish Pasta" [focus-tracks-1019]
     */
    focusTrackFinish: (track: string) => string;
    /**
     * What a screen reader hears after a switch of track [focus-tracks-1019]
     */
    focusTrackSwitched: (track: string, place: string, text: string) => string;
    /**
     * What a screen reader hears when the step you are on stops waiting [focus-tracks-1019]
     */
    focusTrackUnlocked: (step: string) => string;
    /**
     * A step's timer button while its timer runs: "Timer running · 07:12" [focus-tracks-1019]
     */
    focusTimerRunning: (clock: string) => string;
    /**
     * The same while it is paused [focus-tracks-1019]
     */
    focusTimerPaused: (clock: string) => string;
    /**
     * The same when it ended [focus-tracks-1019]
     */
    focusTimerDone: string;
    /**
     * The shortcut sheet's line for T [focus-tracks-1019]
     */
    focusTrackKeyNext: string;
    /**
     * The shortcut sheet's line for Shift T [focus-tracks-1019]
     */
    focusTrackKeyPrevious: string;
    /**
     * The label over the usual band of a picker (js/usual-picker.js) [kpadopt6]
     */
    usualLabel: string;
};
/**
 * @typedef {object} FocusStrings
 * @property {(n: number, total: number) => string} focusQuestionCount  The count over a question: "Question 3 of 7" (js/focus-steps.js, answer mode) [kpadopt6]
 * @property {(label: string, n: number, total: number) => string} focusAnswered  What a screen reader hears after an answer: "Answered Matig. Question 4 of 7" [kpadopt6]
 * @property {(label: string) => string} focusSameYesterday  The button that repeats yesterday's answer: "Same as yesterday: Matig" [kpadopt6]
 * @property {(label: string) => string} focusSameUsual  The button that takes the usual answer: "Same as usual: Goed" [kpadopt6]
 * @property {string} focusSkip  The button that passes a question: "Not today" [kpadopt6]
 * @property {string} focusSkipped  What a skipped question reads as in the summary [kpadopt6]
 * @property {string} focusReview  The next button on the last question when a summary follows [kpadopt6]
 * @property {string} focusSummaryTitle  The summary screen's name [kpadopt6]
 * @property {string} focusMultiHint  The line under a question that takes several answers [kpadopt6]
 * @property {string} focusTextLabel  The name of the box of a written answer [kpadopt6]
 * @property {string} focusPickedMark  The word a chosen answer carries for a screen reader besides the mark [kpadopt6]
 * @property {string} focusResumeAsk  The question when a check-in was left half way: "Continue where you stopped?" [kpadopt6]
 * @property {string} focusResumeContinue  Its yes [kpadopt6]
 * @property {string} focusResumeRestart  Its start over [kpadopt6]
 * @property {(n: number) => string} focusResumed  What is said when answers are put back: "Back at question 4" [kpadopt6]
 * @property {string} focusAnswerEmptyTitle  The plate of a day with no questions [kpadopt6]
 * @property {string} focusAnswerEmptyText  Its sentence: nothing is waiting [kpadopt6]
 * @property {string} focusAnswerFailedTitle  The plate of questions that could not be read [kpadopt6]
 * @property {string} focusAnswerFailedText  Its sentence [kpadopt6]
 * @property {string} focusRetry  Its button [kpadopt6]
 * @property {string} focusSaveFailedTitle  The plate when the finished answers could not be saved [kpadopt6]
 * @property {string} focusSaveFailedText  Its sentence: nothing is lost [kpadopt6]
 * @property {string} focusSaveRetry  Its button: "Try again" [kpadopt6]
 * @property {string} focusAnswerLoading  The words under the loading card of the questions [kpadopt6]
 * @property {string} focusReadEmptyTitle  The plate of a recipe with no steps (js/focus-steps.js, read mode) [focus-tracks-1019]
 * @property {string} focusReadFailedTitle  The plate of steps that could not be loaded [focus-tracks-1019]
 * @property {string} focusReadFailedText  Its sentence when the page gave no message [focus-tracks-1019]
 * @property {string} focusTrackShared  The name of the lane of steps that belong to no track: "Together" [focus-tracks-1019]
 * @property {string} focusTracksTitle  The heading over the lanes: "Tracks" [focus-tracks-1019]
 * @property {string} focusTracksHint  The line under the lanes saying how to switch [focus-tracks-1019]
 * @property {(n: number, total: number) => string} focusTracksDone  The lanes' total: "5 of 9 steps done" [focus-tracks-1019]
 * @property {(track: string, n: number, total: number) => string} focusTrackCount  The count over a step on a track: "Pasta: step 2 of 4" [focus-tracks-1019]
 * @property {(track: string, n: number) => string} focusTrackStepName  A step with no title, by place: "Pasta, step 2" [focus-tracks-1019]
 * @property {(n: number, total: number) => string} focusLaneStep  A lane's place on its track: "Step 2 of 4" [focus-tracks-1019]
 * @property {string} focusLaneHere  A lane's state word for the track you are on [focus-tracks-1019]
 * @property {string} focusLaneReady  A lane's state word for a track that can go on [focus-tracks-1019]
 * @property {(timer: string) => string} focusLaneRunning  A lane's state word while its timer runs: "Water running" [focus-tracks-1019]
 * @property {(timer: string) => string} focusLanePaused  A lane's state word while its timer is paused [focus-tracks-1019]
 * @property {(names: string) => string} focusLaneWaiting  A lane's state word while it waits: "Waiting for Sauce" [focus-tracks-1019]
 * @property {string} focusLaneRinging  A lane's state word when its timer has ended: "Time is up" [focus-tracks-1019]
 * @property {string} focusLaneFinished  A lane's state word when its track is done [focus-tracks-1019]
 * @property {string} focusTrackBand  The name of the band over the step that lists the tracks asking for you [focus-tracks-1019]
 * @property {(timer: string, track: string) => string} focusTrackTimerDone  The band's line when a step timer ended: "Water is done (Pasta)" [focus-tracks-1019]
 * @property {(track: string) => string} focusTrackReadyTitle  The band's line when a waiting track can go on: "Pasta can go on" [focus-tracks-1019]
 * @property {(step: string) => string} focusTrackNextUp  Its sentence: "Next: Add the spaghetti" [focus-tracks-1019]
 * @property {(track: string) => string} focusTrackNothingLeft  Its sentence when the track has no step left [focus-tracks-1019]
 * @property {(track: string) => string} focusTrackGo  The button that goes to a track: "Go to Pasta" [focus-tracks-1019]
 * @property {string} focusTrackGotIt  The band's button for the track you are on [focus-tracks-1019]
 * @property {(what: string) => string} focusTrackWaitTitle  The title of a step that waits: "Waiting for Boil the water" [focus-tracks-1019]
 * @property {(clock: string) => string} focusTrackWaitLeft  What a step waits for, with the time left: "07:12 left" [focus-tracks-1019]
 * @property {string} focusTrackWaitOpen  What a step waits for, with no clock: "not done yet" [focus-tracks-1019]
 * @property {(track: string) => string} focusTrackFinishedTitle  The plate of a track with no step left: "Pasta is done" [focus-tracks-1019]
 * @property {string} focusTrackFinishedText  Its sentence [focus-tracks-1019]
 * @property {(next: string) => string} focusTrackFinishedNext  Its sentence when another track can go on: "Sauce is ready for you" [focus-tracks-1019]
 * @property {(track: string) => string} focusTrackFinish  The next button on the last step of a track: "Finish Pasta" [focus-tracks-1019]
 * @property {(track: string, place: string, text: string) => string} focusTrackSwitched  What a screen reader hears after a switch of track [focus-tracks-1019]
 * @property {(step: string) => string} focusTrackUnlocked  What a screen reader hears when the step you are on stops waiting [focus-tracks-1019]
 * @property {(clock: string) => string} focusTimerRunning  A step's timer button while its timer runs: "Timer running · 07:12" [focus-tracks-1019]
 * @property {(clock: string) => string} focusTimerPaused  The same while it is paused [focus-tracks-1019]
 * @property {string} focusTimerDone  The same when it ended [focus-tracks-1019]
 * @property {string} focusTrackKeyNext  The shortcut sheet's line for T [focus-tracks-1019]
 * @property {string} focusTrackKeyPrevious  The shortcut sheet's line for Shift T [focus-tracks-1019]
 * @property {string} usualLabel  The label over the usual band of a picker (js/usual-picker.js) [kpadopt6]
 */
/** @type {FocusStrings} */
export declare const FOCUS_STRINGS: FocusStrings;
