import { Controller } from '../controller.js';
/** A table that turns into cards at its own width. */
export declare const CARDS_AT = "[data-kp-cards-at]";
/**
 * The threshold in px, from "30rem", "480px" or a bare number of rem.
 * @param {string | null} text @param {number} rem the page's rem in px
 * @returns {number}
 */
export declare function thresholdPx(text: string | null, rem: number): number;
/** Watches one table's width and says in `data-kp-cards-idle` when it is wide enough to stay a table. */
export declare class CardsAt extends Controller {
    connect(): void;
}
/** Marks the cells under a header `data-kp-col="actions"` with the same kind, as rows come and go. */
export declare class ActionColumn extends Controller {
    connect(): void;
}
/**
 * Wire every `data-kp-cards-at` under `root`: the table stays a table until it is narrower than that width.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachCardsAt(root?: ParentNode): () => void;
/**
 * Wire every table with an `actions` column under `root`: its cells get `data-kp-col="actions"`.
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export declare function attachTableActionColumns(root?: ParentNode): () => void;
