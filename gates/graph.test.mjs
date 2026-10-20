// The network graph's pure halves [scope-143, port2-6].
//
// The homelab port spec's acceptance checks I.2.7 1 and 2, and the rule
// that shortens a label: which node is the hub, the ring's order (A→Z,
// then the outside nodes), where each node sits (the hub in the middle,
// the first ring node at the top, the rest clockwise), the bends of edges
// that share two nodes (0, then ±26), and labels that never touch or leave
// the box, the longer of two losing a letter at a time. The browser halves
// (hover, keys, a live update, fifteen long names at phone width) are in
// tests/graph.spec.mjs.
//
// Run: node --test gates/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fitGraphLabels, graphArrow, graphBends, graphLabelText, graphLayout, graphOptionsOf, graphRoom, hubOf, ringOf } from '../js/graph.js';

/** @param {string} id @param {string} label @param {object} [more] */
const node = (id, label, more = {}) => ({ id, label, description: label, ...more });

// A text measurer for the label tests: 6 px a letter, 12 px tall, the box
// anchored at the label's start or its middle, as `text-anchor` would draw it.
/** @param {{ full: string, length: number, x: number, y: number, anchor: 'start' | 'middle' }} label */
const measure = (label) => {
    const width = graphLabelText(label.full, label.length).length * 6;
    return { x: label.anchor === 'middle' ? label.x - width / 2 : label.x, y: label.y - 12, width, height: 12 };
};
/** @param {{ x: number, y: number, width: number, height: number }} a @param {{ x: number, y: number, width: number, height: number }} b */
const touch = (a, b) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

/** A hub, four sites given out of order, and two outside nodes. */
const NETWORK = {
    nodes: [
        node('centre', 'Control centre'),
        node('ph3', 'Pump house 3'),
        node('weather', 'Weather service', { external: true }),
        node('north', 'Reservoir North'),
        node('ph1', 'Pump house 1'),
        node('energy', 'Energy supplier', { external: true }),
        node('plant', 'Treatment plant'),
    ],
    edges: [
        { from: 'ph1', to: 'centre', kind: 'telemetry' },
        { from: 'ph3', to: 'centre', kind: 'telemetry' },
        { from: 'north', to: 'centre', kind: 'telemetry' },
        { from: 'plant', to: 'centre', kind: 'telemetry' },
        { from: 'weather', to: 'centre', kind: 'telemetry' },
    ],
    kinds: [],
    hub: 'centre',
};

test('the hub, the ring order and the layout: hub in the middle, A→Z then the outside nodes from the top clockwise, a narrower ellipse under 600 px (I.2.7 1) [scope-143]', () => {
    {
        assert.equal(hubOf(NETWORK), 'centre');
        // Named but absent: the most links decide.
        assert.equal(hubOf({ ...NETWORK, hub: 'gone' }), 'centre');
        const { hub, ...unnamed } = NETWORK;
        assert.equal(hub, 'centre');
        assert.equal(hubOf(unnamed), 'centre');
        // A tie goes to the first in the given order; no links at all, the first node.
        const tie = { nodes: [node('a', 'A'), node('b', 'B')], edges: [{ from: 'a', to: 'b', kind: 'x' }], kinds: [] };
        assert.equal(hubOf(tie), 'a');
        assert.equal(hubOf({ nodes: [node('z', 'Z'), node('y', 'Y')], edges: [], kinds: [] }), 'z');
        assert.equal(hubOf({ nodes: [], edges: [], kinds: [] }), null);
    }
    {
        assert.deepEqual(
            ringOf(NETWORK, 'centre').map((n) => n.id),
            ['ph1', 'ph3', 'north', 'plant', 'energy', 'weather'],
        );
        // Without a hub every node is on the ring.
        assert.equal(ringOf(NETWORK, null).length, NETWORK.nodes.length);
        // Two nodes of one label keep a fixed order, by id.
        const twins = { nodes: [node('b', 'Same'), node('a', 'Same')], edges: [], kinds: [] };
        assert.deepEqual(
            ringOf(twins, null).map((n) => n.id),
            ['a', 'b'],
        );
    }
    {
        const W = 1000;
        const H = 560;
        const at = graphLayout(NETWORK, W, H);
        const cx = W / 2;
        const cy = H / 2 - 10;
        assert.deepEqual(at.get('centre'), { x: cx, y: cy, angle: Math.PI / 2 });
        const ring = ringOf(NETWORK, 'centre').map((n) => /** @type {{ x: number, y: number, angle: number }} */ (at.get(n.id)));
        // The first at the top, straight over the hub.
        assert.ok(Math.abs(ring[0].x - cx) < 1e-9);
        assert.ok(ring[0].y < cy);
        // Clockwise on screen: the angle grows by an even step, and the second
        // node lies to the right of the first.
        const step = (Math.PI * 2) / ring.length;
        ring.forEach((p, i) => assert.ok(Math.abs(p.angle - (-Math.PI / 2 + i * step)) < 1e-9, `node ${i} at angle ${p.angle}`));
        assert.ok(ring[1].x > ring[0].x);
        // A wide box stretches the ellipse sideways: rx = 1.35 × ry.
        const R = Math.min(W, H) * 0.36;
        assert.ok(Math.abs(cy - ring[0].y - R) < 1e-9);
        const right = ring.reduce((a, b) => (b.x > a.x ? b : a));
        assert.ok(right.x - cx <= R * 1.35 + 1e-9 && right.x - cx > R);
    }
    {
        const W = 360;
        const H = 480;
        const at = graphLayout(NETWORK, W, H);
        const cx = W / 2;
        const cy = H / 2 - 10;
        const ring = ringOf(NETWORK, 'centre').map((n) => /** @type {{ x: number, y: number }} */ (at.get(n.id)));
        for (const p of ring) {
            assert.ok(Math.abs(p.x - cx) <= W * 0.24 + 1e-9, 'no wider than a quarter of the box each side');
            assert.ok(Math.abs(p.y - cy) <= H * 0.36 + 1e-9);
        }
        assert.ok(Math.abs(cy - ring[0].y - H * 0.36) < 1e-9, 'as tall as 0.36 of the box');
    }
});

