// Writes the data into one entity card; fits its flags and actions and redraws it when they change.
import { setMeter } from '../kpi.js';
import { setMenu, attachMenuButtons } from '../menu-button.js';
import { getStrings } from '../strings.js';
import { ENTITY_ACTION_EVENT, ENTITY_FLAG_EVENT, ENTITY_GRID, ENTITY_RETRY_EVENT } from './constants.js';
import { DRAWN, SLOTS, columnsFor, frame, made, opt, sig, slotOf, starKeyOf } from './helpers.js';
import { appendStar, syncStar, tickAndMark } from './star.js';
import { drawTile, trendRow } from './tile.js';
/** @typedef {import('./types.js').EntityData} EntityData */

/**
 * Take a flag out of the row (into the "+N") while the row is wider than the card, one at a time, as soon as the card is laid out.
 * @param {HTMLElement} card
 * @param {number} shown how many flags are drawn now
 */
function fitFlags(card, shown) {
    const view = card.ownerDocument.defaultView;
    view?.requestAnimationFrame(() => {
        const row = slotOf(card, 'flags');
        if (!row || !card.isConnected || shown <= 0) return;
        if (row.scrollWidth > row.clientWidth + 1) {
            card.dataset.kpFlagsFit = String(shown - 1);
            const was = DRAWN.get(card);
            if (was) {
                delete was.drawn.flags;
                setEntity(card, was.data);
            }
        }
    });
}

/** Grids (or lone cards) with a fit check already waiting for the next frame. @type {WeakSet<HTMLElement>} */
const ACTIONS_QUEUED = new WeakSet();

/**
 * Move actions into "More" while a button of the grid does not fit its card, one button at a time, as soon as the cards are
 * laid out: the columns are equal (`minmax(0, 1fr)`), so a button whose longest word is wider than its column spills it past its own
 * box, which is what is measured here (and a row that runs past the card's edge). The count is the grid's, so the same action stands in the same column on every card.
 * @param {HTMLElement} host the grid, or the card when it stands alone
 * @param {number} inline how many actions stand as buttons now
 */
function fitActions(host, inline) {
    if (inline <= 0 || ACTIONS_QUEUED.has(host)) return;
    ACTIONS_QUEUED.add(host);
    host.ownerDocument.defaultView?.requestAnimationFrame(() => {
        ACTIONS_QUEUED.delete(host);
        // Another pass has already taken a button out since this one was asked for.
        if (!host.isConnected || Number(host.dataset.kpEntityFit ?? inline) < inline) return;
        const cards = /** @type {HTMLElement[]} */ (host.matches(ENTITY_GRID) ? [...host.querySelectorAll(':scope > .kp-card--entity')] : [host]);
        const tooWide = cards.some((card) => {
            const row = slotOf(card, 'actions');
            if (!row || row.hidden || row.clientWidth === 0 || card.dataset.kpState === 'error') return false;
            const edge = row.getBoundingClientRect().right + 0.5;
            // The columns are equal, so a button too wide for its column spills its longest word past its own box
            // (or past the row's edge, for the last one).
            return [...row.children].some((child) => {
                const button = child.matches('button') ? child : child.querySelector('button');
                return child.getBoundingClientRect().right > edge || (button !== null && button.scrollWidth > button.clientWidth);
            });
        });
        if (!tooWide) return;
        host.dataset.kpEntityFit = String(inline - 1);
        redraw(cards);
    });
}

/**
 * Draw the given cards again from their last data, slot by slot as the signatures say.
 * @param {readonly HTMLElement[]} cards
 * @param {string[]} [slots] slots to draw anew whatever the signature says
 */
export function redraw(cards, slots = ['actions']) {
    for (const card of cards) {
        const was = DRAWN.get(card);
        if (!was) continue;
        for (const name of slots) delete was.drawn[name];
        setEntity(card, was.data);
    }
}

/**
 * Draw one card from its data. Only what differs from the last draw is touched.
 * @param {HTMLElement} card
 * @param {EntityData} data
 */
