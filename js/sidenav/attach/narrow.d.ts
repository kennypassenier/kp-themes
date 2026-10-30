export type SidenavContext = import('./context.js').SidenavContext;
export type NarrowFields = {
    applyNarrow: () => void;
    applySlimBelow: () => void;
    declared: {
        mode: string | null;
        slim: boolean;
    } | null;
    hiddenAtAttach: Map<HTMLElement, boolean>;
    narrowWatch: ResizeObserver | null;
    slimHeld: boolean | null;
    still: (change: (() => void)) => void;
    threshold: (written?: string | null) => number;
};
/** @typedef {import('./context.js').SidenavContext} SidenavContext */
/**
 * What the narrow screens: when the panel hides, slims or comes back part adds to the table's context.
 *
 * @typedef {{
 *     applyNarrow: () => void;
 *     applySlimBelow: () => void;
 *     declared: { mode: string | null; slim: boolean; } | null;
 *     hiddenAtAttach: Map<HTMLElement, boolean>;
 *     narrowWatch: ResizeObserver | null;
 *     slimHeld: boolean | null;
 *     still: (change: (() => void)) => void;
 *     threshold: (written?: string | null) => number;
 * }} NarrowFields
 */
/**
 * Narrow screens: when the panel hides, slims or comes back.
 *
 * @param {SidenavContext} c
 */
export declare function installNarrow(c: SidenavContext): void;
