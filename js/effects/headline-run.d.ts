export type EffectsContext = import('../effects.js').EffectsContext;
export declare class HeadlineRun {
    ctx: import("../effects.js").EffectsContext;
    el: Element;
    atRest: boolean;
    text: string;
    routine: string;
    /** @param {EffectsContext} ctx @param {Element} el @param {boolean} atRest straight to rest, as a detach does for a reveal it never started */
    constructor(ctx: EffectsContext, el: Element, atRest: boolean);
    /** The headline: decipher, then one slice burst [TH119], or the routine the theme asked for. */
    play(): void;
    /**
     * The head snippet marked the page as a repeat view and left its title legible [title-1270]; this headline plays after all
     * (`data-kp-reveal-every="load"`, or text the page has not shown), so the mark comes off and the register hides the title for
     * its wipe again.
     */
    playAfterAll(): void;
    /** Hand the element to the routine it asked for. */
    perform(): void;
    /** The element ends as its own text, announced as played or skipped. @param {boolean} skipped */
    rest(skipped: boolean): void;
    /**
     * A finish that runs once: `undo`, then the rest state, then one less pending reveal. It is registered with the finishers, so
     * a detach or a switch to reduced motion ends the reveal at rest.
     * @param {() => void} [undo]
     */
    once(undo?: () => void): () => void;
    /** Finish when an event of the element matches. @param {string} type @param {() => void} finish @param {(event: Event) => boolean} matching */
    whenHeard(type: string, finish: () => void, matching: (event: Event) => boolean): void;
    /** One class the register animates by `keyframe`; without an animation the class comes off by the table's duration. @param {string} cls @param {string} keyframe */
    timedClass(cls: string, keyframe: string): void;
}
