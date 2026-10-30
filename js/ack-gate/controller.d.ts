import { AckSync } from './sync.js';
export declare class AckGate extends AckSync {
    connect(): void;
    /** The classes, role and tone the host gets, and the class it gives back. */
    stamp(): void;
    /** The handle a page gets from `ackGate(gate)`. @returns {import('../ack-gate.js').AckHandle} */
    makeHandle(): import('../ack-gate.js').AckHandle;
    onLink(): void;
    /**
     * Set or clear the tick; a tick the gate does not allow yet is refused.
     * @param {boolean} checked @param {boolean} fire
     */
    set(checked: boolean, fire: boolean): void;
    /** What identifies the item the tick was set for: its key, version and words. */
    signature(): string;
    /** A changed item is a new decision: the tick clears (default), and a gate redraws when its words or state change. */
    watchAttributes(): void;
    /** A min-ms wait ends by itself; the held height follows the gate's size. */
    watchHeight(): void;
}
