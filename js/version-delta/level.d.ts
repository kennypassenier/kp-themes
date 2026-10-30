export type VersionLevel = import('../version-delta.js').VersionLevel;
export type LevelOptions = import('../version-delta.js').LevelOptions;
/** @typedef {import('../version-delta.js').VersionLevel} VersionLevel */
/** @typedef {import('../version-delta.js').LevelOptions} LevelOptions */
/**
 * The numbers in a version, in order: `v10.11.11` gives [10, 11, 11], linuxserver's `5.2.3_v2.0.14-ls474` gives
 * [5, 2, 3, 2, 0, 14, 474]. The same reading the host's pin check uses.
 * @param {string} version
 * @returns {number[]}
 */
export declare function versionNumbers(version: string): number[];
/**
 * How big a jump is: `major` (the first number rose, or the second for an app that asks for it), `minor` (the second),
 * `patch` (any later number), `downgrade` (a number fell), `same`, `other` (something changed that has no numbers in
 * it, such as a digest) or `unknown` (a version is missing, or the scheme does not read numbers).
 *
 * @param {string | null | undefined} from
 * @param {string | null | undefined} to
 * @param {LevelOptions} [options]
 * @returns {VersionLevel}
 */
export declare function versionLevel(from: string | null | undefined, to: string | null | undefined, { scheme, bigAt, app, bigMinorApps, level }?: LevelOptions): VersionLevel;
/**
 * The level of each jump of a list counted exactly, and the words for a heading ("2 major, 5 minor, 3 patch").
 * @param {readonly { from?: string | null, to?: string | null, app?: string, level?: VersionLevel | 'auto' }[]} list
 * @param {LevelOptions} [options]
 * @returns {{ total: number, counts: Record<VersionLevel, number>, text: string }}
 */
export declare function summarizeDeltas(list: readonly {
    from?: string | null;
    to?: string | null;
    app?: string;
    level?: VersionLevel | 'auto';
}[], options?: LevelOptions): {
    total: number;
    counts: Record<VersionLevel, number>;
    text: string;
};
