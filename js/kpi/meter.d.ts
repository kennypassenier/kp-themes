/**
 * What a meter draws for a share and a mark: the fill (0 to 1), whether the
 * share runs past the end, the mark's place (0 to 1, null without one) and
 * whether it lies past the end, and the `aria-valuenow` (0 to 100). A share
 * or a mark below 0 counts as 0; one that is not a number is not measured.
 * @param {number | null | undefined} value 0..∞ (1 is full)
 * @param {number | null | undefined} [mark] 0..∞
 * @returns {{ measured: boolean, fill: number, over: boolean, mark: number | null, markOver: boolean, now: number | null }}
 */
export declare function meterParts(value: number | null | undefined, mark?: number | null | undefined): {
    measured: boolean;
    fill: number;
    over: boolean;
    mark: number | null;
    markOver: boolean;
    now: number | null;
};
/**
 * The words a meter is read by: the real share, never clamped
 * (`130% booked for tonight`), and the mark's share with its label, as
 * `62% full; 80% the target level`. No number reads `meterNotMeasured`.
 * @param {number | null | undefined} value 0..∞ (1 is full)
 * @param {number | null | undefined} [mark] 0..∞
 * @param {{ unit?: string, label?: string, markLabel?: string }} [words] `label` is `meterUsed` unless given
 * @returns {string}
 */
export declare function meterText(value: number | null | undefined, mark?: number | null | undefined, { unit, label, markLabel }?: {
    unit?: string;
    label?: string;
    markLabel?: string;
}): string;
export type Meter = {
    /**
     * the share, 0 up (1 is full; above 1 the bar is full and says so); null is not measured
     */
    value?: number | null;
    /**
     * a tick at this share (a target, a limit, what is booked), 0 up; null is none
     */
    mark?: number | null;
    /**
     * the fill's colour (`success` good, `neutral` quiet); a tone on the tile around it does the same
     */
    tone?: 'success' | 'neutral' | 'warning' | 'destructive' | null;
    /**
     * what the share is, in the words a screen reader hears ("full"); `meterUsed` unless given
     */
    label?: string;
    /**
     * what the mark is ("the target level")
     */
    markLabel?: string;
    /**
     * the track pulses at its height, with no fill and no mark
     */
    loading?: boolean;
};
/**
 * @typedef {object} Meter
 * @property {number | null} [value] the share, 0 up (1 is full; above 1 the bar is full and says so); null is not measured
 * @property {number | null} [mark] a tick at this share (a target, a limit, what is booked), 0 up; null is none
 * @property {'success' | 'neutral' | 'warning' | 'destructive' | null} [tone] the fill's colour (`success` good, `neutral` quiet); a tone on the tile around it does the same
 * @property {string} [label] what the share is, in the words a screen reader hears ("full"); `meterUsed` unless given
 * @property {string} [markLabel] what the mark is ("the target level")
 * @property {boolean} [loading] the track pulses at its height, with no fill and no mark
 */
/**
 * Write a `.kp-meter`'s share, mark, tone and ARIA in one call: `--kp-value`
 * and `--kp-mark`, `role="meter"` with `aria-valuenow` (0 to 100) and an
 * `aria-valuetext` that names the real share (meterText()). Above 1 the
 * fill is full and the meter carries `data-kp-over`; a mark above 1 sits at
 * the end with a ▸ and carries it too. The mark is a `.kp-meter__mark`
 * child, made the first time a meter has one.
 * @param {HTMLElement} el
 * @param {Meter} meter
 */
export declare function setMeter(el: HTMLElement, { value, mark, tone, label, markLabel, loading }: Meter): void;
