/** The attributes of a mark that redraw it when they change. */
export declare const AVATAR_ATTRIBUTES: string[];
/** The statuses a mark can show. */
export declare const IDMARK_STATUSES: readonly string[];
/**
 * The avatar part of a mark: its photo, its status dot and how a screen reader
 * hears it.
 * @param {HTMLElement} el @param {string} name
 */
export declare function decorateAvatar(el: HTMLElement, name: string): void;
