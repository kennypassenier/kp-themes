/**
 * The lines of a command, each with whether it carries on from the line before.
 * @param {string} text the command as written
 * @param {readonly string[]} continues the line ends that carry the command on (a continuation mark, a pipe)
 * @returns {{ text: string, continued: boolean }[]}
 */
export declare function commandLines(text: string, continues: readonly string[]): {
    text: string;
    continued: boolean;
}[];
/**
 * Every line on a line of its own, behind the prompt the stylesheet draws; the newlines stay in the text (in
 * hidden spans), so a copy is the command as written.
 * @param {Document} doc @param {Element} code @param {readonly string[]} continues
 */
export declare function layoutLines(doc: Document, code: Element, continues: readonly string[]): void;
