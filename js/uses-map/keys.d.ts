export type UsesModel = import('./model.js').UsesModel;
/**
 * The card a navigation key lands on.
 * @param {UsesModel} m @param {HTMLElement} root @param {HTMLElement} card @param {string} key the key of the node of `card` @param {string} kind its side @param {string} pressed
 * @returns {HTMLElement | undefined | null} undefined when the key moves nowhere, null when it is swallowed without moving
 */
export declare function keyTarget(m: UsesModel, root: HTMLElement, card: HTMLElement, key: string, kind: string, pressed: string): HTMLElement | undefined | null;
