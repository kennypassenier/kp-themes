export type QuantityChecklistFocusStrings = {
    /**
     * The minus button's name, "Portions, less" (js/quantity.js) [kpadopt4]
     */
    quantityLess: (label: string) => string;
    /**
     * The plus button's name, "Portions, more" [kpadopt4]
     */
    quantityMore: (label: string) => string;
    /**
     * The value with its unit, as a screen reader hears it, "6 portions" [kpadopt4]
     */
    quantityValue: (value: string, unit: string) => string;
    /**
     * The verb of a button that follows a quantity, when the button names none: "Add" (js/accept-follows.js) [mc-r2]
     */
    acceptVerb: string;
    /**
     * The button's words for an amount: "Add 3 boxes" [mc-r2]
     */
    acceptFollowsLabel: (verb: string, amount: string, unit: string) => string;
    /**
     * The button's words while the amount makes no sense: "Add boxes" [mc-r2]
     */
    acceptFollowsNone: (verb: string, unit: string) => string;
    /**
     * Why that button is off: "Choose how many boxes first." [mc-r2]
     */
    acceptFollowsReason: (unit: string) => string;
    /**
     * A checklist group's count beside its heading, "4 of 9" (js/checklist.js) [kpadopt4]
     */
    checklistCount: (done: number, total: number) => string;
    /**
     * The whole list's count in its bar, "4 of 9 done" [kpadopt4]
     */
    checklistSummary: (done: number, total: number) => string;
    /**
     * The bar's button that ticks every item [kpadopt4]
     */
    checklistCheckAll: string;
    /**
     * The bar's button that takes the tick off every item [cook-1017]
     */
    checklistUncheckAll: string;
    /**
     * The bar's button that takes the ticked items away [kpadopt4]
     */
    checklistClear: string;
    /**
     * The button that brings them back [kpadopt4]
     */
    checklistUndo: string;
    /**
     * The bar's line after a clear, "3 cleared" [kpadopt4]
     */
    checklistCleared: (n: number) => string;
    /**
     * Said after Undo [kpadopt4]
     */
    checklistRestored: (n: number) => string;
    /**
     * An empty checklist [kpadopt4]
     */
    checklistEmpty: string;
    /**
     * The words under a loading checklist's spinner [kpadopt4]
     */
    checklistLoading: string;
    /**
     * A checklist that could not be read, when the page gives no message [kpadopt4]
     */
    checklistFailed: string;
    /**
     * Said when an item is ticked [kpadopt4]
     */
    checklistDone: (label: string) => string;
    /**
     * Said when an item is ticked with the keyboard and sank [kpadopt4]
     */
    checklistDoneMoved: (label: string) => string;
    /**
     * Said when an item is unticked [kpadopt4]
     */
    checklistOpen: (label: string) => string;
    /**
     * A kitchen timer's state word while it runs (js/timer.js) [kpadopt4]
     */
    timerRunning: string;
    /**
     * Its state word once it has ended [kpadopt4]
     */
    timerDoneWord: string;
    /**
     * The large line on an ended timer, its notification and its alert, "Rice is done" [kpadopt4]
     */
    timerDone: (name: string) => string;
    /**
     * What a timer says aloud when it ends and the list speaks, "Rice is done" [cook-1017]
     */
    timerSpoken: (name: string) => string;
    /**
     * The button on an ended timer that stops it and takes it away [kpadopt4]
     */
    timerStopRing: string;
    /**
     * That button's accessible name [kpadopt4]
     */
    timerAddMinuteTo: (name: string) => string;
    /**
     * The remove button's accessible name and tooltip [kpadopt4]
     */
    timerRemove: (name: string) => string;
    /**
     * A list with no timer [kpadopt4]
     */
    timerEmpty: string;
    /**
     * The busy card over a timer list that is being read [r6r8-1019]
     */
    timersLoading: string;
    /**
     * A timer list that could not be read, when the page gives no message [r6r8-1019]
     */
    timersFailed: string;
    /**
     * Said once when a timer has a minute left [kpadopt4]
     */
    timerLastMinute: (name: string) => string;
    /**
     * Said when a kitchen timer starts, with its name and its clock [kpadopt4]
     */
    timerStartedNamed: (name: string, clock: string) => string;
    /**
     * Said when a starter is pressed while its timer runs [kpadopt4]
     */
    timerAlready: (name: string) => string;
    /**
     * The count over a step shown on its own, "Step 3 of 8" (js/focus-steps.js) [kpadopt4]
     */
    focusCount: (n: number, total: number) => string;
    /**
     * The button that goes on to the next step [kpadopt4]
     */
    focusNext: string;
    /**
     * The button that goes back a step [kpadopt4]
     */
    focusPrevious: string;
    /**
     * The next button on the last step [kpadopt4]
     */
    focusDone: string;
    /**
     * The heading over what a step needs [kpadopt4]
     */
    focusNeeds: string;
    /**
     * A step's timer button, "Start a timer · 10 min" [kpadopt4]
     */
    focusTimer: (duration: string) => string;
    /**
     * The button that reads the step aloud [kpadopt4]
     */
    focusReadAloud: string;
    /**
     * The same button while it reads [kpadopt4]
     */
    focusStopReading: string;
    /**
     * The screen line while the screen is kept on [kpadopt4]
     */
    focusWakeOn: string;
    /**
     * The screen line when it is not [kpadopt4]
     */
    focusWakeOff: string;
    /**
     * The screen line in a browser that cannot keep it on [kpadopt4]
     */
    focusWakeUnsupported: string;
    /**
     * A view with no steps [kpadopt4]
     */
    focusEmpty: string;
    /**
     * The words under its spinner while the steps load [kpadopt4]
     */
    focusLoading: string;
    /**
     * Steps that could not be read, when the page gives no message [kpadopt4]
     */
    focusFailed: string;
    /**
     * The button in the middle of a wheel that picks (js/wheel.js) [kpadopt4]
     */
    wheelSpin: string;
    /**
     * The same button once the wheel has chosen [kpadopt4]
     */
    wheelSpinAgain: string;
    /**
     * The same line on a kiosk wheel, which has no button [hover-wheel-1019]
     */
    wheelIdleKiosk: string;
    /**
     * The name of a kiosk wheel for a screen reader: it is the one control [hover-wheel-1019]
     */
    wheelSpinKiosk: string;
    /**
     * Added to a resting choice's tooltip [hover-wheel-1019]
     */
    wheelResting: string;
    /**
     * The line under a wheel that has not spun yet [kpadopt4]
     */
    wheelIdle: string;
    /**
     * The line over the outcome, "The wheel chose" [kpadopt4]
     */
    wheelChose: string;
    /**
     * The line while it turns [kpadopt4]
     */
    wheelSpinning: string;
    /**
     * The line over the outcome when there was only one choice [kpadopt4]
     */
    wheelOnlyOne: string;
    /**
     * A wheel with no choices, when the page gives no sentence [kpadopt4]
     */
    wheelEmpty: string;
    /**
     * The words under its spinner while the choices load [kpadopt4]
     */
    wheelLoading: string;
    /**
     * Choices that could not be read, when the page gives no message [kpadopt4]
     */
    wheelFailed: string;
};
/**
 * @typedef {object} QuantityChecklistFocusStrings
 * @property {(label: string) => string} quantityLess  The minus button's name, "Portions, less" (js/quantity.js) [kpadopt4]
 * @property {(label: string) => string} quantityMore  The plus button's name, "Portions, more" [kpadopt4]
 * @property {(value: string, unit: string) => string} quantityValue  The value with its unit, as a screen reader hears it, "6 portions" [kpadopt4]
 * @property {string} acceptVerb  The verb of a button that follows a quantity, when the button names none: "Add" (js/accept-follows.js) [mc-r2]
 * @property {(verb: string, amount: string, unit: string) => string} acceptFollowsLabel  The button's words for an amount: "Add 3 boxes" [mc-r2]
 * @property {(verb: string, unit: string) => string} acceptFollowsNone  The button's words while the amount makes no sense: "Add boxes" [mc-r2]
 * @property {(unit: string) => string} acceptFollowsReason  Why that button is off: "Choose how many boxes first." [mc-r2]
 * @property {(done: number, total: number) => string} checklistCount  A checklist group's count beside its heading, "4 of 9" (js/checklist.js) [kpadopt4]
 * @property {(done: number, total: number) => string} checklistSummary  The whole list's count in its bar, "4 of 9 done" [kpadopt4]
 * @property {string} checklistCheckAll  The bar's button that ticks every item [kpadopt4]
 * @property {string} checklistUncheckAll  The bar's button that takes the tick off every item [cook-1017]
 * @property {string} checklistClear  The bar's button that takes the ticked items away [kpadopt4]
 * @property {string} checklistUndo  The button that brings them back [kpadopt4]
 * @property {(n: number) => string} checklistCleared  The bar's line after a clear, "3 cleared" [kpadopt4]
 * @property {(n: number) => string} checklistRestored  Said after Undo [kpadopt4]
 * @property {string} checklistEmpty  An empty checklist [kpadopt4]
 * @property {string} checklistLoading  The words under a loading checklist's spinner [kpadopt4]
 * @property {string} checklistFailed  A checklist that could not be read, when the page gives no message [kpadopt4]
 * @property {(label: string) => string} checklistDone  Said when an item is ticked [kpadopt4]
 * @property {(label: string) => string} checklistDoneMoved  Said when an item is ticked with the keyboard and sank [kpadopt4]
 * @property {(label: string) => string} checklistOpen  Said when an item is unticked [kpadopt4]
 * @property {string} timerRunning  A kitchen timer's state word while it runs (js/timer.js) [kpadopt4]
 * @property {string} timerDoneWord  Its state word once it has ended [kpadopt4]
 * @property {(name: string) => string} timerDone  The large line on an ended timer, its notification and its alert, "Rice is done" [kpadopt4]
 * @property {(name: string) => string} timerSpoken  What a timer says aloud when it ends and the list speaks, "Rice is done" [cook-1017]
 * @property {string} timerStopRing  The button on an ended timer that stops it and takes it away [kpadopt4]
 * @property {(name: string) => string} timerAddMinuteTo  That button's accessible name [kpadopt4]
 * @property {(name: string) => string} timerRemove  The remove button's accessible name and tooltip [kpadopt4]
 * @property {string} timerEmpty  A list with no timer [kpadopt4]
 * @property {string} timersLoading  The busy card over a timer list that is being read [r6r8-1019]
 * @property {string} timersFailed  A timer list that could not be read, when the page gives no message [r6r8-1019]
 * @property {(name: string) => string} timerLastMinute  Said once when a timer has a minute left [kpadopt4]
 * @property {(name: string, clock: string) => string} timerStartedNamed  Said when a kitchen timer starts, with its name and its clock [kpadopt4]
 * @property {(name: string) => string} timerAlready  Said when a starter is pressed while its timer runs [kpadopt4]
 * @property {(n: number, total: number) => string} focusCount  The count over a step shown on its own, "Step 3 of 8" (js/focus-steps.js) [kpadopt4]
 * @property {string} focusNext  The button that goes on to the next step [kpadopt4]
 * @property {string} focusPrevious  The button that goes back a step [kpadopt4]
 * @property {string} focusDone  The next button on the last step [kpadopt4]
 * @property {string} focusNeeds  The heading over what a step needs [kpadopt4]
 * @property {(duration: string) => string} focusTimer  A step's timer button, "Start a timer · 10 min" [kpadopt4]
 * @property {string} focusReadAloud  The button that reads the step aloud [kpadopt4]
 * @property {string} focusStopReading  The same button while it reads [kpadopt4]
 * @property {string} focusWakeOn  The screen line while the screen is kept on [kpadopt4]
 * @property {string} focusWakeOff  The screen line when it is not [kpadopt4]
 * @property {string} focusWakeUnsupported  The screen line in a browser that cannot keep it on [kpadopt4]
 * @property {string} focusEmpty  A view with no steps [kpadopt4]
 * @property {string} focusLoading  The words under its spinner while the steps load [kpadopt4]
 * @property {string} focusFailed  Steps that could not be read, when the page gives no message [kpadopt4]
 * @property {string} wheelSpin  The button in the middle of a wheel that picks (js/wheel.js) [kpadopt4]
 * @property {string} wheelSpinAgain  The same button once the wheel has chosen [kpadopt4]
 * @property {string} wheelIdleKiosk  The same line on a kiosk wheel, which has no button [hover-wheel-1019]
 * @property {string} wheelSpinKiosk  The name of a kiosk wheel for a screen reader: it is the one control [hover-wheel-1019]
 * @property {string} wheelResting  Added to a resting choice's tooltip [hover-wheel-1019]
 * @property {string} wheelIdle  The line under a wheel that has not spun yet [kpadopt4]
 * @property {string} wheelChose  The line over the outcome, "The wheel chose" [kpadopt4]
 * @property {string} wheelSpinning  The line while it turns [kpadopt4]
 * @property {string} wheelOnlyOne  The line over the outcome when there was only one choice [kpadopt4]
 * @property {string} wheelEmpty  A wheel with no choices, when the page gives no sentence [kpadopt4]
 * @property {string} wheelLoading  The words under its spinner while the choices load [kpadopt4]
 * @property {string} wheelFailed  Choices that could not be read, when the page gives no message [kpadopt4]
 */
/** @type {QuantityChecklistFocusStrings} */
export declare const QUANTITY_CHECKLIST_FOCUS_STRINGS: QuantityChecklistFocusStrings;
