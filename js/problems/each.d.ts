import { Controller } from '../controller.js';
export type Problem = import('../problems.js').Problem;
export type ProblemsOptions = import('../problems.js').ProblemsOptions;
/** @typedef {import('../problems.js').Problem} Problem */
/** @typedef {import('../problems.js').ProblemsOptions} ProblemsOptions */
export declare class ProblemsEach extends Controller {
    /** The problems it was last given. @type {Problem[]} */
    items: Problem[];
    /** The options it was last given, less the layout, for a repaint after an attribute change. @type {ProblemsOptions} */
    rest: ProblemsOptions;
    /** The layout attributes as last rendered, so the observer repaints only for another one. */
    rendered: string;
    /** @param {HTMLElement} host a `[data-kp-problems]` */
    constructor(host: HTMLElement);
    /** The alerts on show, by key: a row that is leaving is gone, and one that is arriving the theme's way (formal: its leave played backwards) is on show [homelab 89]. @returns {Map<string, HTMLElement>} */
    shownAlerts(): Map<string, HTMLElement>;
    /** One alert per problem, the worst first, each with its own fix. @param {Problem[]} list @param {string} remedyLabel */
    paintEach(list: Problem[], remedyLabel: string): void;
}
