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

import { applyStoredTheme } from './no-flash.js';
import { attachConfirmations, attachSkipLinks, enforceContracts } from './components.js';
import { attachDialogs, attachTabs } from './overlays.js';
import { attachThemePickers } from './theme-picker.js';
import { attachComboboxes } from './combobox.js';
import { attachPalettes } from './palette.js';
import { attachDataTables } from './datatable.js';
import { attachForms } from './forms.js';
import { attachPatterns } from './patterns.js';
import { attachStructure } from './structure.js';
import { attachDatePickers } from './datepicker.js';
import { attachUploads } from './upload.js';
import { attachWizards } from './wizard.js';
import { attachColorPickers } from './colorpicker.js';
import { attachGrids } from './gridlayout.js';

/**
 * Attach every behaviour under `root`. Returns one detach for all of it.
 *
 * @param {ParentNode} [root]
 * @returns {() => void}
 */
export function attachAll(root = document) {
    const detaches = [
        enforceContracts(root),
        attachConfirmations(root),
        attachSkipLinks(root),
        attachDialogs(root),
        attachTabs(root),
        attachThemePickers(root),
        attachComboboxes(root),
        attachPalettes(root),
        attachDataTables(root),
        attachForms(root),
        attachPatterns(root),
        attachStructure(root),
        attachDatePickers(root),
        attachUploads(root),
        attachWizards(root),
        attachColorPickers(root),
        attachGrids(root),
    ];
    return () => {
        for (const detach of detaches) if (typeof detach === 'function') detach();
    };
}

if (typeof document !== 'undefined') {
    applyStoredTheme();
    const start = () => attachAll();
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
    else start();
}
