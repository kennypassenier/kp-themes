/**
 * One line of JSON as nodes: keys in `.kp-code__key`, the punctuation in
 * `.kp-code__punct`, the rest as text. A JSON string never holds a raw
 * line break, so a line is always whole.
 * @param {Document} doc @param {string} line
 */
export declare function jsonLine(doc: Document, line: string): Node[];
/**
 * Two coloured spans side by side sit 0 px from each other (`["kenny"]`, `10,`, `$(git`). The punctuation one becomes plain text of
 * the line (as the JSON colon does); with no punctuation in the pair the first one does.
 * @param {Node[]} nodes @returns {Node[]}
 */
export declare function apart(nodes: Node[]): Node[];
/**
 * One line of TOML as nodes. `state.open` carries a multi-line string (triple quotes) from one line to the next.
 * @param {Document} doc @param {string} line @param {{ open: string }} state
 */
export declare function tomlLine(doc: Document, line: string, state: {
    open: string;
}): Node[];
export type ShellContext = {
    /**
     * the next word is a command
     */
    expectCommand: boolean;
    /**
     * a `NAME=value` prefix was just seen: the value is not the command, the command after it still is
     */
    assigned: boolean;
    /**
     * whether the word after the prefix is a command
     */
    commandAfter: boolean;
};
/**
 * One line of shell as nodes: the command at the start of each command, its flags, quoted text, $variables, operators and comments.
 * @param {Document} doc @param {string} line
 */
export declare function shellLine(doc: Document, line: string): Node[];
