/** The moment of an option in ms, or NaN. @param {import('./constants.js').DatedOption} o */
export declare const stamp: (o: import('./constants.js').DatedOption) => number;
/** The option's first line: its name, or its date. @param {import('./controller.js').DatedController} c @param {import('./constants.js').DatedOption} o */
export declare const titleOf: (c: import('./controller.js').DatedController, o: import('./constants.js').DatedOption) => string;
/** The second line: how long ago, with the date when the first line is a name. @param {import('./controller.js').DatedController} c @param {import('./constants.js').DatedOption} o */
export declare function hintOf(c: import('./controller.js').DatedController, o: import('./constants.js').DatedOption): string;
/** The newest dated option shown, or null. @param {import('./constants.js').DatedOption[]} shown */
export declare function newestOf(shown: import('./constants.js').DatedOption[]): import("./constants.js").DatedOption | null;
/** The meta column's node: one text is one span, several are one box of spans; none is nothing [wish-1120, homelab 101]. @param {Document} doc @param {import('./constants.js').DatedOption} o */
export declare function metaOf(doc: Document, o: import('./constants.js').DatedOption): HTMLSpanElement | null;
/** The name, and the "Latest" badge on the newest. @param {import('./controller.js').DatedController} c @param {HTMLElement} parent @param {import('./constants.js').DatedOption} o */
export declare function nameLine(c: import('./controller.js').DatedController, parent: HTMLElement, o: import('./constants.js').DatedOption): void;
