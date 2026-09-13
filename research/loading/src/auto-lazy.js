// Strategy (c), the entry half: js/auto.js that fetches a module only when the page has something for it.
//
// js/auto.js imports twenty modules unconditionally and calls every
// attach function on the whole document; each of them walks the DOM for
// its own selector and, on a page without that component, finds nothing.
// This entry asks the DOM first — one querySelector per module — and
// `import()`s only the modules whose selector matches. The attach
// functions are the package's own, untouched; what changes is when their
// module arrives.
//
// The effects module is the one exception to "untouched": it is the
// split core from research/loading/out/c/js/effects-core.js, which
// fetches a hook's code the first time an element or a theme knob asks
// for it (research/loading/split-effects.mjs).
//
// What a page pays is the entry plus the three modules the theme state
// needs on every page (no-flash, theme-core, the registry — and strings,
// which theme-core imports), and then only what the markup carries.

import { applyStoredTheme } from '../../../js/no-flash.js';
import { applyTheme } from '../../../js/theme-core.js';
import { THEMES } from '../../../js/theme-registry.js';

/**
 * @typedef {object} Need
 * @property {string} name the module, for the record a page can read
 * @property {string} when the selector that proves the page needs it — the attach function's own root selector(s)
 * @property {() => Promise<any>} load
 * @property {(module: any, root: ParentNode) => Array<(() => void) | undefined>} attach
 */

/** @type {Need[]} */
export const NEEDS = [
    {
        name: 'components',
        when: '[data-kp-destructive], [data-kp-semantic], [data-kp-contract-error], [data-kp-confirm], .kp-skip-link, [data-kp-skip], [data-kp-to-top], [data-kp-nav-toggle]',
        load: () => import('../../../js/components.js'),
        attach: (m, root) => [
            m.enforceContracts(root),
            m.attachConfirmations(root),
            m.attachSkipLinks(root),
            m.attachToTop(root),
            m.attachNavToggles(root),
        ],
    },
    { name: 'sidenav', when: '.kp-sidenav', load: () => import('../../../js/sidenav.js'), attach: (m, root) => [m.attachSidenavs(root)] },
    {
        name: 'overlays',
        when: '[data-kp-dialog], [data-kp-dialog-close], [role="tablist"]',
        load: () => import('../../../js/overlays.js'),
        attach: (m, root) => [m.attachDialogs(root), m.attachTabs(root)],
    },
    {
        name: 'theme-picker',
        when: '[data-kp-theme-picker]',
        load: () => import('../../../js/theme-picker.js'),
        attach: (m, root) => [m.attachThemePickers(root)],
    },
    { name: 'combobox', when: '[data-kp-combobox]', load: () => import('../../../js/combobox.js'), attach: (m, root) => [m.attachComboboxes(root)] },
    { name: 'palette', when: '[data-kp-palette]', load: () => import('../../../js/palette.js'), attach: (m, root) => [m.attachPalettes(root)] },
    {
        name: 'datatable',
        when: '[data-kp-datatable]',
        load: () => import('../../../js/datatable.js'),
        attach: (m, root) => [m.attachDataTables(root)],
    },
    { name: 'tables', when: '.kp-table-wrap', load: () => import('../../../js/tables.js'), attach: (m, root) => [m.attachTableRegions(root)] },
    {
        name: 'forms',
        when: '[data-kp-form], [data-kp-submit]',
        load: () => import('../../../js/forms.js'),
        attach: (m, root) => [m.attachForms(root)],
    },
    {
        name: 'patterns',
        when: '[data-kp-copy], [data-kp-undo-action]',
        load: () => import('../../../js/patterns.js'),
        attach: (m, root) => [m.attachPatterns(root)],
    },
    {
        name: 'structure',
        when: '[data-kp-tree], [data-kp-reorder], [data-kp-split]',
        load: () => import('../../../js/structure.js'),
        attach: (m, root) => [m.attachStructure(root)],
    },
    {
        name: 'datepicker',
        when: '[data-kp-datepicker]',
        load: () => import('../../../js/datepicker.js'),
        attach: (m, root) => [m.attachDatePickers(root)],
    },
    { name: 'upload', when: '[data-kp-upload]', load: () => import('../../../js/upload.js'), attach: (m, root) => [m.attachUploads(root)] },
    { name: 'wizard', when: '[data-kp-wizard]', load: () => import('../../../js/wizard.js'), attach: (m, root) => [m.attachWizards(root)] },
    {
        name: 'colorpicker',
        when: '[data-kp-colorpicker]',
        load: () => import('../../../js/colorpicker.js'),
        attach: (m, root) => [m.attachColorPickers(root)],
    },
    { name: 'gridlayout', when: '[data-kp-grid]', load: () => import('../../../js/gridlayout.js'), attach: (m, root) => [m.attachGrids(root)] },
    {
        name: 'effects',
        // The root attribute is what the head snippet arms; a page that
        // armed it wants its reveals, whether or not the markup has one
        // yet (a consumer may render them later and call observe()).
        when: '[data-kp-effects], [data-kp-surface], [data-kp-reveal], [data-kp-count], [data-kp-marquee], mark',
        load: () => import('../out/c/js/effects-core.js'),
        attach: (m, root) => {
            const handle = m.attachEffects(/** @type {Document | Element} */ (root));
            return [() => handle.detach()];
        },
    },
];

/** Dispatched on <html>, bubbling, once every module the page needed has attached: `{ modules }`. */
export const READY_EVENT = 'kp-auto-lazy-ready';

/**
 * Attach what `root` needs, fetching only those modules. Returns one
 * detach for all of it; `detach.ready` resolves when everything has
 * arrived and `detach.modules` names what was fetched.
 *
 * @param {ParentNode} [root]
 * @returns {(() => void) & { ready: Promise<void>, modules: string[] }}
 */
export function attachAll(root = document) {
    /** @type {(() => void)[]} */
    const detaches = [];
    /** @type {Promise<void>[]} */
    const pending = [];
    /** @type {string[]} */
    const modules = [];
    for (const need of NEEDS) {
        if (!root.querySelector(need.when)) continue;
        modules.push(need.name);
        pending.push(
            need.load().then((m) => {
                for (const d of need.attach(m, root)) if (typeof d === 'function') detaches.push(d);
            }),
        );
    }
    const detach = () => {
        for (const d of detaches) d();
    };
    return Object.assign(detach, {
        ready: Promise.all(pending).then(() => {
            (root instanceof Document ? root.documentElement : root).dispatchEvent(
                new CustomEvent(READY_EVENT, { bubbles: true, detail: { modules } }),
            );
        }),
        modules,
    });
}

if (typeof document !== 'undefined') {
    applyStoredTheme();
    if (document.documentElement.hasAttribute('data-kp-theme-from-query')) {
        try {
            const wanted = new URLSearchParams(location.search).get('theme');
            if (wanted !== null && THEMES.some((theme) => theme.name === wanted)) applyTheme(wanted);
        } catch {
            // No location (a non-browser document): nothing to read.
        }
    }
    const start = () => attachAll();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();
}
