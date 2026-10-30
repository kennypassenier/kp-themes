import { AckCore } from './core.js';
export declare class AckSync extends AckCore {
    /** A held control answers a press by taking the reader to the first tick still open. @param {HTMLElement} target */
    guardTarget(target: HTMLElement): void;
    /** Hold a control: disabled for assistive tech, with the reason, remembering what it was. @param {HTMLElement} target */
    hold(target: HTMLElement): void;
    /** Let a held control go and put back what it was. @param {HTMLElement} target */
    release(target: HTMLElement): void;
    /** Bring every control this gate guards in step with every gate that guards it. */
    syncTargets(): void;
}
