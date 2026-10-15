// The demo of research/kpadopt-graph: the admin dashboard's Map, drawn by the dashboard's own code
// (dash-map.js: a verbatim copy) and by kp-graph, side by side per theme.
//
// MOCK: the data (a made-up fleet), the adapters (what the dashboard would write to hand its topology to kp-graph),
// the try-buttons. REAL: kp-graph (js/graph.js) and the dashboard's drawing code.

import { attachGraphs, graphHideKind, graphSelect, setGraphData, setGraphState } from '../../js/graph.js';
import { mapGraph } from './dash-map.js';

// ---------------------------------------------------------------- the fleet

/** @type {[string, number, string, string, boolean | undefined, boolean | undefined][]} */
const STACKS = [
    // name, vmid, ip, kind, live_enforced, live_matches_repo
    ['traefik-edge', 101, '10.10.5.11', 'gateway', true, true],
    ['almanac', 112, '10.10.5.12', 'docker', true, true],
    ['kyu-hub', 109, '10.10.5.13', 'native', true, false],
    ['jellyfin', 106, '10.10.5.14', 'docker', true, true],
    ['arr-suite', 107, '10.10.5.15', 'docker', true, true],
    ['grafana', 113, '10.10.5.16', 'docker', false, true],
    ['loki', 114, '10.10.5.17', 'docker', true, true],
    ['prometheus', 115, '10.10.5.18', 'docker', false, false],
    ['paperless', 116, '10.10.5.19', 'docker', undefined, undefined],
    ['nextcloud', 117, '10.10.5.20', 'docker', true, true],
    ['backup-runner', 118, '10.10.5.21', 'native', true, true],
    ['dns-resolver', 119, '10.10.5.22', 'native', true, true],
];
const LONG = ['photo-library-replica-west', 120, '10.10.5.23', 'docker', true, true];

/** @param {boolean} long */
function fleet(long) {
    const rows = long ? [...STACKS, LONG] : STACKS;
    const nodes = rows.map(([stack, vmid, ip, kind, live_enforced, live_matches_repo]) => ({
        stack,
        vmid,
        ip,
        kind,
        live_enforced,
        live_matches_repo,
    }));
    nodes.push({ stack: '10.10.1.20', vmid: 0, ip: '10.10.1.20', kind: 'external', live_enforced: undefined, live_matches_repo: undefined });
    nodes.push({ stack: '10.10.5.250', vmid: 0, ip: '10.10.5.250', kind: 'external', live_enforced: undefined, live_matches_repo: undefined });
    /** @type {[string, string, string, string[]][]} */
    const edges = [
        ['traefik-edge', 'jellyfin', 'route', ['jellyfin.home']],
        ['traefik-edge', 'arr-suite', 'route', ['arr.home']],
        ['traefik-edge', 'grafana', 'route', ['grafana.home']],
        ['traefik-edge', 'nextcloud', 'route', ['cloud.home']],
        ['traefik-edge', 'paperless', 'route', ['paper.home']],
        ['grafana', 'prometheus', 'declared', ['tcp 9090']],
        ['grafana', 'loki', 'declared', ['tcp 3100']],
        ['prometheus', 'kyu-hub', 'declared', ['tcp 9100']],
        ['prometheus', 'kyu-hub', 'named', ['10.10.5.13:9100']],
        ['almanac', 'kyu-hub', 'declared', ['tcp 8080']],
        ['kyu-hub', 'almanac', 'declared', ['tcp 8081']],
        ['arr-suite', 'jellyfin', 'declared', ['tcp 8096']],
        ['paperless', 'nextcloud', 'planned', ['tcp 443']],
        ['backup-runner', 'jellyfin', 'open', ['any']],
        ['backup-runner', 'nextcloud', 'open', ['any']],
        ['backup-runner', 'paperless', 'open', ['any']],
        ['almanac', '10.10.1.20', 'named', ['10.10.1.20:8123']],
        ['kyu-hub', '10.10.1.20', 'named', ['10.10.1.20:8123']],
        ['prometheus', '10.10.5.250', 'named', ['10.10.5.250:8006']],
        ['backup-runner', '10.10.5.250', 'named', ['10.10.5.250:8006']],
        ['dns-resolver', 'traefik-edge', 'declared', ['udp 53']],
        ['loki', 'dns-resolver', 'declared', ['udp 53']],
    ];
    if (long) {
        edges.push(
            ['photo-library-replica-west', 'nextcloud', 'declared', ['tcp 443']],
            ['traefik-edge', 'photo-library-replica-west', 'route', ['photos.home']],
        );
    }
    return { nodes, edges: edges.map(([from, to, kind, detail]) => ({ from, to, kind, detail })) };
}

