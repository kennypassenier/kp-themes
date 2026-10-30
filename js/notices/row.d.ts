export type Notice = import('../notices.js').Notice;
export type NoticeSource = import('../notices.js').NoticeSource;
export type Strings = ReturnType<typeof import('../strings.js').getStrings>;
/**
 * One notice: its mark, what happened since when, what it affects and what to do, and its actions.
 * @param {Document} doc @param {Strings} t @param {Notice} n @param {boolean} read
 */
export declare function noticeRow(doc: Document, t: Strings, n: Notice, read: boolean): HTMLElement;
/**
 * A switch that mutes one source.
 * @param {Document} doc @param {Strings} t @param {NoticeSource} src
 */
export declare function sourceSwitch(doc: Document, t: Strings, src: NoticeSource): HTMLElement;
