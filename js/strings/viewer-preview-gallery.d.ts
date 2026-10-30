export type ViewerPreviewGalleryStrings = {
    /**
     * The viewer's "Open in a new tab" button (js/viewer.js) [kpadopt6-media]
     */
    viewerOpenNew: string;
    /**
     * The viewer's Download button [kpadopt6-media]
     */
    viewerDownload: string;
    /**
     * The viewer's Print button [kpadopt6-media]
     */
    viewerPrint: string;
    /**
     * The viewer's Copy link button [kpadopt6-media]
     */
    viewerCopyLink: string;
    /**
     * The reason a viewer button is off when there is no file [kpadopt6-media]
     */
    viewerNoFile: string;
    /**
     * The busy card's words while a file opens [kpadopt6-media]
     */
    viewerLoading: string;
    /**
     * The failed stage's heading [kpadopt6-media]
     */
    viewerFailedTitle: string;
    /**
     * The failed stage's sentence when the server gave none [kpadopt6-media]
     */
    viewerFailedText: string;
    /**
     * The heading of the stage that cannot show this kind of file here [kpadopt6-media]
     */
    viewerUnsupportedTitle: string;
    /**
     * Its sentence [kpadopt6-media]
     */
    viewerUnsupportedText: string;
    /**
     * The failed stage's Retry [kpadopt6-media]
     */
    viewerRetry: string;
    /**
     * The exact position in a set: "4 of 37" [kpadopt6-media]
     */
    viewerPosition: (index: number, total: number) => string;
    /**
     * The sheet's heading for the preview keys (js/docpreview.js) [kpadopt6-media]
     */
    previewKeyGroup: string;
    /**
     * The sheet's words for o [kpadopt6-media]
     */
    previewKeyOpen: string;
    /**
     * The sheet's words for d [kpadopt6-media]
     */
    previewKeyDownload: string;
    /**
     * The sheet's words for p [kpadopt6-media]
     */
    previewKeyPrint: string;
    /**
     * The sheet's words for Left in a group of documents [kpadopt6-media]
     */
    previewKeyPrevious: string;
    /**
     * The sheet's words for Right in a group of documents [kpadopt6-media]
     */
    previewKeyNext: string;
    /**
     * The sentence when a file takes too long to open [kpadopt6-media]
     */
    previewTimeout: string;
    /**
     * The sentence when the server says the file is gone [kpadopt6-media]
     */
    previewGone: string;
    /**
     * The sentence when the server answered with an error [kpadopt6-media]
     */
    previewServer: (status: number) => string;
    /**
     * The sentence when this browser cannot show a PDF here [kpadopt6-media]
     */
    previewNoPdf: string;
    /**
     * The line under a PDF's title: how it is shown [kpadopt6-media]
     */
    previewShownByBrowser: string;
    /**
     * The sentence when a picture would not load [kpadopt6-media]
     */
    previewImage: string;
    /**
     * The reason an opener is off when there is no file yet [kpadopt6-media]
     */
    previewNoFile: string;
    /**
     * The facts word of a picture file [kpadopt6-media]
     */
    docKindImage: string;
    /**
     * The facts word of a text file [kpadopt6-media]
     */
    docKindText: string;
    /**
     * The name of a document glyph whose file is missing [kpadopt6-media]
     */
    docMissing: string;
    /**
     * The name of a document glyph: "PDF document" [kpadopt6-media]
     */
    docKindName: (kind: string) => string;
    /**
     * The button that opens the picture last looked at (js/gallery.js) [kpadopt6-media]
     */
    galleryContinue: string;
    /**
     * The failed gallery's heading [kpadopt6-media]
     */
    galleryFailed: string;
    /**
     * Its sentence [kpadopt6-media]
     */
    galleryFailedText: string;
    /**
     * The empty gallery's heading [kpadopt6-media]
     */
    galleryEmpty: string;
    /**
     * Its sentence [kpadopt6-media]
     */
    galleryEmptyText: string;
    /**
     * Its sentence when pictures can be added [kpadopt6-media]
     */
    galleryEmptyAdd: string;
    /**
     * The Retry of a failed gallery or picture [kpadopt6-media]
     */
    galleryRetry: string;
    /**
     * The add tile's words [kpadopt6-media]
     */
    galleryAdd: string;
    /**
     * The busy card's words while the gallery loads [kpadopt6-media]
     */
    galleryLoading: string;
    /**
     * What a picture without a name is called [kpadopt6-media]
     */
    galleryPicture: string;
    /**
     * The name of a tile that opens a picture [kpadopt6-media]
     */
    galleryOpenPicture: (name: string) => string;
    /**
     * The name of a tile that opens a video [kpadopt6-media]
     */
    galleryOpenVideo: (name: string) => string;
    /**
     * The heading of a picture that would not load [kpadopt6-media]
     */
    galleryPictureFailed: string;
    /**
     * Its sentence in the lightbox [kpadopt6-media]
     */
    galleryPictureFailedText: string;
    /**
     * The accessible name of a picture's Retry [kpadopt6-media]
     */
    galleryRetryPicture: (name: string) => string;
    /**
     * The lightbox's previous button [kpadopt6-media]
     */
    galleryPrevious: string;
    /**
     * The lightbox's next button [kpadopt6-media]
     */
    galleryNext: string;
    /**
     * The reason previous is off at the first picture [kpadopt6-media]
     */
    galleryFirst: string;
    /**
     * The reason next is off at the last picture [kpadopt6-media]
     */
    galleryLast: string;
    /**
     * The sheet's heading for the lightbox keys [kpadopt6-media]
     */
    galleryKeyGroup: string;
    /**
     * The sheet's words for Left [kpadopt6-media]
     */
    galleryKeyPrevious: string;
    /**
     * The sheet's words for Right [kpadopt6-media]
     */
    galleryKeyNext: string;
    /**
     * The sheet's words for Home [kpadopt6-media]
     */
    galleryKeyFirst: string;
    /**
     * The sheet's words for End [kpadopt6-media]
     */
    galleryKeyLast: string;
    /**
     * The sheet's words for z [kpadopt6-media]
     */
    galleryKeyZoom: string;
    /**
     * The sheet's words for + [kpadopt6-media]
     */
    galleryKeyZoomIn: string;
    /**
     * The sheet's words for - [kpadopt6-media]
     */
    galleryKeyZoomOut: string;
    /**
     * The sheet's words for f [kpadopt6-media]
     */
    galleryKeyFull: string;
};
/**
 * @typedef {object} ViewerPreviewGalleryStrings
 * @property {string} viewerOpenNew  The viewer's "Open in a new tab" button (js/viewer.js) [kpadopt6-media]
 * @property {string} viewerDownload  The viewer's Download button [kpadopt6-media]
 * @property {string} viewerPrint  The viewer's Print button [kpadopt6-media]
 * @property {string} viewerCopyLink  The viewer's Copy link button [kpadopt6-media]
 * @property {string} viewerNoFile  The reason a viewer button is off when there is no file [kpadopt6-media]
 * @property {string} viewerLoading  The busy card's words while a file opens [kpadopt6-media]
 * @property {string} viewerFailedTitle  The failed stage's heading [kpadopt6-media]
 * @property {string} viewerFailedText  The failed stage's sentence when the server gave none [kpadopt6-media]
 * @property {string} viewerUnsupportedTitle  The heading of the stage that cannot show this kind of file here [kpadopt6-media]
 * @property {string} viewerUnsupportedText  Its sentence [kpadopt6-media]
 * @property {string} viewerRetry  The failed stage's Retry [kpadopt6-media]
 * @property {(index: number, total: number) => string} viewerPosition  The exact position in a set: "4 of 37" [kpadopt6-media]
 * @property {string} previewKeyGroup  The sheet's heading for the preview keys (js/docpreview.js) [kpadopt6-media]
 * @property {string} previewKeyOpen  The sheet's words for o [kpadopt6-media]
 * @property {string} previewKeyDownload  The sheet's words for d [kpadopt6-media]
 * @property {string} previewKeyPrint  The sheet's words for p [kpadopt6-media]
 * @property {string} previewKeyPrevious  The sheet's words for Left in a group of documents [kpadopt6-media]
 * @property {string} previewKeyNext  The sheet's words for Right in a group of documents [kpadopt6-media]
 * @property {string} previewTimeout  The sentence when a file takes too long to open [kpadopt6-media]
 * @property {string} previewGone  The sentence when the server says the file is gone [kpadopt6-media]
 * @property {(status: number) => string} previewServer  The sentence when the server answered with an error [kpadopt6-media]
 * @property {string} previewNoPdf  The sentence when this browser cannot show a PDF here [kpadopt6-media]
 * @property {string} previewShownByBrowser  The line under a PDF's title: how it is shown [kpadopt6-media]
 * @property {string} previewImage  The sentence when a picture would not load [kpadopt6-media]
 * @property {string} previewNoFile  The reason an opener is off when there is no file yet [kpadopt6-media]
 * @property {string} docKindImage  The facts word of a picture file [kpadopt6-media]
 * @property {string} docKindText  The facts word of a text file [kpadopt6-media]
 * @property {string} docMissing  The name of a document glyph whose file is missing [kpadopt6-media]
 * @property {(kind: string) => string} docKindName  The name of a document glyph: "PDF document" [kpadopt6-media]
 * @property {string} galleryContinue  The button that opens the picture last looked at (js/gallery.js) [kpadopt6-media]
 * @property {string} galleryFailed  The failed gallery's heading [kpadopt6-media]
 * @property {string} galleryFailedText  Its sentence [kpadopt6-media]
 * @property {string} galleryEmpty  The empty gallery's heading [kpadopt6-media]
 * @property {string} galleryEmptyText  Its sentence [kpadopt6-media]
 * @property {string} galleryEmptyAdd  Its sentence when pictures can be added [kpadopt6-media]
 * @property {string} galleryRetry  The Retry of a failed gallery or picture [kpadopt6-media]
 * @property {string} galleryAdd  The add tile's words [kpadopt6-media]
 * @property {string} galleryLoading  The busy card's words while the gallery loads [kpadopt6-media]
 * @property {string} galleryPicture  What a picture without a name is called [kpadopt6-media]
 * @property {(name: string) => string} galleryOpenPicture  The name of a tile that opens a picture [kpadopt6-media]
 * @property {(name: string) => string} galleryOpenVideo  The name of a tile that opens a video [kpadopt6-media]
 * @property {string} galleryPictureFailed  The heading of a picture that would not load [kpadopt6-media]
 * @property {string} galleryPictureFailedText  Its sentence in the lightbox [kpadopt6-media]
 * @property {(name: string) => string} galleryRetryPicture  The accessible name of a picture's Retry [kpadopt6-media]
 * @property {string} galleryPrevious  The lightbox's previous button [kpadopt6-media]
 * @property {string} galleryNext  The lightbox's next button [kpadopt6-media]
 * @property {string} galleryFirst  The reason previous is off at the first picture [kpadopt6-media]
 * @property {string} galleryLast  The reason next is off at the last picture [kpadopt6-media]
 * @property {string} galleryKeyGroup  The sheet's heading for the lightbox keys [kpadopt6-media]
 * @property {string} galleryKeyPrevious  The sheet's words for Left [kpadopt6-media]
 * @property {string} galleryKeyNext  The sheet's words for Right [kpadopt6-media]
 * @property {string} galleryKeyFirst  The sheet's words for Home [kpadopt6-media]
 * @property {string} galleryKeyLast  The sheet's words for End [kpadopt6-media]
 * @property {string} galleryKeyZoom  The sheet's words for z [kpadopt6-media]
 * @property {string} galleryKeyZoomIn  The sheet's words for + [kpadopt6-media]
 * @property {string} galleryKeyZoomOut  The sheet's words for - [kpadopt6-media]
 * @property {string} galleryKeyFull  The sheet's words for f [kpadopt6-media]
 */
/** @type {ViewerPreviewGalleryStrings} */
export declare const VIEWER_PREVIEW_GALLERY_STRINGS: ViewerPreviewGalleryStrings;
