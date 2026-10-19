// Measures, in Firefox, whether every kp data component on a page uses its standard states: Kenny, 2026-10-19 11:25, after
// the project threads built tables without the busy card and lists, graphs, cards and forms without the standard loading,
// empty and failed plates ("ik vind het ridicuul dat ik dat eigenlijk moest zeggen, we hebben zoveel tijd en moeite in die
// componenten gestoken en dan kan je ze nog niet eens met hun standaard functionaliteit implementeren?"). A written rule was
// not enough, so the rule is measured, as measure-align.mjs measures the grid.
//
// It is a measuring script, not a test. measure-gaps.mjs runs it on every page it measures (its lines start with "states"),
// and it runs on its own on any page: a review demo, or a project's own app page served locally. Two halves:
//
//  1. WIRING: the page puts its components in a state the package drew.
//     a. As the page stands: a component in loading (data-kp-state="loading" or aria-busy) shows the busy card
//        (.kp-datatable__busy-card / __busy-overlay; the calendar's and the chart's approved own pictures); one in empty
//        or error shows the package plate (.kp-stateplate); a component with no state and nothing in it (a table with no
//        rows, a graph with no nodes) is left blank, which is a fault. A hand-made substitute is a fault: a "Loading…",
//        "No data", "Could not load…" text, a table row spanning the columns with such words, a spinner of the page's
//        own or a bare .kp-spinner standing in a data area, a .kp-empty box that is not the package plate, a form whose
//        submit is not the package's (data-kp-form + data-kp-submit: busy submit, error summary).
//     b. The page's own state controls (a demo's Loading / Empty / Failed buttons): each is pressed and 1a is read again.
//     c. A page that reads its data over the network (fetch/XHR) is loaded twice more: once with every request held
//        back (each data component must show its busy card, not a blank or a hand-made text), once with every request
//        failing (each must show the failed plate).
//  2. STATES: every instance is driven into loading, empty and failed through the package's own call (the table in the
//     list below), and the drawn state is measured: the busy card is there, covers the component's data area and its
//     panel is centred on it; a plate is there, keeps the loaded footprint (js/footprint.js), covers the width and most
//     of the height, its words are centred, its title is larger than the body text, and failed has a Retry of a normal
//     button's size.
//
// Each line names the component, the section and what is missing. Exit code 1 when anything is found.
//
// Run (a static server on the repository root first, or the project's own server):
//   node research/_review/measure-states.mjs <port> <page path> [themes=formal,dark] [widths=1280,390] [--no-drive]
// A project's page: node research/_review/measure-states.mjs 8080 index.html formal 1280   (any page on 127.0.0.1:<port>)
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { readFileSync, existsSync } from 'node:fs';

/** The repository this script belongs to: a page whose package modules cannot be found is driven through its copy. */
const ROOT = fileURLToPath(new URL('../../', import.meta.url));

/** The busy card, wherever a component lays it (js/busy-card.js, js/datatable.js's overlay). */
export const BUSY = '.kp-datatable__busy-card, .kp-datatable__busy-overlay';
/** The approved own loading pictures (gates/check-busy-card.mjs OWN). */
export const OWN_BUSY = '.kp-calendar__busy, .kp-chart__state, .kp-chart__loading';
/** The package plate for empty and failed. */
export const PLATE = '.kp-stateplate';

/**
 * The data components that ship standard states, how a page wires them and how the package drives them. `drive` runs in
 * the page with the module's namespace; it is self-contained (handed over as source). `states` are the ones it has.
 * @typedef {{ name: string, host: string, module: string, wire: string, states: string[], drive: (m: any, el: HTMLElement, state: string) => unknown }} StateComponent
 * @type {StateComponent[]}
 */
