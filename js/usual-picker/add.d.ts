export type UsualModel = import('./types.js').UsualModel;
/** @typedef {import('./types.js').UsualModel} UsualModel */
/** Hide the line under the field that offered Undo after an add. @param {UsualModel} m */
export declare function clearNote(m: UsualModel): void;
/** Add a typed name to the list, pick it, and offer Undo. @param {UsualModel} m @param {string} label @param {string | null} nearTo */
export declare function addName(m: UsualModel, label: string, nearTo: string | null): void;
