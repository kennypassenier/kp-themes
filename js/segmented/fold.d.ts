export type Fold = {
    host: HTMLElement;
    button: HTMLButtonElement;
    off: () => void;
};
/**
 * Show or hide the menu that stands in for a folded group, and bring its words in line with the group.
 * @param {HTMLElement} group @param {boolean} folded
 */
export declare function syncFold(group: HTMLElement, folded: boolean): void;
/** After the group's state changed: the open or closed menu says so too. @param {Element} group */
export declare function repaintFold(group: Element): void;
/** Take the menu away for good (the group's detach). @param {Element} group */
export declare function dropFold(group: Element): void;
