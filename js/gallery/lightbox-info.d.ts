export type Lightbox = import('./lightbox.js').Lightbox;
export type GalleryItem = import('./constants.js').GalleryItem;
/** @typedef {import('./lightbox.js').Lightbox} Lightbox */
/** @typedef {import('./constants.js').GalleryItem} GalleryItem */
/** The caption, uploader, date and (in `details`) size of the picture. @param {Lightbox} lb @param {GalleryItem} item */
export declare function drawInfo(lb: Lightbox, item: GalleryItem): void;
/** The buttons in the foot: the page's own (asking first when they say to), and the named kinds. @param {Lightbox} lb @param {GalleryItem} item @returns {import('../viewer.js').ViewerAction[]} */
export declare function actionsFor(lb: Lightbox, item: GalleryItem): import('../viewer.js').ViewerAction[];
