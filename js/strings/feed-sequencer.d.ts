export type FeedSequencerStrings = {
    /**
     * The accessible name of the feed's list when the host has none (js/feed.js) [gap-activity-feed-1019]
     */
    feedLabel: string;
    /**
     * The word for one row when the page names none, "event" (js/feed.js) [gap-activity-feed-1019]
     */
    feedUnitOne: string;
    /**
     * The word for several rows, "events" (js/feed.js) [gap-activity-feed-1019]
     */
    feedUnitMany: string;
    /**
     * The heading of today's rows (js/feed.js) [gap-activity-feed-1019]
     */
    feedToday: string;
    /**
     * The heading of yesterday's rows (js/feed.js) [gap-activity-feed-1019]
     */
    feedYesterday: string;
    /**
     * The count above the list when only some rows are loaded, "24 of 129 operations" (exact numbers) (js/feed.js) [gap-activity-feed-1019]
     */
    feedShown: (shown: number, total: number, unit: string) => string;
    /**
     * A day heading's failed count, "2 failed" (js/feed.js) [gap-activity-feed-1019]
     */
    feedFailed: (n: number) => string;
    /**
     * A day heading when nothing failed, "all ok" (js/feed.js) [gap-activity-feed-1019]
     */
    feedAllOk: string;
    /**
     * A running row, as a screen reader hears it (js/feed.js) [gap-activity-feed-1019]
     */
    feedStateRunning: string;
    /**
     * A row that is a note, not an outcome, as a screen reader hears it (js/feed.js) [gap-activity-feed-1019]
     */
    feedStateInfo: string;
    /**
     * The word before who started a row, for a screen reader, "by Claude" (js/feed.js) [gap-activity-feed-1019]
     */
    feedBy: string;
    /**
     * The accessible name of the lines that open under a row (js/feed.js) [gap-activity-feed-1019]
     */
    feedMoreLabel: (title: string) => string;
    /**
     * The link inside an opened row that goes where its title would (js/feed.js) [gap-activity-feed-1019]
     */
    feedOpen: string;
    /**
     * The head line of a feed whose refresh failed while its rows are still good, "Not refreshed: the host did not answer. Rows from 14:02." (js/feed.js) [gap-activity-feed-1019]
     */
    feedStale: (reason: string, since: string) => string;
    /**
     * The button that reads a stale feed again (js/feed.js) [gap-activity-feed-1019]
     */
    feedStaleAction: string;
    /**
     * What the busy card over the feed says (js/feed.js) [gap-activity-feed-1019]
     */
    feedLoading: string;
    /**
     * The empty plate's title (js/feed.js) [gap-activity-feed-1019]
     */
    feedEmptyTitle: string;
    /**
     * The empty plate's sentence when the page gives no reason (js/feed.js) [gap-activity-feed-1019]
     */
    feedEmptyText: string;
    /**
     * The failed plate's title (js/feed.js) [gap-activity-feed-1019]
     */
    feedErrorTitle: string;
    /**
     * The failed plate's sentence when the page gives no reason (js/feed.js) [gap-activity-feed-1019]
     */
    feedErrorText: string;
    /**
     * The failed plate's Retry button (js/feed.js) [gap-activity-feed-1019]
     */
    feedRetry: string;
    /**
     * The button that loads earlier rows (js/feed.js) [gap-activity-feed-1019]
     */
    feedEarlier: string;
    /**
     * The same button while it works (js/feed.js) [gap-activity-feed-1019]
     */
    feedEarlierLoading: string;
    /**
     * The sentence when earlier rows could not be loaded (js/feed.js) [gap-activity-feed-1019]
     */
    feedEarlierError: string;
    /**
     * The button that tries again (js/feed.js) [gap-activity-feed-1019]
     */
    feedEarlierRetry: string;
    /**
     * The note under Load earlier, "Showing 24 of 129, back to 14/10/2026" (js/feed.js) [gap-activity-feed-1019]
     */
    feedBackTo: (shown: number, total: number, date: string) => string;
    /**
     * The foot when there is nothing earlier, "Nothing earlier: all 24 are shown, back to 14/10/2026" (js/feed.js) [gap-activity-feed-1019]
     */
    feedEnd: (shown: number, date: string) => string;
    /**
     * Announced when one new row arrived (js/feed.js) [gap-activity-feed-1019]
     */
    feedNew: (title: string) => string;
    /**
     * Announced when several arrived, naming the newest (js/feed.js) [gap-activity-feed-1019]
     */
    feedNewMany: (n: number, title: string) => string;
    /**
     * The accessible name of the timeline when the host has none (js/sequencer.js) [timeline-1029]
     */
    sequencerLabel: string;
    /**
     * The loading card's words (js/sequencer.js) [timeline-1029]
     */
    sequencerLoading: string;
    /**
     * The empty plate's title (js/sequencer.js) [timeline-1029]
     */
    sequencerEmpty: string;
    /**
     * The empty plate's sentence (js/sequencer.js) [timeline-1029]
     */
    sequencerEmptyText: string;
    /**
     * The failed plate's title (js/sequencer.js) [timeline-1029]
     */
    sequencerFailed: string;
    /**
     * The name of the zoom group and the word an announcement of the zoom starts with (js/sequencer.js) [timeline-1029]
     */
    sequencerZoomLabel: string;
    /**
     * The button that zooms in (js/sequencer.js) [timeline-1029]
     */
    sequencerZoomIn: string;
    /**
     * The button that zooms out (js/sequencer.js) [timeline-1029]
     */
    sequencerZoomOut: string;
    /**
     * The button that fits the timeline to its box (js/sequencer.js) [timeline-1029]
     */
    sequencerZoomFit: string;
    /**
     * The zoom as shown, "125%" (js/sequencer.js) [timeline-1029]
     */
    sequencerZoomValue: (percent: number) => string;
    /**
     * A length or a point of time in the timeline's unit (`second`, `minute`, `hour`, `day`, `week`) as words, "1 h 25 min"; used on the axis, the total and in announcements (js/sequencer.js) [timeline-1029]
     */
    sequencerSpan: (value: number, unit: string) => string;
    /**
     * The live total, the end of the last item, "Total 1 h 25 min" (js/sequencer.js) [timeline-1029]
     */
    sequencerTotal: (span: string) => string;
    /**
     * The name of the line for now (js/sequencer.js) [timeline-1029]
     */
    sequencerNow: (span: string) => string;
    /**
     * The line under the timeline on how to edit it (js/sequencer.js) [timeline-1029]
     */
    sequencerHint: string;
    /**
     * The same line of a timeline that cannot be edited (js/sequencer.js) [timeline-1029]
     */
    sequencerHintReadonly: string;
    /**
     * The hint a screen reader hears with every step (js/sequencer.js) [timeline-1029]
     */
    sequencerItemHelp: string;
    /**
     * A step as a screen reader hears it and as the selection line reads it (js/sequencer.js) [timeline-1029]
     */
    sequencerItem: (label: string, lane: string, start: string, length: string, partner: string | null) => string;
    /**
     * Announced when a step is picked up with the keyboard (js/sequencer.js) [timeline-1029]
     */
    sequencerGrabbed: (label: string) => string;
    /**
     * Announced when a step is dropped; `summary` is its `sequencerItem` words (js/sequencer.js) [timeline-1029]
     */
    sequencerDropped: (summary: string) => string;
    /**
     * Announced when an edit is put back (js/sequencer.js) [timeline-1029]
     */
    sequencerCancelled: (label: string) => string;
    /**
     * Announced when a step cannot go there because it would overlap another (js/sequencer.js) [timeline-1029]
     */
    sequencerRefusedOverlap: (label: string, other: string) => string;
    /**
     * Announced when a step cannot go further that way (the start, the lanes' end, the window's end) (js/sequencer.js) [timeline-1029]
     */
    sequencerRefusedEdge: (label: string) => string;
    /**
     * Announced when a step is fixed and cannot change (js/sequencer.js) [timeline-1029]
     */
    sequencerRefusedLocked: (label: string) => string;
    /**
     * Announced when a step cannot run alongside the chosen one (js/sequencer.js) [timeline-1029]
     */
    sequencerRefusedLink: (label: string) => string;
    /**
     * Announced after an edit that moved other steps aside (exact count) (js/sequencer.js) [timeline-1029]
     */
    sequencerPushed: (n: number) => string;
    /**
     * The line while a step waits for its partner, also announced (js/sequencer.js) [timeline-1029]
     */
    sequencerLinkStart: (label: string) => string;
    /**
     * Announced when a step now runs alongside another (js/sequencer.js) [timeline-1029]
     */
    sequencerLinked: (label: string, partner: string) => string;
    /**
     * Announced when a step runs on its own again (js/sequencer.js) [timeline-1029]
     */
    sequencerUnlinked: (label: string) => string;
    /**
     * The selection line when nothing is selected (js/sequencer.js) [timeline-1029]
     */
    sequencerSelectedNone: string;
    /**
     * The button that links the selected step to another (js/sequencer.js) [timeline-1029]
     */
    sequencerLinkButton: string;
    /**
     * The button that lets the selected step run on its own (js/sequencer.js) [timeline-1029]
     */
    sequencerUnlinkButton: string;
    /**
     * The button that stops choosing a partner (js/sequencer.js) [timeline-1029]
     */
    sequencerLinkCancel: string;
    /**
     * The chip that follows a step while it is dragged (js/sequencer.js) [timeline-1029]
     */
    sequencerReadout: (start: string, length: string) => string;
    /**
     * The chip of a drag that would be refused (js/sequencer.js) [timeline-1029]
     */
    sequencerReadoutRefused: string;
};
/**
 * @typedef {object} FeedSequencerStrings
 * @property {string} feedLabel  The accessible name of the feed's list when the host has none (js/feed.js) [gap-activity-feed-1019]
 * @property {string} feedUnitOne  The word for one row when the page names none, "event" (js/feed.js) [gap-activity-feed-1019]
 * @property {string} feedUnitMany  The word for several rows, "events" (js/feed.js) [gap-activity-feed-1019]
 * @property {string} feedToday  The heading of today's rows (js/feed.js) [gap-activity-feed-1019]
 * @property {string} feedYesterday  The heading of yesterday's rows (js/feed.js) [gap-activity-feed-1019]
 * @property {(shown: number, total: number, unit: string) => string} feedShown  The count above the list when only some rows are loaded, "24 of 129 operations" (exact numbers) (js/feed.js) [gap-activity-feed-1019]
 * @property {(n: number) => string} feedFailed  A day heading's failed count, "2 failed" (js/feed.js) [gap-activity-feed-1019]
 * @property {string} feedAllOk  A day heading when nothing failed, "all ok" (js/feed.js) [gap-activity-feed-1019]
 * @property {string} feedStateRunning  A running row, as a screen reader hears it (js/feed.js) [gap-activity-feed-1019]
 * @property {string} feedStateInfo  A row that is a note, not an outcome, as a screen reader hears it (js/feed.js) [gap-activity-feed-1019]
 * @property {string} feedBy  The word before who started a row, for a screen reader, "by Claude" (js/feed.js) [gap-activity-feed-1019]
 * @property {(title: string) => string} feedMoreLabel  The accessible name of the lines that open under a row (js/feed.js) [gap-activity-feed-1019]
 * @property {string} feedOpen  The link inside an opened row that goes where its title would (js/feed.js) [gap-activity-feed-1019]
 * @property {(reason: string, since: string) => string} feedStale  The head line of a feed whose refresh failed while its rows are still good, "Not refreshed: the host did not answer. Rows from 14:02." (js/feed.js) [gap-activity-feed-1019]
 * @property {string} feedStaleAction  The button that reads a stale feed again (js/feed.js) [gap-activity-feed-1019]
 * @property {string} feedLoading  What the busy card over the feed says (js/feed.js) [gap-activity-feed-1019]
 * @property {string} feedEmptyTitle  The empty plate's title (js/feed.js) [gap-activity-feed-1019]
 * @property {string} feedEmptyText  The empty plate's sentence when the page gives no reason (js/feed.js) [gap-activity-feed-1019]
 * @property {string} feedErrorTitle  The failed plate's title (js/feed.js) [gap-activity-feed-1019]
 * @property {string} feedErrorText  The failed plate's sentence when the page gives no reason (js/feed.js) [gap-activity-feed-1019]
 * @property {string} feedRetry  The failed plate's Retry button (js/feed.js) [gap-activity-feed-1019]
 * @property {string} feedEarlier  The button that loads earlier rows (js/feed.js) [gap-activity-feed-1019]
 * @property {string} feedEarlierLoading  The same button while it works (js/feed.js) [gap-activity-feed-1019]
 * @property {string} feedEarlierError  The sentence when earlier rows could not be loaded (js/feed.js) [gap-activity-feed-1019]
 * @property {string} feedEarlierRetry  The button that tries again (js/feed.js) [gap-activity-feed-1019]
 * @property {(shown: number, total: number, date: string) => string} feedBackTo  The note under Load earlier, "Showing 24 of 129, back to 14/10/2026" (js/feed.js) [gap-activity-feed-1019]
 * @property {(shown: number, date: string) => string} feedEnd  The foot when there is nothing earlier, "Nothing earlier: all 24 are shown, back to 14/10/2026" (js/feed.js) [gap-activity-feed-1019]
 * @property {(title: string) => string} feedNew  Announced when one new row arrived (js/feed.js) [gap-activity-feed-1019]
 * @property {(n: number, title: string) => string} feedNewMany  Announced when several arrived, naming the newest (js/feed.js) [gap-activity-feed-1019]
 * @property {string} sequencerLabel  The accessible name of the timeline when the host has none (js/sequencer.js) [timeline-1029]
 * @property {string} sequencerLoading  The loading card's words (js/sequencer.js) [timeline-1029]
 * @property {string} sequencerEmpty  The empty plate's title (js/sequencer.js) [timeline-1029]
 * @property {string} sequencerEmptyText  The empty plate's sentence (js/sequencer.js) [timeline-1029]
 * @property {string} sequencerFailed  The failed plate's title (js/sequencer.js) [timeline-1029]
 * @property {string} sequencerZoomLabel  The name of the zoom group and the word an announcement of the zoom starts with (js/sequencer.js) [timeline-1029]
 * @property {string} sequencerZoomIn  The button that zooms in (js/sequencer.js) [timeline-1029]
 * @property {string} sequencerZoomOut  The button that zooms out (js/sequencer.js) [timeline-1029]
 * @property {string} sequencerZoomFit  The button that fits the timeline to its box (js/sequencer.js) [timeline-1029]
 * @property {(percent: number) => string} sequencerZoomValue  The zoom as shown, "125%" (js/sequencer.js) [timeline-1029]
 * @property {(value: number, unit: string) => string} sequencerSpan  A length or a point of time in the timeline's unit (`second`, `minute`, `hour`, `day`, `week`) as words, "1 h 25 min"; used on the axis, the total and in announcements (js/sequencer.js) [timeline-1029]
 * @property {(span: string) => string} sequencerTotal  The live total, the end of the last item, "Total 1 h 25 min" (js/sequencer.js) [timeline-1029]
 * @property {(span: string) => string} sequencerNow  The name of the line for now (js/sequencer.js) [timeline-1029]
 * @property {string} sequencerHint  The line under the timeline on how to edit it (js/sequencer.js) [timeline-1029]
 * @property {string} sequencerHintReadonly  The same line of a timeline that cannot be edited (js/sequencer.js) [timeline-1029]
 * @property {string} sequencerItemHelp  The hint a screen reader hears with every step (js/sequencer.js) [timeline-1029]
 * @property {(label: string, lane: string, start: string, length: string, partner: string | null) => string} sequencerItem  A step as a screen reader hears it and as the selection line reads it (js/sequencer.js) [timeline-1029]
 * @property {(label: string) => string} sequencerGrabbed  Announced when a step is picked up with the keyboard (js/sequencer.js) [timeline-1029]
 * @property {(summary: string) => string} sequencerDropped  Announced when a step is dropped; `summary` is its `sequencerItem` words (js/sequencer.js) [timeline-1029]
 * @property {(label: string) => string} sequencerCancelled  Announced when an edit is put back (js/sequencer.js) [timeline-1029]
 * @property {(label: string, other: string) => string} sequencerRefusedOverlap  Announced when a step cannot go there because it would overlap another (js/sequencer.js) [timeline-1029]
 * @property {(label: string) => string} sequencerRefusedEdge  Announced when a step cannot go further that way (the start, the lanes' end, the window's end) (js/sequencer.js) [timeline-1029]
 * @property {(label: string) => string} sequencerRefusedLocked  Announced when a step is fixed and cannot change (js/sequencer.js) [timeline-1029]
 * @property {(label: string) => string} sequencerRefusedLink  Announced when a step cannot run alongside the chosen one (js/sequencer.js) [timeline-1029]
 * @property {(n: number) => string} sequencerPushed  Announced after an edit that moved other steps aside (exact count) (js/sequencer.js) [timeline-1029]
 * @property {(label: string) => string} sequencerLinkStart  The line while a step waits for its partner, also announced (js/sequencer.js) [timeline-1029]
 * @property {(label: string, partner: string) => string} sequencerLinked  Announced when a step now runs alongside another (js/sequencer.js) [timeline-1029]
 * @property {(label: string) => string} sequencerUnlinked  Announced when a step runs on its own again (js/sequencer.js) [timeline-1029]
 * @property {string} sequencerSelectedNone  The selection line when nothing is selected (js/sequencer.js) [timeline-1029]
 * @property {string} sequencerLinkButton  The button that links the selected step to another (js/sequencer.js) [timeline-1029]
 * @property {string} sequencerUnlinkButton  The button that lets the selected step run on its own (js/sequencer.js) [timeline-1029]
 * @property {string} sequencerLinkCancel  The button that stops choosing a partner (js/sequencer.js) [timeline-1029]
 * @property {(start: string, length: string) => string} sequencerReadout  The chip that follows a step while it is dragged (js/sequencer.js) [timeline-1029]
 * @property {string} sequencerReadoutRefused  The chip of a drag that would be refused (js/sequencer.js) [timeline-1029]
 */
/** @type {FeedSequencerStrings} */
export declare const FEED_SEQUENCER_STRINGS: FeedSequencerStrings;
