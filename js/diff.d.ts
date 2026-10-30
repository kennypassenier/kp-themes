export { DIFF, DIFF_TOGGLE_EVENT, DIFF_EXPAND_EVENT, DIFF_COPY_EVENT, DIFF_RETRY_EVENT, DIFF_CONTEXT, DIFF_FOLD_MIN, DIFF_MAX_LINES, DIFF_WORD_LIMIT, DIFF_WORD_SHARE, DIFF_STATUSES, } from './diff/constants.js';
export { diffWords } from './diff/words.js';
export { foldContext } from './diff/fold.js';
export { setDiff } from './diff/actions.js';
export { attachDiffs } from './diff/attach.js';
export type DiffLine = import('./diff/types.js').DiffLine;
export type DiffHunk = import('./diff/types.js').DiffHunk;
export type DiffFile = import('./diff/types.js').DiffFile;
export type DiffSpec = import('./diff/types.js').DiffSpec;
export type Segment = import('./diff/types.js').Segment;
export type NormFile = import('./diff/types.js').NormFile;
export type DiffState = import('./diff/types.js').DiffState;
export type Part = import('./diff/types.js').Part;
/** @typedef {import('./diff/types.js').DiffLine} DiffLine */
/** @typedef {import('./diff/types.js').DiffHunk} DiffHunk */
/** @typedef {import('./diff/types.js').DiffFile} DiffFile */
/** @typedef {import('./diff/types.js').DiffSpec} DiffSpec */
/** @typedef {import('./diff/types.js').Segment} Segment */
/** @typedef {import('./diff/types.js').NormFile} NormFile */
/** @typedef {import('./diff/types.js').DiffState} DiffState */
/** @typedef {import('./diff/types.js').Part} Part */
