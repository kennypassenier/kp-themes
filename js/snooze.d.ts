export { SNOOZE, SNOOZE_EVENT, SNOOZE_END_EVENT, SNOOZE_CHOICES, registerSnoozeWords, snoozeWords, dayAt, snoozeChoices } from './snooze/choices.js';
export type SnoozeChoice = import('./snooze/choices.js').SnoozeChoice;
export type SnoozeRules = import('./snooze/choices.js').SnoozeRules;
export type SnoozeHandle = {
    element: HTMLElement;
    /**
     * the moment snoozed until (ms), or null
     */
    until: () => number | null;
    /**
     * no event
     */
    setUntil: (until: number | string | Date | null) => void;
    setBusy: (busy: boolean) => void;
    /**
     * what is offered now
     */
    choices: () => SnoozeChoice[];
    /**
     * show the date and time panel
     */
    openPanel: () => void;
    /**
     * hide it, the focus left where it is
     */
    closePanel: () => void;
};
/** @typedef {import('./snooze/choices.js').SnoozeChoice} SnoozeChoice */
/** @typedef {import('./snooze/choices.js').SnoozeRules} SnoozeRules */
/**
 * @typedef {object} SnoozeHandle
 * @property {HTMLElement} element
 * @property {() => number | null} until the moment snoozed until (ms), or null
 * @property {(until: number | string | Date | null) => void} setUntil no event
 * @property {(busy: boolean) => void} setBusy
 * @property {() => SnoozeChoice[]} choices what is offered now
 * @property {() => void} openPanel show the date and time panel
 * @property {() => void} closePanel hide it, the focus left where it is
 */
/** The handle of an attached picker. @param {Element} element @returns {SnoozeHandle | null} */
export declare function snooze(element: Element): SnoozeHandle | null;
/**
 * Show a picker as snoozed until a moment, or not snoozed (null), without the event.
 * @param {Element} element @param {number | string | Date | null} until
 */
export declare function setSnoozedUntil(element: Element, until: number | string | Date | null): void;
/**
 * Show a picker at work (the page is saving the reminder): its button shows the spinner and says no to a press.
 * @param {Element} element @param {boolean} busy
 */
export declare function setSnoozeBusy(element: Element, busy: boolean): void;
/**
 * Open a picker's date and time panel, as the "Pick a date and time…" choice does, or close it.
 * @param {Element} element @param {boolean} [open]
 */
export declare function openSnoozePanel(element: Element, open?: boolean): void;
/**
 * Wire every snooze picker under `root`.
 * @param {ParentNode} [root]
 * @param {{ now?: () => number }} [options]
 * @returns {() => void} detach
 */
export declare function attachSnoozes(root?: ParentNode, { now }?: {
    now?: () => number;
}): () => void;
