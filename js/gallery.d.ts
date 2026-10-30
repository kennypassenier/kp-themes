export { GALLERY, GALLERY_OPEN_EVENT, GALLERY_CLOSE_EVENT, GALLERY_RETRY_EVENT, GALLERY_ADD_EVENT, GALLERY_STATES, GALLERY_CHROME_MS, } from './gallery/constants.js';
export { galleryItems, galleryLast, setGallery, setGalleryUploading, openGalleryItem, attachGalleries, openGalleryFromHash, } from './gallery/attach.js';
export type GalleryItem = import('./gallery/constants.js').GalleryItem;
export type GalleryAction = import('./gallery/constants.js').GalleryAction;
export type GallerySpec = import('./gallery/constants.js').GallerySpec;
/** @typedef {import('./gallery/constants.js').GalleryItem} GalleryItem */
/** @typedef {import('./gallery/constants.js').GalleryAction} GalleryAction */
/** @typedef {import('./gallery/constants.js').GallerySpec} GallerySpec */
