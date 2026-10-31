export type CommandSecret = {
    value: string;
    name: string;
};
/** @typedef {{ value: string, name: string }} CommandSecret */
/**
 * Take the secrets out of the code: each is replaced by a mark the line layout keeps, and returned in order.
 * @param {Element} code
 * @returns {CommandSecret[]}
 */
export declare function takeSecrets(code: Element): CommandSecret[];
/** The masked face of a value. @param {string} value @param {string} look `dots` or `tail` */
export declare function maskOf(value: string, look: string): string;
/**
 * Put every secret back into the laid-out lines as a masked span, and return the command as it is copied (the real values).
 * @param {Document} doc @param {Element} code @param {CommandSecret[]} secrets
 * @param {{ look: string, hidden: (name: string) => string }} how
 * @returns {string}
 */
export declare function placeSecrets(doc: Document, code: Element, secrets: CommandSecret[], { look, hidden }: {
    look: string;
    hidden: (name: string) => string;
}): string;
/**
 * The Show button: pressed in, the secrets show; its cell holds both words, so it keeps one width.
 * @param {Document} doc @param {{ show: string, hide: string, label: string }} words @param {string} codeId
 */
export declare function revealButton(doc: Document, words: {
    show: string;
    hide: string;
    label: string;
}, codeId: string): HTMLButtonElement;
/**
 * Show or mask every secret of a block.
 * @param {Element} code @param {CommandSecret[]} secrets @param {boolean} shown @param {string} look
 * @param {(name: string) => string} hidden
 */
export declare function showSecrets(code: Element, secrets: CommandSecret[], shown: boolean, look: string, hidden: (name: string) => string): void;