test('edges between the same two nodes bend 0, +26, −26, +52 (I.2.7 2) [scope-143]', () => {
    {
        const e = (/** @type {string} */ from, /** @type {string} */ to) => ({ from, to, kind: 'k' });
        assert.deepEqual(graphBends([e('a', 'b'), e('a', 'b'), e('a', 'b'), e('a', 'b')]), [0, 26, -26, 52]);
        // One pair each: no bend.
        assert.deepEqual(graphBends([e('a', 'b'), e('b', 'c'), e('c', 'a')]), [0, 0, 0]);
        // Drawn the other way round, the same side in space: the sign follows the direction.
        assert.deepEqual(graphBends([e('a', 'b'), e('b', 'a')]), [0, -26]);
        // The research network: control and planned on one pair, beside telemetry.
        assert.deepEqual(graphBends([e('n2', 'hub'), e('hub', 'n2'), e('hub', 'n2')]), [0, 26, -26]);
    }
});

test('labels are shortened with an ellipsis until none leaves the box and no two touch, never below one letter (I.2.7 5) [scope-143]', () => {
    {
        assert.equal(graphLabelText('Pump house 3', 12), 'Pump house 3');
        assert.equal(graphLabelText('Pump house 3', 40), 'Pump house 3');
        assert.equal(graphLabelText('Pump house 3', 6), 'Pump h…');
        // A cut at a space does not leave the space before the ellipsis.
        assert.equal(graphLabelText('Pump house 3', 5), 'Pump…');
    }
    {
        const W = 300;
        const H = 200;
        const labels = [
            // Runs past the right edge.
            { full: 'Pumping station by the harbour', length: 30, x: 200, y: 50, anchor: /** @type {const} */ ('start') },
            // Two side by side on one line: the longer loses letters first.
            { full: 'Reservoir North-East high zone', length: 30, x: 10, y: 120, anchor: /** @type {const} */ ('start') },
            { full: 'Booster site B', length: 14, x: 150, y: 120, anchor: /** @type {const} */ ('start') },
            // Far from everything: untouched.
            { full: 'Booster site C', length: 14, x: 150, y: 180, anchor: /** @type {const} */ ('middle') },
        ];
        fitGraphLabels(labels, W, H, measure);
        const boxes = labels.map(measure);
        for (const b of boxes) {
            assert.ok(b.x >= 4 && b.x + b.width <= W - 4, `inside the box sideways: ${JSON.stringify(b)}`);
            assert.ok(b.y >= 4 && b.y + b.height <= H - 4, `inside the box up and down: ${JSON.stringify(b)}`);
        }
        for (let i = 0; i < boxes.length; i += 1)
            for (let j = i + 1; j < boxes.length; j += 1) assert.ok(!touch(boxes[i], boxes[j]), `${i} and ${j} touch`);
        assert.ok(labels[0].length < 30, 'the label past the edge was shortened');
        assert.ok(labels[1].length < 30, 'the longer of the two was shortened');
        assert.equal(labels[2].length, 14, 'the shorter of the two keeps its whole name');
        assert.equal(labels[3].length, 14, 'a label with room keeps its whole name');
    }
    {
        const labels = [
            { full: 'Alpha', length: 5, x: 10, y: 20, anchor: /** @type {const} */ ('start') },
            { full: 'Beta', length: 4, x: 10, y: 20, anchor: /** @type {const} */ ('start') },
        ];
        fitGraphLabels(labels, 40, 40, measure);
        for (const l of labels) assert.ok(l.length >= 1);
    }
});