/** Bytes per second per stack, as the dashboard's trafficByStack hands them over. @param {boolean} long */
function trafficOf(long) {
    const t = new Map([
        ['traefik-edge', 4_200_000],
        ['jellyfin', 2_900_000],
        ['nextcloud', 1_300_000],
        ['arr-suite', 640_000],
        ['grafana', 120_000],
        ['loki', 410_000],
        ['prometheus', 95_000],
        ['kyu-hub', 18_000],
        ['almanac', 6_000],
        ['paperless', 2_000],
        ['backup-runner', 880_000],
    ]);
    if (long) t.set('photo-library-replica-west', 520_000);
    return t;
}

// ---------------------------------------------------------------- the adapters (mock): dashboard topology -> kp-graph

/** The Map's kinds of connection, in its legend order, as mapview.js EDGE_KINDS words them, with the Map's colours and dashes. */
const MAP_KINDS = [
    {
        kind: 'declared',
        label: 'declared, firewall enforced',
        hint: "A connection a stack's firewall rules allow, and the host enforces",
        style: 'solid',
        colour: 'var(--chart-3)',
    },
    {
        kind: 'planned',
        label: 'declared, firewall not on yet',
        hint: 'A connection a stack declares, on a stack whose firewall is not switched on',
        style: 'dash',
        colour: 'var(--muted-foreground)',
    },
    {
        kind: 'open',
        label: 'target has no firewall (open)',
        hint: 'Anything may connect: the target stack has no firewall',
        style: 'dash',
        dash: '5 4',
        colour: 'var(--mk-warn)',
    },
    {
        kind: 'named',
        label: 'address named in a stack file',
        hint: "An address a stack's own files name, outside any firewall rule",
        style: 'dot',
        dash: '2 4',
        bent: true,
        colour: 'var(--chart-2)',
    },
    {
        kind: 'route',
        label: 'gateway route to a backend',
        hint: 'The gateway forwards a hostname to this stack',
        style: 'solid',
        colour: 'var(--chart-1)',
    },
];

/**
 * @param {ReturnType<typeof fleet>} topo
 * @param {Map<string, number> | null} traffic
 */
function toGraph(topo, traffic) {
    const max = traffic ? Math.max(1, ...traffic.values()) : 1;
    const gateway = topo.nodes.find((n) => n.kind === 'gateway');
    return {
        ...(gateway ? { hub: gateway.stack } : {}),
        nodes: topo.nodes.map((n) => {
            const outside = n.kind === 'external';
            const live = n.live_enforced;
            return {
                id: n.stack,
                label: n.stack,
                description: outside ? 'an address outside the fleet' : `vmid ${n.vmid}, ${n.ip}`,
                external: outside,
                weight: traffic && !outside ? (traffic.get(n.stack) ?? 0) / max : null,
                flag: live != null && n.live_matches_repo === false ? 'mismatch' : null,
            };
        }),
        edges: topo.edges.map((e) => ({ from: e.from, to: e.to, kind: e.kind, detail: e.detail.join(', ') || e.kind })),
        kinds: MAP_KINDS,
    };
}

// ---------------------------------------------------------------- mounting

const HINT_MAP = 'Hover a stack to see only its connections\nClick a stack to add it to the selection, click again to remove it\nEsc shows all';

/** @param {string} tag @param {string} [cls] @param {string} [text] */
const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
};

