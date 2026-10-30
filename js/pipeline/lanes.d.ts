import { PipelineCore } from './core.js';
export declare class PipelineLanes extends PipelineCore {
    /** The card's element, made or kept by id; a card that turned from link to button (or back) is made again. @param {import('./core.js').PipelineCard} card */
    cardShell(card: import('./core.js').PipelineCard): HTMLElement;
    /**
     * One card, made or kept by id.
     * @param {import('./core.js').PipelineCard} card @param {import('./core.js').PipelineLane | undefined} lane
     */
    cardNode(card: import('./core.js').PipelineCard, lane: import('./core.js').PipelineLane | undefined): HTMLElement;
    /** Whether the lanes are drawn as placeholders: loading, or the loading card is still leaving. */
    loading(): boolean;
    /** The lane's head: its name, a flag for a failing stage, and the exact count. @param {import('./core.js').PipelineLane} lane @param {number} count @param {string} id */
    laneHead(lane: import('./core.js').PipelineLane, count: number, id: string): HTMLElement;
    /** The placeholder cards of a loading lane. @param {boolean} closed */
    ghosts(closed: boolean): HTMLSpanElement[];
    /** The cards of a lane, as many as its limit allows, and the toggle for the rest. @param {import('./core.js').PipelineLane} lane @param {import('./core.js').PipelineCard[]} cards @param {HTMLElement} list */
    fillCards(lane: import('./core.js').PipelineLane, cards: import('./core.js').PipelineCard[], list: HTMLElement): void;
    /** A lane, made from scratch on every paint (its cards are kept by id). @param {import('./core.js').PipelineLane} lane @param {import('./core.js').PipelineCard[]} cards @param {number} total */
    laneNode(lane: import('./core.js').PipelineLane, cards: import('./core.js').PipelineCard[], total: number): HTMLElement;
}
