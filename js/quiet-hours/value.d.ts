/**
 * A value read from whatever the page wrote, with the defaults for what is missing. Pure.
 * @param {unknown} raw an object, or its JSON text
 * @returns {import('./values.js').QuietValue}
 */
export declare function readQuiet(raw: unknown): import('./values.js').QuietValue;
/** @param {string} key */
export declare function severityWord(key: string): string;
/**
 * The value in words: "Quiet from 22:00 to 07:00: Every weekday. Critical still comes through." Pure.
 * @param {import('./values.js').QuietValue} value
 * @param {{ severities?: readonly { key: string, label: string }[], firstDay?: number }} [options]
 * @returns {string}
 */
export declare function quietSummary(value: import('./values.js').QuietValue, { severities, firstDay }?: {
    severities?: readonly {
        key: string;
        label: string;
    }[];
    firstDay?: number;
}): string;
