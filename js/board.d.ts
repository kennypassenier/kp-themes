export { BOARD, BOARD_LANE_EVENT, BOARD_RETRY_EVENT } from './board/values.js';
export type BoardState = 'loading' | 'ready' | 'empty' | 'error';
export type BoardOptions = {
    strings?: Partial<import('./strings.js').Strings>;
};
/** @typedef {'loading' | 'ready' | 'empty' | 'error'} BoardState */
/** @typedef {{ strings?: Partial<import('./strings.js').Strings> }} BoardOptions */
/**
 * Attach every board under `root` (the root itself included).
 * @param {ParentNode} [root]
 * @param {BoardOptions} [options]
 * @returns {() => void} detach
 */
export declare function attachBoards(root?: ParentNode, options?: BoardOptions): () => void;
/**
 * The board as a whole: `loading` (the busy card over the lanes), `ready`, `empty` (the plate over the board, `words` its heading)
 * or `error` (the plate with Try again, `words` the reason).
 * @param {Element} el
 * @param {BoardState} state
 * @param {string} [words]
 */
export declare function setBoardState(el: Element, state: BoardState, words?: string): void;
/**
 * Show a lane of a narrow board with tabs (on a wide board every lane shows already).
 * @param {Element} el
 * @param {string} lane the lane's key
 */
export declare function showBoardLane(el: Element, lane: string): void;
/**
 * Count the lanes again after the page changed a limit or a label (the counts follow the cards by themselves).
 * @param {Element} el
 */
export declare function recountBoard(el: Element): void;
