/**
 * The loading state: waiting rows of the last shown count, under the busy card.
 * @param {import('./controller.js').PasskeysController} c
 * @param {import('./constants.js').PasskeysSpec} spec
 */
export declare function drawLoading(c: import('./controller.js').PasskeysController, spec: import('./constants.js').PasskeysSpec): void;
/** Draw the list from what the controller holds. @param {import('./controller.js').PasskeysController} c */
export declare function draw(c: import('./controller.js').PasskeysController): void;
