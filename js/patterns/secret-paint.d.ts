export type SecretControl = import('./secret-display.js').SecretControl;
/** Draw the field's state; a value that is not shown is taken out of the page, not only covered. @param {SecretControl} c */
export declare function paintState(c: SecretControl): void;
/** The line under the buttons: why the field is off, reading, the countdown, or nothing. @param {SecretControl} c */
export declare function writeLine(c: SecretControl): void;
