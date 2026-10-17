// research/kpadopt6-ops: the page's own wiring. The components are the package's (js/auto.js attaches them); this file only
// feeds them sample data, presses their states and writes what they fire into a readout.

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
 * Write the last event a component fired into the readout beside it.
 * @param {string} selector a component root
 * @param {string} type the event name
 * @param {string} log the readout's id
 * @param {(detail: any) => string} [say]
 */
export function readout(selector, type, log, say = (detail) => JSON.stringify(detail)) {
    const out = document.getElementById(log);
    if (!out) return;
    for (const el of document.querySelectorAll(selector)) {
        el.addEventListener(type, (event) => {
            out.textContent = `${type}\n${say(/** @type {CustomEvent} */ (event).detail)}`;
        });
    }
}

/** Press a state button: exactly one of the group is pressed. @param {string} attribute the data attribute on the buttons @param {(value: string) => void} apply */
export function stateButtons(attribute, apply) {
    const buttons = /** @type {HTMLButtonElement[]} */ ([...document.querySelectorAll(`[${attribute}]`)]);
    for (const button of buttons) {
        button.addEventListener('click', () => {
            for (const other of buttons) other.setAttribute('aria-pressed', String(other === button));
            apply(button.getAttribute(attribute) ?? '');
        });
    }
}

/** What the review dialog sets for a choice, as the section hears it. @param {string} id @param {(value: string) => void} apply */
export function onChoice(id, apply) {
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id === id) apply(String(detail.value));
    });
}

await ready;

// ── toggle button ──
{
    const { attachToggles, toggle, togglePressedKeys } = await import('../../js/toggle.js');
    const word = (/** @type {any} */ d) =>
        `${d.button.textContent.trim().replace(/\s+/g, ' ')} ${d.pressed ? 'on' : 'off'}${d.group ? `; on in ${d.group}: ${d.pressedKeys.join(', ') || 'none'}` : ''}`;
    readout('[data-k6-toggle-single] > [data-kp-toggle]:first-child', 'kp-toggle', 'k6-toggle-single-log', word);
    readout('#k6-toggle-filters', 'kp-toggle-changed', 'k6-toggle-filters-log', (d) => `pressedKeys: ${d.pressedKeys.join(', ') || '(none: all)'}`);
    readout('#k6-toggle-single', 'kp-toggle-changed', 'k6-toggle-single-log2', (d) => `range: ${d.pressedKeys.join(', ') || 'none'}`);

    // Which lines the level filters show: the real number, never "9+".
    const counts = { error: 12, warning: 31, info: 95 };
    const shown = document.getElementById('k6-toggle-filters-shown');
    const filters = document.getElementById('k6-toggle-filters');
    const paintShown = () => {
        if (!shown || !filters) return;
        const keys = togglePressedKeys(/** @type {HTMLElement} */ (filters.querySelector('[data-kp-toggle]')));
        const n = keys.length === 0 ? 138 : keys.reduce((sum, k) => sum + (counts[/** @type {'error'} */ (k)] ?? 0), 0);
        shown.textContent = `Showing ${n} lines${keys.length ? ` (${keys.join(' and ')})` : ''}.`;
    };
    filters?.addEventListener('kp-toggle-changed', paintShown);

    // The tick is a choice: the toggles carry it as the attribute a consumer's own markup would, and the module follows.
    /** @param {string} mark */
    const setMark = (mark) => {
        for (const button of document.querySelectorAll('#toggle [data-kp-toggle]')) {
            if (mark === 'check') button.setAttribute('data-kp-pressed-mark', 'check');
            else button.removeAttribute('data-kp-pressed-mark');
        }
        for (const b of document.querySelectorAll('[data-k6-mark]')) b.setAttribute('aria-pressed', String(b.getAttribute('data-k6-mark') === mark));
    };
    stateButtons('data-k6-mark', setMark);
    onChoice('toggle-pressed-mark', setMark);

    // The app that takes a second, or refuses.
    const asyncButton = document.getElementById('k6-toggle-async');
    let refuse = false;
    asyncButton?.addEventListener('kp-toggle', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        const log = document.getElementById('k6-toggle-async-log');
        if (log) log.textContent = `kp-toggle: asked for ${detail.pressed ? 'on' : 'off'}; the app is working…`;
        detail.wait(
            new Promise((resolve, reject) =>
                setTimeout(() => {
                    if (refuse) {
                        if (log) log.textContent = 'The app refused: pinning needs the admin role.';
                        reject(new Error('Pinning needs the admin role.'));
                    } else {
                        if (log) log.textContent = 'The app accepted.';
                        resolve(undefined);
                    }
                }, 1100),
            ),
        );
    });
    for (const b of document.querySelectorAll('[data-k6-refuse]'))
        b.addEventListener('click', () => {
            refuse = !refuse;
            b.setAttribute('aria-pressed', String(refuse));
        });
    for (const b of document.querySelectorAll('[data-k6-count]'))
        b.addEventListener('click', () => {
            const v = b.getAttribute('data-k6-count');
            const target = document.getElementById('k6-toggle-count');
            if (target) toggle(target)?.setCount(v === 'loading' ? 'loading' : Number(v));
        });
    void attachToggles;
}

