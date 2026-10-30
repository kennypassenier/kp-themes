/**
 * Glide `box` from one height to another. During the glide the box clips
 * what overflows it and measures its border box, so the last frame is the
 * size it keeps (a card with padding read its padding twice and then
 * clicked smaller, in forest and the removed high-contrast).
 * @param {HTMLElement} box @param {number} from @param {number} to @param {number} duration @param {string} easing
 * @param {boolean} [plain] no `[data-kp-resizing]` character
 * @param {number} [delay] ms the box holds `from` before it moves
 */
export declare function glide(box: HTMLElement, from: number, to: number, duration: number, easing: string, plain?: boolean, delay?: number): {
    animation: Animation;
    done: () => void;
};
/**
 * The theme's own way of letting a small thing arrive: its toast entrance,
 * already decided per register, read from a toast drawn out of sight.
 * @param {Element} scope
 * @returns {string | null} an `animation` value, or null for none
 */
export declare function arrival(scope: Element): string | null;
/**
 * Let `el` arrive the theme's way, once.
 * @param {HTMLElement} el @param {string | null} motion
 */
export declare function arrive(el: HTMLElement, motion: string | null): void;
/**
 * Let `el` arrive the theme's way, now: for a part a script brings back by
 * itself (an alert dismissed and shown again), outside any box motion
 * watches. A part that already arrives, or leaves, is left alone.
 * @param {HTMLElement} el
 */
export declare function arriveShown(el: HTMLElement): void;
/** The attribute a group carries while glideGroup() moves its height. */
export declare const GROUP_FOLDING_ATTRIBUTE = "data-kp-group-folding";
/**
 * Open or shut a group whose shut state is not drawn (a tree branch's
 * children, `display: none` while `aria-expanded="false"`) by gliding its
 * height, the accordion's way: the theme's growth curve and time, and the
 * same curve turned around to shut, so the close is the open played
 * backwards. `apply()` flips the state (the caller's attribute); the group
 * is kept drawn through a shutting glide by the theme's rule on
 * `[data-kp-group-folding]`. The box around it follows the group instead of
 * gliding itself (followsAFold()). Under reduced motion, in a theme that
 * switches, or inside a group that glides already, the state is applied at
 * once and the box glides as it always did.
 * @param {HTMLElement} group @param {boolean} opening @param {() => void} apply
 */
export declare function glideGroup(group: HTMLElement, opening: boolean, apply: () => void): void;
/**
 * Play backwards the arrival arrive() gives `el` in a theme where it does
 * not arrive as a leave turned around (a table row; Kenny, 2026-10-05: the
 * rows of a group unfolded the theme's way and folded away at once): the
 * register's own `[data-kp-arriving]`, else the theme's toast entrance, in
 * its own time on its curve turned around. The caller hides `el` once it
 * settles. Settles at once when there is no arrival to turn around.
 * @param {HTMLElement} el
 * @returns {Promise<void>}
 */
export declare function playArrivalBackwards(el: HTMLElement): Promise<void>;
