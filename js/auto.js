// Attach everything, once, when the document is ready [KT6].
//
// The one file in js/ that is allowed a side effect, and it says so in
// package.json. Every other module is pure since 3.0.0: importing it
// does nothing, and a consumer calls attachX() when the markup is there.
// This entry is for the consumer who wants what 2.x did — one script tag
// and the page comes alive — and it is what kyu and almanac load.
//
//   <script type="module" src="/js/auto.js"></script>
//
// It attaches to the whole document. A consumer who renders parts of a
// page later calls the individual attach functions on that subtree.
//
// Only what the page carries is fetched [scope-115]. Until 6.1.0 this file
// imported every module and called every attach function; each walked the
// document for its own selector and, on a page without that component,
// found nothing — after the browser had downloaded and parsed it. Now the
// document is asked first, one querySelector per module, and a module is
// `import()`ed only when its selector matches. The attach functions are the
// modules' own, untouched; what changes is when their module arrives, so
// `attachAll()` is asynchronous: the detach it returns carries `ready`, a
// promise that resolves once every needed module has attached, and
// `modules`, the names fetched.
//
// Four modules are not asked about, because what they do does not depend on
// markup a load-time check can see (measured over every attach function,
// 2026-09-17): remember restores state before the first frame; overlays
// dismisses toasts made later by `toast()` and watches for popovers added
// later; the theme picker's module keeps a theme chosen in another tab in
// step; effects arms its attribute on the root, which every register
// styles, and acts on theme knobs rather than on markup.
//
// The selectors below are each attach function's own. tests/auto-lazy.spec.mjs
// opens every page that loads this file twice — as it is, and with the eager
// entry of 6.1.0 served in its place — and the markup must come out the same.

import { applyStoredTheme } from './no-flash.js';
import { applyTheme } from './theme-core.js';
import { THEMES } from './theme-registry.js';
import { attachRemembered, restoreRemembered } from './remember.js';
import { attachDialogs, attachDismissals, attachScrollbars, attachTabs, attachTooltips } from './overlays.js';
import { attachThemePickers } from './theme-picker.js';
import { attachEffects } from './effects.js';
import { asOf, presentUnder, settleAfter } from './as-of.js';

/**
 * @typedef {object} Need
 * @property {string} name the module, as `detach.modules` reports it
 * @property {string} when every selector through which the module's attach functions act
 * @property {() => Promise<any>} load
 * @property {(module: any, root: ParentNode) => unknown[]} attach
 */

