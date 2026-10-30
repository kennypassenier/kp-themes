export type SequencerUnit = 'second' | 'minute' | 'hour' | 'day' | 'week';
export type SequencerOverlap = 'refuse' | 'push' | 'allow';
export type SequencerItem = {
    /**
     * what the page calls the item
     */
    id: string;
    /**
     * the lane's id
     */
    lane: string;
    /**
     * what it is, one line
     */
    label: string;
    /**
     * where it begins, in the unit
     */
    start: number;
    /**
     * how long it takes, in the unit
     */
    duration: number;
    /**
     * the id of the item it starts together with ("runs alongside")
     */
    with?: string | null;
    /**
     * its colour (default: the lane's)
     */
    series?: 1 | 2 | 3 | 4 | 5;
    /**
     * more words about the item, kept for the page (not drawn)
     */
    detail?: string;
    /**
     * cannot be moved or resized
     */
    locked?: boolean;
};
export type SequencerLane = {
    id: string;
    label: string;
};
export type SequencerChangeItem = {
    id: string;
    lane: string;
    start: number;
    duration: number;
    with: string | null;
};
export type SequencerRefusal = 'unknown' | 'locked' | 'overlap' | 'edge' | 'lane' | 'cycle';
export type SequencerPlan = {
    ok: boolean;
    items: SequencerItem[];
    changed: string[];
    pushed: string[];
    reason: SequencerRefusal | null;
    blocker: string | null;
};
export type SequencerEdit = {
    id: string;
    kind: 'move' | 'resize-start' | 'resize-end';
    start?: number;
    end?: number;
    lane?: string;
};
export type SequencerOptions = {
    /**
     * the snap step (default 1)
     */
    step?: number;
    /**
     * default `refuse`
     */
    overlap?: SequencerOverlap;
    /**
     * snap to the edges of other items (default true)
     */
    edges?: boolean;
    /**
     * how far an edge pulls, in the unit (default 0)
     */
    reach?: number;
    /**
     * items may change lane (default true)
     */
    laneMove?: boolean;
    /**
     * the lane ids in order, to refuse an unknown lane and to step through them
     */
    lanes?: readonly string[] | null;
    /**
     * the window's end: an edit does not push the end of what it moves past it (default none)
     */
    max?: number;
    /**
     * a move that changes nothing because it was clamped is refused (`edge`), for the keyboard
     */
    strict?: boolean;
};
export type SequencerKeyAction = {
    kind: 'move' | 'resize-start' | 'resize-end';
    by: number;
} | {
    kind: 'lane';
    by: number;
} | {
    kind: 'drop';
} | {
    kind: 'cancel';
};
export type SequencerState = 'loading' | 'ready' | 'empty' | 'error';
export type Strings = import('../strings.js').Strings;
export type SequencerAttachOptions = {
    /**
     * any of the dictionary's words, for these sequencers only
     */
    strings?: Partial<Strings>;
};
/**
 * @typedef {'second' | 'minute' | 'hour' | 'day' | 'week'} SequencerUnit
 * @typedef {'refuse' | 'push' | 'allow'} SequencerOverlap
 * @typedef {object} SequencerItem
 * @property {string} id what the page calls the item
 * @property {string} lane the lane's id
 * @property {string} label what it is, one line
 * @property {number} start where it begins, in the unit
 * @property {number} duration how long it takes, in the unit
 * @property {string | null} [with] the id of the item it starts together with ("runs alongside")
 * @property {1 | 2 | 3 | 4 | 5} [series] its colour (default: the lane's)
 * @property {string} [detail] more words about the item, kept for the page (not drawn)
 * @property {boolean} [locked] cannot be moved or resized
 * @typedef {{ id: string, label: string }} SequencerLane
 * @typedef {{ id: string, lane: string, start: number, duration: number, with: string | null }} SequencerChangeItem
 * @typedef {'unknown' | 'locked' | 'overlap' | 'edge' | 'lane' | 'cycle'} SequencerRefusal
 * @typedef {{ ok: boolean, items: SequencerItem[], changed: string[], pushed: string[], reason: SequencerRefusal | null, blocker: string | null }} SequencerPlan
 * @typedef {{ id: string, kind: 'move' | 'resize-start' | 'resize-end', start?: number, end?: number, lane?: string }} SequencerEdit
 * @typedef {object} SequencerOptions
 * @property {number} [step] the snap step (default 1)
 * @property {SequencerOverlap} [overlap] default `refuse`
 * @property {boolean} [edges] snap to the edges of other items (default true)
 * @property {number} [reach] how far an edge pulls, in the unit (default 0)
 * @property {boolean} [laneMove] items may change lane (default true)
 * @property {readonly string[] | null} [lanes] the lane ids in order, to refuse an unknown lane and to step through them
 * @property {number} [max] the window's end: an edit does not push the end of what it moves past it (default none)
 * @property {boolean} [strict] a move that changes nothing because it was clamped is refused (`edge`), for the keyboard
 * @typedef {{ kind: 'move' | 'resize-start' | 'resize-end', by: number } | { kind: 'lane', by: number } | { kind: 'drop' } | { kind: 'cancel' }} SequencerKeyAction
 * @typedef {'loading' | 'ready' | 'empty' | 'error'} SequencerState
 * @typedef {import('../strings.js').Strings} Strings
 * @typedef {object} SequencerAttachOptions
 * @property {Partial<Strings>} [strings] any of the dictionary's words, for these sequencers only
 */
/** @param {number} n */
export declare const round: (n: number) => number;
/** @param {unknown} v @param {number} fallback */
export declare const num: (v: unknown, fallback?: number) => number;
/**
 * The unit a word names: `minute`, `min`, `m`, `hours`, `d` … null when it names none.
 * @param {unknown} word
 * @returns {{ name: SequencerUnit, seconds: number } | null}
 */
export declare function sequencerUnit(word: unknown): {
    name: SequencerUnit;
    seconds: number;
} | null;
/**
 * Snap a value to the grid of `step`, or to the nearest of `candidates` (the edges of other items) when one is within `reach`.
 * @param {number} value
 * @param {number} step
 * @param {readonly number[]} [candidates]
 * @param {number} [reach]
 * @returns {number}
 */
export declare function sequencerSnap(value: number, step: number, candidates?: readonly number[], reach?: number): number;
/**
 * The next grid line from a value: `by` steps (negative: back), always on the grid, so a value off the grid lands on it first.
 * @param {number} value @param {number} by @param {number} step
 */
export declare function stepFrom(value: number, by: number, step: number): number;
