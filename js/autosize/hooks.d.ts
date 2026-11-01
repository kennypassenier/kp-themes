/** One markup attribute's text, or the fallback. @param {Element} el @param {string} name @param {string} fallback */
export declare const attr: (el: Element, name: string, fallback: string) => string;
/** A script writes `value =`: the setter is the one door. @param {import('./controller.js').AutosizeController} c */
export declare function hookValueSetter(c: import('./controller.js').AutosizeController): void;
/** Mod+Enter submits, and the `?` sheet lists it. @param {import('./controller.js').AutosizeController} c */
export declare function registerSubmitKey(c: import('./controller.js').AutosizeController): void;
