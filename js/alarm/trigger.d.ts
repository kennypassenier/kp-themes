import { Controller } from '../controller.js';
export type TriggerOptions = {
    strings?: Partial<import('../strings.js').Strings>;
    show: (options: import('../alarm.js').AlarmOptions) => Promise<unknown>;
};
/** @typedef {{ strings?: Partial<import('../strings.js').Strings>, show: (options: import('../alarm.js').AlarmOptions) => Promise<unknown> }} TriggerOptions */
export declare class AlarmTrigger extends Controller {
    settings: TriggerOptions;
    /**
     * @param {HTMLElement} host the trigger
     * @param {TriggerOptions} options
     */
    constructor(host: HTMLElement, options: TriggerOptions);
    connect(): void;
    raise(): void;
}
/**
 * Wire the triggers below `root` (not `root` itself), except those already wired.
 * @param {ParentNode} root
 * @param {TriggerOptions} options
 * @returns {() => void} detach
 */
export declare function attachTriggers(root: ParentNode, options: TriggerOptions): () => void;
