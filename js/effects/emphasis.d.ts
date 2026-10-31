import { EffectHook } from '../effects-core/hook.js';
/** Emphasis: marks clear themselves, or on a trigger [TH120]. */
declare class EmphasisHook extends EffectHook {
    /** @param {Element[]} marks @param {number} first @param {number} step @param {Element} on @param {string} routine */
    clearInSteps(marks: Element[], first: number, step: number, on: Element, routine: string): void;
    /** @param {Element} container an element carrying data-kp-reveal="emphasis" */
    emphasis(container: Element): void;
    /** @param {Element[]} marks @param {Element} container @param {string} routine */
    atRest(marks: Element[], container: Element, routine: string): void;
    /**
     * The dossier: the marks stay covered until the trigger opens the file; the register staggers the lift. A second press
     * closes it. Armed is a state, and it was the one nobody could see: nothing has happened yet, so nothing is announced
     * [TF2], but it is readable, or "waiting for a click" and "never wired at all" look identical from outside.
     * @param {Element} trigger @param {Element[]} marks @param {Element} container @param {string} routine
     */
    arm(trigger: Element, marks: Element[], container: Element, routine: string): void;
    /** @param {Element} trigger @param {Element[]} marks @param {Element} container @param {string} routine */
    wireTrigger(trigger: Element, marks: Element[], container: Element, routine: string): void;
    /** A press on the trigger opens or closes the file. @param {Element} trigger @param {Element[]} marks @param {Element} container @param {string} routine */
    toggle(trigger: Element, marks: Element[], container: Element, routine: string): void;
    /** The marks outside any emphasis container clear on load, one after another. @param {ParentNode} scope */
    looseMarks(scope: ParentNode): void;
}
/** Make the emphasis hook of one attach. @param {import('../effects.js').EffectsContext} ctx */
export declare function install(ctx: import('../effects.js').EffectsContext): EmphasisHook;
export {};
