import { QuestionCore } from './core.js';
export declare class QuestionRun extends QuestionCore {
    /** What the page gets back, the same object every time. @type {import('../question-card.js').QuestionHandle & { stop: () => void }} */
    handle: import('../question-card.js').QuestionHandle & {
        stop: () => void;
    };
    /**
     * @param {HTMLElement} host the card
     * @param {import('./core.js').QuestionInit} init
     */
    constructor(host: HTMLElement, init: import('./core.js').QuestionInit);
    connect(): void;
    /** @returns {import('../question-card.js').QuestionHandle & { stop: () => void }} */
    makeHandle(): import('../question-card.js').QuestionHandle & {
        stop: () => void;
    };
    /** Oldest first: a card goes before the first one asked later. */
    place(): void;
    /** The clock stops and the card stops counting for the tab title. */
    stop(): void;
    /** @param {Event} event */
    onClick(event: Event): void;
    /** The keys 1 to n answer. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
    /** The time ran out: the default answer's outcome, the buttons off. */
    expire(): void;
    /** The card goes: the clock stops, the title is repainted, the controller is undone and the card leaves. */
    remove(): Promise<void>;
    /** An answer was chosen: sending, and the app is asked through the event. @param {string} value */
    choose(value: string): void;
    /** The app's reply: answered, or refused until the person answers again. @param {import('./spec.js').ResolvedQuestion['answers'][number]} picked @param {boolean} ok @param {string} why */
    reply(picked: import('./spec.js').ResolvedQuestion['answers'][number], ok: boolean, why: string): void;
}
