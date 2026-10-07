// research/families-applied: the speaker. It runs in the page and works on
// the document of one embedded character demo (a frame, same origin): it
// marks the parts of the component that a family's picture lands on, with
// data-fa-* attributes, so one stylesheet per theme can draw the picture on
// every component without knowing the components' own class names.
//
// The roles, per family (what <theme>.css draws):
//
//   loading  [data-fa-surface]   where a loading picture lives; it receives
//                                one <span data-fa-pic> to draw on
//   arrival  [data-fa-arrive]    what arrives ("fill" when it is a meter's
//                                share, drawn on ::before); --fa-i its order
//   live     [data-fa-live]      a part that just took a new reading, set
//                                again (so its animation restarts) on every
//                                change the demo makes
//   hover    [data-fa-point]     a part one can point at, focus and press;
//                                [data-fa-state] mirrors the review kit's
//                                played pointer (data-rv-hover/-focus/-press)
//                                and the demos' own standing states
//   tone     [data-fa-tone]      a part that carries a status tone: note,
//                                plate or mark; [data-fa-tint] its tone
//                                (warning, destructive, ok); [data-fa-hit]
//                                set again whenever the tone is played;
//                                [data-fa-big] a plate taller than a line;
//                                it receives one <span data-fa-decor>
//   shape    [data-fa-shape]     plate, head, num, track, mark, cell, chip,
//                                button: the materials of the picture; a
//                                plate receives one <span data-fa-decor>,
//                                [data-fa-bare] when it has no padding
//
// The "today" frame is never marked: only its simulations run (simulate()),
// so both sides of a pair show the same moment.

/** @typedef {Record<string, string>} RoleMap  role value → selector */

/**
 * Per family and component: the parts, as `selector → role`. A component
 * missing from a family is either simulated (see SIMULATE) or not able to
 * take the picture (the page says why on its card).
 * @type {Record<string, Record<string, RoleMap>>}
 */
export const ROLES = {
    loading: {
        meter: { surface: '.kp-meter' },
        chart: { surface: '.kp-chart__plot' },
        calendar: { surface: '.kp-calendar' },
        graph: { surface: '.kp-graph__box' },
        trend: { surface: '.kp-kpi--trend' },
        columns: { surface: '.kp-kpis > .kp-kpi' },
        tiles: { surface: '.kp-tiles > .kp-card' },
        kpi: { surface: '.kp-kpis > .kp-kpi' },
        menu: { surface: '.kp-menu [data-kp-loading]' },
        busy: { surface: '.kp-datatable__busy-panel' },
    },
    arrival: {
        meter: { fill: '.kp-meter' },
        chart: { part: '.kp-chart__plot' },
        calendar: { part: '.kp-calendar__grid' },
        graph: { part: '.kp-graph__svg' },
        trend: { part: '.kp-kpi__spark', num: '.kp-kpi--trend > .kp-kpi__value' },
        columns: { part: '.kp-kpis > .kp-kpi' },
        tiles: { part: '.kp-tiles > .kp-card' },
        kpi: { part: '.kp-kpis > .kp-kpi' },
        menu: { part: '.kp-menu-button > .kp-menu' },
        header: { part: '.kp-page-header__actions > .kp-popover' },
        busy: { part: '.kp-datatable__busy-panel' },
        drawer: { part: '.kp-drawer, .kp-tour' },
        state: { part: '[data-sw]' },
    },
    hover: {
        calendar: { part: '.kp-calendar__day, .kp-calendar__nav .kp-button' },
        graph: { part: '.kp-graph__node, .kp-graph__kind' },
        tiles: { part: '.kp-tiles > .kp-card, [data-tl-link]' },
        kpi: { part: 'a.kp-kpi, .kp-kpi--toggle' },
        menu: { part: '.kp-menu__item, .kp-menu-button > .kp-button' },
        header: { part: '.kp-page-header__actions > .kp-button' },
        chart: { part: '.kp-chart__source, .kp-chart__show-all' },
        trend: { part: '.kp-kpi__link' },
        state: { part: '.kp-button' },
        drawer: { part: '.kp-tour .kp-button, .kp-drawer .kp-button, .kp-drawer .kp-icon-button' },
    },
    tone: {
        meter: { plate: '.kp-meter[data-kp-tone]' },
        calendar: { plate: '.kp-calendar__day[data-kp-tone="warn"], .kp-calendar__day[data-kp-tone="bad"]' },
        trend: { plate: '.kp-kpi--trend[data-kp-tone]', note: '.kp-kpi__delta[data-kp-tone]' },
        columns: { note: '.kp-kpi__delta[data-kp-tone]' },
        tiles: { plate: '.kp-card[data-kp-tone]', mark: '.kp-card[data-kp-tone] [data-tl-mark]' },
        kpi: { plate: '.kp-kpi[data-kp-tone] > .kp-kpi__value', note: '.kp-kpi__delta[data-kp-tone]' },
        menu: { plate: '.kp-menu__item--destructive' },
        state: { plate: '[data-sw-kind="bad"] .kp-state-word, [data-sw-kind="warn"] .kp-state-word' },
        chart: { mark: '.kp-chart__dot[data-kp-tone], .kp-chart__swatch[data-kp-tone]', note: '.kp-chart__delta' },
        busy: { plate: '.kp-alert--destructive' },
    },
    shape: {
        meter: { track: '.kp-meter', mark: '.kp-meter__mark' },
        chart: {
            plate: '.kp-chart:not(.kp-chart--spark), .kp-chart--spark',
            head: '.kp-chart__title, .kp-chart__spark-label',
            num: '.kp-chart__value, .kp-chart__spark-value',
            chip: '.kp-chart__source',
        },
        calendar: { plate: '.kp-calendar', head: '.kp-calendar__title', cell: '.kp-calendar__day', button: '.kp-calendar__nav .kp-button' },
        graph: { plate: '.kp-graph__box', chip: '.kp-graph__kind', button: '.kp-graph__show-all' },
        trend: { plate: '.kp-kpi--trend', head: '.kp-kpi--trend > .kp-kpi__label', num: '.kp-kpi--trend > .kp-kpi__value' },
        columns: { plate: '.kp-kpis > .kp-kpi', head: '.kp-kpi__label', num: '.kp-kpi__value' },
        tiles: { plate: '.kp-tiles > .kp-card', head: '.kp-card__title', mark: '[data-tl-mark]', button: '[data-tl-link]' },
        kpi: { plate: '.kp-kpis > .kp-kpi', head: '.kp-kpi__label', num: '.kp-kpi__value' },
        menu: { plate: '.kp-menu-button > .kp-menu', head: '.kp-menu__heading', button: '.kp-menu-button > .kp-button' },
        state: { chip: '.kp-state-word', button: '.kp-button' },
        header: { plate: '.kp-page-header', head: '.kp-page-header__title', button: '.kp-page-header__actions > .kp-button' },
        busy: { plate: '.kp-datatable__busy-panel', head: '.kp-table th' },
        drawer: {
            plate: '.kp-drawer, .kp-tour',
            head: '.kp-drawer .kp-dialog__title, .kp-tour__title',
            button: '.kp-drawer .kp-button, .kp-tour .kp-button',
        },
    },
};

