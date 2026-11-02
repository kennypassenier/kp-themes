// @ts-nocheck: the fakes below stand in for DOM classes and carry only the members the code under test touches.
// Guards for the overlay review findings #1, #5 and #7 [ovfix-1102]. Fake elements, no browser.
//
// Run: node --test gates/ovfix-overlays.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { showLayer } from '../js/overlays/tooltip-layer.js';
import { arriveBudget } from '../js/motion/arrive-cap.js';
import { raiseOverlay } from '../js/top-layer/raise.js';

/** A tooltip that is a promoted popover whose showPopover() is refused (it left the document between the timer and now). */
function refusedTooltip() {
    const attrs = new Map([['popover', 'manual'], ['data-kp-tooltip-layer', 'top']]);
    return {
        hidden: false,
        attrs,
        hasAttribute: (name) => attrs.has(name),
        removeAttribute: (name) => attrs.delete(name),
        matches: () => false,
        showPopover() {
            throw new DOMException('not connected', 'InvalidStateError');
        },
    };
}

test('#1 a tooltip the top layer refuses is hidden, so it cannot stay on screen', () => {
    const tooltip = refusedTooltip();
    const warn = console.warn;
    console.warn = () => {};
    try {
        assert.equal(showLayer(tooltip), false);
    } finally {
        console.warn = warn;
    }
    assert.equal(tooltip.hidden, true);
    // Still a promoted popover: the next hover tries the top layer again.
    assert.equal(tooltip.hasAttribute('popover'), true);
});

/** @param {boolean} [isConnected] */
const node = (isConnected = true) => ({ isConnected, closest: () => null });

test('#5 an arrival is spent only on a connected node', () => {
    const may = arriveBudget(2);
    for (let i = 0; i < 5; i++) assert.equal(may(node(false)), false);
    assert.equal(may(node()), true);
    assert.equal(may(node()), true);
    assert.equal(may(node()), false);
});

test('#5 an element asked twice in one batch is counted once and arrives once', () => {
    const may = arriveBudget(2);
    const twice = node();
    assert.equal(may(twice), true);
    assert.equal(may(twice), false);
    assert.equal(may(node()), true);
    assert.equal(may(node()), false);
});

/** Fakes for what raiseOverlay() touches. */
function raiseWorld() {
    const listeners = [];
    const observers = [];
    globalThis.window = {
        addEventListener: (type) => listeners.push(type),
        removeEventListener: (type) => listeners.splice(listeners.indexOf(type), 1),
    };
    globalThis.ResizeObserver = class {
        constructor(callback) {
            this.callback = callback;
            this.live = true;
            observers.push(this);
        }
        observe() {}
        disconnect() {
            this.live = false;
        }
    };
    const attrs = new Map();
    let open = false;
    const element = {
        isConnected: true,
        hidden: false,
        style: { removeProperty() {} },
        dataset: {},
        hasAttribute: (name) => attrs.has(name),
        setAttribute: (name, value) => attrs.set(name, value),
        removeAttribute: (name) => attrs.delete(name),
        matches: () => open,
        showPopover: () => (open = true),
        hidePopover: () => (open = false),
        addEventListener() {},
        removeEventListener() {},
        isOpen: () => open,
    };
    return { element, listeners, observers };
}

test('#7 a menu is lowered, with its listeners and observer released, when its button disconnects', () => {
    const { element, listeners, observers } = raiseWorld();
    const anchor = { isConnected: true };
    raiseOverlay(element, () => {}, { anchor });
    assert.equal(element.isOpen(), true);
    assert.deepEqual(listeners.sort(), ['resize', 'scroll']);
    anchor.isConnected = false;
    observers[0].callback();
    assert.equal(element.isOpen(), false);
    assert.deepEqual(listeners, []);
    assert.equal(observers[0].live, false);
});
