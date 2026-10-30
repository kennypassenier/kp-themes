export { ALARM_CLOSE_EVENT, ALARM_OPEN_EVENT, ALARM_SECONDS } from './alarm/values.js';
export { noiseGlyph, glyphCells } from './alarm/glyphs.js';
export { buildAlarm } from './alarm/build.js';
export { writeCountdown } from './alarm/countdown.js';
export type AlarmOptions = {
    /**
     * The huge word(s). Also the alarm's accessible name.
     */
    title: string;
    /**
     * The line under the headline: what happened and what follows.
     */
    detail?: string;
    /**
     * The small line above the headline ("Security protocol 7 · lockout").
     */
    code?: string;
    /**
     * 'ack' (default): only its button closes it. 'auto': closes after `seconds`.
     */
    mode?: 'ack' | 'auto';
    /**
     * Auto only. Default 8, at least 1.
     */
    seconds?: number;
    /**
     * Ack only: Escape closes it as well. An auto alarm always accepts Escape.
     */
    escape?: boolean;
    /**
     * The button's label. Default: the dictionary's `alarmAction`.
     */
    action?: string;
    /**
     * Per-alarm words, over the dictionary.
     */
    strings?: Partial<import('./strings.js').Strings>;
    /**
     * Where focus returns and the close event is dispatched. Default: what had focus.
     */
    trigger?: HTMLElement | null;
};
export type AlarmReason = 'ack' | 'timeout' | 'escape';
/**
 * @typedef {object} AlarmOptions
 * @property {string} title  The huge word(s). Also the alarm's accessible name.
 * @property {string} [detail]  The line under the headline: what happened and what follows.
 * @property {string} [code]  The small line above the headline ("Security protocol 7 · lockout").
 * @property {'ack' | 'auto'} [mode]  'ack' (default): only its button closes it. 'auto': closes after `seconds`.
 * @property {number} [seconds]  Auto only. Default 8, at least 1.
 * @property {boolean} [escape]  Ack only: Escape closes it as well. An auto alarm always accepts Escape.
 * @property {string} [action]  The button's label. Default: the dictionary's `alarmAction`.
 * @property {Partial<import('./strings.js').Strings>} [strings]  Per-alarm words, over the dictionary.
 * @property {HTMLElement | null} [trigger]  Where focus returns and the close event is dispatched. Default: what had focus.
 */
/** @typedef {'ack' | 'timeout' | 'escape'} AlarmReason */
/**
 * Raise a full-screen alarm and wait for it to close.
 *
 *   const reason = await showAlarm({ title: 'Access denied', detail: '…', mode: 'ack' });
 *
 * @param {AlarmOptions} options
 * @returns {Promise<AlarmReason>}
 */
export declare function showAlarm(options: AlarmOptions): Promise<AlarmReason>;
/**
 * Wire `[data-kp-alarm]` triggers: a press raises the alarm the trigger
 * describes, and the close event is dispatched on the trigger with the
 * reason. The value of `data-kp-alarm` is the headline.
 *
 *   <button type="button" class="kp-button kp-button--destructive"
 *           data-kp-alarm="Access denied"
 *           data-kp-alarm-code="Security protocol 7 · lockout"
 *           data-kp-alarm-detail="Three failed attempts. This console is locked."
 *           data-kp-alarm-mode="auto" data-kp-alarm-seconds="6">Test the alarm</button>
 *
 * `data-kp-alarm-escape` (present) lets Escape close an acknowledged alarm;
 * `data-kp-alarm-action` names its button.
 *
 * @param {ParentNode} [root]
 * @param {{ strings?: Partial<import('./strings.js').Strings> }} [options]
 * @returns {() => void} detach
 */
export declare function attachAlarms(root?: ParentNode, { strings }?: {
    strings?: Partial<import('./strings.js').Strings>;
}): () => void;
