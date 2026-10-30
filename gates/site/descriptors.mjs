// What a documentation page says, and where each part comes from [AR19].
//
// One descriptor per documented unit. The shape is pinned here because
// roughly 45 pages depend on it and changing it later touches all of
// them.
//
// A descriptor holds only what no machine can extract:
//
//   id            the page's file name and its anchor in the navigation
//   title         what the unit is called
//   group         which navigation section it sits under
//   intro         one paragraph: what it is
//   whenToUse     one paragraph: when to reach for it, and when not
//   classes       the `kp-` class families this page documents; the
//                 coverage gate reads them, so every family in
//                 css/components.css belongs to exactly one page
//   exports       the React exports this page documents, likewise
//   aliases       names this page also answers to, for events and
//                 attributes whose name does not follow from a class:
//                 `kp-color-change` is the colour picker's, whose family
//                 is `kp-colorpicker`. gates/site/selection.mjs states
//                 the rule; the coverage gate holds every attribute to it
//   examples      each { title, why, markup } -- `markup` is
//                 framework-free HTML, rendered live AND printed as the
//                 snippet from the same string, so the two cannot
//                 diverge (AR19). `script` is the page's own part, run live
//                 and printed below it, for a component that waits for data.
//                 `frame: true` (or `{ height, width }`) renders
//                 it in an iframe window of its own, for a launcher or a
//                 panel fixed to the window's edge
//   variants      each { name, what } -- every variant and state
//   accessibility bullets: what the package does, and what the consumer
//                 still has to do
//
// Everything else on the page is extracted from the sources: the props
// table from the `@typedef` blocks, the events from the `*_EVENT`
// constants, the knobs from `css/components.css`, the attributes from
// `js/`. A descriptor MAY NOT restate any of those -- gates/check-site.mjs
// refuses it, so a rename cannot leave a table behind (AR21).
//
// Each descriptor lives in its own file under ./descriptors/ (one per page, named
// after its id); this module only fixes the order the pages appear in.

