export { TICK, TICK_KNOB, TICK_MS, TICK_EVENT } from './tick/values.js';
export { parseTick } from './tick/parse.js';
export { tickTo } from './tick/ticker.js';
export type TickParse = {
    value: number;
    decimals: number;
    /**
     * the text with another value in the same shape
     */
    render: (value: number) => string;
};
/**
 * @typedef {object} TickParse
 * @property {number} value
 * @property {number} decimals
 * @property {(value: number) => string} render  the text with another value in the same shape
 */
/**
 * Watch every `[data-kp-tick]` under `root` (and those added later): when
 * its text is changed by anyone but this module, it ticks from the number it
 * showed to the new one.
 * @param {ParentNode} [root]
 * @returns {() => void} detach: every running tick lands on its number
 */
export declare function attachTicks(root?: ParentNode): () => void;
