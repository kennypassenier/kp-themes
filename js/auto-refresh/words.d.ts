/** The whole seconds a list names, or the fallback when it names none. @param {string | null} raw @param {number[]} fallback */
export declare const numbers: (raw: string | null, fallback: number[]) => number[];
/** "Every 30 s", "Every 2 min", "Paused". @param {number} seconds */
export declare const wordsFor: (seconds: number) => string;