// The options [graph-1020]: every one is off, and a graph that sets none draws exactly what was approved.
const STACKS = {
    nodes: ['productivity', 'downloader', 'syncthing', 'traefik', 'vaultwarden', 'media', 'homeassistant-long-name'].map((l) => node(l, l)),
    edges: ['downloader', 'syncthing', 'traefik', 'vaultwarden', 'media', 'homeassistant-long-name'].map((to) => ({ from: 'productivity', to, kind: 'proxy' })),
    kinds: [],
    hub: 'productivity',
};
const wide = (/** @type {{ label: string }} */ n) => n.label.length * 7 + 6;
/** @param {Map<string, { x: number, y: number }>} m @param {string} id */
const pos = (m, id) => /** @type {{ x: number, y: number }} */ (m.get(id));

test('graphOptionsOf: no attribute is the approved look, and a bad number is no number', () => {
    /** @type {Map<string, string>} */
    const attrs = new Map();
    const host = /** @type {Element} */ (/** @type {unknown} */ ({ getAttribute: (/** @type {string} */ n) => attrs.get(n) ?? null, hasAttribute: (/** @type {string} */ n) => attrs.has(n) }));
    assert.deepEqual(graphOptionsOf(host), { labels: 'beside', chrome: 'outside', colour: 'theme', direction: 'none', zoom: false, detail: false, ring: null, node: null });
    attrs.set('data-kp-labels', 'below').set('data-kp-zoom', '').set('data-kp-detail', 'off').set('data-kp-ring-radius', '9').set('data-kp-node-radius', 'abc');
    const o = graphOptionsOf(host);
    assert.equal(o.labels, 'below');
    assert.equal(o.zoom, true, 'a bare attribute is on');
    assert.equal(o.detail, false, '"off" is off');
    assert.equal(o.ring, 0.48, 'a ring past the box is held at its largest');
    assert.equal(o.node, null, 'text is no radius');
});

test('graphLayout: with no options it is the layout that was approved; a ring share and an inset move it', () => {
    const plain = graphLayout(STACKS, 1000, 500);
    const same = graphLayout(STACKS, 1000, 500, {});
    for (const [id, p] of plain) assert.deepEqual(same.get(id), p);
    const hub = pos(plain, 'productivity');
    assert.deepEqual([hub.x, hub.y], [500, 240], 'the hub in the middle, 10 px up');
    const small = graphLayout(STACKS, 1000, 500, { ring: 0.2 });
    assert.ok(Math.abs(pos(small, 'downloader').y - 240) < Math.abs(pos(plain, 'downloader').y - 240), 'a smaller ring share is a smaller ring');
    const inset = graphLayout(STACKS, 1000, 500, { inset: { top: 44, bottom: 34 } });
    assert.ok(pos(inset, 'productivity').y > hub.y, 'the centre moves down with a strip kept clear at the top');
});

test('graphRoom: names stand whole inside the box, none touches another, and a narrow box grows taller', () => {
    for (const W of [1200, 800, 390]) {
        const { at, H } = graphRoom(STACKS, W, 480, wide, { inset: { top: 44, bottom: 34 } });
        const boxes = STACKS.nodes.map((n) => {
            const p = pos(at, n.id);
            const w = wide(n);
            return { x: p.x - w / 2, y: p.y + 18, width: w, height: 18 };
        });
        for (const b of boxes) assert.ok(b.x >= 8 && b.x + b.width <= W - 8, `at ${W}: a whole name lies inside the box sideways (${b.x}, ${b.width})`);
        for (let i = 0; i < boxes.length; i += 1) for (let j = i + 1; j < boxes.length; j += 1) assert.ok(!touch(boxes[i], boxes[j]), `at ${W}: ${i} and ${j} touch`);
        assert.ok(H >= 480, 'the box never shrinks');
    }
    const crowded = { ...STACKS, nodes: Array.from({ length: 16 }, (_, i) => node(`s${i}`, `stack-number-${i}`)), edges: [], hub: 's0' };
    assert.ok(graphRoom(crowded, 390, 480, wide).H > 480, 'sixteen long names on a phone need a taller picture');
});

test('graphArrow: the head stands short of the node and turns with the curve', () => {
    const d = graphArrow({ x: 0, y: 0 }, { x: 50, y: 0 }, { x: 100, y: 0 }, 20, 10);
    const [tip, ...rest] = (d.match(/-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?/g) ?? []).map((p) => p.split(',').map(Number));
    assert.ok(Math.abs(tip[0] - 80) < 0.1 && Math.abs(tip[1]) < 0.1, `the tip is 20 px from the end node: ${tip}`);
    assert.ok(rest.every(([x]) => Math.abs(x - 70) < 0.1), 'the base is 10 px back along a straight link');
    const bent = graphArrow({ x: 0, y: 0 }, { x: 50, y: 60 }, { x: 100, y: 0 }, 20, 10);
    assert.notEqual(bent, d, 'a bent link turns its head');
});
