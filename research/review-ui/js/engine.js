// Shared engine for the three review-UI prototypes (research/review-ui/).
// Loads a research demo in an iframe, finds its open review aspects from
// its own data-review-choices (the same data the real dialog in
// research/_review/review.js reads), focuses one aspect's row, enlarges it,
// and presses the demo's own data-review-plays controls so the motion plays
// without a click. Picks are written into the SAME localStorage key the
// real review dialog uses (kp-demo-review:<demo>), so an answer produced
// here is a real answer: the real dialog, opened later, sees it too.

export const STORE_PREFIX = 'kp-demo-review:';
export const storeKey = (demo) => `${STORE_PREFIX}${demo}`;

/** The two demos this prototype round judges, and the themes named in the brief. */
export const DEMOS = [
    {
        id: 'character-trend',
        path: '../character-trend/demo.html',
        title: 'Trend tile',
        themes: ['brutalism', 'deco', 'nostromo'],
    },
    {
        id: 'character-graph',
        path: '../character-graph/demo.html',
        title: 'Network graph',
        themes: ['high-contrast', 'deco', 'grotesk', 'brutalism'],
    },
];

export function loadState(demo) {
    try {
        return JSON.parse(localStorage.getItem(storeKey(demo)) || '{}') || {};
    } catch {
        return {};
    }
}
export function saveState(demo, state) {
    try {
        localStorage.setItem(storeKey(demo), JSON.stringify(state));
    } catch {
        /* private window: the on-screen answer still has everything */
    }
}

/** Per-prototype UI state (current position, speed, pause), kept separate from the demo's own verdicts. */
export function uiState(proto) {
    try {
        return JSON.parse(localStorage.getItem(`kp-review-ui:${proto}`) || '{}') || {};
    } catch {
        return {};
    }
}
export function saveUi(proto, state) {
    try {
        localStorage.setItem(`kp-review-ui:${proto}`, JSON.stringify(state));
    } catch {
        /* ignore */
    }
}

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

import { applyTheme, currentTheme } from '../../../js/theme-core.js';

/** Switches the PROTOTYPE PAGE's own chrome to the theme being judged (loads its register first). */
export async function switchChromeTheme(theme) {
    if (currentTheme() === theme) return;
    const href = new URL(`../../../css/${theme}-register.css`, import.meta.url).href;
    if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        const loaded = new Promise((resolve) => {
            link.onload = link.onerror = resolve;
        });
        document.head.append(link);
        await loaded;
    }
    applyTheme(theme);
}

/**
 * Puts a theme back on an already-loaded frame's document, WITHOUT touching
 * localStorage. Needed because every demo frame shares one origin, so one
 * frame's `localStorage.setItem('theme', …)` fires a `storage` event in
 * every other open frame, and `js/theme-core.js`'s own cross-tab sync then
 * switches THEM to the theme that was just written — the contact sheet's
 * "every row ends up showing the last-loaded theme" bug. Each row's own
 * register stylesheet is unaffected (it was `document.write`-ten once at
 * parse time), so restoring the `data-theme` attribute alone is enough to
 * bring the row's look back in step with its own register.
 */
export function reassertTheme(doc, theme) {
    try {
        applyTheme(theme, { root: doc.documentElement });
    } catch {
        /* a frame that failed to load has no documentElement worth fixing */
    }
}

/** Waits for an iframe to finish loading its demo, then returns its document. */
export function loadFrame(frame, path, theme) {
    return new Promise((resolve) => {
        frame.addEventListener(
            'load',
            () => {
                // Two frames: module scripts have run by `load`, but let layout settle.
                requestAnimationFrame(() => requestAnimationFrame(() => resolve(frame.contentDocument)));
            },
            { once: true },
        );
        const url = new URL(path, location.href);
        url.searchParams.set('theme', theme);
        frame.src = url.href;
    });
}

const plainFixed = (theme, choice) => (typeof choice.fixed === 'object' && choice.fixed ? Boolean(choice.fixed[theme]) : Boolean(choice.fixed));

/**
 * The open aspects of a demo document, for one theme: every choice of every
 * `data-review-mode="aspects"` section that is not `once` and not settled
 * (`fixed`) for this theme — exactly what the real dialog would still ask.
 */