/** A kp-graph figure with the given attributes, attached at once (before the page-wide attach could meet it with default words). */
function kpFigure(host, label, attrs, strings) {
    const fig = /** @type {HTMLElement} */ (el('figure', 'kp-graph'));
    fig.setAttribute('aria-label', label);
    for (const [k, v] of Object.entries(attrs)) fig.setAttribute(k, v);
    fig.setAttribute('data-kp-graph', '');
    host.append(fig);
    attachGraphs(fig, strings ? { strings } : {});
    return fig;
}

/** The dashboard's Map graph and its page-level kinds row, as fleetview.js builds them. */
function dashMap(host, topo, traffic) {
    host.replaceChildren();
    const kinds = MAP_KINDS.filter((k) => topo.edges.some((e) => e.kind === k.kind));
    const graph = mapGraph(topo, { traffic, onChange: () => {} });
    const legend = el('div', 'mp-kinds');
    legend.setAttribute('role', 'group');
    legend.setAttribute('aria-label', 'Connection kinds: click to hide or show');
    for (const k of kinds) {
        const b = /** @type {HTMLButtonElement} */ (el('button', 'mp-kind'));
        b.type = 'button';
        b.dataset.kind = k.kind;
        b.setAttribute('aria-pressed', 'true');
        b.title = `${k.hint}; click to hide or show these lines`;
        const line = el('i', `mp-kind__line mp-kind__line--${k.kind}`);
        line.setAttribute('aria-hidden', 'true');
        b.append(line, k.label);
        b.addEventListener('click', () => {
            const hide = b.getAttribute('aria-pressed') === 'true';
            b.setAttribute('aria-pressed', String(!hide));
            graph.hideKind(k.kind, hide);
        });
        legend.append(b);
    }
    graph.onKindsReset(() => {
        for (const b of legend.querySelectorAll('button')) b.setAttribute('aria-pressed', 'true');
    });
    const legends = el('div', 'mp-legends');
    legends.append(legend);
    host.append(legends, graph.el);
    graph.draw();
    return graph;
}

// ---------------------------------------------------------------- one pair of columns

/**
 * Two columns: the dashboard's picture and kp's. `state` carries what the try-buttons change.
 * @param {HTMLElement} section
 */
