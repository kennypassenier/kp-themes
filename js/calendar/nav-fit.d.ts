export type Calendar = import('./controller.js').CalendarController;
/**
 * Measure the one-row width of the nav with its widest month title and publish it as --kp-calendar-nav-measured.
 * @param {Calendar} c
 */
export declare function measureNavFit(c: Calendar): void;
