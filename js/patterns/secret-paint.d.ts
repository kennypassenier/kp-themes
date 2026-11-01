export type SecretControl = import('./secret-display.js').SecretControl;
/** Draw the field's state; a value that is not shown is taken out of the page, not only covered. @param {SecretControl} c */
export declare function paintState(c: SecretControl): void;
/**
 * The words: why the field is off on the line under the buttons; reading and the countdown in the clock inside the value's box
 * [uxtouch1101], which keeps the field one height whatever it says. The room the clock takes is held free at the value's end
 * (`--kp-secret-clock`), so the value never runs under it.
 * @param {SecretControl} c
 */
export declare function writeLine(c: SecretControl): void;
