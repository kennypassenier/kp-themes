export type DiffLine = {
    kind: 'same' | 'added' | 'removed';
    text: string;
    /**
     * the number shown (the new file's for a kept or added line, the old file's for a removed one)
     */
    no?: number | null;
    /**
     * used when `no` is absent
     */
    oldNo?: number | null;
    /**
     * used when `no` is absent
     */
    newNo?: number | null;
};
export type DiffHunk = {
    /**
     * the whole header, `@@ -12,6 +12,8 @@ function name`; else it is made from the four numbers
     */
    head?: string;
    oldStart?: number;
    oldLen?: number;
    newStart?: number;
    newLen?: number;
    /**
     * the place after the second `@@`
     */
    context?: string;
    lines: DiffLine[];
};
export type DiffFile = {
    path: string;
    /**
     * the name before a rename
     */
    oldPath?: string;
    /**
     * `modified`, or `renamed` when `oldPath` differs
     */
    status?: 'added' | 'removed' | 'modified' | 'renamed' | 'binary';
    /**
     * the count; counted from the lines when absent
     */
    added?: number;
    removed?: number;
    hunks?: DiffHunk[];
};
export type DiffSpec = {
    files?: DiffFile[];
    /**
     * absent: ready, or empty without files
     */
    state?: 'ready' | 'loading' | 'empty' | 'error';
    /**
     * the failed plate's heading
     */
    message?: string;
    /**
     * the names compared, for the empty plate's sentence
     */
    compared?: string[];
};
export type Segment = {
    text: string;
    changed: boolean;
};
export type NormFile = {
    path: string;
    oldPath: string;
    status: string;
    added: number;
    removed: number;
    hunks: {
        range: string;
        context: string;
        lines: DiffLine[];
    }[];
};
export type DiffState = {
    spec: DiffSpec;
    files: NormFile[];
    opened: Map<string, boolean>;
    folds: Set<string>;
    all: Set<string>;
    card: import('../busy-card.js').BusyCard | null;
    off: (() => void)[];
    mode: string;
    said: string;
};
export type Part = {
    kind: 'lines' | 'fold';
    /**
     * the index of its first line in the hunk
     */
    from: number;
    lines: DiffLine[];
};
/**
 * @typedef {object} DiffLine
 * @property {'same' | 'added' | 'removed'} kind
 * @property {string} text
 * @property {number | null} [no] the number shown (the new file's for a kept or added line, the old file's for a removed one)
 * @property {number | null} [oldNo] used when `no` is absent
 * @property {number | null} [newNo] used when `no` is absent
 */
/**
 * @typedef {object} DiffHunk
 * @property {string} [head] the whole header, `@@ -12,6 +12,8 @@ function name`; else it is made from the four numbers
 * @property {number} [oldStart]
 * @property {number} [oldLen]
 * @property {number} [newStart]
 * @property {number} [newLen]
 * @property {string} [context] the place after the second `@@`
 * @property {DiffLine[]} lines
 */
/**
 * @typedef {object} DiffFile
 * @property {string} path
 * @property {string} [oldPath] the name before a rename
 * @property {'added' | 'removed' | 'modified' | 'renamed' | 'binary'} [status] `modified`, or `renamed` when `oldPath` differs
 * @property {number} [added] the count; counted from the lines when absent
 * @property {number} [removed]
 * @property {DiffHunk[]} [hunks]
 */
/**
 * @typedef {object} DiffSpec
 * @property {DiffFile[]} [files]
 * @property {'ready' | 'loading' | 'empty' | 'error'} [state] absent: ready, or empty without files
 * @property {string} [message] the failed plate's heading
 * @property {string[]} [compared] the names compared, for the empty plate's sentence
 */
/**
 * @typedef {object} Segment
 * @property {string} text
 * @property {boolean} changed
 */
/** @typedef {{ path: string, oldPath: string, status: string, added: number, removed: number, hunks: { range: string, context: string, lines: DiffLine[] }[] }} NormFile */
/** @typedef {{ spec: DiffSpec, files: NormFile[], opened: Map<string, boolean>, folds: Set<string>, all: Set<string>, card: import('../busy-card.js').BusyCard | null, off: (() => void)[], mode: string, said: string }} DiffState */
/**
 * @typedef {object} Part
 * @property {'lines' | 'fold'} kind
 * @property {number} from the index of its first line in the hunk
 * @property {DiffLine[]} lines
 */
export {};
