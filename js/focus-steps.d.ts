export declare const FOCUS_STEPS = "[data-kp-focus-steps]";
export declare const FOCUS_STEPS_EVENT = "kp-focus-steps-change";
export declare const FOCUS_STEPS_DONE_EVENT = "kp-focus-steps-done";
export declare const FOCUS_STEPS_WAKE_EVENT = "kp-focus-steps-wake";
/** How far a finger has to travel across the step to turn it [px]. */
export declare const SWIPE_DISTANCE = 56;
export type FocusIngredient = {
    name: string;
    amount?: string;
};
export type FocusStep = {
    text: string;
    ingredients?: (FocusIngredient | string)[];
    timer?: {
        seconds: number;
        name?: string;
    };
    note?: string;
    noteTone?: 'info' | 'warning';
};
export type FocusState = {
    steps: FocusStep[];
    index: number;
    wake: WakeLockSentinel | null;
    wakeState: string;
    busy: import('./busy-card.js').BusyCard | null;
};
/**
 * Go to a step (as a person did: the event fires when it moved).
 * @param {Element} root @param {number} index
 * @returns {boolean} whether it moved
 */
export declare function goToStep(root: Element, index: number): boolean;
/** @param {Element} root */
export declare const getStepIndex: (root: Element) => number;
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
 * @param {Element} root @param {'loading' | 'error' | 'ready'} kind @param {string} [message]
 */
export declare function setFocusStepsState(root: Element, kind: 'loading' | 'error' | 'ready', message?: string): void;
/**
 * Wire every focus-steps view under `root`: its buttons, keys, swipe, Read
 * aloud, and the screen kept on until the detach.
 * @param {ParentNode} [scope]
 * @returns {() => void} detach
 */
export declare function attachFocusSteps(scope?: ParentNode): () => void;
