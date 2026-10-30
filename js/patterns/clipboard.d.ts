/**
 * Empty the clipboard again `wait` ms from now, only if it still holds `secret` where the page may read it [wish-1120, homelab 108].
 * Shared by the display field's Copy and the input field's Copy [wish-1028].
 * @param {HTMLElement} field @param {string} secret @param {number} wait @param {(text: string) => void} say
 * @returns {() => void} cancel
 */
export declare function clearClipboardLater(field: HTMLElement, secret: string, wait: number, say: (text: string) => void): () => void;
