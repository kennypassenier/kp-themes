/** The steps, loosest first; '' is the bar as the theme draws it. */
export declare const TABBAR_FIT_STEPS: readonly ['', 'tight', 'small'];
export declare const TABBAR_FIT_ATTRIBUTE = "data-kp-tabbar-fit";
/**
 * Sets the loosest step at which no label is cut, or the last step when none is. A hidden bar (above its width) is
 * left as the theme draws it, and measured again when it shows.
 * @param {HTMLElement} bar
 * @returns {string} the step set
 */
export declare function fitTabbar(bar: HTMLElement): string;