/** @type {Need[]} */
export const NEEDS = [
    {
        name: 'components',
        when: [
            '[data-kp-contract-error]',
            '[data-kp-destructive]',
            '[data-kp-semantic]',
            '[data-kp-confirm]',
            '[data-kp-type-confirm]',
            '.kp-skip-link',
            '[data-kp-skip]',
            '[data-kp-to-top]',
            '[data-kp-nav-toggle]',
            '.kp-nav-wrap--sticky',
            '.kp-nav',
        ].join(', '),
        load: () => import('./components.js'),
        attach: (m, root) => [
            m.enforceContracts(root),
            m.attachConfirmations(root),
            m.attachTypeConfirms(root),
            m.attachSkipLinks(root),
            m.attachToTop(root),
            m.attachNavToggles(root),
            m.attachStickyNavs(root),
            m.attachNavMenus(root),
        ],
    },
    { name: 'sidenav', when: '.kp-sidenav', load: () => import('./sidenav.js'), attach: (m, root) => [m.attachSidenavs(root)] },
    { name: 'alarm', when: '[data-kp-alarm]', load: () => import('./alarm.js'), attach: (m, root) => [m.attachAlarms(root)] },
    {
        name: 'combobox',
        when: '[data-kp-combobox], select',
        load: () => import('./combobox.js'),
        attach: (m, root) => [m.attachComboboxes(root), m.attachSelects(root)],
    },
    {
        name: 'palette',
        when: '[data-kp-palette], [data-kp-shortcuts]',
        load: () => import('./palette.js'),
        attach: (m, root) => [m.attachPalettes(root)],
    },
    { name: 'datatable', when: '[data-kp-datatable]', load: () => import('./datatable.js'), attach: (m, root) => [m.attachDataTables(root)] },
    { name: 'tables', when: '.kp-table-wrap', load: () => import('./tables.js'), attach: (m, root) => [m.attachTableRegions(root)] },
    {
        name: 'forms',
        when: '[data-kp-form], [data-kp-submit], .kp-switch',
        load: () => import('./forms.js'),
        attach: (m, root) => [m.attachForms(root), m.attachSwitches(root)],
    },
    {
        name: 'patterns',
        when: '[data-kp-copy], [data-kp-undo-action]',
        load: () => import('./patterns.js'),
        attach: (m, root) => [m.attachPatterns(root)],
    },
    {
        name: 'structure',
        when: '[data-kp-tree], [data-kp-reorder], [data-kp-split]',
        load: () => import('./structure.js'),
        attach: (m, root) => [m.attachStructure(root)],
    },
    { name: 'datepicker', when: '[data-kp-datepicker]', load: () => import('./datepicker.js'), attach: (m, root) => [m.attachDatePickers(root)] },
    { name: 'upload', when: '[data-kp-upload]', load: () => import('./upload.js'), attach: (m, root) => [m.attachUploads(root)] },
    { name: 'wizard', when: '[data-kp-wizard]', load: () => import('./wizard.js'), attach: (m, root) => [m.attachWizards(root)] },
    { name: 'colorpicker', when: '[data-kp-colorpicker]', load: () => import('./colorpicker.js'), attach: (m, root) => [m.attachColorPickers(root)] },
    { name: 'gridlayout', when: '[data-kp-grid]', load: () => import('./gridlayout.js'), attach: (m, root) => [m.attachGrids(root)] },
    { name: 'log', when: '[data-kp-source]', load: () => import('./log.js'), attach: (m, root) => [m.attachLogs(root)] },
    { name: 'progressbar', when: '.kp-progressbar', load: () => import('./progressbar.js'), attach: (m, root) => [m.attachProgressbars(root)] },
    // The live step list of a run [scope-143].
    { name: 'steplist', when: '.kp-steplist', load: () => import('./steplist.js'), attach: (m, root) => [m.attachSteplists(root)] },
    // The dashboard components [scope-143]: row buttons on shared columns,
    // the KPI tile's sparkline and filter toggle, the attention band and
    // the time chart.
    { name: 'actions', when: '.kp-row-actions', load: () => import('./actions.js'), attach: (m, root) => [m.attachActionColumns(root)] },
    {
        name: 'kpi',
        when: 'svg[data-kp-spark], button.kp-kpi--toggle, .kp-kpis[data-kp-kpis-columns]',
        load: () => import('./kpi.js'),
        attach: (m, root) => [m.attachSparklines(root), m.attachKpiToggles(root), m.attachKpiStrips(root)],
    },
    // The page's one hover card, filled when it opens [kpadopt-9]. Anchors may
    // appear later: a page that builds them after the boot attaches it itself.
    { name: 'hovercard', when: '[data-kp-hovercard]', load: () => import('./hovercard.js'), attach: (m, root) => [m.attachHoverCards(root)] },
    { name: 'attention', when: '.kp-attention', load: () => import('./attention.js'), attach: (m, root) => [m.attachAttention(root)] },
    // Tiles of one height across a board, and the ticking freshness line
    // (port spec H and I.4).
    { name: 'tiles', when: '[data-kp-tiles-set]', load: () => import('./tiles.js'), attach: (m, root) => [m.attachTileSets(root)] },
    { name: 'freshness', when: '[data-kp-ago]', load: () => import('./freshness.js'), attach: (m, root) => [m.attachAgo(root)] },
    { name: 'chart', when: '[data-kp-chart]', load: () => import('./chart.js'), attach: (m, root) => [m.attachCharts(root)] },
    // A bar that folds what does not fit behind a More menu, and the phone's
    // bottom tab bar [kpadopt-nav]. The fold builds its menu on the menu
    // button's module, which it imports itself.
    { name: 'nav-fold', when: '[data-kp-nav-fold]', load: () => import('./nav-fold.js'), attach: (m, root) => [m.attachNavFolds(root)] },
    { name: 'tabbar', when: '.kp-tabbar', load: () => import('./tabbar.js'), attach: (m, root) => [m.attachTabbars(root)] },
    // The menu button with its rich menu [scope-143]: every other action, grouped.
    { name: 'menu-button', when: '[data-kp-menu-button]', load: () => import('./menu-button.js'), attach: (m, root) => [m.attachMenuButtons(root)] },
    // The segmented control, the list toolbar and the inline key line [kpadopt-controls].
    { name: 'segmented', when: '[data-kp-segmented]', load: () => import('./segmented.js'), attach: (m, root) => [m.attachSegmented(root)] },
    // Action tiles, status rows and the facet list [kpadopt2-tiles].
    { name: 'action-tiles', when: '.kp-action', load: () => import('./action-tiles.js'), attach: (m, root) => [m.attachActionTiles(root)] },
    { name: 'statusrow', when: '.kp-statuslist', load: () => import('./statusrow.js'), attach: (m, root) => [m.attachStatusLists(root)] },
    { name: 'facets', when: '[data-kp-facets]', load: () => import('./facets.js'), attach: (m, root) => [m.attachFacets(root)] },
    { name: 'toolbar', when: '[data-kp-toolbar]', load: () => import('./toolbar.js'), attach: (m, root) => [m.attachToolbars(root)] },
    { name: 'keys', when: '.kp-kbd[data-kp-key]', load: () => import('./keys.js'), attach: (m, root) => [m.attachKeys(root)] },
    // The month heatmap [scope-143]: a month of days, each a plate in the
    // colour of its state; the page gives the days with setCalendarDays().
    { name: 'calendar', when: '[data-kp-calendar]', load: () => import('./calendar.js'), attach: (m, root) => [m.attachCalendars(root)] },
    // The heat grid, the matrix and the value with a bar in a table cell [kpadopt2-grids].
    { name: 'heat', when: '[data-kp-heat]', load: () => import('./heat.js'), attach: (m, root) => [m.attachHeats(root)] },
    { name: 'matrix', when: '[data-kp-matrix]', load: () => import('./heat.js'), attach: (m, root) => [m.attachMatrices(root)] },
    { name: 'barcell', when: '[data-kp-bar]', load: () => import('./barcell.js'), attach: (m, root) => [m.attachBarCells(root)] },
    // The week agenda and the run timeline [kpadopt-time]: items placed in the days of a week, and runs as bars on a live time axis.
    { name: 'week', when: '[data-kp-week]', load: () => import('./week.js'), attach: (m, root) => [m.attachWeeks(root)] },
    { name: 'gantt', when: '[data-kp-gantt]', load: () => import('./gantt.js'), attach: (m, root) => [m.attachGantts(root)] },
    // The uptime strip [kpadopt4-ideas]: one cell per period, toned up, degraded, down or without data, in exact figures.
    { name: 'uptime', when: '[data-kp-uptime]', load: () => import('./uptime.js'), attach: (m, root) => [m.attachUptimes(root)] },
    // The command block [kpadopt4-ideas]: one command with its terminal, its admin or sudo badge and a copy that confirms.
    { name: 'command', when: '[data-kp-command]', load: () => import('./command.js'), attach: (m, root) => [m.attachCommands(root)] },
    // The two timers [kpadopt4-ideas]: a countdown in digits, and the time left as a shrinking disc.
    { name: 'countdown', when: '[data-kp-countdown]', load: () => import('./countdown.js'), attach: (m, root) => [m.attachCountdowns(root)] },
    { name: 'timer-disc', when: '[data-kp-timer-disc]', load: () => import('./timer-disc.js'), attach: (m, root) => [m.attachTimerDiscs(root)] },
    // The range picker [kpadopt4-ideas]: presets as the segmented control, and a custom from–to with the date picker.
    { name: 'range', when: '[data-kp-range]', load: () => import('./range.js'), attach: (m, root) => [m.attachRanges(root)] },
    { name: 'graph', when: '[data-kp-graph]', load: () => import('./graph.js'), attach: (m, root) => [m.attachGraphs(root)] },
    {
        // A theme's loading picture made of pieces (`--kp-loading-pieces`,
        // pastel's caterpillar [scope-141]): every part that can wait, and the
        // components that make one wait later. A theme that names none gets
        // no piece.
        name: 'loading-pieces',
        when: '.kp-skeleton, .kp-progressbar, .kp-meter, .kp-kpi, .kp-card, .kp-spinner, [data-kp-datatable], [data-kp-calendar], [data-kp-menu-button]',
        load: () => import('./loading-pieces.js'),
        attach: (m, root) => [m.attachLoadingPieces(root)],
    },
    {
        // Every box that changes size after it is drawn, and every dialog's
        // close [scope-142]: the selector is the module's own.
        name: 'motion',
        when: 'dialog.kp-dialog, .kp-accordion__item, .kp-tabs, .kp-datatable, .kp-toasts, .kp-upload__list, .kp-combobox__list, .kp-tree, .kp-wizard, .kp-field, [data-kp-size-motion]',
        load: () => import('./motion.js'),
        attach: (m, root) => [m.attachMotion(root)],
    },
];