function mapPair(section) {
    const state = { long: false, traffic: false };
    const left = /** @type {HTMLElement} */ (section.querySelector('[data-col="dash"] [data-col-body]'));
    const right = /** @type {HTMLElement} */ (section.querySelector('[data-col="kp"]'));
    /** @type {ReturnType<typeof mapGraph> | null} */
    let dash = null;
    /** @type {HTMLElement | null} */
    let kp = null;
    const render = () => {
        const topo = fleet(state.long);
        const traffic = state.traffic ? trafficOf(state.long) : null;
        dash?.stop();
        dash = dashMap(left, topo, traffic);
        const data = toGraph(topo, traffic);
        if (!kp) {
            kp = kpFigure(
                right,
                'The fleet, as the Map draws it',
                { 'data-kp-graph-colour': 'fixed', 'data-kp-graph-labels': 'under', 'data-kp-graph-chrome': 'inside' },
                { graphHint: HINT_MAP },
            );
            kp.classList.add('demo-kpmap');
        }
        setGraphData(kp, data);
    };
    render();
    /** @type {string | null} */
    let hovered = null;
    /** @param {string} id @param {boolean} on */
    const hover = (id, on) => {
        const d = left.querySelector(`.mp-node[data-stack="${id}"]`);
        const k = right.querySelector(`[data-kp-id="${id}"]`);
        if (on) {
            d?.dispatchEvent(new PointerEvent('pointerenter'));
            k?.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
        } else {
            d?.dispatchEvent(new PointerEvent('pointerleave'));
            k?.dispatchEvent(new PointerEvent('pointerout', { bubbles: true, relatedTarget: document.body }));
        }
    };
    /** @param {string} id */
    const click = (id) => {
        left.querySelector(`.mp-node[data-stack="${id}"]`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        right.querySelector(`[data-kp-id="${id}"]`)?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    };
    const reset = () => {
        if (hovered) hover(hovered, false);
        hovered = null;
        /** @type {HTMLButtonElement | null} */ (left.querySelector('.mp-graph__reset:not([hidden])'))?.click();
        if (kp) {
            graphSelect(kp, []);
            for (const b of kp.querySelectorAll('.kp-graph__kind[aria-pressed="false"]')) /** @type {HTMLElement} */ (b).click();
        }
        for (const b of section.querySelectorAll('[data-try][aria-pressed="true"]')) b.setAttribute('aria-pressed', 'false');
    };
    section.addEventListener('click', (event) => {
        const b = /** @type {HTMLElement | null} */ (event.target instanceof Element ? event.target.closest('[data-try]') : null);
        if (!b || !section.contains(b)) return;
        const what = b.dataset.try;
        const on = b.getAttribute('aria-pressed') !== 'true';
        if (what === 'reset') return reset();
        b.setAttribute('aria-pressed', String(on));
        if (what === 'hover') {
            if (hovered) hover(hovered, false);
            hovered = on ? 'kyu-hub' : null;
            if (hovered) hover(hovered, true);
        } else if (what === 'pick') {
            click('jellyfin');
            click('backup-runner');
        } else if (what === 'hide') {
            const d = /** @type {HTMLElement | null} */ (left.querySelector('.mp-kind[data-kind="open"]'));
            d?.click();
            if (kp) graphHideKind(kp, 'open', on);
        } else if (what === 'traffic') {
            state.traffic = on;
            render();
        } else if (what === 'long') {
            state.long = on;
            render();
        } else if (what === 'phone') {
            section.querySelector('.demo-pair')?.toggleAttribute('data-phone', on);
        } else if (what === 'frame') {
            kp?.toggleAttribute('data-demo-frame', on);
        }
    });
    section.addEventListener('review:choice', (event) => {
        const d = /** @type {CustomEvent} */ (event).detail;
        if (d?.id === 'frame') kp?.toggleAttribute('data-demo-frame', d.value === 'today');
    });
}

/** The states of the Map's kp graph: loading, nothing to draw, could not read (the dashboard draws these as page-level boxes). @param {HTMLElement} section */
function statesRow(section) {
    const host = /** @type {HTMLElement} */ (section.querySelector('[data-states]'));
    const states = /** @type {const} */ ([
        ['loading', 'Loading', undefined],
        ['empty', 'Nothing to draw', 'No stacks with a working copy to draw yet.'],
        ['error', 'Could not read', 'Could not read the topology: the host did not answer.'],
    ]);
    for (const [state, title, words] of states) {
        const cell = el('div', 'demo-cell');
        cell.append(el('h4', 'demo-cell__title', title));
        const fig = kpFigure(
            cell,
            `The fleet (${title.toLowerCase()})`,
            { 'data-kp-graph-colour': 'fixed', 'data-kp-graph-labels': 'under', 'data-kp-graph-chrome': 'inside' },
            { graphHint: HINT_MAP },
        );
        fig.classList.add('demo-kpmap');
        setGraphState(fig, state, words);
        host.append(cell);
    }
    // A fourth: the same picture drawn, to see the loading one at the drawn one's height.
    const cell = el('div', 'demo-cell');
    cell.append(el('h4', 'demo-cell__title', 'Drawn (same height)'));
    const fig = kpFigure(
        cell,
        'The fleet',
        { 'data-kp-graph-colour': 'fixed', 'data-kp-graph-labels': 'under', 'data-kp-graph-chrome': 'inside' },
        { graphHint: HINT_MAP },
    );
    fig.classList.add('demo-kpmap');
    setGraphData(fig, toGraph(fleet(false), null));
    host.append(cell);
}

/** The package's graph with none of the new attributes: it must draw as it always did. @param {HTMLElement} section */
function defaultRow(section) {
    const host = /** @type {HTMLElement} */ (section.querySelector('[data-default]'));
    const fig = kpFigure(host, 'The fleet, with the package defaults', {});
    setGraphData(fig, toGraph(fleet(false), null));
}

// ---------------------------------------------------------------- the look-at text per theme

/** [scheme, the ground, the corners, the colour of --chart-3 (declared lines), of --chart-1 (route lines)] */
const THEMES = {
    formal: ['light', 'warm paper', 'small 6 px corners', 'olive green', 'navy'],
    light: ['light', 'white', '8 px corners', 'green', 'indigo'],
    dark: ['dark', 'near-black blue', 'square corners', 'magenta', 'cyan'],
    cyberpunk: ['dark', 'black with a violet cast', 'square corners', 'red-pink', 'yellow'],
    synthwave: ['dark', 'deep purple', '2 px corners', 'yellow', 'hot pink'],
    pastel: ['light', 'lilac-white', 'round 16 px corners', 'blue', 'pink'],
    terminal: ['dark', 'black-green', 'square corners', 'yellow-green', 'phosphor green'],
    forest: ['light', 'oat paper', '10 px corners', 'blue', 'forest green'],
    blueprint: ['dark', 'drafting blue', '2 px corners', 'sea green', 'cyan'],
    solstice: ['dark', 'warm charcoal', '10 px corners', 'amber', 'orange'],
    brutalism: ['light', 'pale yellow', 'square corners', 'violet', 'mustard'],
    deco: ['dark', 'lacquer blue-black', 'square corners', 'blue', 'gold'],
    phantom: ['dark', 'black', 'square corners', 'grey', 'red'],
    grotesk: ['light', 'white', 'square corners', 'grey', 'red'],
    nostromo: ['light', 'beige', '12 px corners', 'brown', 'rust'],
    titanium: ['dark', 'blue-grey metal', 'square corners', 'cyan', 'blue'],
};

/** @type {Record<string, (theme: string, f: string[]) => string>} */
const LOOK = {
    map: (t, [scheme, ground, corners, declared, route]) =>
        `In ${t} (${scheme}, ${ground}, ${corners}): the two columns must draw the same picture. Check, column against column: the same node positions; the node colours (they are the same in every theme: one fixed lightness and strength, not tinted by ${t}); every name centred under its node, whole, at every width; the declared lines in ${declared}, the route lines in ${route}, planned dashed grey, open dashed, named dotted; Show all in the top right corner of the picture and the three hint lines along its foot, inside the frame. Try Hover, Pick two, Hide open lines, Traffic sizes and Phone width. The frame (${corners} against today's 8 px with a soft glow) is the one thing meant to differ; tick which you want.`,
    states: (t, [scheme, ground]) =>
        `In ${t} (${scheme}, ${ground}): the four boxes are the same height, loading or not. Loading pulses a ghost of the last network (or a hub with six) in the node colour of the Map; nothing about the page jumps when it turns into the drawn picture. Nothing to draw and Could not read each say their sentence in the middle of the box, the second with a red dot.`,
    default: (t, [scheme, ground, corners]) =>
        `In ${t} (${scheme}, ${ground}, ${corners}): this graph has none of the new attributes and must look as the package's graph always did: node colours that follow ${t}'s first chart colour, labels beside the nodes pointing away from the hub and cut with an ellipsis where they would touch, Show all in the bar over the picture and the hint under it.`,
};

for (const section of document.querySelectorAll('[data-review-item]')) {
    const look = section.querySelector('[data-review-look]');
    const make = LOOK[/** @type {string} */ (section.getAttribute('data-look'))];
    if (!look || !make) continue;
    look.replaceChildren(
        ...Object.entries(THEMES).map(([theme, facts]) => {
            const p = document.createElement('p');
            p.setAttribute('data-for', theme);
            p.hidden = document.documentElement.getAttribute('data-theme') !== theme;
            p.textContent = make(theme, facts);
            return p;
        }),
    );
}

// The theme switcher of the page shows only the current theme's look-at line.
const showLooks = () => {
    const now = document.documentElement.getAttribute('data-theme');
    for (const p of document.querySelectorAll('[data-review-look] [data-for]'))
        /** @type {HTMLElement} */ (p).hidden = p.getAttribute('data-for') !== now;
};
new MutationObserver(showLooks).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

const map = document.querySelector('[data-review-item="map"]');
if (map) mapPair(/** @type {HTMLElement} */ (map));
const states = document.querySelector('[data-review-item="states"]');
if (states) statesRow(/** @type {HTMLElement} */ (states));
const def = document.querySelector('[data-review-item="default"]');
if (def) defaultRow(/** @type {HTMLElement} */ (def));
