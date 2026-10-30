export type DiffFile = import('./types.js').DiffFile;
export type DiffSpec = import('./types.js').DiffSpec;
/** @typedef {import('./types.js').DiffFile} DiffFile */
/** @typedef {import('./types.js').DiffSpec} DiffSpec */
/**
 * Give a diff its files or its state.
 * @param {HTMLElement} root @param {DiffSpec | DiffFile[]} spec
 */
export declare function setDiff(root: HTMLElement, spec: DiffSpec | DiffFile[]): void;
/** @param {HTMLElement} root @param {string} path */
export declare function fileOf(root: HTMLElement, path: string): {
    file: import("./types.js").NormFile;
    section: HTMLElement;
} | null;
/** Open or close one file. @param {HTMLElement} root @param {string} path @param {boolean} open @param {boolean} [announce] */
export declare function toggleFile(root: HTMLElement, path: string, open: boolean, announce?: boolean): void;
/** @param {HTMLElement} root @param {HTMLElement} button */
export declare function copyPath(root: HTMLElement, button: HTMLElement): Promise<void>;
