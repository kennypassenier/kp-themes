export type AlertStatusIdmarkStrings = {
    alertSuccess: string;
    alertWarning: string;
    alertInfo: string;
    alertError: string;
    /**
     * The word a screen reader hears before a critical problem on the attention band (setAttention) [scope-143]
     */
    attentionCritical: string;
    /**
     * The same, before a warning [scope-143]
     */
    attentionWarning: string;
    /**
     * The same, before an information [scope-143]
     */
    attentionInfo: string;
    /**
     * A ticking freshness line, "updated 12 s ago" (js/freshness.js) [scope-143]
     */
    agoText: (verb: string, duration: string) => string;
    /**
     * The same line with no moment yet, "not updated yet" [scope-143]
     */
    agoNever: (verb: string) => string;
    /**
     * A duration's seconds part, "12 s" [scope-143]
     */
    agoSeconds: (n: number) => string;
    /**
     * Its minutes part, "2 min" [scope-143]
     */
    agoMinutes: (n: number) => string;
    /**
     * Its hours part, "3 h" [scope-143]
     */
    agoHours: (n: number) => string;
    /**
     * Its days part, "1 day", "2 days" [scope-143]
     */
    agoDays: (n: number) => string;
    /**
     * The verb a freshness line uses when its element names none [scope-143]
     */
    agoVerb: string;
    /**
     * What a freshness line with `data-kp-ago-announce="state"` announces once it turns stale [scope-143]
     */
    agoStale: (text: string) => string;
    /**
     * What it announces once it is fresh again [scope-143]
     */
    agoFresh: (text: string) => string;
    /**
     * The console warning for a ticking line inside a live region [scope-143]
     */
    agoInLiveRegion: string;
    /**
     * A step list's waiting step, as a screen reader hears it (js/steplist.js)
     */
    stepPending: string;
    /**
     * The step being run
     */
    stepRunning: string;
    /**
     * A finished step
     */
    stepDone: string;
    /**
     * A step that failed
     */
    stepFailed: string;
    /**
     * A step that was left out
     */
    stepSkipped: string;
    /**
     * The step a journey stands at now, neither running nor done (`data-state="current"`) [kpadopt4]
     */
    stepCurrent: string;
    /**
     * What the list's status region says when a step changes, "Pull the images: running"
     */
    stepAnnounce: (title: string, state: string) => string;
    /**
     * A status row that is fine, as a screen reader hears it (js/statusrow.js)
     */
    statusOk: string;
    /**
     * A status row still being read
     */
    statusLoading: string;
    /**
     * A status row that failed
     */
    statusFailed: string;
    /**
     * A status row with nothing to show
     */
    statusEmpty: string;
    /**
     * A status row that passes with a reservation, `data-state="warn"` [kpadopt4-rows]
     */
    statusWarn: string;
    /**
     * What a loading card's busy card says under its spinner (js/card-state.js) [kpadopt4-rows]
     */
    cardLoading: string;
    /**
     * An empty card's note when the page gives no title [kpadopt4-rows]
     */
    cardEmpty: string;
    /**
     * A failed card's note when the page gives no title [kpadopt4-rows]
     */
    cardFailed: string;
    /**
     * The Try again button of a failed card [kpadopt4-rows]
     */
    cardRetry: string;
    /**
     * The Retry button of a failed status row
     */
    statusRetry: string;
    /**
     * That button's accessible name, "Retry vault"
     */
    statusRetryLabel: (label: string) => string;
    /**
     * What the list's status region says when a row changes, "vault: failed, The host did not answer"
     */
    statusAnnounce: (label: string, state: string, detail: string) => string;
    /**
     * What it says when more than three rows change in one tick, "12 updated, 2 failed"
     */
    statusAnnounceMany: (count: number, failed: number) => string;
    /**
     * The "only" button's text on a facet row (js/facets.js)
     */
    facetOnly: string;
    /**
     * That button's accessible name, "Show only Host"
     */
    facetOnlyLabel: (label: string) => string;
    /**
     * The "Everything" row's text when the group gives none
     */
    facetAll: string;
    /**
     * What a facet group's status region says after "only", "Showing only Host"
     */
    facetShowingOnly: (label: string) => string;
    /**
     * What it says after "Everything"
     */
    facetShowingAll: string;
    /**
     * The glyph of an identity mark with no name (js/idmark.js) [kpadopt4-data]
     */
    idmarkUnknown: string;
    /**
     * A mark's status word, online (js/idmark.js) [kpadopt5-people]
     */
    idmarkOnline: string;
    /**
     * A mark's status word, away
     */
    idmarkAway: string;
    /**
     * A mark's status word, busy
     */
    idmarkBusy: string;
    /**
     * A mark with a status as a screen reader hears it, "Ada, online"
     */
    idmarkLabel: (name: string, status: string) => string;
    /**
     * A group of marks, named by its size, "5 people"
     */
    idmarkGroup: (count: number) => string;
    /**
     * The "+N" button of a group, "Show the 3 more people"
     */
    idmarkMore: (count: number) => string;
    /**
     * The heading of the list the "+N" opens, "3 more people"
     */
    idmarkMoreTitle: (count: number) => string;
};
/**
 * @typedef {object} AlertStatusIdmarkStrings
 * @property {string} alertSuccess
 * @property {string} alertWarning
 * @property {string} alertInfo
 * @property {string} alertError
 * @property {string} attentionCritical  The word a screen reader hears before a critical problem on the attention band (setAttention) [scope-143]
 * @property {string} attentionWarning  The same, before a warning [scope-143]
 * @property {string} attentionInfo  The same, before an information [scope-143]
 * @property {(verb: string, duration: string) => string} agoText  A ticking freshness line, "updated 12 s ago" (js/freshness.js) [scope-143]
 * @property {(verb: string) => string} agoNever  The same line with no moment yet, "not updated yet" [scope-143]
 * @property {(n: number) => string} agoSeconds  A duration's seconds part, "12 s" [scope-143]
 * @property {(n: number) => string} agoMinutes  Its minutes part, "2 min" [scope-143]
 * @property {(n: number) => string} agoHours  Its hours part, "3 h" [scope-143]
 * @property {(n: number) => string} agoDays  Its days part, "1 day", "2 days" [scope-143]
 * @property {string} agoVerb  The verb a freshness line uses when its element names none [scope-143]
 * @property {(text: string) => string} agoStale  What a freshness line with `data-kp-ago-announce="state"` announces once it turns stale [scope-143]
 * @property {(text: string) => string} agoFresh  What it announces once it is fresh again [scope-143]
 * @property {string} agoInLiveRegion  The console warning for a ticking line inside a live region [scope-143]
 * @property {string} stepPending  A step list's waiting step, as a screen reader hears it (js/steplist.js)
 * @property {string} stepRunning  The step being run
 * @property {string} stepDone  A finished step
 * @property {string} stepFailed  A step that failed
 * @property {string} stepSkipped  A step that was left out
 * @property {string} stepCurrent  The step a journey stands at now, neither running nor done (`data-state="current"`) [kpadopt4]
 * @property {(title: string, state: string) => string} stepAnnounce  What the list's status region says when a step changes, "Pull the images: running"
 * @property {string} statusOk  A status row that is fine, as a screen reader hears it (js/statusrow.js)
 * @property {string} statusLoading  A status row still being read
 * @property {string} statusFailed  A status row that failed
 * @property {string} statusEmpty  A status row with nothing to show
 * @property {string} statusWarn  A status row that passes with a reservation, `data-state="warn"` [kpadopt4-rows]
 * @property {string} cardLoading  What a loading card's busy card says under its spinner (js/card-state.js) [kpadopt4-rows]
 * @property {string} cardEmpty  An empty card's note when the page gives no title [kpadopt4-rows]
 * @property {string} cardFailed  A failed card's note when the page gives no title [kpadopt4-rows]
 * @property {string} cardRetry  The Try again button of a failed card [kpadopt4-rows]
 * @property {string} statusRetry  The Retry button of a failed status row
 * @property {(label: string) => string} statusRetryLabel  That button's accessible name, "Retry vault"
 * @property {(label: string, state: string, detail: string) => string} statusAnnounce  What the list's status region says when a row changes, "vault: failed, The host did not answer"
 * @property {(count: number, failed: number) => string} statusAnnounceMany  What it says when more than three rows change in one tick, "12 updated, 2 failed"
 * @property {string} facetOnly  The "only" button's text on a facet row (js/facets.js)
 * @property {(label: string) => string} facetOnlyLabel  That button's accessible name, "Show only Host"
 * @property {string} facetAll  The "Everything" row's text when the group gives none
 * @property {(label: string) => string} facetShowingOnly  What a facet group's status region says after "only", "Showing only Host"
 * @property {string} facetShowingAll  What it says after "Everything"
 * @property {string} idmarkUnknown  The glyph of an identity mark with no name (js/idmark.js) [kpadopt4-data]
 * @property {string} idmarkOnline  A mark's status word, online (js/idmark.js) [kpadopt5-people]
 * @property {string} idmarkAway  A mark's status word, away
 * @property {string} idmarkBusy  A mark's status word, busy
 * @property {(name: string, status: string) => string} idmarkLabel  A mark with a status as a screen reader hears it, "Ada, online"
 * @property {(count: number) => string} idmarkGroup  A group of marks, named by its size, "5 people"
 * @property {(count: number) => string} idmarkMore  The "+N" button of a group, "Show the 3 more people"
 * @property {(count: number) => string} idmarkMoreTitle  The heading of the list the "+N" opens, "3 more people"
 */
/** @type {AlertStatusIdmarkStrings} */
export declare const ALERT_STATUS_IDMARK_STRINGS: AlertStatusIdmarkStrings;
