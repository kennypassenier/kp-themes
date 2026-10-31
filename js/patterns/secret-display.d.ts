import { SecretBase } from './secret-base.js';
export type SecretLoad = import('./types.js').SecretLoad;
export type SecretState = import('./types.js').SecretState;
export type SecretOptions = import('./secret-base.js').SecretOptions;
/** A display field: its state, its options, the countdown and the ticket that drops a read answered too late. */
export declare class SecretControl extends SecretBase {
    load: import("./types.js").SecretLoad | undefined;
    /** @type {SecretState} */
    state: SecretState;
    /** Whether the value shows only while Reveal is held. */
    hold: boolean;
    mask: string;
    /** Whether the countdown waits (the reader selects the value or holds the focus in it). */
    paused: boolean;
    /** Raised by every show and hide; a read that comes back to an older ticket is dropped. */
    ticket: number;
    /** The field's parts, built in connect(). */
    parts: {
        line: HTMLElement;
        words: HTMLElement;
        drain: HTMLElement;
        spoken: HTMLElement;
        value: HTMLElement;
        reveal: HTMLButtonElement;
        copy: HTMLButtonElement | null;
    };
    /** @param {HTMLElement} host @param {SecretOptions} [options] */
    constructor(host: HTMLElement, options?: SecretOptions);
    connect(): void;
    /** @param {HTMLButtonElement} reveal @param {HTMLButtonElement | null} copy */
    wire(reveal: HTMLButtonElement, copy: HTMLButtonElement | null): void;
    /** Follow a later change of the reason (the page grants or takes the right) and of the live options. */
    watch(): void;
    /** The three options; `readOptions()` is the one place that reads them. */
    readOptions(): void;
    /** @param {string[]} names the live option attributes that changed */
    onOptions(names: string[]): void;
    disabledWhy(): string | undefined;
    unpause(): void;
    /** @param {SecretState} next */
    setState(next: SecretState): void;
    writeLine(): void;
    /** @param {string} [reason] */
    hide(reason?: string): void;
    tick(): void;
    /** Read the value and show it; a read that comes back after a hide is dropped. @param {string} [reason] */
    show(reason?: string): Promise<void>;
    /** @param {string} text @param {string} reason */
    showText(text: string, reason: string): void;
    /** @param {'reveal' | 'copy'} purpose */
    read(purpose: 'reveal' | 'copy'): Promise<string>;
    /** @param {boolean} on */
    pause(on: boolean): void;
    /** Whether the reader has selected text inside the shown value. */
    selected(): boolean;
    onReveal(): void;
    /** @param {PointerEvent} event */
    onHoldDown(event: PointerEvent): void;
    /** @param {KeyboardEvent} event */
    onHoldKey(event: KeyboardEvent): void;
    /** The value already shown is copied as it stands; a hidden one is read, copied and never drawn. @param {HTMLButtonElement} copy */
    onCopy(copy: HTMLButtonElement): void;
}