export const STATE_COMPONENTS = [
    {
        name: 'datatable',
        host: '[data-kp-datatable]',
        module: 'datatable.js',
        wire: "dataTable(el).busy({ overlay: true }) (or data-kp-busy-overlay) + .state('loading'); no rows → the table's own empty plate; .fail(message)",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) => {
            const t = m.dataTable(el);
            if (!t) throw new Error('no dataTable() handle: the table is not attached by js/datatable.js');
            t.state('ready');
            if (state === 'loading') {
                t.busy({ overlay: true });
                t.state('loading');
            } else if (state === 'error') t.fail('The rows could not be read.');
            else {
                const body = el.querySelector('tbody');
                if (body) body.replaceChildren();
                t.refresh();
            }
        },
    },
    {
        name: 'graph',
        host: '[data-kp-graph]',
        module: 'graph.js',
        wire: "setGraphState(el, 'loading' | 'empty' | 'error', title, { text })",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) => m.setGraphState(el, state, state === 'empty' ? 'Nothing yet' : state === 'error' ? 'Could not read it' : ''),
    },
    {
        name: 'heat grid',
        host: '[data-kp-heat]',
        module: 'heat.js',
        wire: "setHeat(el, { state: 'loading' | 'empty' | 'error', message, skeleton })",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) =>
            m.setHeat(el, {
                columns: [],
                rows: [],
                state,
                message: state === 'empty' ? 'Nothing yet' : 'Could not read it',
            }),
    },
    {
        name: 'matrix',
        host: '[data-kp-matrix]',
        module: 'heat.js',
        wire: "setMatrix(el, { state: 'loading' | 'empty' | 'error', message })",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) => m.setMatrix(el, { state, message: state === 'empty' ? 'Nothing yet' : 'Could not read it', skeleton: 4 }),
    },
    {
        name: 'run timeline',
        host: '[data-kp-gantt]',
        module: 'gantt.js',
        wire: "setGanttState(el, 'loading' | 'empty' | 'error', title, { text })",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) => m.setGanttState(el, state, state === 'empty' ? 'Nothing ran' : state === 'error' ? 'Could not read it' : ''),
    },
    {
        name: 'week',
        host: '[data-kp-week]',
        module: 'week.js',
        wire: "setWeekState(el, 'loading' | 'empty' | 'error', title, { text })",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) => m.setWeekState(el, state, state === 'empty' ? 'Nothing planned' : state === 'error' ? 'Could not read it' : ''),
    },
    {
        name: 'uptime strip',
        host: '[data-kp-uptime]',
        module: 'uptime.js',
        wire: "setUptime(el, { label, state: 'loading' | 'empty' | 'error', count, error })",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) =>
            m.setUptime(el, {
                label: el.getAttribute('data-kp-uptime-label') ?? 'Service',
                periods: [],
                state,
                count: 30,
                error: 'Could not read it',
            }),
    },
    {
        name: 'calendar',
        host: '[data-kp-calendar]',
        module: 'calendar.js',
        wire: "setCalendarState(el, 'loading' | 'empty' | 'error', words)",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) =>
            m.setCalendarState(el, state, state === 'loading' ? '' : state === 'empty' ? 'Nothing this month' : 'Could not read it'),
    },
    {
        name: 'pipeline',
        host: '[data-kp-pipeline]',
        module: 'pipeline.js',
        wire: "setPipelineState(el, 'loading' | 'empty' | 'error', words)",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) =>
            m.setPipelineState(el, state, state === 'empty' ? 'Nothing in the pipeline' : state === 'error' ? 'Could not read it' : ''),
    },
    {
        name: 'activity feed',
        host: '[data-kp-feed]',
        module: 'feed.js',
        wire: "setFeed(el, { state: 'loading' | 'empty' | 'error', rows })",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) => m.setFeed(el, { state, rows: [] }),
    },
    {
        name: 'notices',
        host: '[data-kp-notices]',
        module: 'notices.js',
        wire: "setNotices(el, { state: 'loading' | 'empty' | 'error', items })",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) => m.setNotices(el, { state, items: [] }),
    },
    {
        name: 'log viewer',
        host: '[data-kp-logviewer]',
        module: 'logviewer.js',
        wire: "setLogViewer(el, { state: 'loading' | 'error', message })",
        states: ['loading', 'error'],
        drive: (m, el, state) => m.setLogViewer(el, { state, message: 'Could not read it' }),
    },
    {
        name: 'diff view',
        host: '[data-kp-diffview]',
        module: 'diff.js',
        wire: "setDiff(el, { state: 'loading' | 'empty' | 'error', message })",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) => m.setDiff(el, { state, message: 'Could not read it' }),
    },
    {
        name: 'checklist',
        host: '[data-kp-checklist]',
        module: 'checklist.js',
        wire: "setChecklistState(list, 'loading' | 'error' | 'ready', message); empty: setChecklistItems(list, [])",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) => (state === 'empty' ? m.setChecklistItems(el, []) : m.setChecklistState(el, state, 'Could not read it')),
    },
    {
        name: 'timers',
        host: '[data-kp-timers]',
        module: 'timer.js',
        wire: "setTimersState(list, 'loading' | 'error', message)",
        states: ['loading', 'error'],
        drive: (m, el, state) => m.setTimersState(el, state, 'Could not read it'),
    },
    {
        name: 'entity grid',
        host: '[data-kp-entity-grid]',
        module: 'entity-card.js',
        wire: "setEntityGridState(grid, 'loading' | 'empty' | 'error', { message, title })",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) => m.setEntityGridState(el, state, state === 'empty' ? { title: 'Nothing yet' } : { message: 'Could not read it' }),
    },
    {
        name: 'bullets',
        host: '[data-kp-bullets]',
        module: 'bullets.js',
        wire: "setBullets(el, { rows, state: 'loading' | 'empty' | 'error', message })",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) => m.setBullets(el, { rows: [], state, message: 'Could not read it' }),
    },
    {
        name: 'code view',
        host: '[data-kp-code]',
        module: 'code.js',
        wire: "setCode(el, { state: 'loading' | 'empty' | 'error', message })",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) => m.setCode(el, { state, message: 'Could not read it' }),
    },
    {
        name: 'gallery',
        host: '[data-kp-gallery]',
        module: 'gallery.js',
        wire: "setGallery(el, { state: 'loading' | 'empty' | 'error', items })",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) => m.setGallery(el, { state, items: [] }),
    },
    {
        name: 'runs',
        host: '[data-kp-runs]',
        module: 'runs.js',
        wire: "setRunsState(el, 'loading' | 'error', { title, text }); empty: setRuns(el, [], { reason })",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) => m.setRunsState(el, state, { title: 'Could not read it', reason: 'Nothing yet' }),
    },
    {
        name: 'dependency list',
        host: '[data-kp-deplist]',
        module: 'deplist.js',
        wire: "the handle's setState('loading' | 'empty' | 'error', { message }) (attachDeplists)",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) => {
            const handle = m.deplist?.(el) ?? m.deplistOf?.(el);
            if (!handle) throw new Error('no deplist handle exported');
            handle.setState(state, { message: 'Could not read it' });
        },
    },
    {
        name: 'request inspector',
        host: '[data-kp-requests]',
        module: 'request-inspector.js',
        wire: "setRequestsState(el, 'loading' | 'empty' | 'error', { message })",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) => {
            const set = m.setRequestsState ?? m.setRequestState;
            if (!set) throw new Error('no setRequestsState exported');
            set(el, state, { message: 'Could not read it' });
        },
    },
    {
        name: 'master-detail',
        host: '[data-kp-master-detail]',
        module: 'master-detail.js',
        wire: "setPaneState(root, 'loading' | 'empty' | 'error', { message })",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) => m.setPaneState(el, state, { message: 'Could not read it', title: 'Nothing yet' }),
    },
    {
        name: 'chart',
        host: '[data-kp-chart]:not([data-kp-chart="spark"])',
        module: 'chart.js',
        wire: 'loading: data-kp-chart-loading on the chart; error: setChartData(el, { error, series }); empty: setChartData with no points',
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) => {
            if (state === 'loading') return el.setAttribute('data-kp-chart-loading', '');
            el.removeAttribute('data-kp-chart-loading');
            return m.setChartData(
                el,
                state === 'error'
                    ? { label: 'Data', series: [], error: 'Could not read it' }
                    : { label: 'Data', series: [{ label: 'Data', points: [] }] },
            );
        },
    },
    {
        name: 'console',
        host: '[data-kp-console]',
        module: 'console.js',
        wire: "setConsole(root, { state: 'loading' | 'error', message })",
        states: ['loading', 'error'],
        drive: (m, el, state) => m.setConsole(el, { state, message: 'Could not read it' }),
    },
    {
        name: 'availability grid',
        host: '[data-kp-availability]',
        module: 'availability.js',
        wire: "setAvailability(root, { state: 'loading' | 'empty' | 'error', message })",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) => m.setAvailability(el, { state, message: 'Could not read it', people: [], columns: [] }),
    },
    {
        name: 'card',
        host: '.kp-card[data-kp-state]',
        module: 'card-state.js',
        wire: "setCardState(card, 'loading' | 'empty' | 'error' | 'ready', { words, title, text }) on a .kp-card with a .kp-card__stage",
        states: ['loading', 'empty', 'error'],
        drive: (m, el, state) =>
            m.setCardState(
                el,
                state,
                state === 'loading'
                    ? { words: 'Reading' }
                    : { title: state === 'empty' ? 'Nothing yet' : 'Could not read it', text: 'One sentence more.' },
            ),
    },
];

