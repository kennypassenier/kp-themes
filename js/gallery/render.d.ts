export type Gallery = import('./gallery.js').Gallery;
export type GalleryItem = import('./constants.js').GalleryItem;
/** The hidden file input behind the add tile. @param {Document} doc @param {HTMLElement} el */
export declare function fileInput(doc: Document, el: HTMLElement): HTMLInputElement;
/** The plate of an empty or failed gallery, over the whole footprint. @param {Gallery} gallery @param {'empty' | 'error'} state */
export declare function statePlateBox(gallery: Gallery, state: 'empty' | 'error'): HTMLElement;
/** "Continue where you were". @param {Gallery} gallery @param {string} last */
export declare function continueBar(gallery: Gallery, last: string): HTMLElement;
/** The grid of tiles, or of waiting tiles. @param {Gallery} gallery @param {boolean} loading */
export declare function buildGrid(gallery: Gallery, loading: boolean): HTMLElement;
/** The tile of one picture. @param {Gallery} gallery @param {GalleryItem} item */
export declare function tileFor(gallery: Gallery, item: GalleryItem): HTMLElement;
