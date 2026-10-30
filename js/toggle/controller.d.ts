import { toggleGroup } from './group.js';
import { ToggleAnswers } from './handle.js';
export type PressedState = import('./group.js').PressedState;
/** @typedef {import('./group.js').PressedState} PressedState */
export declare class ToggleControl extends ToggleAnswers {
    connect(): void;
    /** The label, the tick, the count and the hint, each only when the markup asks for it. */
    buildParts(): void;
    /** Remembered state, read before the first press; the All member reads the others once they have all been attached. @param {ReturnType<typeof toggleGroup>} g */
    readRemembered(g: ReturnType<typeof toggleGroup>): void;
    /** @param {HTMLElement} member @param {boolean} [forceClear] */
    press(member: HTMLElement, forceClear?: boolean): undefined;
    /** @param {PressedState} nextState */
    sayState(nextState: PressedState): void;
    /** A single group walks with the arrow keys, Home and End. @param {KeyboardEvent} event */
    arrows(event: KeyboardEvent): void;
    /** A single group is one stop in the Tab order: the member that is on, else the first. */
    rove(): void;
    /** `data-kp-toggle-key`: the shortcut that presses the toggle (never a bare digit, which AZERTY types as a sign). */
    registerKey(): undefined;
}
