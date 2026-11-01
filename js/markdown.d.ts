export { MARKDOWN_LIMIT } from './markdown/values.js';
export { safeHref } from './markdown/inline.js';
export { markdownFragment } from './markdown/reader.js';
export { MARKDOWN_TASK_EVENT, toggleTaskLine } from './markdown/tasks.js';
export type MarkdownOptions = {
    /**
     * the level a `#` heading is written at, 1 to 6 (default 4); deeper headings follow, to 6
     */
    headings?: number;
    /**
     * the most characters read (default 40 000); more is cut at a line with a sentence saying so
     */
    limit?: number;
    /**
     * `- [ ] item` and `- [x] item` as checkboxes [habits-1101]: `off` (default) leaves them
     * text, `show` draws the box disabled, `toggle` lets it be ticked and fires `kp-markdown-task` `{ line, checked, text }` on it;
     * `toggleTaskLine(text, line, checked)` gives the text with that box changed
     */
    tasks?: 'off' | 'show' | 'toggle';
};
/**
 * @typedef {object} MarkdownOptions
 * @property {number} [headings] the level a `#` heading is written at, 1 to 6 (default 4); deeper headings follow, to 6
 * @property {number} [limit] the most characters read (default 40 000); more is cut at a line with a sentence saying so
 * @property {'off' | 'show' | 'toggle'} [tasks] `- [ ] item` and `- [x] item` as checkboxes [habits-1101]: `off` (default) leaves them
 *   text, `show` draws the box disabled, `toggle` lets it be ticked and fires `kp-markdown-task` `{ line, checked, text }` on it;
 *   `toggleTaskLine(text, line, checked)` gives the text with that box changed
 */
