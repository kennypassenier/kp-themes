/**
 * @param {HTMLElement} source
 * @param {HTMLElement} home where the copy is kept in the document (the day timeline), so it travels with its section
 * @param {PointerEvent} down the press that grabbed it
 * @returns {{ follow: (e: PointerEvent) => void, remove: () => void }}
 */
export declare function liftCopy(source: HTMLElement, home: HTMLElement, down: PointerEvent): {
    follow: (e: PointerEvent) => void;
    remove: () => void;
};
