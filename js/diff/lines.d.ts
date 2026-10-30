export type DiffLine = import('./types.js').DiffLine;
export type DiffState = import('./types.js').DiffState;
export type NormFile = import('./types.js').NormFile;
export type Segment = import('./types.js').Segment;
/**
 * Draw one file's lines into its body.
 * @param {HTMLElement} root @param {DiffState} st @param {NormFile} file @param {HTMLElement} body
 */
export declare function fillBody(root: HTMLElement, st: DiffState, file: NormFile, body: HTMLElement): void;