/**
 * Live: the parts a new reading lands in, nearest first. A change the demo
 * makes inside one of them (its text, an added node, one of the attributes
 * named) marks it.
 * @type {Record<string, { parts: string, attributes?: string[] }>}
 */
export const LIVE = {
    chart: { parts: '.kp-chart__value, .kp-chart__spark-value, .kp-chart__series, .kp-chart__spark path', attributes: ['d'] },
    graph: { parts: '.kp-graph__node, .kp-graph__edge', attributes: ['data-cg-changed'] },
    trend: { parts: '.kp-kpi--trend > .kp-kpi__value, .kp-kpi__spark-line, .kp-kpi__delta', attributes: ['d'] },
    columns: { parts: '.kp-kpi__value, .kp-kpi__delta' },
    tiles: { parts: '[data-tl-body], [data-tl-time]' },
    kpi: { parts: '.kp-kpi__value, .kp-kpi__delta' },
    state: { parts: '.kp-state-word', attributes: ['data-sw-word', 'data-sw-kind'] },
    meter: { parts: '.kp-meter', attributes: ['style'] },
    calendar: { parts: '.kp-calendar__day', attributes: ['data-kp-tone'] },
    busy: { parts: 'tbody td' },
};

/** The tone a part carries, by any of the names the package uses. */
const TINT = /** @type {Record<string, string>} */ ({
    warn: 'warning',
    warning: 'warning',
    bad: 'destructive',
    critical: 'destructive',
    destructive: 'destructive',
    ok: 'ok',
    good: 'ok',
    success: 'ok',
});

/**
 * Sets an attribute again, so a CSS animation keyed to it starts over, also
 * on the part's ::before and ::after (which an inline animation reset cannot
 * reach).
 * @param {Element} el @param {string} name @param {string} value
 */
export function retrigger(el, name, value = '') {
    el.removeAttribute(name);
    void (/** @type {HTMLElement} */ (el).offsetWidth);
    el.setAttribute(name, value);
}

/**
 * Marks one family's parts in a frame's document and keeps them marked while
 * the demo redraws itself.
 * @param {Document} doc @param {string} family @param {string} component
 */