// ── the palette that finds words in any order ──
{
    const { palette } = await import('../../js/palette.js');
    const main = document.getElementById('k6-intent-pal');

    /** Type into a palette's input as a person would: the input event does the filtering. @param {HTMLElement | null} dialog @param {string} text */
    const typeInto = (dialog, text) => {
        const input = dialog?.querySelector('input');
        if (!(input instanceof HTMLInputElement)) return;
        input.value = text;
        input.dispatchEvent(new Event('input', { bubbles: true }));
    };
    for (const b of document.querySelectorAll('[data-k6-query]'))
        b.addEventListener('click', () => typeInto(main, b.getAttribute('data-k6-query') ?? ''));

    for (const b of document.querySelectorAll('[data-k6-typed]'))
        b.addEventListener('click', async () => {
            const text = b.getAttribute('data-k6-typed') ?? '';
            typeInto(main, '');
            for (let at = 1; at <= text.length; at++) {
                await new Promise((resolve) => setTimeout(resolve, 150));
                typeInto(main, text.slice(0, at));
            }
        });

    const log = document.getElementById('k6-intent-log');
    main?.addEventListener('kp-palette-run', (event) => {
        if (log) log.textContent = `kp-palette-run\n${JSON.stringify({ value: /** @type {CustomEvent} */ (event).detail.value })}`;
    });

    /** @param {string} look */
    const setMarkLook = (look) => {
        for (const el of [main]) {
            if (!el) continue;
            el.removeAttribute('data-kp-mark-look');
            el.removeAttribute('data-kp-highlight');
            if (look === 'wash') el.setAttribute('data-kp-mark-look', 'wash');
            if (look === 'none') el.setAttribute('data-kp-highlight', 'off');
            palette(el)?.refresh();
        }
        for (const b of document.querySelectorAll('[data-k6-mark-look]'))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-k6-mark-look') === look));
    };
    stateButtons('data-k6-mark-look', setMarkLook);
    onChoice('intent-mark', setMarkLook);
}

