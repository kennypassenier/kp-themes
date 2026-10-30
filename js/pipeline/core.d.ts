import { Controller } from '../controller.js';
export type PipelineLane = import('../pipeline.js').PipelineLane;
export type PipelineCard = import('../pipeline.js').PipelineCard;
export type PipelineState = import('../pipeline.js').PipelineState;
/** @typedef {import('../pipeline.js').PipelineLane} PipelineLane */
/** @typedef {import('../pipeline.js').PipelineCard} PipelineCard */
/** @typedef {import('../pipeline.js').PipelineState} PipelineState */
export declare class PipelineCore extends Controller {
    strings: import("../strings/types.js").Strings;
    /** @type {PipelineLane[]} */
    lanes: PipelineLane[];
    /** @type {PipelineCard[]} */
    cards: PipelineCard[];
    /** @type {PipelineState} */
    state: PipelineState;
    /** The words of the empty or failed plate. */
    words: string;
    /** The lanes that show all their cards. @type {Set<string>} */
    open: Set<string>;
    /** The id of the card that is open. @type {string | null} */
    selected: string | null;
    /** The card or "more" button that holds the tab stop. @type {string | null} */
    active: string | null;
    board: HTMLDivElement;
    closed: HTMLDivElement;
    plate: HTMLDivElement;
    live: HTMLParagraphElement;
    /** What the plate says now, so it is rebuilt only when that changes. */
    plateKey: string;
    /** The cards drawn, by id. @type {Map<string, HTMLElement>} */
    nodes: Map<string, HTMLElement>;
    /** The loading card over the board. @type {import('../busy-card.js').BusyCard | null} */
    busy: import('../busy-card.js').BusyCard | null;
    /** The loading card on its way out. @type {Promise<void> | null} */
    leaving: Promise<void> | null;
    /** Whether the first frame has passed: a loading card arrives with motion only after it. */
    drawn: boolean;
    /**
     * @param {HTMLElement} el
     * @param {{ strings?: Partial<import('../strings.js').Strings> }} [options]
     */
    constructor(el: HTMLElement, options?: {
        strings?: Partial<import('../strings.js').Strings>;
    });
    /** A board that was loading or empty is ready once data arrives. */
    settle(): void;
    /** Whether the plate must be rebuilt for what it says now; remembers it. @param {string} key */
    plateChanged(key: string): boolean;
    /** Keep the loading card that was opened. @param {import('../busy-card.js').BusyCard} card */
    holdBusy(card: import('../busy-card.js').BusyCard): void;
    /** Hand over the loading card and forget it. @returns {import('../busy-card.js').BusyCard | null} */
    takeBusy(): import('../busy-card.js').BusyCard | null;
    /** The board's limit per lane; 0 shows every card. */
    limit(): number;
    /** Build the frame once. */
    build(): void;
    /** The cards a person can reach, per lane (the board's lanes, then the closed ones). @returns {HTMLElement[][]} */
    reachable(): HTMLElement[][];
    /** One tab stop: the active card. */
    syncTabStops(): void;
}