export function openAspects(doc, theme) {
    const out = [];
    for (const section of doc.querySelectorAll('[data-review-item]')) {
        if (section.dataset.reviewMode !== 'aspects') continue;
        let choices = [];
        try {
            choices = JSON.parse(section.dataset.reviewChoices || '[]');
        } catch {
            choices = [];
        }
        const rowsAttr = section.dataset.reviewRows;
        for (const choice of choices) {
            if (choice.once || plainFixed(theme, choice)) continue;
            out.push({
                itemId: section.dataset.reviewItem,
                itemTitle: section.dataset.reviewTitle || section.dataset.reviewItem,
                section,
                rowsAttr,
                choice,
            });
        }
    }
    return out;
}

/** The row for one aspect, and its option cells (trimmed to the choice's real option count, in order). */
export function cellsFor(aspect) {
    const { section, rowsAttr, choice } = aspect;
    const row = section.querySelector(`[${rowsAttr}="${CSS.escape(choice.id)}"]`);
    if (!row) return { row: null, cells: [], prefix: '' };
    const prefix = rowsAttr.replace(/-aspect$/, '');
    const varyAttr = `${prefix}-vary`;
    const optionAttr = `${prefix}-option`;
    const all = [...row.querySelectorAll(`[${varyAttr}="${CSS.escape(choice.id)}"]`)].sort(
        (a, b) => Number(a.getAttribute(optionAttr)) - Number(b.getAttribute(optionAttr)),
    );
    const cells = all.slice(0, choice.options.length);
    return { row, cells, prefix, optionAttr };
}

/** The demo's own buttons that play this aspect's motion (data-review-plays~="<id>"), outside the mirrored controls (there is none here). */
export function playersFor(doc, aspectId) {
    return [...doc.querySelectorAll('[data-review-plays]')].filter((b) => b.getAttribute('data-review-plays').split(/\s+/).includes(aspectId));
}

/** Clicks every player once; for "loading"/"live" that starts a loop or a one-off update the demo itself drives. */
export function play(doc, aspectId) {
    for (const b of playersFor(doc, aspectId)) b.click();
}

/** Centres the focused row's own preview (the actual component, not its label) once layout has settled — "the element central and large". */
export function settle(row) {
    const doc = row?.ownerDocument;
    if (!doc) return;
    const reset = () => {
        doc.defaultView?.scrollTo(0, 0);
        doc.documentElement.scrollTop = 0;
        doc.body.scrollTop = 0;
        window.scrollTo(0, 0); // the outer prototype page itself: a focus inside the frame can scroll IT too
    };
    reset();
    requestAnimationFrame(() => requestAnimationFrame(reset));
    setTimeout(reset, 150);
    setTimeout(reset, 500);
}

/** Presses the demo's own speed button (Full/½/¼), one of data-tr-speed / data-gr-speed / data-*-speed. */
export function setSpeed(doc, value) {
    const btn = doc.querySelector(`[data-review-controls] [data-tr-speed="${value}"], [data-review-controls] [data-gr-speed="${value}"]`);
    btn?.click();
}

/** Injects the "every page animation paused" rule used by the Pause key (P). Idempotent. */
export function setPaused(doc, paused) {
    let style = doc.getElementById('rv-engine-pause');
    if (!style) {
        style = doc.createElement('style');
        style.id = 'rv-engine-pause';
        doc.head.append(style);
    }
    style.textContent = paused ? '*, *::before, *::after { animation-play-state: paused !important; transition: none !important; }' : '';
}

/**
 * Hides everything in the section except the one aspect's row (and the
 * controls, needed so `play()` can still find and click them), the same
 * idea as review.js's focusAspect but written fresh for this engine.
 */
const FOCUS_MARK = 'data-rv-engine-off';

