/**
 * Write the roles and the state attributes the way the group's new mode reads them, and say which values were on and stay on (a
 * single group keeps the first of several, which `paint` decides). The event is not fired: the page changed the mode, the person
 * chose nothing. The caller paints.
 * @param {Element} group @param {string} was the mode before
 * @returns {string[]} the values that stay on
 */
export declare function rewriteForMode(group: Element, was: string): string[];
