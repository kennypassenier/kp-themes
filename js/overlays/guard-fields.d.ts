/** What the guard reads: the form controls and the package's pressed controls (a switch, a segmented chip). */
export declare const FIELDS = "input:not([type=\"hidden\"], [type=\"button\"], [type=\"submit\"], [type=\"reset\"], [type=\"file\"]), select, textarea, [role=\"switch\"], [role=\"checkbox\"], [role=\"radio\"], [contenteditable=\"true\"]";
/** The controls the guard reads inside a box, one per widget, in document order. @param {Element} box @returns {Element[]} */
export declare function formControls(box: Element): Element[];
/** What each control of the box holds, in document order. @param {Element} box @returns {string[]} */
export declare function readFormValues(box: Element): string[];
/** Everything the box's form holds, in document order, as one string. @param {Element} box */
export declare function readForm(box: Element): string;
/** The place of a field among the box's controls (-1 when the box does not read it). @param {Element} box @param {Element} field */
export declare function controlIndex(box: Element, field: Element): number;
