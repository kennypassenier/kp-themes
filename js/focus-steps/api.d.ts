export type FocusStep = import('./constants.js').FocusStep;
/** @typedef {import('./constants.js').FocusStep} FocusStep */
/**
 * Go to a step (as a person did: the event fires when it moved).
 * @param {Element} root @param {number} index
 * @returns {boolean} whether it moved
 */
export declare function goToStep(root: Element, index: number): boolean;
/** @param {Element} root */
export declare const getStepIndex: (root: Element) => number;
export type StepsPassed = {
    /**
     * how many steps are passed
     */
    count: number;
    /**
     * how many steps the flow has
     */
    total: number;
    /**
     * the passed steps' places, in order
     */
    indexes: number[];
    /**
     * their ids (`step-<n>` for a step without one)
     */
    ids: string[];
    /**
     * copies of the passed steps themselves
     */
    steps: FocusStep[];
};
/**
 * @typedef {object} StepsPassed
 * @property {number} count how many steps are passed
 * @property {number} total how many steps the flow has
 * @property {number[]} indexes the passed steps' places, in order
 * @property {string[]} ids their ids (`step-<n>` for a step without one)
 * @property {FocusStep[]} steps copies of the passed steps themselves
 */
/**
 * The steps the person has passed [wish-1028, Kitchen 4]: a page that mirrors the progress (a checklist beside the flow, "3 of 8
 * done") reads it here instead of from the remembered progress. In a flow with lines of work (tracks) a step is passed when Next
 * left it; in a single line it is every step before the one shown; a finished flow has passed them all. Read on the call: it is a
 * copy, so changing it changes nothing.
 * @param {Element} root
 * @returns {StepsPassed}
 */
export declare function getStepsPassed(root: Element): StepsPassed;
/**
 * The steps the flow was given by setFocusSteps, as copies, in order [wish-1028].
 * @param {Element} root
 * @returns {FocusStep[]}
 */
export declare const getSteps: (root: Element) => FocusStep[];
/**
 * Give the steps, and where to begin (to come back where a person stopped).
 * No event: the page knows.
 * @param {Element} root @param {FocusStep[]} steps @param {{ start?: number }} [options]
 */
export declare function setFocusSteps(root: Element, steps: FocusStep[], { start }?: {
    start?: number;
}): void;
/**
 * The state: `loading` lays the busy card over the body, `error` says the
 * message where the step was, `ready` is neither.
 * @param {Element} root @param {'loading' | 'error' | 'save-error' | 'ready'} kind @param {string} [message]
 */
export declare function setFocusStepsState(root: Element, kind: 'loading' | 'error' | 'save-error' | 'ready', message?: string): void;
/** @param {EventTarget | null} target */
export declare const typing: (target: EventTarget | null) => boolean;
