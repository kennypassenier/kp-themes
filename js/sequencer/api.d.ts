export type SequencerChangeItem = import('./units.js').SequencerChangeItem;
export type SequencerItem = import('./units.js').SequencerItem;
export type SequencerLane = import('./units.js').SequencerLane;
export type SequencerState = import('./units.js').SequencerState;
/** @typedef {import('./units.js').SequencerChangeItem} SequencerChangeItem */
/** @typedef {import('./units.js').SequencerItem} SequencerItem */
/** @typedef {import('./units.js').SequencerLane} SequencerLane */
/** @typedef {import('./units.js').SequencerState} SequencerState */
/**
 * Give the sequencer its items and lanes. Items are kept by id: a bar that stays is the same element, so a refresh keeps focus and
 * selection. Without `lanes` the lanes already given stay; a lane an item names that no lane does is added with its id as its
 * name. An edit in progress is not disturbed: the set is applied when it ends. No event: the page asked.
 * @param {Element} el
 * @param {Partial<SequencerItem>[]} items
 * @param {SequencerLane[]} [lanes]
 */
export declare function setSequencerItems(el: Element, items: Partial<SequencerItem>[], lanes?: SequencerLane[]): void;
/**
 * The items as the page last saw them: `{ id, lane, start, duration, with }` each, in the sequencer's unit.
 * @param {Element} el
 * @returns {SequencerChangeItem[]}
 */
export declare function getSequencerItems(el: Element): SequencerChangeItem[];
/**
 * The end of the last item, in the unit.
 * @param {Element} el
 * @returns {number}
 */
export declare function getSequencerTotal(el: Element): number;
/**
 * The state of the whole: `loading` (the busy card), `empty`, `error` (the plate, with its Retry as `kp-sequencer-retry`), `ready`.
 * `words` is the plate's title, `text` its sentence.
 * @param {Element} el
 * @param {SequencerState} state
 * @param {string} [words]
 * @param {{ text?: string, art?: Node | string | null }} [more]
 */
export declare function setSequencerState(el: Element, state: SequencerState, words?: string, { text, art }?: {
    text?: string;
    art?: Node | string | null;
}): void;
/**
 * Put the line for now at a point of the plan, in the unit; null takes it away.
 * @param {Element} el
 * @param {number | null} at
 */
export declare function setSequencerNow(el: Element, at: number | null): void;
/**
 * Set the zoom (1 fits the plot to its box); the window keeps its middle.
 * @param {Element} el
 * @param {number} zoom
 */
export declare function setSequencerZoom(el: Element, zoom: number): void;
/**
 * The zoom as it stands.
 * @param {Element} el
 * @returns {number}
 */
export declare function getSequencerZoom(el: Element): number;
/**
 * Select an item (or none) as a click would; no change event.
 * @param {Element} el
 * @param {string | null} id
 */
export declare function setSequencerSelection(el: Element, id: string | null): void;
