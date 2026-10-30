import { PipelineLanes } from './lanes.js';
export declare class PipelineView extends PipelineLanes {
    /** The cards of each lane, by the lane's key. @returns {Map<string, import('./core.js').PipelineCard[]>} */
    byLane(): Map<string, import('./core.js').PipelineCard[]>;
    /** Take the nodes of cards that are gone off the board. */
    prune(): void;
    /** Draw the lanes: the board's, then the closed ones under it. */
    drawLanes(): void;
    /** Which state plate covers the board: `error`, `empty`, or none. @returns {'error' | 'empty' | null} */
    plateKind(): 'error' | 'empty' | null;
    /** Draw the plate, rebuilt only when what it says changes, so the focus on its Retry survives a repaint. @param {'error' | 'empty' | null} shown */
    drawPlate(shown: 'error' | 'empty' | null): void;
    /** Everything, from the state. */
    paint(): void;
    /** The loading card over the board, the data table's own [Kenny, 2026-10-16]. */
    drawBusy(): void;
    /** Let the loading card go; the cards are drawn once it has gone. */
    closeBusy(): void;
}
