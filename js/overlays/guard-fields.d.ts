/** What the guard reads: the form controls and the package's pressed controls (a switch, a segmented chip). */
export declare const FIELDS = "input:not([type=\"hidden\"], [type=\"button\"], [type=\"submit\"], [type=\"reset\"], [type=\"file\"]), select, textarea, [role=\"switch\"], [role=\"checkbox\"], [role=\"radio\"], [contenteditable=\"true\"]";
/** Everything the box's form holds, in document order, as one string. @param {Element} box */
export declare function readForm(box: Element): string;
