export type UsesNode = import('../uses-map.js').UsesNode;
export type UsesModel = import('./model.js').UsesModel;
/** One node of a column. @param {UsesModel} m @param {UsesNode} node @param {'source' | 'user'} kind */
export declare function nodeFor(m: UsesModel, node: UsesNode, kind: 'source' | 'user'): HTMLElement;
/** The phone's list: each source a card, its users as chips. The same words as the map. @param {UsesModel} m */
export declare function phoneList(m: UsesModel): HTMLElement;