export function setEntity(card, data) {
    const kind = frame(card);
    const doc = card.ownerDocument;
    const s = getStrings();
    const before = DRAWN.get(card);
    /** @type {Record<string, string>} */
    const drawn = before?.drawn ?? {};
    // The star as it stands: a refill (new data) says it, a redraw of the same data keeps what was pressed since.
    const star = before && before.data === data ? before.star : (data.starred ?? before?.star ?? false);
    DRAWN.set(card, { data, drawn, star });
    card.setAttribute('data-kp-row-key', data.key);
    card.setAttribute('data-kp-entity-key', data.key);
    const status = data.status ?? 'ready';
    card.setAttribute('data-kp-state', status);
    const meterRows = Math.max(0, Math.min(3, Number(opt(card, 'data-kp-entity-meters') ?? 2) || 0));
    // A lone refill that brings the first trend into a grid gives the cards already there their row too (`auto`).
    const around = card.closest(ENTITY_GRID);
    if (around && Array.isArray(data.trend) && !around.hasAttribute('data-kp-entity-trended')) {
        around.setAttribute('data-kp-entity-trended', '');
        redraw(
            /** @type {HTMLElement[]} */ ([...around.querySelectorAll(':scope > .kp-card--entity')]).filter((other) => other !== card),
            ['meters'],
        );
    }
    // The trend row is a row of the meters block: `auto` gives every card of the grid the row once one card has a trend.
    const trendMode = opt(card, 'data-kp-entity-trend') ?? 'auto';
    const trended = Array.isArray(data.trend) || (card.closest(ENTITY_GRID)?.hasAttribute('data-kp-entity-trended') ?? false);
    const trendOn = kind === 'stack' && (trendMode === 'on' || (trendMode !== 'off' && trended));
    card.style.setProperty('--kp-entity-meters', String(meterRows + (trendOn ? 1 : 0)));
    const key = data.key;

    /** Draw a slot only when its signature changed. @param {string} slot_ @param {unknown} signature @param {(el: HTMLElement) => void} build */
    const slot = (slot_, signature, build) => {
        const text = sig(signature);
        if (drawn[slot_] === text) return;
        drawn[slot_] = text;
        const el = slotOf(card, slot_);
        el.replaceChildren();
        build(el);
    };

    const loading = status === 'loading';
    if (loading) {
        // A skeleton keeps every row: what the card will hold is not known yet.
        card.removeAttribute('data-kp-entity-actions');
        slotOf(card, kind === 'stack' ? 'actions' : 'lines').hidden = false;
        for (const name of SLOTS[kind]) {
            slot(name, 'loading', (el) => {
                const bone = made(doc, 'span', 'kp-skeleton kp-entity__bone');
                bone.setAttribute('aria-hidden', 'true');
                el.append(bone);
            });
        }
        card.setAttribute('aria-busy', 'true');
        return;
    }
    card.removeAttribute('aria-busy');

    const link = opt(card, 'data-kp-entity-link');
    const selectable = opt(card, 'data-kp-selectable') !== null;
    const markKind = opt(card, 'data-kp-entity-mark') ?? 'idmark';
    const starOn = (opt(card, 'data-kp-entity-star') ?? (kind === 'tile' ? 'on' : 'off')) !== 'off';
    const starKey = starKeyOf(card);

    if (kind === 'tile') {
        drawTile({ card, data, doc, s, slot, status, key, link, selectable, markKind, starOn, starKey, star });
        return;
    }

    // 1. identity
    slot('id', { n: data.name, v: data.vmid, st: data.state, link, selectable, markKind, status, starOn, starKey }, (el) => {
        tickAndMark(card, el, data, selectable, markKind);
        const name = link ? made(doc, 'a', 'kp-entity__name') : made(doc, 'span', 'kp-entity__name');
        if (name instanceof HTMLAnchorElement && link) name.href = link.replace('{key}', encodeURIComponent(key));
        name.textContent = data.name;
        el.append(name);
        const vmid = made(doc, 'span', 'kp-entity__vmid');
        vmid.textContent = data.vmid ?? '';
        el.append(vmid);
        const st = made(
            doc,
            'span',
            `kp-badge kp-entity__state${data.state?.tone ? ` kp-badge--${status === 'error' ? 'destructive' : data.state.tone}` : status === 'error' ? ' kp-badge--destructive' : ''}`,
        );
        st.textContent = status === 'error' ? s.entityFailed : (data.state?.label ?? '');
        el.append(st);
        if (starOn) appendStar(card, el, data, star, starKey);
    });
    syncStar(card, star);

    // 2. figures (exact numbers, tabular, in one row)
    slot('figures', { f: data.figures, status }, (el) => {
        if (status === 'empty') {
            const none = made(doc, 'span', 'kp-entity__none');
            none.textContent = s.entityNotMeasured;
            el.append(none);
            return;
        }
        for (const f of data.figures ?? []) {
            const one = made(doc, 'span', 'kp-entity__figure');
            const value = made(doc, 'b', 'kp-entity__value');
            value.textContent = f.value;
            one.append(value, ` ${f.label}`);
            el.append(one);
        }
    });

    // 3. flags: the first few, and an exact "+N" that opens the package's menu
    const flagsAsked = Math.max(0, Number(opt(card, 'data-kp-entity-flags-max') ?? 3));
    // Fewer flags show when they do not fit the card's width: the rest go behind the "+N", so nothing is cut.
    const flagsMax = Math.min(flagsAsked, Number(card.dataset.kpFlagsFit ?? flagsAsked));
    slot('flags', { fl: data.flags, flagsMax }, (el) => {
        const all = data.flags ?? [];
        for (const flag of all.slice(0, flagsMax)) {
            const chip = made(doc, 'span', `kp-badge kp-entity__flag${flag.tone ? ` kp-badge--${flag.tone}` : ''}`);
            chip.textContent = flag.label;
            el.append(chip);
        }
        const rest = all.slice(flagsMax);
        if (rest.length > 0) {
            const wrap = made(doc, 'div', 'kp-menu-button kp-entity__more-flags');
            wrap.setAttribute('data-kp-menu-button', '');
            wrap.setAttribute('data-kp-key', `${key}-flags`);
            const button = /** @type {HTMLButtonElement} */ (made(doc, 'button', 'kp-button kp-button--ghost kp-button--sm kp-entity__plus'));
            button.type = 'button';
            button.textContent = `+${rest.length}`;
            button.setAttribute('aria-label', s.entityMoreFlags(rest.length));
            const menu = made(doc, 'div', 'kp-menu kp-menu--rich');
            menu.setAttribute('role', 'menu');
            menu.setAttribute('aria-label', s.entityFlagsLabel);
            wrap.append(button, menu);
            el.append(wrap);
            attachMenuButtons(el);
            setMenu(wrap, [{ group: '', items: rest.map((f) => ({ label: f.label, value: f.label })) }]);
            wrap.addEventListener('kp-menu-select', (event) => {
                card.dispatchEvent(
                    new CustomEvent(ENTITY_FLAG_EVENT, { bubbles: true, detail: { key, flag: /** @type {CustomEvent} */ (event).detail.value } }),
                );
            });
        }
    });

    fitFlags(card, flagsMax);

    // 4. meters: a fixed number of rows; the number is always beside the bar
    slot('meters', { m: data.meters, meterRows, status, tr: trendOn ? [data.trend ?? null, data.trendLabel, data.trendText] : null }, (el) => {
        for (let i = 0; i < meterRows; i++) {
            const m = data.meters?.[i];
            const row = made(doc, 'div', 'kp-entity__meter');
            const label = made(doc, 'span', 'kp-entity__meter-label');
            label.textContent = m?.label ?? '';
            const bar = made(doc, 'div', 'kp-meter');
            const value = made(doc, 'span', 'kp-entity__meter-value');
            if (m && status !== 'empty') {
                const tone = m.tone ?? (m.value !== null && m.value >= 0.9 ? 'destructive' : m.value !== null && m.value >= 0.75 ? 'warning' : null);
                setMeter(bar, { value: m.value, mark: m.mark ?? null, tone, label: m.label });
                value.textContent = m.text ?? (m.value === null ? '—' : `${Math.round(m.value * 100)}%`);
            } else {
                setMeter(bar, { value: null });
                value.textContent = status === 'empty' ? s.entityNotMeasured : '';
            }
            row.append(label, bar, value);
            el.append(row);
        }
        if (trendOn) el.append(trendRow(doc, s, data, status));
    });

    // 5. actions: at most a few inline, the rest in the package's menu; a failed card puts Retry here
    const narrow = card.closest(ENTITY_GRID)?.hasAttribute('data-kp-entity-narrow') ?? false;
    const inlineAsked = narrow ? 0 : Math.max(0, Number(opt(card, 'data-kp-entity-inline') ?? 3));
    // Fewer actions stand as buttons when they do not fit the card's width: the rest go in "More", so nothing is cut.
    const fitHost = /** @type {HTMLElement} */ (card.closest(ENTITY_GRID) ?? card);
    const inline = Math.min(inlineAsked, Number(fitHost.dataset.kpEntityFit ?? inlineAsked));
    // The buttons come only from the data: a card with no action has no actions row, and no space where it would be.
    const noActions = status !== 'error' && (data.actions ?? []).length === 0;
    if (noActions) card.setAttribute('data-kp-entity-actions', 'none');
    else card.removeAttribute('data-kp-entity-actions');
    slotOf(card, 'actions').hidden = noActions;
    // One set of columns for the whole grid, so the same action stands in the same column on every card.
    const host = fitHost;
    host.style.setProperty('--kp-entity-cols', String(columnsFor(host, inline)));
    slot('actions', { a: data.actions, inline, status }, (el) => {
        if (status === 'error') {
            const retry = /** @type {HTMLButtonElement} */ (made(doc, 'button', 'kp-button kp-entity__action kp-entity__retry'));
            retry.type = 'button';
            retry.textContent = s.entityRetry;
            if (data.error) retry.title = data.error;
            retry.addEventListener('click', () => card.dispatchEvent(new CustomEvent(ENTITY_RETRY_EVENT, { bubbles: true, detail: { key } })));
            el.append(retry);
            return;
        }
        const all = data.actions ?? [];
        const shown = all.slice(0, inline);
        const rest = all.slice(inline);
        for (const a of shown) {
            const button = /** @type {HTMLButtonElement} */ (
                made(doc, 'button', `kp-button kp-button--sm kp-entity__action${a.danger ? ' kp-button--destructive' : ''}`)
            );
            button.type = 'button';
            button.textContent = a.label;
            if (a.disabled) {
                button.setAttribute('aria-disabled', 'true');
                button.setAttribute('data-kp-disabled-reason', a.disabled);
            }
            button.addEventListener('click', () => {
                if (a.disabled) return;
                card.dispatchEvent(new CustomEvent(ENTITY_ACTION_EVENT, { bubbles: true, detail: { key, id: a.id } }));
            });
            el.append(button);
        }
        if (rest.length > 0) {
            const wrap = made(doc, 'div', 'kp-menu-button kp-entity__more');
            wrap.setAttribute('data-kp-menu-button', '');
            wrap.setAttribute('data-kp-key', `${key}-more`);
            const button = /** @type {HTMLButtonElement} */ (made(doc, 'button', 'kp-button kp-button--sm'));
            button.type = 'button';
            button.textContent = s.entityMore;
            const menu = made(doc, 'div', 'kp-menu kp-menu--rich');
            menu.setAttribute('role', 'menu');
            menu.setAttribute('aria-label', s.entityMoreLabel);
            wrap.append(button, menu);
            el.append(wrap);
            attachMenuButtons(el);
            setMenu(wrap, [
                { group: '', items: rest.map((a) => ({ label: a.label, value: a.id, danger: a.danger === true, disabled: a.disabled ?? null })) },
            ]);
            wrap.addEventListener('kp-menu-select', (event) => {
                card.dispatchEvent(
                    new CustomEvent(ENTITY_ACTION_EVENT, { bubbles: true, detail: { key, id: /** @type {CustomEvent} */ (event).detail.value } }),
                );
            });
        }
    });

    fitActions(host, inline);
}
