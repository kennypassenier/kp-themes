export { SIZE_ATTRIBUTE, SIZE_SELECTOR, FOLD_SELECTOR, ARRIVE_KEYS, motionWatchCount } from './motion/constants.js';
export { registerTime, themeMotion } from './motion/timing.js';
export { withCustomProperties, turnLines, turnEntrances } from './motion/keyframes.js';
export { closeDialog, REVERSING_ATTRIBUTE, playEntranceBackwards, stopReversing, CLOSING_ATTRIBUTE, PANEL_SELECTOR, playClose, stopClose, } from './motion/close.js';
export { withoutOvershoot, reversedEase, sizeMotion } from './motion/size.js';
export { arriveShown, GROUP_FOLDING_ATTRIBUTE, glideGroup, playArrivalBackwards } from './motion/arrive.js';
export { leavesState, leave, repaintedIn } from './motion/leave.js';
export { FOLDING_OUT, easeSize } from './motion/fold-size.js';
export { attachMotion } from './motion/attach.js';
export type Entrance = import('./motion/keyframes.js').Entrance;
export type Line = import('./motion/keyframes.js').Line;
export type Arriving = import('./motion/turns.js').Arriving;
export type Leaving = import('./motion/leave.js').Leaving;
export type RepaintNode = import('./motion/leave.js').RepaintNode;
export type SizeOptions = import('./motion/fold-size.js').SizeOptions;
/** @typedef {import('./motion/keyframes.js').Entrance} Entrance */
/** @typedef {import('./motion/keyframes.js').Line} Line */
/** @typedef {import('./motion/turns.js').Arriving} Arriving */
/** @typedef {import('./motion/leave.js').Leaving} Leaving */
/** @typedef {import('./motion/leave.js').RepaintNode} RepaintNode */
/** @typedef {import('./motion/fold-size.js').SizeOptions} SizeOptions */
