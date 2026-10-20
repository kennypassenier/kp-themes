// research/graph-1020: the page's own wiring. The graphs are the package's (attached by js/auto.js from data-kp-graph); this file gives each
// the homelab's real stacks and wires the controls of each section by its own elements. The options are the graph's own attributes, set with
// setGraphOptions(), so switching one is the same thing a page does in markup.

import {
    GRAPH_DETAIL_EVENT,
    GRAPH_RETRY_EVENT,
    graphDetail,
    graphSelect,
    graphZoom,
    setGraphData,
    setGraphOptions,
    setGraphState,
} from '../../js/graph.js';

const $ = (/** @type {string} */ id) => /** @type {HTMLElement} */ (document.getElementById(id));

/** Resolves once js/auto.js has attached everything the page carries. */
const ready = document.documentElement.hasAttribute('data-kp-auto-ready')
    ? Promise.resolve()
    : new Promise((resolve) => {
          new MutationObserver((_, watch) => {
              if (document.documentElement.hasAttribute('data-kp-auto-ready')) {
                  watch.disconnect();
                  resolve(undefined);
              }
          }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-kp-auto-ready'] });
      });

/** Each control group is a set of buttons with `data-pg="<group>"`; a press sets aria-pressed in its group and calls the group's handler. */
/** @type {Record<string, (value: string, button: HTMLElement) => void>} */
const HANDLERS = {};
document.addEventListener('click', (event) => {
    const button = event.target instanceof Element ? /** @type {HTMLElement | null} */ (event.target.closest('button[data-pg]')) : null;
    if (!button) return;
    const handler = HANDLERS[button.dataset.pg ?? ''];
    if (!handler) return;
    for (const other of button.parentElement?.querySelectorAll('button[data-pg]') ?? []) other.setAttribute('aria-pressed', String(other === button));
    handler(button.dataset.value ?? '', button);
});
/** @param {string} name @param {(value: string, button: HTMLElement) => void} handler */
const on = (name, handler) => {
    HANDLERS[name] = handler;
};

// ---------------------------------------------------------------- the homelab's stacks (mock, in the shapes the Map reads)
/** [id, name, long name, what it is, hue, traffic share] */
const STACKS = [
    ['gateway', 'gateway', 'gateway-and-certificates', 'The front door: every web address goes through it', 215, 0.9],
    ['admin', 'admin', 'admin-dashboard-and-api', 'The dashboard you are looking at', 265, 0.3],
    ['almanac', 'almanac', 'almanac-calendar-hub', 'Calendar events and reminders', 330, 0.2],
    ['downloader', 'downloader', 'downloader-with-vpn-tunnel', 'Fetches new media through a tunnel', 25, 0.7],
    ['inbox', 'inbox', 'inbox-mail-and-notices', 'Incoming mail and notices', 175, 0.15],
    ['kyu', 'kyu', 'kyu-message-hub', 'The message hub between the apps', 300, 0.35],
    ['media', 'media', 'media-library-and-player', 'Jellyfin and its library', 140, 1],
    ['metrics', 'metrics', 'metrics-and-alerting', 'Prometheus and its exporters', 60, 0.4],
    ['paperwork', 'paperwork', 'paperwork-scans-and-archive', 'Scans and documents', 95, 0.1],
    ['productivity', 'productivity', 'productivity-notes-and-tasks', 'Tasks and notes', 355, 0.5],
    ['registry', 'registry', 'registry-for-private-images', 'The private image store', 240, 0.25],
    ['syncthing', 'syncthing', 'syncthing-file-sync', 'File sync between devices', 195, 0.05],
];
const OUTSIDE = [
    ['router', '192.168.1.1', 'An address outside the fleet: the router'],
    ['dns', '1.1.1.1', 'An address outside the fleet: a public name server'],
];
const KINDS = [
    { kind: 'route', label: 'gateway route to a backend', hint: 'The gateway forwards a hostname to this stack', style: /** @type {const} */ ('solid'), colour: 'var(--chart-1)' },
    { kind: 'declared', label: 'declared, firewall enforced', hint: "A connection a stack's firewall rules allow, and the host enforces", style: /** @type {const} */ ('dash'), colour: 'var(--chart-2)' },
    { kind: 'planned', label: 'declared, firewall not on yet', hint: 'A connection a stack declares, on a stack whose firewall is not switched on', style: /** @type {const} */ ('dot'), colour: 'var(--chart-3)' },
    { kind: 'named', label: 'address named in a stack file', hint: "An address a stack's own files name, outside any firewall rule", style: /** @type {const} */ ('long-dash'), colour: 'var(--chart-4)' },
];
/** @type {[string, string, string, ('both')?][]} */
const LINKS = [
    ['gateway', 'media', 'route'],
    ['gateway', 'productivity', 'route'],
    ['gateway', 'downloader', 'route'],
    ['gateway', 'admin', 'route'],
    ['gateway', 'syncthing', 'route'],
    ['gateway', 'paperwork', 'route'],
    ['gateway', 'kyu', 'route'],
    ['gateway', 'almanac', 'route'],
    ['downloader', 'media', 'declared'],
    ['kyu', 'almanac', 'declared', 'both'],
    ['inbox', 'kyu', 'declared'],
    ['productivity', 'kyu', 'declared'],
    ['admin', 'registry', 'declared'],
    ['metrics', 'admin', 'declared'],
    ['paperwork', 'syncthing', 'planned'],
    ['syncthing', 'media', 'planned'],
    ['almanac', 'kyu', 'planned'],
    ['downloader', 'dns', 'named'],
    ['gateway', 'router', 'named'],
    ['metrics', 'router', 'named'],
];

/** @param {{ long?: boolean, own?: boolean, traffic?: boolean }} [shape] */
function network({ long = false, own = false, traffic = false } = {}) {
    return {
        hub: 'gateway',
        nodes: [
            ...STACKS.map(([id, name, longName, description, hue, share]) => ({
                id,
                label: long ? longName : name,
                description,
                hue,
                ...(own ? { colour: `hsl(${hue} 62% 46%)` } : {}),
                ...(traffic ? { weight: share } : {}),
            })),
            ...OUTSIDE.map(([id, label, description]) => ({ id, label, description, external: true })),
        ],
        edges: LINKS.map(([from, to, kind, both]) => ({ from, to, kind, detail: KINDS.find((k) => k.kind === kind)?.label ?? kind, ...(both ? { arrows: /** @type {const} */ ('both') } : {}) })),
        kinds: KINDS,
    };
}

/** @param {string} id */
const graph = (id) => $(id);
/** @type {Record<string, { long?: boolean, own?: boolean, traffic?: boolean }>} */
const SHAPES = {};
/** Draw a graph with its section's current shape; `change` adds to it. @param {string} id @param {{ long?: boolean, own?: boolean, traffic?: boolean }} [change] */
function draw(id, change = {}) {
    SHAPES[id] = { ...SHAPES[id], ...change };
    setGraphData(graph(id), network(SHAPES[id]));
}

// ---------------------------------------------------------------- labels-below
on('lab-place', (value) => setGraphOptions(graph('gp-labels'), { labels: value === 'below' ? 'below' : null }));
on('lab-names', (value) => draw('gp-labels', { long: value === 'long' }));

// ---------------------------------------------------------------- chrome-inside
on('chr-place', (value) => setGraphOptions(graph('gp-chrome'), { chrome: value === 'inside' ? 'inside' : null }));
on('chr-pick', (value) => graphSelect(graph('gp-chrome'), value === 'two' ? ['media', 'downloader'] : []));

// ---------------------------------------------------------------- fixed-colour
on('col-mode', (value) => setGraphOptions(graph('gp-colour'), { colour: value === 'fixed' ? 'fixed' : null }));
on('col-own', (value) => draw('gp-colour', { own: value === 'own' }));
on('col-theme', (value) => $('gp-colour-card').setAttribute('data-theme', value));

// ---------------------------------------------------------------- arrows
on('dir-mode', (value) => setGraphOptions(graph('gp-arrows'), { direction: value === 'arrows' ? 'arrows' : null }));
on('dir-pick', (value) => graphSelect(graph('gp-arrows'), value === 'none' ? [] : [value]));

// ---------------------------------------------------------------- zoom-pan
on('zoom-mode', (value) => setGraphOptions(graph('gp-zoom'), { zoom: value === 'on' }));
on('zoom-act', (value) => graphZoom(graph('gp-zoom'), /** @type {'in' | 'out' | 'reset'} */ (value)));

// ---------------------------------------------------------------- detail-slot
let pageFills = true;
on('det-mode', (value) => setGraphOptions(graph('gp-detail'), { detail: value === 'on' }));
on('det-fill', (value) => {
    pageFills = value === 'page';
    // The panel that is open is drawn again with the other filling.
    const open = graph('gp-detail').querySelector('.kp-graph__detail:not([hidden])') ? graph('gp-detail').dataset.kpDetailOf : undefined;
    if (open) {
        graphDetail(graph('gp-detail'), null);
        graphDetail(graph('gp-detail'), open);
    }
});
on('det-open', (value) => graphDetail(graph('gp-detail'), value === 'none' ? null : value));
// The page fills the panel through the graph's own event: the stack, what it calls and what calls it, and a button of the page's own.
graph('gp-detail').addEventListener(GRAPH_DETAIL_EVENT, (event) => {
    const { id, node, slot, host } = /** @type {CustomEvent<import('../../js/graph.js').GraphDetailInfo>} */ (event).detail;
    host.dataset.kpDetailOf = id;
    if (!pageFills) return;
    const data = network(SHAPES['gp-detail'] ?? {});
    const name = (/** @type {string} */ stack) => data.nodes.find((n) => n.id === stack)?.label ?? stack;
    const calls = data.edges.filter((e) => e.from === id).map((e) => name(e.to));
    const calledBy = data.edges.filter((e) => e.to === id).map((e) => name(e.from));
    const doc = slot.ownerDocument;
    const list = doc.createElement('dl');
    list.className = 'pg-facts';
    for (const [term, value] of [
        ['What it is', node.description],
        ['Talks to', calls.length ? calls.join(', ') : 'nothing'],
        ['Used by', calledBy.length ? calledBy.join(', ') : 'nothing'],
    ]) {
        const dt = doc.createElement('dt');
        dt.textContent = term ?? '';
        const dd = doc.createElement('dd');
        dd.textContent = value ?? '';
        list.append(dt, dd);
    }
    const open = doc.createElement('button');
    open.type = 'button';
    open.className = 'kp-button kp-button--sm';
    open.textContent = `Open ${node.label}`;
    slot.append(list, open);
});

// ---------------------------------------------------------------- own-radius
on('rad-ring', (value) => setGraphOptions(graph('gp-radius'), { ring: value === 'default' ? null : Number(value) }));
on('rad-node', (value) => setGraphOptions(graph('gp-radius'), { node: value === 'default' ? null : Number(value) }));
on('rad-size', (value) => draw('gp-radius', { traffic: value === 'traffic' }));

// ---------------------------------------------------------------- states
const EVERY = { labels: /** @type {const} */ ('below'), chrome: /** @type {const} */ ('inside'), colour: /** @type {const} */ ('fixed'), direction: /** @type {const} */ ('arrows'), zoom: true, detail: true };
const NONE = { labels: null, chrome: null, colour: null, direction: null, zoom: false, detail: false };
on('st-state', (value) => {
    const el = graph('gp-states');
    if (value === 'loading') setGraphState(el, 'loading', 'Reading the map…');
    else if (value === 'empty') setGraphState(el, 'empty', 'No stacks yet', { text: 'Create a stack and it appears here, with what it talks to.' });
    else if (value === 'error') setGraphState(el, 'error', 'The map could not be read', { text: 'The host did not answer in time. Nothing was changed.' });
    else draw('gp-states');
});
on('st-opts', (value) => setGraphOptions(graph('gp-states'), value === 'all' ? EVERY : NONE));
graph('gp-states').addEventListener(GRAPH_RETRY_EVENT, () => {
    draw('gp-states');
    for (const button of document.querySelectorAll('button[data-pg="st-state"]')) button.setAttribute('aria-pressed', String(/** @type {HTMLElement} */ (button).dataset.value === 'ready'));
});

// ---------------------------------------------------------------- first draw
ready.then(() => {
    setGraphOptions(graph('gp-states'), EVERY);
    for (const id of ['gp-labels', 'gp-chrome', 'gp-colour', 'gp-arrows', 'gp-zoom', 'gp-detail', 'gp-radius', 'gp-states']) draw(id);
});
