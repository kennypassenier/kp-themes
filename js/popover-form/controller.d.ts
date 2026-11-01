import { Controller } from '../controller.js';
export type CloseReason = import('./constants.js').CloseReason;
export type MenuState = import('../menu-button/types.js').MenuState;
export declare class PopoverFormControl extends Controller {
    /** The opener and the form; null when the markup lacks one, and then nothing is wired. */
    opener: HTMLButtonElement | null;
    form: HTMLFormElement | null;
    /** The placing state the menu button's placement reads and writes. @type {MenuState | null} */
    place: MenuState | null;
    /** What an open form listens to, undone when it closes. @type {(() => void)[]} */
    off: (() => void)[];
    /** @param {HTMLElement} host @param {Record<string, unknown>} [options] */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    isOpen(): boolean;
    /** Open it under its button with the first field focused and selected; what was typed last time is gone. */
    open(): void;
    /** Escape, a press outside and the focus leaving close it; a resize places it again. @param {Window} view */
    listenWhileOpen(view: Window): void;
    /** Accept: closes, the focus back on the button, when the fields are valid and the page agreed. */
    accept(): Promise<void>;
    /**
     * Close it, backwards; with `focus` the focus goes back to the button (Escape, accept, the button itself).
     * @param {CloseReason} reason @param {boolean} focus
     */
    close(reason: CloseReason, focus: boolean): void;
}
