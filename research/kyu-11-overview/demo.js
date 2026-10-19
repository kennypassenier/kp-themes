// research/kyu-11-overview: the page's own wiring. Every component is the package's (js/auto.js attaches most of them);
// this file feeds them kyu-shaped MOCK data, presses their states and writes what they fire into a readout.

/** Resolves once js/auto.js has attached everything the page carries. */
const ready = new Promise((resolve) => {
    const done = () => document.documentElement.hasAttribute('data-kp-auto-ready');
    if (done()) return resolve(undefined);
    new MutationObserver((_, watch) => {
        if (done()) {
            watch.disconnect();
            resolve(undefined);
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
});

/** @param {string} id @returns {HTMLElement} */
const byId = (id) => /** @type {HTMLElement} */ (document.getElementById(id));
/** @param {string} selector @param {ParentNode} [root] @returns {HTMLElement[]} */
const all = (selector, root = document) => /** @type {HTMLElement[]} */ ([...root.querySelectorAll(selector)]);

/** Press one button of a group: exactly one is pressed. */
function stateButtons(attribute, apply) {
    const buttons = all(`[${attribute}]`);
    for (const button of buttons) {
        button.addEventListener('click', () => {
            pressed(attribute, button.getAttribute(attribute) ?? '');
            apply(button.getAttribute(attribute) ?? '');
        });
    }
}
/** Mark the pressed one of a group. */
function pressed(attribute, value) {
    for (const b of all(`[${attribute}]`)) b.setAttribute('aria-pressed', String(b.getAttribute(attribute) === value));
}
/** What the review dialog sets for a choice (id, value), as the section hears it. */
function onChoice(id, apply) {
    document.addEventListener('review:choice', (event) => {
        const detail = /** @type {CustomEvent} */ (event).detail;
        if (detail?.id === id) apply(String(detail.value));
    });
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

await ready;

// ── who reads what: hub and ring ────────────────────────────────────────────────────────────────────────────
if (byId('ky-graph')) {
    const { setGraphData, setGraphState, GRAPH_CHANGE_EVENT } = await import('../../js/graph.js');
    const el = byId('ky-graph');
    const stage = byId('ky-graph-stage');
    const out = byId('ky-graph-out');
    const KINDS = [
        { kind: 'active', label: 'Active', hint: 'The app is reading and acknowledging', style: 'solid', colour: 'var(--chart-1)' },
        { kind: 'flagged', label: 'Flagged', hint: 'A message died or a lease ran out on this subscription', style: 'dash', colour: 'var(--destructive)' },
        { kind: 'archived', label: 'Archived', hint: 'No longer reading; kept for its backlog', style: 'dot', colour: 'var(--muted-foreground)' },
    ];
    /** [topic, app, kind, waiting messages, note] */
    const SUBS = [
        ['notify.kenny', 'desktop', 'flagged', 142, '1 dead letter'],
        ['notify.kenny', 'phone', 'active', 12, 'caught up'],
        ['ha.events', 'kyu-runner', 'flagged', 8, '1 dead letter'],
        ['ha.events', 'archive', 'archived', 0, 'archived'],
        ['almanac.sync', 'almanac', 'flagged', 23, '1 dead letter'],
        ['almanac.sync', 'archive', 'archived', 0, 'archived'],
        ['jobtracker.mail', 'desktop', 'flagged', 57, '1 dead letter'],
        ['jobtracker.mail', 'archive', 'archived', 0, 'archived'],
        ['newsflash.items', 'phone', 'flagged', 3, 'lease expired'],
        ['newsflash.items', 'archive', 'archived', 0, 'archived'],
    ];
    let weights = false;
    let live = false;
    let state = 'ready';
    const data = () => {
        const subs = SUBS.map(([topic, app, kind, waiting, note]) => {
            const flip = live && topic === 'notify.kenny' && app === 'phone';
            return { topic, app, kind: flip ? 'flagged' : kind, waiting: flip ? 96 : waiting, note: flip ? 'lease expired' : note };
        });
        return {
            hub: 'kyu',
            kinds: KINDS,
            nodes: [
                { id: 'kyu', label: 'kyu', description: 'the message hub', weight: weights ? 1 : null },
                ...subs.map((s) => ({
                    id: `${s.topic}/${s.app}`,
                    label: `${s.topic} / ${s.app}`,
                    description: `${s.waiting} waiting, ${s.note}`,
                    weight: weights ? Math.max(0.12, s.waiting / 142) : null,
                    flag: null,
                })),
            ],
            edges: subs.map((s) => ({ from: 'kyu', to: `${s.topic}/${s.app}`, kind: s.kind, detail: `${s.waiting} waiting, ${s.note}` })),
        };
    };
    const draw = () => {
        if (state === 'ready') setGraphData(el, data());
        else if (state === 'loading') {
            // The package's own loading state: it draws the ghost of the network. Formal's decided courier's round
            // (page.css) runs on its links; the dash is measured in a hundredth of a link, so each link gets pathLength 100.
            setGraphState(el, 'loading', 'Reading the subscriptions from kyu.');
            for (const edge of all('.kp-graph__ghost .kp-graph__edge', el)) edge.setAttribute('pathLength', '100');
        } else if (state === 'empty') setGraphState(el, 'empty', 'Nothing to draw yet: no topic has a subscription.');
        else setGraphState(el, 'error', 'The subscriptions could not be read from kyu.');
        pressed('data-ky-graph-state', state);
    };
    draw();
    stateButtons('data-ky-graph-state', (v) => {
        state = v;
        draw();
    });
    byId('ky-graph-live').addEventListener('click', () => {
        live = !live;
        state = 'ready';
        draw();
    });
    el.addEventListener(GRAPH_CHANGE_EVENT, (event) => {
        const { selected, hiddenKinds } = /** @type {CustomEvent} */ (event).detail;
        const kind = (k) => KINDS.find((x) => x.kind === k)?.label ?? k;
        out.textContent =
            (selected.length ? `Picked: ${selected.join(', ')}.` : 'Nothing picked.') +
            (hiddenKinds.length ? ` Hidden: ${hiddenKinds.map(kind).join(', ')}.` : ' Every kind of link is shown.');
    });
    onChoice('graph-size', (v) => {
        weights = v === 'backlog';
        draw();
    });
}
