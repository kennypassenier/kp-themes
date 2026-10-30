export type Kept = import('./types.js').Kept;
/** @typedef {import('./types.js').Kept} Kept */
/** Everything that depends on the buffer or the options: the bar, the foot, the plates, the event. @param {HTMLElement} root */
export declare function refresh(root: HTMLElement): void;
/** Draw every row again, for a changed option. @param {HTMLElement} root */
export declare function redraw(root: HTMLElement): void;
/** Drop the oldest lines past the cap. @param {HTMLElement} root */
export declare function trim(root: HTMLElement): void;
