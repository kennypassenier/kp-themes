export { BOARD, BOARD_LANE_EVENT, BOARD_RETRY_EVENT, MOVE_PREFIX as BOARD_MOVE_PREFIX } from './board/values.js';
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
 * Show a lane of a narrow board under its switcher (on a wide board every lane shows already).
 * @param {Element} el
 * @param {string} lane the lane's key
 */
export declare function showBoardLane(el: Element, lane: string): void;
/**
 * Count the lanes again after the page changed a limit or a label (the counts follow the cards by themselves).
 * @param {Element} el
 */
export declare function recountBoard(el: Element): void;
/**
 * The "Move to" group for a card of the board, for a page that builds the card's menu itself (setContextMenu with a function):
 * one entry per other lane, its value `kp-board-move:<lane>`; a pick of it anywhere in the board moves the card.
 * @param {Element} el the board
 * @param {HTMLElement} card
 * @returns {import('./menu-button.js').MenuGroup | null} null when there is no other lane
 */
export declare function boardMoveGroup(el: Element, card: HTMLElement): import('./menu-button.js').MenuGroup | null;
/**
 * Send a card to the end of a lane, as a "Move to" pick does.
 * @param {Element} el the board
 * @param {HTMLElement} card
 * @param {string} lane the lane's key
 * @returns {boolean} whether it moved
 */
export declare function moveBoardCard(el: Element, card: HTMLElement, lane: string): boolean;
