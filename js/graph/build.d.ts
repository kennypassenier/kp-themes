export type GraphDecorateInfo = import('./options.js').GraphDecorateInfo;
export type GraphDetailInfo = import('./options.js').GraphDetailInfo;
export type GraphModel = import('./instance.js').GraphModel;
export type Strings = import('../strings.js').Strings;
/**
 * The model of one graph with its parts made but not yet placed, loading until data arrives.
 * @param {HTMLElement} el
 * @param {Strings} s
 * @param {((part: Element, info: GraphDecorateInfo) => void) | undefined} decorate
 * @param {((info: GraphDetailInfo) => Node | string | null | void) | undefined} detail
 * @returns {GraphModel}
 */
export declare function newGraph(el: HTMLElement, s: Strings, decorate: ((part: Element, info: GraphDecorateInfo) => void) | undefined, detail: ((info: GraphDetailInfo) => Node | string | null | void) | undefined): GraphModel;
/**
 * Put the graph's parts into its element. The data child stays (a script draws nothing), so a second attach after a detach reads
 * it again.
 * @param {GraphModel} g
 */
export declare function mountGraph(g: GraphModel): void;
