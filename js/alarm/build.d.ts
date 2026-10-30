export type AlarmOptions = import('../alarm.js').AlarmOptions;
export type Strings = import('../strings.js').Strings;
/**
 * Build an alarm's markup, closed and not yet in the document. Both
 * channels write this tree (components/alarm.jsx renders the same), so a
 * consumer's register rule and a test reach the same elements in each.
 *
 * @param {AlarmOptions & { id?: string }} options
 * @returns {{ dialog: HTMLDialogElement, ack: HTMLButtonElement, keep: HTMLButtonElement, when: HTMLElement, left: HTMLElement, strings: import('../strings.js').Strings, action: string, seconds: number }}
 */
export declare function buildAlarm({ title, detail, code, mode, seconds, escape, action, strings, id }?: AlarmOptions & {
    id?: string;
}): {
    dialog: HTMLDialogElement;
    ack: HTMLButtonElement;
    keep: HTMLButtonElement;
    when: HTMLElement;
    left: HTMLElement;
    strings: import('../strings.js').Strings;
    action: string;
    seconds: number;
};
