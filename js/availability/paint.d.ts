/** @param {HTMLElement} root @param {string} message */
export declare function say(root: HTMLElement, message: string): void;
/** Write one cell's face from its answer. @param {HTMLElement} root @param {HTMLElement} cell */
export declare function paintCell(root: HTMLElement, cell: HTMLElement): void;
/** Write the summary row, the best column and the lines around the grid. @param {HTMLElement} root */
export declare function paintSummary(root: HTMLElement): void;
/** Draw the whole grid from the state. @param {HTMLElement} root */
export declare function render(root: HTMLElement): void;
