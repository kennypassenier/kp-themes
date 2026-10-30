export { WHEEL, WHEEL_SPIN_EVENT, WHEEL_RESULT_EVENT, pickWeighted, wheelAngles } from './wheel/state.js';
export { setWheelItems, setWheelState, getWheelResult, spinWheel } from './wheel/spin.js';
export type WheelItem = {
    id: string;
    label: string;
    /**
     * 1 by default; larger is likelier and a larger segment
     */
    weight?: number;
    /**
     * a short line about the choice, shown in the answer card and the segment's tooltip
     */
    tag?: string;
    /**
     * stays on the wheel, marked, and is never drawn while another choice is not resting
     */
    resting?: boolean;
    /**
     * a shorter name for the wheel's face, used when the whole label does not fit a thin segment
     */
    short?: string;
};
/**
 * @typedef {object} WheelItem
 * @property {string} id
 * @property {string} label
 * @property {number} [weight]  1 by default; larger is likelier and a larger segment
 * @property {string} [tag]  a short line about the choice, shown in the answer card and the segment's tooltip
 * @property {boolean} [resting]  stays on the wheel, marked, and is never drawn while another choice is not resting
 * @property {string} [short]  a shorter name for the wheel's face, used when the whole label does not fit a thin segment
 */
/**
 * Wire every wheel under `scope`: its parts and its Spin button.
 * @param {ParentNode} [scope]
 * @returns {() => void} detach
 */
export declare function attachWheels(scope?: ParentNode): () => void;
