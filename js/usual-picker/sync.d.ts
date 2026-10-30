export type UsualModel = import('./types.js').UsualModel;
/** Where a usual choice stands: had it (picked), not today, or not answered. @param {UsualModel} m @param {string} value */
export declare function answerOf(m: UsualModel, value: string): "had" | "none" | "not";
/** Give a usual choice an answer from the check. @param {UsualModel} m @param {string} value @param {'had' | 'not' | 'none'} next */
export declare function answer(m: UsualModel, value: string, next: 'had' | 'not' | 'none'): void;
/**
 * Draw the check of the usual choices under the field, or take it away: a heading, one line saying what Not today is, and
 * the choices in the picker's look. Drawn again only when the look or the band changed; otherwise only the states move, so
 * the focus stays on the button pressed.
 * @param {UsualModel} m
 */
export declare function syncCheck(m: UsualModel): void;
/** The state panel: loading, empty, or failed, in the place and size of the open list. @param {UsualModel} m */
export declare function syncPanel(m: UsualModel): void;
/** The line the app gives under the input once something is chosen. @param {UsualModel} m */
export declare function syncHint(m: UsualModel): void;
/** Draw the picker from its attributes: the order, the rows, the state, the hint. @param {UsualModel} m */
export declare function render(m: UsualModel): void;
