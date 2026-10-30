// The intent filter: the field, the matching and the keyboard of the palette list.
import { OPTION_SELECTOR } from '../listbox.js';
import { getStrings } from '../strings.js';
import { INTENT_MAX_SHOWN, intentRanges, intentScore, intentWords, noMatchText, queryWords } from '../intent.js';
import { statePlate } from '../state-plate.js';
import { openBusyCard } from '../busy-card.js';

/**
 * The intent matcher's side of one palette: score every command, hide what does not answer, put the best answer first
 * in its group, mark the matched words, keep the status line exact, and stand an empty or failed plate in the list's
 * footprint. The commands stay the consumer's markup; this only hides, moves and marks them, and gives all of it back
 * on destroy().
 *
 * @param {HTMLDialogElement} dialog
 * @param {HTMLElement} list
 * @param {HTMLElement | null} status
 */
export function createIntentFilter(dialog, list, status) {
    const doc = dialog.ownerDocument;
    /** Where each command stood in the markup, so the order comes back when nothing is typed. @type {WeakMap<Element, number>} */
    const origin = new WeakMap();
    /** @type {WeakMap<Element, number>} */
    const groupOrigin = new WeakMap();
    /** @type {HTMLElement | null} */
    let plate = null;
    /** @type {import('../busy-card.js').BusyCard | null} */
    let busy = null;
    /** @type {'ready' | 'loading' | 'error'} */
    let state = 'ready';
    /** @type {{ message?: string }} */
    let stateOptions = {};
    /** The list's own height while it had commands, the footprint a plate keeps. */
    let footprint = 0;

    const modeOptions = () => ({
        foldDiacritics: dialog.dataset.kpFoldDiacritics !== 'off',
        splitHyphen: dialog.dataset.kpSplitHyphen !== 'off',
        typo: /** @type {0 | 1} */ (dialog.dataset.kpTypo === '1' ? 1 : 0),
    });

    /** The element that moves with a command: its `li` when the command is a link wrapped in a presentation item. @param {HTMLElement} option */
    const unitOf = (option) => {
        const parent = option.parentElement;
        return parent !== null && parent !== list && parent.matches('li[role="presentation"]') && parent.children.length === 1 ? parent : option;
    };

    /** The shown words of a command and the words that weigh less (a description, the hint attribute). @param {HTMLElement} option */
    const textsOf = (option) => {
        /** @type {string[]} */
        const label = [];
        /** @type {string[]} */
        const hint = [];
        /** @param {Node} node @param {boolean} inHint */
        const walk = (node, inHint) => {
            for (const child of node.childNodes) {
                if (child instanceof HTMLElement) {
                    if (child.tagName === 'KBD') continue;
                    walk(child, inHint || child.matches('.kp-palette__description, [data-kp-hint-text]'));
                } else if (child.nodeType === Node.TEXT_NODE) (inHint ? hint : label).push(child.textContent ?? '');
            }
        };
        walk(option, false);
        return { label: label.join(''), hint: `${hint.join(' ')} ${option.dataset.kpHint ?? ''}`.trim() };
    };

    /** @param {HTMLElement[]} options */
    const assignOrigins = (options) => {
        let previous = -1;
        options.forEach((option, index) => {
            let at = origin.get(option);
            if (at === undefined) {
                // A command the consumer added later stands after the command before it.
                at = previous < 0 ? index : previous + 0.001;
                origin.set(option, at);
            }
            previous = at;
        });
        for (const [index, group] of [...list.querySelectorAll('[data-kp-group]')].entries())
            if (!groupOrigin.has(group)) groupOrigin.set(group, index);
    };

    /** Put `elements`, which share places in the page, into the order given without touching what stands between them. @param {HTMLElement[]} ordered */
    const place = (ordered) => {
        const now = ordered.slice().sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
        if (now.every((el, i) => el === ordered[i])) return;
        const holes = now.map((el) => {
            const hole = doc.createComment('');
            el.before(hole);
            return hole;
        });
        ordered.forEach((el, i) => holes[i].replaceWith(el));
    };

    /** @param {HTMLElement} option */
    const clearMarks = (option) => {
        const marks = option.querySelectorAll('.kp-palette__mark');
        if (marks.length === 0) return;
        for (const mark of marks) mark.replaceWith(doc.createTextNode(mark.textContent ?? ''));
        option.normalize();
    };

    /**
     * The command's own words in one element, so marks inside them are inline parts of one flex item and not new items
     * of the row (a row is a flex box with a gap).
     * @param {HTMLElement} option
     */
    const wrapLabel = (option) => {
        /** @type {Text[][]} */
        const runs = [];
        /** @type {Text[]} */
        let run = [];
        for (const child of [...option.childNodes]) {
            if (child.nodeType === Node.TEXT_NODE) run.push(/** @type {Text} */ (child));
            else {
                if (run.length > 0) runs.push(run);
                run = [];
            }
        }
        if (run.length > 0) runs.push(run);
        for (const nodes of runs) {
            if (!nodes.some((n) => (n.data ?? '').trim() !== '')) continue;
            const span = doc.createElement('span');
            span.className = 'kp-palette__label';
            span.setAttribute('data-kp-generated', '');
            nodes[0].before(span);
            span.append(...nodes);
        }
    };

    /** @param {HTMLElement} option @param {string[]} want @param {ReturnType<typeof modeOptions>} mode */
    const markWords = (option, want, mode) => {
        const walker = doc.createTreeWalker(option, NodeFilter.SHOW_TEXT);
        /** @type {Text[]} */
        const nodes = [];
        for (let n; (n = walker.nextNode());)
            if (n.parentElement?.tagName !== 'KBD' && (n.textContent ?? '').trim() !== '') nodes.push(/** @type {Text} */ (n));
        for (const node of nodes) {
            const ranges = intentRanges(node.data, want, mode);
            if (ranges.length === 0) continue;
            const frag = doc.createDocumentFragment();
            let at = 0;
            for (const [from, to] of ranges) {
                if (from > at) frag.append(node.data.slice(at, from));
                const mark = doc.createElement('span');
                mark.className = 'kp-palette__mark';
                mark.textContent = node.data.slice(from, to);
                frag.append(mark);
                at = to;
            }
            if (at < node.data.length) frag.append(node.data.slice(at));
            node.replaceWith(frag);
        }
    };

    const recentKey = () => `kp-recent:palette:${dialog.id || 'palette'}`;
    /** @returns {string[]} */
    const readRecent = () => {
        try {
            const raw = JSON.parse(globalThis.localStorage?.getItem(recentKey()) ?? '[]');
            return Array.isArray(raw) ? raw.map(String) : [];
        } catch {
            return [];
        }
    };

    const ensurePlate = () => {
        if (plate) return plate;
        plate = doc.createElement('div');
        plate.className = 'kp-palette__nomatch';
        plate.hidden = true;
        list.after(plate);
        return plate;
    };

    /** @param {HTMLElement} el @param {boolean} hidden */
    const setHidden = (el, hidden) => {
        if (el.hidden !== hidden) el.hidden = hidden;
    };

    /** What the list's own height cap was before a failed plate capped it; null while it is not capped by us. @type {string | null} */
    let ownListCap = null;
    /** @param {number} px */
    const capList = (px) => {
        ownListCap = list.style.getPropertyValue('--kp-palette-list-max-height');
        // `max-height` counts the padding and the border unless the list is border-box.
        const cs = getComputedStyle(list);
        const frame =
            cs.boxSizing === 'border-box'
                ? 0
                : parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
        list.style.setProperty('--kp-palette-list-max-height', `${Math.max(px - frame, 0)}px`);
    };
    const releaseListCap = () => {
        if (ownListCap === null) return;
        if (ownListCap) list.style.setProperty('--kp-palette-list-max-height', ownListCap);
        else list.style.removeProperty('--kp-palette-list-max-height');
        ownListCap = null;
    };

    const hidePlate = () => {
        if (plate) plate.hidden = true;
        releaseListCap();
        setHidden(list, false);
    };

    /** @param {'empty' | 'error'} kind @param {string} title @param {string} text @param {boolean} replacesList */
    const showPlate = (kind, title, text, replacesList) => {
        const holder = ensurePlate();
        const s = getStrings();
        holder.replaceChildren(
            statePlate(doc, {
                kind,
                title,
                text,
                ...(kind === 'error'
                    ? { actionLabel: s.paletteRetry, onAction: () => dialog.dispatchEvent(new CustomEvent('kp-palette-retry', { bubbles: true })) }
                    : {}),
            }),
        );
        holder.toggleAttribute('data-kp-above', !replacesList);
        holder.hidden = false;
        setHidden(list, replacesList);
        // A plate that replaces the list is as high as the list was. A plate above the commands that stay (the failed one) is as high
        // as the list was minus those commands, so the palette keeps its loaded footprint in a failed state too [t56-shared3-1018].
        releaseListCap();
        const staying = replacesList || list.hidden ? 0 : list.offsetHeight;
        holder.style.setProperty('--kp-palette-plate-height', '0px');
        // The plate needs room for its words and its action; when the commands that stay take more than what is left, they scroll.
        const needed = holder.offsetHeight;
        const room = Math.max(footprint - staying, needed);
        holder.style.setProperty('--kp-palette-plate-height', `${room}px`);
        if (staying > 0 && staying + room > footprint) capList(Math.max(footprint - room, 0));
    };

    /**
     * Filter, rank and mark for `rawQuery`.
     * @param {string} rawQuery
     * @returns {number} how many commands are shown
     */
    const run = (rawQuery) => {
        const s = getStrings();
        const mode = modeOptions();
        const want = queryWords(rawQuery, mode);
        // The footprint is read from a list that shows commands, never from the few that stay under a failed plate.
        if (!list.hidden && list.offsetHeight > 0 && (plate === null || plate.hidden)) footprint = list.offsetHeight;
        const options = /** @type {HTMLElement[]} */ ([...list.querySelectorAll(OPTION_SELECTOR)]);
        assignOrigins(options);
        const context = dialog.dataset.kpContext ?? null;
        const recentN = Number(dialog.dataset.kpRecent) || 0;
        const recent = recentN > 0 ? readRecent().slice(0, recentN) : [];
        const max = Math.max(1, Number(dialog.dataset.kpMaxShown) || INTENT_MAX_SHOWN);
        const failed = state === 'error';
        const valueOf = (/** @type {HTMLElement} */ option) => option.dataset.value ?? (option.textContent ?? '').trim();
        const items = options.map((option) => {
            // The marks of the last run come off before the words are read: a mark splits a word into several text
            // nodes ("new" + "est"), and a description reads its nodes apart, so "newest" typed letter by letter
            // found nothing once "new" was marked [kpadopt6-r2: Kenny, 2026-10-18 "sometimes an empty list"].
            clearMarks(option);
            if (!option.querySelector(':scope > .kp-palette__label')) wrapLabel(option);
            const { label, hint } = textsOf(option);
            const value = valueOf(option);
            const inContext = context !== null && option.dataset.kpContextOf === context;
            const featured = option.hasAttribute('data-kp-featured');
            const recency = recent.indexOf(value);
            const base = intentScore({ label, hint, words: option.dataset.kpWords ?? '' }, want, mode);
            const score = base < 0 ? -1 : base + (inContext ? 3 : 0) + (want.length === 0 && recency >= 0 ? 2 : 0);
            return { option, base, score, inContext, featured, recency, at: origin.get(option) ?? 0 };
        });
        const byOption = new Map(items.map((it) => [it.option, it]));
        const startSet = items.some((it) => it.featured || it.inContext || it.recency >= 0);
        for (const it of items) {
            let show = it.base >= 0;
            if (failed && !it.option.hasAttribute('data-kp-static')) show = false;
            if (show && want.length === 0 && startSet && !failed) show = it.featured || it.inContext || it.recency >= 0;
            if (!show) it.score = -1;
        }
        const total = items.filter((it) => it.score >= 0).length;

        // The best answer first in its own group; the order of the markup when nothing is typed and nothing is recent.
        /** @type {Map<HTMLElement, typeof items>} */
        const containers = new Map();
        for (const it of items) {
            const unit = unitOf(it.option);
            const parent = /** @type {HTMLElement} */ (unit.parentElement);
            containers.set(parent, [...(containers.get(parent) ?? []), it]);
        }
        for (const [, group] of containers) {
            group.sort((a, b) => {
                if (a.score >= 0 !== b.score >= 0) return a.score >= 0 ? -1 : 1;
                if (b.score !== a.score) return b.score - a.score;
                if (want.length === 0 && a.recency !== b.recency) return (a.recency < 0 ? 99 : a.recency) - (b.recency < 0 ? 99 : b.recency);
                return a.at - b.at;
            });
            place(group.map((it) => unitOf(it.option)));
        }

        // The sections: the consumer's order, else the markup's.
        const groups = /** @type {HTMLElement[]} */ ([...list.querySelectorAll('[data-kp-group]')]);
        const named = (dialog.dataset.kpGroupOrder ?? '')
            .split(',')
            .map((g) => g.trim().toLowerCase())
            .filter(Boolean);
        const labelOf = (/** @type {HTMLElement} */ g) =>
            (g.querySelector('.kp-palette__group-label')?.textContent ?? g.getAttribute('aria-label') ?? '').trim().toLowerCase();
        if (groups.length > 1) {
            const rank = (/** @type {HTMLElement} */ g) => {
                const i = named.indexOf(labelOf(g));
                return i < 0 ? named.length + (groupOrigin.get(g) ?? 0) : i;
            };
            place(groups.slice().sort((a, b) => rank(a) - rank(b)));
        }

        // Which are shown: the answers, up to the cap when a query narrows them.
        const capped = want.length > 0 || startSet;
        let shownCount = 0;
        for (const option of /** @type {HTMLElement[]} */ ([...list.querySelectorAll(OPTION_SELECTOR)])) {
            const it = byOption.get(option);
            let show = (it?.score ?? -1) >= 0;
            if (show && capped && shownCount >= max) show = false;
            if (show) shownCount += 1;
            setHidden(option, !show);
            const unit = unitOf(option);
            if (unit !== option) setHidden(unit, !show);
            clearMarks(option);
            if (show && want.length > 0 && dialog.dataset.kpHighlight !== 'off') markWords(option, want, mode);
        }
        for (const group of groups) setHidden(group, group.querySelector(`${OPTION_SELECTOR}:not([hidden])`) === null);

        // The status line is exact; a cap says so.
        if (status !== null) {
            status.textContent =
                shownCount < total
                    ? s.paletteCapped(shownCount, total)
                    : shownCount === 0
                      ? s.noCommands
                      : shownCount === 1
                        ? s.oneCommand
                        : s.manyCommands(shownCount);
        }

        // An empty or a failed list is a plate in the list's footprint, never a line in a corner.
        if (failed) showPlate('error', s.paletteFailed, stateOptions.message ?? s.paletteFailedText, false);
        else if (shownCount === 0 && want.length > 0 && dialog.dataset.kpNomatch === 'plate') {
            const verbs = [...new Set(options.map((o) => o.dataset.kpVerb).filter((v) => v))];
            const verb = verbs.find((v) => want.length > 1 && intentWords(v ?? '', mode)[0]?.startsWith(want[0]));
            const subjects = verb
                ? options
                      .filter((o) => o.dataset.kpVerb === verb)
                      .map((o) => o.dataset.kpContextOf ?? '')
                      .filter(Boolean)
                : [];
            showPlate(
                'empty',
                s.paletteNothing,
                noMatchText(
                    rawQuery,
                    { verbs: verb ? [verb] : [], subjects, noun: dialog.dataset.kpSubjectName ?? '', hint: dialog.dataset.kpNomatchHint ?? '' },
                    mode,
                ),
                true,
            );
        } else hidePlate();
        return shownCount;
    };

    return {
        run,
        /** @param {'ready' | 'loading' | 'error'} next @param {{ message?: string }} [options] */
        setState(next, options = {}) {
            state = next;
            stateOptions = options;
            if (next === 'loading' && !busy) {
                list.setAttribute('aria-busy', 'true');
                busy = openBusyCard(list, {
                    words: getStrings().paletteLoading,
                    area: () => [list],
                    className: 'kp-palette__busy',
                    arrive: dialog.open,
                });
            } else if (next !== 'loading' && busy) {
                list.removeAttribute('aria-busy');
                const closing = busy;
                busy = null;
                void closing.close();
            }
        },
        /** @param {string} value */
        remember(value) {
            const n = Number(dialog.dataset.kpRecent) || 0;
            if (n <= 0 || value === '') return;
            try {
                globalThis.localStorage?.setItem(recentKey(), JSON.stringify([value, ...readRecent().filter((v) => v !== value)].slice(0, n)));
            } catch {
                /* no storage: no memory, the palette still works */
            }
        },
        destroy() {
            busy?.remove();
            busy = null;
            list.removeAttribute('aria-busy');
            plate?.remove();
            plate = null;
            setHidden(list, false);
            const options = /** @type {HTMLElement[]} */ ([...list.querySelectorAll(OPTION_SELECTOR)]);
            for (const option of options) {
                clearMarks(option);
                for (const label of option.querySelectorAll(':scope > .kp-palette__label[data-kp-generated]')) label.replaceWith(...label.childNodes);
                option.normalize();
            }
            // The markup's own order comes back.
            /** @type {Map<HTMLElement, HTMLElement[]>} */
            const containers = new Map();
            for (const option of options) {
                const unit = unitOf(option);
                const parent = /** @type {HTMLElement} */ (unit.parentElement);
                containers.set(parent, [...(containers.get(parent) ?? []), unit]);
            }
            for (const [, units] of containers)
                place(
                    units
                        .slice()
                        .sort(
                            (a, b) =>
                                (origin.get(/** @type {Element} */ (a.matches(OPTION_SELECTOR) ? a : a.querySelector(OPTION_SELECTOR))) ?? 0) -
                                (origin.get(/** @type {Element} */ (b.matches(OPTION_SELECTOR) ? b : b.querySelector(OPTION_SELECTOR))) ?? 0),
                        ),
                );
            const groups = /** @type {HTMLElement[]} */ ([...list.querySelectorAll('[data-kp-group]')]);
            place(groups.slice().sort((a, b) => (groupOrigin.get(a) ?? 0) - (groupOrigin.get(b) ?? 0)));
        },
    };
}
