/** A container of questions. */
export declare const QUESTIONS = "[data-kp-questions]";
/** Fired when an answer was chosen. */
export declare const QUESTION_ANSWER_EVENT = "kp-question-answer";
/** Fired when the time ran out. */
export declare const QUESTION_EXPIRE_EVENT = "kp-question-expire";
/** Fired when a finished card was dismissed. */
export declare const QUESTION_DISMISS_EVENT = "kp-question-dismiss";
/** Seconds before the end from which a card is urgent. */
export declare const QUESTION_URGENT_AT = 30;
/** Milliseconds in a second: the countdown ticks this often, and the urgent limit is given in seconds. */
export declare const MS_PER_SECOND = 1000;
/** The ring's circle: its radius for a circumference of 100, and its box. */
export declare const RING_RADIUS = 15.9155;
export declare const RING_BOX = 36;
export declare const RING_CENTRE: number;
