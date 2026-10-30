/** The codes this module looks after. */
export declare const QR = "[data-kp-qr]";
/** Fired when the link was copied: `{ value }`. */
export declare const QR_COPY_EVENT = "kp-qr-copy";
/** Fired when a hidden code is shown or hidden: `{ shown }`. */
export declare const QR_REVEAL_EVENT = "kp-qr-reveal";
/** Fired once when the link's time ran out. */
export declare const QR_EXPIRED_EVENT = "kp-qr-expired";
/** Fired by the Retry of a code that could not be made. */
export declare const QR_RETRY_EVENT = "kp-qr-retry";
/** The characters of a link shown before it is folded behind "Show all". */
export declare const QR_FOLD = 160;
/** The error correction levels, lowest first. */
export declare const QR_LEVELS: readonly string[];
/** The plate's colours: dark modules on a light plate, whatever the theme (see the header). */
export declare const QR_PLATE: Readonly<{
    ground: "#ffffff";
    ink: "#000000";
}>;
export type QrSpec = import('../qr.js').QrSpec;
export type QrState = {
    open: boolean;
    spec: QrSpec;
    mode: string;
    timer: number;
    shown: boolean;
    said: string;
    card: import('../busy-card.js').BusyCard | null;
    expired: boolean;
};
/** @param {string} className @param {string} [tag] */
export declare const el: (className: string, tag?: string) => HTMLElement;
/** @param {Element} root @param {string} name @param {string} fallback */
export declare const attr: (root: Element, name: string, fallback: string) => string;
/** @param {HTMLElement} root */
export declare function stateOf(root: HTMLElement): QrState;
/** @param {HTMLElement} root */
export declare const valueOf: (root: HTMLElement) => string;
/** @param {HTMLElement} root @param {string} message */
export declare function say(root: HTMLElement, message: string): void;
