export declare const HOOKS: Readonly<{
    surface: "data-kp-surface";
    reveal: "data-kp-reveal";
    revealTrigger: "data-kp-reveal-trigger";
    revealEvery: "data-kp-reveal-every";
    divider: "data-kp-divider";
    /** A row of items a theme may run [M1, 2026-09-08]. */
    marquee: "data-kp-marquee";
    label: "data-kp-label";
    /** The label a stamp takes once the file is open [S49, A11]. */
    labelOpen: "data-kp-label-open";
    /** Set on the container while the file is open. */
    openState: "data-kp-open";
    navSide: "data-kp-nav-side";
    /**
     * A number that counts up to what it already says [feat-count-1].
     *
     * The element's authored text is the truth and the module never
     * invents one: it reads the number out of that text, counts to it,
     * and puts the text back exactly as written. A page that never
     * attaches this module, or a reader who asked for less movement,
     * sees the final number and nothing else — which is the frozen bar.
     */
    count: "data-kp-count";
    /** `armed` | `running` | `done`, readable at any moment [KT16]. */
    countState: "data-kp-count-state";
}>;
/** The surfaces a section can stand on [TH116]. */
export declare const SURFACES: readonly string[];
/** What an element can be revealed as [TH119, TH120, TH122]. */
export declare const REVEALS: readonly string[];
/**
 * The routine names a theme may put in a reveal knob, and the arrival
 * names it may put in `--kp-arrival` [G6, 2026-09-08]. A value outside
 * these lists used to fall through the whole chain to the last branch —
 * the glyph noise of cyberpunk — so one letter wrong in a register gave a
 * theme the loudest effect in the package with no warning at all. It is
 * reported as `kp-effect-unknown` now, exactly like an unknown surface,
 * and the element rests instead.
 */
export declare const HEADLINE_ROUTINES: readonly string[];
/** What a theme may ask of the page's arrival: synthwave's boot line, phantom's calling card. */
export declare const ARRIVALS: readonly string[];
/**
 * The state classes this module toggles, and nothing else. Contract
 * values: a consumer may select on them, a register does.
 */
export declare const STATE: Readonly<{
    registering: "is-registering";
    revealing: "is-revealing";
    sharpening: "is-sharpening";
    in: "is-in";
    cleared: "is-cleared";
    deciphered: "is-deciphered";
    glitching: "is-glitching";
    noise: "is-noise";
    tracking: "is-tracking";
    shine: "is-shine";
    off: "is-off";
    words: "is-words";
    dissolving: "is-dissolving";
    typing: "is-typing";
    popping: "is-popping";
    settling: "is-settling";
    calibrating: "is-calibrating";
    revealed: "is-revealed";
    gilding: "is-gilding";
}>;
/**
 * The custom properties a theme declares to say which reveals it performs
 * [S45]: `--kp-reveal-headline: decipher`, `--kp-reveal-emphasis:
 * classified`, `--kp-reveal-rule: draw`. Absent or empty means quiet.
 */
export declare const ROUTINES: Readonly<{
    headline: "--kp-reveal-headline";
    emphasis: "--kp-reveal-emphasis";
    rule: "--kp-reveal-rule";
    arrival: "--kp-arrival";
}>;
/** The class names of the arrival overlay the module builds. */
export declare const ARRIVAL: Readonly<{
    root: "kp-boot";
    line: "kp-boot__line";
    skip: "kp-boot__skip";
    bar: "kp-boot__bar";
}>;
