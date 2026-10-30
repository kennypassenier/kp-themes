export type ThemeName = import('./values.js').ThemeName;
/** @typedef {import('./values.js').ThemeName} ThemeName */
/**
 * Listen for theme changes, whoever made them: this tab's React picker,
 * this tab's framework-free picker, or — unless declined — another tab.
 *
 * @param {(theme: ThemeName, detail: { previous: ThemeName | null, root: Element }) => void} listener
 * @param {{ crossTab?: boolean, root?: Element, key?: string }} [options]
 * @returns {() => void} unsubscribe
 */
export declare function onThemeChange(listener: (theme: ThemeName, detail: {
    previous: ThemeName | null;
    root: Element;
}) => void, { crossTab, root, key }?: {
    crossTab?: boolean;
    root?: Element;
    key?: string;
}): () => void;
