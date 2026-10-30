import { Controller } from '../controller.js';
/** The controller of one `[data-kp-submit]` button. */
export declare class SubmitController extends Controller {
    button: HTMLButtonElement;
    busyText: string;
    idleText: string;
    ownsFaces: boolean;
    /**
     * @param {HTMLElement} host the button
     * @param {Record<string, unknown>} [options]
     */
    constructor(host: HTMLElement, options?: Record<string, unknown>);
    connect(): void;
    onValid(): void;
    /** The way back [KT6]. The first version restored the label only on detach, so a failed save left the button dead for the life of the page. */
    onDone(): void;
}
