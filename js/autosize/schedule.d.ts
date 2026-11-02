export type AutosizeController = import('./controller.js').AutosizeController;
/** Measure every waiting box together. */
export declare function flushMeasures(): void;
/** Measure this box with the others that ask in the same task: at the end of the task, or at once when attaching ends. @param {AutosizeController} c */
export declare function measureSoon(c: AutosizeController): void;
/** Measure now, or with the others when boxes are being attached. @param {AutosizeController} c */
export declare function measureOrHold(c: AutosizeController): void;
/** Run `work` (it attaches boxes); every box it attaches measures together afterwards, before this returns. @template T @param {() => T} work @returns {T} */
export declare function holdMeasures<T>(work: () => T): T;
/** Watch a box's width, the viewport and the phone query with the shared watch; returns the undo. @param {AutosizeController} c @returns {() => void} */
export declare function watchBox(c: AutosizeController): () => void;
