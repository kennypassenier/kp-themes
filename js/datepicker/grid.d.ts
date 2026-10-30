import { calendarNames } from '../locale.js';
export type Ctl = import('./controller.js').DatePickerController;
export type Strings = import('../strings/types.js').Strings;
export type Names = ReturnType<typeof calendarNames>;
/** Draw the panel for the shown view, replacing what it held (its live region stays). @param {Ctl} ctl */
export declare function drawPanel(ctl: Ctl): void;
