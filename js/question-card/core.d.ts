import { Controller } from '../controller.js';
export type QuestionState = 'waiting' | 'urgent' | 'sending' | 'answered' | 'refused' | 'expired';
export type ResolvedQuestion = import('./spec.js').ResolvedQuestion;
export type CardParts = import('./build.js').CardParts;
export type QuestionInit = {
    container: HTMLElement;
    spec: import('../question-card.js').QuestionSpec;
    q: ResolvedQuestion;
    parts: CardParts;
    now: () => number;
    frozen: boolean;
};
/** @typedef {'waiting' | 'urgent' | 'sending' | 'answered' | 'refused' | 'expired'} QuestionState */
/** @typedef {import('./spec.js').ResolvedQuestion} ResolvedQuestion */
/** @typedef {import('./build.js').CardParts} CardParts */
/**
 * What the run is given.
 * @typedef {object} QuestionInit
 * @property {HTMLElement} container
 * @property {import('../question-card.js').QuestionSpec} spec
 * @property {ResolvedQuestion} q
 * @property {CardParts} parts
 * @property {() => number} now
 * @property {boolean} frozen
 */
export declare class QuestionCore extends Controller {
    container: HTMLElement;
    spec: import("../question-card.js").QuestionSpec;
    q: import("./spec.js").ResolvedQuestion;
    parts: import("./build.js").CardParts;
    now: () => number;
    frozen: boolean;
    view: Window;
    /** @type {QuestionState} */
    state: QuestionState;
    announcedUrgent: boolean;
    /** The countdown's interval, 0 for none. */
    timer: number;
    /** The answer that is being sent. */
    sentValue: string;
    /**
     * @param {HTMLElement} host the card
     * @param {QuestionInit} init
     */
    constructor(host: HTMLElement, init: QuestionInit);
    /** The dictionary as it stands now. */
    s(): import("../strings/types.js").Strings;
    /** @param {string} value */
    setSent(value: string): void;
    /** The card's look for its state. */
    flavour(): void;
    /** @param {QuestionState} next */
    setState(next: QuestionState): void;
    /** Show what the card says once it has an outcome. @param {string} text */
    say(text: string): void;
    /** Say it to a screen reader as well. @param {string} text */
    speak(text: string): void;
    /** The time left in words; a card in its urgent last seconds is stronger, announced once; at zero it expires. */
    paintTime(): void;
    /** Announce the urgent state once. @param {string} text */
    announceUrgent(text: string): void;
    /** The shrinking measure is one CSS animation over the whole wait, started part-way in. */
    run(): void;
    /** Start the clock that repaints the time every second. */
    startClock(): void;
    /** Stop the clock. */
    stopClock(): void;
    /** The time ran out. The run overrides it. */
    expire(): void;
}