export function focusRow(aspect, { scale = 1.18, fill = false } = {}) {
    const { section, rowsAttr, choice } = aspect;
    const doc = section.ownerDocument;
    const body = doc.body;

    // Reset any earlier focus pass in this document.
    for (const el of doc.querySelectorAll(`[${FOCUS_MARK}]`)) {
        el.removeAttribute(FOCUS_MARK);
        el.style.removeProperty('display');
    }
    const row = section.querySelector(`[${rowsAttr}="${CSS.escape(choice.id)}"]`);
    // Walk all the way from the row up to <body>: at every level, hide every
    // sibling that is not on the row's own ancestor path, except the demo's
    // controls (play() still needs to find and click them) and its look
    // line. This also clears whatever the catalogue shell (catalogue.js)
    // wrapped the page in, since it walks the live tree, not a fixed shape.
    for (let el = row; el && el !== body; el = el.parentElement) {
        for (const sib of el.parentElement?.children ?? []) {
            if (sib === el) continue;
            if (sib.matches('[data-review-controls]') || sib.querySelector?.('[data-review-controls]')) continue;
            sib.setAttribute(FOCUS_MARK, '');
            sib.style.setProperty('display', 'none', 'important');
            sib.style.setProperty('margin', '0', 'important');
        }
    }
    if (row) {
        row.style.display = 'block';
        row.querySelector('.tr-aspect__head, .gr-aspect__head')?.setAttribute('style', 'display:none');
        const trio = row.querySelector('.tr-trio, .gr-trio');
        if (trio) {
            trio.style.display = 'flex';
            trio.style.gap = '1.25rem';
            trio.style.alignItems = 'stretch';
        }
        for (const cell of row.querySelectorAll('.tr-col, .gr-col')) {
            cell.style.flex = '1 1 0';
            cell.style.minWidth = '0'; // flex children overflow their column unless this is set — the "text runs over the next card" bug
            // The trend tile's own card is `display: grid; grid-row: span 3; grid-template-rows:
            // subgrid` (demo.css), reading row tracks from `.tr-trio`'s own grid. Turning the trio
            // into a flex container above (so one card can be hidden without leaving a gap) leaves
            // that subgrid pointing at a grid that no longer exists — every label/value/chart then
            // collapses to its bare minimum content width, wrapping one letter per line. Cancelling
            // the subgrid here (back to plain stacked rows) is what the cards actually look like.
            cell.style.gridTemplateRows = 'none';
            if (!fill) {
                cell.style.transform = `scale(${scale})`;
                cell.style.transformOrigin = 'top center';
            }
        }
        if (fill) {
            // "The element must be scaled up to use the available height, centred": a visual-only
            // transform caused the overlap (it inflates the box without the flex row giving it
            // more room), and forcing the KPI tile itself onto a flex/grid layout it does not own
            // broke it outright (its internal grid collapsed the text to one character per line).
            // So instead: centre the row vertically in the available frame height, and grow only
            // the one part of the tile that is DESIGNED to grow — the trend's own chart, through
            // its documented knob `--kp-kpi-spark-height` (css/components.css, default 2.75rem) —
            // so the card gets visibly bigger without touching its layout mode at all.
            row.style.height = '100%';
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.justifyContent = 'center';
            // The trio is a flex ITEM of `row` too, so without a width of its own, its
            // flex-basis:0 children (the cards) have nothing real to grow into and collapse to
            // their bare minimum content size — a column one character wide, wrapping every
            // letter. Pinning it to the full row width is what lets flex-grow do anything.
            if (trio) {
                trio.style.alignItems = 'stretch';
                trio.style.width = '100%';
            }
            for (const cell of row.querySelectorAll('.tr-col, .gr-col')) {
                cell.style.setProperty('--kp-kpi-spark-height', '16rem');
                cell.style.setProperty('--kp-graph-height', '26rem');
            }
        }
    }
    let style = doc.getElementById('rv-engine-focus');
    if (!style) {
        style = doc.createElement('style');
        style.id = 'rv-engine-focus';
        doc.head.append(style);
    }
    style.textContent = `
        [data-review-controls] { position: fixed !important; inset-inline-start: -9999px !important; top: 0; }
        html, body, .cat-shell, .cat-column { overflow: auto !important; background: var(--background); margin: 0 !important; padding: 0 !important; height: ${fill ? '100%' : 'auto'} !important; min-height: 0 !important; display: block !important; align-items: stretch !important; justify-content: flex-start !important; }
        main, main[class], [data-review-item], [data-ct-aspects], [data-gr-aspects] { margin: 0 !important; padding: 1rem !important; min-height: 0 !important; height: ${fill ? '100%' : 'auto'} !important; display: block !important; align-items: stretch !important; justify-content: flex-start !important; place-items: normal !important; box-sizing: border-box !important; }
        main, main * { padding-block-start: 0 !important; margin-block-start: 0 !important; }
        [data-review-item] > :first-child, [${FOCUS_MARK}] + * { padding-block-start: 0 !important; }
        [${FOCUS_MARK}] { margin: 0 !important; }
        .rv2-cell--picked { outline: 3px solid #2e7d32 !important; outline-offset: 4px; }
        .rv2-cell--only { display: none !important; }
        .rv2-cell--only.rv2-cell--shown { display: block !important; flex: 1 1 100% !important; max-width: 900px !important; margin-inline: auto !important; }
        .rv2-flip-hide { display: none !important; }
    `;
}