export function speak(doc, family, component) {
    const root = doc.documentElement;
    root.setAttribute('data-fa-speak', family);
    root.setAttribute('data-fa-comp', component);
    const preview = () => /** @type {HTMLElement | null} */ (doc.querySelector('[data-review-preview]'));
    const roles = ROLES[family]?.[component] || {};

    const mark = () => {
        const shown = preview();
        if (!shown) return;
        shown.setAttribute('data-fa-group', '');
        const all = (/** @type {string} */ selector) => [...(shown.matches(selector) ? [shown] : []), ...shown.querySelectorAll(selector)];
        if (family === 'loading')
            for (const el of all(roles.surface || '#fa-none')) {
                el.setAttribute('data-fa-surface', '');
                if (!el.querySelector(':scope > [data-fa-pic]')) {
                    const pic = doc.createElement('span');
                    pic.setAttribute('data-fa-pic', '');
                    pic.setAttribute('aria-hidden', 'true');
                    // The cyberpunk lock-on names what it does; the words come from the CSS.
                    pic.innerHTML = '<i data-fa-pic-word></i>';
                    el.append(pic);
                }
            }
        if (family === 'arrival')
            for (const [role, selector] of Object.entries(roles))
                all(selector).forEach((el, i) => {
                    if (el.getAttribute('data-fa-arrive') !== role) el.setAttribute('data-fa-arrive', role);
                    /** @type {HTMLElement} */ (el).style.setProperty('--fa-i', String(i));
                });
        if (family === 'hover')
            for (const el of all(roles.part || '#fa-none')) if (!el.hasAttribute('data-fa-point')) el.setAttribute('data-fa-point', '');
        // A part that no longer is what it was marked for (a day whose copies
        // arrived, a tile drawn again) loses its mark.
        const marker = { hover: 'data-fa-point', tone: 'data-fa-tone', shape: 'data-fa-shape' }[family];
        if (marker) {
            const any = Object.values(roles).join(', ') || '#fa-none';
            for (const el of shown.querySelectorAll(`[${marker}]`)) if (!el.matches(any)) el.removeAttribute(marker);
        }
        if (family === 'tone')
            for (const [role, selector] of Object.entries(roles))
                for (const el of all(selector)) {
                    if (el.getAttribute('data-fa-tone') !== role) el.setAttribute('data-fa-tone', role);
                    const own = el.closest('[data-kp-tone]')?.getAttribute('data-kp-tone') || '';
                    const kind = el.closest('[data-sw-kind]')?.getAttribute('data-sw-kind') || '';
                    const tint =
                        TINT[own] || TINT[kind] || (el.matches('.kp-menu__item--destructive, .kp-alert--destructive') ? 'destructive' : 'warning');
                    if (el.getAttribute('data-fa-tint') !== tint) el.setAttribute('data-fa-tint', tint);
                    // A plate taller than a line (a tile, an alert) takes a tone
                    // as a surface; a small one (a figure, a day, a word) as a pill or tag.
                    el.toggleAttribute(
                        'data-fa-big',
                        role === 'plate' && !el.matches('.kp-state-word') && /** @type {HTMLElement} */ (el).offsetHeight > 72,
                    );
                    // A layer of its own for a picture drawn round the part (a
                    // reticle, a tag), so none of the part's own ::before and
                    // ::after (a meter's share, a delta's arrow) is taken.
                    if (!el.querySelector(':scope > [data-fa-decor]')) {
                        const decor = doc.createElement('span');
                        decor.setAttribute('data-fa-decor', '');
                        decor.setAttribute('aria-hidden', 'true');
                        el.append(decor);
                    }
                }
        if (family === 'shape')
            for (const [role, selector] of Object.entries(roles))
                for (const el of all(selector)) {
                    if (el.getAttribute('data-fa-shape') !== role) el.setAttribute('data-fa-shape', role);
                    // A plate with no padding of its own (a chart, a graph's box):
                    // a theme that draws on its edge gives it room.
                    const view = doc.defaultView;
                    if (role !== 'plate' || !view) continue;
                    const style = view.getComputedStyle(el);
                    if (!el.hasAttribute('data-fa-bare') && parseFloat(style.paddingInlineStart) < 2) el.setAttribute('data-fa-bare', '');
                    // A layer for what a theme lays on a plate (a strip of tape);
                    // a plate that is not positioned is made the layer's frame.
                    if (style.position === 'static') el.setAttribute('data-fa-static', '');
                    if (!el.querySelector(':scope > [data-fa-decor]')) {
                        const decor = doc.createElement('span');
                        decor.setAttribute('data-fa-decor', '');
                        decor.setAttribute('aria-hidden', 'true');
                        el.append(decor);
                    }
                }
    };

    /** Every part of the family played again: the arrival drawn, the tone struck. */
    const replay = () => {
        mark();
        const shown = preview();
        if (!shown) return;
        if (family === 'arrival')
            for (const el of shown.querySelectorAll('[data-fa-arrive]')) retrigger(el, 'data-fa-arrive', el.getAttribute('data-fa-arrive') || '');
        if (family === 'tone') for (const el of shown.querySelectorAll('[data-fa-tone]')) retrigger(el, 'data-fa-hit');
    };

    // The pointer the review kit plays, and the demos' own standing states,
    // mirrored onto one attribute the theme's sheet reads.
    const pointer = () => {
        const shown = preview();
        if (!shown || family !== 'hover') return;
        for (const el of shown.querySelectorAll('[data-fa-point]')) {
            const state = el.hasAttribute('data-rv-press')
                ? 'press'
                : el.hasAttribute('data-rv-focus')
                  ? 'focus'
                  : el.hasAttribute('data-rv-hover') || el.classList.contains('tl-hover-sim') || el.classList.contains('is-picked')
                    ? 'hover'
                    : '';
            if ((el.getAttribute('data-fa-state') || '') !== state) {
                if (state) el.setAttribute('data-fa-state', state);
                else el.removeAttribute('data-fa-state');
            }
        }
        shown.toggleAttribute('data-fa-pointing', Boolean(shown.querySelector('[data-fa-state]')));
    };

    // A new reading: the nearest live part of what the demo changed.
    const live = LIVE[component];
    /** @type {Set<Element>} */
    const fresh = new Set();
    let flush = 0;
    const touched = (/** @type {Node} */ node) => {
        if (!live) return;
        const el = node.nodeType === 1 ? /** @type {Element} */ (node) : node.parentElement;
        if (!el || el.closest('[data-fa-pic]')) return;
        const part = el.closest(live.parts);
        if (part) fresh.add(part);
        else for (const inner of el.querySelectorAll(live.parts)) fresh.add(inner);
        if (!flush)
            flush = requestAnimationFrame(() => {
                flush = 0;
                for (const part of fresh) retrigger(part, 'data-fa-live');
                fresh.clear();
            });
    };

    mark();
    let busy = false;
    const observer = new MutationObserver((records) => {
        if (busy) return;
        busy = true;
        try {
            mark();
            pointer();
            if (family === 'live')
                for (const r of records) {
                    if (r.type === 'characterData') touched(r.target);
                    else if (r.type === 'childList') for (const n of r.addedNodes) touched(n);
                    else if (r.type === 'attributes' && live?.attributes?.includes(r.attributeName || '')) touched(r.target);
                }
        } finally {
            busy = false;
        }
    });
    observer.observe(doc.body, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['class', 'hidden', 'data-rv-hover', 'data-rv-focus', 'data-rv-press', 'data-kp-tone', ...(live?.attributes || [])],
    });
    // The demo's own buttons (pressed by the embed, or by the reviewer): the
    // family's motion starts again with the demo's.
    doc.addEventListener('click', (event) => {
        const button = /** @type {Element} */ (event.target).closest?.('button');
        if (button && !preview()?.contains(button)) requestAnimationFrame(replay);
    });
    requestAnimationFrame(replay);
    // A tone whose picture is a motion (struck once when the tone is set) is
    // struck again every 2.4 s, so it can be seen without pressing anything.
    if (family === 'tone')
        setInterval(() => {
            for (const el of preview()?.querySelectorAll('[data-fa-tone]') || []) retrigger(el, 'data-fa-hit');
        }, 2400);
}

