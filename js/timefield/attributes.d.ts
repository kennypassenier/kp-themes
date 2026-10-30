export type TimePreset = import('./constants.js').TimePreset;
export type TimeEntry = import('./constants.js').TimeEntry;
/** @typedef {import('./constants.js').TimePreset} TimePreset */
/** @typedef {import('./constants.js').TimeEntry} TimeEntry */
/** @param {HTMLElement} root @param {string} name @param {string} fallback */
export declare const attr: (root: HTMLElement, name: string, fallback: string) => string;
/** The step of the keys and the list. @param {HTMLElement} root */
export declare const stepOf: (root: HTMLElement) => number;
/** Whether the field carries seconds. @param {HTMLElement} root */
export declare const hasSeconds: (root: HTMLElement) => boolean;
/** The presets written in `data-kp-time-presets`. @param {HTMLElement} root @returns {TimePreset[]} */
export declare function presetsFromAttribute(root: HTMLElement): TimePreset[];
/** The entries of the list: Clear, Now, and every time of the step inside the window. @param {HTMLElement} root @returns {TimeEntry[]} */
export declare function entries(root: HTMLElement): TimeEntry[];
/** The busy moment a time is near, if any. @param {HTMLElement} root @param {string} value @returns {string | null} */
export declare function nearOf(root: HTMLElement, value: string): string | null;
