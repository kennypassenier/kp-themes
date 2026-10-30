/** The chips this module draws. */
export declare const VERSION_DELTA = "[data-kp-version-to], [data-kp-version-from], .kp-badge--version[data-kp-state]";
/** Fired on the chip after Shift+click copied it: `{ text }`. */
export declare const VERSION_COPY_EVENT = "kp-version-copy";
/** The levels a jump has, loudest last in a sort. */
export declare const VERSION_LEVELS: readonly ['same', 'other', 'patch', 'minor', 'major', 'downgrade', 'unknown'];
/** The sort value of each level: the risky first when sorted down. */
export declare const VERSION_SORT: Readonly<{
    downgrade: 4;
    major: 3;
    minor: 2;
    patch: 1;
    other: 0;
    same: 0;
    unknown: 0;
}>;
/** How many numbers a `semver` version reads. */
export declare const SEMVER_NUMBERS = 3;
/** How many characters of a `sha256:` digest the short form keeps. */
export declare const DIGEST_SHORT_CHARS = 12;
/** The attributes that redraw a chip. */
export declare const VERSION_OBSERVED: string[];
