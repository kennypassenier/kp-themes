export type AreaPlan = {
    engine: 'loading' | 'css' | 'js';
    /**
     * the height to write (loading: the least height)
     */
    height: number;
    scrolls: boolean;
    capped: boolean;
    lines: number;
    /**
     * the width the text was measured at, rounded
     */
    width: number;
    /**
     * the css engine's `--kp-autosize-min`
     */
    least?: string;
    /**
     * the css engine's `--kp-autosize-max`
     */
    most?: string;
};
/**
 * What a box needs, read from the page and not yet applied.
 * @typedef {object} AreaPlan
 * @property {'loading' | 'css' | 'js'} engine
 * @property {number} height the height to write (loading: the least height)
 * @property {boolean} scrolls
 * @property {boolean} capped
 * @property {number} lines
 * @property {number} width the width the text was measured at, rounded
 * @property {string} [least] the css engine's `--kp-autosize-min`
 * @property {string} [most] the css engine's `--kp-autosize-max`
 */
/**
 * Whether a box is left for later: it asked to skip hidden content (`data-kp-autosize-hidden="skip"`) and its content is not
 * rendered, so reading it would make the browser lay that hidden content out (in a closed `<details>` of forty rows that was
 * 60 ms a box). Its width is forgotten, so the resize observer measures it the moment it shows.
 * @param {import('./controller.js').AutosizeController} c
 */
export declare function leftForLater(c: import('./controller.js').AutosizeController): boolean;
/** Step 1: read what a box needs. Writes nothing. @param {import('./controller.js').AutosizeController} c */
export declare function readArea(c: import('./controller.js').AutosizeController): {
    c: import("./controller.js").AutosizeController;
    engine: AreaPlan['engine'];
    lh: number;
    chrome: number;
    rows: null;
    cap: undefined;
    job: null;
} | {
    c: import("./controller.js").AutosizeController;
    engine: "css" | "js" | "loading";
    lh: number;
    chrome: number;
    rows: number | null;
    cap: number | undefined;
    job: import("./fit.js").FitJob;
};
export type AreaRead = ReturnType<typeof readArea>;
/** @typedef {ReturnType<typeof readArea>} AreaRead */
/** Step 2: stage the hidden twin. Writes only the twin. @param {AreaRead} read */
export declare function stageArea(read: AreaRead): void;
/** Step 3: read the twin and work out the plan. @param {AreaRead} read @returns {AreaPlan} */
export declare function planArea({ c, engine, lh, chrome, rows, cap, job }: AreaRead): AreaPlan;
/**
 * Apply a plan. Only writes. Returns the event detail when the height changed, else null.
 * @param {import('./controller.js').AutosizeController} c @param {AreaPlan} plan
 * @returns {{ height: number, lines: number, capped: boolean } | null}
 */
export declare function writeArea(c: import('./controller.js').AutosizeController, plan: AreaPlan): {
    height: number;
    lines: number;
    capped: boolean;
} | null;
/** Size one box for its text, with the engine in use, and report the height. @param {import('./controller.js').AutosizeController} c */
export declare function measureArea(c: import('./controller.js').AutosizeController): void;
/** Size many boxes with one layout: every read, then every write, then the events. @param {import('./controller.js').AutosizeController[]} every */
export declare function measureAreas(every: import('./controller.js').AutosizeController[]): void;
