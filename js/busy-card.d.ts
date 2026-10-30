export { BUSY_CARD } from './busy-card/values.js';
export { scrollersAround, seenAcross } from './busy-card/scroll.js';
export { openBusyCard } from './busy-card/layer.js';
export type BusyCardOptions = {
    /**
     * what the card says under the spinner
     */
    words: string;
    /**
     *   the boxes the card covers, in viewport coordinates (an element's border box, or a rectangle); measured on every placement
     */
    area: () => readonly (Element | {
        top: number;
        right: number;
        bottom: number;
        left: number;
    })[];
    /**
     * the component's own class on the layer, beside `kp-datatable__busy-card`
     */
    className?: string;
    /**
     * arrive the theme's way (default true); false for a component's first render
     */
    arrive?: boolean;
};
export type BusyCard = {
    layer: HTMLElement;
    /**
     * measure and place it again
     */
    place: () => void;
    /**
     * let it leave the theme's way; settles once it is gone
     */
    close: () => Promise<void>;
    /**
     * take it out at once (a new loading state while it was leaving)
     */
    remove: () => void;
};
/**
 * @typedef {object} BusyCardOptions
 * @property {string} words what the card says under the spinner
 * @property {() => readonly (Element | { top: number, right: number, bottom: number, left: number })[]} area
 *   the boxes the card covers, in viewport coordinates (an element's border box, or a rectangle); measured on every placement
 * @property {string} [className] the component's own class on the layer, beside `kp-datatable__busy-card`
 * @property {boolean} [arrive] arrive the theme's way (default true); false for a component's first render
 */
/**
 * @typedef {object} BusyCard
 * @property {HTMLElement} layer
 * @property {() => void} place measure and place it again
 * @property {() => Promise<void>} close let it leave the theme's way; settles once it is gone
 * @property {() => void} remove take it out at once (a new loading state while it was leaving)
 */
