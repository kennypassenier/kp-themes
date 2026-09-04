// The framework-free theme picker [T1, TH8].
//
// No custom element and no rendering: the consumer's server writes the
// markup, this attaches the behaviour. kyu and almanac render HTML from a
// Rust binary and have no npm step, so a component that only exists after
// JavaScript runs would leave them with an empty box on first paint.
//
// The markup it expects:
//
//   <div data-kp-theme-picker>
//     <button type="button" data-kp-theme="formal">
//       <span class="kp-swatch" data-theme="formal"></span> Formeel
//     </button>
//     ...
//   </div>
//   <p data-kp-theme-status hidden></p>
//
// Every attribute above is a contract value [TH26]. The swatch previews a
// theme without activating it by wearing that theme's own token block —
// `data-theme` on any element, not only on <html> — so it reads the live
// colours instead of a copy kept in step by hand [AR11].

import { applyTheme, currentTheme, initializeTheme, onThemeChange, storeTheme, THEMES } from './theme-core.js';

const PICKER = '[data-kp-theme-picker]';
const OPTION = '[data-kp-theme]';
const STATUS = '[data-kp-theme-status]';

/**
 * Storage refused, so the choice will not survive a reload. Said out loud
 * rather than swallowed [AR6]: in a server-rendered dashboard every click
 * is a new page load, and a preference that quietly fails to save looks
 * exactly like a broken picker.
 */
const SAVE_FAILED_TEXT = 'Deze keuze wordt niet onthouden — opslag is geblokkeerd in deze browser.';

/** @param {ParentNode} root @param {boolean} failed */
function showSaveState(root, failed) {
    for (const el of root.querySelectorAll(STATUS)) {
        el.textContent = failed ? SAVE_FAILED_TEXT : '';
        /** @type {HTMLElement} */ (el).hidden = !failed;
    }
}

/** @param {ParentNode} root @param {string} theme */
function markSelection(root, theme) {
    for (const el of root.querySelectorAll(OPTION)) {
        const button = /** @type {HTMLElement} */ (el);
        const selected = button.dataset.kpTheme === theme;
        button.setAttribute('aria-pressed', String(selected));
        // data-selected is the observable both channels share, so one
        // behaviour suite can assert against either mount [AR7]. The ARIA
        // state beside it is each channel's own idiom.
        button.dataset.selected = String(selected);
        // A class as well as the ARIA state: the state is for assistive
        // technology, the class is what CSS can style without relying on
        // an attribute selector a consumer may not expect.
        button.classList.toggle('is-selected', selected);
    }
}

/**
 * Attach the behaviour to every picker under `root`, and keep them all in
 * step with each other and with any React picker on the same page — they
 * share one bus, so neither channel needs to know the other exists [AR5].
 *
 * Safe to call twice: a picker already attached is skipped.
 *
 * @param {ParentNode} [root]
 * @returns {() => void} detach
 */
export function attachThemePickers(root = document) {
    /** @type {(() => void)[]} */
    const cleanups = [];

    for (const el of root.querySelectorAll(PICKER)) {
        const picker = /** @type {HTMLElement} */ (el);
        if (picker.dataset.kpThemeAttached === '1') continue;
        picker.dataset.kpThemeAttached = '1';

        /** @param {Event} event */
        const onClick = (event) => {
            const target = /** @type {HTMLElement} */ (event.target);
            const option = target.closest(OPTION);
            if (!option || !picker.contains(option)) return;
            const next = /** @type {HTMLElement} */ (option).dataset.kpTheme;
            if (!next) return;
            const applied = applyTheme(next);
            showSaveState(picker.parentNode ?? document, !storeTheme(applied));
        };

        picker.addEventListener('click', onClick);
        // The no-flash snippet copies the stored name onto <html> without
        // reading it, because knowing the theme list is not its job
        // [TH23]. This is the first moment anything can check it, so an
        // unknown value becomes the default here rather than surviving as
        // a data-theme no stylesheet answers to.
        markSelection(picker, initializeTheme(currentTheme()));
        cleanups.push(() => {
            picker.removeEventListener('click', onClick);
            delete picker.dataset.kpThemeAttached;
        });
    }

    // One subscription for the whole call, not one per picker: a change
    // announced on the bus updates every mark, including marks belonging
    // to a React picker's neighbour.
    const stop = onThemeChange((theme) => {
        for (const el of (root === document ? document : root).querySelectorAll(PICKER)) markSelection(el, theme);
    });
    cleanups.push(stop);

    return () => {
        for (const c of cleanups) c();
    };
}

/**
 * The list a consumer's template needs to render the options. Exported so
 * a page built without a server-side theme list can still write the
 * markup, and so the showcase does not hand-type seven names.
 */
export { THEMES };

// Attaching on import is the point of this channel: a consumer adds one
// <script type="module"> and the markup they already wrote comes alive.
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => attachThemePickers(), { once: true });
    } else {
        attachThemePickers();
    }
}