/**
 * In the page: tag the sections (a review demo's [data-review-item]; else the outermost <section>s; else the page) with
 * data-states-section, and return their names.
 * @returns {string[]}
 */
export function markSections() {
    const items = [...document.querySelectorAll('[data-review-item]')];
    /** @type {[Element, string][]} */
    let found = items.map((s) => [s, String(s.getAttribute('data-review-item'))]);
    if (!found.length) {
        const sections = [...document.querySelectorAll('section, [data-kp-section]')].filter(
            (s) => !s.parentElement?.closest('section, [data-kp-section]'),
        );
        found = sections.map((s, i) => {
            const h = s.querySelector('h1, h2, h3, h4');
            return [s, s.id || (h?.textContent ?? '').trim().slice(0, 40) || `section ${i + 1}`];
        });
    }
    if (!found.length) found = [[document.body, 'page']];
    const seen = new Map();
    return found.map(([el, name]) => {
        const n = seen.get(name) ?? 0;
        seen.set(name, n + 1);
        const id = n ? `${name}#${n + 1}` : name;
        el.setAttribute('data-states-section', id);
        return id;
    });
}

/**
 * In the page: the wiring faults of one section as it stands (1a). Self-contained, so it can be handed to page.evaluate.
 * @param {[string, { name: string, host: string, wire: string }[], string, string, string]} args
 *   section id, the components, BUSY, OWN_BUSY, PLATE
 * @returns {string[]}
 */