import { themeSwitcherDescriptor } from './descriptors/theme-switcher.mjs';
import { effectsDescriptor } from './descriptors/effects.mjs';
import { buttonDescriptor } from './descriptors/button.mjs';
import { iconButtonDescriptor } from './descriptors/icon-button.mjs';
import { fieldDescriptor } from './descriptors/field.mjs';
import { switchDescriptor } from './descriptors/switch.mjs';
import { formDescriptor } from './descriptors/form.mjs';
import { comboboxDescriptor } from './descriptors/combobox.mjs';
import { datepickerDescriptor } from './descriptors/datepicker.mjs';
import { colorpickerDescriptor } from './descriptors/colorpicker.mjs';
import { uploadDescriptor } from './descriptors/upload.mjs';
import { wizardDescriptor } from './descriptors/wizard.mjs';
import { tableDescriptor } from './descriptors/table.mjs';
import { datatableDescriptor } from './descriptors/datatable.mjs';
import { treeDescriptor } from './descriptors/tree.mjs';
import { reorderDescriptor } from './descriptors/reorder.mjs';
import { gridLayoutDescriptor } from './descriptors/grid-layout.mjs';
import { timelineDescriptor } from './descriptors/timeline.mjs';
import { diffDescriptor } from './descriptors/diff.mjs';
import { copyableDescriptor } from './descriptors/copyable.mjs';
import { secretDescriptor } from './descriptors/secret.mjs';
import { dataFormattingDescriptor } from './descriptors/data-formatting.mjs';
import { emptyStateDescriptor } from './descriptors/empty-state.mjs';
import { alertDescriptor } from './descriptors/alert.mjs';
import { attentionDescriptor } from './descriptors/attention.mjs';
import { badgeDescriptor } from './descriptors/badge.mjs';
import { countDescriptor } from './descriptors/count.mjs';
import { marqueeDescriptor } from './descriptors/marquee.mjs';
import { toastDescriptor } from './descriptors/toast.mjs';
import { alarmDescriptor } from './descriptors/alarm.mjs';
import { progressDescriptor } from './descriptors/progress.mjs';
import { spinnerDescriptor } from './descriptors/spinner.mjs';
import { skeletonDescriptor } from './descriptors/skeleton.mjs';
import { healthDescriptor } from './descriptors/health.mjs';
import { logDescriptor } from './descriptors/log.mjs';
import { actionColumnsDescriptor } from './descriptors/action-columns.mjs';
import { kpiDescriptor } from './descriptors/kpi.mjs';
import { meterDescriptor } from './descriptors/meter.mjs';
import { kpiColumnsDescriptor } from './descriptors/kpi-columns.mjs';
import { kpiTrendDescriptor } from './descriptors/kpi-trend.mjs';
import { chartDescriptor } from './descriptors/chart.mjs';
import { graphDescriptor } from './descriptors/graph.mjs';
import { stateWordDescriptor } from './descriptors/state-word.mjs';
import { freshnessDescriptor } from './descriptors/freshness.mjs';
import { calendarDescriptor } from './descriptors/calendar.mjs';
import { segmentedDescriptor } from './descriptors/segmented.mjs';
import { heatDescriptor } from './descriptors/heat.mjs';
import { matrixDescriptor } from './descriptors/matrix.mjs';
import { barCellDescriptor } from './descriptors/bar-cell.mjs';
import { weekDescriptor } from './descriptors/week.mjs';
import { ganttDescriptor } from './descriptors/gantt.mjs';
import { sequencerDescriptor } from './descriptors/sequencer.mjs';
import { pipelineDescriptor } from './descriptors/pipeline.mjs';
import { uptimeDescriptor } from './descriptors/uptime.mjs';
import { typeConfirmDescriptor } from './descriptors/type-confirm.mjs';
import { commandDescriptor } from './descriptors/command.mjs';
import { timerDiscDescriptor } from './descriptors/timer-disc.mjs';
import { countdownDescriptor } from './descriptors/countdown.mjs';
import { rangeDescriptor } from './descriptors/range.mjs';
import { compareDescriptor } from './descriptors/compare.mjs';
import { weekdaysDescriptor } from './descriptors/weekdays.mjs';
import { runsDescriptor } from './descriptors/runs.mjs';
import { snoozeDescriptor } from './descriptors/snooze.mjs';
import { datedOptionsDescriptor } from './descriptors/dated-options.mjs';
import { sentenceDescriptor } from './descriptors/sentence.mjs';
import { sliderDescriptor } from './descriptors/slider.mjs';
import { toggleDescriptor } from './descriptors/toggle.mjs';
import { versionDeltaDescriptor } from './descriptors/version-delta.mjs';
import { ackGateDescriptor } from './descriptors/ack-gate.mjs';
import { deplistDescriptor } from './descriptors/deplist.mjs';
import { pathTraceDescriptor } from './descriptors/path-trace.mjs';
import { entityCardDescriptor } from './descriptors/entity-card.mjs';
import { unsavedDescriptor } from './descriptors/unsaved.mjs';
import { ratingDescriptor } from './descriptors/rating.mjs';
import { quoteDescriptor } from './descriptors/quote.mjs';
import { usualPickerDescriptor } from './descriptors/usual-picker.mjs';
import { claimDescriptor } from './descriptors/claim.mjs';
import { availabilityDescriptor } from './descriptors/availability.mjs';
import { qrDescriptor } from './descriptors/qr.mjs';
import { timeDescriptor } from './descriptors/time.mjs';
import { consoleDescriptor } from './descriptors/console.mjs';
import { logviewerDescriptor } from './descriptors/logviewer.mjs';
import { toolbarDescriptor } from './descriptors/toolbar.mjs';
import { keysDescriptor } from './descriptors/keys.mjs';
import { actionTileDescriptor } from './descriptors/action-tile.mjs';
import { statusRowDescriptor } from './descriptors/status-row.mjs';
import { facetsDescriptor } from './descriptors/facets.mjs';
import { quantityDescriptor } from './descriptors/quantity.mjs';
import { checklistDescriptor } from './descriptors/checklist.mjs';
import { timerDescriptor } from './descriptors/timer.mjs';
import { focusStepsDescriptor } from './descriptors/focus-steps.mjs';
import { wheelDescriptor } from './descriptors/wheel.mjs';
import { steplistDescriptor } from './descriptors/steplist.mjs';
import { tooltipDescriptor } from './descriptors/tooltip.mjs';
import { navBarDescriptor } from './descriptors/nav-bar.mjs';
import { sidenavDescriptor } from './descriptors/sidenav.mjs';
import { toTopDescriptor } from './descriptors/to-top.mjs';
import { sizeMotionDescriptor } from './descriptors/size-motion.mjs';
import { updateDescriptor } from './descriptors/update.mjs';
import { mediaDescriptor } from './descriptors/media.mjs';
import { breadcrumbDescriptor } from './descriptors/breadcrumb.mjs';
import { paginationDescriptor } from './descriptors/pagination.mjs';
import { tabsDescriptor } from './descriptors/tabs.mjs';
import { accordionDescriptor } from './descriptors/accordion.mjs';
import { menuDescriptor } from './descriptors/menu.mjs';
import { menuButtonDescriptor } from './descriptors/menu-button.mjs';
import { drawerDescriptor } from './descriptors/drawer.mjs';
import { helpTourDescriptor } from './descriptors/help-tour.mjs';
import { dialogDescriptor } from './descriptors/dialog.mjs';
import { commandPaletteDescriptor } from './descriptors/command-palette.mjs';
import { shortcutSheetDescriptor } from './descriptors/shortcut-sheet.mjs';
import { skipLinkDescriptor } from './descriptors/skip-link.mjs';
import { cardDescriptor } from './descriptors/card.mjs';
import { tilesDescriptor } from './descriptors/tiles.mjs';
import { pageHeaderDescriptor } from './descriptors/page-header.mjs';
import { splitPaneDescriptor } from './descriptors/split-pane.mjs';
import { pageShellDescriptor } from './descriptors/page-shell.mjs';
import { visuallyHiddenDescriptor } from './descriptors/visually-hidden.mjs';
import { idmarkDescriptor } from './descriptors/idmark.mjs';
import { stackbarDescriptor } from './descriptors/stackbar.mjs';
import { bulletsDescriptor } from './descriptors/bullets.mjs';
import { kvDescriptor } from './descriptors/kv.mjs';
import { formgridDescriptor } from './descriptors/formgrid.mjs';
import { formrowsDescriptor } from './descriptors/formrows.mjs';
import { codeDescriptor } from './descriptors/code.mjs';
import { connectionDescriptor } from './descriptors/connection.mjs';
import { refreshDescriptor } from './descriptors/refresh.mjs';
import { flashDescriptor } from './descriptors/flash.mjs';
import { requestInspectorDescriptor } from './descriptors/request-inspector.mjs';
import { jsonFieldDescriptor } from './descriptors/json-field.mjs';
import { ledeDescriptor } from './descriptors/lede.mjs';
import { newPillDescriptor } from './descriptors/new-pill.mjs';
import { noticesDescriptor } from './descriptors/notices.mjs';
import { feedDescriptor } from './descriptors/feed.mjs';
import { opsPageDescriptor } from './descriptors/ops-page.mjs';
import { statePlateDescriptor } from './descriptors/state-plate.mjs';
import { masterDetailDescriptor } from './descriptors/master-detail.mjs';
import { passkeysDescriptor } from './descriptors/passkeys.mjs';
import { problemsDescriptor } from './descriptors/problems.mjs';
import { questionDescriptor } from './descriptors/question.mjs';
import { disabledReasonDescriptor } from './descriptors/disabled-reason.mjs';
import { selectionDescriptor } from './descriptors/selection.mjs';
import { undoDescriptor } from './descriptors/undo.mjs';
import { threadDescriptor } from './descriptors/thread.mjs';
import { transferDescriptor } from './descriptors/transfer.mjs';
import { jobLineDescriptor } from './descriptors/job-line.mjs';
import { markdownDescriptor } from './descriptors/markdown.mjs';
import { codeFieldDescriptor } from './descriptors/code-field.mjs';
import { pageContentsDescriptor } from './descriptors/page-contents.mjs';
import { quietHoursDescriptor } from './descriptors/quiet-hours.mjs';
import { calmDescriptor } from './descriptors/calm.mjs';
import { autosizeDescriptor } from './descriptors/autosize.mjs';
import { anchorsDescriptor } from './descriptors/anchors.mjs';
import { viewerDescriptor } from './descriptors/viewer.mjs';
import { documentPreviewDescriptor } from './descriptors/document-preview.mjs';
import { galleryDescriptor } from './descriptors/gallery.mjs';
import { usesMapDescriptor } from './descriptors/uses-map.mjs';
import { printDescriptor } from './descriptors/print.mjs';

