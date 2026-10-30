/**
 * Set a file row's progress. Exported because the consumer owns the
 * request and therefore owns the numbers.
 *
 * @param {HTMLElement} item
 * @param {number} percent
 */
export declare function setProgress(item: HTMLElement, percent: number): void;
/** Mark a row done, with an optional message. @param {HTMLElement} item @param {string} [message] */
export declare function setDone(item: HTMLElement, message?: string): void;
/**
 * Mark a row failed, with the reason where a screen reader will read it.
 *
 * @param {HTMLElement} item
 * @param {string} message
 */
export declare function setError(item: HTMLElement, message: string): void;