/**
 * What a component does not do by itself but the family asks of it, played
 * in both frames of a pair, so "today" and "after" show the same moment: a
 * meter whose share moves with a new reading, a table cell that takes one.
 * @type {Record<string, Record<string, (doc: Document) => void>>}
 */
export const SIMULATE = {
    live: {
        meter: (doc) => {
            let up = false;
            setInterval(() => {
                const meter = /** @type {HTMLElement | null} */ (doc.querySelector('[data-review-preview] .kp-meter:not([data-kp-over])'));
                if (!meter) return;
                const was = Number(meter.dataset.faWas ?? (meter.style.getPropertyValue('--kp-value') || 0.62));
                meter.dataset.faWas = String(was);
                up = !up;
                const now = up ? Math.min(was + 0.09, 0.98) : was;
                meter.style.setProperty('--kp-value', String(now));
                meter.setAttribute('aria-valuenow', String(Math.round(now * 100)));
            }, 2400);
        },
        busy: (doc) => {
            // The table at rest first: its own Ready button.
            const ready = [...doc.querySelectorAll('[data-review-controls] button')].find((b) => (b.textContent || '').trim() === 'Ready');
            /** @type {HTMLElement | undefined} */ (ready)?.click();
            const readings = ['3.42 bar', '3.47 bar'];
            let at = 0;
            setInterval(() => {
                const cell = doc.querySelector('[data-review-preview] tbody tr:first-child td:nth-child(2)');
                if (!cell) return;
                at = 1 - at;
                cell.textContent = readings[at];
            }, 2400);
        },
    },
};
