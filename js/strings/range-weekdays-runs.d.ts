export type RangeWeekdaysRunsStrings = {
    /**
     * The range picker's preset group, for a screen reader (js/range.js) [kpadopt4-ideas]
     */
    rangePresets: string;
    /**
     * A preset in words: "Last 24 hours" [kpadopt4-ideas]
     */
    rangePresetName: (key: string) => string;
    /**
     * A preset on its segment: "24h" [kpadopt4-ideas]
     */
    rangePresetShort: (key: string) => string;
    /**
     * The button that opens the custom range [kpadopt4-ideas]
     */
    rangeCustom: string;
    /**
     * The custom panel's title [kpadopt4-ideas]
     */
    rangeCustomTitle: string;
    /**
     * A custom window's name in the line under the picker [kpadopt4-ideas]
     */
    rangeCustomName: string;
    /**
     * The start's label [kpadopt4-ideas]
     */
    rangeFrom: string;
    /**
     * The end's label [kpadopt4-ideas]
     */
    rangeTo: string;
    /**
     * A date field's name: "From, date (dd/mm/yyyy)" [kpadopt4-ideas]
     */
    rangeDateLabel: (bound: string) => string;
    /**
     * A time field's name [kpadopt4-ideas]
     */
    rangeTimeLabel: (bound: string) => string;
    /**
     * The time field's placeholder [kpadopt4-ideas]
     */
    rangeTimeHint: string;
    /**
     * The custom panel's Apply [kpadopt4-ideas]
     */
    rangeApply: string;
    /**
     * The custom panel's Cancel [kpadopt4-ideas]
     */
    rangeCancel: string;
    /**
     * The line under the picker: "Last 24 hours · 15/10/2026 14:05 – 16/10/2026 14:05" [kpadopt4-ideas]
     */
    rangeLabel: (name: string, from: string, to: string) => string;
    /**
     * A date that is not a whole dd/mm/yyyy [kpadopt4-ideas]
     */
    rangeErrorDate: (bound: string) => string;
    /**
     * A time that is not a time of day [kpadopt4-ideas]
     */
    rangeErrorTime: (bound: string) => string;
    /**
     * A window whose end does not come after its start [kpadopt4-ideas]
     */
    rangeErrorOrder: string;
    /**
     * A window that ends in the future [kpadopt4-ideas]
     */
    rangeErrorFuture: string;
    /**
     * A window longer than the picker allows [kpadopt4-ideas]
     */
    rangeErrorSpan: (days: number) => string;
    /**
     * The weekday picker's name when the page gives none (js/weekdays.js) [kpadopt5-time]
     */
    weekdaysGroup: string;
    /**
     * The short day names, Monday first: "Mon" [kpadopt5-time]
     */
    weekdaysShort: string[];
    /**
     * The one-letter day names, Monday first: "M" [kpadopt5-time]
     */
    weekdaysNarrow: string[];
    /**
     * The full day names, Monday first, a chip's hint and name [kpadopt5-time]
     */
    weekdaysLong: string[];
    /**
     * The month picker's chip for the last day [kpadopt5-time]
     */
    weekdaysLast: string;
    /**
     * The last day of the month in words [kpadopt5-time]
     */
    weekdaysLastDay: string;
    /**
     * The word that joins the last two days of a list: "Mon and Thu" [kpadopt5-time]
     */
    weekdaysAnd: string;
    /**
     * The quick picks' group name for a screen reader [kpadopt5-time]
     */
    weekdaysPresets: string;
    /**
     * The quick pick for Monday to Friday [kpadopt5-time]
     */
    weekdaysPresetWeekdays: string;
    /**
     * The quick pick for Saturday and Sunday [kpadopt5-time]
     */
    weekdaysPresetWeekend: string;
    /**
     * The quick pick for all seven days [kpadopt5-time]
     */
    weekdaysPresetEvery: string;
    /**
     * The line while no day is picked [kpadopt5-time]
     */
    weekdaysNone: string;
    /**
     * The line for all seven days [kpadopt5-time]
     */
    weekdaysEvery: string;
    /**
     * The line for Monday to Friday [kpadopt5-time]
     */
    weekdaysWeekdays: string;
    /**
     * The line for Saturday and Sunday [kpadopt5-time]
     */
    weekdaysWeekend: string;
    /**
     * A day of the month in words: "1st", "22nd" [kpadopt5-time]
     */
    weekdaysOrdinal: (n: number) => string;
    /**
     * The days of a month in a sentence: "On the 1st and 15th" [kpadopt5-time]
     */
    weekdaysOnThe: (list: string) => string;
    /**
     * What a picker below its least says: "Pick at least one day" [kpadopt5-time]
     */
    weekdaysMin: (n: number) => string;
    /**
     * The heading over a next-times list (js/runs.js) [kpadopt5-time]
     */
    runsTitle: string;
    /**
     * A run that is due now, where "in 2 days" would stand [kpadopt5-time]
     */
    runsNow: string;
    /**
     * How far away a run is: "in 2 days" [kpadopt5-time]
     */
    runsIn: (distance: string) => string;
    /**
     * The mark on a run after the clock was turned, positive hours forward: "Clock goes back 1 h" [kpadopt5-time]
     */
    runsClockChange: (hours: number) => string;
    /**
     * The button that shows the times past the count: "Show 10 more" [kpadopt5-time]
     */
    runsMore: (n: number) => string;
    /**
     * The same button once they are shown [kpadopt5-time]
     */
    runsFewer: string;
    /**
     * An empty list's sentence when the page gives none [kpadopt5-time]
     */
    runsEmpty: string;
    /**
     * A failed list's first line [kpadopt5-time]
     */
    runsFailed: string;
    /**
     * The failed list's button [kpadopt5-time]
     */
    runsRetry: string;
    /**
     * What the busy card says while the times are worked out [kpadopt5-time]
     */
    runsLoading: string;
    /**
     * What the status region says when the first run changes [kpadopt5-time]
     */
    runsNext: (moment: string) => string;
};
/**
 * @typedef {object} RangeWeekdaysRunsStrings
 * @property {string} rangePresets  The range picker's preset group, for a screen reader (js/range.js) [kpadopt4-ideas]
 * @property {(key: string) => string} rangePresetName  A preset in words: "Last 24 hours" [kpadopt4-ideas]
 * @property {(key: string) => string} rangePresetShort  A preset on its segment: "24h" [kpadopt4-ideas]
 * @property {string} rangeCustom  The button that opens the custom range [kpadopt4-ideas]
 * @property {string} rangeCustomTitle  The custom panel's title [kpadopt4-ideas]
 * @property {string} rangeCustomName  A custom window's name in the line under the picker [kpadopt4-ideas]
 * @property {string} rangeFrom  The start's label [kpadopt4-ideas]
 * @property {string} rangeTo  The end's label [kpadopt4-ideas]
 * @property {(bound: string) => string} rangeDateLabel  A date field's name: "From, date (dd/mm/yyyy)" [kpadopt4-ideas]
 * @property {(bound: string) => string} rangeTimeLabel  A time field's name [kpadopt4-ideas]
 * @property {string} rangeTimeHint  The time field's placeholder [kpadopt4-ideas]
 * @property {string} rangeApply  The custom panel's Apply [kpadopt4-ideas]
 * @property {string} rangeCancel  The custom panel's Cancel [kpadopt4-ideas]
 * @property {(name: string, from: string, to: string) => string} rangeLabel  The line under the picker: "Last 24 hours · 15/10/2026 14:05 – 16/10/2026 14:05" [kpadopt4-ideas]
 * @property {(bound: string) => string} rangeErrorDate  A date that is not a whole dd/mm/yyyy [kpadopt4-ideas]
 * @property {(bound: string) => string} rangeErrorTime  A time that is not a time of day [kpadopt4-ideas]
 * @property {string} rangeErrorOrder  A window whose end does not come after its start [kpadopt4-ideas]
 * @property {string} rangeErrorFuture  A window that ends in the future [kpadopt4-ideas]
 * @property {(days: number) => string} rangeErrorSpan  A window longer than the picker allows [kpadopt4-ideas]
 * @property {string} weekdaysGroup  The weekday picker's name when the page gives none (js/weekdays.js) [kpadopt5-time]
 * @property {string[]} weekdaysShort  The short day names, Monday first: "Mon" [kpadopt5-time]
 * @property {string[]} weekdaysNarrow  The one-letter day names, Monday first: "M" [kpadopt5-time]
 * @property {string[]} weekdaysLong  The full day names, Monday first, a chip's hint and name [kpadopt5-time]
 * @property {string} weekdaysLast  The month picker's chip for the last day [kpadopt5-time]
 * @property {string} weekdaysLastDay  The last day of the month in words [kpadopt5-time]
 * @property {string} weekdaysAnd  The word that joins the last two days of a list: "Mon and Thu" [kpadopt5-time]
 * @property {string} weekdaysPresets  The quick picks' group name for a screen reader [kpadopt5-time]
 * @property {string} weekdaysPresetWeekdays  The quick pick for Monday to Friday [kpadopt5-time]
 * @property {string} weekdaysPresetWeekend  The quick pick for Saturday and Sunday [kpadopt5-time]
 * @property {string} weekdaysPresetEvery  The quick pick for all seven days [kpadopt5-time]
 * @property {string} weekdaysNone  The line while no day is picked [kpadopt5-time]
 * @property {string} weekdaysEvery  The line for all seven days [kpadopt5-time]
 * @property {string} weekdaysWeekdays  The line for Monday to Friday [kpadopt5-time]
 * @property {string} weekdaysWeekend  The line for Saturday and Sunday [kpadopt5-time]
 * @property {(n: number) => string} weekdaysOrdinal  A day of the month in words: "1st", "22nd" [kpadopt5-time]
 * @property {(list: string) => string} weekdaysOnThe  The days of a month in a sentence: "On the 1st and 15th" [kpadopt5-time]
 * @property {(n: number) => string} weekdaysMin  What a picker below its least says: "Pick at least one day" [kpadopt5-time]
 * @property {string} runsTitle  The heading over a next-times list (js/runs.js) [kpadopt5-time]
 * @property {string} runsNow  A run that is due now, where "in 2 days" would stand [kpadopt5-time]
 * @property {(distance: string) => string} runsIn  How far away a run is: "in 2 days" [kpadopt5-time]
 * @property {(hours: number) => string} runsClockChange  The mark on a run after the clock was turned, positive hours forward: "Clock goes back 1 h" [kpadopt5-time]
 * @property {(n: number) => string} runsMore  The button that shows the times past the count: "Show 10 more" [kpadopt5-time]
 * @property {string} runsFewer  The same button once they are shown [kpadopt5-time]
 * @property {string} runsEmpty  An empty list's sentence when the page gives none [kpadopt5-time]
 * @property {string} runsFailed  A failed list's first line [kpadopt5-time]
 * @property {string} runsRetry  The failed list's button [kpadopt5-time]
 * @property {string} runsLoading  What the busy card says while the times are worked out [kpadopt5-time]
 * @property {(moment: string) => string} runsNext  What the status region says when the first run changes [kpadopt5-time]
 */
/** @type {RangeWeekdaysRunsStrings} */
export declare const RANGE_WEEKDAYS_RUNS_STRINGS: RangeWeekdaysRunsStrings;
