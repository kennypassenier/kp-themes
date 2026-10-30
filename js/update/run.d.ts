export type SparkWrite = import('../update.js').SparkWrite;
/**
 * Show `next` in `el` the theme's way. The value is written at the call and
 * stays readable throughout; any width the new value itself needs is taken
 * then, with the value, so nothing moves while the idea plays and nothing
 * moves when it ends. The mark goes on in the batch of this task (see
 * UpdateBatch.flush()), before the next frame.
 * @param {Element} el a text element, a `.kp-state-word`, or a spark's svg
 * @param {string | number | readonly number[]} next
 * @returns {Promise<number>} how long it played, in ms; 0 when nothing played
 */
export declare function update(el: Element, next: string | number | readonly number[]): Promise<number>;
