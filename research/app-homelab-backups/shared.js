// research/app-homelab-backups: helpers the firewall, host and console sections share. The package's components do the
// work; these only press state buttons, follow the review kit's ticked defaults and wait for js/auto.js.

/** @param {string} sel @param {ParentNode} [root] */
export const $ = (sel, root = document) => /** @type {HTMLElement} */ (root.querySelector(sel));
/** @param {string} sel @param {ParentNode} [root] */
export const $$ = (sel, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(sel)]);
export const has = (/** @type {string} */ id) => document.getElementById(id) !== null;
/** @param {number} n exact, with a thousands separator */
export const count = (n) => n.toLocaleString('en-GB');
/** @param {number} n */
export const pad = (n) => String(n).padStart(2, '0');

/** Resolves once js/auto.js has attached everything the page carries. */
export const ready = new Promise((resolve) => {
    const done = () => document.documentElement.hasAttribute('data-kp-auto-ready');
    if (done()) return resolve(undefined);
    new MutationObserver((_, watch) => {
        if (done()) {
            watch.disconnect();
            resolve(undefined);
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
});

/**
 * Press one state button of a group: exactly one stays pressed. Returns a setter that presses one without applying it.
 * @param {string} attribute @param {(value: string) => void} apply
 */
export function stateButtons(attribute, apply) {
    const buttons = $$(`[${attribute}]`);
    for (const button of buttons) {
        button.addEventListener('click', () => {
            for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
            apply(button.getAttribute(attribute) ?? '');
        });
    }
    return (/** @type {string} */ value) => {
        for (const b of buttons) b.setAttribute('aria-pressed', String(b.getAttribute(attribute) === value));
    };
}

/** The review kit tells a section which option is the default: follow it. @param {string} id @param {(value: string) => void} apply */
export function onChoice(id, apply) {
    document.addEventListener(
        'review:choice',
        (e) => {
            const d = /** @type {CustomEvent} */ (e).detail;
            if (d?.id === id) apply(String(d.value));
        },
        true,
    );
}

/** @param {HTMLElement} el @param {string} text */
export const say = (el, text) => {
    el.textContent = text;
};

/** The four data states every data area is shown in. @typedef {'ready' | 'loading' | 'empty' | 'error'} DataState */

import { attachAll } from '../../js/auto.js';

/**
 * Write markup into a host and attach the package's behaviours on it (js/auto.js).
 * @param {HTMLElement} host @param {string} html
 */
export async function mount(host, html) {
    host.innerHTML = html;
    await attachAll(host).ready;
}

/** Press a group's button by value without applying it. @param {string} attribute @param {string} value */
export function pressState(attribute, value) {
    for (const b of $$(`[${attribute}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attribute) === value));
}

/**
 * A datatable around a body, with the failed and empty states the package draws.
 * @param {{ id: string, remember: string, caption: string, head: string, body: string, attrs?: string, emptyTitle: string, emptyText: string, none?: string, maxHeight?: string }} t
 */
export function tableShell(t) {
    return `<div class="kp-datatable" data-kp-datatable data-kp-cards data-kp-page-size="100" data-kp-page-sizes="none" data-kp-sort-multi data-kp-remember="${t.remember}" data-kp-busy-overlay ${t.maxHeight ? `data-kp-max-height="${t.maxHeight}"` : ''} ${t.attrs ?? ''} id="${t.id}">
        <div class="kp-datatable__bar"><input class="kp-datatable__search" type="search" data-kp-datatable-search placeholder="Search" aria-label="Search the table" /></div>
        <div class="kp-alert kp-alert--destructive" data-kp-datatable-failed role="alert" hidden>
            <p class="kp-alert__label">${t.none ?? 'The table could not be read'}</p>
            <p data-kp-datatable-failed-reason></p>
            <button type="button" class="kp-button" data-kp-datatable-retry>Try again</button>
        </div>
        <div class="kp-table-wrap"><table class="kp-table">
            <caption class="kp-sr-only">${t.caption}</caption>
            <thead><tr>${t.head}</tr></thead>
            <tbody>${t.body}</tbody>
        </table></div>
        <div class="kp-empty" data-kp-datatable-empty hidden>
            <div data-kp-datatable-empty-none>
                <p class="kp-empty__title">${t.emptyTitle}</p>
                <p>${t.emptyText}</p>
            </div>
            <div data-kp-datatable-empty-nomatch hidden>
                <p class="kp-empty__title">Nothing matches</p>
                <button type="button" class="kp-button kp-button--secondary" data-kp-datatable-clear>Clear the search and filters</button>
            </div>
        </div>
        <div class="kp-datatable__bar"><p class="kp-datatable__status" data-kp-datatable-status role="status" aria-live="polite"></p>
        <div class="kp-datatable__pager" data-kp-datatable-pager></div></div>
    </div>`;
}

/** The state of a datatable handle. @param {import('../../js/datatable.js').DataTableHandle} dt @param {string} state @param {string} [fail] */
export function tableState(dt, state, fail = 'The host did not answer within 10 s. Nothing was changed.') {
    if (state === 'loading') {
        dt.busy({ text: 'Reading…', overlay: true });
        dt.state('loading');
    } else if (state === 'error') dt.fail(fail);
    else {
        dt.busy(null);
        dt.state('ready');
    }
}

export const BADGE = /** @type {const} */ ({ ok: 'success', warn: 'warning', bad: 'destructive' });

/** The matrix's failed plate has no action of its own: add the normal-size Try again to it. @param {HTMLElement} el @param {() => void} fn */
export function matrixRetry(el, fn) {
    const note = el.querySelector('.kp-matrix__state[role="alert"]');
    if (!note || note.querySelector('button')) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'kp-button';
    b.textContent = 'Try again';
    b.addEventListener('click', fn);
    note.append(b);
}
