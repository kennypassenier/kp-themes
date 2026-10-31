export type GraphModel = import('./instance.js').GraphModel;
/**
 * Pick or unpick a node; a pick opens its details, taking the node out closes them if they were its.
 * @param {GraphModel} g
 * @param {string} id
 */
export declare function togglePick(g: GraphModel, id: string): void;
/** @param {GraphModel} g @param {string | null} id */
export declare function setHover(g: GraphModel, id: string | null): void;
/** Show all: no picks, no hidden kinds, no details; false when there was nothing to clear. @param {GraphModel} g */
export declare function showAll(g: GraphModel): boolean;
/**
 * Esc closes the details first and keeps the picks; the next Esc shows all. False when no details were open.
 * @param {GraphModel} g
 * @param {boolean} refocus put the focus back on the node the details were of
 */
export declare function closeDetail(g: GraphModel, refocus: boolean): boolean;
