/** @param {HTMLElement} el */
export declare const sourceOf: (el: HTMLElement) => string;
/** A drop shorter than this shows nothing [ms]. @param {HTMLElement} el */
export declare function graceOf(el: HTMLElement): number;
/** How long "Connected again" stays [ms]. @param {HTMLElement} el */
export declare function backMsOf(el: HTMLElement): number;
/** The seconds between automatic tries; none when the page says "off". @param {HTMLElement} el */
export declare function delaysOf(el: HTMLElement): number[];
