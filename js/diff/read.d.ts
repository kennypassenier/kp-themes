export type DiffFile = import('./types.js').DiffFile;
export type DiffHunk = import('./types.js').DiffHunk;
export type DiffState = import('./types.js').DiffState;
export type NormFile = import('./types.js').NormFile;
export type Segment = import('./types.js').Segment;
/** @param {DiffFile[]} files @returns {NormFile[]} */
export declare function normalize(files: DiffFile[]): NormFile[];
/** @param {HTMLElement} root @param {DiffState} st @param {NormFile} file @param {number} index */
export declare function isOpen(root: HTMLElement, st: DiffState, file: NormFile, index: number): boolean;
/** @param {HTMLElement} root @param {string} message */
export declare function say(root: HTMLElement, message: string): void;
/** @param {string} text @param {Segment[] | undefined} segments @returns {HTMLElement} */
export declare function textOf(text: string, segments: Segment[] | undefined): HTMLElement;
