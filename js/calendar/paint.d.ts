export type Calendar = import('./controller.js').CalendarController;
/** @typedef {import('./controller.js').CalendarController} Calendar */
/** The month the calendar shows, as `YYYY-MM`. @param {Calendar} c */
export declare const monthKey: (c: Calendar) => string;
/** Repaint the grid in place: tones, words and the tab stop, never new buttons. @param {Calendar} c */
export declare function paintCalendar(c: Calendar): void;