export function inspectWiring([only, comps, busySel, ownSel, plateSel]) {
    const section = document.querySelector(`[data-states-section="${CSS.escape(only)}"]`);
    if (!section) return [];
    /** @type {string[]} */
    const res = [];
    const CHROME =
        '.cat-judge, [data-review-controls], [data-review-look], .rv-block-tools, [class*="expected"], [class*="__head"] > p, .cat-intro, .kp-sr-only, [hidden], [aria-hidden="true"], dialog:not([open]), template, script, style, noscript';
    const PACKAGE_STATE = `${busySel}, ${ownSel}, ${plateSel}, .kp-skeleton, [class*="__busy"], [class*="__state"], [class*="__status"], .kp-toast, .kp-toasts, [data-kp-datatable-empty], [data-kp-datatable-status]`;
    const shown = (/** @type {Element} */ el) => {
        if (el.closest(CHROME)) return false;
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) return false;
        const cs = getComputedStyle(el);
        return cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0.05;
    };
    const visibleIn = (/** @type {Element} */ host, /** @type {string} */ sel) =>
        [...(host.matches(sel) ? [host] : []), ...host.querySelectorAll(sel)].some((e) => {
            const r = e.getBoundingClientRect();
            const cs = getComputedStyle(e);
            return r.width > 1 && r.height > 1 && cs.visibility !== 'hidden' && cs.display !== 'none';
        });
    const stateOf = (/** @type {Element} */ host) => {
        const inner = host.querySelector(
            ':scope > .kp-calendar__state[data-kp-state], .kp-calendar__state[data-kp-state], .kp-chart__state[data-kp-state]',
        );
        const plateAttr = host.getAttribute('data-kp-log-plate');
        const s =
            host.getAttribute('data-kp-state') ||
            host.getAttribute('data-kp-uptime-state') ||
            (plateAttr === 'nomatch' ? 'empty' : plateAttr) ||
            inner?.getAttribute('data-kp-state');
        if (s) return s === 'failed' ? 'error' : s;
        if (host.getAttribute('aria-busy') === 'true' || host.querySelector(':scope > [aria-busy="true"], .kp-table-wrap[aria-busy="true"]'))
            return 'loading';
        return 'ready';
    };
    /** Nothing a reader can see in the host: no text, no drawn mark. */
    const blank = (/** @type {HTMLElement} */ host) => {
        if ((host.innerText ?? '').trim()) return false;
        for (const e of host.querySelectorAll('svg, canvas, img, [class*="cell"], [class*="node"], [class*="bar"], [class*="day"], [class*="row"]')) {
            const r = e.getBoundingClientRect();
            if (r.width > 3 && r.height > 3) return false;
        }
        return true;
    };
    const hosts = /** @type {Set<Element>} */ (new Set());
    for (const c of comps) {
        for (const host of section.querySelectorAll(c.host)) {
            // An entity card's data-kp-state is its status, and a ghost card is the entity grid's own skeleton.
            if (hosts.has(host) || !shown(host) || host.matches('[data-kp-entity], .kp-card--ghost, .kp-code--cell')) continue;
            hosts.add(host);
            const h = /** @type {HTMLElement} */ (host);
            const state = stateOf(h);
            // A state drawn in a part that is not shown (the detail pane of a master-detail at a width that shows the list)
            // is the package's, out of sight; it counts as drawn.
            // A group's shared card (a group of uptime strips) stands on the group, over the host.
            const hr = h.getBoundingClientRect();
            const over = (/** @type {string} */ sel) =>
                [...document.querySelectorAll(sel)].some((e) => {
                    const r = e.getBoundingClientRect();
                    const w = Math.min(r.right, hr.right) - Math.max(r.left, hr.left);
                    const v = Math.min(r.bottom, hr.bottom) - Math.max(r.top, hr.top);
                    return w > 0 && v > 0 && w * v >= hr.width * hr.height * 0.5;
                });
            const drawnIn = (/** @type {string} */ sel) => visibleIn(h, sel) || !!h.querySelector(sel) || over(sel);
            const busy = drawnIn(busySel);
            const own = drawnIn(ownSel);
            const plate = drawnIn(plateSel);
            const label = `${c.name}`;
            // A table draws its empty plate in the slot the page authors; without one an empty table shows nothing.
            if (c.host === '[data-kp-datatable]' && !h.querySelector('[data-kp-datatable-empty]'))
                res.push(`${only}: ${label} has no empty slot ([data-kp-datatable-empty] .kp-empty): with no rows it shows nothing; add the slot`);
            if (state === 'loading' && !busy && !own)
                res.push(`${only}: ${label} is loading without the busy card in its middle; wire it: ${c.wire}`);
            // A component whose package draws no plate yet (the driven half reports that as a package finding) is not the page's fault.
            else if ((state === 'empty' || state === 'error') && !plate && !own)
                res.push(
                    `${only}: ${label} is ${state === 'error' ? 'failed' : 'empty'} without the package plate (.kp-stateplate); wire it: ${c.wire}`,
                );
            else if (state === 'ready' && !busy && !plate) {
                if (c.host === '[data-kp-datatable]') {
                    const rows = [...h.querySelectorAll('tbody tr')].filter((r) => shown(r));
                    if (!rows.length) res.push(`${only}: ${label} has no rows and no empty plate; wire it: ${c.wire}`);
                } else if (blank(h))
                    res.push(`${only}: ${label} is blank with no state (no busy card while it reads, no plate when it is empty); wire it: ${c.wire}`);
            }
        }
    }
    // Hand-made substitutes: words, spinners and empty boxes the page drew itself where a component's state belongs.
    const LOADING = /^(loading|laden|bezig met laden|fetching|please wait|even geduld)\b[^.!?]{0,30}(…|\.\.\.|\.)?$/i;
    const EMPTY =
        /^(no (data|results?|items?|rows?|entries|records)( (yet|found|to show|available))?|nothing (here|yet|to show|found|to see)|geen (data|gegevens|resultaten|items))[.!]?$/i;
    const FAILED =
        /^(error( loading| reading| fetching|:)|failed to (load|read|fetch)|could not (load|read|fetch|reach)|couldn'?t (load|read|fetch)|unable to (load|read|fetch)|something went wrong|kon niet (laden|lezen)|fout bij)\b.{0,80}$/i;
    const BARE = /^(error|failed|failure|fout|mislukt|empty|leeg)[.!]?$/i;
    const SKIP =
        'button, [role="button"], [role="tab"], [role="radio"], [role="option"], [role="menuitem"], option, select, label, legend, summary, input, textarea, code, pre, kbd, output, h1, h2, h3, h4, h5, h6, .kp-badge, .kp-segmented, [aria-pressed]';
    const DATA_AREA = `${comps.map((c) => c.host).join(', ')}, .kp-card, .kp-table-wrap, table, .kp-datatable, .kp-list, ul, ol`;
    // What a component draws inside its own host is the package's (an uptime strip's "No data yet", a step's spinner); only the
    // rows a page puts in a table's body are the page's.
    const HOSTS = comps.map((c) => c.host).join(', ');
    const packageDrawn = (/** @type {Element} */ el) => {
        const host = el.closest(HOSTS);
        if (!host) return false;
        if (host.matches('[data-kp-datatable]')) return !el.closest('tbody');
        return !host.matches('.kp-card');
    };
    for (const el of section.querySelectorAll('*')) {
        if (!shown(el) || el.closest(SKIP) || el.closest(PACKAGE_STATE) || packageDrawn(el)) continue;
        const own = [...el.childNodes]
            .filter((n) => n.nodeType === Node.TEXT_NODE)
            .map((n) => n.textContent)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
        if (own.length < 4 || own.length > 120) continue;
        const where = el.closest(DATA_AREA);
        const spans = el.closest('td[colspan], th[colspan]');
        const what = LOADING.test(own)
            ? 'loading'
            : EMPTY.test(own)
              ? 'empty'
              : FAILED.test(own)
                ? 'failed'
                : BARE.test(own) && spans
                  ? /^(empty|leeg)/i.test(own)
                      ? 'empty'
                      : 'failed'
                  : '';
        if (!what) continue;
        if (
            !where &&
            !spans &&
            !/(load|empty|error|fail|placeholder|no-?data|spinner)/i.test(`${el.className} ${el.id} ${el.parentElement?.className ?? ''}`)
        )
            continue;
        const inside = spans
            ? 'a table row spanning the columns'
            : where
              ? `${where.tagName.toLowerCase()}${where.className ? `.${String(where.className).split(' ')[0]}` : ''}`
              : 'the section';
        const fix =
            what === 'loading'
                ? "the component's own loading state (the busy card)"
                : what === 'empty'
                  ? "the component's own empty state (the package plate)"
                  : "the component's own failed state (the package plate with Retry)";
        res.push(`${only}: hand-made ${what} text "${own.slice(0, 40)}" in ${inside}; use ${fix}`);
    }
    // A spinner of the page's own (an endless animation that is not the package's), or the package spinner standing bare in a
    // data area instead of the busy card.
    // A spinner is aria-hidden as a rule, so it is looked at whether hidden from assistive technology or not.
    const drawn = (/** @type {Element} */ el) => {
        if (el.closest(CHROME.replace(', [aria-hidden="true"]', ''))) return false;
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return r.width >= 1 && r.height >= 1 && cs.visibility !== 'hidden' && cs.display !== 'none';
    };
    for (const el of section.querySelectorAll('*')) {
        if (!drawn(el) || el.closest(PACKAGE_STATE) || packageDrawn(el)) continue;
        const cs = getComputedStyle(el);
        const cls = String(el.className && typeof el.className === 'object' ? el.getAttribute('class') : el.className) || '';
        if (el.matches('.kp-spinner')) {
            if (
                el.closest(
                    'button, .kp-button, [role="button"], [class*="busy"], [class*="status"], .kp-field, .kp-secret, .kp-statusrow, .kp-connection, .kp-toast, .kp-alert, .kp-badge, .kp-tab, .kp-segmented, li, tr, [class*="step"]',
                )
            )
                continue;
            if (el.closest(DATA_AREA))
                res.push(
                    `${only}: a bare .kp-spinner in ${el.closest(DATA_AREA)?.tagName.toLowerCase()}; a data area that loads lays the busy card (its component's loading state)`,
                );
            continue;
        }
        const endless = cs.animationName !== 'none' && cs.animationIterationCount.split(',').includes('infinite');
        if (!endless) continue;
        // The package's own keyframes (a theme's loading signature on a card) are the package's state.
        if (cs.animationName.split(',').every((n) => n.trim().startsWith('kp-'))) continue;
        const pkg = cls.split(/\s+/).filter(Boolean);
        if (pkg.length && pkg.every((c) => c.startsWith('kp-'))) continue;
        if (!/(spin|load|busy|wait|throb)/i.test(`${cls} ${cs.animationName}`)) continue;
        if (el.closest('[class^="kp-"], [class*=" kp-"]') && !el.closest(DATA_AREA)) continue;
        res.push(
            `${only}: a spinner of the page's own (${el.tagName.toLowerCase()}.${pkg[0] ?? ''}, animation ${cs.animationName}); a data area that loads lays the busy card`,
        );
    }
    // An empty box the page built itself: .kp-empty without the plate, and not a part a component drew (kp-<component>__…).
    for (const el of section.querySelectorAll('.kp-empty:not(.kp-stateplate):not([data-kp-datatable-empty])')) {
        if (!shown(el)) continue;
        if ([...el.classList].some((c) => /^kp-[a-z-]+__/.test(c))) continue;
        res.push(
            `${only}: a hand-made empty box (.kp-empty without .kp-stateplate: not centred, not at heading size); use the component's empty state or statePlate(document, { kind: 'empty', title })`,
        );
    }
    // A form with a submit that is not the package's form: no busy submit, no error summary.
    for (const f of section.querySelectorAll('form')) {
        if (!shown(f) || f.getAttribute('method') === 'dialog' || f.matches('[role="search"]') || f.closest('[role="search"]')) continue;
        const submit = f.querySelector('button[type="submit"], button:not([type]), input[type="submit"]');
        if (!submit) continue;
        const fields = f.querySelectorAll('input:not([type="hidden"]):not([type="search"]), select, textarea');
        if (fields.length < 1) continue;
        const name = f.getAttribute('aria-label') || f.id || (f.querySelector('legend, h2, h3')?.textContent ?? '').trim().slice(0, 30) || 'form';
        if (!f.matches('[data-kp-form]'))
            res.push(
                `${only}: form "${name}" with a submit is not the package form (data-kp-form, data-kp-submit, data-kp-form-summary): no busy submit, no failed summary`,
            );
        else {
            if (!f.querySelector('[data-kp-submit]'))
                res.push(`${only}: form "${name}" has no data-kp-submit: its submit shows no busy state while it sends`);
            if (!f.querySelector('[data-kp-form-summary]'))
                res.push(`${only}: form "${name}" has no data-kp-form-summary: a failed submit has nowhere to say why`);
        }
    }
    return [...new Set(res)];
}

