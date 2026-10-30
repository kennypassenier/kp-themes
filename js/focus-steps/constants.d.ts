export declare const FOCUS_STEPS = "[data-kp-focus-steps]";
export declare const FOCUS_STEPS_EVENT = "kp-focus-steps-change";
export declare const FOCUS_STEPS_DONE_EVENT = "kp-focus-steps-done";
export declare const FOCUS_STEPS_WAKE_EVENT = "kp-focus-steps-wake";
/** Fired on the root, cancelable, before an answer is taken: `{ index, id, value, source }`. */
export declare const FOCUS_STEPS_BEFORE_ANSWER_EVENT = "kp-focus-steps-before-answer";
/** Fired on the root when a question was answered: `{ index, id, value, source: 'tap' | 'same' | 'skip', same?, previous }`. */
export declare const FOCUS_STEPS_ANSWER_EVENT = "kp-focus-steps-answer";
/** Fired on the root when answers were put back after a break: `{ index, answers }`. */
export declare const FOCUS_STEPS_RESUME_EVENT = "kp-focus-steps-resume";
/** Fired on the root when Retry is pressed on the plate of questions that could not be read. */
export declare const FOCUS_STEPS_RETRY_EVENT = "kp-focus-steps-retry";
/** Fired on the root when the action of the empty plate (`data-kp-focus-steps-empty-action`) is pressed [gaps-time-1019]. */
export declare const FOCUS_STEPS_EMPTY_ACTION_EVENT = "kp-focus-steps-empty-action";
/** Fired on the root when Try again is pressed on the plate of answers that could not be saved. */
export declare const FOCUS_STEPS_SAVE_RETRY_EVENT = "kp-focus-steps-save-retry";
/** Fired on the root when the active track changed: `{ track, key, from, index, step, reason }`. */
export declare const FOCUS_STEPS_TRACK_EVENT = "kp-focus-steps-track";
/** Fired on the root when a track asks for the person: `{ track, key, reason: 'timer' | 'ready', index }`. */
export declare const FOCUS_STEPS_TRACK_ATTENTION_EVENT = "kp-focus-steps-track-attention";
/** How far a finger has to travel across the step to turn it [px]. */
export declare const SWIPE_DISTANCE = 56;
export type FocusIngredient = {
    name: string;
    amount?: string;
};
export type FocusChoice = {
    value: string;
    label: string;
    disabled?: boolean;
    /**
     * why it cannot be picked, shown under its label
     */
    reason?: string;
};
export type FocusAnswer = {
    /**
     * names the answer in the events and the done payload
     */
    id: string;
    kind: 'choice' | 'multi' | 'text';
    choices?: FocusChoice[];
    /**
     * yesterday's answer: offered as "Same as yesterday"
     */
    previous?: string | string[];
    /**
     * the usual answer: offered as "Same as usual"
     */
    usual?: string | string[];
    /**
     * a text box's hint
     */
    placeholder?: string;
};
export type FocusStep = {
    text: string;
    /**
     * makes the step a question
     */
    answer?: FocusAnswer;
    ingredients?: (FocusIngredient | string)[];
    /**
     * `id` names the timer in the timer list (default: the step's `id`)
     */
    timer?: {
        seconds: number;
        name?: string;
        id?: string;
    };
    /**
     * names the step for `waitFor` and for its timer (default `step-<n>`)
     */
    id?: string;
    /**
     * the line of work it belongs to ("Pasta"); steps with none belong to the shared lane
     */
    track?: string;
    /**
     * a short name for the step, used in the lanes and where another step waits for it
     */
    title?: string;
    /**
     * step ids, or track names, that must be done before this step can start
     */
    waitFor?: string | string[];
    /**
     * the same as `waitFor`
     */
    after?: string | string[];
    note?: string;
    noteTone?: 'info' | 'warning';
};
export type FocusState = {
    steps: FocusStep[];
    index: number;
    wake: WakeLockSentinel | null;
    wakeState: string;
    busy: import('../busy-card.js').BusyCard | null;
    answers: Record<string, {
        value: string | string[] | null;
        source: string;
    }>;
    /**
     * the taps of a multi step and the words of a text step, before Next
     */
    draft: Record<string, string | string[]>;
    /**
     * the pending advance after a tap
     */
    timer: number;
    startedAt: number;
    /**
     * the lines of work, in the order the steps name them (one only: no lanes)
     */
    tracks: Track[];
    /**
     * the key of the active track
     */
    track: string;
    /**
     * the steps passed with Next
     */
    done: Set<number>;
    /**
     * the tracks asking for the person, by track key
     */
    alerts: Map<string, TrackAlert>;
    /**
     * the tracks that waited when the lanes were last read
     */
    waiting: Set<string>;
    /**
     * the steps the shown step waits for, as a key
     */
    lockKey: string;
    /**
     * the interval that keeps the lanes' clocks, 0 when none
     */
    ticker: number;
    pendingResume: Progress | null;
    finished: {
        total: number;
        answers: FocusState['answers'];
        startedAt: number;
        finishedAt: number;
    } | null;
};
export type Progress = {
    index: number;
    answers: FocusState['answers'];
    startedAt: number;
    /**
     * the key of the active track
     */
    track?: string;
    /**
     * the place on every track, by track key
     */
    positions?: Record<string, number>;
    /**
     * the steps passed
     */
    done?: number[];
};
export type Track = {
    /**
     * the name the steps give it ('' for the shared lane)
     */
    key: string;
    name: string;
    /**
     * the step indexes, in recipe order
     */
    order: number[];
    /**
     * where on the track the person is
     */
    pos: number;
};
export type TrackAlert = {
    reason: 'timer' | 'ready';
    title: string;
    text: string;
    /**
     * the step the track is on
     */
    index: number;
    timerId?: string;
};
/**
 * @typedef {object} FocusIngredient
 * @property {string} name
 * @property {string} [amount]
 */
