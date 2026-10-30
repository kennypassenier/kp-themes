import { getStrings } from '../strings.js';
export type UsesNode = import('../uses-map.js').UsesNode;
export type UsesLine = import('../uses-map.js').UsesLine;
export type UsesMemory = import('./memory.js').UsesMemory;
export type UsesModel = {
    el: HTMLElement;
    doc: Document;
    strings: ReturnType<typeof getStrings>;
    spec: any;
    state: string;
    loading: boolean;
    side: string;
    shape: 'curve' | 'elbow' | 'straight';
    lightMode: string;
    countOn: boolean;
    hideEmpty: boolean;
    collapseBelow: number;
    memory: UsesMemory;
    sources: UsesNode[];
    users: UsesNode[];
    uses: Map<string, string[]>;
    usedBy: Map<string, string[]>;
    lineInfo: Map<string, UsesLine>;
    byKey: Map<string, UsesNode>;
};
/**
 * The model of one draw.
 * @typedef {object} UsesModel
 * @property {HTMLElement} el
 * @property {Document} doc
 * @property {ReturnType<typeof getStrings>} strings
 * @property {any} spec
 * @property {string} state
 * @property {boolean} loading
 * @property {string} side
 * @property {'curve' | 'elbow' | 'straight'} shape
 * @property {string} lightMode
 * @property {boolean} countOn
 * @property {boolean} hideEmpty
 * @property {number} collapseBelow
 * @property {UsesMemory} memory
 * @property {UsesNode[]} sources
 * @property {UsesNode[]} users
 * @property {Map<string, string[]>} uses
 * @property {Map<string, string[]>} usedBy
 * @property {Map<string, UsesLine>} lineInfo
 * @property {Map<string, UsesNode>} byKey
 */
/**
 * The options a matrix carries as markup, each with its default [KT6].
 * @param {HTMLElement} el
 */
export declare function readOptions(el: HTMLElement): {
    side: string;
    shape: 'curve' | 'elbow' | 'straight';
    lightMode: string;
    countOn: boolean;
    hideEmpty: boolean;
    collapseBelow: number;
};
/**
 * The model of a ready, loading or empty draw.
 * @param {HTMLElement} el @param {any} spec @param {UsesMemory} memory
 * @returns {UsesModel}
 */
export declare function readModel(el: HTMLElement, spec: any, memory: UsesMemory): UsesModel;
/**
 * The words of the nodes on the far end of a node's lines, each with its line's label: "Deloitte (writes here), Takto".
 * @param {UsesModel} m @param {string[]} keys @param {string} self @param {'source' | 'user'} kind
 */
export declare function namesOf(m: UsesModel, keys: string[], self: string, kind: 'source' | 'user'): string;
