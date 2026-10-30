export type TogglePaletteAckStrings = {
    /**
     * The count's name while it is still being counted (js/toggle.js) [kpadopt6-ops]
     */
    toggleCounting: string;
    /**
     * The count on a tab, while it is still being counted: its name for a screen reader (js/tabbar.js, setTabCount) [gap-tab-count]
     */
    tabCountCounting: string;
    /**
     * The count on a tab that could not be counted, in words (the dash on the tab says nothing) [gap-tab-count]
     */
    tabCountFailed: string;
    /**
     * The line said once a toggle is switched on, "Only errors on, 12 shown" [kpadopt6-ops]
     */
    toggleOn: (label: string, count: number | null) => string;
    /**
     * The line said once it is switched off [kpadopt6-ops]
     */
    toggleOff: (label: string, count: number | null) => string;
    /**
     * The line said when the count beside a toggle changed (data-kp-announce="all") [kpadopt6-ops]
     */
    toggleCount: (label: string, n: number) => string;
    /**
     * The button that switches a group's toggles off, "Clear filters (2)" [kpadopt6-ops]
     */
    toggleClear: (n: number) => string;
    /**
     * The word on a toggle whose change the app refused [kpadopt6-ops]
     */
    toggleRefused: string;
    /**
     * What a toggle's key does in the shortcut sheet [kpadopt6-ops]
     */
    toggleKeyWhat: (label: string) => string;
    /**
     * The group a toggle's key is listed under in the shortcut sheet [kpadopt6-ops]
     */
    toggleKeyGroup: string;
    /**
     * What a palette says under "Nothing matches" when it knows nothing better [kpadopt6-ops]
     */
    intentNoMatch: string;
    /**
     * A palette's line when the first word is a verb it knows but the rest names nothing it can act on [kpadopt6-ops]
     */
    intentNoSubject: (name: string, verb: string, subjects: string[], noun: string) => string;
    /**
     * The title of a palette's empty plate when no command answers [kpadopt6-ops]
     */
    paletteNothing: string;
    /**
     * A palette's status line when more commands match than are shown [kpadopt6-ops]
     */
    paletteCapped: (shown: number, total: number) => string;
    /**
     * The words under the spinner while a palette's commands are still arriving [kpadopt6-ops]
     */
    paletteLoading: string;
    /**
     * The title of a palette's plate when its commands could not be read [kpadopt6-ops]
     */
    paletteFailed: string;
    /**
     * Its sentence when the page gives no reason [kpadopt6-ops]
     */
    paletteFailedText: string;
    /**
     * Its action [kpadopt6-ops]
     */
    paletteRetry: string;
    /**
     * The word on a chip whose first number rose, and in a count: "major" (js/version-delta.js) [kpadopt6-ops]
     */
    versionMajor: string;
    /**
     * The word for a second-number jump [kpadopt6-ops]
     */
    versionMinor: string;
    /**
     * The word for a jump in a later number [kpadopt6-ops]
     */
    versionPatch: string;
    /**
     * The word for a change that has no numbers in it, such as a new digest [kpadopt6-ops]
     */
    versionOther: string;
    /**
     * The word on a chip whose number fell [kpadopt6-ops]
     */
    versionDowngrade: string;
    /**
     * The words when the two versions are the same [kpadopt6-ops]
     */
    versionSame: string;
    /**
     * The level of a chip whose versions cannot be compared [kpadopt6-ops]
     */
    versionUnknown: string;
    /**
     * The count's words when nothing is to be updated [kpadopt6-ops]
     */
    versionNoUpdates: string;
    /**
     * A chip's name while the version is still being looked up [kpadopt6-ops]
     */
    versionLoading: string;
    /**
     * The words on a chip whose lookup failed [kpadopt6-ops]
     */
    versionFailed: string;
    /**
     * The words where no version is tracked at all [kpadopt6-ops]
     */
    versionNone: string;
    /**
     * A release-notes link's extra words for a screen reader [kpadopt6-ops]
     */
    versionNotes: string;
    /**
     * What a screen reader hears for a jump, "from 10.11 to 12.1, major update" [kpadopt6-ops]
     */
    versionSpoken: (from: string, to: string, level: string) => string;
    /**
     * What it hears when nothing changes [kpadopt6-ops]
     */
    versionSpokenSame: (version: string) => string;
    /**
     * What it hears for a moving tag that only says where it goes [kpadopt6-ops]
     */
    versionSpokenTo: (to: string) => string;
    /**
     * What it hears for a version that went back [kpadopt6-ops]
     */
    versionSpokenDown: (from: string, to: string) => string;
    /**
     * What a screen reader hears for a change that has no size, "changed from latest to nightly" [kpadopt6-ops]
     */
    versionSpokenChanged: (from: string, to: string) => string;
    /**
     * The release-notes link's words on an acknowledge gate [kpadopt6-ops]
     */
    ackLink: string;
    /**
     * The fold of the release notes inside an acknowledge gate, and the notes' accessible name (js/ack-gate.js) [wish-1120]
     */
    ackNotes: string;
    /**
     * Why the tick is off until the release notes were opened (`data-kp-ack-require-notes`) [wish-1120]
     */
    ackOpenNotes: string;
    /**
     * The tick's words when the page names none [kpadopt6-ops]
     */
    ackLabel: string;
    /**
     * The Retry button of a gate whose notes could not be found [kpadopt6-ops]
     */
    ackRetry: string;
    /**
     * Why the tick is off while the notes are looked up [kpadopt6-ops]
     */
    ackLooking: string;
    /**
     * Why the tick is locked while the job runs [kpadopt6-ops]
     */
    ackLocked: string;
    /**
     * Why the tick is off until the notes were opened [kpadopt6-ops]
     */
    ackOpenFirst: string;
    /**
     * Why the guarded button is off, with the tick's own words [kpadopt6-ops]
     */
    ackReason: (label: string) => string;
    /**
     * Why it is off when several gates guard it, "2 of 3 release notes still to read" [kpadopt6-ops]
     */
    ackReasonMany: (remaining: number, total: number) => string;
    /**
     * Said once when the last gate is ticked and the button comes on [kpadopt6-ops]
     */
    ackEnabled: string;
    /**
     * Said once when a tick is taken away [kpadopt6-ops]
     */
    ackDisabled: (remaining: number) => string;
    /**
     * A gate's line when no release notes link was found [kpadopt6-ops]
     */
    ackNoLink: string;
};
/**
 * @typedef {object} TogglePaletteAckStrings
 * @property {string} toggleCounting  The count's name while it is still being counted (js/toggle.js) [kpadopt6-ops]
 * @property {string} tabCountCounting  The count on a tab, while it is still being counted: its name for a screen reader (js/tabbar.js, setTabCount) [gap-tab-count]
 * @property {string} tabCountFailed  The count on a tab that could not be counted, in words (the dash on the tab says nothing) [gap-tab-count]
 * @property {(label: string, count: number | null) => string} toggleOn  The line said once a toggle is switched on, "Only errors on, 12 shown" [kpadopt6-ops]
 * @property {(label: string, count: number | null) => string} toggleOff  The line said once it is switched off [kpadopt6-ops]
 * @property {(label: string, n: number) => string} toggleCount  The line said when the count beside a toggle changed (data-kp-announce="all") [kpadopt6-ops]
 * @property {(n: number) => string} toggleClear  The button that switches a group's toggles off, "Clear filters (2)" [kpadopt6-ops]
 * @property {string} toggleRefused  The word on a toggle whose change the app refused [kpadopt6-ops]
 * @property {(label: string) => string} toggleKeyWhat  What a toggle's key does in the shortcut sheet [kpadopt6-ops]
 * @property {string} toggleKeyGroup  The group a toggle's key is listed under in the shortcut sheet [kpadopt6-ops]
 * @property {string} intentNoMatch  What a palette says under "Nothing matches" when it knows nothing better [kpadopt6-ops]
 * @property {(name: string, verb: string, subjects: string[], noun: string) => string} intentNoSubject  A palette's line when the first word is a verb it knows but the rest names nothing it can act on [kpadopt6-ops]
 * @property {string} paletteNothing  The title of a palette's empty plate when no command answers [kpadopt6-ops]
 * @property {(shown: number, total: number) => string} paletteCapped  A palette's status line when more commands match than are shown [kpadopt6-ops]
 * @property {string} paletteLoading  The words under the spinner while a palette's commands are still arriving [kpadopt6-ops]
 * @property {string} paletteFailed  The title of a palette's plate when its commands could not be read [kpadopt6-ops]
 * @property {string} paletteFailedText  Its sentence when the page gives no reason [kpadopt6-ops]
 * @property {string} paletteRetry  Its action [kpadopt6-ops]
 * @property {string} versionMajor  The word on a chip whose first number rose, and in a count: "major" (js/version-delta.js) [kpadopt6-ops]
 * @property {string} versionMinor  The word for a second-number jump [kpadopt6-ops]
 * @property {string} versionPatch  The word for a jump in a later number [kpadopt6-ops]
 * @property {string} versionOther  The word for a change that has no numbers in it, such as a new digest [kpadopt6-ops]
 * @property {string} versionDowngrade  The word on a chip whose number fell [kpadopt6-ops]
 * @property {string} versionSame  The words when the two versions are the same [kpadopt6-ops]
 * @property {string} versionUnknown  The level of a chip whose versions cannot be compared [kpadopt6-ops]
 * @property {string} versionNoUpdates  The count's words when nothing is to be updated [kpadopt6-ops]
 * @property {string} versionLoading  A chip's name while the version is still being looked up [kpadopt6-ops]
 * @property {string} versionFailed  The words on a chip whose lookup failed [kpadopt6-ops]
 * @property {string} versionNone  The words where no version is tracked at all [kpadopt6-ops]
 * @property {string} versionNotes  A release-notes link's extra words for a screen reader [kpadopt6-ops]
 * @property {(from: string, to: string, level: string) => string} versionSpoken  What a screen reader hears for a jump, "from 10.11 to 12.1, major update" [kpadopt6-ops]
 * @property {(version: string) => string} versionSpokenSame  What it hears when nothing changes [kpadopt6-ops]
 * @property {(to: string) => string} versionSpokenTo  What it hears for a moving tag that only says where it goes [kpadopt6-ops]
 * @property {(from: string, to: string) => string} versionSpokenDown  What it hears for a version that went back [kpadopt6-ops]
 * @property {(from: string, to: string) => string} versionSpokenChanged  What a screen reader hears for a change that has no size, "changed from latest to nightly" [kpadopt6-ops]
 * @property {string} ackLink  The release-notes link's words on an acknowledge gate [kpadopt6-ops]
 * @property {string} ackNotes  The fold of the release notes inside an acknowledge gate, and the notes' accessible name (js/ack-gate.js) [wish-1120]
 * @property {string} ackOpenNotes  Why the tick is off until the release notes were opened (`data-kp-ack-require-notes`) [wish-1120]
 * @property {string} ackLabel  The tick's words when the page names none [kpadopt6-ops]
 * @property {string} ackRetry  The Retry button of a gate whose notes could not be found [kpadopt6-ops]
 * @property {string} ackLooking  Why the tick is off while the notes are looked up [kpadopt6-ops]
 * @property {string} ackLocked  Why the tick is locked while the job runs [kpadopt6-ops]
 * @property {string} ackOpenFirst  Why the tick is off until the notes were opened [kpadopt6-ops]
 * @property {(label: string) => string} ackReason  Why the guarded button is off, with the tick's own words [kpadopt6-ops]
 * @property {(remaining: number, total: number) => string} ackReasonMany  Why it is off when several gates guard it, "2 of 3 release notes still to read" [kpadopt6-ops]
 * @property {string} ackEnabled  Said once when the last gate is ticked and the button comes on [kpadopt6-ops]
 * @property {(remaining: number) => string} ackDisabled  Said once when a tick is taken away [kpadopt6-ops]
 * @property {string} ackNoLink  A gate's line when no release notes link was found [kpadopt6-ops]
 */
/** @type {TogglePaletteAckStrings} */
export declare const TOGGLE_PALETTE_ACK_STRINGS: TogglePaletteAckStrings;
