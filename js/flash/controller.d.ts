import { FlashRun } from './run.js';
export declare class FlashButton extends FlashRun {
    /** Listen for the press of a `data-kp-post` button; a press while busy never reaches the page's own handler. */
    listenPress(): void;
}
