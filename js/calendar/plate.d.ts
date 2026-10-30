/**
 * The plate over a calendar's grid, in every tone [r1r2-1019]: an empty month keeps its six quiet rows under a centred plate, a
 * month that could not be read is dimmed under one with Retry (`kp-calendar-retry`). A calm calendar says its own calm words
 * ("Nothing logged this month"); any other says the page's words (`setCalendarState`'s `words`, else the package's "Nothing to
 * show." / "Could not be read."). The state line keeps its row and its words for a screen reader but is not drawn a second time.
 * @param {import('./controller.js').CalendarController} c
 */
export declare function syncStatePlate(c: import('./controller.js').CalendarController): void;
