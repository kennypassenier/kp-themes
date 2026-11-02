export type UxPartsStrings = {
    /**
     * What a folded chip group's menu button calls the group when the group has no name of its own ("Show") [ux-1101]
     */
    segmentedFoldName: string;
    /**
     * What that button says while nothing (or All) is chosen [ux-1101]
     */
    segmentedFoldAll: string;
    /**
     * The folded group's button, "Show: Due" [ux-1101]
     */
    segmentedFoldButton: (name: string, chosen: string) => string;
    /**
     * What the button says for several values on at once, "3 chosen" [ux-1101]
     */
    segmentedFoldMany: (n: number) => string;
    /**
     * A three-way chip's visible word while it does not matter (the word look, the default of `data-kp-segmented-tri-look`) [ux-1101]
     */
    triTagAny: string;
    /**
     * Its visible word while the value must be in [ux-1101]
     */
    triTagInclude: string;
    /**
     * Its visible word while the value must not be in [ux-1101]
     */
    triTagExclude: string;
    /**
     * A popover form's problem line when the field is refused and the browser gave no words of its own [ux-1101]
     */
    popoverFormInvalid: string;
    /**
     * The name of a popover form's close button [ux-1101]
     */
    popoverFormClose: string;
    /**
     * A popover form's problem line when its date field holds text that is not a date [parts-1102]
     */
    popoverFormDate: string;
    /**
     * Its problem line when the date lies outside the days its calendar offers [parts-1102]
     */
    popoverFormDateRange: string;
    /**
     * The name of a date navigation when the page gives none [ux-1101]
     */
    dateNavGroup: string;
    /**
     * Its button to the range before, as shown [ux-1101]
     */
    dateNavPrev: string;
    /**
     * Its button to the range after, as shown [ux-1101]
     */
    dateNavNext: string;
    /**
     * Its button back to the range that holds today [ux-1101]
     */
    dateNavToday: string;
    /**
     * The first button's name and title, "Previous month" [ux-1101]
     */
    dateNavPrevTitle: (unit: string) => string;
    /**
     * The last button's name and title, "Next month" [ux-1101]
     */
    dateNavNextTitle: (unit: string) => string;
    /**
     * The middle button's title, "Show this month" [ux-1101]
     */
    dateNavTodayTitle: (unit: string) => string;
    /**
     * What one step is called in each mode [ux-1101]
     */
    dateNavUnits: {
        day: string;
        week: string;
        month: string;
    };
    /**
     * The range a week shows, "Week 45 · 02/11 to 08/11/2026" [ux-1101]
     */
    dateNavWeekLabel: (n: number, from: string, to: string) => string;
    /**
     * What the status region says after a move, "Now showing November 2026" [ux-1101]
     */
    dateNavShown: (range: string) => string;
    /**
     * The word after the range while it holds today [ux-1101]
     */
    dateNavCurrent: string;
    /**
     * The Undo toast's line after a row was deleted, "Ibuprofen 400 deleted" [ux-1101]
     */
    rowDeleted: (name: string) => string;
    /**
     * The same line for a row with no name [ux-1101]
     */
    rowDeletedNameless: string;
    /**
     * The toast's line after Undo, "Ibuprofen 400 is back" [ux-1101]
     */
    rowRestored: (name: string) => string;
    /**
     * The word between the caps of a chord in a line of shortcuts, "O then T" (js/keys.js) [parts-1102]
     */
    keysThen: string;
    /**
     * The name of a day timeline when the page gives none (js/dayline.js) [parts-1102]
     */
    daylineLabel: string;
    /**
     * The name over the all-day strip above the hours [parts-1102]
     */
    daylineAllDay: string;
    /**
     * What the all-day strip says while it holds nothing [parts-1102]
     */
    daylineAllDayNone: string;
    /**
     * The now line's label, "Now 10:42" [parts-1102]
     */
    daylineNow: (time: string) => string;
    /**
     * The name of an item's move handle, "Move Morning run" [parts-1102]
     */
    daylineHandle: (label: string) => string;
    /**
     * The handle's title: how it moves [parts-1102]
     */
    daylineHandleHint: string;
    /**
     * What is said after a step, "Morning run moved to 09:15" [parts-1102]
     */
    daylineMoved: (label: string, time: string) => string;
    /**
     * What is said when a move is put back, "Morning run stays at 09:00" [parts-1102]
     */
    daylineKept: (label: string, time: string) => string;
    /**
     * Said after a read-only item's time: it cannot be moved [parts-1102]
     */
    daylineFixed: string;
    /**
     * Said after a done item's time [parts-1102]
     */
    daylineDone: string;
    /**
     * The marker while an item from a list is held over the hours, "Starts 14:30" [parts-1102]
     */
    daylineDropAt: (time: string) => string;
    /**
     * The second line of a movable block's title: a press opens it, a drag moves it [parts-1102 r2]
     */
    daylineBodyHint: string;
    /**
     * Said when a finger's hold lifted a block or a source, "Picked up Morning run" (label may be empty) [parts-1102 r2]
     */
    daylineLifted: (label: string) => string;
    /**
     * Said when a source landed on an hour, "Pay the bill planned at 15:00" (label may be empty) [parts-1102 r2]
     */
    daylineDropped: (label: string, time: string) => string;
    /**
     * The words on a day timeline's loading card [parts-1102]
     */
    daylineLoading: string;
    /**
     * The heading over a day with no item, when the page gives none [parts-1102]
     */
    daylineEmpty: string;
    /**
     * The sentence under it [parts-1102]
     */
    daylineEmptyText: string;
    /**
     * The heading over a day that could not be read [parts-1102]
     */
    daylineFailed: string;
    /**
     * Its Try again button [parts-1102]
     */
    daylineRetry: string;
    /**
     * What is said when a row settles, "Buy milk: Deleted" (js/settled.js) [parts-1102]
     */
    settledSaid: (name: string, word: string) => string;
    /**
     * The name of a settled row that has none [parts-1102]
     */
    settledNameless: string;
    /**
     * What is said after a swipe ran its action, "Buy milk: Done" (js/swipe.js) [parts-1102]
     */
    swipeSaid: (name: string, action: string) => string;
    /**
     * The name of a swatch picker when the page gives none (js/swatches.js) [parts-1102]
     */
    swatchesLabel: string;
    /**
     * The line under the swatches naming the current one, "Teal" [parts-1102]
     */
    swatchesChosen: (label: string) => string;
    /**
     * That line while no swatch is current [parts-1102]
     */
    swatchesNone: string;
    /**
     * The All chip a chip filter adds when the page wrote none (js/chip-filter.js) [forms-1102]
     */
    chipFilterAll: string;
    /**
     * What an add row says after the page took the line, "Added Pasta pesto"; '' when the line had no words [forms-1102]
     */
    addRowAdded: (name: string) => string;
    /**
     * An add row's refusal when the page refused without words of its own [forms-1102]
     */
    addRowRefused: string;
    /**
     * A chip's ⋯ menu button, "Actions for Pain" [forms-1102]
     */
    segmentedMenuFor: (chip: string) => string;
    /**
     * The name of the field a chip becomes, "New name for Pain" [forms-1102]
     */
    segmentedRenameField: (chip: string) => string;
    /**
     * Said when a chip is to be renamed to nothing [forms-1102]
     */
    segmentedRenameEmpty: string;
    /**
     * Said when the page refused a new name without words of its own [forms-1102]
     */
    segmentedRenameRefused: string;
    /**
     * The mark at a timeline lane's name, "1 try left", "No tries left" (js/gantt.js) [forms-1102]
     */
    ganttTriesLeft: (n: number) => string;
};
/**
 * @typedef {object} UxPartsStrings
 * @property {string} segmentedFoldName  What a folded chip group's menu button calls the group when the group has no name of its own ("Show") [ux-1101]
 * @property {string} segmentedFoldAll  What that button says while nothing (or All) is chosen [ux-1101]
 * @property {(name: string, chosen: string) => string} segmentedFoldButton  The folded group's button, "Show: Due" [ux-1101]
 * @property {(n: number) => string} segmentedFoldMany  What the button says for several values on at once, "3 chosen" [ux-1101]
 * @property {string} triTagAny  A three-way chip's visible word while it does not matter (the word look, the default of `data-kp-segmented-tri-look`) [ux-1101]
 * @property {string} triTagInclude  Its visible word while the value must be in [ux-1101]
 * @property {string} triTagExclude  Its visible word while the value must not be in [ux-1101]
 * @property {string} popoverFormInvalid  A popover form's problem line when the field is refused and the browser gave no words of its own [ux-1101]
 * @property {string} popoverFormClose  The name of a popover form's close button [ux-1101]
 * @property {string} popoverFormDate  A popover form's problem line when its date field holds text that is not a date [parts-1102]
 * @property {string} popoverFormDateRange  Its problem line when the date lies outside the days its calendar offers [parts-1102]
 * @property {string} dateNavGroup  The name of a date navigation when the page gives none [ux-1101]
 * @property {string} dateNavPrev  Its button to the range before, as shown [ux-1101]
 * @property {string} dateNavNext  Its button to the range after, as shown [ux-1101]
 * @property {string} dateNavToday  Its button back to the range that holds today [ux-1101]
 * @property {(unit: string) => string} dateNavPrevTitle  The first button's name and title, "Previous month" [ux-1101]
 * @property {(unit: string) => string} dateNavNextTitle  The last button's name and title, "Next month" [ux-1101]
 * @property {(unit: string) => string} dateNavTodayTitle  The middle button's title, "Show this month" [ux-1101]
 * @property {{ day: string, week: string, month: string }} dateNavUnits  What one step is called in each mode [ux-1101]
 * @property {(n: number, from: string, to: string) => string} dateNavWeekLabel  The range a week shows, "Week 45 · 02/11 to 08/11/2026" [ux-1101]
 * @property {(range: string) => string} dateNavShown  What the status region says after a move, "Now showing November 2026" [ux-1101]
 * @property {string} dateNavCurrent  The word after the range while it holds today [ux-1101]
 * @property {(name: string) => string} rowDeleted  The Undo toast's line after a row was deleted, "Ibuprofen 400 deleted" [ux-1101]
 * @property {string} rowDeletedNameless  The same line for a row with no name [ux-1101]
 * @property {(name: string) => string} rowRestored  The toast's line after Undo, "Ibuprofen 400 is back" [ux-1101]
 * @property {string} keysThen  The word between the caps of a chord in a line of shortcuts, "O then T" (js/keys.js) [parts-1102]
 * @property {string} daylineLabel  The name of a day timeline when the page gives none (js/dayline.js) [parts-1102]
 * @property {string} daylineAllDay  The name over the all-day strip above the hours [parts-1102]
 * @property {string} daylineAllDayNone  What the all-day strip says while it holds nothing [parts-1102]
 * @property {(time: string) => string} daylineNow  The now line's label, "Now 10:42" [parts-1102]
 * @property {(label: string) => string} daylineHandle  The name of an item's move handle, "Move Morning run" [parts-1102]
 * @property {string} daylineHandleHint  The handle's title: how it moves [parts-1102]
 * @property {(label: string, time: string) => string} daylineMoved  What is said after a step, "Morning run moved to 09:15" [parts-1102]
 * @property {(label: string, time: string) => string} daylineKept  What is said when a move is put back, "Morning run stays at 09:00" [parts-1102]
 * @property {string} daylineFixed  Said after a read-only item's time: it cannot be moved [parts-1102]
 * @property {string} daylineDone  Said after a done item's time [parts-1102]
 * @property {(time: string) => string} daylineDropAt  The marker while an item from a list is held over the hours, "Starts 14:30" [parts-1102]
 * @property {string} daylineBodyHint  The second line of a movable block's title: a press opens it, a drag moves it [parts-1102 r2]
 * @property {(label: string) => string} daylineLifted  Said when a finger's hold lifted a block or a source, "Picked up Morning run" (label may be empty) [parts-1102 r2]
 * @property {(label: string, time: string) => string} daylineDropped  Said when a source landed on an hour, "Pay the bill planned at 15:00" (label may be empty) [parts-1102 r2]
 * @property {string} daylineLoading  The words on a day timeline's loading card [parts-1102]
 * @property {string} daylineEmpty  The heading over a day with no item, when the page gives none [parts-1102]
 * @property {string} daylineEmptyText  The sentence under it [parts-1102]
 * @property {string} daylineFailed  The heading over a day that could not be read [parts-1102]
 * @property {string} daylineRetry  Its Try again button [parts-1102]
 * @property {(name: string, word: string) => string} settledSaid  What is said when a row settles, "Buy milk: Deleted" (js/settled.js) [parts-1102]
 * @property {string} settledNameless  The name of a settled row that has none [parts-1102]
 * @property {(name: string, action: string) => string} swipeSaid  What is said after a swipe ran its action, "Buy milk: Done" (js/swipe.js) [parts-1102]
 * @property {string} swatchesLabel  The name of a swatch picker when the page gives none (js/swatches.js) [parts-1102]
 * @property {(label: string) => string} swatchesChosen  The line under the swatches naming the current one, "Teal" [parts-1102]
 * @property {string} swatchesNone  That line while no swatch is current [parts-1102]
 * @property {string} chipFilterAll  The All chip a chip filter adds when the page wrote none (js/chip-filter.js) [forms-1102]
 * @property {(name: string) => string} addRowAdded  What an add row says after the page took the line, "Added Pasta pesto"; '' when the line had no words [forms-1102]
 * @property {string} addRowRefused  An add row's refusal when the page refused without words of its own [forms-1102]
 * @property {(chip: string) => string} segmentedMenuFor  A chip's ⋯ menu button, "Actions for Pain" [forms-1102]
 * @property {(chip: string) => string} segmentedRenameField  The name of the field a chip becomes, "New name for Pain" [forms-1102]
 * @property {string} segmentedRenameEmpty  Said when a chip is to be renamed to nothing [forms-1102]
 * @property {string} segmentedRenameRefused  Said when the page refused a new name without words of its own [forms-1102]
 * @property {(n: number) => string} ganttTriesLeft  The mark at a timeline lane's name, "1 try left", "No tries left" (js/gantt.js) [forms-1102]
 */
/** @type {UxPartsStrings} */
export declare const UX_PARTS_STRINGS: UxPartsStrings;
