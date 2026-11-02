// @ts-nocheck: the fakes below stand in for DOM classes and carry only the members the code under test touches.
// Guards for the wheel-follow review findings #3 and #4 [ovfix-1102]: a leader that arrives late or leaves, a once-listener
// that outlives its spin, and two auto starts for one outcome. A tiny fake document, no browser.
//
// Run: node --test gates/ovfix-wheel-follow.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';

class FakeEl {
    constructor(doc, attrs = {}) {
        this.doc = doc;
        this.ownerDocument = doc;
        this.attrs = new Map(Object.entries(attrs));
        this.listeners = new Map();
        this.parts = new Map();
        this.isConnected = true;
        this.style = {};
    }
    get id() {
        return this.attrs.get('id') ?? '';
    }
    set id(value) {
        this.attrs.set('id', value);
    }
    getAttribute(name) {
        return this.attrs.has(name) ? this.attrs.get(name) : null;
    }
    hasAttribute(name) {
        return this.attrs.has(name);
    }
    setAttribute(name, value) {
        this.attrs.set(name, String(value));
    }
    removeAttribute(name) {
        this.attrs.delete(name);
    }
    toggleAttribute(name, force) {
        if (force) this.attrs.set(name, '');
        else this.attrs.delete(name);
    }
    matches() {
        return true;
    }
    querySelector(selector) {
        if (!this.parts.has(selector)) this.parts.set(selector, new FakeEl(this.doc));
        return this.parts.get(selector);
    }
    addEventListener(type, handler) {
        this.on(type).add(handler);
    }
    removeEventListener(type, handler) {
        this.on(type).delete(handler);
    }
    on(type) {
        if (!this.listeners.has(type)) this.listeners.set(type, new Set());
        return this.listeners.get(type);
    }
    count(type) {
        return this.on(type).size;
    }
    dispatchEvent(event) {
        const seen = { type: event.type, detail: event.detail, target: this };
        for (const handler of [...this.on(event.type)]) handler(seen);
        if (this !== this.doc) for (const handler of [...this.doc.on(event.type)]) handler(seen);
    }
}

class FakeDoc extends FakeEl {
    constructor() {
        super(null);
        this.doc = this;
        this.ownerDocument = this;
        this.documentElement = new FakeEl(this);
        this.byId = new Map();
        this.observers = [];
    }
    getElementById(id) {
        const el = this.byId.get(id);
        return el?.isConnected ? el : null;
    }
    add(el) {
        el.isConnected = true;
        this.byId.set(el.id, el);
    }
    remove(el) {
        el.isConnected = false;
    }
    /** What the MutationObserver would hand the callback after a change. */
    flush(records) {
        for (const observer of this.observers) observer.callback(records);
    }
}

let starts = 0;
globalThis.HTMLElement = FakeEl;
globalThis.MutationObserver = class {
    constructor(callback) {
        this.callback = callback;
    }
    observe() {
        FakeDoc.current.observers.push(this);
    }
    disconnect() {
        FakeDoc.current.observers.splice(FakeDoc.current.observers.indexOf(this), 1);
    }
};

const { followLeader } = await import('../js/wheel/follow.js');
const { stateOf } = await import('../js/wheel/state.js');

/** @param {Record<string, string>} follower */
function world(follower = {}) {
    const doc = new FakeDoc();
    FakeDoc.current = doc;
    const f = new FakeEl(doc, { id: 'side', 'data-kp-wheel': '', 'data-kp-wheel-follows': 'main', ...follower });
    doc.add(f);
    const leader = new FakeEl(doc, { id: 'main', 'data-kp-wheel': '' });
    return { doc, f, leader, stop: undefined };
}
const quiet = (run) => {
    const warn = console.warn;
    console.warn = () => {};
    try {
        return run();
    } finally {
        console.warn = warn;
    }
};
const childList = (doc) => [{ type: 'childList', target: doc.documentElement, addedNodes: [], removedNodes: [] }];

test('#3 a leader that arrives after the follower, already standing on an outcome, unlocks it', () => {
    const w = world();
    quiet(() => followLeader(w.f));
    assert.equal(w.f.hasAttribute('data-kp-wheel-locked'), true);
    w.leader.setAttribute('data-kp-wheel-won', 'soup');
    w.doc.add(w.leader);
    w.doc.flush(childList(w.doc));
    assert.equal(w.f.hasAttribute('data-kp-wheel-locked'), false);
});

test('#3 a leader that is removed unlocks the follower, and a new one with that id locks it again', () => {
    const w = world();
    w.doc.add(w.leader);
    followLeader(w.f);
    w.leader.setAttribute('data-kp-wheel-won', 'soup');
    w.doc.flush([{ type: 'attributes', target: w.leader }]);
    assert.equal(w.f.hasAttribute('data-kp-wheel-locked'), false);
    w.leader.removeAttribute('data-kp-wheel-won');
    w.doc.flush([{ type: 'attributes', target: w.leader }]);
    assert.equal(w.f.hasAttribute('data-kp-wheel-locked'), true);
    w.doc.remove(w.leader);
    w.doc.flush(childList(w.doc));
    assert.equal(w.f.hasAttribute('data-kp-wheel-locked'), false);
    const next = new FakeEl(w.doc, { id: 'main', 'data-kp-wheel': '' });
    w.doc.add(next);
    w.doc.flush(childList(w.doc));
    assert.equal(w.f.hasAttribute('data-kp-wheel-locked'), true);
});

test('#4 a follower spinning when it locks leaves no result listener behind once it unlocks', () => {
    const w = world();
    w.doc.add(w.leader);
    w.leader.setAttribute('data-kp-wheel-won', 'soup');
    followLeader(w.f);
    stateOf(w.f).spinning = true;
    w.leader.removeAttribute('data-kp-wheel-won');
    w.doc.flush([{ type: 'attributes', target: w.leader }]);
    w.doc.flush([{ type: 'attributes', target: w.leader }]);
    assert.equal(w.f.hasAttribute('data-kp-wheel-locked'), true);
    assert.equal(w.f.count('kp-wheel-result'), 1, 'one pending clear, however often it locked');
    w.leader.setAttribute('data-kp-wheel-won', 'fish');
    w.doc.flush([{ type: 'attributes', target: w.leader }]);
    assert.equal(w.f.count('kp-wheel-result'), 0);
    stateOf(w.f).spinning = false;
});

test('#4 two results of the leader for the same item start an auto follower once', async () => {
    starts = 0;
    const w = world({ 'data-kp-wheel-follows-start': 'auto' });
    w.doc.add(w.leader);
    followLeader(w.f, { start: () => void starts++ });
    w.f.addEventListener('kp-wheel-leader-result', (e) => e.detail.waitUntil(Promise.resolve()));
    const settle = () => {
        w.leader.setAttribute('data-kp-wheel-won', 'soup');
        w.leader.dispatchEvent({ type: 'kp-wheel-result', detail: { item: { id: 'soup' }, index: 0, source: 'spin' } });
    };
    const spin = () => {
        w.leader.removeAttribute('data-kp-wheel-won');
        w.leader.dispatchEvent({ type: 'kp-wheel-spin', detail: {} });
    };
    settle();
    spin();
    settle();
    await new Promise((resolve) => setTimeout(resolve, 10));
    assert.equal(starts, 1);
});
