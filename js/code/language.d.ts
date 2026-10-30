export type CodeSpec = import('./constants.js').CodeSpec;
/** @typedef {import('./constants.js').CodeSpec} CodeSpec */
/**
 * The JSON of `text` laid out with two-space indents, or null when it does
 * not parse.
 * @param {string} text
 */
export declare function prettyJson(text: string): string | null;
/** @param {string | undefined} language */
export declare const isJson: (language: string | undefined) => boolean;
/** @param {string | undefined} language */
export declare const isToml: (language: string | undefined) => boolean;
/** @param {string | undefined} language */
export declare const isShell: (language: string | undefined) => boolean;
/**
 * The language whose text the block colours, or null.
 * @param {CodeSpec} spec
 * @returns {'toml' | 'shell' | null}
 */
export declare const highlightKind: (spec: CodeSpec) => 'toml' | 'shell' | null;
/**
 * `auto` (and no language in a cell) is JSON only when the text is an object or a list that parses.
 * @param {CodeSpec} spec
 * @returns {CodeSpec}
 */
export declare function withLanguage(spec: CodeSpec): CodeSpec;
