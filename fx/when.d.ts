export type When = boolean | string | string[] | ((theme: string) => boolean);
/** @typedef {boolean | string | string[] | ((theme: string) => boolean)} When */
/**
 * @param {When} when
 * @param {string} theme the current theme name
 * @returns {boolean}
 */
export declare function effectActive(when: When, theme: string): boolean;
