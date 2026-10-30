/** A rating. */
export declare const RATING = "[data-kp-rating]";
/** Fired on the rating when a person changes it: `{ value, previous, source, wait }`. */
export declare const RATING_EVENT = "kp-rating-change";
/** Fired on the rating when Retry is pressed on a rating that could not be read. */
export declare const RATING_RETRY_EVENT = "kp-rating-retry";
/** The states a rating can be in. */
export declare const RATING_STATES: readonly ['ready', 'loading', 'error'];
/** The star, as one path in a 24 by 24 box. */
export declare const STAR_PATH = "M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.2 1.2-6.5L2.5 9.5l6.6-.9z";
/** The fewest and the most stars a scale may have, and the default. */
export declare const MIN_STARS = 3;
export declare const MAX_STARS = 10;
export declare const DEFAULT_STARS = 5;
/** How long the Undo toast stays unless `data-kp-undo-ms` says, and how long a refused save is told [ms]. */
export declare const DEFAULT_UNDO_MS = 6000;
export declare const DEFAULT_FLASH_MS = 3000;
/** The pause before a status sentence is written, so the same sentence twice is heard [ms]. */
export declare const SAY_DELAY_MS = 30;
/** The step a display row snaps its value to: a fraction of a star is drawn as it is. */
export declare const DISPLAY_STEP = 0.01;
export type RatingSource = 'pointer' | 'keyboard' | 'clear' | 'undo';
export type RatingOptions = {
    /**
     * the scale, 3 to 10 (default 5)
     */
    max?: number;
    /**
     * whole or half stars (default 1)
     */
    step?: 1 | 0.5;
    /**
     * a row to set, or one to read (default input)
     */
    mode?: 'input' | 'display';
};
export type RatingHandle = {
    element: HTMLElement;
    /**
     * 0 is not rated
     */
    value: () => number;
    /**
     * replace the value (no event)
     */
    set: (value: number) => void;
    setState: (state: 'ready' | 'loading' | 'error') => void;
    focus: () => void;
};
/**
 * @typedef {'pointer' | 'keyboard' | 'clear' | 'undo'} RatingSource
 */
/**
 * @typedef {object} RatingOptions
 * @property {number} [max] the scale, 3 to 10 (default 5)
 * @property {1 | 0.5} [step] whole or half stars (default 1)
 * @property {'input' | 'display'} [mode] a row to set, or one to read (default input)
 */
/**
 * @typedef {object} RatingHandle
 * @property {HTMLElement} element
 * @property {() => number} value 0 is not rated
 * @property {(value: number) => void} set replace the value (no event)
 * @property {(state: 'ready' | 'loading' | 'error') => void} setState
 * @property {() => void} focus
 */
