export { PIPELINE, PIPELINE_OPEN_EVENT, PIPELINE_RETRY_EVENT, PIPELINE_MORE_EVENT } from './pipeline/values.js';
export type PipelineLane = {
    key: string;
    label: string;
    tone?: 1 | 2 | 3 | 4 | 5;
    closed?: boolean;
    danger?: boolean;
};
export type PipelineCard = {
    id: string;
    /**
     * the lane's key
     */
    lane: string;
    title: string;
    /**
     * the line under the title (a company)
     */
    sub?: string;
    /**
     * a short last line (a date)
     */
    meta?: string;
    /**
     * a short sign, two letters, in the lane's colour
     */
    mark?: string;
    /**
     * a link; without it the card is a button
     */
    href?: string;
    /**
     * filtered out, kept in its place
     */
    dimmed?: boolean;
};
export type PipelineState = 'loading' | 'ready' | 'empty' | 'error';
export type Strings = import('./strings.js').Strings;
export type PipelineOptions = {
    strings?: Partial<Strings>;
};
export type PipelineModel = {
    el: HTMLElement;
    strings: Strings;
    lanes: PipelineLane[];
    cards: PipelineCard[];
    state: PipelineState;
    words: string;
    open: Set<string>;
    selected: string | null;
    active: string | null;
    board: HTMLElement;
    closed: HTMLElement;
    plate: HTMLElement;
    plateKey: string;
    live: HTMLElement;
    nodes: Map<string, HTMLElement>;
    busy: import('./busy-card.js').BusyCard | null;
    leaving: Promise<void> | null;
    drawn: boolean;
};
/**
 * @typedef {{ key: string, label: string, tone?: 1 | 2 | 3 | 4 | 5, closed?: boolean, danger?: boolean }} PipelineLane
 * @typedef {object} PipelineCard
 * @property {string} id
 * @property {string} lane the lane's key
 * @property {string} title
 * @property {string} [sub] the line under the title (a company)
 * @property {string} [meta] a short last line (a date)
 * @property {string} [mark] a short sign, two letters, in the lane's colour
 * @property {string} [href] a link; without it the card is a button
 * @property {boolean} [dimmed] filtered out, kept in its place
 * @typedef {'loading' | 'ready' | 'empty' | 'error'} PipelineState
 * @typedef {import('./strings.js').Strings} Strings
 * @typedef {{ strings?: Partial<Strings> }} PipelineOptions
 * @typedef {{ el: HTMLElement, strings: Strings, lanes: PipelineLane[], cards: PipelineCard[], state: PipelineState,
 *   words: string, open: Set<string>, selected: string | null, active: string | null, board: HTMLElement,
 *   closed: HTMLElement, plate: HTMLElement, plateKey: string, live: HTMLElement,
 *   nodes: Map<string, HTMLElement>, busy: import('./busy-card.js').BusyCard | null, leaving: Promise<void> | null, drawn: boolean }} PipelineModel
 */
/**
 * Attach every board under `root`.
 * @param {ParentNode} [root]
 * @param {PipelineOptions} [options]
 * @returns {() => void} detach
 */
export declare function attachPipelines(root?: ParentNode, options?: PipelineOptions): () => void;
/**
 * The lanes and the cards. Cards are kept by id, so a refresh keeps a focused card and moves nothing that stayed. A board
 * that was loading is ready from here on. `lanes` may be left out after the first call.
 * @param {Element} el
 * @param {{ lanes?: PipelineLane[], cards: PipelineCard[] }} data
 */
export declare function setPipeline(el: Element, { lanes, cards }: {
    lanes?: PipelineLane[];
    cards: PipelineCard[];
}): void;
/**
 * The board as a whole: `loading` (the lanes kept, the table's loading card over them), `ready`, `empty` (the state plate
 * over the whole board, `words` its heading) or `error` (the plate with Try again, `words` the reason under its heading).
 * @param {Element} el
 * @param {PipelineState} state
 * @param {string} [words]
 */
export declare function setPipelineState(el: Element, state: PipelineState, words?: string): void;
/**
 * Mark the card that is open (`aria-current`), or none.
 * @param {Element} el
 * @param {string | null} id
 */
export declare function setPipelineSelected(el: Element, id: string | null): void;
