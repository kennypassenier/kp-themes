/** @param {Element} el @param {string} name @param {number} fallback */
export declare const msOf: (el: Element, name: string, fallback: number) => number;
/**
 * A time a register names in a custom property, in ms, played as slowly or
 * as fast as the page plays every motion (`--kp-motion-scale`, default 1);
 * `null` when the register names none. A bare number is ms. The property is
 * read where `el` stands, so a nested theme island answers with its own.
 * @param {Element} el
 * @param {string} name a custom property, such as `--kp-update-time`
 * @returns {number | null}
 */
export declare function registerTime(el: Element, name: string): number | null;
/** @param {string} raw a CSS duration list @returns {number} the first, in ms */
export declare const firstMs: (raw: string) => number;
/** @returns {boolean} */
export declare const reduced: () => boolean;
/**
 * The theme's motion, read from its dialog entrance: a dialog drawn for an
 * instant out of sight, in the theme `scope` wears.
 *
 * @param {Element} [scope] where the theme is read (its closest `[data-theme]` applies)
 * @returns {{ open: number, ease: string, close: number, size: number }} milliseconds, and the entrance's curve
 */
export declare function themeMotion(scope?: Element): {
    open: number;
    ease: string;
    close: number;
    size: number;
};
/** How long a drawer takes to leave when the page names no `--kp-drawer-close-time`, in ms. */
export declare const DRAWER_CLOSE_MS = 180;
/**
 * How long `dialog` takes to leave, in ms. A drawer is dismissed all day, so it leaves in its own short time
 * (`--kp-drawer-close-time`, default 180 ms, set on the drawer or the root) instead of its theme's reversed
 * entrance, which runs up to `--kp-close-max`; every other dialog keeps that. Reduced motion leaves at once.
 * @param {HTMLElement} dialog
 * @returns {number}
 */
export declare function closeTime(dialog: HTMLElement): number;