// ── entity card ──
{
    const { setEntityGrid } = await import('../../js/entity-card.js');
    const { openMenu, closeMenu, setMenu } = await import('../../js/menu-button.js');
    const acts = [
        { id: 'restart', label: 'Restart' },
        { id: 'logs', label: 'Logs' },
        { id: 'update', label: 'Update' },
        { id: 'remove', label: 'Remove', danger: true },
    ];
    const meters = (/** @type {number} */ cpu, /** @type {number} */ ram, /** @type {string} */ text) => [
        { label: 'CPU', value: cpu },
        { label: 'RAM', value: ram, text },
        { label: 'Disk', value: 0.41 },
    ];
    /** The buttons come only from the data: none, two, four (three stand, the fourth goes in More) or a mix on one grid. */
    let actionMode = 'four';
    /** @param {number} at */
    const actionsFor = (at) =>
        actionMode === 'none'
            ? []
            : actionMode === 'two'
              ? acts.slice(0, 2)
              : actionMode === 'mixed'
                ? [acts, [], acts.slice(0, 2), acts, acts.slice(0, 1), []][at % 6]
                : acts;
    /** @type {() => import('../../js/entity-card.js').EntityData[]} */
    const make = () => makeBase().map((d, at) => ({ ...d, actions: actionsFor(at) }));
    /** @type {() => import('../../js/entity-card.js').EntityData[]} */
    const makeBase = () => [
        {
            key: 'media',
            name: 'media',
            vmid: '106',
            state: { label: 'running', tone: 'success' },
            figures: [
                { value: '3/5', label: 'apps up' },
                { value: '12', label: 'restarts' },
            ],
            flags: [{ label: 'update available', tone: 'warning' }],
            meters: meters(0.34, 0.71, '5.6 of 8 GB'),
            actions: acts,
        },
        {
            key: 'vault',
            name: 'vault',
            vmid: '110',
            state: { label: 'running', tone: 'success' },
            figures: [
                { value: '2/2', label: 'apps up' },
                { value: '0', label: 'restarts' },
            ],
            flags: [],
            meters: meters(0.08, 0.22, '0.9 of 4 GB'),
            actions: acts,
        },
        {
            key: 'gateway',
            name: 'gateway',
            vmid: '101',
            state: { label: 'degraded', tone: 'warning' },
            figures: [
                { value: '4/5', label: 'apps up' },
                { value: '31', label: 'restarts' },
            ],
            flags: [
                { label: 'update available', tone: 'warning' },
                { label: 'backup is old', tone: 'destructive' },
                { label: 'pinned image' },
                { label: 'no healthcheck' },
                { label: 'port 8443 open' },
            ],
            meters: meters(0.82, 0.93, '7.4 of 8 GB'),
            actions: acts,
        },
        {
            key: 'paperless',
            name: 'paperless',
            vmid: '112',
            state: { label: 'running', tone: 'success' },
            figures: [
                { value: '3/3', label: 'apps up' },
                { value: '1', label: 'restarts' },
            ],
            flags: [{ label: 'pinned image' }],
            meters: meters(0.12, 0.35, '2.8 of 8 GB'),
            actions: acts,
        },
        {
            key: 'immich',
            name: 'immich-machine-learning-worker-with-a-long-name',
            vmid: '114',
            state: { label: 'stopped', tone: 'destructive' },
            figures: [
                { value: '0/4', label: 'apps up' },
                { value: '1534', label: 'restarts' },
            ],
            flags: [{ label: 'stopped by hand' }],
            meters: meters(0, 0, '0 of 16 GB'),
            actions: acts,
        },
        {
            key: 'café-kiosk',
            name: 'café-kiosk',
            vmid: '120',
            state: { label: 'running', tone: 'success' },
            figures: [
                { value: '1/1', label: 'apps up' },
                { value: '2', label: 'restarts' },
            ],
            flags: [],
            meters: meters(0.05, 0.18, '0.7 of 4 GB'),
            actions: acts,
        },
    ];
    const grid = document.getElementById('k6-entity-grid');
    const log = document.getElementById('k6-entity-log');
    /** @param {string} text */
    const say = (text) => {
        if (log) log.textContent = text;
    };
    if (grid) {
        grid.setAttribute('data-kp-entity-meters', '2');
        setEntityGrid(grid, make());
        grid.addEventListener('kp-entity-action', (e) => say(`kp-entity-action\n${JSON.stringify(/** @type {CustomEvent} */ (e).detail)}`));
        grid.addEventListener('kp-entity-flag', (e) => say(`kp-entity-flag\n${JSON.stringify(/** @type {CustomEvent} */ (e).detail)}`));
        grid.addEventListener('kp-entity-tick', () => {
            const keys = [...grid.querySelectorAll('.is-ticked')].map((c) => c.getAttribute('data-kp-entity-key'));
            say(`ticked: ${keys.join(', ') || 'none'}`);
        });
    }
    for (const b of document.querySelectorAll('[data-k6-entity-opt]'))
        b.addEventListener('click', () => {
            const on = b.getAttribute('aria-pressed') !== 'true';
            b.setAttribute('aria-pressed', String(on));
            const kind = b.getAttribute('data-k6-entity-opt');
            if (!grid) return;
            if (kind === 'selectable') {
                grid.toggleAttribute('data-kp-selectable', on);
                grid.toggleAttribute('data-kp-select-keys', on);
            } else if (kind === 'flags') grid.setAttribute('data-kp-entity-flags-max', on ? '1' : '3');
            else if (kind === 'compact') grid.setAttribute('data-kp-density', on ? 'compact' : 'comfortable');
            else grid.toggleAttribute('data-kp-entity-link', on) || null;
            if (kind === 'link') {
                if (on) grid.setAttribute('data-kp-entity-link', '#stack-{key}');
                else grid.removeAttribute('data-kp-entity-link');
            }
        });
    /** @param {string} n */
    const setMeters = (n) => {
        grid?.setAttribute('data-kp-entity-meters', n);
        for (const b of document.querySelectorAll('[data-k6-entity-meters]'))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-k6-entity-meters') === n));
    };
    stateButtons('data-k6-entity-meters', setMeters);
    /** @param {string} mode */
    const setActions = (mode) => {
        actionMode = mode;
        if (grid) setEntityGrid(grid, make());
        for (const b of document.querySelectorAll('[data-k6-entity-actions]'))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-k6-entity-actions') === mode));
    };
    stateButtons('data-k6-entity-actions', setActions);
    /** @param {string} n */
    const setInline = (n) => {
        grid?.setAttribute('data-kp-entity-inline', n);
        for (const b of document.querySelectorAll('[data-k6-entity-inline]'))
            b.setAttribute('aria-pressed', String(b.getAttribute('data-k6-entity-inline') === n));
    };
    stateButtons('data-k6-entity-inline', setInline);
    onChoice('entity-inline', setInline);
    for (const b of document.querySelectorAll('[data-k6-entity-refresh]'))
        b.addEventListener('click', () => {
            if (!grid) return;
            const list = make();
            const first = list[0];
            first.meters = meters(0.55 + Math.random() * 0.1, 0.72, '5.8 of 8 GB');
            first.flags = [{ label: 'update available', tone: 'warning' }, { label: 'restarted just now' }];
            const same = grid.firstElementChild;
            setEntityGrid(grid, list);
            say(`A live refresh: the first card is ${grid.firstElementChild === same ? 'the same element' : 'a new element'}.`);
        });
    const compare = document.getElementById('k6-entity-compare');
    if (compare)
        setMenu(compare, [
            {
                group: '',
                items: [
                    { label: 'Restart', value: 'restart' },
                    { label: 'Logs', value: 'logs' },
                    { label: 'Update', value: 'update' },
                    { label: 'Remove', value: 'remove', danger: true },
                ],
            },
        ]);
    const wrappers = () =>
        [grid?.querySelector('[data-kp-key="media-more"]'), grid?.querySelector('[data-kp-key="gateway-flags"]'), compare].filter(Boolean);
    for (const b of document.querySelectorAll('[data-k6-entity-menu]'))
        b.addEventListener('click', () => {
            const which = b.getAttribute('data-k6-entity-menu');
            for (const w of wrappers()) closeMenu(/** @type {HTMLElement} */ (w));
            const target =
                which === 'more'
                    ? grid?.querySelector('[data-kp-key="media-more"]')
                    : which === 'flags'
                      ? grid?.querySelector('[data-kp-key="gateway-flags"]')
                      : which === 'compare'
                        ? compare
                        : null;
            if (target) openMenu(/** @type {HTMLElement} */ (target), { focus: 'first' });
        });
}