/** @typedef {import('./descriptors/types.mjs').Descriptor} Descriptor */
/** @typedef {import('./descriptors/types.mjs').Example} Example */
/** @typedef {import('./descriptors/types.mjs').Variant} Variant */

/** The navigation sections, in order. */
export const GROUPS = ['Getting started', 'Theming', 'Layout', 'Forms', 'Data', 'Feedback', 'Navigation', 'Content', 'Structure'];

/** @type {Descriptor[]} */
export const DESCRIPTORS = [
    themeSwitcherDescriptor,
    effectsDescriptor,
    buttonDescriptor,
    iconButtonDescriptor,
    fieldDescriptor,
    switchDescriptor,
    formDescriptor,
    comboboxDescriptor,
    datepickerDescriptor,
    colorpickerDescriptor,
    uploadDescriptor,
    wizardDescriptor,
    tableDescriptor,
    datatableDescriptor,
    treeDescriptor,
    reorderDescriptor,
    gridLayoutDescriptor,
    timelineDescriptor,
    diffDescriptor,
    copyableDescriptor,
    secretDescriptor,
    dataFormattingDescriptor,
    emptyStateDescriptor,
    alertDescriptor,
    attentionDescriptor,
    badgeDescriptor,
    countDescriptor,
    marqueeDescriptor,
    toastDescriptor,
    alarmDescriptor,
    progressDescriptor,
    spinnerDescriptor,
    skeletonDescriptor,
    healthDescriptor,
    logDescriptor,
    actionColumnsDescriptor,
    kpiDescriptor,
    meterDescriptor,
    kpiColumnsDescriptor,
    kpiTrendDescriptor,
    chartDescriptor,
    graphDescriptor,
    stateWordDescriptor,
    freshnessDescriptor,
    calendarDescriptor,
    segmentedDescriptor,
    heatDescriptor,
    matrixDescriptor,
    barCellDescriptor,
    weekDescriptor,
    ganttDescriptor,
    sequencerDescriptor,
    pipelineDescriptor,
    uptimeDescriptor,
    typeConfirmDescriptor,
    commandDescriptor,
    timerDiscDescriptor,
    countdownDescriptor,
    rangeDescriptor,
    compareDescriptor,
    weekdaysDescriptor,
    runsDescriptor,
    snoozeDescriptor,
    datedOptionsDescriptor,
    sentenceDescriptor,
    sliderDescriptor,
    toggleDescriptor,
    versionDeltaDescriptor,
    ackGateDescriptor,
    deplistDescriptor,
    pathTraceDescriptor,
    entityCardDescriptor,
    unsavedDescriptor,
    ratingDescriptor,
    quoteDescriptor,
    usualPickerDescriptor,
    claimDescriptor,
    availabilityDescriptor,
    qrDescriptor,
    timeDescriptor,
    consoleDescriptor,
    logviewerDescriptor,
    toolbarDescriptor,
    keysDescriptor,
    actionTileDescriptor,
    statusRowDescriptor,
    facetsDescriptor,
    quantityDescriptor,
    checklistDescriptor,
    timerDescriptor,
    focusStepsDescriptor,
    wheelDescriptor,
    steplistDescriptor,
    tooltipDescriptor,
    navBarDescriptor,
    sidenavDescriptor,
    toTopDescriptor,
    sizeMotionDescriptor,
    updateDescriptor,
    mediaDescriptor,
    breadcrumbDescriptor,
    paginationDescriptor,
    tabsDescriptor,
    accordionDescriptor,
    menuDescriptor,
    menuButtonDescriptor,
    drawerDescriptor,
    helpTourDescriptor,
    dialogDescriptor,
    commandPaletteDescriptor,
    shortcutSheetDescriptor,
    skipLinkDescriptor,
    cardDescriptor,
    tilesDescriptor,
    pageHeaderDescriptor,
    splitPaneDescriptor,
    pageShellDescriptor,
    visuallyHiddenDescriptor,
    idmarkDescriptor,
    stackbarDescriptor,
    bulletsDescriptor,
    kvDescriptor,
    formgridDescriptor,
    formrowsDescriptor,
    codeDescriptor,
    connectionDescriptor,
    refreshDescriptor,
    flashDescriptor,
    requestInspectorDescriptor,
    jsonFieldDescriptor,
    ledeDescriptor,
    newPillDescriptor,
    noticesDescriptor,
    feedDescriptor,
    opsPageDescriptor,
    statePlateDescriptor,
    masterDetailDescriptor,
    passkeysDescriptor,
    problemsDescriptor,
    questionDescriptor,
    disabledReasonDescriptor,
    selectionDescriptor,
    undoDescriptor,
    threadDescriptor,
    transferDescriptor,
    jobLineDescriptor,
    markdownDescriptor,
    codeFieldDescriptor,
    pageContentsDescriptor,
    quietHoursDescriptor,
    calmDescriptor,
    autosizeDescriptor,
    anchorsDescriptor,
    viewerDescriptor,
    documentPreviewDescriptor,
    galleryDescriptor,
    usesMapDescriptor,
    printDescriptor,
];
