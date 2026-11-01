export type TakenExit = {
    target: Element;
    keyframes: Keyframe[];
    pseudoElement: string | null | undefined;
    timing: EffectTiming;
    end: number;
};
/**
 * @typedef {{ target: Element, keyframes: Keyframe[], pseudoElement: string | null | undefined, timing: EffectTiming, end: number }} TakenExit
 */
/**
 * Play each taken-over exit turned around, ending at the timeline's end.
 * @param {TakenExit[]} exits
 * @param {number} total the length of the whole leave
 * @returns {Animation[]}
 */
export declare function playTurnedExits(exits: TakenExit[], total: number): Animation[];
