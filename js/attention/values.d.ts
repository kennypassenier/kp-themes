/** The band, and the severities it orders by, worst first. */
export declare const ATTENTION = ".kp-attention";
export declare const SEVERITIES: readonly ['critical', 'warning', 'info'];
/** The alert flavour each severity wears. */
export declare const FLAVOUR: {
    critical: string;
    warning: string;
    info: string;
};
/** The glyph in each severity's round icon; not words, so not in the dictionary. */
export declare const GLYPH: {
    critical: string;
    warning: string;
    info: string;
};
/** Where an item stands among the severities: unknown severities come last. @param {Element} el */
export declare const rank: (el: Element) => number;