/**
 * In the page: the page's own state controls in one section (a demo's Loading / Empty / Failed buttons), tagged with
 * data-states-press so node can press them in turn.
 * @param {string} only
 * @returns {{ key: string, state: string, label: string }[]}
 */
export function stateControls(only) {
    const section = document.querySelector(`[data-states-section="${CSS.escape(only)}"]`);
    if (!section) return [];
    const WORD = /** @type {Record<string, string>} */ ({
        loading: 'loading',
        empty: 'empty',
        error: 'error',
        failed: 'error',
        fail: 'error',
        'no data': 'empty',
        norows: 'empty',
        'no rows': 'empty',
    });
    const out = [];
    let n = 0;
    for (const b of section.querySelectorAll('button, [role="radio"], input[type="radio"]')) {
        // A demo's state buttons stand in [data-review-controls] (the component's toolbar); the verdict machinery does not.
        if (b.closest('.cat-judge, .rv-block-tools')) continue;
        const attrs = [...b.attributes].filter((a) => a.name.startsWith('data-') || a.name === 'value');
        const hit = attrs.find((a) => WORD[a.value.toLowerCase().trim()]);
        const text = (b.textContent ?? '').toLowerCase().trim();
        const state = hit ? WORD[hit.value.toLowerCase().trim()] : WORD[text];
        if (!state) continue;
        const key = `${only}::${n++}`;
        b.setAttribute('data-states-press', key);
        // What to press afterwards to give the page its data back: the button of the same group that was pressed at load.
        const group = hit ? [...section.querySelectorAll(`[${hit.name}]`)] : [...(b.parentElement?.querySelectorAll('button') ?? [])];
        const back = group.find((g) => g !== b && g.getAttribute('aria-pressed') === 'true');
        if (back) back.setAttribute('data-states-back', key);
        out.push({ key, state, label: (b.textContent ?? '').trim() || state, back: !!back });
    }
    return out;
}

/**
 * In the page: tag every instance of the components with data-states-i and return what node needs to drive it.
 * @param {{ name: string, host: string }[]} comps
 */
export function listInstances(comps) {
    const out = [];
    const seen = new Set();
    for (const [ci, c] of comps.entries())
        for (const host of document.querySelectorAll(c.host)) {
            if (
                seen.has(host) ||
                host.matches('[data-kp-entity], .kp-card--ghost, .kp-code--cell') ||
                host.closest('.cat-judge, [data-review-controls], template, dialog:not([open])')
            )
                continue;
            const r = host.getBoundingClientRect();
            if (r.width < 1 || r.height < 1) continue;
            seen.add(host);
            const i = out.length;
            host.setAttribute('data-states-i', String(i));
            const section = host.closest('[data-states-section]')?.getAttribute('data-states-section') ?? 'page';
            out.push({ i, ci, section });
        }
    return out;
}

/**
 * In the page: where the package's modules are served (the folder holding js/), read from the scripts the page loaded.
 * @returns {string | null}
 */
export function packageBase() {
    const names = [
        ...performance.getEntriesByType('resource').map((e) => e.name),
        ...[...document.querySelectorAll('script[src]')].map((s) => /** @type {HTMLScriptElement} */ (s).src),
    ];
    const hit = names.find((n) => /\/js\/(auto|components|datatable|busy-card|state-plate|card-state|heat|graph)\.js(\?|$)/.test(n));
    return hit ? hit.replace(/js\/[^/]+$/, '') : null;
}

/**
 * In the page: measure one instance after it was driven into a state (2).
 * @param {[number, string, string, number, number, string, string, string]} args
 *   instance, state, the component's name, the loaded height (0: not known), the max hold in px, BUSY, OWN_BUSY, PLATE
 * @returns {string[]}
 */
