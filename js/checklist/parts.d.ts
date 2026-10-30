/** An element with a class. @param {string} className @param {string} [tag] */
export declare const el: (className: string, tag?: string) => HTMLElement;
/** @param {Element} list @param {string} name @returns {HTMLElement} */
export declare function part(list: Element, name: string): HTMLElement;
/** @param {Element} list @param {string} message */
export declare function say(list: Element, message: string): void;
