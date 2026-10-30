/** Say something on the card's live line, unless announcing is off. @param {import('./controller.js').QuoteController} c @param {string} text */
export declare function say(c: import('./controller.js').QuoteController, text: string): void;
/** Hide the card at once, with an Undo; the page hears about it when the window closes. @param {import('./controller.js').QuoteController} c */
export declare function hide(c: import('./controller.js').QuoteController): void;
/** Copy the words to the clipboard and say how it went. @param {import('./controller.js').QuoteController} c */
export declare function copy(c: import('./controller.js').QuoteController): Promise<void>;