export function measureDriven([i, state, name, readyH, maxHold, busySel, ownSel, plateSel]) {
    const host = /** @type {HTMLElement | null} */ (document.querySelector(`[data-states-i="${i}"]`));
    if (!host) return [];
    const section = host.closest('[data-states-section]')?.getAttribute('data-states-section') ?? 'page';
    const at = `${section}: ${name}`;
    /** @type {string[]} */
    const res = [];
    const vis = (/** @type {Element} */ e) => {
        const r = e.getBoundingClientRect();
        const cs = getComputedStyle(e);
        return r.width > 1 && r.height > 1 && cs.visibility !== 'hidden' && cs.display !== 'none';
    };
    const H = host.getBoundingClientRect();
    // A state stands in the host, or (a group's shared card, a dialog stage) over it: any one covering half of it counts.
    const find = (/** @type {string} */ sel) =>
        [...(host.matches(sel) ? [host] : []), ...host.querySelectorAll(sel)].find(vis) ??
        [...document.querySelectorAll(sel)].find((e) => {
            if (!vis(e)) return false;
            const r = e.getBoundingClientRect();
            const w = Math.min(r.right, H.right) - Math.max(r.left, H.left);
            const h = Math.min(r.bottom, H.bottom) - Math.max(r.top, H.top);
            return w > 0 && h > 0 && w * h >= H.width * H.height * 0.5;
        });
    // The area a state covers: a card's stage (its header and foot stay), else the host.
    // A master-detail's state stays in its detail pane while its list has items to pick from (js/master-detail.js: data-kp-state-wide
    // covers the whole).
    const area = /** @type {HTMLElement} */ (
        (host.matches('.kp-card') && host.querySelector('.kp-card__stage')) ||
        (host.matches('[data-kp-master-detail]') && !host.hasAttribute('data-kp-state-wide') && host.querySelector('.kp-pane__detail')) ||
        host
    );
    const A = area.getBoundingClientRect();
    const cs = getComputedStyle(area);
    const innerW = area.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    if (readyH > 0 && state !== 'loading') {
        const need = Math.min(readyH, maxHold) - 8;
        if (H.height < need)
            res.push(
                `${at} ${state === 'error' ? 'failed' : state} is ${H.height.toFixed(0)}px high, its loaded footprint is ${need.toFixed(0)}px (js/footprint.js holds it)`,
            );
    }
    if (state === 'loading') {
        const card = find(busySel);
        if (!card) {
            if (find(ownSel) || host.querySelector(`${busySel}, ${ownSel}`)) return res;
            res.push(`${at} loading shows no busy card`);
            return res;
        }
        const L = card.getBoundingClientRect();
        if (L.width < innerW * 0.5) res.push(`${at} loading: the busy card is ${L.width.toFixed(0)}px wide over a ${innerW.toFixed(0)}px component`);
        if (L.height < Math.min(A.height * 0.4, 120))
            res.push(`${at} loading: the busy card is ${L.height.toFixed(0)}px high over a ${A.height.toFixed(0)}px data area`);
        const panel = card.querySelector('.kp-datatable__busy-panel');
        if (!panel || !vis(panel)) res.push(`${at} loading: the busy card has no panel (spinner and words)`);
        else {
            // The part of the card on screen and inside the host is what the panel is centred in.
            const top = Math.max(L.top, 0);
            const bottom = Math.min(L.bottom, vh);
            const left = Math.max(L.left, 0);
            const right = Math.min(L.right, vw);
            const P = panel.getBoundingClientRect();
            const dx = (P.left + P.right) / 2 - (left + right) / 2;
            const dy = (P.top + P.bottom) / 2 - (top + bottom) / 2;
            if (Math.abs(dx) > 3 || (bottom - top > P.height + 8 && Math.abs(dy) > 3 && top === L.top && bottom === L.bottom))
                res.push(`${at} loading: the busy panel is off centre by ${dx.toFixed(1)}, ${dy.toFixed(1)} px`);
        }
        return res;
    }
    const plate = find(plateSel);
    if (!plate) {
        if (find(ownSel) || host.querySelector(plateSel)) return res;
        res.push(`${at} ${state === 'error' ? 'failed' : state} shows no package plate (.kp-stateplate)`);
        return res;
    }
    // A plate without a ground of its own (an empty plate a theme draws bare) is the box that holds it alone: what it is
    // centred in and what it fills.
    const ground = (/** @type {Element} */ e) => {
        const g = getComputedStyle(e);
        return (
            !/rgba\(0, 0, 0, 0\)|transparent/.test(g.backgroundColor) ||
            g.backgroundImage !== 'none' ||
            parseFloat(g.borderTopWidth) > 0 ||
            parseFloat(g.borderLeftWidth) > 0
        );
    };
    let box = /** @type {Element} */ (plate);
    while (
        !ground(box) &&
        box !== area &&
        box.parentElement &&
        host.contains(box.parentElement) &&
        [...box.parentElement.children].filter(vis).length === 1
    )
        box = box.parentElement;
    const P = box.getBoundingClientRect();
    if (P.width < innerW * 0.85)
        res.push(`${at} ${state === 'error' ? 'failed' : state}: the plate is ${P.width.toFixed(0)}px wide in a ${innerW.toFixed(0)}px component`);
    if (P.height < Math.min(A.height * 0.5, 160))
        res.push(`${at} ${state === 'error' ? 'failed' : state}: the plate is ${P.height.toFixed(0)}px high in a ${A.height.toFixed(0)}px data area`);
    // Its words centred: the union of what it holds against its own box.
    const parts = [...plate.children].filter(vis).map((c) => c.getBoundingClientRect());
    if (parts.length) {
        const u = {
            left: Math.min(...parts.map((r) => r.left)),
            right: Math.max(...parts.map((r) => r.right)),
            top: Math.min(...parts.map((r) => r.top)),
            bottom: Math.max(...parts.map((r) => r.bottom)),
        };
        const pcs = getComputedStyle(box);
        const inner = {
            left: P.left + parseFloat(pcs.borderLeftWidth) + parseFloat(pcs.paddingLeft),
            right: P.right - parseFloat(pcs.borderRightWidth) - parseFloat(pcs.paddingRight),
            top: P.top + parseFloat(pcs.borderTopWidth) + parseFloat(pcs.paddingTop),
            bottom: P.bottom - parseFloat(pcs.borderBottomWidth) - parseFloat(pcs.paddingBottom),
        };
        const dx = (u.left + u.right) / 2 - (inner.left + inner.right) / 2;
        const dy = (u.top + u.bottom) / 2 - (inner.top + inner.bottom) / 2;
        if (Math.abs(dx) > 4 || (P.bottom <= vh && Math.abs(dy) > 4))
            res.push(`${at} ${state === 'error' ? 'failed' : state}: the words are off the plate's centre by ${dx.toFixed(1)}, ${dy.toFixed(1)} px`);
    }
    const title = plate.querySelector('.kp-stateplate__title, .kp-empty__title');
    if (!title)
        res.push(
            `${at} ${state === 'error' ? 'failed' : state}: the plate has no title (.kp-stateplate__title, or .kp-empty__title in a table's empty slot)`,
        );
    else {
        const body = parseFloat(getComputedStyle(plate.querySelector('.kp-stateplate__text') ?? host).fontSize);
        const fs = parseFloat(getComputedStyle(title).fontSize);
        if (fs < body * 1.1)
            res.push(
                `${at} ${state === 'error' ? 'failed' : state}: the title is ${fs.toFixed(1)}px, not at heading size (body ${body.toFixed(1)}px)`,
            );
    }
    if (state === 'error') {
        const retry = /** @type {HTMLElement | null} */ (plate.querySelector('.kp-stateplate__action, button'));
        if (!retry || !vis(retry)) res.push(`${at} failed: the plate has no Retry`);
        else {
            const probe = document.createElement('button');
            probe.type = 'button';
            probe.className = 'kp-button';
            probe.textContent = retry.textContent;
            probe.style.cssText = 'position:absolute;visibility:hidden;left:0;top:0';
            (plate.parentElement ?? document.body).append(probe);
            const want = probe.getBoundingClientRect();
            probe.remove();
            const got = retry.getBoundingClientRect();
            if (Math.abs(got.height - want.height) > 1.5 || got.width < want.width - 2)
                res.push(
                    `${at} failed: the Retry is ${got.width.toFixed(0)}×${got.height.toFixed(0)}px, a normal button is ${want.width.toFixed(0)}×${want.height.toFixed(0)}px`,
                );
        }
    }
    return res;
}

