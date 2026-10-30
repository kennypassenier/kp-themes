import { getStrings } from '../strings.js';
export type QrState = import('./state.js').QrState;
export type Strings = ReturnType<typeof getStrings>;
export type QrShown = 'ready' | 'loading' | 'empty' | 'error' | 'expired';
/** Make the code, or say why not, and draw everything around it. @param {HTMLElement} root */
export declare function render(root: HTMLElement): void;
