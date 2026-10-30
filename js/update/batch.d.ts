export type UpdateJob = import('../update.js').UpdateJob;
export type UpdateTiming = {
    duration: number;
    ease: string;
};
/** @typedef {import('../update.js').UpdateJob} UpdateJob */
/** @typedef {{ duration: number, ease: string }} UpdateTiming */
/** The updates of one task and the ends of the ones playing. */
export declare class UpdateBatch {
    /** The updates written in this task, by host, waiting for the one flush. @type {Map<HTMLElement, UpdateJob>} */
    pending: Map<HTMLElement, UpdateJob>;
    /** The end of the update playing on a host. @type {WeakMap<Element, () => void>} */
    running: WeakMap<Element, () => void>;
    constructor();
    /** End the update playing on `host`, if there is one. @param {HTMLElement} host */
    cancel(host: HTMLElement): void;
    /** @param {UpdateJob} job */
    enqueue(job: UpdateJob): void;
    /**
     * Mark every update written in this task at once: all reads, then all
     * writes, then the animations read back. Never a read between two writes.
     */
    flush(): void;
    /**
     * Reads. The idea on the element itself (a spark's svg may name none),
     * the host's display; then the theme's timing once per themed scope
     * (themeMotion() reads a probe it adds and takes off: once per theme,
     * not once per value). Updates whose register names no idea are resolved here.
     * @param {UpdateJob[]} jobs
     */
    readAll(jobs: UpdateJob[]): {
        job: import("../update.js").UpdateJob;
        idea: string;
        inline: boolean;
        timing: UpdateTiming;
    }[];
    /**
     * The theme's timing at `host`, read once per themed scope.
     * @param {Map<Element, UpdateTiming>} timings
     * @param {HTMLElement} host
     * @returns {UpdateTiming}
     */
    timingOf(timings: Map<Element, UpdateTiming>, host: HTMLElement): UpdateTiming;
    /**
     * Start the glide, and take the mark off when the register's keyframes and the glide are done.
     * @param {{ job: UpdateJob, timing: UpdateTiming, before: Record<string, string> }} marked
     * @param {Animation[]} cssAnimations
     * @param {number} started
     */
    play(marked: {
        job: UpdateJob;
        timing: UpdateTiming;
        before: Record<string, string>;
    }, cssAnimations: Animation[], started: number): void;
}
