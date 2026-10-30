/**
 * Put the field in a state: the line, the field's validity, the error slot, the marks, and the event when something changed.
 * @param {import('./controller.js').JsonFieldController} c
 * @param {'empty' | 'valid' | 'invalid' | 'text'} next
 * @param {string} message
 * @param {{ line?: number | null, column?: number | null, keys?: number | null }} [where]
 */
export declare function setState(c: import('./controller.js').JsonFieldController, next: 'empty' | 'valid' | 'invalid' | 'text', message: string, where?: {
    line?: number | null;
    column?: number | null;
    keys?: number | null;
}): void;
/** Check the text now, and draw the gutter. @param {import('./controller.js').JsonFieldController} c */
export declare function runCheck(c: import('./controller.js').JsonFieldController): void;
