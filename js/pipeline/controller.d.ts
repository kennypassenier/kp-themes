import { PipelineView } from './view.js';
export declare class PipelineBoard extends PipelineView {
    connect(): void;
    /** The first frame has passed: a loading card may arrive with motion from here on. */
    markDrawn(): void;
    /** The lanes and the cards, kept by id; a board that was loading is ready from here on. @param {import('../pipeline.js').PipelineLane[] | undefined} lanes @param {import('../pipeline.js').PipelineCard[]} cards */
    setData(lanes: import('../pipeline.js').PipelineLane[] | undefined, cards: import('../pipeline.js').PipelineCard[]): void;
    /** @param {import('../pipeline.js').PipelineState} state @param {string} words */
    setState(state: import('../pipeline.js').PipelineState, words: string): void;
    /** Mark the card that is open (`aria-current`), or none. @param {string | null} id */
    setSelected(id: string | null): void;
    /** A lane shows more or fewer cards. @param {HTMLElement} more the toggle that was pressed */
    toggleMore(more: HTMLElement): void;
    /** @param {MouseEvent} event */
    onClick(event: MouseEvent): void;
    /** Where an arrow, Home or End goes from a card: along the lane, or to the neighbouring lane. @param {KeyboardEvent} event @param {HTMLElement[][]} lanes @param {number} li the lane it is in @param {number} at its place in the lane */
    destination(event: KeyboardEvent, lanes: HTMLElement[][], li: number, at: number): HTMLElement | undefined;
    /** @param {KeyboardEvent} event */
    onKey(event: KeyboardEvent): void;
}
