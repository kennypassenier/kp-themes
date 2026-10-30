/**
 * The tone of a value: warning at or past the threshold, destructive at or
 * past `bad`.
 * @param {number | null} value @param {number} threshold @param {number} [bad]
 * @returns {'' | 'warning' | 'destructive'}
 */
export declare function bulletTone(value: number | null, threshold: number, bad?: number): '' | 'warning' | 'destructive';
