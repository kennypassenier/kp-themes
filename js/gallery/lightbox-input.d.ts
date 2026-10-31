export type Lightbox = import('./lightbox.js').Lightbox;
/** @typedef {import('./lightbox.js').Lightbox} Lightbox */
/** The controls fade after a few seconds without movement; they come back on movement or focus; never when calm. @param {Lightbox} lb */
export declare function installChrome(lb: Lightbox): void;
/** A swipe on a phone: sideways steps, down closes. Where it started sits on the lightbox (`lb.swipe`). @param {Lightbox} lb */
export declare function installSwipe(lb: Lightbox): void;
/** The address carries the open picture; the back button closes the lightbox first. @param {Lightbox} lb @param {string} id */
export declare function installHash(lb: Lightbox, id: string): void;
