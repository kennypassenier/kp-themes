/** Whether a group carries a tracked value. @param {Element} group */
export declare const isTrackedGroup: (group: Element) => boolean;
/**
 * Write the group's value into its attribute; `announce` when a person changed it. The first write is the saved value too.
 * @param {Element} group @param {boolean} [announce]
 */
export declare function writeGroupTrack(group: Element, announce?: boolean): void;
/**
 * Listen for a value written back into the group and paint it; the caller passes the setters (no import cycle with api.js).
 * @param {HTMLElement} group
 * @param {{ values: (group: Element, values: string[]) => void, tri: (group: Element, values: { include?: string[], exclude?: string[] }) => void }} set
 * @returns {() => void} detach
 */
export declare function listenGroupWrites(group: HTMLElement, set: {
    values: (group: Element, values: string[]) => void;
    tri: (group: Element, values: {
        include?: string[];
        exclude?: string[];
    }) => void;
}): () => void;
