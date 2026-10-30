export type CalendarWeekGanttStrings = {
    /**
     * The name of a month heatmap's row of month buttons (js/calendar.js) [scope-143]
     */
    calendarNav: string;
    /**
     * A month heatmap's button to the month before; its name and title are `previousMonth` [scope-143]
     */
    calendarPrev: string;
    /**
     * Its button to the month after; its name and title are `nextMonth` [scope-143]
     */
    calendarNext: string;
    /**
     * Its button back to today's month, with today picked [scope-143]
     */
    calendarToday: string;
    /**
     * That button's title [scope-143]
     */
    calendarTodayTitle: string;
    /**
     * A day's name and title: the date (dd/mm/yyyy) and what the page says about it [scope-143]
     */
    calendarDay: (date: string, label: string) => string;
    /**
     * What a day still to come is, when the page says nothing about it [scope-143]
     */
    calendarFuture: string;
    /**
     * What every day is while the calendar loads [scope-143]
     */
    calendarLoading: string;
    /**
     * What a past day is when the page says nothing about it [scope-143]
     */
    calendarUnknown: string;
    /**
     * The name of a week agenda when the page gives none (js/week.js)
     */
    weekGroup: string;
    /**
     * The week agenda's button to the week before
     */
    weekPrev: string;
    /**
     * Its button to the week after
     */
    weekNext: string;
    /**
     * Its button back to the current week; also the word under today's date
     */
    weekToday: string;
    /**
     * The now-line's name
     */
    weekNow: string;
    /**
     * The now-line's name with the time, "now, 14:32"
     */
    weekNowAt: (time: string) => string;
    /**
     * The overflow pill's text, "+3"
     */
    weekMore: (n: number) => string;
    /**
     * The overflow pill's name, "3 more runs on Tue 17/10"
     */
    weekMoreLabel: (n: number, day: string) => string;
    /**
     * What a next run is called in a pill's name
     */
    weekNextRun: string;
    /**
     * What a switched-off item is called in a pill's name
     */
    weekOff: string;
    /**
     * What a skipped item is called in a pill's name
     */
    weekSkipped: string;
    /**
     * What a reference item (the host's own round) is called in a pill's name
     */
    weekReference: string;
    /**
     * The sentence of a week with nothing in it
     */
    weekEmpty: string;
    /**
     * The sentence of a week being read
     */
    weekLoading: string;
    /**
     * The name of a run timeline when the page gives none (js/gantt.js)
     */
    ganttGroup: string;
    /**
     * The name of the range buttons
     */
    ganttRange: string;
    /**
     * A range button's title, "Show the last 6 hours"
     */
    ganttRangeTitle: (label: string) => string;
    /**
     * The now-line's name
     */
    ganttNow: string;
    /**
     * The selected range's chip label
     */
    ganttSelection: string;
    /**
     * The button that lifts the selected range
     */
    ganttClear: string;
    /**
     * Its title
     */
    ganttClearTitle: string;
    /**
     * The chip's text, "Selected 14:00 to 16:30"
     */
    ganttSelected: (from: string, to: string) => string;
    /**
     * The sentence of a timeline with no run in the window
     */
    ganttEmpty: string;
    /**
     * The sentence of a timeline being read
     */
    ganttLoading: string;
    /**
     * A queued run's state word
     */
    ganttQueued: string;
    /**
     * A running run's state word
     */
    ganttRunning: string;
    /**
     * A running run's card line when it has a planned end, "planned until 14:30" [wish-1028]
     */
    ganttPlannedUntil: (time: string) => string;
    /**
     * A finished run's state word
     */
    ganttOk: string;
    /**
     * A failed run's state word
     */
    ganttFailed: string;
    /**
     * What the timeline's status region says when a run changes state, "Backup: failed"
     */
    ganttAnnounce: (label: string, state: string) => string;
    /**
     * A bar's name, "Backup, 02:00 to 02:14, failed"
     */
    ganttBar: (label: string, when: string, state: string) => string;
    /**
     * The button that makes the window follow now
     */
    ganttLive: string;
    /**
     * Its title
     */
    ganttLiveTitle: string;
    /**
     * The button that makes the selected range the window
     */
    ganttZoom: string;
    /**
     * Its title
     */
    ganttZoomTitle: string;
    /**
     * A length of time as a person reads it, "14 min", "1 h 5 min", "45 s"
     */
    ganttDuration: (seconds: number) => string;
    /**
     * The one-line hint under the timeline on how to read and use it
     */
    ganttHint: string;
    /**
     * The same hint of a timeline without its range toolbar (no brush): only opening a bar [gaps-time-1019]
     */
    ganttHintOpen: string;
    /**
     * The range button that fits the window to everything on the timeline (`all` in `data-kp-gantt-ranges`) [kpadopt4]
     */
    ganttAll: string;
    /**
     * Its title
     */
    ganttAllTitle: string;
    /**
     * A point event's name, "Applied, 02/10/2026" [kpadopt4]
     */
    ganttPoint: (label: string, when: string) => string;
    /**
     * The word after a planned point's name, still to come
     */
    ganttPlanned: string;
    /**
     * The name of marks too close to tell apart, "3 events: Applied, Mail, Call"
     */
    ganttCluster: (count: number, labels: string) => string;
    /**
     * The count on such a mark, "+2"
     */
    ganttClusterMore: (more: number) => string;
    /**
     * The hint under a timeline of point events
     */
    ganttPointsHint: string;
};
/**
 * @typedef {object} CalendarWeekGanttStrings
 * @property {string} calendarNav  The name of a month heatmap's row of month buttons (js/calendar.js) [scope-143]
 * @property {string} calendarPrev  A month heatmap's button to the month before; its name and title are `previousMonth` [scope-143]
 * @property {string} calendarNext  Its button to the month after; its name and title are `nextMonth` [scope-143]
 * @property {string} calendarToday  Its button back to today's month, with today picked [scope-143]
 * @property {string} calendarTodayTitle  That button's title [scope-143]
 * @property {(date: string, label: string) => string} calendarDay  A day's name and title: the date (dd/mm/yyyy) and what the page says about it [scope-143]
 * @property {string} calendarFuture  What a day still to come is, when the page says nothing about it [scope-143]
 * @property {string} calendarLoading  What every day is while the calendar loads [scope-143]
 * @property {string} calendarUnknown  What a past day is when the page says nothing about it [scope-143]
 * @property {string} weekGroup  The name of a week agenda when the page gives none (js/week.js)
 * @property {string} weekPrev  The week agenda's button to the week before
 * @property {string} weekNext  Its button to the week after
 * @property {string} weekToday  Its button back to the current week; also the word under today's date
 * @property {string} weekNow  The now-line's name
 * @property {(time: string) => string} weekNowAt  The now-line's name with the time, "now, 14:32"
 * @property {(n: number) => string} weekMore  The overflow pill's text, "+3"
 * @property {(n: number, day: string) => string} weekMoreLabel  The overflow pill's name, "3 more runs on Tue 17/10"
 * @property {string} weekNextRun  What a next run is called in a pill's name
 * @property {string} weekOff  What a switched-off item is called in a pill's name
 * @property {string} weekSkipped  What a skipped item is called in a pill's name
 * @property {string} weekReference  What a reference item (the host's own round) is called in a pill's name
 * @property {string} weekEmpty  The sentence of a week with nothing in it
 * @property {string} weekLoading  The sentence of a week being read
 * @property {string} ganttGroup  The name of a run timeline when the page gives none (js/gantt.js)
 * @property {string} ganttRange  The name of the range buttons
 * @property {(label: string) => string} ganttRangeTitle  A range button's title, "Show the last 6 hours"
 * @property {string} ganttNow  The now-line's name
 * @property {string} ganttSelection  The selected range's chip label
 * @property {string} ganttClear  The button that lifts the selected range
 * @property {string} ganttClearTitle  Its title
 * @property {(from: string, to: string) => string} ganttSelected  The chip's text, "Selected 14:00 to 16:30"
 * @property {string} ganttEmpty  The sentence of a timeline with no run in the window
 * @property {string} ganttLoading  The sentence of a timeline being read
 * @property {string} ganttQueued  A queued run's state word
 * @property {string} ganttRunning  A running run's state word
 * @property {(time: string) => string} ganttPlannedUntil  A running run's card line when it has a planned end, "planned until 14:30" [wish-1028]
 * @property {string} ganttOk  A finished run's state word
 * @property {string} ganttFailed  A failed run's state word
 * @property {(label: string, state: string) => string} ganttAnnounce  What the timeline's status region says when a run changes state, "Backup: failed"
 * @property {(label: string, when: string, state: string) => string} ganttBar  A bar's name, "Backup, 02:00 to 02:14, failed"
 * @property {string} ganttLive  The button that makes the window follow now
 * @property {string} ganttLiveTitle  Its title
 * @property {string} ganttZoom  The button that makes the selected range the window
 * @property {string} ganttZoomTitle  Its title
 * @property {(seconds: number) => string} ganttDuration  A length of time as a person reads it, "14 min", "1 h 5 min", "45 s"
 * @property {string} ganttHint  The one-line hint under the timeline on how to read and use it
 * @property {string} ganttHintOpen  The same hint of a timeline without its range toolbar (no brush): only opening a bar [gaps-time-1019]
 * @property {string} ganttAll  The range button that fits the window to everything on the timeline (`all` in `data-kp-gantt-ranges`) [kpadopt4]
 * @property {string} ganttAllTitle  Its title
 * @property {(label: string, when: string) => string} ganttPoint  A point event's name, "Applied, 02/10/2026" [kpadopt4]
 * @property {string} ganttPlanned  The word after a planned point's name, still to come
 * @property {(count: number, labels: string) => string} ganttCluster  The name of marks too close to tell apart, "3 events: Applied, Mail, Call"
 * @property {(more: number) => string} ganttClusterMore  The count on such a mark, "+2"
 * @property {string} ganttPointsHint  The hint under a timeline of point events
 */
/** @type {CalendarWeekGanttStrings} */
export declare const CALENDAR_WEEK_GANTT_STRINGS: CalendarWeekGanttStrings;
