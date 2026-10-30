import { Controller } from '../controller.js';
export type BusyCardOptions = import('../busy-card.js').BusyCardOptions;
export type BusyCard = import('../busy-card.js').BusyCard;
export type Box = import('./geometry.js').Box;
/** @typedef {import('../busy-card.js').BusyCardOptions} BusyCardOptions */
/** @typedef {import('../busy-card.js').BusyCard} BusyCard */
/** @typedef {import('./geometry.js').Box} Box */
/** One busy card on one host. */
export declare class BusyCardLayer extends Controller {
    area: () => readonly (Element | {
        top: number;
        right: number;
        bottom: number;
        left: number;
    })[];
    arrive: boolean;
    layer: HTMLDivElement;
    panel: HTMLDivElement;
    /** The close in flight, so a second close is the same one. @type {Promise<void> | null} */
    closing: Promise<void> | null;
    /**
     * @param {HTMLElement} host a positioned box; it may scroll
     * @param {BusyCardOptions} options
     */
    constructor(host: HTMLElement, options: BusyCardOptions);
    connect(): void;
    /** Measure and place the card again. */
    place(): void;
    /** The layer scrolls with the host's content, so its edges are written from the host's scroll origin. @param {Box} box @param {{ top: number, left: number }} origin */
    write(box: Box, origin: {
        top: number;
        left: number;
    }): void;
    /** Take the card out at once (a new loading state while it was leaving). */
    remove(): void;
    /** Let the card leave the theme's way; settles once it is gone. @returns {Promise<void>} */
    close(): Promise<void>;
    /** The handle a page gets back: the layer and three functions that need no `this`. @returns {BusyCard} */
    handle(): BusyCard;
}
/**
 * Lay the busy card over a data area of `host`.
 * @param {HTMLElement} host
 * @param {BusyCardOptions} options
 * @returns {BusyCard}
 */
export declare function openBusyCard(host: HTMLElement, options: BusyCardOptions): BusyCard;
