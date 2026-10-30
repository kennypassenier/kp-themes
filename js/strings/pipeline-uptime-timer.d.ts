export type PipelineUptimeTimerStrings = {
    /**
     * The words on a pipeline's loading card (js/pipeline.js) [kpadopt4]
     */
    pipelineLoading: string;
    /**
     * The sentence over a pipeline with no cards, when the page gives none
     */
    pipelineEmpty: string;
    /**
     * The sentence over a pipeline that could not be read
     */
    pipelineFailed: (reason: string) => string;
    /**
     * Its Try again button
     */
    pipelineRetry: string;
    /**
     * The word on a failing lane's name plate (`danger: true`), so the colour is never the only carrier [r1r2-1019]
     */
    pipelineDanger: string;
    /**
     * The word in a lane with no cards
     */
    pipelineNone: string;
    /**
     * The button under a lane's first cards, "+4 more"
     */
    pipelineMore: (more: number) => string;
    /**
     * The same button while the lane shows every card
     */
    pipelineLess: string;
    /**
     * A lane's share of all cards, "25 % of all"
     */
    pipelineShare: (percent: number) => string;
    /**
     * The uptime strip's busy card and its summary while the history is read (js/uptime.js) [kpadopt4-ideas]
     */
    uptimeLoading: string;
    /**
     * Its summary when no period has data yet [kpadopt4-ideas]
     */
    uptimeEmpty: string;
    /**
     * Its summary when the history could not be read and the page gave no sentence [kpadopt4-ideas]
     */
    uptimeError: string;
    /**
     * The window's share up, from "99.4" to "99.4%" [kpadopt4-ideas]
     */
    uptimePercent: (percent: string) => string;
    /**
     * The window's incident count, exact: "1 incident", "12 incidents" [kpadopt4-ideas]
     */
    uptimeIncidents: (n: number) => string;
    /**
     * The summary as one sentence, for a screen reader [kpadopt4-ideas]
     */
    uptimeSummary: (percent: string, incidents: number) => string;
    /**
     * The strip's name: its title and its summary [kpadopt4-ideas]
     */
    uptimeTrack: (label: string, summary: string) => string;
    /**
     * A period's state as a word: up, degraded, down, no data [kpadopt4-ideas]
     */
    uptimeStateWord: (state: string) => string;
    /**
     * A cell's name and hover card: its period, its state and its figures [kpadopt4-ideas]
     */
    uptimeCell: (label: string, state: string, percent: string | null, incidents: number | null) => string;
    /**
     * Under a strip too narrow for every cell: "55 of 90 shown" [kpadopt4-ideas]
     */
    uptimeShown: (shown: number, total: number) => string;
    /**
     * A period's figures in its quick info: "99.4% up · 1 incident" [kpadopt4 r2]
     */
    uptimeInfoFigures: (percent: string | null, incidents: number | null) => string;
    /**
     * The link in a period's quick info to the period's own page: "Open 14/10/2026" [kpadopt4 r2]
     */
    uptimeOpen: (label: string) => string;
    /**
     * The typed confirmation's label; the name is set in as code where this sentence puts it (js/components.js) [kpadopt4-ideas]
     */
    typeConfirmLabel: (name: string) => string;
    /**
     * Its rule when capitals count [kpadopt4-ideas]
     */
    typeConfirmRuleExact: string;
    /**
     * Its rule when capitals do not count (`data-kp-confirm-case="any"`) [kpadopt4-ideas]
     */
    typeConfirmRuleAnyCase: string;
    /**
     * The badge once the typed name matches [kpadopt4-ideas]
     */
    typeConfirmMatched: string;
    /**
     * The line while what is typed does not match yet [kpadopt4-ideas]
     */
    typeConfirmMismatch: string;
    /**
     * The heading over what the action will delete [kpadopt4-ideas]
     */
    typeConfirmLoses: string;
    /**
     * A command block's terminal by its key: WSL, PowerShell, cmd, Garuda, bash; another key as written (js/command.js) [kpadopt4-ideas]
     */
    commandShell: (shell: string) => string;
    /**
     * The badge of a Windows command that needs a terminal opened as administrator [kpadopt4-ideas]
     */
    commandAdmin: string;
    /**
     * Its tooltip [kpadopt4-ideas]
     */
    commandAdminTitle: string;
    /**
     * The badge of a Linux command that runs with root rights [kpadopt4-ideas]
     */
    commandSudo: string;
    /**
     * Its tooltip [kpadopt4-ideas]
     */
    commandSudoTitle: string;
    /**
     * The note under a command that says where it runs [kpadopt4-ideas]
     */
    commandRunsOn: (where: string) => string;
    /**
     * A timer's Start button (js/countdown.js, js/timer-disc.js) [kpadopt4-ideas]
     */
    timerStart: string;
    /**
     * The same button while it runs [kpadopt4-ideas]
     */
    timerPause: string;
    /**
     * The same button while it is paused [kpadopt4-ideas]
     */
    timerResume: string;
    /**
     * A timer's Reset button [kpadopt4-ideas]
     */
    timerReset: string;
    /**
     * The countdown's button that adds time: "+1 min" [kpadopt4-ideas]
     */
    timerAddMinute: (seconds: number) => string;
    /**
     * Its tooltip: "Add 1 min" [kpadopt4-ideas]
     */
    timerAddMinuteTitle: (seconds: number) => string;
    /**
     * The line under a paused timer, and what a screen reader hears [kpadopt4-ideas]
     */
    timerPaused: string;
    /**
     * The line under a timer whose time is up [kpadopt4-ideas]
     */
    timerEnded: string;
    /**
     * What a screen reader hears when a named timer ends [kpadopt4-ideas]
     */
    timerEndedNamed: (name: string) => string;
    /**
     * What a screen reader hears when a timer starts [kpadopt4-ideas]
     */
    timerStarted: string;
    /**
     * What a screen reader hears when it goes on after a pause [kpadopt4-ideas]
     */
    timerResumed: string;
    /**
     * The countdown's time left for a screen reader: "25 min left" [kpadopt4-ideas]
     */
    timerLeft: (duration: string) => string;
    /**
     * A timer's length in words: "25 min", "1 h 30 min", "45 s" [kpadopt4-ideas]
     */
    timerDuration: (seconds: number) => string;
    /**
     * The visual timer's face for a screen reader: "12 min left of 25 min" [kpadopt4-ideas]
     */
    timerDiscLeft: (left: string, total: string) => string;
    /**
     * The time left on the face in its last minute [kpadopt4-ideas]
     */
    timerUnderMinute: string;
    /**
     * The still line under the disc: "Focus · 25 min" [kpadopt4-ideas]
     */
    timerDiscCaption: (name: string, duration: string) => string;
    /**
     * The still line of a timer that counts down to a moment: "until 14:30" [gaps-time-1019]
     */
    timerUntil: (when: string) => string;
    /**
     * A countdown of 24 hours or more, "6 d 22 h" (js/countdown.js) [wish-1120]
     */
    countdownDays: (days: number, hours: number) => string;
};
/**
 * @typedef {object} PipelineUptimeTimerStrings
 * @property {string} pipelineLoading  The words on a pipeline's loading card (js/pipeline.js) [kpadopt4]
 * @property {string} pipelineEmpty  The sentence over a pipeline with no cards, when the page gives none
 * @property {(reason: string) => string} pipelineFailed  The sentence over a pipeline that could not be read
 * @property {string} pipelineRetry  Its Try again button
 * @property {string} pipelineDanger  The word on a failing lane's name plate (`danger: true`), so the colour is never the only carrier [r1r2-1019]
 * @property {string} pipelineNone  The word in a lane with no cards
 * @property {(more: number) => string} pipelineMore  The button under a lane's first cards, "+4 more"
 * @property {string} pipelineLess  The same button while the lane shows every card
 * @property {(percent: number) => string} pipelineShare  A lane's share of all cards, "25 % of all"
 * @property {string} uptimeLoading  The uptime strip's busy card and its summary while the history is read (js/uptime.js) [kpadopt4-ideas]
 * @property {string} uptimeEmpty  Its summary when no period has data yet [kpadopt4-ideas]
 * @property {string} uptimeError  Its summary when the history could not be read and the page gave no sentence [kpadopt4-ideas]
 * @property {(percent: string) => string} uptimePercent  The window's share up, from "99.4" to "99.4%" [kpadopt4-ideas]
 * @property {(n: number) => string} uptimeIncidents  The window's incident count, exact: "1 incident", "12 incidents" [kpadopt4-ideas]
 * @property {(percent: string, incidents: number) => string} uptimeSummary  The summary as one sentence, for a screen reader [kpadopt4-ideas]
 * @property {(label: string, summary: string) => string} uptimeTrack  The strip's name: its title and its summary [kpadopt4-ideas]
 * @property {(state: string) => string} uptimeStateWord  A period's state as a word: up, degraded, down, no data [kpadopt4-ideas]
 * @property {(label: string, state: string, percent: string | null, incidents: number | null) => string} uptimeCell  A cell's name and hover card: its period, its state and its figures [kpadopt4-ideas]
 * @property {(shown: number, total: number) => string} uptimeShown  Under a strip too narrow for every cell: "55 of 90 shown" [kpadopt4-ideas]
 * @property {(percent: string | null, incidents: number | null) => string} uptimeInfoFigures  A period's figures in its quick info: "99.4% up · 1 incident" [kpadopt4 r2]
 * @property {(label: string) => string} uptimeOpen  The link in a period's quick info to the period's own page: "Open 14/10/2026" [kpadopt4 r2]
 * @property {(name: string) => string} typeConfirmLabel  The typed confirmation's label; the name is set in as code where this sentence puts it (js/components.js) [kpadopt4-ideas]
 * @property {string} typeConfirmRuleExact  Its rule when capitals count [kpadopt4-ideas]
 * @property {string} typeConfirmRuleAnyCase  Its rule when capitals do not count (`data-kp-confirm-case="any"`) [kpadopt4-ideas]
 * @property {string} typeConfirmMatched  The badge once the typed name matches [kpadopt4-ideas]
 * @property {string} typeConfirmMismatch  The line while what is typed does not match yet [kpadopt4-ideas]
 * @property {string} typeConfirmLoses  The heading over what the action will delete [kpadopt4-ideas]
 * @property {(shell: string) => string} commandShell  A command block's terminal by its key: WSL, PowerShell, cmd, Garuda, bash; another key as written (js/command.js) [kpadopt4-ideas]
 * @property {string} commandAdmin  The badge of a Windows command that needs a terminal opened as administrator [kpadopt4-ideas]
 * @property {string} commandAdminTitle  Its tooltip [kpadopt4-ideas]
 * @property {string} commandSudo  The badge of a Linux command that runs with root rights [kpadopt4-ideas]
 * @property {string} commandSudoTitle  Its tooltip [kpadopt4-ideas]
 * @property {(where: string) => string} commandRunsOn  The note under a command that says where it runs [kpadopt4-ideas]
 * @property {string} timerStart  A timer's Start button (js/countdown.js, js/timer-disc.js) [kpadopt4-ideas]
 * @property {string} timerPause  The same button while it runs [kpadopt4-ideas]
 * @property {string} timerResume  The same button while it is paused [kpadopt4-ideas]
 * @property {string} timerReset  A timer's Reset button [kpadopt4-ideas]
 * @property {(seconds: number) => string} timerAddMinute  The countdown's button that adds time: "+1 min" [kpadopt4-ideas]
 * @property {(seconds: number) => string} timerAddMinuteTitle  Its tooltip: "Add 1 min" [kpadopt4-ideas]
 * @property {string} timerPaused  The line under a paused timer, and what a screen reader hears [kpadopt4-ideas]
 * @property {string} timerEnded  The line under a timer whose time is up [kpadopt4-ideas]
 * @property {(name: string) => string} timerEndedNamed  What a screen reader hears when a named timer ends [kpadopt4-ideas]
 * @property {string} timerStarted  What a screen reader hears when a timer starts [kpadopt4-ideas]
 * @property {string} timerResumed  What a screen reader hears when it goes on after a pause [kpadopt4-ideas]
 * @property {(duration: string) => string} timerLeft  The countdown's time left for a screen reader: "25 min left" [kpadopt4-ideas]
 * @property {(seconds: number) => string} timerDuration  A timer's length in words: "25 min", "1 h 30 min", "45 s" [kpadopt4-ideas]
 * @property {(left: string, total: string) => string} timerDiscLeft  The visual timer's face for a screen reader: "12 min left of 25 min" [kpadopt4-ideas]
 * @property {string} timerUnderMinute  The time left on the face in its last minute [kpadopt4-ideas]
 * @property {(name: string, duration: string) => string} timerDiscCaption  The still line under the disc: "Focus · 25 min" [kpadopt4-ideas]
 * @property {(when: string) => string} timerUntil  The still line of a timer that counts down to a moment: "until 14:30" [gaps-time-1019]
 * @property {(days: number, hours: number) => string} countdownDays  A countdown of 24 hours or more, "6 d 22 h" (js/countdown.js) [wish-1120]
 */
/** @type {PipelineUptimeTimerStrings} */
export declare const PIPELINE_UPTIME_TIMER_STRINGS: PipelineUptimeTimerStrings;