/**
 * A read of the page's data: a fetch or XHR that is not a file of the page itself or of the review kit (the kit reads its
 * update.json, the verdicts and the Agenda index; a demo reads its own sample modules).
 * @param {import('playwright-core').Request} r
 */
export function isDataRead(r) {
    const t = r.resourceType();
    if (t !== 'fetch' && t !== 'xhr') return false;
    const path = new URL(r.url()).pathname;
    if (/\.(html?|css|m?js|md|map|woff2?|svg|png)$/i.test(path)) return false;
    if (/\/catalogue\/|\/(update|VERDICTS|decided|verdicts)\.json$/.test(path)) return false;
    return true;
}

/** The components as the page needs them (no functions). */
const PLAIN = STATE_COMPONENTS.map(({ name, host, wire }) => ({ name, host, wire }));

/**
 * Wait until a page has settled: js/auto.js done (when the page uses it) and a moment for what arrives.
 * @param {import('playwright-core').Page} page
 */
async function settle(page, ms = 1500) {
    await page.waitForFunction(() => document.readyState === 'complete', null, { timeout: 15000 }).catch(() => undefined);
    await page.waitForTimeout(ms);
}

/**
 * Measure one page in one theme and width: every half above. Lines are without the "states" prefix.
 * @param {import('playwright-core').Browser} browser
 * @param {string} url the full address (theme already in it)
 * @param {{ width: number, drive?: boolean, network?: boolean }} options
 * @returns {Promise<string[]>}
 */
