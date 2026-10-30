/**
 * @param {import('../strings.js').Strings} strings
 * @param {boolean} grouped whether the preview has a group to step through
 * @param {() => import('./core.js').PreviewCore | undefined} runOf the preview's run, which exists once the viewer is open
 * @returns {import('../shortcuts.js').Shortcut[]}
 */
export declare function previewKeys(strings: import('../strings.js').Strings, grouped: boolean, runOf: () => import('./core.js').PreviewCore | undefined): import('../shortcuts.js').Shortcut[];