/** Removes the focus/enlarge rule (used when leaving a screen, not strictly needed since the frame is thrown away). */
export function unfocus(doc) {
    doc.getElementById('rv-engine-focus')?.remove();
}

/** Builds the session's task list: for each demo, each named theme, each open aspect — the atomic unit a screen judges. */
export async function buildTasks(probe) {
    const tasks = [];
    for (const demo of DEMOS) {
        for (const theme of demo.themes) {
            const doc = await loadFrame(probe, demo.path, theme);
            for (const aspect of openAspects(doc, theme)) {
                tasks.push({
                    demo: demo.id,
                    demoPath: demo.path,
                    demoTitle: demo.title,
                    theme,
                    aspectId: aspect.choice.id,
                    aspectLabel: aspect.choice.label,
                    itemId: aspect.itemId,
                    options: aspect.choice.options,
                    pairKey: `${theme}|${aspect.itemId}`,
                });
            }
        }
    }
    return tasks;
}

/** Records one task's pick ("none" + note, or an option value), in the demo's own verdict shape, and finalises the pair once every open aspect for it is answered. */
export function recordPick(task, allTasksForPair, value, note) {
    const state = loadState(task.demo);
    const entry = { ...state[task.pairKey] };
    entry.choices = { ...entry.choices };
    entry.redo = { ...entry.redo };
    if (value == null) {
        entry.redo[task.aspectId] = note || '(no note given)';
        delete entry.choices[task.aspectId];
    } else {
        entry.choices[task.aspectId] = value;
        delete entry.redo[task.aspectId];
    }
    state[task.pairKey] = entry;
    const siblings = allTasksForPair.filter((t) => t.pairKey === task.pairKey);
    const done = siblings.every((t) => entry.choices[t.aspectId] || entry.redo[t.aspectId]);
    if (done) {
        const redo = siblings.filter((t) => entry.redo[t.aspectId]);
        state[task.pairKey] = {
            ...entry,
            verdict: redo.length ? 'rejected' : 'approved',
            note: redo.map((t) => `${t.aspectLabel}: ${entry.redo[t.aspectId]}`).join(' · '),
            at: new Date().toISOString(),
        };
    }
    saveState(task.demo, state);
}

export function pickOf(task) {
    const state = loadState(task.demo);
    return state[task.pairKey]?.choices?.[task.aspectId] || '';
}
export function noneNoteOf(task) {
    const state = loadState(task.demo);
    return state[task.pairKey]?.redo?.[task.aspectId] || '';
}
export function isDone(task) {
    return Boolean(pickOf(task) || noneNoteOf(task));
}

/** The same shape of answer text review.js produces, built over the tasks this session actually judged. */
export function buildAnswer(tasks) {
    const byDemo = new Map();
    for (const t of tasks) (byDemo.get(t.demo) ?? byDemo.set(t.demo, []).get(t.demo)).push(t);
    const lines = ['Demo review · review-ui prototype session', '(aspects judged in this session only; totals are not the whole demo)'];
    for (const [demo, list] of byDemo) {
        const state = loadState(demo);
        lines.push('', `## ${demo}`);
        const picked = list.filter((t) => pickOf(t));
        const none = list.filter((t) => noneNoteOf(t));
        if (picked.length) {
            lines.push('Picked per theme:');
            for (const t of picked) {
                const value = pickOf(t);
                const label = t.options.find((o) => o.value === value)?.label || value;
                lines.push(`- ${t.theme}|${t.itemId}: ${t.aspectLabel} = ${label}`);
            }
        }
        if (none.length) {
            lines.push('None of these:');
            for (const t of none) lines.push(`- ${t.theme}|${t.itemId}: ${t.aspectLabel}: ${noneNoteOf(t)}`);
        }
        const approvedPairs = [...new Set(list.map((t) => t.pairKey))].filter((k) => state[k]?.verdict === 'approved');
        const rejectedPairs = [...new Set(list.map((t) => t.pairKey))].filter((k) => state[k]?.verdict === 'rejected');
        if (approvedPairs.length) lines.push('', `Approved in full: ${approvedPairs.join(', ')}`);
        if (rejectedPairs.length) lines.push('', 'Not approved:', ...rejectedPairs.map((k) => `- ${k}: ${state[k].note}`));
    }
    return lines.join('\n');
}
