// The legend: its keys, its median words and its loading skeleton.
import { decorateWith, h } from '../dom.js';
import { paintSeries } from '../attach.js';
import { toggleSource } from '../selection.js';
/** @typedef {import('./context.js').PlotContext} PlotContext */

/**
 * What the the legend: its keys, its median words and its loading skeleton part adds to the table's context.
 *
 * @typedef {{
 *     buildLegend: () => void;
 *     medianWords: (opt: { median: boolean; medianWords: string; runs: boolean; minPoints: number; minUnit: string; key: boolean; band: 'tint' | 'hatch' | 'bracket'; }) => string;
 *     paintKey: (opt: { median: boolean; medianWords: string; runs: boolean; minPoints: number; minUnit: string; key: boolean; band: 'tint' | 'hatch' | 'bracket'; }) => void;
 *     skeletonLegend: () => void;
 * }} LegendFields
 */

/**
 * The legend: its keys, its median words and its loading skeleton.
 *
 * @param {PlotContext} c
 */
export function installLegend(c) {
    const {
        annKey,
        decorate,
        doc,
        fmt,
        host,
        key,
        kindOf,
        kindWord,
        kindsOff,
        label,
        legend,
        option,
        plot,
        release,
        setSel,
        showAll,
        strings,
        toneOf,
    } = c;
    c.paintKey = paintKey;
    c.buildLegend = buildLegend;
    c.skeletonLegend = skeletonLegend;

    /** Build (or update) the key above the plot: one switch per kind, and a note for the median and the runs. @param {ReturnType<typeof option>} opt */
    function paintKey(opt) {
        const all = c.data.events ?? [];
        /** @type {Map<string, { tone: string, count: number }>} */
        const kinds = new Map();
        for (const ev of all) {
            const k = kindOf(ev);
            const was = kinds.get(k);
            if (was) was.count += 1;
            else kinds.set(k, { tone: toneOf(ev), count: 1 });
        }
        const notes = [opt.median && c.medians.length === 1 ? 'median' : '', opt.median && opt.runs ? 'runs' : ''].filter(Boolean);
        const wanted = opt.key && (kinds.size > 0 || notes.length > 0);
        annKey.hidden = !wanted;
        annKey.removeAttribute('data-kp-wait');
        if (!wanted) {
            c.keyMemo = '';
            annKey.replaceChildren();
            return;
        }
        annKey.setAttribute('aria-label', strings.keyLabel);
        const signature = JSON.stringify([...kinds].map(([k, v]) => [k, v.tone, v.count, kindWord(k)]).concat(notes.map((n) => [n])));
        if (signature !== c.keyMemo) {
            c.keyMemo = signature;
            const focused =
                doc.activeElement instanceof HTMLElement && annKey.contains(doc.activeElement)
                    ? doc.activeElement.getAttribute('data-kp-kind')
                    : null;
            const items = [...kinds].map(([k, v]) => {
                const dot = h(doc, 'i', { class: 'kp-chart__dot', 'data-kp-tone': v.tone, 'aria-hidden': 'true' });
                const button = h(
                    doc,
                    'button',
                    { type: 'button', class: 'kp-chart__annkey-item', 'data-kp-kind': k, title: strings.kindOn(kindWord(k)) },
                    dot,
                    h(doc, 'span', {}, kindWord(k)),
                    h(doc, 'b', { class: 'kp-chart__annkey-count' }, String(v.count)),
                );
                button.addEventListener('click', () => {
                    if (kindsOff.has(k)) kindsOff.delete(k);
                    else kindsOff.add(k);
                    host.dispatchEvent(new CustomEvent('kp-chart-kinds', { bubbles: true, detail: { off: [...kindsOff] } }));
                    c.draw();
                });
                return button;
            });
            const extra = notes.map((n) =>
                n === 'median'
                    ? h(
                          doc,
                          'span',
                          { class: 'kp-chart__annkey-note', 'data-kp-note': 'median' },
                          h(doc, 'i', { class: 'kp-chart__annkey-line', 'aria-hidden': 'true' }),
                          h(doc, 'span', { class: 'kp-chart__annkey-median' }),
                      )
                    : h(
                          doc,
                          'span',
                          { class: 'kp-chart__annkey-note', 'data-kp-note': 'runs' },
                          h(doc, 'i', { class: 'kp-chart__annkey-ring', 'aria-hidden': 'true' }),
                          strings.runsKey,
                      ),
            );
            annKey.replaceChildren(...items, ...extra);
            if (focused) /** @type {HTMLElement | null} */ (annKey.querySelector(`[data-kp-kind="${CSS.escape(focused)}"]`))?.focus();
        }
        for (const button of annKey.querySelectorAll('[data-kp-kind]')) {
            const off = kindsOff.has(button.getAttribute('data-kp-kind') ?? '');
            button.setAttribute('aria-pressed', String(!off));
            button.toggleAttribute('data-kp-off', off);
        }
        const note = annKey.querySelector('[data-kp-note="median"]');
        if (note && c.medians.length === 1) {
            const m = c.medians[0];
            const words = note.querySelector('.kp-chart__annkey-median');
            if (words) words.textContent = `${medianWords(opt)} ${fmt(m.v, 'tip')}`;
        }
    }
    /** @param {ReturnType<typeof option>} opt the words in front of a median's value */
    const medianWords = (opt) => opt.medianWords || strings.median;
    c.medianWords = medianWords;
    function buildLegend() {
        c.skeleton = false;
        legend.removeAttribute('aria-hidden');
        legend.setAttribute('aria-label', strings.sources(label()));
        plot.setAttribute('aria-label', strings.plot(label()));
        c.items = c.data.series.map((series, i) => {
            const swatch = h(doc, 'i', { class: 'kp-chart__swatch', 'aria-hidden': 'true' });
            const value = h(doc, 'b', { class: 'kp-chart__value' });
            const button = h(
                doc,
                'button',
                { type: 'button', class: 'kp-chart__source', title: strings.source(series.label) },
                swatch,
                h(doc, 'span', { class: 'kp-chart__source-label' }, series.label),
                value,
            );
            paintSeries(button, series, i);
            const isolate = (/** @type {number | null} */ v) => () => {
                c.hot = v;
                c.draw();
            };
            button.addEventListener('pointerenter', isolate(i));
            button.addEventListener('pointerleave', isolate(null));
            button.addEventListener('focus', isolate(i));
            button.addEventListener('blur', isolate(null));
            button.addEventListener('click', () => {
                setSel(toggleSource(c.sel, i, c.data.series.length));
                c.draw();
            });
            decorateWith(decorate, button, { kind: 'source', host, key: key(), index: i, label: series.label });
            return { button, value };
        });
        legend.replaceChildren(...c.items.map((it) => it.button), showAll);
    }
    /** The legend row kept for `data-kp-chart-sources` sources while loading. */
    function skeletonLegend() {
        const n = Number(host.getAttribute('data-kp-chart-sources'));
        c.skeleton = true;
        c.items = [];
        legend.setAttribute('aria-hidden', 'true');
        legend.replaceChildren(
            ...Array.from({ length: n > 1 ? Math.min(n, 50) : 0 }, () => {
                const stub = h(doc, 'span', { class: 'kp-chart__source-stub kp-skeleton kp-skeleton--block' }, '\u2007'.repeat(12));
                // A source button's height, not a block skeleton's.
                stub.style.setProperty('--kp-skeleton-block', 'auto');
                return stub;
            }),
        );
        legend.hidden = !(n > 1);
    }
    showAll.addEventListener('click', () => {
        setSel(new Set());
        c.draw();
    });
    legend.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape' || c.sel.size === 0) return;
        e.stopPropagation();
        setSel(new Set());
        c.draw();
    });
    release.addEventListener('click', () => {
        c.pinned = null;
        c.draw();
        plot.focus();
    });
}