/** Set on <html> once the boot's `attachAll()` has attached everything the page needed: the names fetched, space-separated. */
export const READY_ATTRIBUTE = 'data-kp-auto-ready';

/** @param {ParentNode} root @param {string} selector */
const carries = (root, selector) => (root instanceof Element && root.matches(selector)) || root.querySelector(selector) !== null;

/**
 * Attach every behaviour under `root`, fetching only the modules it needs.
 * Returns one detach for all of it; `ready` resolves once every needed
 * module has attached, and `modules` names what was fetched.
 *
 * @param {ParentNode} [root]
 * @returns {(() => void) & { ready: Promise<void>, modules: string[] }}
 */
export function attachAll(root = document) {
    // Before every attach: what a reader chose last time goes back onto the
    // markup, and each module then reads the markup it always read
    // [js/remember.js]. A subtree rendered after the boot is restored here.
    restoreRemembered(root);
    /** @type {unknown[]} */
    const detaches = [
        attachRemembered(root),
        attachDialogs(root),
        attachDismissals(root),
        attachTooltips(root),
        attachScrollbars(root),
        attachTabs(root),
        attachThemePickers(root),
    ];
    // The effects handle is an object rather than a function [AR34]; its
    // detach is called with the others.
    const effects = attachEffects(/** @type {Document | Element} */ (root));
    // Taken after the attaches above, so an element one of them added counts
    // as there, as it did when every module attached in one pass.
    const present = presentUnder(root);
    let detached = false;
    /** @type {string[]} */
    const modules = [];
    /** @type {Promise<void>[]} */
    const pending = [];
    for (const need of NEEDS) {
        if (!carries(root, need.when)) continue;
        modules.push(need.name);
        pending.push(
            need.load().then((module) => {
                // Detached before the module arrived: attach nothing.
                if (detached) return;
                detaches.push(...asOf(root, present, () => need.attach(module, root)));
            }),
        );
    }
    const ready = Promise.all(pending).then(() => undefined);
    // What the modules draw now is the page's first render, not news: the
    // root settles until they have all attached and two frames are painted,
    // and js/motion.js lets nothing arrive or glide under it meanwhile
    // [fix-100]. A module fetched later than motion (the data table, three
    // thousand lines) drew its whole chrome into an eased box, and 263
    // elements arrived on the catalogue's first frame.
    const mark = root instanceof Document ? root.documentElement : root instanceof Element ? root : null;
    const settled = mark ? settleAfter(mark, ready) : () => undefined;
    const detach = () => {
        detached = true;
        settled();
        for (const one of detaches) if (typeof one === 'function') one();
        effects.detach();
    };
    return Object.assign(detach, { ready, modules });
}

if (typeof document !== 'undefined') {
    applyStoredTheme();
    // The same moment, for the same reason: this module is deferred, so it
    // runs after the parse and before the first frame. A state restored at
    // DOMContentLoaded instead would be a state the reader saw flip.
    restoreRemembered();
    // `?theme=<name>` picks a theme for this load without storing it
    // [AR42], on a page that opts in with `data-kp-theme-from-query` on
    // <html>: the concept demo is one page rendered under every theme, and
    // its index links `concept.html?theme=<name>` for all twenty-four so
    // Kenny opens a URL rather than a picker. Opt-in, because a consumer's
    // dashboard honouring a query parameter it never asked for is scope
    // creep (the critic's objection). An unknown name is ignored; the
    // stored theme stands.
    if (document.documentElement.hasAttribute('data-kp-theme-from-query')) {
        try {
            const wanted = new URLSearchParams(location.search).get('theme');
            if (wanted !== null && THEMES.some((theme) => theme.name === wanted)) applyTheme(wanted);
        } catch {
            // No location (a non-browser document): nothing to read.
        }
    }
    const start = () => {
        const attached = attachAll();
        attached.ready.then(() => document.documentElement.setAttribute(READY_ATTRIBUTE, attached.modules.join(' ')));
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();
}
