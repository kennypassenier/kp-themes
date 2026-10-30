export type ProblemGraphDiagnosticsStrings = {
    /**
     * The label before the remedy of a problem, "What now" (js/problems.js) [kpadopt5]
     */
    problemRemedy: string;
    /**
     * The button that opens the problems folded away, "Show the other 3" [kpadopt5]
     */
    problemShowOthers: (n: number) => string;
    /**
     * The button that folds them again [kpadopt5]
     */
    problemShowFewer: string;
    /**
     * The copy button on a remedy that is a command [kpadopt5]
     */
    problemCopy: string;
    /**
     * The name of a list of problems for a screen reader, "3 problems" [kpadopt5]
     */
    problemListLabel: (n: number) => string;
    /**
     * The word on a button after its work went well and the page gave no word of its own (js/flash.js) [kpadopt5]
     */
    flashDone: string;
    /**
     * The word on a button after the work was refused [kpadopt5]
     */
    flashRefused: string;
    /**
     * The word on a button after the work failed without an answer [kpadopt5]
     */
    flashFailed: string;
    /**
     * The network graph's way back to every node and every kind of link (js/graph.js) [scope-143]
     */
    graphShowAll: string;
    /**
     * Its title [scope-143]
     */
    graphShowAllTitle: string;
    /**
     * The hint under the graph, and the second half of its picture's accessible name: what a pointer, a click and the keys do [scope-143]
     */
    graphHint: string;
    /**
     * The name of the list of kinds of link over the graph [scope-143]
     */
    graphKinds: string;
    /**
     * A loading graph's sentence when the page gives none (`setGraphState(el, 'loading')`) [scope-143]
     */
    graphLoading: string;
    /**
     * The picture's name when the graph has no `aria-label` [scope-143]
     */
    graphUnnamed: string;
    /**
     * The name of the group of zoom controls inside the graph (`data-kp-zoom`) [graph-1020]
     */
    graphZoom: string;
    /**
     * The zoom-in control's name [graph-1020]
     */
    graphZoomIn: string;
    /**
     * The zoom-out control's name [graph-1020]
     */
    graphZoomOut: string;
    /**
     * The words on the control that puts the view back [graph-1020]
     */
    graphZoomReset: string;
    /**
     * Its title and accessible name [graph-1020]
     */
    graphZoomResetTitle: string;
    /**
     * The sentence added to the hint while zoom is on: wheel or pinch, drag, the keys [graph-1020]
     */
    graphZoomHint: string;
    /**
     * The sentence added to the hint while details are on: what a pick opens and what Esc does [graph-1020]
     */
    graphDetailHint: string;
    /**
     * The words on the button that closes a node's details [graph-1020]
     */
    graphDetailClose: string;
    /**
     * Its title [graph-1020]
     */
    graphDetailCloseTitle: string;
    breadcrumb: string;
    pagination: string;
    themePicker: string;
    themeSaveFailed: string;
    themeSaveRefused: string;
    contractDestructive: string;
    contractSemantic: string;
    themeGroupLight: string;
    themeGroupDark: string;
    themeUnknown: (requested: string, applied: string) => string;
    /**
     * The console warning when two elements of one component ask to be remembered under the same name
     */
    rememberClash: (name: string, component: string) => string;
    /**
     * The console error when a lazily loaded register did not arrive; the theme stays what it was [scope-50]
     */
    registerLoadFailed: (theme: string, href: string) => string;
    diagnosticsHeading: string;
    diagnosticsStylesheet: string;
    diagnosticsScript: string;
    diagnosticsVersion: string;
    diagnosticsThemes: string;
    /**
     * The diagnostics row that lists unknown hook values [AR44]
     */
    diagnosticsEffects: string;
    diagnosticsEffectsNone: string;
    diagnosticsVerdict: string;
    diagnosticsMatch: string;
    diagnosticsStylesheetBehind: (stylesheet: string, script: string) => string;
    diagnosticsScriptBehind: (stylesheet: string, script: string) => string;
    diagnosticsThemesDiffer: (version: string) => string;
    diagnosticsNoVersion: string;
    diagnosticsOnlyInStylesheet: (names: string) => string;
    diagnosticsOnlyInScript: (names: string) => string;
    diagnosticsUnknownVersion: string;
    /**
     * A three-way filter chip that must be in, as a screen reader hears it after the chip's name (js/segmented.js, `data-kp-segmented="tri"`) [kpadopt4]
     */
    triInclude: string;
    /**
     * A chip that must not be in [kpadopt4]
     */
    triExclude: string;
    /**
     * A chip that may or may not be in [kpadopt4]
     */
    triAny: string;
    /**
     * What a three-way group says after a press, "Chicken: required" [kpadopt4]
     */
    triAnnounce: (label: string, state: string) => string;
    /**
     * The line under a three-way group while nothing is chosen [kpadopt4]
     */
    triHint: string;
    /**
     * The same line once something is chosen [kpadopt4]
     */
    triSummary: (include: string[], exclude: string[]) => string;
    /**
     * What a three-way group says after Clear all [kpadopt4]
     */
    triCleared: string;
    /**
     * The placeholder of a field whose chips are only its most used choices: "Search all 9" (js/segmented/link.js) [mc-r2]
     */
    segmentedSearchAll: (n: number) => string;
};
/**
 * @typedef {object} ProblemGraphDiagnosticsStrings
 * @property {string} problemRemedy  The label before the remedy of a problem, "What now" (js/problems.js) [kpadopt5]
 * @property {(n: number) => string} problemShowOthers  The button that opens the problems folded away, "Show the other 3" [kpadopt5]
 * @property {string} problemShowFewer  The button that folds them again [kpadopt5]
 * @property {string} problemCopy  The copy button on a remedy that is a command [kpadopt5]
 * @property {(n: number) => string} problemListLabel  The name of a list of problems for a screen reader, "3 problems" [kpadopt5]
 * @property {string} flashDone  The word on a button after its work went well and the page gave no word of its own (js/flash.js) [kpadopt5]
 * @property {string} flashRefused  The word on a button after the work was refused [kpadopt5]
 * @property {string} flashFailed  The word on a button after the work failed without an answer [kpadopt5]
 * @property {string} graphShowAll  The network graph's way back to every node and every kind of link (js/graph.js) [scope-143]
 * @property {string} graphShowAllTitle  Its title [scope-143]
 * @property {string} graphHint  The hint under the graph, and the second half of its picture's accessible name: what a pointer, a click and the keys do [scope-143]
 * @property {string} graphKinds  The name of the list of kinds of link over the graph [scope-143]
 * @property {string} graphLoading  A loading graph's sentence when the page gives none (`setGraphState(el, 'loading')`) [scope-143]
 * @property {string} graphUnnamed  The picture's name when the graph has no `aria-label` [scope-143]
 * @property {string} graphZoom  The name of the group of zoom controls inside the graph (`data-kp-zoom`) [graph-1020]
 * @property {string} graphZoomIn  The zoom-in control's name [graph-1020]
 * @property {string} graphZoomOut  The zoom-out control's name [graph-1020]
 * @property {string} graphZoomReset  The words on the control that puts the view back [graph-1020]
 * @property {string} graphZoomResetTitle  Its title and accessible name [graph-1020]
 * @property {string} graphZoomHint  The sentence added to the hint while zoom is on: wheel or pinch, drag, the keys [graph-1020]
 * @property {string} graphDetailHint  The sentence added to the hint while details are on: what a pick opens and what Esc does [graph-1020]
 * @property {string} graphDetailClose  The words on the button that closes a node's details [graph-1020]
 * @property {string} graphDetailCloseTitle  Its title [graph-1020]

 * @property {string} breadcrumb
 * @property {string} pagination
 * @property {string} themePicker
 * @property {string} themeSaveFailed
 * @property {string} themeSaveRefused
 * @property {string} contractDestructive
 * @property {string} contractSemantic
 * @property {string} themeGroupLight
 * @property {string} themeGroupDark
 * @property {(requested: string, applied: string) => string} themeUnknown
 * @property {(name: string, component: string) => string} rememberClash  The console warning when two elements of one component ask to be remembered under the same name
 * @property {(theme: string, href: string) => string} registerLoadFailed  The console error when a lazily loaded register did not arrive; the theme stays what it was [scope-50]
 * @property {string} diagnosticsHeading
 * @property {string} diagnosticsStylesheet
 * @property {string} diagnosticsScript
 * @property {string} diagnosticsVersion
 * @property {string} diagnosticsThemes
 * @property {string} diagnosticsEffects  The diagnostics row that lists unknown hook values [AR44]
 * @property {string} diagnosticsEffectsNone
 * @property {string} diagnosticsVerdict
 * @property {string} diagnosticsMatch
 * @property {(stylesheet: string, script: string) => string} diagnosticsStylesheetBehind
 * @property {(stylesheet: string, script: string) => string} diagnosticsScriptBehind
 * @property {(version: string) => string} diagnosticsThemesDiffer
 * @property {string} diagnosticsNoVersion
 * @property {(names: string) => string} diagnosticsOnlyInStylesheet
 * @property {(names: string) => string} diagnosticsOnlyInScript
 * @property {string} diagnosticsUnknownVersion
 * @property {string} triInclude  A three-way filter chip that must be in, as a screen reader hears it after the chip's name (js/segmented.js, `data-kp-segmented="tri"`) [kpadopt4]
 * @property {string} triExclude  A chip that must not be in [kpadopt4]
 * @property {string} triAny  A chip that may or may not be in [kpadopt4]
 * @property {(label: string, state: string) => string} triAnnounce  What a three-way group says after a press, "Chicken: required" [kpadopt4]
 * @property {string} triHint  The line under a three-way group while nothing is chosen [kpadopt4]
 * @property {(include: string[], exclude: string[]) => string} triSummary  The same line once something is chosen [kpadopt4]
 * @property {string} triCleared  What a three-way group says after Clear all [kpadopt4]
 * @property {(n: number) => string} segmentedSearchAll  The placeholder of a field whose chips are only its most used choices: "Search all 9" (js/segmented/link.js) [mc-r2]
 */
/** @type {ProblemGraphDiagnosticsStrings} */
export declare const PROBLEM_GRAPH_DIAGNOSTICS_STRINGS: ProblemGraphDiagnosticsStrings;
