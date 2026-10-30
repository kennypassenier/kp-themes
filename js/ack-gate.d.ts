export { ACK_GATE, ACK_EVENT, ACK_RETRY_EVENT } from './ack-gate/values.js';
export type AckHandle = {
    element: HTMLElement;
    checked: () => boolean;
    set: (checked: boolean) => void;
    setState: (state: 'ready' | 'loading' | 'error' | 'empty') => void;
    /**
     * the release notes as markdown, drawn safely in a fold of the gate; null takes them away
     */
    setNotes: (markdown: string | null) => void;
    setLocked: (locked: boolean) => void;
    /**
     * how many gates of this gate's controls are still unticked
     */
    remaining: () => number;
};
/**
 * @typedef {object} AckHandle
 * @property {HTMLElement} element
 * @property {() => boolean} checked
 * @property {(checked: boolean) => void} set
 * @property {(state: 'ready' | 'loading' | 'error' | 'empty') => void} setState
 * @property {(markdown: string | null) => void} setNotes the release notes as markdown, drawn safely in a fold of the gate; null takes them away
 * @property {(locked: boolean) => void} setLocked
 * @property {() => number} remaining how many gates of this gate's controls are still unticked
 */
/**
 * The handle of an attached gate.
 * @param {Element} el
 * @returns {AckHandle | null}
 */
export declare function ackGate(el: Element): AckHandle | null;
/**
 * Give a gate its release notes as markdown (the host fetched them), drawn safely in a fold under the alert; null takes them away.
 * @param {Element} gate an attached `[data-kp-ack]`
 * @param {string | null} markdown
 */
export declare function setAckNotes(gate: Element, markdown: string | null): void;
/**
 * Give every acknowledge gate under `root` its tick and guard its controls.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachAckGates(root?: ParentNode): () => void;
