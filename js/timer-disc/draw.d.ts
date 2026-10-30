import { timerButton } from '../countdown.js';
import { DiscCore } from './core.js';
export declare class DiscDraw extends DiscCore {
    /** The share last written, and the frame and minute the running loop is at. */
    drawn: number;
    frame: number;
    minute: number;
    /** The Start/Pause and Reset buttons and their box, when the disc has controls. @type {ReturnType<typeof timerButton> | null} */
    go: ReturnType<typeof timerButton> | null;
    /** @type {ReturnType<typeof timerButton> | null} */
    reset: ReturnType<typeof timerButton> | null;
    /** @type {HTMLElement | null} */
    controls: HTMLElement | null;
    clock: import("../countdown/constants.js").CountdownClock;
    /**
     * @param {HTMLElement} host
     * @param {{ now?: () => number, wall?: () => number }} [options]
     */
    constructor(host: HTMLElement, options?: {
        now?: () => number;
        wall?: () => number;
    });
    scaleMs(): number;
    /** @param {boolean} [force] */
    draw(force?: boolean): void;
    /** The face says the time left in whole minutes (under a minute at the last), so a screen reader is not told every second. */
    label(): void;
    captionText(): string;
    show(): void;
    loop(): void;
    /** @param {string} state */
    onClockChange(state: string): void;
    onClockEnd(): void;
    /**
     * The controls are built when the disc has them and left out of the document (and the tab order) when it has none.
     * @param {() => void} onGo @param {() => void} onReset
     */
    mountControls(onGo: () => void, onReset: () => void): void;
}