/**
 * @typedef {object} FocusChoice
 * @property {string} value
 * @property {string} label
 * @property {boolean} [disabled]
 * @property {string} [reason] why it cannot be picked, shown under its label
 */
/**
 * @typedef {object} FocusAnswer
 * @property {string} id names the answer in the events and the done payload
 * @property {'choice' | 'multi' | 'text'} kind
 * @property {FocusChoice[]} [choices]
 * @property {string | string[]} [previous] yesterday's answer: offered as "Same as yesterday"
 * @property {string | string[]} [usual] the usual answer: offered as "Same as usual"
 * @property {string} [placeholder] a text box's hint
 */
/**
 * @typedef {object} FocusStep
 * @property {string} text
 * @property {FocusAnswer} [answer] makes the step a question
 * @property {(FocusIngredient | string)[]} [ingredients]
 * @property {{ seconds: number, name?: string, id?: string }} [timer] `id` names the timer in the timer list (default: the step's `id`)
 * @property {string} [id] names the step for `waitFor` and for its timer (default `step-<n>`)
 * @property {string} [track] the line of work it belongs to ("Pasta"); steps with none belong to the shared lane
 * @property {string} [title] a short name for the step, used in the lanes and where another step waits for it
 * @property {string | string[]} [waitFor] step ids, or track names, that must be done before this step can start
 * @property {string | string[]} [after] the same as `waitFor`
 * @property {string} [note]
 * @property {'info' | 'warning'} [noteTone]
 */
/**
 * @typedef {object} FocusState
 * @property {FocusStep[]} steps
 * @property {number} index
 * @property {WakeLockSentinel | null} wake
 * @property {string} wakeState
 * @property {import('../busy-card.js').BusyCard | null} busy
 * @property {Record<string, { value: string | string[] | null, source: string }>} answers
 * @property {Record<string, string | string[]>} draft the taps of a multi step and the words of a text step, before Next
 * @property {number} timer the pending advance after a tap
 * @property {number} startedAt
 * @property {Track[]} tracks the lines of work, in the order the steps name them (one only: no lanes)
 * @property {string} track the key of the active track
 * @property {Set<number>} done the steps passed with Next
 * @property {Map<string, TrackAlert>} alerts the tracks asking for the person, by track key
 * @property {Set<string>} waiting the tracks that waited when the lanes were last read
 * @property {string} lockKey the steps the shown step waits for, as a key
 * @property {number} ticker the interval that keeps the lanes' clocks, 0 when none
 * @property {Progress | null} pendingResume
 * @property {{ total: number, answers: FocusState['answers'], startedAt: number, finishedAt: number } | null} finished
 */
/**
 * @typedef {object} Progress where a person stopped
 * @property {number} index
 * @property {FocusState['answers']} answers
 * @property {number} startedAt
 * @property {string} [track] the key of the active track
 * @property {Record<string, number>} [positions] the place on every track, by track key
 * @property {number[]} [done] the steps passed
 */
/**
 * @typedef {object} Track
 * @property {string} key the name the steps give it ('' for the shared lane)
 * @property {string} name
 * @property {number[]} order the step indexes, in recipe order
 * @property {number} pos where on the track the person is
 */
/**
 * @typedef {object} TrackAlert
 * @property {'timer' | 'ready'} reason
 * @property {string} title
 * @property {string} text
 * @property {number} index the step the track is on
 * @property {string} [timerId]
 */
/** @type {WeakMap<Element, FocusState>} */
export declare const STATES: WeakMap<Element, FocusState>;
/** @type {WeakSet<Element>} */
export declare const WIRED: WeakSet<Element>;
