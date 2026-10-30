export type UsualModel = import('./types.js').UsualModel;
/** @typedef {import('./types.js').UsualModel} UsualModel */
/** Rebuild the order of the list: pinned, the band, the rest, the rows that open the rest. @param {UsualModel} m */
export declare function arrange(m: UsualModel): void;
/**
 * The guard's rows for what is typed. FIRST in the list: "Headache is already picked" for a name (or the near name of one)
 * already picked, then "Did you mean Fatigue?" for each near name not picked yet, whose plain row is folded into it so the
 * name stands once. Under the options: the plate over a search with nothing left, then "Add 'Fatigu' as new". Before, a
 * near name whose row was still shown (the start of a name, "Fatigu") got no question at all, and a name already picked was
 * answered with "No match" (Kenny, 2026-10-18 21:37).
 * @param {UsualModel} m @param {string} typed
 */
export declare function paintTail(m: UsualModel, typed: string): void;
/** Show or hide the headers by whether any option stands under them. @param {UsualModel} m */
export declare function paintHeaders(m: UsualModel): void;
