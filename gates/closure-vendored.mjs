// The JavaScript modules chassis-rs bakes into its binary (gates/check-closure.mjs checks their closure).

/**
 * The six JavaScript modules chassis-rs bakes into its binary.
 *
 * A file leaves this list only when chassis-rs stops vendoring it, and
 * joins it only when they start — it is a record of somebody else's
 * build, not a preference of ours.
 */
export const VENDORED = [
    // applyStoredTheme(), the no-flash boot.
    'js/no-flash.js',
    // The theme names, the storage key and the version constant.
    'js/theme-registry.js',
    // applyTheme(), currentTheme(), the change event.
    'js/theme-core.js',
    // attachThemePickers().
    'js/theme-picker.js',
    // Every user-visible string, which every module above reads [KT5].
    'js/strings.js',
    // enforceContracts(), attachConfirmations(), attachSkipLinks().
    'js/components.js',
    // attachEffects(): the caret, the arrivals and the reveals. chassis-rs
    // has baked this one since its K15 (kp-themes 5.0.0, 2026-09-09) and the
    // list did not follow [fix-56]; at 5.0.0 it imported strings.js only, so
    // the closure held by luck. Since scope-117 it fetches its hooks with
    // import() and attaches through js/as-of.js: chassis-rs bakes all eleven
    // at its 7.0.0 upgrade, as MIGRATION.md's task for it says. Since the 2026-10-30 split js/effects.js is a facade over
    // js/effects-core/ and the headline hook sits over js/effects/headline-*.js; chassis-rs bakes the parts in beside them. Since
    // ctrl-b13 (2026-10-31) every hook is a class over js/effects-core/hook.js, and the arrival and pointer hooks have parts
    // beside them (arrival-run.js, pointer-light.js, press-bus.js).
    'js/effects.js',
    'js/effects-core/base.js',
    'js/effects-core/context.js',
    'js/effects-core/hook.js',
    'js/effects-core/engine.js',
    'js/effects-core/knobs.js',
    'js/effects-core/registry.js',
    'js/effects-core/timings-early.js',
    'js/effects-core/timings-formal.js',
    'js/effects-core/timings-grammars.js',
    'js/effects-core/timings.js',
    'js/effects-core/vocabulary.js',
    'js/as-of.js',
    'js/effects/headline.js',
    'js/effects/headline-run.js',
    'js/effects/headline-special.js',
    'js/effects/headline-text.js',
    'js/effects/emphasis.js',
    'js/effects/rule.js',
    'js/effects/count.js',
    'js/effects/caret.js',
    'js/effects/pointer.js',
    'js/effects/pointer-light.js',
    'js/effects/press-bus.js',
    'js/effects/measure.js',
    'js/effects/marquee.js',
    'js/effects/arrival.js',
    'js/effects/arrival-run.js',
    // Since the 2026-10-30 split, js/strings.js and js/components.js are facades over the files in
    // js/strings/ and js/components/. chassis-rs bakes the parts in beside them at its next upgrade,
    // or the facades' imports 404.
    'js/strings/alert-status-idmark.js',
    'js/strings/availability-qr-time.js',
    'js/strings/calendar-week-gantt.js',
    'js/strings/claim.js',
    'js/strings/console.js',
    'js/strings/defaults.js',
    'js/strings/deplist-trace-entity.js',
    'js/strings/diff-rating.js',
    'js/strings/feed-sequencer.js',
    'js/strings/focus.js',
    'js/strings/form-date-copy.js',
    'js/strings/passkeys-thread-chart.js',
    'js/strings/pipeline-uptime-timer.js',
    'js/strings/problem-graph-diagnostics.js',
    'js/strings/quantity-checklist-focus.js',
    'js/strings/question-transfer-conn.js',
    'js/strings/quote-status-calm.js',
    'js/strings/range-weekdays-runs.js',
    'js/strings/req-notices.js',
    'js/strings/rows-attention.js',
    'js/strings/board-menu-markdown.js',
    'js/strings/runtime.js',
    'js/strings/selection-undo-newpill.js',
    'js/strings/snooze-dated-slider.js',
    'js/strings/split-confirm-chart.js',
    'js/strings/stackbar-bullets-code.js',
    'js/strings/table-heat.js',
    'js/strings/toggle-palette-ack.js',
    'js/strings/uses-unsaved-compare.js',
    'js/strings/usual-logviewer.js',
    'js/strings/ux-parts.js',
    'js/strings/viewer-preview-gallery.js',
    'js/components/confirm-dialog.js',
    'js/components/contracts.js',
    'js/components/nav-menus.js',
    'js/components/nav-place.js',
    'js/components/nav-toggle.js',
    'js/components/skip-links.js',
    'js/components/state-word.js',
    'js/components/sticky-nav.js',
    'js/components/to-top.js',
    'js/components/type-confirm.js',
    // Since the 2026-10-30 split js/theme-core.js is a facade over js/theme-core/; chassis-rs bakes the parts in beside it.
    'js/theme-core/apply.js',
    'js/theme-core/preview.js',
    'js/theme-core/read.js',
    'js/theme-core/report.js',
    'js/theme-core/store.js',
    'js/theme-core/subscribe.js',
    'js/theme-core/values.js',
    // Since the 2026-10-30 conversion js/theme-picker.js is a facade over js/theme-picker/, and its picker is a controller class on
    // js/controller.js; chassis-rs bakes the parts and the controller base in beside it.
    // js/by-id.js [byid-1103]: the confirmation dialogs look ids up through byId, so chassis-rs bakes it in beside them.
    'js/by-id.js',
    'js/controller.js',
    'js/theme-picker/controller.js',
    'js/theme-picker/markup.js',
    'js/theme-picker/marks.js',
    'js/theme-picker/preview.js',
    'js/theme-picker/register.js',
    'js/theme-picker/values.js',
];
