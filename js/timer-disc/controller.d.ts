import { DiscDraw } from './draw.js';
export declare class TimerDisc extends DiscDraw {
    /** The fill animation of a reset, while it plays. @type {Animation | null} */
    filling: Animation | null;
    /**
     * @param {HTMLElement} host
     * @param {{ now?: () => number, wall?: () => number }} [options]
     */
    constructor(host: HTMLElement, options?: {
        now?: () => number;
        wall?: () => number;
    });
    connect(): void;
    mount(): void;
    /** Counting down to a moment starts at once; the clock then runs to it whatever the page does. */
    startUntil(): void;
    onGo(): void;
    onReset(): void;
    /** Play the fill from where the disc was to where it is, in the theme's own duration and easing. @param {number} from */
    fill(from: number): void;
    /** A tab that slept keeps the device's clock, not the timer's: when it is visible again the moment is counted anew. */
    onVisible(): void;
    /** @param {string[]} names the options that changed */
    onOptions(names: string[]): void;
}
