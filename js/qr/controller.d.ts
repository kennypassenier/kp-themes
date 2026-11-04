import { Controller } from '../controller.js';
export declare class QrControl extends Controller {
    /** The frame a queued draw waits for, so a burst of attribute changes draws once. */
    queued: number;
    /** @param {HTMLElement} root @param {{ copyKey?: string | false }} [options] */
    constructor(root: HTMLElement, options?: {
        copyKey?: string | false;
    });
    connect(): void;
    /** The copy key (Shift+C by default; an option) copies the link while the focus is in the code. @returns {() => void} the stop */
    copyKey(): () => void;
    /** @param {Event} event */
    onClick(event: Event): void;
    /** Show or hide a code behind its cover; the focus goes to the code, or back to the Show button. @param {boolean} shown */
    reveal(shown: boolean): void;
}
