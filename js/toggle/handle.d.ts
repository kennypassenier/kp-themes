import { toggleGroup } from './group.js';
import { ToggleParts } from './parts.js';
export type PressedState = import('./group.js').PressedState;
export type ToggleHandle = import('../toggle.js').ToggleHandle;
/** @typedef {import('./group.js').PressedState} PressedState */
/** @typedef {import('../toggle.js').ToggleHandle} ToggleHandle */
export declare class ToggleAnswers extends ToggleParts {
    /** A press waiting on the app's answer, with the states to go back to. @type {{ plan: Map<HTMLElement, PressedState>, before: Map<HTMLElement, PressedState> } | null} */
    pending: {
        plan: Map<HTMLElement, PressedState>;
        before: Map<HTMLElement, PressedState>;
    } | null;
    /** @type {number | undefined} */
    refusedTimer: number | undefined;
    /** @type {ToggleHandle} */
    handle: ToggleHandle;
    /** @param {HTMLElement} button @param {import('../toggle.js').ToggleOptions} [options] */
    constructor(button: HTMLElement, options?: import('../toggle.js').ToggleOptions);
    /** The element whose `data-kp-remember` keeps the value: the group's container, else the lone button. @param {ReturnType<typeof toggleGroup>} g */
    rememberHolder(g: ReturnType<typeof toggleGroup>): HTMLElement | null;
    remember(): void;
    /** The plan applied, and the hint, the Clear button and the memory after it. @param {Map<HTMLElement, PressedState>} plan */
    settle(plan: Map<HTMLElement, PressedState>): void;
    /**
     * Wait for the app's answer when it asked to (`detail.wait(promise)`): busy until it settles, back to the old states if it is refused.
     * @param {Promise<unknown> | null} wait @param {Map<HTMLElement, PressedState>} plan @param {Map<HTMLElement, PressedState>} before
     */
    awaitAnswer(wait: Promise<unknown> | null, plan: Map<HTMLElement, PressedState>, before: Map<HTMLElement, PressedState>): void;
    /** Set the state without the press event; a group keeps its rules. @param {boolean | 'mixed'} next @param {{ silent?: boolean }} [how] */
    setValue(next: boolean | 'mixed', { silent }?: {
        silent?: boolean;
    }): void;
    /** @param {number | 'loading' | null} n */
    setCount(n: number | 'loading' | null): void;
    /** @param {string} text */
    setHint(text: string): void;
    done(): void;
    /** The app refused: the states go back and the refusal's word shows for a moment. @param {string} [message] */
    refuse(message?: string): void;
}
