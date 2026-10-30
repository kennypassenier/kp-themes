export type UsualModel = import('./types.js').UsualModel;
/** @typedef {import('./types.js').UsualModel} UsualModel */
/** @param {UsualModel} m @param {string} typed */
export declare const exactItem: (m: UsualModel, typed: string) => import("./types.js").UsualItem | undefined;
/** The values picked now (tag mode), or the one chosen. @param {UsualModel} m */
export declare const pickedValues: (m: UsualModel) => string[];
/** The near names of what was typed, by the picker's own threshold and count. @param {UsualModel} m @param {string} typed */
export declare const nearOf: (m: UsualModel, typed: string) => import("./types.js").UsualItem[];
