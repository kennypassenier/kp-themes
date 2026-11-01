/** A list item's text that is a task: its box and its words. */
export declare const TASK_ITEM: RegExp;
/** Fired on the checkbox, bubbling, when a reader drawn with `tasks: 'toggle'` has a task ticked or unticked: `{ line, checked, text }`. */
export declare const MARKDOWN_TASK_EVENT = "kp-markdown-task";
/**
 * Draw one task into its list item: a label that holds the checkbox and the words. `fill` writes the inline words into the span.
 * @param {HTMLLIElement} li @param {RegExpExecArray} task the TASK_ITEM match @param {number} line the source line, from 0
 * @param {'show' | 'toggle'} mode `show` draws the box disabled; `toggle` lets it be ticked and reports it
 * @param {(target: HTMLElement, text: string) => void} fill
 */
export declare function drawTask(li: HTMLLIElement, task: RegExpExecArray, line: number, mode: 'show' | 'toggle', fill: (target: HTMLElement, text: string) => void): void;
/**
 * The text with the task on `line` ticked or unticked; the text unchanged when that line holds no task.
 * @param {string} text @param {number} line from 0, as `kp-markdown-task` reports it @param {boolean} checked
 * @returns {string}
 */
export declare function toggleTaskLine(text: string, line: number, checked: boolean): string;