export async function measureStatesAt(browser, url, { width, drive = true, network = true }) {
    /** @type {string[]} */
    const out = [];
    const open = async () => {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        /** @type {string[]} */
        const reads = [];
        page.on('request', (r) => {
            if (isDataRead(r)) reads.push(r.url());
        });
        const response = await page.goto(url);
        if (!response || !response.ok()) throw new Error(`${url} answered ${response ? response.status() : 'nothing'}`);
        await settle(page);
        return { page, reads };
    };
    const sectionsOf = async (/** @type {import('playwright-core').Page} */ page) => page.evaluate(markSections);
    const wiring = async (/** @type {import('playwright-core').Page} */ page, /** @type {string[]} */ ids, /** @type {string} */ when) => {
        for (const id of ids) {
            const lines = await page.evaluate(
                inspectWiring,
                /** @type {[string, any, string, string, string]} */ ([id, PLAIN, BUSY, OWN_BUSY, PLATE]),
            );
            for (const l of lines) out.push(when ? `${l} (${when})` : l);
        }
    };

    // 1a and 1b on one load.
    const { page, reads } = await open();
    const ids = await sectionsOf(page);
    await wiring(page, ids, '');
    const said = new Set();
    for (const id of ids) {
        const controls = await page.evaluate(stateControls, id);
        for (const c of controls) {
            await page.evaluate((k) => {
                const b = /** @type {HTMLElement | null} */ (document.querySelector(`[data-states-press="${k}"]`));
                b?.scrollIntoView({ block: 'center', behavior: 'instant' });
                b?.click();
            }, c.key);
            await page.waitForTimeout(700);
            const lines = await page.evaluate(
                inspectWiring,
                /** @type {[string, any, string, string, string]} */ ([id, PLAIN, BUSY, OWN_BUSY, PLATE]),
            );
            // A fault the page already had as it stood is said once, not again after every press.
            for (const l of lines)
                if (!out.includes(l) && !said.has(l)) {
                    said.add(l);
                    out.push(`${l} (after pressing "${c.label}")`);
                }
            if (c.back) {
                await page.evaluate((k) => /** @type {HTMLElement | null} */ (document.querySelector(`[data-states-back="${k}"]`))?.click(), c.key);
                await page.waitForTimeout(300);
            }
        }
    }
    await page.close();

    // 1c: a page that reads over the network, with its reads held back, then failing.
    if (network && reads.length) {
        for (const mode of ['held', 'failing']) {
            const p = await browser.newPage({ viewport: { width, height: 900 } });
            await p.route('**/*', (route) => {
                if (!isDataRead(route.request())) return route.fallback();
                if (mode === 'failing') return route.fulfill({ status: 503, body: 'unavailable' });
                return undefined; // held: never answered
            });
            await p.goto(url, { waitUntil: 'domcontentloaded' }).catch(() => undefined);
            await p.waitForTimeout(2500);
            const pids = await p.evaluate(markSections);
            for (const id of pids) {
                const lines = await p.evaluate(
                    inspectWiring,
                    /** @type {[string, any, string, string, string]} */ ([id, PLAIN, BUSY, OWN_BUSY, PLATE]),
                );
                for (const l of lines) out.push(`${l} (data ${mode === 'held' ? 'held back' : 'failing'})`);
                // Held back, every data component must be loading; failing, every one must be failed.
                const want = mode === 'held' ? 'loading' : 'error';
                const quiet = await p.evaluate(([sid, comps, w, busySel, plateSel, ownSel]) => {
                    const section = document.querySelector(`[data-states-section="${CSS.escape(sid)}"]`);
                    const res = [];
                    for (const c of comps)
                        for (const host of section?.querySelectorAll(c.host) ?? []) {
                            const r = host.getBoundingClientRect();
                            if (r.width < 1 || r.height < 1) continue;
                            // A calendar's own busy card (.kp-calendar--busy-whole) and a chart's own state are the approved pictures, as in the wiring half.
                            const has = host.querySelector(w === 'loading' ? `${busySel}, ${ownSel}` : plateSel);
                            if (!has)
                                res.push(
                                    `${sid}: ${c.name} shows no ${w === 'loading' ? 'busy card while its data is held back' : 'failed plate while its data fails'}; wire it: ${c.wire}`,
                                );
                        }
                    return res;
                }, /** @type {[string, any, string, string, string, string]} */ ([id, PLAIN, want, BUSY, PLATE, OWN_BUSY]));
                out.push(...quiet);
            }
            await p.close();
        }
    }

    // 2: drive every instance through the package.
    if (drive) {
        const { page: d } = await open();
        await d.evaluate(markSections);
        const base = await d.evaluate(packageBase);
        let prefix = base;
        if (!prefix) {
            // The page bundles the package: drive it through this repository's copy, served under a private path.
            prefix = new URL('/__kp-states__/', url).href;
            await d.route('**/__kp-states__/**', (route) => {
                const rel = new URL(route.request().url()).pathname.replace(/^.*\/__kp-states__\//, '');
                const file = `${ROOT}${rel}`;
                if (!existsSync(file)) return route.fulfill({ status: 404, body: '' });
                return route.fulfill({ status: 200, contentType: 'text/javascript', body: readFileSync(file, 'utf8') });
            });
        }
        const maxHold = await d.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize) * 48);
        const instances = await d.evaluate(listInstances, PLAIN);
        for (const inst of instances) {
            const comp = STATE_COMPONENTS[inst.ci];
            try {
                const readyH = await d.evaluate((i) => {
                    const host = /** @type {HTMLElement | null} */ (document.querySelector(`[data-states-i="${i}"]`));
                    // A component an earlier one's state redrew (its host replaced) is not there any more.
                    if (!host) return -1;
                    host.scrollIntoView({ block: 'start', behavior: 'instant' });
                    const st = host.getAttribute('data-kp-state');
                    return !st || st === 'ready' ? host.getBoundingClientRect().height : 0;
                }, inst.i);
                if (readyH < 0) continue;
                for (const state of comp.states) {
                    const err = await d.evaluate(
                        async ([i, src, mod, s]) => {
                            try {
                                const m = await import(mod);
                                const host = /** @type {HTMLElement | null} */ (document.querySelector(`[data-states-i="${i}"]`));
                                if (!host) return 'gone';
                                // eslint-disable-next-line no-eval
                                await (0, eval)(`(${src})`)(m, host, s);
                                return '';
                            } catch (e) {
                                return e instanceof Error ? e.message : String(e);
                            }
                        },
                        /** @type {[number, string, string, string]} */ ([inst.i, comp.drive.toString(), `${prefix}js/${comp.module}`, state]),
                    );
                    if (err === 'gone') break;
                    if (err) {
                        out.push(`${inst.section}: ${comp.name} could not be driven into ${state} through the package (${err})`);
                        break;
                    }
                    await d.waitForTimeout(600);
                    // The plate's own entrance (an art plate's runs longer than the settle window) is waited for, never shortened:
                    // every finite animation in the host and over it must have finished before it is measured [states-two-1019].
                    await d.evaluate(async (i) => {
                        const host = document.querySelector(`[data-states-i="${i}"]`);
                        if (!host) return;
                        const finite = [...host.getAnimations({ subtree: true }), ...document.getAnimations().filter((a) => {
                            const t = /** @type {Element | null} */ (/** @type {any} */ (a.effect)?.target ?? null);
                            return t && !host.contains(t) && t.closest('.kp-datatable__busy-card, .kp-stateplate, [data-kp-state-covered]') && host.getBoundingClientRect().height > 0;
                        })].filter((a) => Number.isFinite(a.effect?.getComputedTiming().endTime ?? Infinity));
                        await Promise.race([Promise.allSettled(finite.map((a) => a.finished)), new Promise((r) => setTimeout(r, 6000))]);
                    }, inst.i);
                    const lines = await d.evaluate(
                        measureDriven,
                        /** @type {[number, string, string, number, number, string, string, string]} */ ([
                            inst.i,
                            state,
                            comp.name,
                            readyH,
                            maxHold,
                            BUSY,
                            OWN_BUSY,
                            PLATE,
                        ]),
                    );
                    out.push(...lines.map((l) => `${l} (driven)`));
                }
            } catch (e) {
                out.push(`${inst.section}: ${comp.name} could not be measured (${e instanceof Error ? e.message.split('\n')[0] : e})`);
            }
        }
        await d.close();
    }
    return [...new Set(out)];
}

async function main() {
    const require = createRequire('/home/kenny/Projects/kp-themes/node_modules/');
    const { firefox } = require('playwright-core');
    const args = process.argv.slice(2);
    const drive = !args.includes('--no-drive');
    const [port, path, themeArg = 'formal,dark', widthArg = '1280,390'] = args.filter((a) => !a.startsWith('--'));
    if (!port || !path) {
        console.error('usage: node research/_review/measure-states.mjs <port> <page path> [themes] [widths] [--no-drive]');
        process.exit(2);
    }
    const browser = await firefox.launch({ executablePath: `${process.env.HOME}/.cache/ms-playwright/firefox-1538/firefox/firefox` });
    let found = 0;
    for (const width of widthArg.split(',').map(Number))
        for (const theme of themeArg.split(',')) {
            const sep = path.includes('?') ? '&' : '?';
            let lines;
            try {
                lines = await measureStatesAt(browser, `http://127.0.0.1:${port}/${path}${sep}theme=${theme}`, { width, drive });
            } catch (e) {
                console.error(`${path}: ${e instanceof Error ? e.message : e}; is the server on port ${port}?`);
                process.exit(2);
            }
            found += lines.length;
            console.log(`${theme} ${width}: ${lines.length ? `${lines.length} state fault(s)` : 'clear'}`);
            for (const l of lines) console.log(`  states ${l}`);
        }
    await browser.close();
    process.exit(found ? 1 : 0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
