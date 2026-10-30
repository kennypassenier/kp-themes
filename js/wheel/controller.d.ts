import { Controller } from '../controller.js';
export declare class WheelControl extends Controller {
    connect(): void;
    get kiosk(): boolean;
    /** Spin on the Spin button, or anywhere on the stage or the answer as a kiosk. @param {Event} event */
    onClick(event: Event): void;
    /** Kiosk: Enter or Space on the focused wheel spins it. @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
}
