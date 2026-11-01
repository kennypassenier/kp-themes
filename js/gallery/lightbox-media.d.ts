export type Lightbox = import('./lightbox.js').Lightbox;
/** @typedef {import('./lightbox.js').Lightbox} Lightbox */
/** @param {Lightbox} lb @param {'in' | 'out' | 'toggle'} how @param {PointerEvent | MouseEvent} [event] */
export declare function zoomFigure(lb: Lightbox, how: 'in' | 'out' | 'toggle', event?: PointerEvent | MouseEvent): void;
/** @param {Lightbox} lb @param {import('./constants.js').GalleryItem} item */
export declare function buildVideo(lb: Lightbox, item: import('./constants.js').GalleryItem): HTMLVideoElement;
/** @param {Lightbox} lb @param {import('./constants.js').GalleryItem} item */
export declare function buildImage(lb: Lightbox, item: import('./constants.js').GalleryItem): HTMLImageElement;
