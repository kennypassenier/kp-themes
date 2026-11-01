// The board: lanes of cards a person moves between [habits-1101; the Habits todo app's Boards page, where a lane is a tag].
//
// The editable counterpart of the read-only pipeline (js/pipeline.js), built from parts the package has: every lane is dressed as
// the pipeline's lane (its plate, its name and its exact count, painted by every theme as its own), and its cards stand in a
// reorder list (js/structure.js) whose group is the board's, so a card moves along a lane and between lanes by pointer and by
// keyboard (← → on its handle), said in words, reported as `kp-reorder` with `fromList` / `toList` (the lanes' keys).
//
//   <section class="kp-board" data-kp-board aria-label="Weekly review">
//     <section data-kp-board-lane="todo" data-kp-board-label="To do" data-kp-tone="1" data-kp-board-limit="5">
//       <ul data-kp-reorder> <li data-kp-item="t1">…<button data-kp-handle>…</button>…</li> … </ul>
//     </section>
//     …
//   </section>
//
// The cards are the page's own (a task row, a kp card): the board only arranges them. Per lane:
//   data-kp-board-lane    its key, reported as `fromList` / `toList`
//   data-kp-board-label   its name on the plate (and on its tab)
//   data-kp-board-limit   a work-in-progress limit: the count reads "4 / 3", and a lane past it takes the pipeline's failing-stage
//                         look with "Over the limit" in words (said once when it goes over); nothing is refused
//   data-kp-tone          1 to 5, the lane's chart colour, as on the pipeline
// An empty lane says where a card can go and stays a drop target.
//
// Narrow (under 40rem of the board's own width), `data-kp-board-narrow`:
//   scroll (default)   the lanes stand side by side in the board's own box, which scrolls sideways (a lane at 85% of the width,
//                      snapping), so the page never does; a dragged card moves the box near its side edge
//   tabs               one lane at a time under a row of tabs with each lane's count; a card sent to another lane brings that lane
//                      into view, and holding a dragged card over a tab opens its lane
//
// States: setBoardState(el, state, words): `loading` lays the data table's busy card over the lanes; `empty` and `error` put the
// package's plate over the whole board (`error` with Try again, `kp-board-retry`). `kp-board-lane` `{ lane, source }` fires when a
// narrow board with tabs shows another lane. Words are in the dictionary (`board…`).
//
// Each board is one Board controller (js/board/controller.js over js/board/lanes.js, on js/controller.js).

import { attachAll, controllerOf } from './controller.js';
import { Board } from './board/controller.js';
import { BOARD } from './board/values.js';

export { BOARD, BOARD_LANE_EVENT, BOARD_RETRY_EVENT } from './board/values.js';

/** @typedef {'loading' | 'ready' | 'empty' | 'error'} BoardState */
/** @typedef {{ strings?: Partial<import('./strings.js').Strings> }} BoardOptions */

/**
 * Attach every board under `root` (the root itself included).
 * @param {ParentNode} [root]
 * @param {BoardOptions} [options]
 * @returns {() => void} detach
 */
export function attachBoards(root = document, options = {}) {
    return attachAll(root, BOARD, Board, options);
}

/**
 * The board as a whole: `loading` (the busy card over the lanes), `ready`, `empty` (the plate over the board, `words` its heading)
 * or `error` (the plate with Try again, `words` the reason).
 * @param {Element} el
 * @param {BoardState} state
 * @param {string} [words]
 */
export function setBoardState(el, state, words = '') {
    controllerOf(el, Board)?.setState(state, words);
}

/**
 * Show a lane of a narrow board with tabs (on a wide board every lane shows already).
 * @param {Element} el
 * @param {string} lane the lane's key
 */
export function showBoardLane(el, lane) {
    controllerOf(el, Board)?.select(lane, 'page');
}

/**
 * Count the lanes again after the page changed a limit or a label (the counts follow the cards by themselves).
 * @param {Element} el
 */
export function recountBoard(el) {
    controllerOf(el, Board)?.count();
}
